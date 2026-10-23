/**
 * PIXEL PENGUIN (Pixel Penguin 10K) — Official Homepage & 10K Explorer Server
 * Built by @happy Ahndoge for VERY Mainnet (Chain ID: 4613)
 *
 * Serves:
 * - Bilingual (KO/EN) Official Collection Homepage & VeryChat NFT Market Specs
 * - 11 Special 1-of-1 Animated Genesis Originals (#0 ~ #10)
 * - Full 10,000 Token Explorer & rarity.tools Rarity Score Calculator (P0000 ~ P9999)
 * - Lossless Pixel Art Binary Pack Streaming (/img/P0000.png ~ /img/P9999.png)
 * - FQL Cryptographic Provenance & SHA-256 Verification API
 */

const cluster = require('cluster');
const crypto = require('crypto');
const os = require('os');
const express = require('express');
const compression = require('compression');
const fs = require('fs');
const path = require('path');
const { createLeaderboardStore, normalizeGame } = require('./leaderboard-store');

// Read the container's CPU quota (cgroup v2, then v1); os.availableParallelism() reports host cores
function containerCpuCount() {
  try {
    const [quota, period] = fs.readFileSync('/sys/fs/cgroup/cpu.max', 'utf8').trim().split(/\s+/);
    if (quota !== 'max') return Math.max(1, Math.floor(Number(quota) / Number(period)));
  } catch (e) {}
  try {
    const quota = Number(fs.readFileSync('/sys/fs/cgroup/cpu/cpu.cfs_quota_us', 'utf8'));
    const period = Number(fs.readFileSync('/sys/fs/cgroup/cpu/cpu.cfs_period_us', 'utf8'));
    if (quota > 0 && period > 0) return Math.max(1, Math.floor(quota / period));
  } catch (e) {}
  return os.availableParallelism ? os.availableParallelism() : os.cpus().length;
}

function containerMemoryBytes() {
  for (const f of ['/sys/fs/cgroup/memory.max', '/sys/fs/cgroup/memory/memory.limit_in_bytes']) {
    try {
      const v = Number(fs.readFileSync(f, 'utf8').trim());
      if (v > 0 && v < os.totalmem()) return v;
    } catch (e) {}
  }
  return os.totalmem();
}

// Each worker holds the 10K pack in memory (~100 MB RSS). Several workers only make sense with a shared
// leaderboard store, so file mode (no DATABASE_URL) stays single-process.
function workerCount() {
  if (process.env.WEB_CONCURRENCY) return Math.max(1, parseInt(process.env.WEB_CONCURRENCY, 10) || 1);
  if (!process.env.DATABASE_URL) return 1;
  const byMemory = Math.floor((containerMemoryBytes() - 128 * 1024 * 1024) / (160 * 1024 * 1024));
  return Math.max(1, Math.min(containerCpuCount(), byMemory, 8));
}

const WORKERS = workerCount();
const IS_PRIMARY = cluster.isPrimary && WORKERS > 1;

const app = express();
const PORT = Number(process.env.PORT || 3000);
// Public address of the site: www goes through Cloudflare, the apex reaches this server directly
const CANONICAL_ORIGIN = (process.env.PUBLIC_URL || 'https://www.ppeng.org').replace(/\/+$/, '');

app.disable('x-powered-by');
app.set('trust proxy', true);

// Security headers (Clickjacking, XSS, MIME-sniffing, HSTS, and strict CSP)
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "font-src 'self' https://cdn.jsdelivr.net data:",
  "img-src 'self' data: blob:",
  "media-src 'self' data: blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=()'
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Content-Security-Policy', CSP_HEADER);
  next();
});

// ppeng.org (apex) bypasses Cloudflare and would spend the server's own bandwidth on every file; send it to www.
// Only the exact apex host: www, ppeng.verycloud.io and the platform health check are served normally.
app.use((req, res, next) => {
  const host = String(req.get('host') || '').toLowerCase().replace(/:\d+$/, '');
  if (host === 'ppeng.org') {
    const safePath = '/' + String(req.originalUrl || '/').replace(/^[\/\\]+/, '');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.redirect(301, `https://www.ppeng.org${safePath}`);
  }
  next();
});
app.use(compression());
app.use(express.json({ limit: '256kb' }));

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'bundle');

const leaderboards = createLeaderboardStore({ dataDir: DATA_DIR, parseTokenNumber });

