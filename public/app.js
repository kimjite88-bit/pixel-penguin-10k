/**
 * PIXEL PENGUIN (Pixel Penguin 10K · Symbol: PPENG) — Frontend Application
 * Issued by Very Penguin Labs on VERY Mainnet (4613)
 */

let APP_CONFIG = null;
let CURRENT_LANG = 'ko';
let CURRENT_PAGE = 1;
let TOTAL_PAGES = 1;
let CURRENT_PFP_TOKEN = 1;
let ACTIVE_TRAIT_TAB = 'Hat';

const NINE_CATS = [
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

const CAT_LABELS_KO = {
  Background: '배경 (Background)',
  Aura: '오라 (Aura)',
  Back: '등 소품 (Back)',
  Species: '깃털 스킨 (Species)',
  Clothes: '의상 (Clothes)',
  Eyes: '눈 (Eyes)',
  Mouth: '입 소품 (Mouth)',
  Eyewear: '안경 (Eyewear)',
  Hat: '모자·관모 (Hat)',
  Prop: '종합 소품 (Prop)',
};

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('.market-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === id);
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Live Countdown to Friday Mint (2026-10-23)
function startMintCountdown() {
  const badge = document.getElementById('mint-countdown');
  if (!badge) return;
  const targetDate = new Date('2026-10-23T12:00:00+09:00').getTime();

  function tick() {
    const now = Date.now();
    const diff = targetDate - now;
    if (diff <= 0) {
      badge.textContent = CURRENT_LANG === 'ko' ? 'MINT LIVE ON VERY MAINNET' : 'MINT LIVE NOW';
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    badge.textContent = `D-${d} · ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  tick();
  setInterval(tick, 1000);
}

// Language Switcher
function applyLanguage(lang) {
  CURRENT_LANG = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  document.querySelectorAll('[data-ko][data-en]').forEach((el) => {
    el.textContent = lang === 'ko' ? el.dataset.ko : el.dataset.en;
  });

  const topbar = document.getElementById('topbar-mint-text');
  if (topbar) {
    topbar.textContent =
      lang === 'ko'
        ? '이번 주 금요일 (2026. 10. 23) VERY Mainnet (4613) 공식 민팅 오픈 · 민팅가 1 VERY · 총 10,000개 (심볼: PPENG)'
        : 'THIS FRIDAY (OCT 23, 2026) OFFICIAL MINT ON VERY MAINNET (4613) · MINT PRICE: 1 VERY · SUPPLY: 10,000 (SYMBOL: PPENG)';
  }
}

// PFP Simulator
async function loadPfpPreview(tokenNum) {
  try {
    const res = await fetch(`/api/token/${tokenNum}`);
    if (!res.ok) return;
    const tok = await res.json();
    CURRENT_PFP_TOKEN = tok.edition;

    const imgUrl = tok.edition <= 11 ? tok.image_url : tok.pixel_48_url;
    document.getElementById('pfp-preview-img').src = imgUrl;
    document.getElementById('pfp-mini-img').src = imgUrl;
    document.getElementById('pfp-sim-title').textContent = tok.name;
    document.getElementById('pfp-sim-id').textContent = tok.id;

    const tierEl = document.getElementById('pfp-sim-tier');
    tierEl.textContent = tok.tier;
    tierEl.className = `tier-${tok.tier}`;

    document.getElementById('pfp-sim-rank').textContent = `#${tok.rarity_rank.toLocaleString()} / 10,000`;
    document.getElementById('pfp-sim-score').textContent = `${tok.rarity_score.toLocaleString()} pts`;

    document.querySelectorAll('.pfp-thumb-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.num) === tok.edition);
    });
  } catch (err) {
    console.error('Failed to load PFP preview:', err);
  }
}

function initPfpStudio() {
  // Shape buttons
  document.querySelectorAll('.shape-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.shape-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const box = document.getElementById('pfp-preview-box');
      box.className = `pfp-art-box shape-${btn.dataset.shape}`;
    });
  });

  // Preset strip: #1~#11 + iconic Korean Royal & Mythic generative penguins
  const presets = [1, 2, 3, 5, 7, 8, 9, 11, 53, 479, 136, 12, 26, 500];
  const strip = document.getElementById('pfp-preset-strip');
  if (strip) {
    strip.innerHTML = presets
      .map((num, idx) => {
        const id = `P${String(num).padStart(5, '0')}`;
        const src = num <= 11 ? `/assets/specials/${num}_fast.gif` : `/img/${id}.png`;
        return `<button type="button" class="pfp-thumb-btn ${idx === 0 ? 'active' : ''}" data-num="${num}" title="Preview #${num}">
          <img src="${src}" alt="#${num}" class="pixelated" loading="lazy" />
        </button>`;
      })
      .join('');

    strip.querySelectorAll('.pfp-thumb-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        loadPfpPreview(Number(btn.dataset.num));
      });
    });
  }

  const jumpInput = document.getElementById('pfp-jump-input');
  const jumpBtn = document.getElementById('pfp-jump-btn');
  const detailBtn = document.getElementById('pfp-detail-btn');

  if (jumpBtn && jumpInput) {
    const triggerJump = () => {
      const raw = jumpInput.value.trim().replace(/^#/, '').replace(/^P/i, '');
      const n = parseInt(raw, 10);
      if (n >= 1 && n <= 10000) {
        loadPfpPreview(n);
      }
    };
    jumpBtn.addEventListener('click', triggerJump);
    jumpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerJump();
    });
  }

  if (detailBtn) {
    detailBtn.addEventListener('click', () => {
      openTokenModal(CURRENT_PFP_TOKEN);
    });
  }
}

