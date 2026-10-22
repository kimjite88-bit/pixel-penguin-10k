/**
 * Leaderboard storage for the UFO / CAR / BOAT boards.
 *
 * - DATABASE_URL set: PostgreSQL is the source of truth. Every worker process shares it and scores survive redeploys.
 *   The first boot against an empty board imports the bundled JSON file (prod scores merged in before deploy).
 * - REDIS_URL set: Redis caches each board's top 100 (dropped on every new best) and rate-limits score posts per IP
 *   across all workers. Any Redis failure falls through to PostgreSQL.
 * - Neither set (local dev): the original in-memory map persisted to bundle/*_leaderboard.json.
 *
 * Rules are unchanged: best score per edition only, ranking is score desc then edition asc.
 */
const fs = require('fs');
const path = require('path');

const GAMES = ['ufo', 'car', 'boat'];
const TOP_LIMIT = 100;
const CACHE_TTL_SEC = 30;
const POST_LIMIT_PER_MIN = 60;

// The 100 placeholder pilots the UFO board used to be seeded with before the public launch (#11 ~ #9999, 1,150 ~
// 3,600 PTS). They are no longer added; the list is kept only so their leftover rows can be recognised and removed.
const UFO_SEED_EDITIONS = [
  4441, 777, 1004, 195, 962, 6521, 499, 8888, 2026, 333,
  12, 15, 19, 24, 28, 31, 36, 42, 48, 20,
  33, 55, 77, 88, 100, 111, 123, 144, 168, 200,
  222, 250, 288, 300, 315, 365, 404, 444, 500, 512,
  555, 600, 666, 700, 720, 750, 800, 828, 888, 900,
  999, 1024, 1111, 1234, 1337, 1500, 1777, 1888, 2000, 2100,
  2222, 2468, 2500, 2777, 3000, 3141, 3333, 3500, 3777, 4000,
  4200, 4321, 4500, 4777, 4888, 5000, 5150, 5555, 5888, 6000,
  6174, 6292, 6666, 6888, 7000, 7272, 7500, 7777, 8000, 8080,
  8282, 8500, 8765, 9000, 9090, 9250, 9500, 9777, 9888, 9999,
];

function seedRows() {
  return UFO_SEED_EDITIONS.map((ed, i) => ({ edition: ed, score: 3600 - i * 24 + ((i * 11) % 19) }));
}

function normalizeGame(game) {
  return game === 'car' || game === 'boat' ? game : 'ufo';
}

function readBundleRows(file, parseTokenNumber) {
  try {
    if (!fs.existsSync(file)) return [];
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(raw)) return [];
    const best = new Map();
    for (const row of raw) {
      if (row.edition === null || row.edition === undefined || String(row.edition).trim() === '') continue;
      const ed = parseTokenNumber(row.edition);
      const score = Math.floor(Number(row.score));
      if (ed === null || !(score > 0)) continue;
      const prev = best.get(ed);
      if (!prev || score > prev.score) {
        best.set(ed, { edition: ed, score, updated_at: row.updated_at || new Date().toISOString() });
      }
    }
    return Array.from(best.values());
  } catch (e) {
    console.warn(`[Leaderboard] Could not read ${path.basename(file)}:`, e.message);
    return [];
  }
}

const byRank = (a, b) => b.score - a.score || a.edition - b.edition;