// Cluster primary: prepare the shared leaderboard once, then fork the HTTP workers (restarting any that die)
if (IS_PRIMARY) {
  leaderboards
    .init()
    .then(() => {
      console.log(`[Cluster] leaderboard store: ${leaderboards.kind}; starting ${WORKERS} workers`);
      for (let i = 0; i < WORKERS; i++) cluster.fork();
      cluster.on('exit', (worker, code, signal) => {
        console.warn(`[Cluster] worker ${worker.process.pid} exited (${signal || code}), restarting`);
        setTimeout(() => cluster.fork(), 1000);
      });
    })
    .catch((e) => {
      console.error('[Leaderboard] init failed:', e);
      process.exit(1);
    });
  return;
}

// Load 10K collection index and binary 48x48 PNG pack into memory
const COLLECTION_JSON_PATH = path.join(DATA_DIR, 'collection_10k.json');
const PACK_BIN_PATH = path.join(DATA_DIR, 'penguins_48x48.bin');

let collection = null;
let packBuffer = null;
let specialsByNum = new Map();
let traitScoreLookup = {};

const TIER_RANK_WEIGHT = {
  Genesis: 7,
  Mythic: 6,
  Legendary: 5,
  Epic: 4,
  Rare: 3,
  Uncommon: 2,
  Common: 1,
};

function loadCollectionData() {
  if (!fs.existsSync(COLLECTION_JSON_PATH) || !fs.existsSync(PACK_BIN_PATH)) {
    console.warn('[Server] Waiting for data/collection_10k.json and data/penguins_48x48.bin...');
    return false;
  }
  collection = JSON.parse(fs.readFileSync(COLLECTION_JSON_PATH, 'utf8'));
  packBuffer = fs.readFileSync(PACK_BIN_PATH);

  specialsByNum = new Map();
  for (const sp of collection.specials) {
    specialsByNum.set(sp.edition, sp);
  }

  traitScoreLookup = {};
  for (const [cat, rows] of Object.entries(collection.trait_summary)) {
    traitScoreLookup[cat] = {};
    for (const r of rows) {
      traitScoreLookup[cat][r.value] = r;
    }
  }
  console.log(
    `[Server] Loaded ${collection.tokens.length} verified tokens and ${(
      packBuffer.length /
      1024 /
      1024
    ).toFixed(2)} MiB image pack.`
  );
  return true;
}

loadCollectionData();

function parseTokenNumber(rawId) {
  if (rawId === null || rawId === undefined || rawId === '') return null;
  const s = String(rawId).trim().toUpperCase().replace(/^#/, '').replace(/^P/, '');
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  if (n < 0 || n > 9999) return null;
  return n;
}

function expandTokenSummary(num) {
  const idx = num;
  const row = collection.tokens[idx];
  const [tIndices, activeK, rarityScore, rarityRank, nativeSha16, imageSha16, jsonSha16] = row;
  const id = `P${String(num).padStart(4, '0')}`;
  const isSpecial = num <= 10;
  const sp = isSpecial ? specialsByNum.get(num) : null;

  const traits = {};
  collection.cat_keys.forEach((cat, cIdx) => {
    traits[cat] = collection.dict_tables[cat][tIndices[cIdx]];
  });

  const tier = traits.Rarity;
  const vTag = `v322_${nativeSha16.slice(0, 8)}`;
  const addVer = (u) => (u.includes('?') ? `${u}&v=${vTag}` : `${u}?v=${vTag}`);
  let charKo = null;
  let charEn = null;
  if (isSpecial && sp) {
    charKo = sp.character_ko || sp.archetype;
    const m = String(sp.archetype || '').match(/\(([^)]+)\)\s*$/);
    charEn = m ? m[1].trim() : charKo;
  }
  return {
    id,
    edition: num,
    name: isSpecial ? `Pixel Penguin #${num} — ${charKo}` : `Pixel Penguin #${num}`,
    name_ko: isSpecial ? `Pixel Penguin #${num} — ${charKo}` : `Pixel Penguin #${num}`,
    name_en: isSpecial ? `Pixel Penguin #${num} — ${charEn}` : `Pixel Penguin #${num}`,
    character_ko: charKo,
    character_en: charEn,
    archetype: isSpecial ? sp.archetype : null,
    kind: isSpecial ? 'SPECIAL_ORIGINAL_GIF' : 'GENERATIVE_48X48_NEAREST_3072',
    tier,
    rarity_score: rarityScore,
    rarity_rank: rarityRank,
    active_traits_count: activeK,
    image_url: isSpecial ? addVer(sp.fast_gif_url) : `/img/${id}.png?v=${vTag}`,
    full_image_url: isSpecial ? addVer(sp.gif_url) : `/img/${id}.png?v=${vTag}`,
    pixel_48_url: `/img/${id}.png?v=${vTag}`,
    traits,
    hashes: {
      native_sha16: nativeSha16,
      image_sha16: imageSha16,
      json_sha16: jsonSha16,
    },
  };
}

