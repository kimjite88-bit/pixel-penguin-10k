/**
 * PIXEL PENGUIN (Pixel Penguin 10K) — Official Homepage & 10K Explorer Server
 * Built by @happy Ahndoge for VERY Mainnet (Chain ID: 4613)
 *
 * Serves:
 * - Bilingual (KO/EN) Official Collection Homepage & VeryChat NFT Market Specs
 * - 11 Special 1-of-1 Animated Genesis Originals (#0 ~ #10)
 * - Full 10,000 Token Explorer & rarity.tools Rarity Score Calculator (P00000 ~ P09999)
 * - Lossless Pixel Art Binary Pack Streaming (/img/P00000.png ~ /img/P09999.png)
 * - FQL Cryptographic Provenance & SHA-256 Verification API
 */

const express = require('express');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('trust proxy', true);
app.use(compression());
app.use(express.json({ limit: '256kb' }));

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'bundle');

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
  const id = `P${String(num).padStart(5, '0')}`;
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
  res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
  return res.end(slice);
});

// API: Initial Config, Specials, Provenance, and Trait Summary
app.get('/api/config', (req, res) => {
  if (!collection && !loadCollectionData()) {
    return res.status(503).json({ error: 'Collection data loading' });
  }
  const host = `${req.protocol}://${req.get('host')}`;
  res.json({
    project: {
      ...collection.project,
      official_website: process.env.PUBLIC_URL || host,
      contract_address: process.env.CONTRACT_ADDRESS || 'TBA (2026. 10. 23 민팅 시 온체인 컨트랙트 자동 연동)',
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
      const idStr = `p${String(num).padStart(5, '0')}`;
      const numStr = String(num);
      let qMatch = (exactNum !== null && exactNum === num) || idStr.includes(q) || `#${numStr}` === q;

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
    return res.status(404).json({ error: 'Invalid token ID (valid range: P00000 ~ P09999 or 0 ~ 9999)' });
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
  const host = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
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

app.use(
  express.static(PUBLIC_DIR, {
    etag: true,
    setHeaders: (res, filePath) => {
      if (/\.(html|js|css)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[PIXEL PENGUIN 10K] Official Server listening on http://localhost:${PORT}`);
});