// Render 11 Special Originals Section
function renderSpecialsGrid(specials) {
  const grid = document.getElementById('specials-grid');
  if (!grid || !specials) return;

  grid.innerHTML = specials
    .map(
      (sp) => `
    <button type="button" class="nft-card mythic-card" onclick="openTokenModal(${sp.edition})">
      <div class="nft-thumb-wrap">
        <img src="${sp.fast_gif_url}" alt="${escapeHtml(sp.title)}" class="pixelated" loading="lazy" />
        <div class="card-top-badges">
          <span class="tier-pill tier-Mythic">MYTHIC 1/1</span>
          <span class="rank-pill">Rank #${sp.rarity_rank}</span>
        </div>
        <span class="gif-badge">4-FRAME GIF</span>
      </div>
      <div class="nft-card-meta">
        <span>${sp.id}</span>
        <span>Edition #${sp.edition} / 10,000</span>
      </div>
      <div class="nft-card-title">${escapeHtml(sp.archetype)}</div>
      <div class="nft-card-footer">
        <span class="price-tag">1 VERY</span>
        <span class="score-tag">${Number(sp.rarity_score).toLocaleString()} pts</span>
      </div>
    </button>
  `
    )
    .join('');
}

// Build 9-Category Dropdowns in Explorer
function buildExplorerTraitDropdowns() {
  const container = document.getElementById('exp-trait-filters');
  if (!container || !APP_CONFIG) return;

  container.innerHTML = NINE_CATS.map((cat) => {
    const rows = APP_CONFIG.trait_summary[cat] || [];
    const optionsHtml = rows
      .map(
        (r) =>
          `<option value="${escapeHtml(r.value)}">${escapeHtml(r.value)} (${r.count.toLocaleString()})</option>`
      )
      .join('');
    return `
      <div class="trait-select-box">
        <label for="filter-cat-${cat}">${CAT_LABELS_KO[cat] || cat}</label>
        <select id="filter-cat-${cat}" data-cat="${cat}" class="filter-select exp-cat-select" style="padding:7px 10px; font-size:12px;">
          <option value="">전체 (All)</option>
          ${optionsHtml}
        </select>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.exp-cat-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      CURRENT_PAGE = 1;
      fetchExplorerTokens();
    });
  });
}

// Fetch & Render 10K Explorer Grid
async function fetchExplorerTokens() {
  const grid = document.getElementById('explorer-grid');
  const countEl = document.getElementById('exp-result-count');
  if (!grid) return;

  const params = new URLSearchParams();
  const q = document.getElementById('exp-search')?.value.trim() || '';
  const tier = document.getElementById('exp-tier')?.value || '';
  const edition = document.getElementById('exp-edition')?.value || '';
  const sort = document.getElementById('exp-sort')?.value || 'rank_asc';

  if (q) params.set('q', q);
  if (tier) params.set('tier', tier);
  if (edition) params.set('edition', edition);
  params.set('sort', sort);
  params.set('page', String(CURRENT_PAGE));
  params.set('limit', '40');

  document.querySelectorAll('.exp-cat-select').forEach((sel) => {
    if (sel.value) {
      params.set(sel.dataset.cat, sel.value);
    }
  });

  try {
    const res = await fetch(`/api/tokens?${params.toString()}`);
    const data = await res.json();
    TOTAL_PAGES = Math.max(1, data.total_pages || 1);

    if (countEl) {
      countEl.innerHTML =
        CURRENT_LANG === 'ko'
          ? `총 <strong>${data.total.toLocaleString()}</strong>개 픽셀 펭귄 검색됨 (페이지 ${data.page} / ${TOTAL_PAGES})`
          : `Showing <strong>${data.total.toLocaleString()}</strong> Pixel Penguins (Page ${data.page} of ${TOTAL_PAGES})`;
    }

    document.getElementById('page-indicator').textContent = `${data.page} / ${TOTAL_PAGES}`;
    document.getElementById('page-first-btn').disabled = data.page <= 1;
    document.getElementById('page-prev-btn').disabled = data.page <= 1;
    document.getElementById('page-next-btn').disabled = data.page >= TOTAL_PAGES;
    document.getElementById('page-last-btn').disabled = data.page >= TOTAL_PAGES;

    if (!data.items || data.items.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:48px 20px; color:var(--text-secondary);">
        검색 조건에 일치하는 픽셀 펭귄이 없습니다. 필터를 초기화해 보세요.
      </div>`;
      return;
    }

    grid.innerHTML = data.items
      .map((item) => {
        const isSpecial = item.edition <= 11;
        const subtitle = isSpecial
          ? item.archetype
          : `${item.traits.Hat !== 'None' ? item.traits.Hat : item.traits.Clothes !== 'None' ? item.traits.Clothes : item.traits.Species}`;
        return `
        <button type="button" class="nft-card ${item.tier === 'Mythic' ? 'mythic-card' : ''}" onclick="openTokenModal(${item.edition})">
          <div class="nft-thumb-wrap">
            <img src="${item.image_url}" alt="${escapeHtml(item.name)}" class="pixelated" loading="lazy" />
            <div class="card-top-badges">
              <span class="tier-pill tier-${item.tier}">${item.tier}</span>
              <span class="rank-pill">#${item.rarity_rank}</span>
            </div>
            ${isSpecial ? '<span class="gif-badge">1/1 GIF</span>' : ''}
          </div>
          <div class="nft-card-meta">
            <span>${item.id}</span>
            <span>#${item.edition}</span>
          </div>
          <div class="nft-card-title">${escapeHtml(subtitle)}</div>
          <div class="nft-card-footer">
            <span class="price-tag">1 VERY</span>
            <span class="score-tag">${Number(item.rarity_score).toLocaleString()} pts</span>
          </div>
        </button>
      `;
      })
      .join('');
  } catch (err) {
    console.error('Failed to fetch tokens:', err);
  }
}