function expandTokenFull(num) {
  const base = expandTokenSummary(num);
  const isSpecial = num <= 10;
  const sp = isSpecial ? specialsByNum.get(num) : null;

  const nineCats = [
    'Background',
    'Aura',
    'Back',
    'Species',
    'Clothes',
    'Eyes',
    'Mouth',
    'Eyewear',
    'Hat',
  ];

  const breakdown = nineCats.map((cat) => {
    const val = base.traits[cat];
    const stat = traitScoreLookup[cat]?.[val] || { count: 1, pct: 0.01, score: 10000 };
    return {
      trait_type: cat,
      value: val,
      count: stat.count,
      pct: stat.pct,
      score: stat.score,
    };
  });

  const activeCountTotal = collection.active_slot_counts[String(base.active_traits_count)] || 1;
  const activeCountScore = Number((10000 / activeCountTotal).toFixed(2));

  return {
    ...base,
    description: isSpecial
      ? sp.description
      : `Pixel Penguin 10K Official Collection on VeryChain (Very NFT). Created by @happy Ahndoge.`,
    n_frames: isSpecial ? sp.n_frames : 1,
    genesis_bonus: isSpecial ? Number(sp.genesis_bonus || 0) : 0,
    trait_breakdown: breakdown,
    active_trait_stat: {
      active_count: base.active_traits_count,
      tokens_with_same_count: activeCountTotal,
      pct: Number((activeCountTotal / 100).toFixed(2)),
      score: activeCountScore,
    },
    special_hashes: isSpecial
      ? {
          file_sha256: sp.file_sha256,
          animation_frames_sha256: sp.animation_frames_sha256,
          frame0_native_48_sha256: sp.frame0_native_48_sha256,
          frame0_final_pixel_sha256: sp.frame0_final_pixel_sha256,
          json_sha256: sp.json_sha256,
        }
      : null,
  };
}

// Serve lossless PNG from binary pack
app.get('/img/:tokenFile', (req, res) => {
  if (!collection || !packBuffer) {
    if (!loadCollectionData()) return res.status(503).send('Collection pack initializing');
  }
  const raw = req.params.tokenFile.replace(/\.png$/i, '');
  const num = parseTokenNumber(raw);
  if (num === null) {
    return res.status(404).send('Token not found');
  }
  const [offset, length] = collection.offsets[num];
  const slice = packBuffer.subarray(offset, offset + length);
  res.setHeader('Content-Type', 'image/png');
  // ?v=v322_<image hash> URLs from the token APIs change whenever the image does, so they never go stale
  const hashed = /^v322_[0-9a-f]{8}$/.test(String(req.query.v || ''));
  res.setHeader('Cache-Control', hashed ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');
  return res.end(slice);
});

// The collection never changes while the process runs, so a repeated collection API query is answered from
// memory and browsers may keep it for 5 minutes. Capped so random search strings cannot grow it without bound.
const API_CACHE_MAX = 500;
const apiCache = new Map();
function cachedJson(req, res, next) {
  const key = `${req.get('host')}${req.originalUrl}`;
  const hit = apiCache.get(key);
  if (hit) {
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.type('json').send(hit);
  }
  const sendJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode !== 200) return sendJson(body);
    const text = JSON.stringify(body);
    if (apiCache.size >= API_CACHE_MAX) apiCache.clear();
    apiCache.set(key, text);
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.type('json').send(text);
  };
  next();
}
app.use(['/api/config', '/api/tokens', '/api/token', '/api/metadata'], cachedJson);

// API: Initial Config, Specials, Provenance, and Trait Summary
app.get('/api/config', (req, res) => {
  if (!collection && !loadCollectionData()) {
    return res.status(503).json({ error: 'Collection data loading' });
  }
  res.json({
    project: {
      ...collection.project,
      official_website: CANONICAL_ORIGIN,
      contract_address: process.env.CONTRACT_ADDRESS || 'TBA (2026. 10. 26 민팅 시 온체인 컨트랙트 자동 연동)',
    },
    provenance: collection.provenance,
    specials: collection.specials,
    cat_keys: collection.cat_keys,
    trait_summary: collection.trait_summary,
    active_slot_counts: collection.active_slot_counts,
  });
});