// ---------------------------------------------------------------------------------------------------------------
// Local dev backend: in-memory map, written back to the bundle file on every new best
// ---------------------------------------------------------------------------------------------------------------
function createFileStore({ dataDir, parseTokenNumber }) {
  const boards = {};
  for (const game of GAMES) {
    boards[game] = { map: new Map(), path: path.join(dataDir, `${game}_leaderboard.json`) };
  }

  function save(board) {
    try {
      const arr = Array.from(board.map.values()).sort((a, b) => b.score - a.score);
      fs.writeFileSync(board.path, JSON.stringify(arr.slice(0, 200), null, 2), 'utf8');
    } catch (e) {
      // Ignore read-only fs errors in container if any; memory map remains authoritative
    }
  }

  return {
    kind: 'file',
    async init() {
      for (const game of GAMES) {
        const board = boards[game];
        for (const row of readBundleRows(board.path, parseTokenNumber)) board.map.set(row.edition, row);
        save(board);
      }
    },
    async getTop(game) {
      const board = boards[normalizeGame(game)];
      return { total: board.map.size, rows: Array.from(board.map.values()).sort(byRank).slice(0, TOP_LIMIT), cache: 'none' };
    },
    async submit(game, ed, score) {
      const board = boards[normalizeGame(game)];
      const prev = board.map.get(ed);
      const isNewBest = !prev || score > prev.score;
      if (isNewBest) {
        board.map.set(ed, { edition: ed, score, updated_at: new Date().toISOString() });
        save(board);
      }
      const sorted = Array.from(board.map.values()).sort(byRank);
      return {
        isNewBest,
        best: board.map.get(ed).score,
        rank: sorted.findIndex((r) => r.edition === ed) + 1,
        total: board.map.size,
        top: { total: board.map.size, rows: sorted.slice(0, TOP_LIMIT) },
      };
    },
    async allowPost() {
      return true;
    },
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Production backend: PostgreSQL + optional Redis cache
// ---------------------------------------------------------------------------------------------------------------
function createSqlStore({ dataDir, parseTokenNumber, databaseUrl, redisUrl, poolSize }) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: databaseUrl,
    max: poolSize,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
  pool.on('error', (e) => console.warn('[Postgres] idle client error:', e.message));

  let redis = null;
  let redisLastError = null;
  if (redisUrl) {
    const { createClient } = require('redis');
    redis = createClient({
      url: redisUrl,
      socket: { connectTimeout: 3000, reconnectStrategy: (n) => Math.min(n * 200, 5000) },
    });
    let lastErr = 0;
    redis.on('error', (e) => {
      redisLastError = e.message;
      if (Date.now() - lastErr > 30000) console.warn('[Redis] error:', e.message);
      lastErr = Date.now();
    });
    redis.connect().catch(() => {});
  }
  const redisReady = () => redis && redis.isReady;
  const cacheKey = (game) => `ppeng:lb:v1:${game}`;

  async function queryTop(game) {
    const [rows, count] = await Promise.all([
      pool.query(
        'SELECT edition, score, updated_at FROM leaderboard_scores WHERE game = $1 ORDER BY score DESC, edition ASC LIMIT $2',
        [game, TOP_LIMIT]
      ),
      pool.query('SELECT count(*)::int AS n FROM leaderboard_scores WHERE game = $1', [game]),
    ]);
    return {
      total: count.rows[0].n,
      rows: rows.rows.map((r) => ({ edition: r.edition, score: r.score, updated_at: r.updated_at.toISOString() })),
    };
  }

  async function cacheTop(game, top) {
    if (!redisReady()) return;
    try {
      await redis.set(cacheKey(game), JSON.stringify(top), { EX: CACHE_TTL_SEC });
    } catch (e) {
      redisLastError = e.message; // cache only
    }
  }

  return {
    kind: redis ? 'postgres+redis' : 'postgres',
    status() {
      return { redis: redis ? (redis.isReady ? 'ready' : 'not ready') : 'off', redis_last_error: redisLastError };
    },
    // Runs once (cluster primary, or the single process) before any worker serves traffic
    async init() {
      let lastErr;
      for (let attempt = 1; attempt <= 10; attempt++) {
        try {
          await pool.query('SELECT 1');
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          console.warn(`[Postgres] connect attempt ${attempt} failed: ${e.message}`);
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
      if (lastErr) throw lastErr;

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // Blue/green deploys can boot two containers at once; only one imports
        await client.query('SELECT pg_advisory_xact_lock(4613)');
        await client.query(`CREATE TABLE IF NOT EXISTS leaderboard_scores (
          game text NOT NULL,
          edition integer NOT NULL CHECK (edition BETWEEN 0 AND 9999),
          score integer NOT NULL CHECK (score > 0),
          updated_at timestamptz NOT NULL DEFAULT now(),
          PRIMARY KEY (game, edition)
        )`);
        await client.query(
          'CREATE INDEX IF NOT EXISTS leaderboard_scores_rank ON leaderboard_scores (game, score DESC, edition)'
        );
        // One-time board reset: set LEADERBOARD_RESET_ID to a new value (e.g. launch-20261022) and redeploy. The
        // boards are emptied once per id (remembered in leaderboard_meta), so later restarts keep new scores.
        // Empty the bundle JSON files too, or the import below fills the boards straight back up.
        const resetId = String(process.env.LEADERBOARD_RESET_ID || '').trim();
        if (resetId) {
          await client.query('CREATE TABLE IF NOT EXISTS leaderboard_meta (key text PRIMARY KEY, value text NOT NULL)');
          const { rows: done } = await client.query("SELECT value FROM leaderboard_meta WHERE key = 'reset_id'");
          if (!done.length || done[0].value !== resetId) {
            const { rowCount } = await client.query('DELETE FROM leaderboard_scores');
            await client.query(
              "INSERT INTO leaderboard_meta (key, value) VALUES ('reset_id', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
              [resetId]
            );
            console.log(`[Leaderboard] Reset ${resetId}: removed ${rowCount} rows`);
          }
        }
        for (const game of GAMES) {
          const { rows } = await client.query('SELECT count(*)::int AS n FROM leaderboard_scores WHERE game = $1', [game]);
          if (rows[0].n > 0) continue;
          const imported = readBundleRows(path.join(dataDir, `${game}_leaderboard.json`), parseTokenNumber);
          if (!imported.length) continue;
          await client.query(
            `INSERT INTO leaderboard_scores (game, edition, score, updated_at)
             SELECT $1, e, s, u FROM unnest($2::int[], $3::int[], $4::timestamptz[]) AS t(e, s, u)
             ON CONFLICT DO NOTHING`,
            [game, imported.map((r) => r.edition), imported.map((r) => r.score), imported.map((r) => r.updated_at)]
          );
          console.log(`[Leaderboard] Imported ${imported.length} ${game} rows from the bundle into Postgres`);
        }
        // Public launch: boards start empty. Remove the placeholder pilots once (exact edition + score match, so a
        // real player on one of those editions with another score stays)
        await client.query('CREATE TABLE IF NOT EXISTS leaderboard_meta (key text PRIMARY KEY, value text NOT NULL)');
        const { rows: seedsGone } = await client.query("SELECT 1 FROM leaderboard_meta WHERE key = 'seeds_removed'");
        if (!seedsGone.length) {
          const seeds = seedRows();
          const { rowCount } = await client.query(
            `DELETE FROM leaderboard_scores l USING unnest($1::int[], $2::int[]) AS t(e, s)
             WHERE l.game = 'ufo' AND l.edition = t.e AND l.score = t.s`,
            [seeds.map((r) => r.edition), seeds.map((r) => r.score)]
          );
          await client.query("INSERT INTO leaderboard_meta (key, value) VALUES ('seeds_removed', now()::text)");
          console.log(`[Leaderboard] Removed ${rowCount} placeholder seed rows`);
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK').catch(() => {});
        throw e;
      } finally {
        client.release();
      }
      if (redisReady()) {
        await Promise.all(GAMES.map((g) => redis.del(cacheKey(g)).catch(() => {})));
      }
    },
    async getTop(game) {
      game = normalizeGame(game);
      if (redisReady()) {
        try {
          const hit = await redis.get(cacheKey(game));
          if (hit) return { ...JSON.parse(hit), cache: 'redis-hit' };
        } catch (e) {
          // fall through to Postgres
        }
      }
      const top = await queryTop(game);
      await cacheTop(game, top);
      return { ...top, cache: redis ? 'redis-miss' : 'none' };
    },
    async submit(game, ed, score) {
      game = normalizeGame(game);
      const up = await pool.query(
        `INSERT INTO leaderboard_scores (game, edition, score, updated_at) VALUES ($1, $2, $3, now())
         ON CONFLICT (game, edition) DO UPDATE SET score = EXCLUDED.score, updated_at = EXCLUDED.updated_at
         WHERE leaderboard_scores.score < EXCLUDED.score
         RETURNING score`,
        [game, ed, score]
      );
      const isNewBest = up.rowCount > 0;
      const { rows } = await pool.query(
        `SELECT me.score AS best,
                (SELECT count(*)::int FROM leaderboard_scores o
                  WHERE o.game = $1 AND (o.score > me.score OR (o.score = me.score AND o.edition < me.edition))) + 1 AS rank
           FROM leaderboard_scores me WHERE me.game = $1 AND me.edition = $2`,
        [game, ed]
      );
      // A new best rewrites the cached top 100 from Postgres so nobody reads the old board for CACHE_TTL_SEC
      let top;
      if (isNewBest) {
        top = await queryTop(game);
        await cacheTop(game, top);
      } else {
        top = await this.getTop(game);
      }
      return { isNewBest, best: rows[0].best, rank: rows[0].rank, total: top.total, top };
    },
    // Fixed one-minute window per IP, shared by all workers. No Redis = no limit (same as before).
    async allowPost(ip) {
      if (!redisReady() || !ip) return true;
      try {
        const key = `ppeng:rl:post:${ip}:${Math.floor(Date.now() / 60000)}`;
        const n = await redis.incr(key);
        if (n === 1) await redis.expire(key, 70);
        return n <= POST_LIMIT_PER_MIN;
      } catch (e) {
        return true;
      }
    },
  };
}

function createLeaderboardStore(opts) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return createFileStore(opts);
  return createSqlStore({
    ...opts,
    databaseUrl,
    redisUrl: process.env.REDIS_URL || null,
    poolSize: Number(process.env.PG_POOL_SIZE || 5),
  });
}

module.exports = { createLeaderboardStore, normalizeGame };