function filterExplorerByTier(tier) {
  const tierSel = document.getElementById('exp-tier');
  if (tierSel) {
    tierSel.value = tier;
    CURRENT_PAGE = 1;
    fetchExplorerTokens();
    scrollToSection('sec-explorer');
  }
}

function filterExplorerByTrait(cat, val) {
  document.querySelectorAll('.exp-cat-select').forEach((sel) => {
    sel.value = sel.dataset.cat === cat ? val : '';
  });
  document.getElementById('exp-tier').value = '';
  document.getElementById('exp-edition').value = '';
  document.getElementById('exp-search').value = '';
  CURRENT_PAGE = 1;
  fetchExplorerTokens();
  scrollToSection('sec-explorer');
}

// Build 210 Trait Directory Section
function renderTraitDirectory() {
  const tabsWrap = document.getElementById('trait-cat-tabs');
  const gridWrap = document.getElementById('trait-catalog-grid');
  if (!tabsWrap || !gridWrap || !APP_CONFIG) return;

  tabsWrap.innerHTML = NINE_CATS.map(
    (cat) => `
    <button type="button" class="lang-btn ${cat === ACTIVE_TRAIT_TAB ? 'active' : ''}" data-tcat="${cat}" style="border:1px solid var(--border-subtle);">
      ${cat} (${(APP_CONFIG.trait_summary[cat] || []).length})
    </button>
  `
  ).join('');

  tabsWrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      ACTIVE_TRAIT_TAB = btn.dataset.tcat;
      renderTraitDirectory();
    });
  });

  const rows = APP_CONFIG.trait_summary[ACTIVE_TRAIT_TAB] || [];
  gridWrap.innerHTML = rows
    .map(
      (r) => `
    <div class="trait-b-item" style="cursor:pointer;" onclick="filterExplorerByTrait('${escapeHtml(ACTIVE_TRAIT_TAB)}', '${escapeHtml(r.value).replace(/'/g, "\\'")}')">
      <div class="trait-b-cat">${escapeHtml(ACTIVE_TRAIT_TAB)}</div>
      <div class="trait-b-val">${escapeHtml(r.value)}</div>
      <div class="trait-b-score">
        <span>${r.count.toLocaleString()} / 10,000 (${r.pct}%)</span>
        <strong>+${r.score} pts</strong>
      </div>
    </div>
  `
    )
    .join('');
}