// API: Search, Filter & Sort all 10,000 Tokens
app.get('/api/tokens', (req, res) => {
  if (!collection && !loadCollectionData()) {
    return res.status(503).json({ error: 'Collection data loading' });
  }

  const q = String(req.query.q || '').trim().toLowerCase();
  const tierFilter = String(req.query.tier || '').trim();
  const editionFilter = String(req.query.edition || '').trim();
  const sort = String(req.query.sort || 'id_asc').trim();
  const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '40', 10) || 40));

  // Optional trait filters per category
  const catFilters = {};
  for (const cat of collection.cat_keys) {
    if (req.query[cat] && String(req.query[cat]).trim() !== '') {
      const val = String(req.query[cat]).trim();
      const idx = collection.dict_tables[cat].indexOf(val);
      if (idx === -1) {
        return res.json({ total: 0, page, limit, items: [] });
      }
      catFilters[collection.cat_keys.indexOf(cat)] = idx;
    }
  }

  const tierCatIdx = collection.cat_keys.indexOf('Rarity');
  const tierValIdx = tierFilter ? collection.dict_tables.Rarity.indexOf(tierFilter) : -1;
  if (tierFilter && tierValIdx === -1) {
    return res.json({ total: 0, page, limit, items: [] });
  }

  // Exact ID shortcut if q is e.g. "#0", "P00000", "0"
  const exactNum = q ? parseTokenNumber(q) : null;

  const matchedNums = [];
  for (let num = 0; num <= 9999; num++) {
    const row = collection.tokens[num];
    const tIndices = row[0];

    if (editionFilter === 'special' && num > 10) continue;
    if (editionFilter === 'generative' && num <= 10) continue;

    if (tierValIdx !== -1 && tIndices[tierCatIdx] !== tierValIdx) continue;

    let catOk = true;
    for (const [cIdxStr, expectedValIdx] of Object.entries(catFilters)) {
      if (tIndices[Number(cIdxStr)] !== expectedValIdx) {
        catOk = false;
        break;
      }
    }
    if (!catOk) continue;

    if (q) {
      const idStr = `p${String(num).padStart(4, '0')}`;
      const idStr5 = `p${String(num).padStart(5, '0')}`;
      const numStr = String(num);
      let qMatch =
        (exactNum !== null && exactNum === num) ||
        idStr.includes(q) ||
        idStr5.includes(q) ||
        `#${numStr}` === q;

      if (!qMatch && num <= 10) {
        const sp = specialsByNum.get(num);
        if (
          sp &&
          (sp.title.toLowerCase().includes(q) ||
            sp.character_ko.toLowerCase().includes(q) ||
            sp.archetype.toLowerCase().includes(q))
        ) {
          qMatch = true;
        }
      }

      if (!qMatch) {
        for (let c = 0; c < tIndices.length; c++) {
          const traitVal = collection.dict_tables[collection.cat_keys[c]][tIndices[c]];
          if (traitVal.toLowerCase().includes(q)) {
            qMatch = true;
            break;
          }
        }
      }
      if (!qMatch) continue;
    }

    matchedNums.push(num);
  }

  // Sort matched token numbers (including #0~#10 in all sort orders)
  matchedNums.sort((a, b) => {
    const rowA = collection.tokens[a];
    const rowB = collection.tokens[b];
    if (sort === 'id_asc') return a - b;
    if (sort === 'id_desc') return b - a;
    if (sort === 'rank_desc') return rowB[3] - rowA[3];
    if (sort === 'tier_desc') {
      const tierA = collection.dict_tables.Rarity[rowA[0][tierCatIdx]];
      const tierB = collection.dict_tables.Rarity[rowB[0][tierCatIdx]];
      const wDiff = (TIER_RANK_WEIGHT[tierB] || 0) - (TIER_RANK_WEIGHT[tierA] || 0);
      if (wDiff !== 0) return wDiff;
      return rowA[3] - rowB[3];
    }
    // rank_asc (Rank #1 -> #10,000)
    return rowA[3] - rowB[3];
  });

  const total = matchedNums.length;
  const start = (page - 1) * limit;
  const sliceNums = matchedNums.slice(start, start + limit);
  const items = sliceNums.map((n) => expandTokenSummary(n));

  res.json({
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
    items,
  });
});

// API: Single Token Detail & Rarity Breakdown
app.get('/api/token/:id', (req, res) => {
  if (!collection && !loadCollectionData()) {
    return res.status(503).json({ error: 'Collection data loading' });
  }
  const num = parseTokenNumber(req.params.id);
  if (num === null) {
    return res.status(404).json({ error: 'Invalid token ID (valid range: P0000 ~ P9999 or 0 ~ 9999)' });
  }
  res.json(expandTokenFull(num));
});

// API: Standard ERC-721 On-Chain Metadata JSON
app.get('/api/metadata/:id', (req, res) => {
  if (!collection && !loadCollectionData()) {
    return res.status(503).json({ error: 'Collection data loading' });
  }
  const raw = req.params.id.replace(/\.json$/i, '');
  const num = parseTokenNumber(raw);
  if (num === null) {
    return res.status(404).json({ error: 'Token not found' });
  }
  const full = expandTokenFull(num);
  const host = CANONICAL_ORIGIN;
  const attributes = full.trait_breakdown.map((b) => ({
    trait_type: b.trait_type,
    value: b.value,
  }));
  attributes.push({ trait_type: 'Prop', value: full.traits.Prop });
  attributes.push({ trait_type: 'Rarity', value: full.tier });
  attributes.push({
    trait_type: 'Edition Type',
    value:
      num <= 10 ? '1-of-1 Animated Special Original (GIF)' : 'Generative 48x48 Pixel Art',
  });

  res.json({
    token_id: full.id,
    edition: full.edition,
    name: full.name,
    collection: 'Pixel Penguin 10K',
    symbol: 'PPENG',
    issuer: '@happy Ahndoge',
    description: full.description,
    rarity_tier: full.tier,
    rarity_rank: full.rarity_rank,
    rarity_score: full.rarity_score,
    kind: full.kind,
    image: `${host}${full.full_image_url}`,
    attributes,
  });
});

// ============================================================================
// API: UFO SPACE GAME — NFT NUMBER (#0 ~ #9999) HIGH-SCORE ONLY LEADERBOARD
//      (Purely for fun/entertainment; completely independent of NFT rarity rank!)
//      IMPORTANT: Blank input never defaults to #0. Only explicit "0"~"9999" records!
// ============================================================================
// Storage (Postgres + Redis in production, bundle JSON files locally) lives in leaderboard-store.js

function formatLeaderboardRows(rows) {
  if (!collection) loadCollectionData();
  return rows.map((row, idx) => {
    const summary = collection ? expandTokenSummary(row.edition) : null;
    const idCode = `P${String(row.edition).padStart(4, '0')}`;
    return {
      rank: idx + 1,
      edition: row.edition,
      id: idCode,
      name: summary ? summary.name : `Pixel Penguin #${row.edition}`,
      name_ko: summary ? summary.name_ko : `Pixel Penguin #${row.edition}`,
      name_en: summary ? summary.name_en : `Pixel Penguin #${row.edition}`,
      species: summary?.traits?.Species || 'Classic',
      image_url: summary ? summary.image_url : `/img/${idCode}.png`,
      score: row.score,
      updated_at: row.updated_at,
    };
  });
}

// Health check endpoint (minimal public surface; detailed diagnostics require HEALTH_TOKEN if configured)
app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const healthToken = process.env.HEALTH_TOKEN;
  if (healthToken && req.get('x-health-token') === healthToken) {
    return res.json({
      ok: true,
      store: leaderboards.kind,
      ...(leaderboards.status ? leaderboards.status() : {}),
      workers: WORKERS,
      worker_id: cluster.isWorker ? cluster.worker.id : 0,
      client_ip: clientIpInfo(req).ip,
      client_ip_source: clientIpInfo(req).source,
      container_cpus: containerCpuCount(),
      container_memory_mb: Math.round(containerMemoryBytes() / 1048576),
      rss_mb: Math.round(process.memoryUsage().rss / 1048576),
      uptime_sec: Math.round(process.uptime()),
    });
  }
  res.json({ ok: true });
});

// Requests arrive Cloudflare -> VeryCloud Traefik -> app, so the socket address (and req.ip behind more than one proxy)
// is a proxy shared by every visitor. Cloudflare's CF-Connecting-IP is the visitor; without it, the first
// X-Forwarded-For entry; the socket address only as a last resort.
function clientIpInfo(req) {
  const cf = String(req.get('cf-connecting-ip') || '').trim();
  if (cf) return { ip: cf, source: 'cf-connecting-ip' };
  const xff = String(req.get('x-forwarded-for') || '').split(',')[0].trim();
  if (xff) return { ip: xff, source: 'x-forwarded-for' };
  return { ip: req.socket.remoteAddress || '', source: 'socket' };
}