// High-Res 3072x3072 PNG Download via 64x NEAREST Integer Upscale
function downloadHighRes3072(tokenId, pixel48Url) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.getElementById('upscale-canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 3072, 3072);
    ctx.drawImage(img, 0, 0, 3072, 3072);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tokenId}_3072x3072.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  };
  img.src = pixel48Url;
}

// Token Detail Inspector Modal
async function openTokenModal(tokenNum) {
  const modal = document.getElementById('token-modal');
  const body = document.getElementById('modal-detail-body');
  if (!modal || !body) return;

  modal.classList.add('open');
  body.innerHTML = `<div style="grid-column:1/-1; padding:40px; text-align:center;">Loading Token #${tokenNum}...</div>`;

  try {
    const res = await fetch(`/api/token/${tokenNum}`);
    const tok = await res.json();
    const isSpecial = tok.edition <= 11;

    const traitsHtml = tok.trait_breakdown
      .map(
        (b) => `
      <div class="trait-b-item" style="cursor:pointer;" onclick="closeTokenModal(); filterExplorerByTrait('${escapeHtml(b.trait_type)}', '${escapeHtml(b.value).replace(/'/g, "\\'")}')">
        <div class="trait-b-cat">${escapeHtml(b.trait_type)}</div>
        <div class="trait-b-val">${escapeHtml(b.value)}</div>
        <div class="trait-b-score">
          <span>${b.count.toLocaleString()} (${b.pct}%)</span>
          <strong>+${b.score} pts</strong>
        </div>
      </div>
    `
      )
      .join('');

    const downloadBtnHtml = isSpecial
      ? `<a href="${tok.full_image_url}" download="${tok.id}.gif" class="btn-primary" style="text-decoration:none; width:100%; justify-content:center;">
          ⚡ 1254×1254 원본 애니메이션 GIF 다운로드
         </a>`
      : `<button type="button" class="btn-primary" style="width:100%; justify-content:center;" onclick="downloadHighRes3072('${tok.id}', '${tok.pixel_48_url}')">
          🖼️ 3072×3072 초고해상도 PNG 다운로드 (64× NEAREST)
         </button>`;

    body.innerHTML = `
      <div>
        <div class="modal-art-stage">
          <img src="${tok.full_image_url}" alt="${escapeHtml(tok.name)}" class="pixelated" />
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:12px;">
          ${downloadBtnHtml}
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button type="button" class="btn-secondary" style="justify-content:center; padding:9px;" onclick="loadPfpPreview(${tok.edition}); closeTokenModal(); scrollToSection('top');">
              ✓ PFP 시뮬레이터 장착
            </button>
            <a href="/api/metadata/${tok.id}.json" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none; justify-content:center; padding:9px;">
              { } 온체인 JSON 보기
            </a>
          </div>
        </div>
      </div>

      <div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
          <span class="tier-pill tier-${tok.tier}">${tok.tier}</span>
          <span class="pill-tag">rarity.tools Rank #${tok.rarity_rank.toLocaleString()} / 10,000</span>
          <span class="pill-tag gold">Mint Price: 1 VERY</span>
        </div>

        <h2 id="modal-token-title" style="font-size:24px; font-weight:900; margin-bottom:6px;">${escapeHtml(tok.name)}</h2>
        <p style="font-size:13.5px; color:var(--text-secondary); margin-bottom:14px;">${escapeHtml(tok.description)}</p>

        <div class="spec-rows-stack" style="margin-bottom:14px;">
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">Token ID / Edition</span>
            <span class="spec-value">${tok.id} (#${tok.edition} / 10,000)</span>
          </div>
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">rarity.tools Rarity Score</span>
            <span class="spec-value ice">${tok.rarity_score.toLocaleString()} pts (Rank #${tok.rarity_rank.toLocaleString()})</span>
          </div>
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">Active Optional Traits Count</span>
            <span class="spec-value">${tok.active_trait_stat.active_count}개 장착 (+${tok.active_trait_stat.score} pts · ${tok.active_trait_stat.pct}%)</span>
          </div>
        </div>

        <h4 style="font-size:14px; font-weight:800; margin-bottom:6px;">9대 카테고리 파츠 구성 및 개별 희귀도 점수 (클릭 시 동일 파츠 필터)</h4>
        <div class="trait-breakdown-list">
          ${traitsHtml}
        </div>

        <div class="hash-box">
          <div><strong>[FQL Cryptographic Provenance]</strong></div>
          <div>Native 48×48 SHA-256 (prefix): ${tok.hashes.native_sha16}...</div>
          <div>Final Image SHA-256 (prefix):  ${tok.hashes.image_sha16}...</div>
          <div>Metadata JSON SHA-256 (prefix): ${tok.hashes.json_sha16}...</div>
        </div>
      </div>
    `;
  } catch (err) {
    body.innerHTML = `<div style="padding:24px; color:var(--accent-very);">Failed to load token details.</div>`;
  }
}