function clientIp(req) {
  return clientIpInfo(req).ip;
}

app.get('/api/leaderboard', async (req, res) => {
  const limit = Math.min(100, Math.max(5, parseInt(req.query.limit, 10) || 100));
  try {
    const top = await leaderboards.getTop(normalizeGame(req.query.game));
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Leaderboard-Store', `${leaderboards.kind}; ${top.cache}`);
    res.json({
      total_pilots: top.total,
      items: formatLeaderboardRows(top.rows.slice(0, limit)),
    });
  } catch (e) {
    console.error('[Leaderboard] read failed:', e.message);
    res.status(503).json({ error: 'Leaderboard temporarily unavailable' });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  // Enforce same-origin browser request headers to deter cross-site CSRF and raw bot scripts
  const secFetchSite = String(req.get('sec-fetch-site') || '').toLowerCase();
  if (secFetchSite && secFetchSite !== 'same-origin') {
    return res.status(403).json({ error: 'Forbidden cross-site request' });
  }
  const origin = String(req.get('origin') || '').toLowerCase().replace(/\/+$/, '');
  const reqHost = String(req.get('host') || '').toLowerCase();
  if (!origin || (origin !== `https://${reqHost}` && origin !== `http://${reqHost}`)) {
    return res.status(403).json({ error: 'Origin verification failed' });
  }

  // CRITICAL: Never default to 0 (`?? 0`) when tokenId is blank/missing!
  // Score is recorded ONLY when the user explicitly entered a number ("0" ~ "9999").
  const rawTokenId = req.body?.tokenId ?? req.body?.edition;
  if (rawTokenId === null || rawTokenId === undefined || String(rawTokenId).trim() === '') {
    return res.status(400).json({ error: 'Explicit NFT number (0~9999) is required to record score' });
  }
  const ed = parseTokenNumber(rawTokenId);
  const rawScore = Math.floor(Number(req.body?.score || 0));
  const rawKills = Number(req.body?.kills ?? 0);
  if (
    ed === null ||
    rawScore <= 0 ||
    rawScore > 999999 ||
    !Number.isFinite(rawKills) ||
    rawKills < 0 ||
    rawKills > 100000
  ) {
    return res.status(400).json({ error: 'Invalid tokenId or score' });
  }

  try {
    if (!(await leaderboards.allowPost(clientIp(req)))) {
      return res.status(429).json({ error: 'Too many score submissions, try again in a minute' });
    }
    // HIGH SCORE ONLY: Never add/accumulate scores; only update if new score > previous best score!
    const result = await leaderboards.submit(normalizeGame(req.body?.game), ed, rawScore);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      edition: ed,
      id: `P${String(ed).padStart(4, '0')}`,
      is_new_best: result.isNewBest,
      best_score: result.best,
      rank: result.rank,
      total_pilots: result.total,
      items: formatLeaderboardRows(result.top.rows),
    });
  } catch (e) {
    console.error('[Leaderboard] write failed:', e.message);
    res.status(503).json({ error: 'Leaderboard temporarily unavailable' });
  }
});

// index.html references local scripts and styles as "/app.js?v=…". At startup each ?v= becomes the file's
// content hash, so a changed file always gets a new URL and every hashed URL can be cached for a year
// (by browsers and by Cloudflare). The page itself is revalidated on each visit (ETag -> 304).
const assetHashes = new Map();
function assetHash(urlPath) {
  if (!assetHashes.has(urlPath)) {
    const file = path.join(PUBLIC_DIR, urlPath);
    let hash = null;
    try {
      hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
    } catch (e) {}
    assetHashes.set(urlPath, hash);
  }
  return assetHashes.get(urlPath);
}

const INDEX_HTML = fs
  .readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8')
  .replace(/((?:src|href)=")(\/[\w./-]+\.(?:js|css))\?v=[^"]*"/g, (m, attr, urlPath) => {
    const hash = assetHash(urlPath);
    return hash ? `${attr}${urlPath}?v=${hash}"` : m;
  });
const INDEX_ETAG = `"${crypto.createHash('sha256').update(INDEX_HTML).digest('hex').slice(0, 16)}"`;

// A shared ranking link (/?board=car&n=4441[&lang=ko], made by the ranking tab's share sheet) gets its own link
// preview: crawlers (X, Facebook, chat apps) read og:title/og:description without running scripts, so the rank
// is written into the page here. og:url must be the shared link too, or Facebook previews the home page instead.
const SHARE_BOARD_NAMES = {
  ufo: { en: 'Plane', ko: '경비행기', pcm: 'Plane', ur: 'ہوائی جہاز', bn: 'বিমান' },
  boat: { en: 'Icebreaker', ko: '쇄빙선', pcm: 'Icebreaker', ur: 'برف توڑ جہاز', bn: 'বরফভাঙা জাহাজ' },
  car: { en: 'Car', ko: '자동차', pcm: 'Motor', ur: 'گاڑی', bn: 'গাড়ি' },
};

// Preview texts per language (same B-grade voice and words as the share sheet; public/i18n.js has the glossary)
const SHARE_META = {
  en: {
    rankedTitle: '#{n} · {board} #{rank} · {pts}',
    first: "#1 on the Pixel Penguin {board} board lol. Antarctica fell, this penguin didn't. Come at it",
    ranked: '#{rank} on the Pixel Penguin {board} board lol. Beat it before the pillar sucks you in',
    chasingTitle: '#{n} · going for the {board} TOP 100',
    chasing: 'Pixelated way too many times lol. Pixel Penguin escape game, fail with me?',
    boardTitle: 'Escape game · {board} TOP 100',
    board: 'BREAKING: Antarctica collapses, penguins flee lol. Best score per penguin. Steal #1?',
  },
  ko: {
    rankedTitle: '#{n} · {board} {rank}위 · {pts}',
    first: '픽셀펭귄 탈출 게임 {board} 1위 ㅋㅋㅋ 남극 무너질 때 혼자 살아남은 레전드. 덤빌 펭귄?',
    ranked: '픽셀펭귄 탈출 게임 {board} {rank}위 ㅋㅋ 기둥한테 빨려 가기 전에 와서 이겨 봐',
    chasingTitle: '#{n} · {board} TOP 100 도전 중',
    chasing: '강제 도트화만 몇 번째냐 ㅋㅋ 픽셀펭귄 탈출 게임, 같이 망할 사람?',
    boardTitle: '탈출 게임 · {board} TOP 100',
    board: '[속보] 남극 붕괴, 펭귄들 탈출 중 ㅋㅋ 번호별 최고점 순위. 1위 뺏어 볼 사람?',
  },
  pcm: {
    rankedTitle: '#{n} · {board} #{rank} · {pts}',
    first: '#1 for Pixel Penguin {board} board lol. Antarctica fall, this penguin no fall. Come try am',
    ranked: '#{rank} for Pixel Penguin {board} board lol. Beat am before the pillar swallow you',
    chasingTitle: '#{n} · still dey find {board} TOP 100',
    chasing: 'Dem don turn me pixel too many times lol. Pixel Penguin escape game, who wan fail with me?',
    boardTitle: 'Escape game · {board} TOP 100',
    board: 'BREAKING NEWS: Antarctica don collapse, penguins dey run lol. Best score for each penguin. Who go collect #1?',
  },
  ur: {
    rankedTitle: '#{n} · {board} میں #{rank} · {pts}',
    first: 'Pixel Penguin {board} بورڈ پر #1 ہاہا۔ انٹارکٹکا گر گیا، یہ پینگوئن نہیں گرا۔ ہمت ہے تو آؤ',
    ranked: 'Pixel Penguin {board} بورڈ پر #{rank} ہاہا۔ ستون کے کھینچنے سے پہلے آ کر ہرا دو',
    chasingTitle: '#{n} · {board} TOP 100 کی تلاش میں',
    chasing: 'اتنی بار پکسل بن چکا ہوں ہاہا۔ Pixel Penguin فرار گیم، ساتھ فیل ہونا ہے؟',
    boardTitle: 'فرار گیم · {board} TOP 100',
    board: 'بریکنگ نیوز: انٹارکٹکا ڈھے گیا، پینگوئن بھاگ رہے ہیں ہاہا۔ ہر پینگوئن کا بہترین اسکور۔ #1 چھیننا ہے؟',
  },
  bn: {
    rankedTitle: '#{n} · {board} বোর্ডে #{rank} · {pts}',
    first: 'Pixel Penguin {board} বোর্ডে #1 হাহা। অ্যান্টার্কটিকা ভাঙল, এই পেঙ্গুইন ভাঙেনি। সাহস থাকলে আয়',
    ranked: 'Pixel Penguin {board} বোর্ডে #{rank} হাহা। স্তম্ভ টেনে নেওয়ার আগে এসে হারিয়ে দেখা',
    chasingTitle: '#{n} · {board} TOP 100-এর খোঁজে',
    chasing: 'কতবার যে পিক্সেল হলাম হাহা। Pixel Penguin পালানোর গেম, একসাথে ফেল করবি?',
    boardTitle: 'পালানোর গেম · {board} TOP 100',
    board: 'ব্রেকিং নিউজ: অ্যান্টার্কটিকা ধসে পড়েছে, পেঙ্গুইনরা পালাচ্ছে হাহা। প্রতি পেঙ্গুইনের সেরা স্কোর। #1 কেড়ে নিবি?',
  },
};