function closeTokenModal() {
  document.getElementById('token-modal')?.classList.remove('open');
}

// Listing Submission Sheet Copy Modal
function buildSubmissionModal() {
  const container = document.getElementById('submission-rows-container');
  if (!container) return;

  const siteUrl = window.location.origin;
  const storyEn = document.getElementById('story-en-text')?.textContent.trim() || '';
  const storyKo = document.getElementById('story-ko-text')?.textContent.trim() || '';

  const fields = [
    { label: '1. 프로젝트명 (Project Name)', value: 'PIXEL PENGUIN (Pixel Penguin 10K)' },
    { label: '2. 발행자 명 (Issuer / Creator)', value: 'Very Penguin Labs (베리 펭귄 랩스)' },
    { label: '3. 심볼 (Symbol)', value: 'PPENG' },
    { label: '4. 공식 홈페이지 링크 (Official Website · 단독 링크)', value: siteUrl },
    { label: '5. 프로젝트 설명 — 영문 (VERY PUNKS 레퍼런스 스타일)', value: storyEn },
    { label: '6. 프로젝트 설명 / 취지 — 국문', value: storyKo },
    {
      label: '7. 민팅 및 마켓 스펙 요약',
      value: '체인: VERY Mainnet (4613) | 토큰 표준: ERC-721 | 공급량: 10,000 (1/1 GIF 11종 + 48×48 제너레이티브 9,989종) | 민팅 일정: 2026년 10월 23일 (금) | 민팅가: 1 VERY | VERY 소각: 거래 금액의 5% (0x0000...dEaD) | 컬렉션 수수료: 0%',
    },
  ];

  container.innerHTML = fields
    .map(
      (f, idx) => `
    <div class="copy-row-box">
      <div style="flex:1; min-width:0;">
        <div style="font-size:12px; color:var(--accent-ice); font-weight:800; margin-bottom:4px;">${escapeHtml(f.label)}</div>
        <div style="font-size:13.5px; color:#fff; word-break:break-word; line-height:1.55;" id="sub-val-${idx}">${escapeHtml(f.value)}</div>
      </div>
      <button type="button" class="copy-mini-btn" data-idx="${idx}">복사</button>
    </div>
  `
    )
    .join('');

  container.querySelectorAll('.copy-mini-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      navigator.clipboard.writeText(fields[idx].value);
      const orig = btn.textContent;
      btn.textContent = '✓ 복사됨!';
      setTimeout(() => {
        btn.textContent = orig;
      }, 1500);
    });
  });

  const copyAllBtn = document.getElementById('copy-all-submission-btn');
  if (copyAllBtn) {
    copyAllBtn.onclick = () => {
      const allText = [
        `[베리챗(VeryChat) NFT 마켓 공식 등록 정보]`,
        `• 프로젝트명: PIXEL PENGUIN (Pixel Penguin 10K)`,
        `• 발행자 명: Very Penguin Labs (베리 펭귄 랩스)`,
        `• 심볼(Symbol): PPENG`,
        `• 체인 / 표준: VERY Mainnet (4613) / ERC-721`,
        `• 총 공급량: 10,000 (1-of-1 Animated GIF 11종 + 48×48 Generative PNG 9,989종)`,
        `• 민팅 일정 / 가격: 2026년 10월 23일(금) / 1 VERY`,
        `• VERY 소각 / 컬렉션 수수료: 거래 금액의 5% (0x0000...dEaD) / 0%`,
        `• 공식 홈페이지(🌐 단독 링크): ${siteUrl}`,
        ``,
        `[컬렉션 소개 (EN - VERY PUNKS Reference Style)]`,
        storyEn,
        ``,
        `[프로젝트 설명 및 기획 취지 (KO)]`,
        storyKo,
      ].join('\n');

      navigator.clipboard.writeText(allText);
      const orig = copyAllBtn.textContent;
      copyAllBtn.textContent = '✓ 전체 항목이 클립보드에 복사되었습니다!';
      setTimeout(() => {
        copyAllBtn.textContent = orig;
      }, 2000);
    };
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  startMintCountdown();
  initPfpStudio();

  // Language buttons
  document.querySelectorAll('.lang-btn[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  // Navigation Tabs
  document.querySelectorAll('.market-tab').forEach((tab) => {
    tab.addEventListener('click', () => scrollToSection(tab.dataset.target));
  });

  // Update official website display
  const urlDisplay = document.getElementById('official-url-display');
  const globeLink = document.getElementById('official-globe-link');
  if (urlDisplay) urlDisplay.textContent = window.location.origin;
  if (globeLink) globeLink.href = window.location.origin;

  // Modal Close Events
  document.getElementById('close-token-modal')?.addEventListener('click', closeTokenModal);
  document.getElementById('token-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'token-modal') closeTokenModal();
  });

  const subModal = document.getElementById('submission-modal');
  const openSubModal = () => {
    buildSubmissionModal();
    subModal?.classList.add('open');
  };
  document.getElementById('open-submission-modal-btn')?.addEventListener('click', openSubModal);
  document.getElementById('open-submission-modal-btn-2')?.addEventListener('click', openSubModal);
  document.getElementById('close-submission-modal')?.addEventListener('click', () => {
    subModal?.classList.remove('open');
  });
  subModal?.addEventListener('click', (e) => {
    if (e.target.id === 'submission-modal') subModal.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTokenModal();
      subModal?.classList.remove('open');
    }
  });

  // Explorer Controls
  let searchTimer = null;
  document.getElementById('exp-search')?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      CURRENT_PAGE = 1;
      fetchExplorerTokens();
    }, 220);
  });

  ['exp-tier', 'exp-edition', 'exp-sort'].forEach((id) => {
    document.getElementById(id)?.addEventListener('change', () => {
      CURRENT_PAGE = 1;
      fetchExplorerTokens();
    });
  });

  document.getElementById('exp-reset-btn')?.addEventListener('click', () => {
    document.getElementById('exp-search').value = '';
    document.getElementById('exp-tier').value = '';
    document.getElementById('exp-edition').value = '';
    document.getElementById('exp-sort').value = 'rank_asc';
    document.querySelectorAll('.exp-cat-select').forEach((s) => {
      s.value = '';
    });
    CURRENT_PAGE = 1;
    fetchExplorerTokens();
  });

  // Pagination Buttons
  document.getElementById('page-first-btn')?.addEventListener('click', () => {
    CURRENT_PAGE = 1;
    fetchExplorerTokens();
  });
  document.getElementById('page-prev-btn')?.addEventListener('click', () => {
    if (CURRENT_PAGE > 1) {
      CURRENT_PAGE--;
      fetchExplorerTokens();
    }
  });
  document.getElementById('page-next-btn')?.addEventListener('click', () => {
    if (CURRENT_PAGE < TOTAL_PAGES) {
      CURRENT_PAGE++;
      fetchExplorerTokens();
    }
  });
  document.getElementById('page-last-btn')?.addEventListener('click', () => {
    CURRENT_PAGE = TOTAL_PAGES;
    fetchExplorerTokens();
  });

  // Load Initial Config & Data
  try {
    const res = await fetch('/api/config');
    APP_CONFIG = await res.json();
    renderSpecialsGrid(APP_CONFIG.specials);
    buildExplorerTraitDropdowns();
    renderTraitDirectory();
    loadPfpPreview(1);
    fetchExplorerTokens();
  } catch (err) {
    console.error('Failed to initialize config:', err);
  }
});