function fillMeta(text, vars) {
  return text.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setMetaContent(html, prop, value) {
  return html.replace(new RegExp(`(<meta property="${prop}" content=")[^"]*(")`), (m, a, b) => `${a}${escapeAttr(value)}${b}`);
}

async function sharedRankHtml(req) {
  const board = String(req.query.board || '');
  if (!SHARE_BOARD_NAMES[board]) return null;
  const n = parseTokenNumber(req.query.n);
  // Own keys only: ?lang=constructor must not reach Object.prototype
  const lang = Object.prototype.hasOwnProperty.call(SHARE_META, req.query.lang) ? req.query.lang : 'en';
  const T = SHARE_META[lang];
  const name = SHARE_BOARD_NAMES[board][lang];
  let row = null;
  let rank = 0;
  if (n !== null) {
    try {
      const top = await leaderboards.getTop(board);
      const idx = top.rows.slice(0, 100).findIndex((r) => r.edition === n);
      if (idx >= 0) {
        row = top.rows[idx];
        rank = idx + 1;
      }
    } catch (e) {
      // Board unreadable: fall back to the board's plain preview
    }
  }
  const vars = { n, board: name, rank, pts: row ? `${Number(row.score).toLocaleString('en-US')} PTS` : '' };
  let title;
  let desc;
  if (row) {
    title = fillMeta(T.rankedTitle, vars);
    desc = fillMeta(rank === 1 ? T.first : T.ranked, vars);
  } else if (n !== null) {
    title = fillMeta(T.chasingTitle, vars);
    desc = T.chasing;
  } else {
    title = fillMeta(T.boardTitle, vars);
    desc = T.board;
  }
  const params = new URLSearchParams({ board });
  if (n !== null) params.set('n', String(n));
  if (lang !== 'en') params.set('lang', lang);
  let html = INDEX_HTML;
  html = setMetaContent(html, 'og:url', `https://www.ppeng.org/?${params}`);
  html = setMetaContent(html, 'og:title', `${title} | PIXEL PENGUIN`);
  html = setMetaContent(html, 'og:description', desc);
  return html;
}

async function sendIndex(req, res) {
  if (req.query.board) {
    const html = await sharedRankHtml(req).catch(() => null);
    if (html) {
      res.setHeader('Cache-Control', 'no-cache');
      return res.type('html').send(html);
    }
  }
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('ETag', INDEX_ETAG);
  if (req.get('if-none-match') === INDEX_ETAG) return res.status(304).end();
  res.type('html').send(INDEX_HTML);
}
app.get(['/', '/index.html'], sendIndex);

app.use(
  express.static(PUBLIC_DIR, {
    etag: true,
    index: false,
    setHeaders: (res, filePath) => {
      if (/\.(html|js|css|json)$/i.test(filePath)) {
        const urlPath = '/' + path.relative(PUBLIC_DIR, filePath).split(path.sep).join('/');
        const hash = /\.(js|css)$/i.test(filePath) ? assetHash(urlPath) : null;
        if (hash && res.req.query.v === hash) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          // Unhashed URL: always revalidate (cheap 304), never serve a stale script
          res.setHeader('Cache-Control', 'no-cache');
        }
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

// Unknown API routes and missing files (anything with an extension) are real 404s, not the SPA page:
// a missing part image must fail as an image instead of arriving as 200 text/html
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).send('Not found');
  }
  sendIndex(req, res);
});

function listen() {
  app.listen(PORT, () => {
    const who = cluster.isWorker ? `worker ${process.pid}` : `single process (${leaderboards.kind})`;
    console.log(`[PIXEL PENGUIN 10K] Official Server listening on http://localhost:${PORT} — ${who}`);
  });
}

// Cluster workers start after the primary has prepared the store; a single process prepares it itself
if (cluster.isWorker) {
  listen();
} else {
  leaderboards
    .init()
    .then(listen)
    .catch((e) => {
      console.error('[Leaderboard] init failed:', e);
      process.exit(1);
    });
}
