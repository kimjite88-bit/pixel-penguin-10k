/**
 * PIXEL PENGUIN (Pixel Penguin 10K · Symbol: PPENG) — Frontend Application & 48x48 Pixel Motion Engine
 * Issued by @happy Ahndoge on VERY Mainnet (4613)
 */

let APP_CONFIG = null;
// English by default (most visitors from launch on are from abroad); a KR / EN pick is remembered
const LANG_STORE = 'ppeng-lang';
let CURRENT_LANG = (() => {
  try {
    const saved = localStorage.getItem(LANG_STORE);
    if (saved === 'ko' || saved === 'en') return saved;
  } catch (e) {}
  // A shared ranking link carries the sharer's language (?lang=ko); a saved pick still wins
  try {
    if (new URLSearchParams(window.location.search).get('lang') === 'ko') return 'ko';
  } catch (e) {}
  return 'en';
})();
let CURRENT_PAGE = 1;
let TOTAL_PAGES = 1;
let CURRENT_PFP_TOKEN = 4441;
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
  Background: '배경',
  Aura: '오라',
  Back: '등 소품',
  Species: '깃털 스킨',
  Clothes: '의상',
  Eyes: '눈',
  Mouth: '입 소품',
  Eyewear: '안경',
  Hat: '모자',
  Prop: '종합 소품',
};

// Featured Generative Penguins from our 10,000 Collection (0-based #0 ~ #9,999)
const CURATED_BEAUTY_14 = [
  {
    edition: 4441,
    id: 'P4441',
    isSpecial: false,
    tier: 'Common',
    rank: 9811,
    score: '87.1',
    shortKo: '선글라스 펭귄',
    shortEn: 'Pixel Shades',
    titleKo: '#4441 선글라스 펭귄 (P4441)',
    titleEn: '#4441 Pixel Shades Penguin',
    themeKo: 'Common · Glacier Sky & Pixel Shades',
    themeEn: 'Common · Glacier Sky & Pixel Shades',
    noteKo: '파란 하늘에 픽셀 선글라스 낀 정감 가는 자식입니다.',
    noteEn: 'Blue sky and pixel shades.',
  },
  {
    edition: 962,
    id: 'P0962',
    isSpecial: false,
    tier: 'Mythic',
    rank: 12,
    score: '1,914.93',
    shortKo: '여우 잠옷 펭귄',
    shortEn: 'Fox Onesie',
    titleKo: '#962 여우 잠옷 입고 윙크하는 자식 (Fox Onesie)',
    titleEn: '#962 Fox Onesie Penguin (Mythic)',
    themeKo: 'Mythic · Rank #12 · Fox Onesie & Wink',
    themeEn: 'Mythic · Rank #12 · Fox Onesie & Wink',
    noteKo:
      '펭귄인데 여우 후드 잠옷(Fox Onesie) 뒤집어쓰고 윙크하는 귀여운 자식입니다. 일반 픽셀 펭귄들 중 희귀도 점수 1등(전체 #12, Mythic)으로 뽑혔는데, 역시나 뭐 주는 건 없습니다.',
    noteEn:
      'A penguin wearing a fox onesie and winking. Highest rarity.tools score among static pixel penguins (Rank #12, Mythic), though it still gives zero perks.',
  },
  {
    edition: 6521,
    id: 'P6521',
    isSpecial: false,
    tier: 'Mythic',
    rank: 15,
    score: '1,839.98',
    shortKo: '게코 후드 펭귄',
    shortEn: 'Gecko Onesie',
    titleKo: '#6521 도마뱀 후드 뒤집어쓴 자식 (Gecko Onesie)',
    titleEn: '#6521 Dreamglow Gecko Onesie (Mythic)',
    themeKo: 'Mythic · Rank #15 · Dreamglow & Gecko Onesie',
    themeEn: 'Mythic · Rank #15 · Dreamglow & Gecko Onesie',
    noteKo:
      '희귀한 드림글로우 스킨이랑 초록 도마뱀 후드가 겹쳐서 전체 15등(Mythic)에 오른 귀한 자식입니다. 눈웃음 짓고 있어서 프사로 쓰기 딱 좋습니다.',
    noteEn:
      'Ranked #15 (Mythic) thanks to its rare Dreamglow skin and Gecko Onesie hood. Smiling eyes make it a great PFP.',
  },
  {
    edition: 42,
    id: 'P0042',
    isSpecial: false,
    tier: 'Legendary',
    rank: 187,
    score: '517.67',
    shortKo: '꽃화관 빙어 낚시',
    shortEn: 'Floral Angler',
    titleKo: '#42 꽃화관 쓰고 빙어 낚는 자식 (Floral Wreath Angler)',
    titleEn: '#42 Floral Wreath Ice Angler (Legendary)',
    themeKo: 'Legendary · Rank #187 · Floral Wreath & Arctic Smelt',
    themeEn: 'Legendary · Rank #187 · Floral Wreath & Arctic Smelt',
    noteKo:
      '머리에 꽃화관 얹고 낚싯대에 빙어까지 물고 있는 알짜배기 자식입니다. 꼭 1등짜리 아니어도 이렇게 조합 이쁘게 뽑힌 애들이 수두룩합니다.',
    noteEn:
      'Wearing a floral wreath while catching an arctic smelt. Proof that you do not need a #1 rank to get an adorable combination.',
  },
  {
    edition: 499,
    id: 'P0499',
    isSpecial: false,
    tier: 'Mythic',
    rank: 46,
    score: '932.31',
    shortKo: '크리스탈 나이트',
    shortEn: 'Crystal Knight',
    titleKo: '#499 투구 쓰고 비눗방울 부는 자식 (Crystal Knight)',
    titleEn: '#499 Crystal Knight Helmet & Bubble Pipe',
    themeKo: 'Mythic · Rank #46 · Crystal Helmet & Bubble Pipe',
    themeEn: 'Mythic · Rank #46 · Crystal Helmet & Bubble Pipe',
    noteKo:
      '비장하게 기사 투구랑 지팡이 들어놓고 입에는 조개 비눗방울 파이프 물고 있는 하찮고 귀여운 자식입니다.',
    noteEn:
      'Wearing a serious knight helmet and frost staff while blowing bubbles from a seashell pipe—goofy and cute.',
  },
  {
    edition: 74,
    id: 'P0074',
    isSpecial: false,
    tier: 'Legendary',
    rank: 162,
    score: '550.29',
    shortKo: '빙하 왕관 과잠',
    shortEn: 'Glacier Varsity',
    titleKo: '#74 용암 동굴에서 과잠 입은 자식 (Glacier Crown)',
    titleEn: '#74 Glacier Crown & Varsity Jacket',
    themeKo: 'Legendary · Rank #162 · Glacier Crown & Varsity Jacket',
    themeEn: 'Legendary · Rank #162 · Glacier Crown & Varsity Jacket',
    noteKo:
      '뜨거운 용암 동굴 배경에 얼음 왕관 쓰고 파란 과잠(Varsity Jacket) 입은 청개구리 같은 자식입니다.',
    noteEn:
      'Wearing an ice crown and blue varsity jacket inside a hot lava cave—a delightfully contradictory penguin.',
  },
  {
    edition: 191,
    id: 'P0191',
    isSpecial: false,
    tier: 'Common',
    rank: 7788,
    score: '146.63',
    shortKo: '군밤장수 털모자',
    shortEn: 'Polar Ushanka',
    titleKo: '#191 민트 배경에 털모자 쓴 초코 펭귄 (Polar Ushanka)',
    titleEn: '#191 Polar Ushanka & Cocoa Penguin (Common)',
    themeKo: 'Common · Rank #7,788 · Kelp Mint · Polar Ushanka',
    themeEn: 'Common · Rank #7,788 · Kelp Mint · Polar Ushanka',
    noteKo:
      '희귀도 순위는 7,788등(Common)이지만 민트색 배경에 코코아 색 깃털이랑 털모자 조합이 아주 기가 막히게 귀여운 자식입니다.',
    noteEn:
      'Ranked #7,788 (Common), but the mint background, cocoa feathers, and plush ushanka hat make it ridiculously cute.',
  },
  {
    edition: 20,
    id: 'P0020',
    isSpecial: false,
    tier: 'Common',
    rank: 6885,
    score: '162.54',
    shortKo: '핑크 비니 빙어',
    shortEn: 'Pink Smelt Catch',
    titleKo: '#20 핑크 배경에 초록 비니 쓰고 빙어 문 자식',
    titleEn: '#20 Orchid Pink & Green Beanie Smelt Catcher',
    themeKo: 'Common · Rank #6,885 · Orchid Pink · Green Beanie',
    themeEn: 'Common · Rank #6,885 · Orchid Pink · Green Beanie',
    noteKo:
      '분홍색 배경에 초록 비니 쓰고 입에 빙어 한 마리 야무지게 물고 있는 귀한 자식입니다. 프사로 해두면 볼 때마다 기분 좋아집니다.',
    noteEn:
      'Pink penguin in a green beanie holding a freshly caught smelt in its beak—guaranteed to brighten up your profile.',
  },
  {
    edition: 24,
    id: 'P0024',
    isSpecial: false,
    tier: 'Uncommon',
    rank: 2785,
    score: '252.41',
    shortKo: '안전모 세일러',
    shortEn: 'Hardhat Sailor',
    titleKo: '#24 박쥐 날개 달고 노란 안전모 쓴 자식 (Hardhat Sailor)',
    titleEn: '#24 Bat Wings & Sailor Collar Hardhat (Uncommon)',
    themeKo: 'Uncommon · Rank #2,785 · Bat Wings & Hardhat',
    themeEn: 'Uncommon · Rank #2,785 · Bat Wings & Hardhat',
    noteKo:
      '세일러 카라에 박쥐 날개 달고 머리엔 공사장 노란 안전모에 밀짚까지 물고 있는 종잡을 수 없는 귀한 자식입니다.',
    noteEn:
      'Rocking a sailor collar, bat wings, a yellow construction hardhat, and a wheat straw—chaotic B-grade charm.',
  },
  {
    edition: 4275,
    id: 'P4275',
    isSpecial: false,
    tier: 'Epic',
    rank: 310,
    score: '455.85',
    shortKo: '매화 로브 윙크',
    shortEn: 'Plum Robe Wink',
    titleKo: '#4275 프리즘 후광에 비눗방울 부는 자식 (Plum Robe)',
    titleEn: '#4275 Glacier Prism & Bubble Pipe Wink (Epic)',
    themeKo: 'Epic · Rank #310 · Glacier Prism & Wink',
    themeEn: 'Epic · Rank #310 · Glacier Prism & Wink',
    noteKo:
      '프리즘 후광이랑 매화 로브가 겹쳐서 전체 310등(Epic)에 오른 자식입니다. 어차피 등급 높아도 주는 건 똑같이 없습니다.',
    noteEn:
      'Ranked #310 (Epic) thanks to its Glacier Prism aura and Plum Blossom robe. Higher tier still means zero utility.',
  },
  {
    edition: 87,
    id: 'P0087',
    isSpecial: false,
    tier: 'Common',
    rank: 6044,
    score: '177.49',
    shortKo: '초록 비니 과잠',
    shortEn: 'Beanie Varsity',
    titleKo: '#87 초록 비니에 파이프 물고 과잠 입은 자식',
    titleEn: '#87 Green Beanie & Blue Varsity Jacket',
    themeKo: 'Common · Rank #6,044 · Blue Varsity & Briar Pipe',
    themeEn: 'Common · Rank #6,044 · Blue Varsity & Briar Pipe',
    noteKo:
      '핑크색 배경에 파란 과잠 입고 초록 비니 쓴 복학생 느낌의 정감 가는 자식입니다. 프사로 달아두기 아주 무난하고 이쁩니다.',
    noteEn:
      'Midnight penguin in a blue varsity jacket and green beanie with a briar pipe—chill campus vibe for your PFP.',
  },
  {
    edition: 107,
    id: 'P0107',
    isSpecial: false,
    tier: 'Common',
    rank: 7545,
    score: '150.71',
    shortKo: '파란 캡모자 후드',
    shortEn: 'Blue Cap Hoodie',
    titleKo: '#107 회색 후드티에 파란 캡모자 쓴 자식',
    titleEn: '#107 Grey Hoodie & Blue Cap Penguin',
    themeKo: 'Common · Rank #7,545 · Grey Hoodie & Blue Cap',
    themeEn: 'Common · Rank #7,545 · Grey Hoodie & Blue Cap',
    noteKo:
      '살구색 깃털에 회색 후드티 입고 파란 모자 눌러쓴 뒤 입에 밀짚 하나 물고 있는 꾸안꾸 스타일 자식입니다.',
    noteEn:
      'Apricot penguin in a casual grey hoodie and blue cap chewing on a wheat straw. Effortlessly clean PFP.',
  },
  {
    edition: 311,
    id: 'P0311',
    isSpecial: false,
    tier: 'Common',
    rank: 5671,
    score: '184.47',
    shortKo: '하와이안 헤드폰',
    shortEn: 'Hawaiian Beats',
    titleKo: '#311 빨간 하와이안 셔츠에 헤드폰 낀 자식',
    titleEn: '#311 Red Hawaiian Shirt & Purple Headphones',
    themeKo: 'Common · Rank #5,671 · Hawaiian Shirt & Headphones',
    themeEn: 'Common · Rank #5,671 · Hawaiian Shirt & Headphones',
    noteKo:
      '추운 남극 출신이면서 빨간 하와이안 셔츠 입고 선글라스에 보라색 헤드폰까지 낀 흥 넘치는 자식입니다.',
    noteEn:
      'An Antarctic penguin wearing a red Hawaiian shirt, blue wayfarer sunglasses, and purple headphones.',
  },
  {
    edition: 776,
    id: 'P0776',
    isSpecial: false,
    tier: 'Uncommon',
    rank: 4419,
    score: '209.51',
    shortKo: '보안관 모자 776',
    shortEn: 'Sheriff #776',
    titleKo: '#776 민트 폴로셔츠에 보안관 모자 쓴 럭키 자식',
    titleEn: '#776 Sheriff Hat & Mint Polo Penguin',
    themeKo: 'Uncommon · Rank #4,419 · Token #776 · Sheriff Hat',
    themeEn: 'Uncommon · Rank #4,419 · Token #776 · Sheriff Hat',
    noteKo:
      '보안관 모자 쓰고 민트색 폴로셔츠 입은 초코 펭귄입니다.',
    noteEn:
      'Cocoa penguin wearing a sheriff hat and mint polo shirt.',
  },
];

// Additional Penguins for the 28-Token Dual-Row Infinite Pixel Parade (All Generative Penguins)
const PARADE_ROW_1_ITEMS = [
  { edition: 4441, labelKo: '선글라스 펭귄', labelEn: 'Pixel Shades Penguin', sub: 'Common · #4441' },
  { edition: 962, labelKo: '여우 잠옷 펭귄', labelEn: 'Fox Onesie Penguin', sub: 'Mythic · #962' },
  { edition: 6521, labelKo: '도마뱀 후드 펭귄', labelEn: 'Gecko Onesie Penguin', sub: 'Mythic · #6521' },
  { edition: 42, labelKo: '꽃화관 빙어 낚시', labelEn: 'Floral Wreath Angler', sub: 'Legendary · #42' },
  { edition: 499, labelKo: '크리스탈 나이트', labelEn: 'Crystal Knight', sub: 'Mythic · #499' },
  { edition: 74, labelKo: '빙하 왕관 과잠', labelEn: 'Glacier Varsity', sub: 'Legendary · #74' },
  { edition: 191, labelKo: '군밤장수 털모자', labelEn: 'Polar Ushanka', sub: 'Common · #191' },
  { edition: 20, labelKo: '핑크 비니 빙어', labelEn: 'Pink Smelt Catcher', sub: 'Common · #20' },
  { edition: 24, labelKo: '안전모 세일러', labelEn: 'Hardhat Sailor', sub: 'Uncommon · #24' },
  { edition: 4275, labelKo: '매화 로브 윙크', labelEn: 'Plum Robe Wink', sub: 'Epic · #4275' },
  { edition: 87, labelKo: '초록 비니 과잠', labelEn: 'Beanie Varsity', sub: 'Common · #87' },
  { edition: 107, labelKo: '파란 캡모자 후드', labelEn: 'Blue Cap Hoodie', sub: 'Common · #107' },
  { edition: 311, labelKo: '하와이안 헤드폰', labelEn: 'Hawaiian Headphones', sub: 'Common · #311' },
  { edition: 776, labelKo: '보안관 모자 776', labelEn: 'Sheriff Hat #776', sub: 'Uncommon · #776' },
];

const PARADE_ROW_2_ITEMS = [
  { edition: 11, labelKo: '픽셀 펭귄 #11', labelEn: 'Pixel Penguin #11', sub: 'Generative · #11' },
  { edition: 32, labelKo: '픽셀 펭귄 #32', labelEn: 'Pixel Penguin #32', sub: 'Generative · #32' },
  { edition: 54, labelKo: '픽셀 펭귄 #54', labelEn: 'Pixel Penguin #54', sub: 'Generative · #54' },
  { edition: 99, labelKo: '픽셀 펭귄 #99', labelEn: 'Pixel Penguin #99', sub: 'Generative · #99' },
  { edition: 255, labelKo: '픽셀 펭귄 #255', labelEn: 'Pixel Penguin #255', sub: 'Generative · #255' },
  { edition: 364, labelKo: '픽셀 펭귄 #364', labelEn: 'Pixel Penguin #364', sub: 'Generative · #364' },
  { edition: 511, labelKo: '픽셀 펭귄 #511', labelEn: 'Pixel Penguin #511', sub: 'Generative · #511' },
  { edition: 999, labelKo: '픽셀 펭귄 #999', labelEn: 'Pixel Penguin #999', sub: 'Generative · #999' },
  { edition: 1023, labelKo: '픽셀 펭귄 #1023', labelEn: 'Pixel Penguin #1023', sub: 'Generative · #1023' },
  { edition: 2025, labelKo: '픽셀 펭귄 #2025', labelEn: 'Pixel Penguin #2025', sub: 'Generative · #2025' },
  { edition: 3332, labelKo: '픽셀 펭귄 #3332', labelEn: 'Pixel Penguin #3332', sub: 'Generative · #3332' },
  { edition: 5554, labelKo: '픽셀 펭귄 #5554', labelEn: 'Pixel Penguin #5554', sub: 'Generative · #5554' },
  { edition: 8887, labelKo: '픽셀 펭귄 #8887', labelEn: 'Pixel Penguin #8887', sub: 'Generative · #8887' },
  { edition: 9999, labelKo: '픽셀 펭귄 #9999', labelEn: 'Pixel Penguin #9999', sub: 'Generative · #9999' },
];

// Menu pages (v5.23.1 had merged them into one long page; split again in v5.31.0 because it grew too heavy):
// only the open tab's page is shown, and the codex grid and the board are fetched the first time their page
// opens. A section id (sec-rarity, sec-explorer...) opens its page, then scrolls to the section.
const TAB_PAGES = {
  'tab-intro': 'tab-page-intro',
  'tab-codex': 'tab-page-codex',
  'tab-ranking': 'tab-page-ranking',
  'tab-notices': 'tab-page-notices',
};
function tabKeyFor(id) {
  if (id === 'tab-codex' || id === 'sec-explorer' || id === 'sec-rarity' || id === 'sec-traits' || id === 'sec-provenance') return 'tab-codex';
  if (id === 'tab-ranking' || id === 'sec-ranking') return 'tab-ranking';
  if (id === 'tab-notices' || id === 'sec-notices') return 'tab-notices';
  return 'tab-intro';
}
function setActiveTab(tabKey) {
  document.querySelectorAll('.market-tab').forEach((btn) => {
    const on = btn.dataset.target === tabKey;
    btn.classList.toggle('active', on);
    if (on) btn.setAttribute('aria-current', 'true');
    else btn.removeAttribute('aria-current');
  });
}
let CODEX_LOADED = false; // set by fetchExplorerTokens: the grid is fetched once its page has been opened
function showTabPage(tabKey) {
  Object.entries(TAB_PAGES).forEach(([key, pageId]) => {
    const el = document.getElementById(pageId);
    if (!el) return;
    el.style.display = key === tabKey ? 'block' : 'none';
    el.classList.toggle('active', key === tabKey);
  });
  setActiveTab(tabKey);
}
function scrollToSection(id) {
  const tabKey = tabKeyFor(id);
  if (tabKey !== 'tab-intro' && typeof exitUfoFullscreenGame === 'function') {
    exitUfoFullscreenGame();
  }
  showTabPage(tabKey);
  if (tabKey === 'tab-ranking' && typeof fetchAndRenderRankingPage === 'function') {
    fetchAndRenderRankingPage();
  }
  if (tabKey === 'tab-codex') {
    if (!CODEX_LOADED) fetchExplorerTokens();
    centerActiveTraitTab();
  }
  // A new page starts at its top (instantly: a smooth scroll over swapped content just looks broken)
  if (id === 'top' || TAB_PAGES[id]) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: 'start' });
}

// The sticky header's height is kept in --sticky-h so a section scrolled to lands below it (scroll-margin-top)
function initStickyHeaderHeight() {
  const header = document.querySelector('.site-header');
  const setStickyH = () => {
    if (header) document.documentElement.style.setProperty('--sticky-h', `${Math.round(header.getBoundingClientRect().height)}px`);
  };
  setStickyH();
  window.addEventListener('resize', setStickyH);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

// ============================================================================
// 1. FULL-VIEWPORT STEPPED PIXEL AMBIENT PARTICLE ENGINE (#pixel-ambient-canvas)
// ============================================================================
function initAmbientPixelCanvas() {
  const canvas = document.getElementById('pixel-ambient-canvas');
  if (!canvas) return;
  // Phones and reduced-motion users get a still background (saves a full-screen 60fps loop on mobile)
  if (window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) {
    canvas.remove();
    return;
  }
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const palette = [
    '#FF4D6D', // Very crimson-pink
    '#67E8F9', // Glacier cyan
    '#FBBF24', // Celestial gold
    '#C084FC', // Mythic violet
    '#34D399', // Dokkaebi emerald
    '#FFB3C1', // Maehwa blossom pink
  ];

  const count = 24;
  const particles = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: i % 5 === 0 ? 6 : 4,
    vy: -0.25 - Math.random() * 0.55,
    vx: (Math.random() - 0.5) * 0.35,
    color: palette[i % palette.length],
    phase: Math.random() * Math.PI * 2,
    isCross: i % 7 === 0,
  }));

  let frame = 0;
  function renderAmbient() {
    frame++;
    // Update on stepped cadence (every 2 frames for authentic pixel feel)
    if (frame % 2 === 0) {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx * 2;
        p.y += p.vy * 2;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;

        // Snap to 4px integer pixel grid
        const gx = Math.round(p.x / 4) * 4;
        const gy = Math.round(p.y / 4) * 4;
        const alpha = 0.22 + 0.25 * Math.sin(frame * 0.04 + p.phase);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.08, Math.min(0.55, alpha));

        if (p.isCross) {
          // 5-block pixel star cross
          const s = 4;
          ctx.fillRect(gx, gy, s, s);
          ctx.fillRect(gx - s, gy, s, s);
          ctx.fillRect(gx + s, gy, s, s);
          ctx.fillRect(gx, gy - s, s, s);
          ctx.fillRect(gx, gy + s, s, s);
        } else {
          ctx.fillRect(gx, gy, p.size, p.size);
        }
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(renderAmbient);
  }

  requestAnimationFrame(renderAmbient);
}

// ============================================================================
// 2. 5-SCENE REFERENCE MOTION GRAPHIC & UFO ESCAPE MINI-GAME ENGINE (v5.4.0)
//    Scene 0 (1. 탈출선택): Reference #1 (Empty UFO on crumbling glacier) + "탈출하시겠습니까?"
//    Scene 1 (2. 이륙모션): Reference #2 (Motion graphic: Penguin inside UFO dome blasting off)
//    Scene 2 (3. 하늘게임): Reference #3 (Actual Sky Game Stage: Stars, Warp Rings, Neon Cubes, Mines)
//    Scene 3 (4. 픽셀화): Reference #4 (UFO pulled into towering Voxel Beam & pixelating)
//    Scene 4 (5. 도착마을): seasonal pixel town arrival & welcome by pixel penguin friends
//                            (Christmas town Oct–Feb, Cherry Blossom town Mar–Sep)
// ============================================================================
const SCENE_DURATIONS = [99999999, 2600, 99999999, 7000, 99999999]; // scene 4: approach + scan + rise (scene-pull.js)

// Scene 5 town follows the season. ?town=xmas or ?town=cherry forces one (preview the other season).
const INTRO_TOWN = (() => {
  let forced = '';
  try {
    forced = new URLSearchParams(window.location.search).get('town') || '';
  } catch (e) {
    forced = '';
  }
  const month = new Date().getMonth() + 1;
  const id =
    forced === 'xmas' || forced === 'cherry' ? forced : month >= 3 && month <= 9 ? 'cherry' : 'xmas';
  if (id === 'xmas') {
    return {
      id,
      ko: '크리스마스 마을',
      koPixel: '크리스마스 픽셀마을',
      koGround: '눈밭',
      en: 'Christmas Town',
      bg: '/assets/motion_sprites/bg_scene5_xmas.jpg?v=5.7.1',
    };
  }
  return {
    id,
    ko: '벚꽃마을',
    koPixel: '벚꽃 픽셀마을',
    koGround: '바닥',
    en: 'Cherry Blossom Town',
    bg: '/assets/motion_sprites/bg_scene2_pixel.jpg?v=4.9.0',
  };
})();

// Town penguins are sized to the pilots who land among them. Measured opaque widths (alpha > 40): a native
// species frame is 171 of 256 px wide, a pilot pixel frame 29 of 48. Every vehicle lands at TOWN_VEHICLE_SCALE,
// so each pilot box is 79 px and its penguin 79 * 29 / 48 = 47.7 px wide; a native matches that in a
// 47.7 / (171 / 256) = 71 px box. (Before: natives 124 px = 83 px wide vs pilots 43-62 px, 1.3-1.9x too big.)
const TOWN_VEHICLE_SCALE = 1.0;
const TOWN_PENGUIN_SIZE = 71;
const TOWN_FEET_Y = 460; // walkway line the penguins stand on
const TOWN_BODY_L = 44 / 256; // opaque columns of a native frame
const TOWN_BODY_R = 214 / 256;
// Row spacing by the Gestalt proximity principle (closer = one group): the natives stand close together (gap g
// between bodies) and the vehicle / guest penguin and the tree are set apart from them by 2g, so the row reads as
// [vehicle] [six natives] [tree]. The natives fill the walkway from the widest vehicle's nose (the ship's, x = 390)
// to the tree at its original spot on the right (centre 846, widest tier 59 px each side).
const TOWN_ROW_LEFT = 390;
const TOWN_TREE_CX = 846;
const TOWN_TREE_HALF = 59;
const TOWN_NATIVES = 6;
// Skip mode has no vehicle on the left, so the whole group (guest + natives + tree) is centred on the stage
// instead, keeping the same 1 : 2 gap ratio and the tree in the right fifth (centre x = 790)
const TOWN_SKIP_TREE_CX = 790;

// Town command box (10,000 도감 / 다시 플레이). On a phone (stageUiK) the box and its text are drawn 1.5x; the
// click and hover areas use the same numbers.
// Scene 5 talk timing after a crash landing (ms from the scene start). The vehicle falls until 952 and bounces
// until 1632 (s5P 0.14 / 0.24 of 6800); the pilot speaks only once that has settled, after a short beat (the
// action -> reaction order of the animation principles), and keeps the line up long enough to read: ~38 Korean
// characters at ~12 per second (the rate given for Korean subtitles) is ~3.2 s. Then the locals take turns.
// The town runs on a beat (audio.js plays Jingle Bells on it): 141 BPM, so one talk turn (3400 ms) is two bars.
// After a crash landing the song's first note is the impact (952 ms) and the locals start on beat 10 of it; in
// skip mode the song starts with the scene and the 3400 ms turns already fall on bars.
const TOWN_BEAT_MS = 425;
function townBeatT0() {
  return MOTION_STATE.skippedEscape ? 0 : 952;
}
// Beats since the song's first note (negative before it)
function townBeat(now) {
  return (now - MOTION_STATE.sceneStartTime - townBeatT0()) / TOWN_BEAT_MS;
}
const TOWN_TALK = { pilotFrom: 1800, friendsFrom: 952 + 10 * TOWN_BEAT_MS, turnMs: 8 * TOWN_BEAT_MS };

// Phone town layout. Stage text is 1.6x there, so the top stack (banner 10-66, logo, 1.5x menu) used to push the
// speech bubbles down onto the landed pilot's head (~y 305). On phones the logo is drawn at 0.65x so the menu sits
// at y 158 (bubbles from y 289), and the town picture is zoomed TOWN_PHONE_ZOOM about its top centre so the
// walkway, and everything standing on it, comes down townDrop() px (58): the pilot's head is then at ~y 363.
const TOWN_PHONE_ZOOM = 1.125;
const TOWN_PHONE_LOGO = { top: 70, scale: 0.65, menuY: 158 };
function townPhone() {
  return stageUiK() > 1;
}
function townDrop() {
  return townPhone() ? Math.round(TOWN_FEET_Y * (TOWN_PHONE_ZOOM - 1)) : 0;
}

function townMenuLayout() {
  // In the hidden village (town-easter.js) the box moves to the top left, a little smaller, off the picture's heart
  if (typeof townEasterCovers === 'function' && townEasterCovers(performance.now() - MOTION_STATE.sceneStartTime)) {
    const k = stageUiK() > 1 ? 1.15 : 0.8;
    const w = 332 * k;
    const h = 78 * k;
    const x = 14;
    const y = 54 * (stageUiK() > 1 ? 1.3 : 1);
    return { k, w, h, x, y, rowY: (i) => y + (24 + i * 30) * k, split: y + 39 * k };
  }
  const k = stageUiK() > 1 ? 1.5 : 1;
  const w = 332 * k;
  const h = 78 * k;
  const x = 480 - w / 2;
  const y = k > 1 ? TOWN_PHONE_LOGO.menuY : 176;
  return { k, w, h, x, y, rowY: (i) => y + (24 + i * 30) * k, split: y + 39 * k };
}

// The town's RPG command box (10,000 CODEX / PLAY AGAIN); returns its layout (clicks use townMenuLayout too)
function drawTownMenuBox(ctx) {
  const menu = townMenuLayout();
  const mk = menu.k;
  const menuW = menu.w;
  const menuH = menu.h;
  const menuX = menu.x;
  const menuY = menu.y;

  ctx.fillStyle = 'rgba(9, 11, 20, 0.55)';
  ctx.fillRect(menuX + 4, menuY + 6, menuW + 4, menuH + 4);
  ctx.fillStyle = '#090b14';
  ctx.fillRect(menuX - 5, menuY - 5, menuW + 10, menuH + 10);
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(menuX - 3, menuY - 3, menuW + 6, menuH + 6);
  ctx.fillStyle = '#334155';
  ctx.fillRect(menuX - 1, menuY - 1, menuW + 2, menuH + 2);
  ctx.fillStyle = 'rgba(18, 22, 41, 0.94)';
  ctx.fillRect(menuX, menuY, menuW, menuH);

  const menuItems =
    CURRENT_LANG === 'ko'
      ? ['10,000 도감도 보러가기', '다시 플레이하기']
      : ['10,000 CODEX', 'PLAY AGAIN'];

  menuItems.forEach((mText, idx) => {
    const rowY = menu.rowY(idx);
    const isSelected = (MOTION_STATE.menuHoverIdx % 2) === idx;
    if (isSelected) {
      ctx.fillStyle = 'rgba(255, 77, 109, 0.22)';
      ctx.fillRect(menuX + 10 * mk, rowY - 12 * mk, menuW - 20 * mk, 24 * mk);
      drawPixelHeart(ctx, menuX + 28 * mk, rowY, 2.3 * mk, '#ff4d6d');
    }
    ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
    ctx.font = `900 ${15 * mk}px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(mText, menuX + 46 * mk, rowY + 1);
  });
  return menu;
}


// Row layout (see TOWN_ROW_LEFT): solve 5 g + 2 * 2g = free width, then place the six natives and the guest.
// Skip mode: the guest takes the vehicle's place, so solve guest + 5 g + 2 * 2g between a left edge and the tree
// that mirror each other about x = 480 (g = 32 px).
function scene5RowLayout(skipped = false) {
  const N = TOWN_PENGUIN_SIZE;
  const body = N * (TOWN_BODY_R - TOWN_BODY_L); // 47.4 px
  let treeCx = TOWN_TREE_CX;
  let left = TOWN_ROW_LEFT;
  let g;
  if (skipped) {
    treeCx = TOWN_SKIP_TREE_CX;
    const groupLeft = 960 - (treeCx + TOWN_TREE_HALF);
    g = (treeCx - TOWN_TREE_HALF - groupLeft - (TOWN_NATIVES + 1) * body) / (TOWN_NATIVES - 1 + 4);
    left = groupLeft + body; // the guest's right edge plays the vehicle's nose
  } else {
    g = (treeCx - TOWN_TREE_HALF - left - TOWN_NATIVES * body) / (TOWN_NATIVES - 1 + 4); // 12.5 px
  }
  const firstLeft = left + 2 * g;
  const friendsX = Array.from({ length: TOWN_NATIVES }, (_, i) => Math.round(firstLeft + i * (body + g) - N * TOWN_BODY_L));
  // Skip mode: the default penguin stands where the vehicle would be, 2g left of the natives
  const heroX = Math.round(firstLeft - 2 * g - body - N * TOWN_BODY_L);
  return { friendsX, treeCx, heroX, gap: g };
}

// Escape vehicle picked on the first screen: 'ufo' = light plane (sky-runner.js), 'car' (car-runner.js) or 'boat' =
// icebreaker (boat-runner.js). ?vehicle=car|ufo|boat forces one; otherwise the last pick on this device.
const ESCAPE_VEHICLES = ['ufo', 'boat', 'car'];
const VEHICLE_STORAGE_KEY = 'ppeng_vehicle';
function readInitialVehicle() {
  try {
    const forced = new URLSearchParams(window.location.search).get('vehicle');
    if (ESCAPE_VEHICLES.includes(forced)) return forced;
  } catch (e) {
    // Fall through to the saved pick
  }
  try {
    const saved = window.localStorage.getItem(VEHICLE_STORAGE_KEY);
    if (ESCAPE_VEHICLES.includes(saved)) return saved;
  } catch (e) {
    // Storage blocked (private mode, some WebViews)
  }
  return 'ufo';
}

const MOTION_STATE = {
  sceneIdx: 0,
  vehicle: readInitialVehicle(),
  autoPlay: true,
  isFullscreen: false,
  skippedEscape: false,
  sceneStartTime: performance.now(),
  scene0Launching: false,
  scene0LaunchStartTime: 0,
  hero2DImg: null,
  hero2DLoaded: false,
  hero2DSheet: null,
  hero2DSheetLoaded: false,
  recolored2DSheets: new Map(), // spId -> offscreen canvas of hero_2d_sheet recolored to match Species feather skin
  bgRefScene1Img: null,
  bgRefScene1Loaded: false,
  bgRefVortexImg: null,
  bgRefVortexLoaded: false,
  bgRefSkyGameImg: null,
  bgRefSkyGameLoaded: false,
  bgScene1Img: null,
  bgScene1Loaded: false,
  bgScene2Img: null,
  bgScene2Loaded: false,
  speciesSprites: new Map(),
  menuHoverIdx: 0,
};

// Category #1 (깃털스킨 Species) -> 22 Sprite Sheet ID ('01' ~ '22') Mapping (100% Exact Match with collection_10k.json)
const SPECIES_NAME_TO_ID = {
  'Classic': '01',
  'Cocoa Penguin (Brown)': '02',
  'Midnight Penguin': '03',
  'Apricot Penguin (Orange)': '04',
  'Rose Penguin (Pink)': '05',
  'Violet Penguin (Purple)': '06',
  'Snow Penguin (Snow)': '07',
  'Dune Penguin (Sand)': '08',
  'Jade Penguin (Forest)': '09',
  'Ember Penguin (Ember)': '10',
  'Bone Penguin (Skeleton)': '11',
  'Glacier Penguin (Ice)': '12',
  'Reef Penguin (Sea)': '13',
  'Chrome Penguin (Cyber)': '14',
  'Gold Penguin (Golden)': '15',
  'Ancient Stone Penguin (Ancient)': '16',
  'Abyssal Penguin (Eldritch Horror)': '17',
  'Stormcloud Penguin (Storm)': '18',
  'Dreamglow Penguin (Dream)': '19',
  'Demon Penguin (Demon)': '20',
  'Blaze Penguin (Fire)': '21',
  'Pearl Penguin (Lavender)': '22',
  // 11 Special Genesis Species (#0 ~ #10)
  'Abyssal Sapphire': '01',
  'Celestial Azure': '12',
  'Chronos Navy': '18',
  'Cyber Neon Navy': '13',
  'Glacier Sapphire': '12',
  'Infernal Demon': '20',
  'Midnight Slate': '03',
  'Deep Sapphire': '01',
  'Shadow Vigilante (Dark Hero)': '03',
};

// Exact Feather RGB Palettes [mainRGB, shadeRGB] sampled directly from sp_01.png ~ sp_22.png
const SPECIES_FEATHER_RGB = {
  '01': [[18, 82, 209], [4, 58, 164]],
  '02': [[106, 63, 35], [79, 45, 24]],
  '03': [[39, 39, 52], [27, 27, 38]],
  '04': [[187, 101, 27], [138, 71, 17]],
  '05': [[180, 66, 106], [133, 43, 76]],
  '06': [[98, 55, 169], [70, 37, 127]],
  '07': [[168, 181, 201], [121, 133, 154]],
  '08': [[164, 132, 81], [122, 96, 55]],
  '09': [[31, 130, 87], [21, 95, 62]],
  '10': [[161, 44, 27], [118, 30, 19]],
  '11': [[135, 129, 116], [97, 92, 82]],
  '12': [[86, 150, 196], [57, 109, 149]],
  '13': [[77, 81, 178], [55, 56, 136]],
  '14': [[103, 113, 128], [73, 81, 93]],
  '15': [[190, 134, 23], [141, 95, 14]],
  '16': [[98, 102, 108], [71, 74, 80]],
  '17': [[39, 109, 65], [27, 79, 47]],
  '18': [[88, 105, 145], [61, 74, 108]],
  '19': [[108, 61, 187], [77, 40, 142]],
  '20': [[105, 24, 31], [73, 18, 23]],
  '21': [[181, 57, 26], [134, 39, 18]],
  '22': [[30, 123, 129], [21, 91, 96]],
};

function getHero2DSheetForSpecies(spId = '01') {
  ensureHero2DSprite();
  const key = String(spId).padStart(2, '0');
  if (key === '01' || !MOTION_STATE.hero2DSheetLoaded || !MOTION_STATE.hero2DSheet) {
    return MOTION_STATE.hero2DSheet;
  }
  if (MOTION_STATE.recolored2DSheets.has(key)) {
    return MOTION_STATE.recolored2DSheets.get(key);
  }
  const pal = SPECIES_FEATHER_RGB[key];
  if (!pal) return MOTION_STATE.hero2DSheet;

  try {
    const srcSheet = MOTION_STATE.hero2DSheet;
    const w = srcSheet.naturalWidth || 1792;
    const h = srcSheet.naturalHeight || 256;
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');
    octx.drawImage(srcSheet, 0, 0);
    const imgData = octx.getImageData(0, 0, w, h);
    const d = imgData.data;
    const [mainRGB, shadeRGB] = pal;

    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (a < 25) continue;
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      // Detect blue feather pixels of hero_2d_sheet while preserving white belly/eyes, dark outlines, and orange/yellow beak
      if (b > r + 26 && b > g + 10) {
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 96;
        const t = Math.max(0, Math.min(1.35, lum));
        if (t <= 1) {
          d[i] = Math.round(shadeRGB[0] + (mainRGB[0] - shadeRGB[0]) * t);
          d[i + 1] = Math.round(shadeRGB[1] + (mainRGB[1] - shadeRGB[1]) * t);
          d[i + 2] = Math.round(shadeRGB[2] + (mainRGB[2] - shadeRGB[2]) * t);
        } else {
          const boost = t - 1;
          d[i] = Math.min(255, Math.round(mainRGB[0] + (255 - mainRGB[0]) * boost * 0.55));
          d[i + 1] = Math.min(255, Math.round(mainRGB[1] + (255 - mainRGB[1]) * boost * 0.55));
          d[i + 2] = Math.min(255, Math.round(mainRGB[2] + (255 - mainRGB[2]) * boost * 0.55));
        }
      }
    }
    octx.putImageData(imgData, 0, 0);
    MOTION_STATE.recolored2DSheets.set(key, off);
    return off;
  } catch (e) {
    return MOTION_STATE.hero2DSheet;
  }
}

// ============================================================================
// PILOT + RESULT STATE shared by both vehicles (name kept from the UFO days: saved picks and the leaderboard
// still call the plane board 'ufo'). The flying run itself lives in sky-runner.js, the car in car-runner.js.
// Protagonist: Selected NFT Penguin (Category #1 Feather Skin) OR Default Blue Penguin ('없음')
// ============================================================================
const UFO_GAME = {
  hasNft: false, // false = '없음 (기록 안 남음)', true = NFT #0~#9999 boarded & records score!
  pilotTokenId: null,
  pilotSpeciesId: '01',
  pilotSpeciesLabel: '기본 파란 펭귄 (Adelie Classic)',
  score: 0,
  lastFinalScore: 0,
  lastRank: null,
  scoreSubmitted: false,
};



async function submitUfoScoreToServer(tokenId, score, kills) {
  if (
    !UFO_GAME.hasNft ||
    tokenId === null ||
    tokenId === undefined ||
    !/^\d+$/.test(String(tokenId).trim()) ||
    UFO_GAME.scoreSubmitted ||
    score <= 0
  ) {
    return;
  }
  UFO_GAME.scoreSubmitted = true;
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId: Number(String(tokenId).trim()), score, kills }),
    });
    if (res.ok) {
      const data = await res.json();
      UFO_GAME.lastRank = data.rank || null;
      UFO_GAME.lastBestScore = data.best_score || score;
      UFO_GAME.lastIsNewBest = Boolean(data.is_new_best);
      if (Array.isArray(data.items) && RANKING_GAME === 'ufo') {
        RANKING_PAGE_CACHE = data.items;
        renderRankingPageList();
      }
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

function updateUfoBoardingDockUI() {
  const badgeEl = document.getElementById('ufo-pilot-skin-badge');
  const s1InputEl = document.getElementById('scene1-nft-input');
  const s1SubEl = document.getElementById('s1-overlay-sub');

  if (badgeEl) {
    if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
      const code = `P${String(UFO_GAME.pilotTokenId).padStart(4, '0')}`;
      const summary = UFO_GAME.pilotTraitsSummary || UFO_GAME.pilotSpeciesLabel;
      badgeEl.textContent = `#${UFO_GAME.pilotTokenId} (${code}) · ${summary}`;
    } else {
      badgeEl.textContent = CURRENT_LANG === 'ko' ? '기본 펭귄 · 기록 안 됨' : 'Default penguin · not recorded';
    }
  }

  if (s1SubEl) {
    if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
      const summary = UFO_GAME.pilotTraitsSummary || UFO_GAME.pilotSpeciesLabel;
      s1SubEl.textContent =
        CURRENT_LANG === 'ko'
          ? `#${UFO_GAME.pilotTokenId} 탑승 · ${summary}`
          : `#${UFO_GAME.pilotTokenId} on board · ${summary}`;
      s1SubEl.style.color = '#fde047';
    } else {
      s1SubEl.textContent =
        CURRENT_LANG === 'ko'
          ? '번호를 넣으면 최고점 기록 · 비우면 기록 없음'
          : 'Your NFT # saves your high score · blank = unrecorded';
      s1SubEl.style.color = '';
    }
  }

  const valStr = UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null ? String(UFO_GAME.pilotTokenId) : '';
  if (s1InputEl && document.activeElement !== s1InputEl) {
    s1InputEl.value = valStr;
  }
}

// ============================================================================
// MODULAR 6-PART (SPECIES, CLOTHES, EYES, MOUTH, EYEWEAR, HAT) 2D & PIXEL COMPOSITOR
// Excludes Background, Aura, Back; supports #0~#10 Genesis & #11~#9999 Generative NFTs
// ============================================================================
let PARTS_MANIFEST_PROMISE = null;
let PARTS_MANIFEST_DATA = null;
const PARTS_ASSET_VER = '5.5.3';
const PILOT_PART_IMG_CACHE = new Map();
const PILOT_COMPOSED_CACHE = new Map(); // key -> { sheet2D, sheetPixel } (complete composites only)
// Pilot rectangle inside the UFO cockpit (48x48 / 288x288 frame -> local units). Bottom row tucks behind the
// collar at y = +9 and the tallest hats / flame crests stay under the y = -68 dome arch (FQL dome-fit audit).
const PILOT_DRAW_RECT = { x: -44, y: -70, size: 79 };

function ensurePartsManifest() {
  if (PARTS_MANIFEST_DATA) return Promise.resolve(PARTS_MANIFEST_DATA);
  if (PARTS_MANIFEST_PROMISE) return PARTS_MANIFEST_PROMISE;
  PARTS_MANIFEST_PROMISE = fetch(`/assets/parts_manifest.json?v=${PARTS_ASSET_VER}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((data) => {
      PARTS_MANIFEST_DATA = data;
      // Never pin a failed fetch: the next pilot build asks again
      if (!data) PARTS_MANIFEST_PROMISE = null;
      return data;
    });
  return PARTS_MANIFEST_PROMISE;
}

// A part that fails to load (flaky mobile network, server restart) is retried and never cached as missing;
// a cached null species base is what made pilots render as "invisible" (only eyes, clothes and hat).
function loadPilotPartImg(url) {
  if (PILOT_PART_IMG_CACHE.has(url)) {
    return PILOT_PART_IMG_CACHE.get(url);
  }
  const p = new Promise((resolve) => {
    const tryLoad = (attempt) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (attempt < 2) {
          setTimeout(() => tryLoad(attempt + 1), 350 * (attempt + 1));
        } else {
          PILOT_PART_IMG_CACHE.delete(url);
          resolve(null);
        }
      };
      img.src = `${url}?v=${PARTS_ASSET_VER}${attempt ? `&retry=${attempt}` : ''}`;
    };
    tryLoad(0);
  });
  PILOT_PART_IMG_CACHE.set(url, p);
  return p;
}

function hexToRgbArr(hex) {
  const h = String(hex).replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

async function buildModularPilotSheets(tokenNum, traitsObj = null) {
  const cacheKey = tokenNum === null ? 'DEFAULT_CLASSIC' : `NFT_${tokenNum}`;
  if (PILOT_COMPOSED_CACHE.has(cacheKey)) {
    return PILOT_COMPOSED_CACHE.get(cacheKey);
  }

  // Case 1: Special Genesis #0 ~ #10 (Pre-built 3-frame sheets for 2D 864x288 & Pixel 144x48)
  if (tokenNum !== null && tokenNum >= 0 && tokenNum <= 10) {
    const [sh2D, shPx] = await Promise.all([
      loadPilotPartImg(`/assets/parts_2d/specials/sp_2d_${tokenNum}.png`),
      loadPilotPartImg(`/assets/parts_pixel/specials/sp_px_${tokenNum}.png`),
    ]);
    if (!sh2D || !shPx) return null;
    const res = { sheet2D: sh2D, sheetPixel: shPx };
    PILOT_COMPOSED_CACHE.set(cacheKey, res);
    return res;
  }

  const manifest = await ensurePartsManifest();
  if (!manifest) return null;

  const d2c = manifest.display_to_code || {};
  const rules = manifest.rules || {};

  const spcCode = (traitsObj && d2c.Species?.[traitsObj.Species]) || 'SPC-05';
  const cloCode = (traitsObj && d2c.Clothes?.[traitsObj.Clothes]) || 'None';
  const eyeCode = (traitsObj && d2c.Eyes?.[traitsObj.Eyes]) || 'EYE-01';
  const mthCode = (traitsObj && d2c.Mouth?.[traitsObj.Mouth]) || 'None';
  const eywCode = (traitsObj && d2c.Eyewear?.[traitsObj.Eyewear]) || 'None';
  const hatCode = (traitsObj && d2c.Hat?.[traitsObj.Hat]) || 'None';

  const isHood = (rules.hood_clothes || []).includes(cloCode);
  const addonCode = rules.addon_species?.[spcCode] || null;
  const keepsAddon =
    Boolean(addonCode) && !isHood && (rules.hat_keeps_addon || []).includes(hatCode);

  let hatFile = null;
  if (hatCode !== 'None') {
    if (
      isHood &&
      (rules.hat_over_hood_Hats || []).includes(hatCode) &&
      (rules.hat_over_hood_Clothes || []).includes(cloCode)
    ) {
      hatFile = `${hatCode}__over_hood.png`;
    } else {
      hatFile = `${hatCode}.png`;
    }
  }

  const lensTint = (rules.lens_tint_eyewear || {})[eywCode] || null;
  const mouthFrontRow = Number.isFinite(rules.mouth_front_from_row) ? rules.mouth_front_from_row : 28;

  async function composeModeSheet(mode) {
    const size = mode === '2d' ? 288 : 48;
    const baseDir = mode === '2d' ? '/assets/parts_2d' : '/assets/parts_pixel';
    const want = (cond, path) => (cond ? loadPilotPartImg(`${baseDir}/${path}`) : Promise.resolve(null));

    const [
      spcImg,
      addonImg,
      eyeNormImg,
      eyeBlinkImg,
      eyeShockImg,
      cloImg,
      hoodImg,
      mthImg,
      eywImg,
      eywTintImg,
      hatImg,
    ] = await Promise.all([
      want(true, `species/${spcCode}.png`),
      want(keepsAddon, `species/${addonCode}.png`),
      want(true, `eyes/${eyeCode}.png`),
      want(true, 'eyes/EYE-BLINK.png'),
      want(true, 'eyes/EYE-SHOCK.png'),
      want(cloCode !== 'None', `clothes/${cloCode}.png`),
      want(isHood, `clothes/${cloCode}__hood.png`),
      want(mthCode !== 'None', `mouth/${mthCode}.png`),
      want(eywCode !== 'None', `eyewear/${eywCode}.png`),
      want(Boolean(lensTint) && mode === '2d', `eyewear/${eywCode}__tint.png`),
      want(Boolean(hatFile), `hat/${hatFile}`),
    ]);

    // Every selected layer must be present, otherwise the sheet is not used or cached (caller retries)
    const complete =
      Boolean(spcImg && eyeNormImg) &&
      (!keepsAddon || Boolean(addonImg)) &&
      (cloCode === 'None' || Boolean(cloImg)) &&
      (!isHood || Boolean(hoodImg)) &&
      (mthCode === 'None' || Boolean(mthImg)) &&
      (eywCode === 'None' || Boolean(eywImg)) &&
      (!lensTint || mode !== '2d' || Boolean(eywTintImg)) &&
      (!hatFile || Boolean(hatImg));
    if (!complete) return null;

    const canvas = document.createElement('canvas');
    canvas.width = size * 3;
    canvas.height = size;
    // Pixel sheets with a clear lens are read back once per frame for the lens tint
    const cctx = canvas.getContext('2d', { willReadFrequently: Boolean(lensTint) && mode === 'pixel' });
    cctx.imageSmoothingEnabled = mode === '2d';

    const eyeFrames = [eyeNormImg, eyeBlinkImg || eyeNormImg, eyeShockImg || eyeNormImg];
    const isOpaqueEyw2D = mode === '2d' && (rules.opaque_eyewear_2d || []).includes(eywCode);
    const isLeftOccluded2D =
      mode === '2d' && (rules.left_eye_occluding_eyewear_2d || []).includes(eywCode);
    const skinSet = new Set(rules.species_skin_rgb?.[spcCode] || ['#E8D0AC', '#FCF2DC']);
    const tintRgb = lensTint ? hexToRgbArr(lensTint.tint) : null;
    const tintScratch = eywTintImg ? document.createElement('canvas') : null;
    if (tintScratch) {
      tintScratch.width = size;
      tintScratch.height = size;
    }

    for (let f = 0; f < 3; f++) {
      const ox = f * size;
      // 1. Species add-on (traits_v3 category "back": behind the base so the head outline stays on top)
      if (addonImg) cctx.drawImage(addonImg, ox, 0, size, size);
      // 2. Species base
      cctx.drawImage(spcImg, ox, 0, size, size);
      // 3. Eyes
      const eImg = eyeFrames[f];
      const eyesDrawn = Boolean(eImg) && !isOpaqueEyw2D;
      if (eyesDrawn) {
        if (isLeftOccluded2D) {
          cctx.drawImage(eImg, 174, 0, size - 174, size, ox + 174, 0, size - 174, size);
        } else {
          cctx.drawImage(eImg, ox, 0, size, size);
        }
      }
      // 4. Clothes body
      if (cloImg) cctx.drawImage(cloImg, ox, 0, size, size);
      // 5. Mouth prop
      if (mthImg) cctx.drawImage(mthImg, ox, 0, size, size);
      // 6. Eyewear (clear lenses: only face skin seen through the glass takes the lens tint, eyes stay clear)
      if (tintScratch) {
        const tctx = tintScratch.getContext('2d');
        tctx.globalCompositeOperation = 'copy';
        tctx.drawImage(eywTintImg, 0, 0, size, size);
        if (eyesDrawn) {
          tctx.globalCompositeOperation = 'destination-out';
          tctx.drawImage(eImg, 0, 0, size, size);
        }
        tctx.globalCompositeOperation = 'source-over';
        cctx.drawImage(tintScratch, ox, 0);
      }
      if (eywImg) cctx.drawImage(eywImg, ox, 0, size, size);
      if (tintRgb && mode === 'pixel') {
        const frame = cctx.getImageData(ox, 0, size, size);
        const px = frame.data;
        for (const [hx, hy] of lensTint.holes) {
          const i = (hy * size + hx) * 4;
          if (skinSet.has(rgbToHex(px[i], px[i + 1], px[i + 2]))) {
            px[i] = tintRgb[0];
            px[i + 1] = tintRgb[1];
            px[i + 2] = tintRgb[2];
            px[i + 3] = 255;
          }
        }
        cctx.putImageData(frame, ox, 0);
      }
      // 7. Hood companion layer (above eyewear, below hat)
      if (hoodImg) cctx.drawImage(hoodImg, ox, 0, size, size);
      // 8. Hat
      if (hatImg) cctx.drawImage(hatImg, ox, 0, size, size);
      // 9. Mouth prop again from the first mouth-zone row down, over hat/hood side pieces (harness.compose)
      if (mthImg && (hatImg || hoodImg)) {
        const topY = mode === '2d' ? mouthFrontRow * 6 : mouthFrontRow;
        cctx.drawImage(mthImg, 0, topY, size, size - topY, ox, topY, size, size - topY);
      }
    }
    return canvas;
  }

  const [sheet2D, sheetPixel] = await Promise.all([
    composeModeSheet('2d'),
    composeModeSheet('pixel'),
  ]);
  if (!sheet2D || !sheetPixel) return null;
  const res = { sheet2D, sheetPixel };
  PILOT_COMPOSED_CACHE.set(cacheKey, res);
  return res;
}

function ensureDefaultPilotSheets() {
  if (MOTION_STATE.defaultPilotSheetsLoaded) return;
  if (performance.now() < (MOTION_STATE.defaultPilotRetryAt || 0)) return;
  MOTION_STATE.defaultPilotSheetsLoaded = true;
  buildModularPilotSheets(null, null).then((res) => {
    if (!res) {
      // Allow another attempt in a few seconds instead of leaving the default pilot missing for the session
      MOTION_STATE.defaultPilotSheetsLoaded = false;
      MOTION_STATE.defaultPilotRetryAt = performance.now() + 3000;
      return;
    }
    MOTION_STATE.defaultPilot2DSheet = res.sheet2D;
    MOTION_STATE.defaultPilotPixelSheet = res.sheetPixel;
    if (!UFO_GAME.hasNft) {
      UFO_GAME.pilot2DSheet = res.sheet2D;
      UFO_GAME.pilotPixelSheet = res.sheetPixel;
    }
  });
}

function updateFullscreenExitOrCodexButton() {
  // No-op (minimal topbar uses CSS .is-fullscreen-mode toggle)
}

function enterUfoFullscreenGame(startCombatImmediately = true) {
  const theaterEl = document.getElementById('retro-intro-theater');
  if (!theaterEl) return;
  MOTION_STATE.isFullscreen = true;
  MOTION_STATE.skippedEscape = false;
  document.documentElement.classList.add('ufo-fullscreen-lock');
  document.body.classList.add('ufo-fullscreen-lock');
  theaterEl.classList.add('is-fullscreen-mode');
  updateUfoBoardingDockUI();
  updateFullscreenExitOrCodexButton();

  // Progressive Native Fullscreen API (Android Chrome & Desktop; iPhone iOS Safari & VeryChat WebView use the 100dvh fixed lock-shell!)
  try {
    if (theaterEl.requestFullscreen && !document.fullscreenElement) {
      theaterEl.requestFullscreen().catch(() => {});
    } else if (theaterEl.webkitRequestFullscreen && !document.webkitFullscreenElement) {
      theaterEl.webkitRequestFullscreen();
    }
  } catch (e) {
    // Fallback to CSS 100dvh lock-shell
  }

  if (startCombatImmediately) {
    setIntroScene(2, true);
  }
}

function exitUfoFullscreenGame() {
  const theaterEl = document.getElementById('retro-intro-theater');
  MOTION_STATE.isFullscreen = false;
  document.documentElement.classList.remove('ufo-fullscreen-lock');
  document.body.classList.remove('ufo-fullscreen-lock');
  theaterEl?.classList.remove('is-fullscreen-mode');
  updateFullscreenExitOrCodexButton();

  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } catch (e) {
    // Ignore
  }
}

function handleExitOrCodexClick() {
  if (MOTION_STATE.isFullscreen) {
    exitUfoFullscreenGame();
  } else {
    scrollToSection('tab-codex');
  }
}

function triggerScene0Liftoff() {
  MOTION_STATE.skippedEscape = false;
  setIntroScene(1, true);
}

function setEscapeVehicle(vehicle) {
  if (!ESCAPE_VEHICLES.includes(vehicle)) return;
  MOTION_STATE.vehicle = vehicle;
  try {
    window.localStorage.setItem(VEHICLE_STORAGE_KEY, vehicle);
  } catch (e) {
    // Not remembered this time; the pick still applies to this visit
  }
  updateVehicleUI();
}

function updateVehicleUI() {
  const vehicle = MOTION_STATE.vehicle;
  document.querySelectorAll('.s1-vehicle-btn').forEach((btn) => {
    const on = btn.dataset.vehicle === vehicle;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-checked', on ? 'true' : 'false');
  });
  const theaterEl = document.getElementById('retro-intro-theater');
  if (theaterEl) theaterEl.dataset.vehicle = vehicle;
  const padText = document.querySelector('#mobile-fullscreen-touchpad .touchpad-text');
  if (padText) {
    const ko =
      vehicle === 'car'
        ? '아무 데나 누르면 점프 · 공중에서 한 번 더 = 2단 점프'
        : vehicle === 'boat'
        ? '누르고 있으면 힘이 모이고 · 떼면 들이받기'
        : '누르고 있으면 상승 · 떼면 하강';
    const en =
      vehicle === 'car'
        ? 'Press anywhere to jump · again in the air to double jump'
        : vehicle === 'boat'
        ? 'Hold to charge · let go to ram'
        : 'Hold to climb · release to dive';
    padText.dataset.ko = ko;
    padText.dataset.en = en;
    padText.textContent = CURRENT_LANG === 'ko' ? ko : en;
  }
}

// Choice B ("탈출 안 한다고 하면 바로 저기 벚꽃나무 있는 곳 가장 기본 펭귄으로"):
function skipEscapeToCherryBlossomTown() {
  MOTION_STATE.skippedEscape = true;
  UFO_GAME.hasNft = false;
  UFO_GAME.pilotTokenId = null;
  UFO_GAME.pilotSpeciesId = '01';
  UFO_GAME.pilotSpeciesLabel = '기본 파란 펭귄 (Classic)';
  UFO_GAME.pilotTraitsSummary = 'Classic';
  UFO_GAME.pilot2DSheet = MOTION_STATE.defaultPilot2DSheet || null;
  UFO_GAME.pilotPixelSheet = MOTION_STATE.defaultPilotPixelSheet || null;
  UFO_GAME.lastRank = null;
  ensureDefaultPilotSheets();
  ensureSpeciesSprite('01');
  updateUfoBoardingDockUI();
  setIntroScene(4, true);
}

function boardUfoWithoutNft(startEscape = true) {
  MOTION_STATE.skippedEscape = false;
  UFO_GAME.hasNft = false;
  UFO_GAME.pilotTokenId = null;
  UFO_GAME.pilotSpeciesId = '01';
  UFO_GAME.pilotSpeciesLabel = '기본 파란 펭귄 (Classic)';
  UFO_GAME.pilotTraitsSummary = 'Classic';
  UFO_GAME.pilot2DSheet = MOTION_STATE.defaultPilot2DSheet || null;
  UFO_GAME.pilotPixelSheet = MOTION_STATE.defaultPilotPixelSheet || null;
  UFO_GAME.lastRank = null;
  ensureDefaultPilotSheets();
  ensureSpeciesSprite('01');
  updateUfoBoardingDockUI();
  if (startEscape) {
    setIntroScene(1, true);
  }
}

// Fetch token metadata (Species, Clothes, Eyes, Mouth, Eyewear, Hat; Background/Aura/Back are not worn in the
// cockpit) and compose the pilot. Incomplete loads are retried a few times instead of showing a partial pilot.
async function loadPilotForToken(num, attempt = 0) {
  if (UFO_GAME.pilotTokenId !== num) return;
  let sheets = null;
  try {
    const res = await fetch(`/api/token/${num}`);
    if (res.ok) {
      const tok = await res.json();
      if (UFO_GAME.pilotTokenId !== num) return;
      const traits = tok?.traits || {};
      const spName = traits.Species || 'Classic';
      const mappedId = SPECIES_NAME_TO_ID[spName] || '01';
      UFO_GAME.pilotSpeciesId = mappedId;
      UFO_GAME.pilotSpeciesLabel = spName;

      const equippedParts = [
        spName,
        traits.Clothes && traits.Clothes !== 'None' ? traits.Clothes : null,
        traits.Eyes && traits.Eyes !== 'Classic' ? traits.Eyes : null,
        traits.Mouth && traits.Mouth !== 'Classic' && traits.Mouth !== 'None' ? traits.Mouth : null,
        traits.Eyewear && traits.Eyewear !== 'None' ? traits.Eyewear : null,
        traits.Hat && traits.Hat !== 'None' ? traits.Hat : null,
      ].filter(Boolean);
      UFO_GAME.pilotTraitsSummary = equippedParts.slice(0, 3).join(' + ');

      ensureSpeciesSprite(mappedId);
      getHero2DSheetForSpecies(mappedId);
      sheets = await buildModularPilotSheets(num, traits);
    }
  } catch (e) {
    sheets = null;
  }
  if (UFO_GAME.pilotTokenId !== num) return;
  if (sheets) {
    UFO_GAME.pilot2DSheet = sheets.sheet2D;
    UFO_GAME.pilotPixelSheet = sheets.sheetPixel;
  } else if (attempt < 3) {
    setTimeout(() => {
      loadPilotForToken(num, attempt + 1).then(() => updateUfoBoardingDockUI());
    }, 1200 * (attempt + 1));
  }
}

async function setUfoPilotTokenId(tokenNum, triggerPfp = true, startEscape = false) {
  if (tokenNum === null || tokenNum === undefined) {
    boardUfoWithoutNft(startEscape);
    return;
  }
  const raw = String(tokenNum).trim().replace(/^#/, '').replace(/^P/i, '');
  if (raw === '' || !/^\d+$/.test(raw)) {
    boardUfoWithoutNft(startEscape);
    return;
  }
  const num = parseInt(raw, 10);
  if (num > 9999) {
    // Out of range must never be clamped onto someone else's number (e.g. 12345 -> #9999)
    boardUfoWithoutNft(startEscape);
    return;
  }
  MOTION_STATE.skippedEscape = false;
  UFO_GAME.hasNft = true;
  UFO_GAME.pilotTokenId = num;

  // Show the new pilot immediately when cached; otherwise drop the previous token's sheets so the cockpit
  // never shows another NFT's parts while this one loads (the species-coloured hero sprite fills in)
  const cachedSheets = PILOT_COMPOSED_CACHE.get(`NFT_${num}`);
  UFO_GAME.pilot2DSheet = cachedSheets ? cachedSheets.sheet2D : null;
  UFO_GAME.pilotPixelSheet = cachedSheets ? cachedSheets.sheetPixel : null;

  await loadPilotForToken(num, 0);

  updateUfoBoardingDockUI();

  const pfpInput = document.getElementById('pfp-jump-input');
  if (pfpInput) {
    pfpInput.value = String(num);
  }
  if (triggerPfp && typeof loadPfpPreview === 'function') {
    loadPfpPreview(num, false);
  }
  if (startEscape) {
    setIntroScene(1, true);
  }
}

let RANKING_PAGE_CACHE = [];
let RANKING_GAME = MOTION_STATE.vehicle; // which board the ranking tab shows: 'ufo' | 'boat' | 'car'
const RANKING_PAGE_SIZE = 10;
let CURRENT_RANKING_PAGE = 1;
let RANKING_TOTAL_PAGES = 10;

function getNftDisplayName(item) {
  if (!item) return 'Pixel Penguin';
  if (CURRENT_LANG === 'ko') {
    return item.name_ko || item.name || `Pixel Penguin #${item.edition}`;
  }
  return item.name_en || item.name || `Pixel Penguin #${item.edition}`;
}

// Podium medal as pixel art (16 x 22 grid, crisp): a V of ribbon in the metal's own dark tone from the top, a round disc with a dark outline,
// a shaded rim, a face lit from the top left with a glint, and the rank stamped in the middle. Drawn once per rank.
const RANK_MEDAL_METAL = {
  1: { hi: '#fff4b8', face: '#f5c542', mid: '#e0a92a', rim: '#a8741a', ribbon: '#7d5110', ribbonHi: '#c08a24' },
  2: { hi: '#ffffff', face: '#d9e1ea', mid: '#b8c3cf', rim: '#7c8794', ribbon: '#55606c', ribbonHi: '#96a2ae' },
  3: { hi: '#ffe0c7', face: '#e3955a', mid: '#c97538', rim: '#874620', ribbon: '#66311a', ribbonHi: '#a85d2c' },
};
const RANK_MEDAL_CACHE = {};
function rankMedalSvg(rank, label) {
  if (!RANK_MEDAL_CACHE[rank]) {
    const m = RANK_MEDAL_METAL[rank];
    const K = '#160f05';
    const cells = [];
    const px = (x, y, c) => cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`);
    // Ribbon: two straps from the top corners meeting behind the disc, a light stripe down each
    for (let y = 0; y < 8; y++) {
      for (const [x0, dir] of [[1 + Math.floor(y / 2), 1], [12 - Math.floor(y / 2), -1]]) {
        for (let k = 0; k < 3; k++) px(x0 + k, y, k === 1 ? m.ribbonHi : m.ribbon);
        px(dir > 0 ? x0 - 1 : x0 + 3, y, K);
      }
    }
    // Disc: centre (8, 14.5), radius 7.2: outline, rim, face with light from the top left
    const cx = 8, cy = 14.5;
    for (let y = 6; y < 22; y++) {
      for (let x = 0; x < 16; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (d > 7.3) continue;
        let c;
        if (d > 6.4) c = K;
        else if (d > 5.2) c = m.rim;
        else {
          const lit = (x + 0.5 - cx) + (y + 0.5 - cy); // < 0 towards the top left
          c = lit < -3.5 ? m.hi : lit < 2 ? m.face : m.mid;
        }
        px(x, y, c);
      }
    }
    // Rim highlight arc and a two-pixel glint
    px(4, 11, m.hi);
    px(5, 10, m.hi);
    px(5, 12, '#ffffff');
    px(6, 11, '#ffffff');
    RANK_MEDAL_CACHE[rank] = cells.join('');
  }
  return `<svg class="rank-medal" viewBox="0 0 16 22" role="img" aria-label="${label}" shape-rendering="crispEdges">${RANK_MEDAL_CACHE[rank]}<text x="8" y="17.6" text-anchor="middle" font-size="8.5" font-weight="900" fill="#160f05" font-family="Pretendard, 'Malgun Gothic', sans-serif">${rank}</text></svg>`;
}

function buildLeaderboardRowsHtml(items, showBoardAction = true) {
  if (!items || items.length === 0) {
    return `<div class="empty-state">${
      CURRENT_LANG === 'ko' ? '조건에 맞는 기록이 없습니다.' : 'No matching records.'
    }</div>`;
  }
  return items
    .map((item) => {
      const rankLabel = CURRENT_LANG === 'ko' ? `${item.rank}위` : `#${item.rank}`;
      // Top 3 get a pixel medal (gold / silver / bronze) with the number on it; the rest the plain rank
      const medal = item.rank <= 3 ? rankMedalSvg(item.rank, rankLabel) : rankLabel;
      const topClass = `${item.rank <= 3 ? `rank-top-${item.rank}` : ''}${
        SHARED_RANK && SHARED_RANK.board === RANKING_GAME && item.edition === SHARED_RANK.n ? ' is-shared' : ''
      }`;
      const nftName = getNftDisplayName(item);
      // "Pixel Penguin " is shared by every entry; phones hide it so the number stays visible
      const namePrefix = nftName.startsWith('Pixel Penguin ') ? 'Pixel Penguin ' : '';
      const nameRest = nftName.slice(namePrefix.length);
      const spText = item.species || 'Classic';
      const subText = spText;
      const scoreText = `${Number(item.score).toLocaleString()} PTS`;
      const goLabel = CURRENT_LANG === 'ko' ? '보기' : 'View';
      const boardLabel = CURRENT_LANG === 'ko' ? '이 번호로 플레이' : 'Play';

      return `
        <div class="rank-row-card ${topClass}" onclick="jumpToRankedNft(${item.edition})">
          <div class="rank-badge-num">${medal}</div>
          <img src="${item.image_url}" alt="${escapeHtml(nftName)}" class="rank-avatar-thumb" loading="lazy" />
          <div class="rank-nft-info">
            <div class="rank-nft-title">
              <span><span class="rank-name-prefix">${escapeHtml(namePrefix)}</span>${escapeHtml(nameRest)}</span>
              <span class="pill-tag">${escapeHtml(item.id)}</span>
            </div>
            <div class="rank-nft-sub">${escapeHtml(subText)}</div>
          </div>
          <div class="rank-score-val">${scoreText}</div>
          ${
            showBoardAction
              ? `<div class="rank-action-group">
                   <button type="button" class="rank-board-btn" onclick="boardRankedNftAndPlay(${item.edition}, event)">${boardLabel}</button>
                   <div class="rank-go-btn">${goLabel}</div>
                 </div>`
              : `<div class="rank-go-btn">${goLabel}</div>`
          }
        </div>
      `;
    })
    .join('');
}

function goToRankingPage(pageNum) {
  CURRENT_RANKING_PAGE = Math.max(1, Math.min(RANKING_TOTAL_PAGES, Number(pageNum) || 1));
  renderRankingPageList();
}

function renderRankingPageList() {
  const listEl = document.getElementById('ranking-page-list-body');
  if (!listEl) return;
  const q = (document.getElementById('ranking-search-input')?.value || '').trim().toLowerCase();

  let filtered = RANKING_PAGE_CACHE.slice(0, 100);
  if (q) {
    filtered = filtered.filter((item) => {
      const nameKo = String(item.name_ko || item.name || `Pixel Penguin #${item.edition}`).toLowerCase();
      const nameEn = String(item.name_en || item.name || `Pixel Penguin #${item.edition}`).toLowerCase();
      const idStr = String(item.id || '').toLowerCase();
      const edStr = String(item.edition);
      const spStr = String(item.species || '').toLowerCase();
      const rankStr = String(item.rank);
      return (
        nameKo.includes(q) ||
        nameEn.includes(q) ||
        idStr.includes(q) ||
        edStr === q.replace(/^#/, '') ||
        rankStr === q.replace(/위$/, '') ||
        spStr.includes(q)
      );
    });
  }

  RANKING_TOTAL_PAGES = Math.max(1, Math.ceil(filtered.length / RANKING_PAGE_SIZE));
  if (CURRENT_RANKING_PAGE > RANKING_TOTAL_PAGES) {
    CURRENT_RANKING_PAGE = RANKING_TOTAL_PAGES;
  }
  if (CURRENT_RANKING_PAGE < 1) {
    CURRENT_RANKING_PAGE = 1;
  }

  const startIdx = (CURRENT_RANKING_PAGE - 1) * RANKING_PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + RANKING_PAGE_SIZE);

  if (RANKING_PAGE_CACHE.length === 0 && !q) {
    listEl.innerHTML = `<div class="empty-state">${
      CURRENT_LANG === 'ko'
        ? '아직 기록이 없습니다. 번호를 넣고 플레이하면 첫 기록이 됩니다.'
        : 'No scores yet. Enter your number and play to set the first one.'
    }</div>`;
  } else {
    listEl.innerHTML = buildLeaderboardRowsHtml(pageItems, true);
  }

  // Update Range Indicator (e.g. "현재 표시: 1위 ~ 10위 (1 / 10 페이지 · 페이지당 10명)")
  const rangeEl = document.getElementById('ranking-range-indicator');
  if (rangeEl) {
    if (pageItems.length > 0) {
      const firstRank = pageItems[0].rank;
      const lastRank = pageItems[pageItems.length - 1].rank;
      rangeEl.textContent =
        CURRENT_LANG === 'ko'
          ? `${firstRank}–${lastRank}위 · ${CURRENT_RANKING_PAGE}/${RANKING_TOTAL_PAGES} 페이지`
          : `#${firstRank}–${lastRank} · Page ${CURRENT_RANKING_PAGE}/${RANKING_TOTAL_PAGES}`;
    } else {
      rangeEl.textContent = CURRENT_LANG === 'ko' ? '결과 없음' : 'No results';
    }
  }

  // Render 1~10 Page Number Buttons
  const pageNumsWrap = document.getElementById('rank-page-numbers');
  if (pageNumsWrap) {
    const btns = [];
    for (let p = 1; p <= RANKING_TOTAL_PAGES; p++) {
      const activeCls = p === CURRENT_RANKING_PAGE ? 'active' : '';
      btns.push(
        `<button type="button" class="rank-page-num-btn ${activeCls}" onclick="goToRankingPage(${p})">${p}</button>`
      );
    }
    pageNumsWrap.innerHTML = btns.join('');
  }

  const firstBtn = document.getElementById('rank-page-first-btn');
  const prevBtn = document.getElementById('rank-page-prev-btn');
  const nextBtn = document.getElementById('rank-page-next-btn');
  const lastBtn = document.getElementById('rank-page-last-btn');
  if (firstBtn) firstBtn.disabled = CURRENT_RANKING_PAGE <= 1;
  if (prevBtn) prevBtn.disabled = CURRENT_RANKING_PAGE <= 1;
  if (nextBtn) nextBtn.disabled = CURRENT_RANKING_PAGE >= RANKING_TOTAL_PAGES;
  if (lastBtn) lastBtn.disabled = CURRENT_RANKING_PAGE >= RANKING_TOTAL_PAGES;

  // Update KPI summary cards
  const totalEl = document.getElementById('ranking-kpi-total');
  const topNameEl = document.getElementById('ranking-kpi-top-name');
  const topScoreEl = document.getElementById('ranking-kpi-top-score');
  const topCount = Math.min(100, RANKING_PAGE_CACHE.length);
  if (totalEl) {
    totalEl.textContent = `TOP ${topCount}`;
  }
  if (RANKING_PAGE_CACHE.length > 0) {
    const first = RANKING_PAGE_CACHE[0];
    if (topNameEl) topNameEl.textContent = getNftDisplayName(first).replace(/^Pixel Penguin /, '');
    if (topScoreEl) topScoreEl.textContent = `${Number(first.score).toLocaleString()} PTS`;
  } else {
    if (topNameEl) topNameEl.textContent = '–';
    if (topScoreEl) topScoreEl.textContent = '–';
  }
  renderRankShare();
}

// Switch the ranking tab between the plane, icebreaker and car boards
function setRankingGame(game) {
  if (!ESCAPE_VEHICLES.includes(game)) return;
  const changed = RANKING_GAME !== game;
  RANKING_GAME = game;
  document.querySelectorAll('.rank-game-btn').forEach((btn) => {
    const on = btn.dataset.game === game;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  if (changed) {
    RANKING_PAGE_CACHE = [];
    RANKING_CACHE_GAME = null;
    CURRENT_RANKING_PAGE = 1;
  }
}

async function fetchAndRenderRankingPage() {
  const listEl = document.getElementById('ranking-page-list-body');
  const game = RANKING_GAME;
  if (listEl && RANKING_PAGE_CACHE.length === 0) {
    listEl.innerHTML = `<div class="empty-state">${
      CURRENT_LANG === 'ko' ? '불러오는 중…' : 'Loading…'
    }</div>`;
  }
  try {
    const res = await fetch(`/api/leaderboard?limit=100&game=${game}`);
    if (res.ok && game === RANKING_GAME) {
      const data = await res.json();
      if (game !== RANKING_GAME) return; // switched boards while this one loaded
      RANKING_PAGE_CACHE = data.items || [];
      RANKING_CACHE_GAME = game;
      renderRankingPageList();
    }
  } catch (e) {
    if (listEl) {
      listEl.innerHTML = `<div class="empty-state error">${
        CURRENT_LANG === 'ko' ? '순위를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.' : 'Could not load rankings. Try refreshing.'
      }</div>`;
    }
  }
}

function boardRankedNftAndPlay(edition, event) {
  if (event && typeof event.stopPropagation === 'function') {
    event.stopPropagation();
  }
  const parsed = parseInt(String(edition), 10);
  if (Number.isNaN(parsed)) return;
  const num = Math.max(0, Math.min(9999, parsed));
  closeLeaderboardModal();
  setEscapeVehicle(RANKING_GAME);
  setUfoPilotTokenId(num, true, true);
  scrollToSection('tab-intro');
  enterUfoFullscreenGame(true);
}

async function openLeaderboardModal() {
  // From the game: show the board of the vehicle being played
  setRankingGame(MOTION_STATE.vehicle);
  scrollToSection('tab-ranking');
}

function closeLeaderboardModal() {
  document.getElementById('leaderboard-modal')?.classList.remove('open');
}

function jumpToRankedNft(edition) {
  const parsed = parseInt(String(edition), 10);
  if (Number.isNaN(parsed)) return;
  const num = Math.max(0, Math.min(9999, parsed));
  closeLeaderboardModal();
  loadPfpPreview(num, false);
  openTokenModal(num);
}

// ============================================================================
// RANKING SHARE SHEET: brag a number's rank. The link is /?board=<game>&n=<number>[&lang=ko]: the server writes
// the rank into that link's preview title (X, Facebook, chat apps) and the page opens on that board with the
// row lit (openSharedRank). X intent/tweet, Threads intent/post, Telegram share/url and WhatsApp wa.me ?text are
// documented share URLs; Facebook sharer.php is undocumented but still answers. KakaoTalk has no web share URL
// without an SDK key, so phones reach it through the OS share sheet (navigator.share).
// VeryChat has no URL that pre-fills a message either. Its own link page maps link.verychat.io/<path> to
// verychat://<path> (store fallback after 1 s), and its apple-app-site-association ("*") and assetlinks.json
// (handle_all_urls) make that domain open the app directly. So the VeryChat button copies the brag and a real tap
// on https://link.verychat.io/ opens the app home, ready to paste into any chat.
// ============================================================================
const SHARE_BOARD_LABEL = {
  ufo: { ko: '경비행기', en: 'Plane' },
  boat: { ko: '쇄빙선', en: 'Icebreaker' },
  car: { ko: '자동차', en: 'Car' },
};
const SHARE_NO_STORE = 'ppeng-share-no';
const SHARE_TARGETS = {
  x: (s) => `https://x.com/intent/tweet?text=${encodeURIComponent(s.text)}&url=${encodeURIComponent(s.url)}`,
  facebook: (s) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(s.url)}`,
  whatsapp: (s) => `https://wa.me/?text=${encodeURIComponent(`${s.text} ${s.url}`)}`,
  telegram: (s) => `https://t.me/share/url?url=${encodeURIComponent(s.url)}&text=${encodeURIComponent(s.text)}`,
  threads: (s) => `https://www.threads.com/intent/post?text=${encodeURIComponent(s.text)}&url=${encodeURIComponent(s.url)}`,
};
let RANKING_CACHE_GAME = null; // board whose top 100 RANKING_PAGE_CACHE holds (null while it loads)
let RANK_SHARE_NOW = null;
let RANK_SHARE_PICK = 0; // which brag line: random when the sheet opens, 다른 멘트 steps on

// B-grade brag lines in the site's own voice (banmal, ㅋㅋ, the pillar, forced pixelation, [속보]). Each entry
// gives [ko, en] for v = { n, board, r, score: '12,345점', pts: '12,345 PTS', top }. Worst case (rank 100,
// #9999, 999,999) stays well under X's 280: Hangul weighs 2 there and the link 23 (twitter-text config v3).
const BRAG_LINES = {
  first: [
    (v) => [`[속보] 픽셀펭귄 #${v.n}, ${v.board} 1위 등극 ㅋㅋㅋ ${v.score}. 남극 무너질 때 혼자 살아남은 레전드. 덤빌 펭귄?`,
      `BREAKING: Pixel Penguin #${v.n} takes #1 on the ${v.board} board lol. ${v.pts}. Antarctica fell, I didn't. Come at me`],
    (v) => [`${v.board} 1위 먹었다 ㅋㅋ #${v.n} ${v.score}. 기둥도 나는 못 빨아들임. 나 이기면 인정해 줌`,
      `${v.board} #1, penguin #${v.n}, ${v.pts}. Even the pillar couldn't suck me in lol. Beat it if you can`],
    (v) => [`ㅋㅋㅋ 미안 ${v.board} 1위 내가 가져감. #${v.n} ${v.score}. 억울하면 와서 뺏어 가든가~`,
      `Sorry, ${v.board} #1 is mine now lol. Penguin #${v.n}, ${v.pts}. Mad? Come take it`],
  ],
  podium: [
    (v) => [`${v.board} ${v.r}위 ㅋㅋ 메달 땄다. #${v.n} ${v.score}. 1위 놈 기다려라 곧 간다`,
      `${v.board} #${v.r}, got a medal lol. Penguin #${v.n}, ${v.pts}. Number one, I'm coming for you`],
    (v) => [`[단독] 픽셀펭귄 #${v.n}, ${v.board} 시상대 ${v.r}위 ㅋㅋ ${v.score}. 1위 아니라서 지금 분노 중`,
      `EXCLUSIVE: penguin #${v.n} on the ${v.board} podium at #${v.r} lol. ${v.pts}. Still furious it's not #1`],
    (v) => [`#${v.n} ${v.board} ${v.r}위 찍음 ${v.score} ㅋㅋ 1위까지 쪼끔 남음. 응원 말고 도전해라`,
      `Penguin #${v.n}: ${v.board} #${v.r}, ${v.pts}. So close to #1 lol. Don't cheer, play`],
  ],
  top10: [
    (v) => [`${v.board} TOP 10 입성 ㅋㅋ #${v.n} ${v.r}위 ${v.score}. 펭귄 인생 이 정도면 성공한 거 아님?`,
      `${v.board} TOP 10 lol. Penguin #${v.n} at #${v.r}, ${v.pts}. Peak penguin life tbh`],
    (v) => [`#${v.n} ${v.board} ${v.r}위 ${v.score} ㅋㅋ 기둥한테 빨려 갈 뻔했는데 살아남음`,
      `Penguin #${v.n} is ${v.board} #${v.r} with ${v.pts}. Nearly got sucked into the pillar, survived lol`],
    (v) => [`${v.board} ${v.r}위 찍었다 #${v.n} ${v.score}. 나보다 못하면 펭귄 자격 박탈 ㅋㅋ`,
      `${v.board} #${v.r}, penguin #${v.n}, ${v.pts}. Score lower and lose your penguin license lol`],
  ],
  top100: [
    (v) => [`${v.board} ${v.r}위 ㅋㅋ #${v.n} ${v.score}. TOP 100 안에는 들었다 이 말이야`,
      `${v.board} #${v.r} lol. Penguin #${v.n}, ${v.pts}. Made the TOP 100, that's what matters`],
    (v) => [`#${v.n} ${v.board} ${v.r}위 ${v.score}. 강제 도트화 직전에 탈출 성공 ㅋㅋ 너도 해 봐`,
      `Penguin #${v.n}: ${v.board} #${v.r}, ${v.pts}. Escaped right before forced pixelation lol. Your turn`],
    (v) => [`${v.board} ${v.r}위… 애매하지만 순위는 순위다 ㅋㅋ #${v.n} ${v.score}. 나보다 낮으면 놀림 받음`,
      `${v.board} #${v.r}... mid, but a rank is a rank lol. Penguin #${v.n}, ${v.pts}. Rank lower and get roasted`],
  ],
  chasing: [
    (v) => [`#${v.n} ${v.board} TOP 100 도전 중 ㅋㅋ 아직 기둥한테 계속 빨려 감. 같이 망할 사람?`,
      `Penguin #${v.n}, still chasing the ${v.board} TOP 100 lol. Keep getting sucked into the pillar. Fail with me?`],
    (v) => [`나 #${v.n}, ${v.board} 순위권 밖 ㅋㅋㅋ 근데 너도 못 들어갈걸? 해 보고 말해`,
      `Penguin #${v.n}: not on the ${v.board} board yet lol. Bet you can't make it either. Try it`],
    (v) => [`#${v.n} ${v.board} 강제 도트화만 몇 번째냐 ㅋㅋ TOP 100 들 때까지 간다`,
      `Penguin #${v.n} got pixelated way too many times lol. Not stopping till the ${v.board} TOP 100`],
  ],
  board: [
    (v) => [`픽셀펭귄 ${v.board} 지금 1위 #${v.top} ${v.score} ㅋㅋ 이거 깰 사람 나와 봐`,
      `Pixel Penguin ${v.board} #1 right now: #${v.top} with ${v.pts} lol. Who's breaking that?`],
    (v) => [`[속보] 남극 붕괴, 펭귄들 ${v.board} 타고 탈출 중 ㅋㅋ 1위는 #${v.top} ${v.score}`,
      `BREAKING: Antarctica collapses, penguins flee by ${v.board} lol. #1 is #${v.top} with ${v.pts}`],
    (v) => [`${v.board} 1위 #${v.top} ${v.score}… 이게 펭귄이 낼 수 있는 점수냐 ㅋㅋ`,
      `${v.board} #1: #${v.top}, ${v.pts}... is that even penguinly possible lol`],
  ],
  empty: [
    (v) => [`픽셀펭귄 ${v.board} 1위 자리 아직 공석 ㅋㅋ 지금 하면 그냥 1위임. 날로 먹을 사람?`,
      `The Pixel Penguin ${v.board} #1 spot is still empty lol. Play now and it's yours for free`],
    (v) => [`[속보] ${v.board} 순위표 텅 빔 ㅋㅋ 1등 줍줍 기회`,
      `BREAKING: the ${v.board} board is totally empty lol. Free #1 up for grabs`],
  ],
};

// Opened from a shared link? (/?board=car&n=4441)
const SHARED_RANK = (() => {
  try {
    const params = new URLSearchParams(window.location.search);
    const board = params.get('board');
    if (!ESCAPE_VEHICLES.includes(board)) return null;
    const n = params.get('n');
    return { board, n: /^\d{1,4}$/.test(n || '') ? Number(n) : null };
  } catch (e) {
    return null;
  }
})();

function shareOrigin() {
  // A local test server shares itself; anything else shares the canonical address
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' ? window.location.origin : 'https://www.ppeng.org';
}

function buildRankShare() {
  const game = RANKING_GAME;
  const ko = CURRENT_LANG === 'ko';
  const board = SHARE_BOARD_LABEL[game][ko ? 'ko' : 'en'];
  const raw = (document.getElementById('rank-share-no')?.value || '').trim();
  const n = /^\d{1,4}$/.test(raw) ? Number(raw) : null;
  const loaded = RANKING_CACHE_GAME === game;
  const row = loaded && n !== null ? RANKING_PAGE_CACHE.find((it) => it.edition === n) || null : null;
  const top = loaded ? RANKING_PAGE_CACHE[0] || null : null;
  const params = new URLSearchParams({ board: game });
  if (n !== null) params.set('n', String(n));
  if (ko) params.set('lang', 'ko');
  const url = `${shareOrigin()}/?${params}`;

  const scored = row || top;
  const num = scored ? Number(scored.score).toLocaleString('en-US') : '';
  const v = { n, board, r: row ? row.rank : 0, score: `${num}점`, pts: `${num} PTS`, top: top ? top.edition : null };
  let kind;
  if (row) kind = row.rank === 1 ? 'first' : row.rank <= 3 ? 'podium' : row.rank <= 10 ? 'top10' : 'top100';
  else if (n !== null) kind = 'chasing';
  else kind = top ? 'board' : 'empty';
  const lines = BRAG_LINES[kind];
  const text = lines[RANK_SHARE_PICK % lines.length](v)[ko ? 0 : 1];
  return { game, board, raw, n, loaded, row, url, text };
}

function rerollRankShare() {
  RANK_SHARE_PICK += 1;
  setRankShareStatus('');
  renderRankShare();
}

function setRankShareStatus(msg) {
  const el = document.getElementById('rank-share-status');
  if (el) el.textContent = msg;
}

function renderRankShare() {
  const modal = document.getElementById('rank-share-modal');
  if (!modal || !modal.classList.contains('open')) return;
  const s = buildRankShare();
  RANK_SHARE_NOW = s;
  const ko = CURRENT_LANG === 'ko';

  let head;
  if (!s.loaded) {
    head = `<div class="share-note">${ko ? '순위 불러오는 중…' : 'Loading the board…'}</div>`;
  } else if (s.row) {
    const rankLabel = ko ? `${s.row.rank}위` : `#${s.row.rank}`;
    const nftName = getNftDisplayName(s.row);
    head = `
      <div class="share-hit">
        <div class="share-hit-rank">${s.row.rank <= 3 ? rankMedalSvg(s.row.rank, rankLabel) : rankLabel}</div>
        <img src="${s.row.image_url}" alt="" class="rank-avatar-thumb" />
        <div class="share-hit-info">
          <div class="share-hit-name">${escapeHtml(nftName)}</div>
          <div class="share-hit-sub">${escapeHtml(s.board)} · ${Number(s.row.score).toLocaleString()} PTS</div>
        </div>
      </div>`;
  } else if (s.raw && s.n === null) {
    head = `<div class="share-note">${ko ? '번호는 0 ~ 9999 숫자만 됩니다.' : 'Numbers 0 to 9999 only.'}</div>`;
  } else if (s.n !== null) {
    head = `<div class="share-note">${
      ko
        ? `#${s.n}은 아직 ${escapeHtml(s.board)} TOP 100 밖입니다. 순위 없이 도전 문구로 공유돼요.`
        : `#${s.n} is not in the ${escapeHtml(s.board)} TOP 100 yet, so it shares as a challenge.`
    }</div>`;
  } else {
    head = `<div class="share-note">${
      ko ? '번호를 넣으면 그 번호 순위로 자랑합니다. 비우면 순위표를 공유해요.' : 'Enter your number to brag its rank, or share the whole board.'
    }</div>`;
  }
  const preview = document.getElementById('rank-share-preview');
  if (preview) {
    preview.innerHTML = `${head}<p class="share-text">${escapeHtml(s.text)}</p><button type="button" class="share-reroll" data-share-reroll>${
      ko ? '다른 멘트' : 'Another line'
    }</button>`;
  }

  const linkEl = document.getElementById('rank-share-link');
  if (linkEl) linkEl.value = s.url;
  modal.querySelectorAll('.share-btn[data-net]').forEach((a) => {
    a.href = SHARE_TARGETS[a.dataset.net](s);
  });
}

function openRankShare() {
  const modal = document.getElementById('rank-share-modal');
  if (!modal) return;
  const input = document.getElementById('rank-share-no');
  if (input && !input.value) {
    // The number just played with, else the one used last time
    let saved = null;
    try {
      saved = localStorage.getItem(SHARE_NO_STORE);
    } catch (e) {}
    if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) input.value = String(UFO_GAME.pilotTokenId);
    else if (/^\d{1,4}$/.test(saved || '')) input.value = saved;
  }
  const nativeBtn = document.getElementById('rank-share-native');
  if (nativeBtn) nativeBtn.hidden = typeof navigator.share !== 'function';
  RANK_SHARE_PICK = Math.floor(Math.random() * 6);
  setRankShareStatus('');
  modal.classList.add('open');
  renderRankShare();
  if (RANKING_CACHE_GAME !== RANKING_GAME) fetchAndRenderRankingPage();
}

function closeRankShare() {
  document.getElementById('rank-share-modal')?.classList.remove('open');
}

async function copyToClipboard(str) {
  try {
    await navigator.clipboard.writeText(str);
    return true;
  } catch (e) {
    // No async clipboard (old WebView, permission): copy through a hidden textarea
  }
  const ta = document.createElement('textarea');
  ta.value = str;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, str.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (e) {}
  ta.remove();
  return ok;
}

async function copyRankShare(withText) {
  const s = RANK_SHARE_NOW || buildRankShare();
  const ko = CURRENT_LANG === 'ko';
  if (await copyToClipboard(withText ? `${s.text}\n${s.url}` : s.url)) {
    setRankShareStatus(
      withText
        ? ko ? '문구와 링크를 복사했어요. 붙여넣기만 하면 됩니다.' : 'Message and link copied. Just paste it.'
        : ko ? '링크를 복사했어요.' : 'Link copied.'
    );
  } else {
    const linkEl = document.getElementById('rank-share-link');
    linkEl?.focus();
    linkEl?.select();
    setRankShareStatus(ko ? '자동 복사가 막혀 있어요. 위 링크를 길게 눌러 복사해 주세요.' : 'Copy is blocked here. Press and hold the link above to copy it.');
  }
}

function isPhoneOrTablet() {
  // iPadOS reports itself as a Mac with touch
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function veryChatRankShare(e) {
  const s = RANK_SHARE_NOW || buildRankShare();
  const ko = CURRENT_LANG === 'ko';
  const phone = isPhoneOrTablet();
  // VeryChat is a phone app: on a computer the link would only show its store page, so just copy
  if (!phone) e.preventDefault();
  // Started inside the tap, before the app takes over; the link itself is followed as a normal tap
  copyToClipboard(`${s.text}\n${s.url}`).then((ok) => {
    if (!ok) {
      setRankShareStatus(ko ? '자동 복사가 막혀 있어요. 아래 링크를 길게 눌러 복사한 뒤 베리챗에 붙여넣어 주세요.' : 'Copy is blocked here. Press and hold the link below, then paste it in VeryChat.');
      return;
    }
    setRankShareStatus(
      phone
        ? ko ? '자랑 문구를 복사했어요. 베리챗이 열리면 대화방에 붙여넣기만 하세요.' : 'Copied. Paste it into any VeryChat chat when the app opens.'
        : ko ? '자랑 문구를 복사했어요. 베리챗은 폰 앱이라 PC에선 열리지 않아요. 폰에서 이 버튼을 누르면 바로 열립니다.' : 'Copied. VeryChat is a phone app, so tap this button on your phone to open it directly.'
    );
  });
}

async function nativeRankShare() {
  const s = RANK_SHARE_NOW || buildRankShare();
  try {
    await navigator.share({ title: 'PIXEL PENGUIN', text: s.text, url: s.url });
  } catch (e) {
    // Closing the share sheet is not an error; anything else falls back to copying
    if (e && e.name !== 'AbortError') copyRankShare(true);
  }
}

// A shared link opens the ranking page on its board, on the page holding the number, with that row lit. The
// row is then held in place while the page settles (fonts, avatars; iOS Safari has no scroll anchoring) until
// the visitor scrolls or touches, or 6 s pass.
async function openSharedRank() {
  showTabPage('tab-ranking');
  window.scrollTo({ top: 0, behavior: 'auto' });
  await fetchAndRenderRankingPage();
  const row = SHARED_RANK.n === null ? null : RANKING_PAGE_CACHE.find((it) => it.edition === SHARED_RANK.n);
  if (row) goToRankingPage(Math.ceil(row.rank / RANKING_PAGE_SIZE));
  // Looked up each time: a re-render (language switch, refresh) replaces the row element
  const land = () => {
    const target = (row && document.querySelector('.rank-row-card.is-shared')) || document.getElementById('tab-page-ranking');
    target?.scrollIntoView({ block: row ? 'center' : 'start' });
  };
  land();
  if (typeof ResizeObserver !== 'function') return;
  const STOP_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
  let held = true;
  const stop = () => {
    if (!held) return;
    held = false;
    observer.disconnect();
    STOP_EVENTS.forEach((t) => window.removeEventListener(t, stop, true));
  };
  const observer = new ResizeObserver(() => {
    if (held) land();
  });
  observer.observe(document.querySelector('.main-container') || document.body);
  STOP_EVENTS.forEach((t) => window.addEventListener(t, stop, { capture: true, passive: true }));
  setTimeout(stop, 6000);
}

function ensureHero2DSprite() {
  if (MOTION_STATE.hero2DImg) return MOTION_STATE.hero2DImg;
  const img = new Image();
  img.onload = () => {
    MOTION_STATE.hero2DLoaded = true;
  };
  img.src = '/assets/motion_sprites/hero_2d.png?v=5.0.8';
  MOTION_STATE.hero2DImg = img;

  const sheet = new Image();
  sheet.onload = () => {
    MOTION_STATE.hero2DSheetLoaded = true;
  };
  sheet.src = '/assets/motion_sprites/hero_2d_sheet.png?v=5.0.8';
  MOTION_STATE.hero2DSheet = sheet;
  return img;
}

function ensureIntroBackgrounds() {
  if (!MOTION_STATE.bgRefVortexImg) {
    const rv = new Image();
    rv.onload = () => {
      MOTION_STATE.bgRefVortexLoaded = true;
    };
    rv.src = '/assets/motion_sprites/bg_ref_vortex.jpg?v=5.3.0';
    MOTION_STATE.bgRefVortexImg = rv;
  }
  if (!MOTION_STATE.bgRefSkyGameImg) {
    const rs = new Image();
    rs.onload = () => {
      MOTION_STATE.bgRefSkyGameLoaded = true;
    };
    rs.src = '/assets/motion_sprites/bg_ref_skygame.jpg?v=5.3.0';
    MOTION_STATE.bgRefSkyGameImg = rs;
  }
  if (!MOTION_STATE.bgScene1Img) {
    const bg1 = new Image();
    bg1.onload = () => {
      MOTION_STATE.bgScene1Loaded = true;
    };
    bg1.src = '/assets/motion_sprites/bg_scene1_2d.jpg?v=4.9.0';
    MOTION_STATE.bgScene1Img = bg1;
  }
  if (!MOTION_STATE.bgScene2Img) {
    const bg2 = new Image();
    bg2.onload = () => {
      MOTION_STATE.bgScene2Loaded = true;
    };
    bg2.src = INTRO_TOWN.bg;
    MOTION_STATE.bgScene2Img = bg2;
  }
}

function ensureSpeciesSprite(spId = '01') {
  const key = String(spId).padStart(2, '0');
  if (MOTION_STATE.speciesSprites.has(key)) {
    return MOTION_STATE.speciesSprites.get(key);
  }
  const entry = { img: null, loaded: false, sheet: null, sheetLoaded: false };
  MOTION_STATE.speciesSprites.set(key, entry);
  const img = new Image();
  img.onload = () => {
    entry.img = img;
    entry.loaded = true;
  };
  img.src = `/assets/motion_sprites/sp_${key}.png?v=5.0.7`;

  const sheet = new Image();
  sheet.onload = () => {
    entry.sheet = sheet;
    entry.sheetLoaded = true;
  };
  sheet.src = `/assets/motion_sprites/sp_${key}_sheet.png?v=5.0.7`;
  return entry;
}

function updateIntroProgressBars(activeSceneIdx, progressRatio) {
  for (let i = 0; i < 5; i++) {
    const el = document.getElementById(`intro-prog-${i}`);
    if (!el) continue;
    if (i < activeSceneIdx) {
      el.style.width = '100%';
    } else if (i === activeSceneIdx) {
      el.style.width = `${Math.min(100, Math.max(0, progressRatio * 100)).toFixed(1)}%`;
    } else {
      el.style.width = '0%';
    }
  }
}

function setIntroScene(sceneIdx, resetTimer = true) {
  MOTION_STATE.sceneIdx = ((sceneIdx % 5) + 5) % 5;
  // Leaving the picker while the opening plays (the phone start card stays usable) counts as having seen it
  if (MOTION_STATE.sceneIdx !== 0 && typeof OPENING !== 'undefined' && OPENING.active) finishOpening();
  const theaterEl = document.getElementById('retro-intro-theater');
  if (theaterEl) {
    theaterEl.dataset.scene = String(MOTION_STATE.sceneIdx);
  }
  // "Left it alone" (escape-scene.js stage 5) only holds for the town it led to
  MOTION_STATE.scene0IdleStart = 0;
  if (MOTION_STATE.sceneIdx !== 4) MOTION_STATE.idleSucked = false;
  if (resetTimer) {
    MOTION_STATE.sceneStartTime = performance.now();
    if (MOTION_STATE.sceneIdx === 0) {
      MOTION_STATE.scene0Launching = false;
      MOTION_STATE.scene0LaunchStartTime = 0;
    } else if (MOTION_STATE.sceneIdx === 2) {
      if (MOTION_STATE.vehicle === 'car') {
        resetCarGame(MOTION_STATE.sceneStartTime);
      } else if (MOTION_STATE.vehicle === 'boat') {
        resetBoatGame(MOTION_STATE.sceneStartTime);
      } else {
        resetSkyGame(MOTION_STATE.sceneStartTime);
      }
    }
  }
  const s1Overlay = document.getElementById('scene1-escape-overlay');
  if (s1Overlay) {
    s1Overlay.classList.toggle('hidden-overlay', MOTION_STATE.sceneIdx !== 0);
  }
}

function selectMotionPenguin() {
  ['01', '04', '05', '06', '09', '10', '15', '22'].forEach((id) => ensureSpeciesSprite(id));
}

// Helper: Compute Eye-Blink, 4-Step Walk & Shocked Frame Index (0:idle, 1:blink, 2:walkL, 3:walkR, 4:walkLBlink, 5:walkRBlink, 6:shock)
function getPenguinAnimState(
  now,
  seed = 0,
  isWalking = true,
  forceBlink = false,
  isShocked = false
) {
  if (isShocked) {
    return {
      frameIdx: 6,
      stepBobY: 0,
      waddleRot: 0,
    };
  }

  // Periodic natural eye blink: blinks every ~1800ms for 210ms, plus occasional double blink
  const blinkCycle = (now + seed * 470) % 1850;
  const isBlinking =
    forceBlink ||
    (blinkCycle >= 260 && blinkCycle <= 470) ||
    (blinkCycle >= 1120 && blinkCycle <= 1290);

  if (!isWalking) {
    return {
      frameIdx: isBlinking ? 1 : 0,
      stepBobY: 0,
      waddleRot: 0,
    };
  }

  // 4-step alternating foot walk cycle: 0 (Left foot up) -> 1 (Pass) -> 2 (Right foot up) -> 3 (Pass)
  const stepPhase = Math.floor((now + seed * 190) / 145) % 4;
  let frameIdx = 0;

  if (stepPhase === 0) {
    frameIdx = isBlinking ? 4 : 2; // walkL
  } else if (stepPhase === 2) {
    frameIdx = isBlinking ? 5 : 3; // walkR
  } else {
    frameIdx = isBlinking ? 1 : 0; // mid-stride pass
  }

  // Smooth 60fps continuous sinusoidal waddle bounce & tilt so walking never slides stiffly
  const walkWave = ((now + seed * 190) / 145) * (Math.PI / 2);
  const stepBobY = -Math.abs(Math.sin(walkWave)) * 5.2;
  const waddleRot = Math.sin(walkWave) * 0.048;

  return { frameIdx, stepBobY, waddleRot };
}

// Helper: Draw the Uploaded 2D Full-Body Hero Penguin (hero_2d_sheet.png) with Eye Blink, Walk Feet & Shock Expression
function drawUploaded2DPenguin(
  ctx,
  cx,
  cy,
  size,
  angleRad = 0,
  scaleX = 1,
  scaleY = 1,
  now = 0,
  isWalking = true,
  isShocked = false
) {
  const img = ensureHero2DSprite();
  const anim = getPenguinAnimState(now, 0, isWalking, false, isShocked);
  const walkSquash = isWalking && !isShocked ? (anim.stepBobY / -5.2) * 0.024 : 0;
  ctx.save();
  ctx.translate(cx, cy + anim.stepBobY);
  ctx.rotate(angleRad + anim.waddleRot);
  ctx.scale(scaleX * (1 - walkSquash), scaleY * (1 + walkSquash));
  ctx.imageSmoothingEnabled = true;
  if (MOTION_STATE.hero2DSheetLoaded && MOTION_STATE.hero2DSheet) {
    ctx.drawImage(
      MOTION_STATE.hero2DSheet,
      anim.frameIdx * 256,
      0,
      256,
      256,
      -size / 2,
      -size / 2,
      size,
      size
    );
  } else if (MOTION_STATE.hero2DLoaded && img) {
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  }
  ctx.restore();
}

// Helper: Draw a 48x48 Pixel Penguin Sprite (sp_XX_sheet.png) with Real Eye Blinking & Alternating Foot Walk Cycle
function drawAnimatedPixelPenguin(ctx, spEntry, x, y, size, now, options = {}) {
  const {
    seed = 0,
    isWalking = true,
    flipX = false,
    forceBlink = false,
    santaHat = false,
  } = options;
  const anim = getPenguinAnimState(now, seed, isWalking, forceBlink);
  const cx = x + size / 2;
  const cy = y + size / 2 + anim.stepBobY;

  ctx.save();
  ctx.translate(cx, cy);
  if (anim.waddleRot !== 0) {
    ctx.rotate(anim.waddleRot);
  }
  if (flipX) {
    ctx.scale(-1, 1);
  }
  ctx.imageSmoothingEnabled = false;
  if (spEntry && spEntry.sheetLoaded && spEntry.sheet) {
    ctx.drawImage(
      spEntry.sheet,
      anim.frameIdx * 256,
      0,
      256,
      256,
      -size / 2,
      -size / 2,
      size,
      size
    );
  } else if (spEntry && spEntry.loaded && spEntry.img) {
    ctx.drawImage(spEntry.img, -size / 2, -size / 2, size, size);
  }
  if (santaHat && spEntry && (spEntry.sheetLoaded || spEntry.loaded)) {
    drawSantaHatOnSheet(ctx, size);
  }
  ctx.restore();
  return anim;
}

// Helper: Soft Stepped Pixel Ground Shadow (Replaces ugly gray bricks under feet!)
// Pixel Christmas tree for the Christmas town, drawn on a 4px grid like the town art. Built the usual pixel-art
// way: four stacked tiers, each with a shadow row under it and a lit left side; snow on the tier tops; a gold
// garland; glossy baubles (white highlight, darker bottom); twinkling lights (one bright pixel with a 50% halo);
// a five-pointed star with sparkles on top. The static part is cached once; lights and star glow animate.
const XMAS_TREE_P = 3; // stage px per tree pixel (3 to suit the 71 px town penguins)
const XMAS_TREE_W = 39; // grid width (centre column = 19)
const XMAS_TREE_H = 58; // grid height: star 10 + tiers 37 + trunk 4 + tub 7
let XMAS_TREE_CACHE = null;
const XMAS_TREE_TIERS = [
  // [top row, rows, half width at top, half width at bottom]
  [10, 9, 1, 7],
  [16, 11, 3, 11],
  [24, 12, 5, 15],
  [33, 14, 7, 19],
];
const XMAS_TREE_STAR = [
  '.....K.....',
  '....KYK....',
  '....KYK....',
  'KKKKYWYKKKK',
  '.KYYYYYYOK.',
  '..KYYYYOK..',
  '..KYYKYOK..',
  '.KYOK.KYOK.',
  '.KOK...KOK.',
  'KK.......KK',
];
const XMAS_TREE_LIGHTS = [
  [17, 15], [21, 18], [15, 21], [22, 23], [13, 26], [19, 25], [25, 28],
  [11, 31], [17, 32], [24, 33], [28, 36], [9, 37], [15, 38], [21, 40], [31, 42], [8, 43], [19, 44], [27, 45],
];
const XMAS_TREE_LIGHT_COLS = ['#fde047', '#fb7185', '#67e8f9', '#f9a8d4', '#a3e635'];

function buildXmasTreeCache() {
  const c = document.createElement('canvas');
  c.width = XMAS_TREE_W;
  c.height = XMAS_TREE_H;
  const g = c.getContext('2d');
  const px = (x, y, col) => {
    g.fillStyle = col;
    g.fillRect(x, y, 1, 1);
  };
  const cx = 19;
  // Trunk and a wooden tub with a gold band
  for (let y = 47; y < 51; y++) for (let x = cx - 2; x <= cx + 2; x++) px(x, y, x === cx - 2 || x === cx + 2 ? '#2a1608' : x < cx ? '#8b5a2b' : '#6b3f1d');
  for (let y = 51; y < 58; y++) {
    const hw = y === 51 ? 7 : 6;
    for (let x = cx - hw; x <= cx + hw; x++) {
      const edge = x === cx - hw || x === cx + hw || y === 57 || y === 51;
      px(x, y, edge ? '#2a1608' : y === 54 ? '#facc15' : x < cx - 2 ? '#c2410c' : '#9a3412');
    }
  }
  // Tiers, bottom one first so each upper tier's skirt overlaps the one below
  for (let t = XMAS_TREE_TIERS.length - 1; t >= 0; t--) {
    const [top, rows, w0, w1] = XMAS_TREE_TIERS[t];
    for (let r = 0; r < rows; r++) {
      const y = top + r;
      const hw = Math.round(w0 + ((w1 - w0) * r) / (rows - 1));
      const last = r === rows - 1;
      for (let x = cx - hw; x <= cx + hw; x++) {
        // Ragged bottom edge: every other pixel of the last row hangs one lower
        if (last && (x + t) % 2 === 1) continue;
        const outline = x === cx - hw || x === cx + hw || r === 0 || last;
        let col;
        if (outline) col = '#0b2e1f';
        else if (r >= rows - 3) col = '#14532d'; // shadow under the layer
        else if (x < cx - hw * 0.25) col = '#2f9e57'; // lit side
        else if (x < cx + hw * 0.45) col = '#22803f';
        else col = '#176233'; // shade side
        px(x, y, col);
      }
      if (last) for (let x = cx - hw + ((t + 1) % 2); x <= cx + hw; x += 2) px(x, y + 1, '#0b2e1f');
      // Snow on the tier top, heavier on the lit side
      if (r === 1 || (r === 2 && t > 0)) {
        for (let x = cx - hw + 1; x <= cx + Math.floor(hw * 0.3); x++) if ((x * 7 + r * 3 + t) % 5 !== 0) px(x, y, r === 1 ? '#f8fafc' : '#cbd5e1');
      }
    }
    // Gold garland sweeping down-right across the tier
    for (let k = 0; k < rows - 4; k++) {
      const gy = top + 3 + k;
      const hw = Math.round(w0 + ((w1 - w0) * (k + 3)) / (rows - 1));
      const gx = cx - hw + 2 + Math.round(((2 * hw - 4) * k) / Math.max(1, rows - 5));
      px(gx, gy, '#facc15');
      px(gx + 1, gy, '#b45309');
    }
  }
  // Baubles: 2x2 with a white highlight and a dark bottom
  [
    [14, 24, '#dc2626'], [23, 29, '#2563eb'], [12, 35, '#9333ea'], [20, 36, '#dc2626'], [27, 40, '#facc15'],
    [10, 44, '#2563eb'], [16, 42, '#f472b6'], [24, 45, '#dc2626'], [18, 20, '#facc15'],
  ].forEach(([bx, by, col]) => {
    px(bx, by, '#ffffff');
    px(bx + 1, by, col);
    px(bx, by + 1, col);
    px(bx + 1, by + 1, '#0b1020');
  });
  // Star (11x10) centred on top
  XMAS_TREE_STAR.forEach((row, ry) => {
    [...row].forEach((ch, rx) => {
      const col = { K: '#7c2d12', Y: '#fde047', O: '#f59e0b', W: '#ffffff' }[ch];
      if (col) px(cx - 5 + rx, ry, col);
    });
  });
  return c;
}

function drawPixelXmasTree(ctx, centerX, baseY, now) {
  if (!XMAS_TREE_CACHE) XMAS_TREE_CACHE = buildXmasTreeCache();
  const P = XMAS_TREE_P;
  const left = Math.round(centerX - (XMAS_TREE_W * P) / 2);
  const top = Math.round(baseY - XMAS_TREE_H * P);
  const at = (gx, gy) => [left + gx * P, top + gy * P];
  ctx.save();
  // Ground shadow
  ctx.fillStyle = 'rgba(9, 13, 26, 0.28)';
  ctx.fillRect(left + 7 * P, baseY - P, 25 * P, P * 2);
  // On the town beat (townBeat) the star flashes on every beat and the lights step with it
  const beat = MOTION_STATE.sceneIdx === 4 ? townBeat(now) : now / 420;
  const beatN = Math.floor(beat);
  // Star glow behind everything
  const pulse = beat >= 0 ? Math.pow(1 - (beat - beatN), 2) : 0.5 + 0.5 * Math.sin(now * 0.004);
  const [sx, sy] = at(19.5, 4.5);
  const glow = ctx.createRadialGradient(sx, sy, 2, sx, sy, 46 + pulse * 10);
  glow.addColorStop(0, `rgba(253, 224, 71, ${(0.45 + pulse * 0.25).toFixed(2)})`);
  glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sx - 60, sy - 60, 120, 120);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(XMAS_TREE_CACHE, left, top, XMAS_TREE_W * P, XMAS_TREE_H * P);
  // Twinkling lights: a bright pixel with a 50% halo, each on its own beat
  XMAS_TREE_LIGHTS.forEach(([gx, gy], i) => {
    const on = (((beatN + i) % 3) + 3) % 3 !== 0;
    const col = XMAS_TREE_LIGHT_COLS[(((i + Math.floor(beatN / 4)) % XMAS_TREE_LIGHT_COLS.length) + XMAS_TREE_LIGHT_COLS.length) % XMAS_TREE_LIGHT_COLS.length];
    const [lx, ly] = at(gx, gy);
    if (on) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = col;
      ctx.fillRect(lx - P, ly, P * 3, P);
      ctx.fillRect(lx, ly - P, P, P * 3);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = on ? col : '#1e293b';
    ctx.fillRect(lx, ly, P, P);
  });
  // Sparkles turning round the star
  for (let k = 0; k < 4; k++) {
    const a = now * 0.002 + (k * Math.PI) / 2;
    const r = 30 + 6 * Math.sin(now * 0.006 + k);
    const kx = Math.round((sx + Math.cos(a) * r) / P) * P;
    const ky = Math.round((sy + Math.sin(a) * r * 0.8) / P) * P;
    const big = Math.floor(now / 300 + k) % 2 === 0;
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(kx, ky, P, P);
    if (big) {
      ctx.fillRect(kx - P, ky, P, P);
      ctx.fillRect(kx + P, ky, P, P);
      ctx.fillRect(kx, ky - P, P, P);
      ctx.fillRect(kx, ky + P, P, P);
    }
  }
  ctx.restore();
}

function drawPixelGroundShadow(ctx, centerX, groundY, width = 62, hopOffset = 0) {
  const shrink = Math.max(0.72, 1 - Math.abs(hopOffset) * 0.018);
  const w1 = Math.round((width * shrink) / 4) * 4;
  const w2 = Math.round((w1 * 0.68) / 4) * 4;
  const x1 = Math.round(centerX - w1 / 2);
  const x2 = Math.round(centerX - w2 / 2);
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.fillRect(x1, groundY - 3, w1, 6);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
  ctx.fillRect(x2, groundY - 5, w2, 10);
  ctx.restore();
}

// Helper: Draw a Comic Spiky Impact Starburst (for banana slip)
function drawComicStarburst(ctx, cx, cy, innerR, outerR, points, fillCol, strokeCol, rot = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / points;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fillCol;
  ctx.fill();
  if (strokeCol) {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = strokeCol;
    ctx.stroke();
  }
  ctx.restore();
}

// Helper: Draw a High-Craft Shaded 2D Cartoon Banana Peel
function drawCartoonBananaPeel(ctx, x, y, angle = 0, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // Soft ground shadow under banana peel
  if (Math.abs(angle) < 0.2) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 7, 26, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#5c2d0c';

  // Left peel
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(-2, -9);
  ctx.quadraticCurveTo(-19, -11, -27, 5);
  ctx.quadraticCurveTo(-14, 10, -3, -1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right peel
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(2, -9);
  ctx.quadraticCurveTo(19, -11, 27, 5);
  ctx.quadraticCurveTo(14, 10, 3, -1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Center front peel
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(-4, -10);
  ctx.quadraticCurveTo(0, -19, 4, -10);
  ctx.quadraticCurveTo(9, 6, 0, 12);
  ctx.quadraticCurveTo(-9, 6, -4, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Specular shine
  ctx.fillStyle = '#fef9c3';
  ctx.beginPath();
  ctx.ellipse(0, -1, 2.2, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brown stem tip
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.roundRect(-3, -17, 6, 5, 2);
  ctx.fill();
  ctx.restore();
}

// Helper: Draw a Pixel Heart (cx, cy, pixelSize, color)
function drawPixelHeart(ctx, cx, cy, p = 3, color = '#ff4d6d') {
  const rows = [
    '0110110',
    '1111111',
    '1111111',
    '0111110',
    '0011100',
    '0001000',
  ];
  ctx.save();
  const startX = Math.round(cx - (7 * p) / 2);
  const startY = Math.round(cy - (6 * p) / 2);
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < 7; c++) {
      if (rows[r][c] === '1') {
        ctx.fillStyle = '#14081c';
        ctx.fillRect(startX + c * p + p, startY + r * p + p, p, p);
        ctx.fillStyle = color;
        ctx.fillRect(startX + c * p, startY + r * p, p, p);
      }
    }
  }
  ctx.restore();
}

// Helper: Sculpted 16-Bit Golden Arcade Heart (11x10 Grid with Full Black Pixel Outline & White Specular Shine)
// Matches the Golden Heart in the user's LOVE ATTACK reference!
function drawGoldenArcadeHeart(ctx, cx, cy, p = 4) {
  // 0: empty, 1: black outline, 2: bright gold, 3: deep gold shade, 4: white glint
  const matrix = [
    '00111011100',
    '01222122210',
    '12442222231',
    '12422222231',
    '12222222331',
    '01222223310',
    '00122233100',
    '00012331000',
    '00001310000',
    '00000100000',
  ];
  const palette = {
    1: '#160724',
    2: '#facc15',
    3: '#d97706',
    4: '#ffffff',
  };
  const startX = Math.round(cx - (11 * p) / 2);
  const startY = Math.round(cy - (10 * p) / 2);
  ctx.save();
  // Drop shadow
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < 11; c++) {
      if (matrix[r][c] !== '0') {
        ctx.fillStyle = 'rgba(15, 7, 28, 0.55)';
        ctx.fillRect(startX + c * p + p, startY + r * p + p, p, p);
      }
    }
  }
  // Main heart pixels
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < 11; c++) {
      const code = matrix[r][c];
      if (code !== '0') {
        ctx.fillStyle = palette[code];
        ctx.fillRect(startX + c * p, startY + r * p, p, p);
      }
    }
  }
  ctx.restore();
}

// Helper: Authentic 16-Bit Pixel Emote Bubble (Replaces giant white Malgun Gothic text banners!)
function drawPixelEmoteBubble(ctx, cx, bottomY, type = 'music', now = 0) {
  const P = 3;
  const bob = Math.floor(now / 220) % 2 === 0 ? 0 : -3;
  const bw = 54;
  const bh = 36;
  const bx = Math.round(cx - bw / 2);
  const by = Math.round(bottomY - bh + bob);

  ctx.save();
  // Drop shadow
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fillRect(bx + 6, by + 6, bw - 4, bh - 2);

  // Notched 16-bit Pixel Bubble Frame
  ctx.fillStyle = '#141829';
  ctx.fillRect(bx + P, by, bw - P * 2, bh);
  ctx.fillRect(bx, by + P, bw, bh - P * 2);

  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(bx + P * 2, by + P, bw - P * 4, bh - P * 2);
  ctx.fillRect(bx + P, by + P * 2, bw - P * 2, bh - P * 4);

  // Bubble Tail
  ctx.fillStyle = '#141829';
  ctx.fillRect(cx - P * 2, by + bh, P * 4, P);
  ctx.fillRect(cx - P, by + bh + P, P * 2, P);
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(cx - P, by + bh - P, P * 2, P * 2);

  // Emote Icon Inside Bubble
  const icX = Math.round(cx);
  const icY = Math.round(by + bh / 2);

  if (type === 'music') {
    // Pixel Eighth Note
    const nX = icX - 10;
    const nY = icY - 9;
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(nX + 6, nY, 12, 3);
    ctx.fillRect(nX + 6, nY, 3, 14);
    ctx.fillRect(nX + 15, nY, 3, 12);
    ctx.fillRect(nX + 1, nY + 11, 7, 6);
    ctx.fillRect(nX + 10, nY + 9, 7, 6);
  } else if (type === 'shock') {
    // Double Pixel Exclamation (!!)
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(icX - 8, icY - 10, 5, 12);
    ctx.fillRect(icX - 8, icY + 5, 5, 4);
    ctx.fillRect(icX + 3, icY - 10, 5, 12);
    ctx.fillRect(icX + 3, icY + 5, 5, 4);
  } else if (type === 'heart') {
    drawPixelHeart(ctx, icX, icY, 2.6, '#ff4d6d');
  } else if (type === 'question') {
    // Crisp Pixel "?!"
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(icX - 11, icY - 10, 10, 3);
    ctx.fillRect(icX - 4, icY - 7, 3, 5);
    ctx.fillRect(icX - 8, icY - 2, 5, 4);
    ctx.fillRect(icX - 8, icY + 5, 4, 4);
    ctx.fillStyle = '#ff4d6d';
    ctx.fillRect(icX + 4, icY - 10, 4, 12);
    ctx.fillRect(icX + 4, icY + 5, 4, 4);
  }
  ctx.restore();
}

// Phones show the 960px stage only ~340-470 css px wide (0.36-0.49x), so a 13.5px bubble ends up ~5 px tall,
// far under the ~11 pt legibility floor in Apple's HIG. Below 760 css px, stage text (bubbles, HUDs, hints,
// banners) is drawn STAGE_UI_SCALE bigger. Measured once per frame (updateStageUiScale in the render loop).
const STAGE_UI_SCALE = 1.6;
function updateStageUiScale(canvas) {
  const w = canvas ? canvas.getBoundingClientRect().width : 0;
  MOTION_STATE.uiK = w > 0 && w < 760 ? STAGE_UI_SCALE : 1;
  MOTION_STATE.bubbleMinY = 0; // a scene may raise it (the town keeps bubbles under its menu)
}
function stageUiK() {
  return MOTION_STATE.uiK || 1;
}
// Run fn scaled by the stage UI factor around (ox, oy), capped so a w-wide element stays inside the stage
function withStageUi(ctx, ox, oy, w, fn) {
  const k = Math.min(stageUiK(), w ? 944 / w : Infinity);
  if (k <= 1) {
    fn();
    return;
  }
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(k, k);
  ctx.translate(-ox, -oy);
  fn();
  ctx.restore();
}

// Helper: Authentic 16-Bit Pixel Speech Bubble for Funny Cutscene Dialogue
function drawRetroSpeechBubble(
  ctx,
  anchorX,
  anchorY,
  text,
  accentColor = '#38bdf8',
  now = 0,
  area = null // { minX, maxX }: keep the bubble inside this band (wraps to two lines if needed)
) {
  const P = 3;
  const k = stageUiK();
  const areaL = area ? area.minX : 18;
  const areaR = area ? area.maxX : 942;
  const maxW = areaR - areaL;
  const bob = Math.floor(now / 250) % 2 === 0 ? 0 : -2;
  ctx.save();
  const fontPx = 13.5 * k;
  ctx.font = `800 ${fontPx}px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
  // Too wide for the stage (long lines at the phone size): break at the space nearest the middle
  let lines = [text];
  if (Math.ceil(ctx.measureText(text).width) + 32 * k > maxW) {
    const mid = text.length / 2;
    let cut = -1;
    for (let i = 0; i < text.length; i++) if (text[i] === ' ' && (cut < 0 || Math.abs(i - mid) < Math.abs(cut - mid))) cut = i;
    if (cut > 0) lines = [text.slice(0, cut), text.slice(cut + 1)];
  }
  const textW = Math.max(...lines.map((l) => Math.ceil(ctx.measureText(l).width)));
  const bw = Math.min(maxW, Math.max(128, Math.round((textW + 32 * k) / 4) * 4));
  const lineH = fontPx * 1.35;
  const bh = Math.round(36 * k + (lines.length - 1) * lineH);

  // Clamp bubble horizontally & vertically so it never clips off-canvas or overlaps top HUD bars (y=12..48)
  const bx = Math.max(areaL, Math.min(areaR - bw, Math.round(anchorX - bw / 2)));
  const by = Math.max(56 + (k - 1) * 30, MOTION_STATE.bubbleMinY || 0, Math.round(anchorY - bh - 10 + bob));
  const tailX = Math.max(bx + 18, Math.min(bx + bw - 18, Math.round(anchorX)));

  // 16-bit Pixel Drop Shadow
  ctx.fillStyle = 'rgba(9, 13, 26, 0.42)';
  ctx.fillRect(bx + 5, by + 5, bw, bh);

  // Stepped Outer Black Pixel Frame (#141829)
  ctx.fillStyle = '#141829';
  ctx.fillRect(bx + P, by, bw - P * 2, bh);
  ctx.fillRect(bx, by + P, bw, bh - P * 2);

  // Warm Ivory Inner Fill (#fffdf9)
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(bx + P * 2, by + P, bw - P * 4, bh - P * 2);
  ctx.fillRect(bx + P, by + P * 2, bw - P * 2, bh - P * 4);

  // Top Accent Pixel Bar
  ctx.fillStyle = accentColor;
  ctx.fillRect(bx + P * 2, by + P, bw - P * 4, 4);

  // Stepped Pixel Pointer Tail
  ctx.fillStyle = '#141829';
  ctx.fillRect(tailX - P * 2, by + bh, P * 4, P);
  ctx.fillRect(tailX - P, by + bh + P, P * 2, P * 2);
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(tailX - P, by + bh - P, P * 2, P * 2);

  // Crisp Dialogue Text
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, bx + bw / 2, by + bh / 2 + 2 + (i - (lines.length - 1) / 2) * lineH));
  ctx.restore();
}

// Helper: Sleek Cyber-Arcade HUD Scanner Pill (for Scene 1 Phase B Whole-UFO Pixel Conversion)
function drawPixelScanHudPill(ctx, cx, y, pct) {
  // Bigger on phones, grown upwards from the pill's bottom so it stays on the stage
  const bottom = Math.min(y + 34, 532);
  withStageUi(ctx, cx, bottom, 254, () => drawPixelScanHudPillBody(ctx, cx, bottom - 34, pct));
}

function drawPixelScanHudPillBody(ctx, cx, y, pct) {
  const w = 248;
  const h = 34;
  const x = Math.round(cx - w / 2);
  const topY = Math.round(y);

  ctx.save();
  ctx.fillStyle = '#090d1a';
  ctx.fillRect(x - 3, topY - 3, w + 6, h + 6);
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(x - 1, topY - 1, w + 2, h + 2);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, topY, w, h);

  // Inner progress bar background
  ctx.fillStyle = 'rgba(103, 232, 249, 0.16)';
  ctx.fillRect(x + 6, topY + 22, w - 12, 6);
  ctx.fillStyle = pct >= 100 ? '#34d399' : '#38bdf8';
  ctx.fillRect(x + 6, topY + 22, Math.round(((w - 12) * pct) / 100), 6);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    MOTION_STATE.vehicle === 'car'
      ? pct < 100
        ? `CAR & PILOT PIXEL SCAN · ${pct}%`
        : 'PIXEL CAR COMPLETE!'
      : MOTION_STATE.vehicle === 'boat'
      ? pct < 100
        ? `SHIP & PILOT PIXEL SCAN · ${pct}%`
        : 'PIXEL SHIP COMPLETE!'
      : pct < 100
      ? `PLANE & PILOT PIXEL SCAN · ${pct}%`
      : 'PIXEL PLANE COMPLETE!',
    cx,
    topY + 12
  );
  ctx.restore();
}

// Sculpted 9-Row x 7-Col 16-Bit Arcade Title Bitmap Font (Matches LOVE ATTACK Proportions!)
const ARCADE_BITMAP_FONT_9 = {
  P: [
    '1111110',
    '1111111',
    '1100011',
    '1100011',
    '1111111',
    '1111110',
    '1100000',
    '1100000',
    '1100000',
  ],
  I: [
    '1111110',
    '1111110',
    '0011000',
    '0011000',
    '0011000',
    '0011000',
    '0011000',
    '1111110',
    '1111110',
  ],
  X: [
    '1100011',
    '1100011',
    '0110110',
    '0011100',
    '0011100',
    '0011100',
    '0110110',
    '1100011',
    '1100011',
  ],
  E: [
    '1111111',
    '1111111',
    '1100000',
    '1100000',
    '1111110',
    '1100000',
    '1100000',
    '1111111',
    '1111111',
  ],
  L: [
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1111111',
    '1111111',
  ],
  N: [
    '1100011',
    '1110011',
    '1111011',
    '1111111',
    '1101111',
    '1100111',
    '1100011',
    '1100011',
    '1100011',
  ],
  G: [
    '0111110',
    '1111111',
    '1100011',
    '1100000',
    '1101111',
    '1100011',
    '1100011',
    '1111111',
    '0111110',
  ],
  U: [
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1111111',
    '0111110',
  ],
};

// The title words are thousands of fillRects; draw each word once into a 2x canvas and blit it after that
const ARCADE_WORD_CACHE = new Map();
function drawArcadePixelWord(ctx, word, centerX, topY, pSize = 5) {
  const totalW = word.length * 7 * pSize + (word.length - 1) * pSize * 2;
  const pad = pSize * 2 + 2;
  const w = Math.ceil(totalW + pad * 2);
  const h = Math.ceil(9 * pSize + pad * 2);
  const key = `${word}|${pSize}`;
  let c = ARCADE_WORD_CACHE.get(key);
  if (!c) {
    c = document.createElement('canvas');
    c.width = w * 2;
    c.height = h * 2;
    const cc = c.getContext('2d');
    cc.scale(2, 2);
    drawArcadePixelWordRaw(cc, word, pad + totalW / 2, pad, pSize);
    ARCADE_WORD_CACHE.set(key, c);
  }
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(c, Math.round(centerX - totalW / 2) - pad, Math.round(topY) - pad, w, h);
  ctx.restore();
}

// Draw a Sculpted 16-Bit Arcade Title Word (Exact Integer Grid + 1-Pixel Black Border + 3D Shadow + Top Bevel)
function drawArcadePixelWordRaw(ctx, word, centerX, topY, pSize = 5) {
  const chars = word.split('');
  const cols = 7;
  const rows = 9;
  const charW = cols * pSize;
  const gap = pSize * 2;
  const totalW = chars.length * charW + (chars.length - 1) * gap;
  const startX = Math.round(centerX - totalW / 2);
  const startY = Math.round(topY);

  const rowColors = [
    '#ff9ebb',
    '#ff85a9',
    '#ff6b97',
    '#ff5486',
    '#ff3d75',
    '#e82761',
    '#d11950',
    '#b81143',
    '#9e0b37',
  ];

  ctx.save();
  // Pass 1: 3D Extruded Drop Shadow (Bottom-Right +pSize, +pSize*2)
  chars.forEach((ch, idx) => {
    const grid = ARCADE_BITMAP_FONT_9[ch];
    if (!grid) return;
    const cx = startX + idx * (charW + gap);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === '1') {
          const px = cx + c * pSize;
          const py = startY + r * pSize;
          ctx.fillStyle = '#12051e';
          ctx.fillRect(px + pSize, py + pSize * 2, pSize + 2, pSize + 2);
        }
      }
    }
  });

  // Pass 2: Crisp 1-Block 8-Neighbor Black Pixel Outline (#180828)
  chars.forEach((ch, idx) => {
    const grid = ARCADE_BITMAP_FONT_9[ch];
    if (!grid) return;
    const cx = startX + idx * (charW + gap);
    ctx.fillStyle = '#180828';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === '1') {
          const px = cx + c * pSize;
          const py = startY + r * pSize;
          ctx.fillRect(px - pSize, py - pSize, pSize * 3, pSize * 3);
        }
      }
    }
  });

  // Pass 3: Vibrant Rose-Pink Arcade Fill + 1-Block Top Inner Bevel Highlight
  chars.forEach((ch, idx) => {
    const grid = ARCADE_BITMAP_FONT_9[ch];
    if (!grid) return;
    const cx = startX + idx * (charW + gap);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === '1') {
          const px = cx + c * pSize;
          const py = startY + r * pSize;
          ctx.fillStyle = rowColors[r];
          ctx.fillRect(px, py, pSize, pSize);

          const upEmpty = r === 0 || grid[r - 1][c] === '0';
          if (upEmpty) {
            ctx.fillStyle = '#ffd9e6';
            ctx.fillRect(px, py, pSize, Math.max(2, Math.floor(pSize * 0.45)));
          }
        }
      }
    }
  });
  ctx.restore();
}

// Helper: Draw Crisp Pixel-Outlined Subtitle Text (Floating cleanly over sky like "RESCENE" in LOVE ATTACK)
function drawPixelOutlinedSubtitle(ctx, text, cx, cy) {
  ctx.save();
  ctx.font = '900 14.5px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#140824';
  const offsets = [
    [-2, -2], [0, -2], [2, -2],
    [-2, 0],           [2, 0],
    [-2, 2],  [0, 2],  [2, 2],
    [0, 3],   [2, 3],
  ];
  for (const [ox, oy] of offsets) {
    ctx.fillText(text, cx + ox, cy + oy);
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

// Helper: Scene 1 background — the cracking ice canyon (the old picture had the UFO painted in); the parked
// plane, icebreaker and car are drawn on it by drawScene0Escape (escape-scene.js)
function drawRefScene1ChoiceBackground(ctx, now) {
  drawRefVortexBackground(ctx, now);
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let s = 0; s < 18; s++) {
    const sx = (s * 59 + now * 0.035) % 960;
    const sy = (s * 43 + now * 0.055) % 520;
    ctx.beginPath();
    ctx.arc(sx, sy, (s % 2) + 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Helper: Scene 2 & Scene 4 Background — Reference Vortex Pillar
function drawRefVortexBackground(ctx, now) {
  ensureIntroBackgrounds();
  if (MOTION_STATE.bgRefVortexLoaded && MOTION_STATE.bgRefVortexImg) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(MOTION_STATE.bgRefVortexImg, 0, 0, 960, 540);
  } else if (MOTION_STATE.bgScene1Loaded && MOTION_STATE.bgScene1Img) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(MOTION_STATE.bgScene1Img, 0, 0, 960, 540);
  } else {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 540);
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 960, 540);
  }

  // Animated rising neon 3D voxel cubes & vertical beam shimmer inside the right-side Voxel Pillar (x = 610..830)
  ctx.save();
  const beamGlow = ctx.createLinearGradient(620, 0, 820, 0);
  beamGlow.addColorStop(0, 'rgba(56, 189, 248, 0)');
  beamGlow.addColorStop(0.35, 'rgba(103, 232, 249, 0.22)');
  beamGlow.addColorStop(0.65, 'rgba(236, 72, 153, 0.22)');
  beamGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = beamGlow;
  ctx.fillRect(600, 0, 240, 540);

  for (let i = 0; i < 14; i++) {
    const vx = 635 + ((i * 37) % 175) + Math.sin(now * 0.004 + i) * 8;
    const vy = 530 - (((now * 0.14 + i * 43) % 520) | 0);
    const sz = i % 3 === 0 ? 10 : 7;
    ctx.fillStyle = '#090d1a';
    ctx.fillRect(vx - 1, vy - 1, sz + 2, sz + 2);
    ctx.fillStyle = i % 3 === 0 ? '#67e8f9' : i % 2 === 0 ? '#f472b6' : '#38bdf8';
    ctx.fillRect(vx, vy, sz, sz);
  }
  ctx.restore();
}

// Helper: Scene 3 Background — Reference Image #3 (Sky Islands, Crystals & Cloud Sea)
function drawRefSkyGameBackground(ctx, now) {
  ensureIntroBackgrounds();
  if (MOTION_STATE.bgRefSkyGameLoaded && MOTION_STATE.bgRefSkyGameImg) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(MOTION_STATE.bgRefSkyGameImg, 0, 0, 960, 540);
  } else {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 540);
    skyGrad.addColorStop(0.0, '#0284c7');
    skyGrad.addColorStop(0.55, '#38bdf8');
    skyGrad.addColorStop(1.0, '#e0f2fe');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 960, 540);
  }

  // Subtle high-speed wind streaks & crystal glints in the open sky corridor
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  for (let w = 0; w < 8; w++) {
    const wx = 960 - (((now * (0.38 + (w % 3) * 0.12) + w * 149) % 1100) | 0);
    const wy = 95 + ((w * 47) % 280);
    const ww = 54 + (w % 4) * 24;
    ctx.fillRect(wx, wy, ww, 2);
  }
  ctx.restore();
}

// Winter version of the cherry-blossom town: same composition, snow instead of blossoms.
// bg_scene5_xmas.jpg + these anchors come from scratch/xmas_town/winterize_cherry_bg.py — regenerate both.
// bulbs: [x, y, colorIdx] in stage px on the frosted tree crowns · ice: [topY, bottomY, leftX, rightX]
const XMAS_TOWN_ANCHORS = {"bulbs":[[4,212,0],[28,208,0],[0,240,2],[52,232,2],[208,240,2],[64,256,0],[212,252,3],[836,252,1],[8,284,2],[28,272,2],[164,276,3],[184,276,3],[208,276,1],[240,276,3],[284,284,1],[864,276,3],[8,304,1],[60,300,1],[80,304,2],[220,304,2],[240,296,2],[288,296,2],[396,304,1],[416,296,3],[732,304,1],[788,296,2],[832,300,3],[868,300,0],[940,304,0],[0,320,3],[920,320,3],[84,340,0]],"ice":[324,404,200,880]};
const XMAS_BULB_COLORS = ['#ff5a6a', '#ffd84a', '#5cf29a', '#6cc4ff'];

// Kept deliberately light: a few twinkling lights on the trees, glints on the ice and falling snow
function drawXmasTownOverlay(ctx, now) {
  const P = 4;
  const A = XMAS_TOWN_ANCHORS;
  const snap = (v) => Math.floor(v / P) * P;
  ctx.save();

  const beat = Math.floor(now / 520);
  (A.bulbs || []).forEach(([x, y, k], i) => {
    if ((i + beat) % 3 === 0) return;
    ctx.fillStyle = XMAS_BULB_COLORS[k];
    ctx.globalAlpha = 0.3;
    ctx.fillRect(x - P, y - P, P * 3, P * 3);
    ctx.globalAlpha = 1;
    ctx.fillRect(x, y, P, P);
  });

  if (A.ice) {
    const [iceTop, iceBot, iceL, iceR] = A.ice;
    const glint = Math.floor(now / 320) % 2;
    ctx.fillStyle = 'rgba(240, 246, 255, 0.85)';
    for (let g = 0; g < 9; g++) {
      const gx = snap(iceL + 40 + g * ((iceR - iceL - 80) / 8) + glint * 8);
      const gy = snap(iceTop + 12 + ((g * 23) % Math.max(1, iceBot - iceTop - 24)));
      ctx.fillRect(gx, gy, P * 2, P);
    }
  }

  // Snowfall: far flakes drift slowly, every fourth flake is a larger near one
  for (let i = 0; i < 56; i++) {
    const near = i % 4 === 0;
    const speed = near ? 0.05 + (i % 3) * 0.008 : 0.022 + (i % 5) * 0.004;
    const fy = snap(((now * speed + i * 83) % 580) - 20);
    const sway = Math.sin(now * 0.0012 + i * 1.7) * (near ? 16 : 8);
    const fx = snap((((i * 151 + sway) % 960) + 960) % 960);
    ctx.fillStyle = near ? '#ffffff' : '#d6e0f8';
    ctx.fillRect(fx, fy, near ? P * 2 : P, near ? P * 2 : P);
  }
  ctx.restore();
}

// Christmas only: pixel Santa hat in the species sheet's own 8 px grid (sheet frame 256x256),
// drawn inside drawAnimatedPixelPenguin's transform so it bobs, waddles and flips with the body.
const SANTA_HAT_ROWS = [
  '...........oWWo.',
  '..........oWWWWo',
  '........ooRoWWo.',
  '......oRRRRRoo..',
  '....orRRRRRRo...',
  '...orrRRRRRRRo..',
  '..oWWWWWWWWWWWo.',
  '..owwwwwwwwwwwo.',
  '...ooooooooooo..',
];
const SANTA_HAT_COLORS = { o: '#1c1020', R: '#d62839', r: '#a51d2c', W: '#f5f7ff', w: '#c9d3ea' };
// Drawn once per size into a 2x canvas (it is ~100 fillRects per penguin per frame otherwise)
const SANTA_HAT_CACHE = new Map();
function drawSantaHatOnSheet(ctx, size) {
  const cell = (size / 256) * 8;
  const ox = -size / 2 + 8 * cell;
  const oy = -size / 2;
  const w = Math.ceil(SANTA_HAT_ROWS[0].length * cell + 1);
  const h = Math.ceil(SANTA_HAT_ROWS.length * cell + 1);
  let c = SANTA_HAT_CACHE.get(size);
  if (!c) {
    c = document.createElement('canvas');
    c.width = w * 2;
    c.height = h * 2;
    const cc = c.getContext('2d');
    cc.scale(2, 2);
    cc.translate(-ox, -oy);
    drawSantaHatRows(cc, cell, ox, oy);
    SANTA_HAT_CACHE.set(size, c);
  }
  ctx.drawImage(c, ox, oy, w, h);
}
function drawSantaHatRows(ctx, cell, ox, oy) {
  SANTA_HAT_ROWS.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const col = SANTA_HAT_COLORS[row[c]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + c * cell, oy + r * cell, cell + 0.5, cell + 0.5);
    }
  });
}

// Helper: Scene 5 town background (seasonal: Christmas pixel town, or Cherry-Blossom park with petals & water glints)
function drawScene2PixelWorldBackground(ctx, now) {
  ensureIntroBackgrounds();
  const P = 4;
  const snap = (v) => Math.floor(v / P) * P;

  if (MOTION_STATE.bgScene2Loaded && MOTION_STATE.bgScene2Img) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(MOTION_STATE.bgScene2Img, 0, 0, 960, 540);
  } else {
    ctx.fillStyle = INTRO_TOWN.id === 'xmas' ? '#131c40' : '#5899e2';
    ctx.fillRect(0, 0, 960, 410);
    ctx.fillStyle = INTRO_TOWN.id === 'xmas' ? '#e6eefc' : '#52b768';
    ctx.fillRect(0, 410, 960, 130);
  }

  if (INTRO_TOWN.id === 'xmas') {
    drawXmasTownOverlay(ctx, now);
    return;
  }

  // Animated Pixel Water Sparkles on the River (y = 342..392, x = 330..840)
  const waveTick = Math.floor(now / 300) % 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let w = 0; w < 9; w++) {
    const wx = snap(348 + w * 52 + (waveTick ? 8 : 0));
    const wy = snap(348 + ((w * 19) % 40));
    ctx.fillRect(wx, wy, P * 2, P);
  }

  // Live Drifting Pink Cherry Blossom Pixel Petals across the sky & riverside
  for (let i = 0; i < 18; i++) {
    const px = snap((960 - ((now * 0.045 + i * 67) % 980) + 980) % 960);
    const py = snap(36 + ((now * 0.03 + i * 53) % 390));
    ctx.fillStyle = i % 2 === 0 ? '#ff8fab' : '#ffd6e4';
    ctx.fillRect(px, py, P, P);
  }
}

// Helper: 16-Bit Pixel Mosaic Wipe Transition at the start of each scene
function drawRetroSceneWipe(ctx, elapsedMs) {
  const wipeDur = 240;
  if (elapsedMs >= wipeDur) return;
  const t = elapsedMs / wipeDur; // 0 -> 1
  const cell = 32;
  ctx.save();
  ctx.fillStyle = '#0b0f1e';
  for (let y = 0; y < 540; y += cell) {
    for (let x = 0; x < 960; x += cell) {
      const delay = ((x / cell + y / cell) % 4) * 0.08;
      const localP = Math.max(0, Math.min(1, (t - delay) / 0.75));
      const sz = Math.round(cell * (1 - localP));
      if (sz > 0) {
        const pad = Math.floor((cell - sz) / 2);
        ctx.fillRect(x + pad, y + pad, sz, sz);
      }
    }
  }
  ctx.restore();
}

// Helper: Update the Crisp HTML RPG Dialogue Box below the Canvas
let LAST_DIALOGUE_KEY = '';
function drawRetroDialogueBar(ctx, speaker, lineText) {
  const key = `${speaker}|${lineText}`;
  if (key !== LAST_DIALOGUE_KEY) {
    LAST_DIALOGUE_KEY = key;
    const spEl = document.getElementById('intro-dialogue-speaker');
    const txtEl = document.getElementById('intro-dialogue-text');
    if (spEl) spEl.textContent = speaker;
    if (txtEl) txtEl.textContent = lineText;
  }
}

// Helper: Draw a Glossy Golden 5-Pointed Star Collectible (Matches Reference Image #3!)
function drawGoldenStarCollectible(ctx, r = 18, now = 0) {
  ctx.save();
  // Outer golden glow
  ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2);
  ctx.fill();

  // 5-pointed star path
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.46;
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const sx = Math.cos(ang) * rad;
    const sy = Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();

  const starGrad = ctx.createLinearGradient(0, -r, 0, r);
  starGrad.addColorStop(0, '#fef08a');
  starGrad.addColorStop(0.55, '#facc15');
  starGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = starGrad;
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.fill();
  ctx.stroke();

  // Inner specular highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.18, -r * 0.24, r * 0.22, r * 0.12, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Tiny floating pixel sparkle beside the star
  const spOff = Math.sin(now * 0.01) * 3;
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(r * 0.75, -r * 0.75 + spOff, 4, 4);
  ctx.restore();
}

// Helper: Draw a Vertical Glowing Pink/White Neon Warp Ring (Matches Reference Image #3!)
function drawPinkNeonWarpRing(ctx, now = 0) {
  ctx.save();
  const pulse = 1 + Math.sin(now * 0.012) * 0.05;
  ctx.scale(pulse, pulse);

  // Outer pink neon aura
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.38)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 48, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Mid hot-pink neon ring
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 48, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Bright white inner core ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 48, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Orbiting pink & yellow pixel sparkles around the ring
  for (let k = 0; k < 5; k++) {
    const a = now * 0.005 + (k * Math.PI * 2) / 5;
    const px = Math.cos(a) * 24;
    const py = Math.sin(a) * 52;
    ctx.fillStyle = k % 2 === 0 ? '#f472b6' : '#fde047';
    ctx.fillRect(px - 2.5, py - 2.5, 5, 5);
  }
  ctx.restore();
}





function initPixelMotionStudio() {
  const canvas = document.getElementById('pixel-stage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Preload Reference Backgrounds, 2D Hero Penguin (hero_2d_sheet.png), Modular Parts Manifest, Hero Blue (sp_01), and Colorful Friends (04, 05, 06, 09, 15)
  ensureIntroBackgrounds();
  ensureHero2DSprite();
  ensureDefaultPilotSheets();
  ['01', '04', '05', '06', '09', '10', '15', '22'].forEach((id) => ensureSpeciesSprite(id));

  const pilotInput = document.getElementById('ufo-pilot-id-input');
  const s1Input = document.getElementById('scene1-nft-input');
  const boardNftBtn = document.getElementById('btn-ufo-board-nft');
  const boardNoneBtn = document.getElementById('btn-ufo-board-none');
  const s1YesBtn = document.getElementById('btn-scene1-yes');
  const s1NoBtn = document.getElementById('btn-scene1-no');

  const handleEscapeYesWithOptionalNft = (sourceInput) => {
    const raw = (sourceInput ? sourceInput.value : s1Input?.value || pilotInput?.value || '').trim();
    if (raw === '') {
      boardUfoWithoutNft(true);
      return;
    }
    const n = /^\d+$/.test(raw) ? parseInt(raw, 10) : NaN;
    if (Number.isNaN(n) || n > 9999) {
      // Keep the prompt open: an invalid number must not start an unrecorded run silently
      const subEl = document.getElementById('s1-overlay-sub');
      if (subEl) {
        subEl.textContent =
          CURRENT_LANG === 'ko' ? '0~9999 사이 번호만 기록됩니다.' : 'Only numbers 0–9999 can be recorded.';
        subEl.style.color = '#fb7185';
      }
      sourceInput?.focus();
      return;
    }
    setUfoPilotTokenId(n, true, true);
  };

  if (pilotInput) {
    pilotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEscapeYesWithOptionalNft(pilotInput);
      }
    });
    pilotInput.addEventListener('input', () => {
      if (s1Input && s1Input.value !== pilotInput.value) {
        s1Input.value = pilotInput.value;
      }
      const raw = pilotInput.value.trim();
      if (raw !== '' && !Number.isNaN(parseInt(raw, 10))) {
        setUfoPilotTokenId(parseInt(raw, 10), false, false);
      } else {
        boardUfoWithoutNft(false);
      }
    });
  }

  if (s1Input) {
    let s1InputTimer = null;
    s1Input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(s1InputTimer);
        handleEscapeYesWithOptionalNft(s1Input);
      }
    });
    // Preview the typed number once typing pauses (not one compose per keystroke: 9 -> 99 -> 998 -> 9985)
    s1Input.addEventListener('input', () => {
      if (pilotInput && pilotInput.value !== s1Input.value) {
        pilotInput.value = s1Input.value;
      }
      clearTimeout(s1InputTimer);
      s1InputTimer = setTimeout(() => {
        const raw = s1Input.value.trim();
        if (raw !== '' && !Number.isNaN(parseInt(raw, 10))) {
          setUfoPilotTokenId(parseInt(raw, 10), false, false);
        } else {
          boardUfoWithoutNft(false);
        }
      }, 260);
    });
  }

  boardNftBtn?.addEventListener('click', () => handleEscapeYesWithOptionalNft(pilotInput));
  s1YesBtn?.addEventListener('click', () => {
    // On a phone the game is played in the fullscreen shell (stage + touch pad, no page scroll); the tap is the
    // user gesture requestFullscreen needs
    const isPhone = window.matchMedia('(pointer: coarse)').matches && Math.min(window.innerWidth, window.innerHeight) < 600;
    if (isPhone && !MOTION_STATE.isFullscreen) enterUfoFullscreenGame(false);
    handleEscapeYesWithOptionalNft(s1Input);
  });

  boardNoneBtn?.addEventListener('click', () => {
    skipEscapeToCherryBlossomTown();
  });
  s1NoBtn?.addEventListener('click', () => {
    skipEscapeToCherryBlossomTown();
  });

  // Vehicle picker in the start prompt
  document.querySelectorAll('.s1-vehicle-btn').forEach((btn) => {
    btn.addEventListener('click', () => setEscapeVehicle(btn.dataset.vehicle));
  });
  updateVehicleUI();

  // Default initial state: Guest ('기본 펭귄 · 기록 미저장') with Default Blue Penguin ('01')
  updateUfoBoardingDockUI();

  document.getElementById('kpi-rarity-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const rules = document.getElementById('sec-rarity');
    if (rules) rules.open = true;
    scrollToSection('sec-rarity');
  });

  document.getElementById('btn-open-leaderboard')?.addEventListener('click', () => {
    openLeaderboardModal();
  });
  document.getElementById('btn-open-leaderboard-bottom')?.addEventListener('click', () => {
    openLeaderboardModal();
  });
  document.getElementById('close-leaderboard-modal')?.addEventListener('click', () => {
    closeLeaderboardModal();
  });
  document.getElementById('leaderboard-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'leaderboard-modal') closeLeaderboardModal();
  });

  // One-button controls for all vehicles in Scene 3 (sceneIdx === 2): the car jumps on press (again in the
  // air = double jump), the plane climbs while held and dives when released, the icebreaker charges while held
  // and rams on release. Space / ArrowUp / W, the mouse
  // button, a finger on the stage or on the fullscreen pad all drive the same press / release.
  const isActionKey = (code) => code === 'Space' || code === 'ArrowUp' || code === 'KeyW';
  const pressAction = () => {
    if (carGameActive()) carJumpPress(performance.now());
    else if (boatGameActive()) boatRamPress(performance.now());
    else if (skyGameActive()) skyPress();
  };
  const releaseAction = () => {
    carJumpRelease();
    boatRamRelease(performance.now());
    skyRelease();
  };
  window.addEventListener('keydown', (e) => {
    if (!isActionKey(e.code) || !(carGameActive() || boatGameActive() || skyGameActive())) return;
    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA') return;
    e.preventDefault();
    if (!e.repeat) pressAction();
  });
  window.addEventListener('keyup', (e) => {
    if (isActionKey(e.code)) releaseAction();
  });

  // Launch Fullscreen UFO Game Buttons
  const handleEnterFullscreenClick = () => {
    const raw = (s1Input?.value || pilotInput?.value || '').trim();
    if (raw !== '' && !Number.isNaN(parseInt(raw, 10))) {
      setUfoPilotTokenId(parseInt(raw, 10), true, false);
    }
    enterUfoFullscreenGame(true);
  };

  document.getElementById('btn-pixel-burst')?.addEventListener('click', handleEnterFullscreenClick);
  document.getElementById('btn-dock-fullscreen-play')?.addEventListener('click', handleEnterFullscreenClick);
  document.getElementById('btn-canvas-fullscreen-play')?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleEnterFullscreenClick();
  });
  document.getElementById('btn-exit-fullscreen-top')?.addEventListener('click', () => {
    exitUfoFullscreenGame();
  });

  // Helper to map client pointer to 960x540 canvas logical coordinates
  const getLogicalCoords = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    return {
      mx: ((clientX - rect.left) / rect.width) * 960,
      my: ((clientY - rect.top) / rect.height) * 540,
    };
  };

  // Canvas Click Interaction (Mapped to 960x540 Logical Coordinates)
  canvas.addEventListener('click', (e) => {
    const { mx, my } = getLogicalCoords(e.clientX, e.clientY);

    if (MOTION_STATE.sceneIdx === 0) {
      // A tap during the opening skips it (opening-scene.js)
      if (openingTap(mx, my)) return;
      // Tapping the plane, the icebreaker or the car picks it
      const picked = scene0VehicleAt(mx, my);
      if (picked) setEscapeVehicle(picked);
      return;
    }

    if (MOTION_STATE.sceneIdx === 1) {
      setIntroScene(2, true);
      return;
    }

    if (MOTION_STATE.sceneIdx === 2) return; // play input comes from mousedown / touchstart

    if (MOTION_STATE.sceneIdx === 3) {
      // Skip the capture only with a fresh tap made during it: the release of the press that was still steering
      // when the run ended (the plane is usually held) also fires a click, and used to skip the pixelation
      if (MOTION_STATE.pressScene === 3 && performance.now() - MOTION_STATE.sceneStartTime > 1500) setIntroScene(4, true);
      return;
    }

    if (MOTION_STATE.sceneIdx === 4) {
      // Clicking the top Score/Leaderboard banner in Scene 5 opens the NFT Ranking Tab
      const bk = MOTION_STATE.bannerK || 1;
      if (Math.abs(mx - 480) <= 320 * bk && my >= 8 && my <= 10 + 38 * bk) {
        openLeaderboardModal();
        return;
      }
      // Clicking RPG Command Box options
      const menu = townMenuLayout();
      const inMenuX = mx >= menu.x - 20 && mx <= menu.x + menu.w + 20;
      if (inMenuX && my >= menu.y && my < menu.split) {
        scrollToSection('tab-codex');
        return;
      }
      if (inMenuX && my >= menu.split && my <= menu.y + menu.h + 10) {
        MOTION_STATE.skippedEscape = false;
        setIntroScene(0, true);
        return;
      }
    }
  });

  // Which scene a press started in (see the scene 4 click above)
  const notePressScene = () => {
    MOTION_STATE.pressScene = MOTION_STATE.sceneIdx;
  };
  canvas.addEventListener('pointerdown', notePressScene);
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) pressAction();
  });
  window.addEventListener('mouseup', releaseAction);

  canvas.addEventListener('mousemove', (e) => {
    const { mx, my } = getLogicalCoords(e.clientX, e.clientY);
    if (MOTION_STATE.sceneIdx === 4) {
      const menu = townMenuLayout();
      if (my >= menu.y && my < menu.split) MOTION_STATE.menuHoverIdx = 0;
      else if (my >= menu.split && my <= menu.y + menu.h + 14) MOTION_STATE.menuHoverIdx = 1;
    }
  });

  // Touch on the stage: press while a finger is down (no page scroll during play)
  const handleStageTouch = (e) => {
    if (MOTION_STATE.sceneIdx !== 2) return;
    if (e.cancelable) e.preventDefault();
    if (e.type === 'touchstart') pressAction();
  };
  canvas.addEventListener('touchstart', handleStageTouch, { passive: false });
  canvas.addEventListener('touchmove', handleStageTouch, { passive: false });
  const releaseOnLastFinger = (e) => {
    if (e.touches.length === 0) releaseAction();
  };
  canvas.addEventListener('touchend', releaseOnLastFinger);
  canvas.addEventListener('touchcancel', releaseOnLastFinger);

  // Fullscreen pad below the stage: the whole pad is one big button
  const touchpadEl = document.getElementById('mobile-fullscreen-touchpad');
  if (touchpadEl) {
    touchpadEl.addEventListener(
      'touchstart',
      (e) => {
        if (MOTION_STATE.sceneIdx !== 2) return;
        if (e.cancelable) e.preventDefault();
        pressAction();
      },
      { passive: false }
    );
    touchpadEl.addEventListener(
      'touchmove',
      (e) => {
        if (MOTION_STATE.sceneIdx === 2 && e.cancelable) e.preventDefault();
      },
      { passive: false }
    );
    touchpadEl.addEventListener('touchend', releaseOnLastFinger);
    touchpadEl.addEventListener('touchcancel', releaseOnLastFinger);
    touchpadEl.addEventListener('mousedown', pressAction);
  }

  setIntroScene(0, true);

  // Main 60 FPS 5-Scene Reference Cutscene & Sky Game Loop (1920x1080 HiDPI Buffer, 960x540 Logical Space)
  function renderIntroCutscene() {
    // Scrolled away (codex, ranking...): nothing to draw. Scene timers run on the clock, so the story is where it
    // should be when the stage comes back; a run in progress (scene 3) keeps stepping
    if (MOTION_STATE.stageOnScreen === false && MOTION_STATE.sceneIdx !== 2) {
      requestAnimationFrame(renderIntroCutscene);
      return;
    }
    const now = performance.now();
    updateStageUiScale(canvas);
    const activeSpId = UFO_GAME.pilotSpeciesId || '01';
    ensureSpeciesSprite(activeSpId);
    ensureHero2DSprite();

    let elapsed = Math.max(0, now - MOTION_STATE.sceneStartTime);
    const curDuration = SCENE_DURATIONS[MOTION_STATE.sceneIdx] || 5600;

    let p = Math.min(1, Math.max(0, elapsed / curDuration));
    if (MOTION_STATE.sceneIdx === 0) {
      p = 0.25;
    }
    updateIntroProgressBars(MOTION_STATE.sceneIdx, p);

    // Render in 2x HiDPI (1920x1080) using 960x540 logical coordinates
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 960, 540);

    // ========================================================================
    // SCENE 1 (sceneIdx === 0): Antarctica collapsing, the default penguin picks plane / icebreaker / car
    // ========================================================================
    if (MOTION_STATE.sceneIdx === 0) {
      drawScene0Escape(ctx, now); // escape-scene.js
    }

    // SCENE 2 for the icebreaker: shoves off through the floes as the sea starts to freeze
    else if (MOTION_STATE.sceneIdx === 1 && MOTION_STATE.vehicle === 'boat') {
      ctx.save();
      ctx.translate(Math.sin(now * 0.065) * 2.4, Math.cos(now * 0.055) * 1.8);
      drawRefVortexBackgroundMirrored(ctx, now); // pillar behind, on the left: run right, away from it
      drawScene1Suction(ctx, now, p);
      drawBoatScene1Departure(ctx, now, p, activeSpId);
      ctx.restore();
      if (elapsed >= curDuration) {
        setIntroScene(2, true);
      }
    }

    // SCENE 2 for the car: floors it across the cracking ice and launches off the edge
    else if (MOTION_STATE.sceneIdx === 1 && MOTION_STATE.vehicle === 'car') {
      ctx.save();
      ctx.translate(Math.sin(now * 0.065) * 2.4, Math.cos(now * 0.055) * 1.8);
      drawRefVortexBackgroundMirrored(ctx, now); // pillar behind, on the left: run right, away from it
      drawScene1Suction(ctx, now, p);
      drawCarScene1Liftoff(ctx, now, p, activeSpId);
      ctx.restore();
      if (elapsed >= curDuration) {
        setIntroScene(2, true);
      }
    }

    // ========================================================================
    // SCENE 2 (sceneIdx === 1): the light plane's take-off run on skis across the cracking ice (plane.js)
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 1) {
      ctx.save();
      ctx.translate(Math.sin(now * 0.065) * 2.4, Math.cos(now * 0.055) * 1.8);
      drawRefVortexBackgroundMirrored(ctx, now); // pillar behind, on the left: run right, away from it
      drawScene1Suction(ctx, now, p);
      drawPlaneScene1Takeoff(ctx, now, p, activeSpId);
      ctx.restore();

      // Auto-advance from the take-off to the sky game after 2.6s
      if (elapsed >= curDuration) {
        setIntroScene(2, true);
      }
    }

    // SCENE 3 for the car: the auto-run road (car-runner.js)
    else if (MOTION_STATE.sceneIdx === 2 && MOTION_STATE.vehicle === 'car') {
      drawCarRunnerFrame(ctx, now, activeSpId);
    }

    // SCENE 3 for the icebreaker: ramming through the pack ice (boat-runner.js)
    else if (MOTION_STATE.sceneIdx === 2 && MOTION_STATE.vehicle === 'boat') {
      drawBoatRunnerFrame(ctx, now, activeSpId);
    }

    // SCENE 3 for the plane: the one-touch flying run (sky-runner.js)
    else if (MOTION_STATE.sceneIdx === 2) {
      drawSkyRunnerFrame(ctx, now, activeSpId);
    }

    // ========================================================================
    // SCENE 4 (sceneIdx === 3): each vehicle ends up in the pixel pillar its own way (scene-pull.js: the plane is
    //   snatched out of its fall, the car is dragged off the ice, the ship goes down a whirlpool and up a
    //   waterspout), then the shared scan turns vehicle + pilot into pixels.
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 3) {
      ctx.save();
      drawRefVortexBackgroundMirrored(ctx, now); // the pillar the vehicle was running from, on the left

      const subP = Math.min(1, elapsed / curDuration);
      const scanStart = SCENE3_APPROACH + 0.03;
      const scanRatio = subP < scanStart ? 0 : Math.min(1, (subP - scanStart) / (SCENE3_SCAN_END - scanStart));
      const completeP = subP > SCENE3_SCAN_END ? Math.min(1, (subP - SCENE3_SCAN_END) / (SCENE3_RISE_START - SCENE3_SCAN_END)) : 0;
      const pose = scene3Pose(MOTION_STATE.vehicle, subP, now);
      const ufoX = pose.x;
      const ufoY = pose.y;
      const ufoTilt = pose.tilt;

      // Upper Glowing Cyan Halo Ring high in the Voxel Beam (Matches Reference Image #4)
      ctx.save();
      ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(270, 86, 62, 18, 0.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(270, 86, 62, 18, 0.08, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Smoke trail / tyre spray / whirlpool + waterspout, and the beam's ribbons once it has hold
      drawScene3Approach(ctx, MOTION_STATE.vehicle, subP, now, pose);

      // The lifted car's tyres hang lower than the plane's skis, so its scan runs further down
      const isCar = MOTION_STATE.vehicle === 'car';
      const isBoat = MOTION_STATE.vehicle === 'boat';
      const carScale = 1.3;
      const planeScanScale = 1.02; // the plane is long: at this size it stays inside the 360px scan window
      const topEdge = ufoY - 120;
      const botEdge = isCar ? ufoY + 80 : ufoY + 72;
      const totalSpanH = botEdge - topEdge;
      const scanY = topEdge + scanRatio * totalSpanH;
      const pixelBlinkDuringBeam = scanRatio > 0.30 && scanRatio < 0.38;

      // 1. Top Portion (Above Laser Scan Line): GIANT 16-BIT PIXEL UFO + PIXEL PENGUIN PILOT
      if (scanRatio > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(ufoX - 180, topEdge - 40, 360, scanY - topEdge + 40);
        ctx.clip();
        if (isCar) {
          drawPixelCarWithPilot(ctx, ufoX, ufoY, ufoTilt, now, {
            scale: carScale,
            spId: activeSpId,
            forceBlink: pixelBlinkDuringBeam,
            beam: false,
            wheelAngle: now * 0.03,
          });
        } else if (isBoat) {
          drawBoatWithPilot(ctx, ufoX, ufoY, ufoTilt, now, { scale: SCENE3_BOAT_SCALE, flipX: pose.flip, spId: activeSpId, pixelMode: true, isImpactBlink: pixelBlinkDuringBeam });
        } else {
          drawPixelPlaneWithPilot(ctx, ufoX, ufoY, ufoTilt, now, {
            scale: planeScanScale,
            spId: activeSpId,
            forceBlink: pixelBlinkDuringBeam,
          });
        }
        ctx.restore();
      }

      // 2. Bottom Portion (Below Laser Scan Line): the 2D vehicle + pilot, breaking up into bigger mosaic blocks as the
      //    scan goes on (1 -> 8 px), so it is visibly turning to pixels before the line reaches it
      const mosaicSize = scanRatio > 0 ? 1 + Math.floor(scanRatio * 7) : 1;
      if (scanRatio < 1 && isBoat) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(ufoX - 180, scanY, 360, botEdge - scanY + 50);
        ctx.clip();
        drawScene3Mosaic(ctx, mosaicSize, (c) =>
          drawBoatWithPilot(c, ufoX, ufoY, ufoTilt, now, { scale: SCENE3_BOAT_SCALE, flipX: pose.flip, spId: activeSpId, isShocked: pose.phase !== 'beam' })
        );
        ctx.restore();
      } else if (scanRatio < 1 && isCar) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(ufoX - 180, scanY, 360, botEdge - scanY + 50);
        ctx.clip();
        drawScene3Mosaic(ctx, mosaicSize, (c) =>
          drawCarWithPilot(c, ufoX, ufoY, ufoTilt, now, {
            scale: carScale,
            spId: activeSpId,
            isShocked: pose.phase === 'drag' || pose.phase === 'lift',
            beam: false,
            wheelAngle: pose.phase === 'drive' ? now * 0.05 : now * 0.03,
            boost: pose.phase === 'drive' ? 1.2 : 0.6,
          })
        );
        ctx.restore();
      } else if (scanRatio < 1) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(ufoX - 180, scanY, 360, botEdge - scanY + 50);
        ctx.clip();
        drawScene3Mosaic(ctx, mosaicSize, (c) =>
          drawPlaneWithPilot(c, ufoX, ufoY, ufoTilt, now, {
            scale: planeScanScale,
            spId: activeSpId,
            isShocked: pose.phase !== 'beam',
            propSpin: false, // the engine died
          })
        );
        ctx.restore();
      }

      // 3. Voxel Matrix Scan Beam & Disintegrating Pixel Blocks
      if (scanRatio > 0 && scanRatio < 1) {
        ctx.save();
        const beamHalfW = 138;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.fillRect(ufoX - beamHalfW, scanY - 14, beamHalfW * 2, 28);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(ufoX - beamHalfW - 2, scanY - 4, beamHalfW * 2 + 4, 8);
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(ufoX - beamHalfW + 2, scanY - 2, beamHalfW * 2 - 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ufoX - beamHalfW + 8, scanY - 1, beamHalfW * 2 - 16, 2);

        const cols = 21;
        for (let k = 0; k < cols; k++) {
          const kx = Math.round(ufoX - 100 + k * 10);
          const wave = Math.sin(now * 0.032 + k * 1.35);
          const ky = Math.round(scanY + wave * 10);
          const pCol =
            k % 4 === 0
              ? '#ffffff'
              : k % 3 === 0
              ? '#f472b6'
              : k % 2 === 0
              ? '#2563eb'
              : '#67e8f9';
          ctx.fillStyle = '#090d1a';
          ctx.fillRect(kx - 4, ky - 4, 8, 8);
          ctx.fillStyle = pCol;
          ctx.fillRect(kx - 3, ky - 3, 6, 6);
        }
        ctx.restore();
      } else if (completeP > 0 && completeP < 0.85) {
        const burstR = 72 + completeP * 75;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - completeP * 1.15);
        for (let b = 0; b < 10; b++) {
          const ba = (b * Math.PI) / 5 + completeP * 0.8;
          const bx = Math.round(ufoX + Math.cos(ba) * burstR);
          const by = Math.round(ufoY + Math.sin(ba) * burstR * 0.65);
          ctx.fillStyle = '#090d1a';
          ctx.fillRect(bx - 5, by - 5, 10, 10);
          ctx.fillStyle = b % 2 === 0 ? '#facc15' : '#67e8f9';
          ctx.fillRect(bx - 3, by - 3, 6, 6);
        }
        ctx.restore();
      }

      const pct = Math.min(100, Math.round(scanRatio * 100));
      drawRetroSpeechBubble(
        ctx,
        Math.min(540, ufoX - 24),
        Math.max(64, topEdge - 6),
        scanRatio === 0
          ? scene3ApproachLine(MOTION_STATE.vehicle, pose, CURRENT_LANG === 'ko')
          : pct < 78
          ? CURRENT_LANG === 'ko'
            ? isBoat
              ? '어어 배가 통째로 하늘로 빨려 올라가!! 쇄빙선까지 도트 찍히잖아?!!'
              : isCar
              ? '어어 차가 하늘로 빨려 올라가!! 내 차까지 도트 찍히잖아?!!'
              : '으악 내 뽀샤시한 몸이!! 강제로 도트 찍히고 있잖아?!!'
            : isBoat
            ? 'The whole ship is getting sucked up!! Even the icebreaker is going pixel?!!'
            : isCar
            ? 'The car is getting sucked up!! Even my ride is going pixel?!!'
            : 'Aaagh my smooth body!! I am being forcibly pixelated?!!'
          : CURRENT_LANG === 'ko'
          ? isBoat
            ? '강제 도트화 완료... 어 잠깐 여기 바다가 없잖아 떨어진다아악!!'
            : isCar
            ? '강제 도트화 완료... 어 잠깐 바퀴가 허공에서 헛돈다 떨어진다아악!!'
            : '강제 도트화 완료... 근데 나 아직 추락 중이었잖아아악!!'
          : isBoat
          ? 'Pixelation complete... Wait, there is no sea up here?! FALLING!!'
          : isCar
          ? 'Pixelation complete... Wait, the wheels are spinning on air?! FALLING!!'
          : 'Pixelation complete... But I was still falling?! CRASHING!!',
        scanRatio === 0 ? '#fb7185' : pct < 78 ? '#38bdf8' : '#fb7185',
        now
      );
      if (scanRatio > 0) drawPixelScanHudPill(ctx, ufoX, Math.min(488, botEdge + 18), pct);

      // Then up the pillar and out of the top, Alice-style (paints over the whole stage)
      if (subP >= SCENE3_RISE_START) {
        drawScene3Rise(ctx, now, (subP - SCENE3_RISE_START) / (1 - SCENE3_RISE_START), MOTION_STATE.vehicle, activeSpId);
      }

      ctx.restore();

      if (elapsed >= curDuration) {
        setIntroScene(4, true);
      }
    }

    // ========================================================================
    // SCENE 5 (sceneIdx === 4 — seasonal pixel town, see INTRO_TOWN):
    // ========================================================================
    else {
      // (town-easter.js: once the hidden village covers the stage the town picture is not drawn under it)
      if (typeof townEasterCovers === 'function' && townEasterCovers(elapsed)) {
        // nothing: the village paints the whole stage below
      } else if (townPhone()) {
        ctx.save();
        ctx.translate(480, 0);
        ctx.scale(TOWN_PHONE_ZOOM, TOWN_PHONE_ZOOM);
        ctx.translate(-480, 0);
        drawScene2PixelWorldBackground(ctx, now);
        ctx.restore();
      } else {
        drawScene2PixelWorldBackground(ctx, now);
      }
      ctx.imageSmoothingEnabled = false;

      // 1. Top Arcade Landing Score & Leaderboard Banner (Clickable to open #tab-ranking)
      const isCarRun = MOTION_STATE.vehicle === 'car';
      const isBoatRun = MOTION_STATE.vehicle === 'boat';
      const runResult = isCarRun ? CAR_GAME : isBoatRun ? BOAT_GAME : UFO_GAME; // score, best and rank of the run just played
      const finalPts = runResult.lastFinalScore || (isCarRun || isBoatRun ? 0 : UFO_GAME.score) || 3450;
      const rideKo = isCarRun ? '차' : isBoatRun ? '배' : '비행기';
      const rideEn = isCarRun ? 'car' : isBoatRun ? 'ship' : 'plane';
      const banW = 560;
      const banH = 32;
      const banX = 480 - banW / 2;
      const banY = 10;
      ctx.save();
      // Bigger on phones (stageUiK), scaled from the banner's top centre; the click area follows (MOTION_STATE.bannerK)
      MOTION_STATE.bannerK = Math.min(stageUiK(), 944 / (banW + 4));
      ctx.translate(480, banY);
      ctx.scale(MOTION_STATE.bannerK, MOTION_STATE.bannerK);
      ctx.translate(-480, -banY);
      ctx.fillStyle = 'rgba(9, 13, 26, 0.90)';
      ctx.fillRect(banX - 2, banY - 2, banW + 4, banH + 4);
      ctx.strokeStyle = UFO_GAME.hasNft ? '#facc15' : '#67e8f9';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(banX, banY, banW, banH);
      ctx.fillStyle = UFO_GAME.hasNft ? '#fde047' : '#bae6fd';
      ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (MOTION_STATE.idleSucked) {
        ctx.fillText(
          CURRENT_LANG === 'ko'
            ? `멍때리다 기둥에 빨려옴 · 기본 펭귄으로 ${INTRO_TOWN.koPixel} 도착  |  [게임 순위 보기]`
            : `Sucked in while idling · Default Penguin in ${INTRO_TOWN.en}  |  [Rankings]`,
          480,
          banY + banH / 2 + 1
        );
      } else if (MOTION_STATE.skippedEscape) {
        ctx.fillText(
          CURRENT_LANG === 'ko'
            ? `기본 펭귄으로 ${INTRO_TOWN.koPixel} 도착  |  [게임 순위 보기]`
            : `Arrived at ${INTRO_TOWN.en} (Default Penguin)  |  [Rankings]`,
          480,
          banY + banH / 2 + 1
        );
      } else if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
        const pilotCode = `P${String(UFO_GAME.pilotTokenId).padStart(4, '0')}`;
        const bestPts = Math.max(finalPts, runResult.lastBestScore || finalPts);
        const rankTag = runResult.lastRank ? ` · 순위 #${runResult.lastRank}` : '';
        ctx.fillText(
          CURRENT_LANG === 'ko'
            ? `#${UFO_GAME.pilotTokenId} (${pilotCode}) · 최고점 ${bestPts.toLocaleString()} PTS${rankTag}  |  [게임 순위 보기]`
            : `#${UFO_GAME.pilotTokenId} (${pilotCode}) · High Score ${bestPts.toLocaleString()} PTS${rankTag}  |  [Rankings]`,
          480,
          banY + banH / 2 + 1
        );
      } else {
        ctx.fillText(
          CURRENT_LANG === 'ko'
            ? `번호 미입력 (기록 미저장) · 이번 점수 ${finalPts.toLocaleString()} PTS  |  [게임 순위 보기]`
            : `No Number (Unrecorded) · Score ${finalPts.toLocaleString()} PTS  |  [Rankings]`,
          480,
          banY + banH / 2 + 1
        );
      }
      ctx.restore();

      // 2. Sculpted 16-Bit "PIXEL PENGUIN" Arcade Logo & RPG Command Box in Upper Sky
      const titleBounce = Math.floor(now / 480) % 2 === 0 ? 0 : -3;
      const lr = townPhone() ? TOWN_PHONE_LOGO.scale : 1; // smaller logo on phones (see TOWN_PHONE_ZOOM)
      const logoTopY = (townPhone() ? TOWN_PHONE_LOGO.top : 50) + titleBounce;

      drawArcadePixelWord(ctx, 'PIXEL', 480, logoTopY, 4.5 * lr);
      drawGoldenArcadeHeart(ctx, 480 + 156 * lr, logoTopY + 16 * lr, 3.2 * lr);
      drawArcadePixelWord(ctx, 'PENGUIN', 480, logoTopY + 46 * lr, 4.5 * lr);
      drawPixelOutlinedSubtitle(ctx, 'PPENG · 10,000 VERYCHAT PFP', 480, logoTopY + 108 * lr);

      const menu = drawTownMenuBox(ctx);
      const menuH = menu.h;
      const menuY = menu.y;

      MOTION_STATE.bubbleMinY = menuY + menuH + 14; // the town's bubbles never cover the menu
      const spriteSize = TOWN_PENGUIN_SIZE;
      const spriteY = Math.round(TOWN_FEET_Y + townDrop() - spriteSize * (243 / 256)); // frame feet at row 243
      const row = scene5RowLayout(MOTION_STATE.skippedEscape);
      const s5P = Math.min(1, Math.max(0, elapsed / 6800));
      let ufoRenderY = 418;

      if (MOTION_STATE.skippedEscape) {
        const defaultEntry = ensureSpeciesSprite('01');
        // (town-easter.js: after 30 s it walks off to the left with the locals)
        const leaveDx = townEasterLeaveDx(elapsed, 0);
        const heroX = Math.round(row.heroX + Math.sin(now * 0.0022) * 4 - leaveDx); // right next to the welcoming friends
        const heroY = spriteY;
        drawPixelGroundShadow(ctx, heroX + spriteSize / 2, heroY + spriteSize - 4, 40, 0);
        drawAnimatedPixelPenguin(ctx, defaultEntry, heroX, heroY, spriteSize, now, {
          seed: 0,
          isWalking: true,
          flipX: leaveDx > 0,
          santaHat: INTRO_TOWN.id === 'xmas',
        });
      } else {
        const crashP = Math.min(1, s5P / 0.14);
        const bounceOffset =
          s5P >= 0.14 && s5P < 0.24 ? -Math.abs(Math.sin(((s5P - 0.14) / 0.10) * Math.PI)) * 18 : 0;
        const openHatchRatio =
          s5P < 0.16 ? 0 : Math.min(1, (s5P - 0.16) / 0.18);

        const ufoLandX = 228;
        const ufoGroundY = 418 + townDrop();
        // Car tyres (+57 x 1.3) and plane skis (+66 x 1.0) end on the same walkway line (y = 450)
        // Every vehicle lands at TOWN_VEHICLE_SCALE with its lowest point (tyres +57, keel +48, skis +66) on y = 450
        const V = TOWN_VEHICLE_SCALE;
        const landY = Math.round(ufoGroundY + 32 - (isCarRun ? 57 : isBoatRun ? 48 : 66) * V);
        const ufoCurY =
          crashP < 1
            ? Math.round(90 + crashP * crashP * (landY - 90))
            : Math.round(landY + bounceOffset);
        ufoRenderY = ufoCurY;
        const ufoCrashTilt = crashP < 1 ? 0.18 : 0.04;

        drawPixelGroundShadow(ctx, ufoLandX, ufoGroundY + 32, Math.round((isCarRun ? 182 : isBoatRun ? 250 : 192) * V), bounceOffset);

        // Ground impact pixel dust & spark burst when the UFO slams into the stone walkway
        if (s5P >= 0.13 && s5P <= 0.28) {
          const dustP = (s5P - 0.13) / 0.15;
          ctx.save();
          for (let d = 0; d < 8; d++) {
            const side = d % 2 === 0 ? -1 : 1;
            const dx = ufoLandX + side * (36 + (d * 14) + dustP * 54);
            const dy = ufoGroundY + 18 - Math.sin(dustP * Math.PI) * (12 + (d % 3) * 8);
            const dSz = Math.max(4, Math.round((1 - dustP) * 10));
            ctx.fillStyle = '#090d1a';
            ctx.fillRect(dx - 1, dy - 1, dSz + 2, dSz + 2);
            ctx.fillStyle = d % 3 === 0 ? '#facc15' : d % 2 === 0 ? '#cbd5e1' : '#67e8f9';
            ctx.fillRect(dx, dy, dSz, dSz);
          }
          ctx.restore();
        }

        if (isBoatRun) {
          // Beached on the walkway, listing to one side; the pilot is still on the foredeck
          drawBoatWithPilot(ctx, ufoLandX + 10, ufoCurY, crashP < 1 ? 0.16 : 0.06, now, {
            scale: V,
            spId: activeSpId,
            pixelMode: true,
            isShocked: crashP < 1,
            smokeOn: true,
          });
        } else if (isCarRun) {
          // No hatch to open: the pilot pops up out of the seat once the car lands
          drawPixelCarWithPilot(ctx, ufoLandX, ufoCurY, ufoCrashTilt, now, {
            scale: V,
            spId: activeSpId,
            isShocked: crashP < 1,
            showSmoke: true,
            wheelAngle: crashP < 1 ? now * 0.05 : 0,
            beam: false,
            pilotLift: openHatchRatio > 0 && openHatchRatio < 1 ? Math.sin(openHatchRatio * Math.PI) * 14 : 0,
          });
        } else {
          // Ski landing gone wrong: prop stops, the pilot pops up in the window
          drawPixelPlaneWithPilot(ctx, ufoLandX + 14, ufoCurY, crashP < 1 ? 0.24 : 0.05, now, {
            scale: V,
            spId: activeSpId,
            isShocked: crashP < 1,
            showSmoke: true,
            propSpin: crashP < 1,
            pilotLift: openHatchRatio > 0 && openHatchRatio < 1 ? Math.sin(openHatchRatio * Math.PI) * 8 : 0,
          });
        }
      }

      // 4 Colorful Pixel Penguin Friends on the Right Walking Up & Welcoming the Protagonist
      // Shoulder to shoulder (a small sway so they never bump); the Christmas tree fills the space behind the
      // purple one (scene5RowLayout)
      // Six natives, six colours none of which repeats the guest's blue: magenta, teal, orange, green, red and
      // purple last, next to the tree
      const colorfulFriends = ['05', '22', '04', '09', '10', '06'].map((sp, i) => ({
        sp,
        baseX: row.friendsX[i],
        y: spriteY + (i % 2 ? -1 : 3),
        seed: 2 + i,
        amp: Math.min(4, row.gap / 3), // sway stays inside the gap, so neighbours never touch
        speed: 0.0023 + (i % 3) * 0.0002,
      }));
      if (INTRO_TOWN.id === 'xmas') drawPixelXmasTree(ctx, row.treeCx, 462 + townDrop(), now);

      const walkInP = Math.min(1, s5P / 0.20);
      const renderedFriends = [];

      colorfulFriends.forEach((fr, idx) => {
        const spEntry = ensureSpeciesSprite(fr.sp);
        const strollX = walkInP >= 1 ? Math.sin(now * fr.speed + idx * 1.4) * fr.amp : 0;
        const fx = Math.round(fr.baseX + (1 - walkInP) * 64 + strollX - (MOTION_STATE.skippedEscape ? townEasterLeaveDx(elapsed, idx + 1) : 0));
        // Once they have walked in, every other local hops 4 px on each beat (the next ones on the next beat)
        const tb = townBeat(now);
        const bop = walkInP >= 1 && tb >= 0 && (Math.floor(tb) + idx) % 2 === 0 && tb % 1 < 0.28 ? 4 : 0;
        const fy = fr.y - bop;

        drawPixelGroundShadow(ctx, fx + spriteSize / 2, fr.y + spriteSize - 4, 38, bop);
        drawAnimatedPixelPenguin(ctx, spEntry, fx, fy, spriteSize, now, {
          seed: fr.seed,
          isWalking: true,
          flipX: true,
          santaHat: INTRO_TOWN.id === 'xmas',
        });

        renderedFriends.push({ fx, fy: fr.y });
      });

      // B-Grade Retro Pixel Speech Bubbles in Scene 5 (Crash-landing + Pixel Penguins Welcoming!)
      const speaker1 = renderedFriends[0] || { fx: row.friendsX[0], fy: spriteY };
      const speaker2 = renderedFriends[1] || { fx: row.friendsX[1], fy: spriteY };
      if (MOTION_STATE.skippedEscape && townEasterLeaving(elapsed)) {
        drawTownEasterLeaveTalk(ctx, now, elapsed, row.heroX - townEasterLeaveDx(elapsed, 0), speaker1.fx, spriteY, spriteSize);
      } else if (MOTION_STATE.skippedEscape) {
        // Skipped town: they chat turn by turn right up to the Easter egg (town-easter.js, at 30 s), the last lines
        // hinting at it; arrived by idling, the "what were you doing" lines come first
        const ko = CURRENT_LANG === 'ko';
        const hero = { fx: row.heroX, fy: spriteY };
        const fr = (i) => renderedFriends[i] || { fx: row.friendsX[i], fy: spriteY };
        const L = (who, col, k, e) => ({ who, col, text: ko ? k : e });
        const chatter = [
          L(fr(1), '#fbbf24', '근데 너 진짜 게임 1초도 안 했어? 제작자 지금 울고 있음 ㅋㅋ', 'Wait, you skipped the whole game? The dev is crying right now lol'),
          L(hero, '#38bdf8', '게임은 다음에... 일단 트리 구경부터 ㅎㅎ', 'Game later... tree first hehe'),
          L(fr(2), '#2dd4bf', '도감에 펭귄 1만 마리 있는 거 앎? 너 닮은 애 무조건 있음', 'There are 10,000 of us in the Codex. One of them looks like you, guaranteed'),
          L(fr(3), '#fb923c', '산타 모자 공짜 아님 ㅋ 프사로 박으면 그때부터 공짜임', "Santa hats aren't free lol. Free once you make one your PFP"),
          L(hero, '#38bdf8', '근데 아까부터 니네 왜 자꾸 왼쪽 쳐다봄?', 'Why do you all keep looking to the left?'),
          L(fr(4), '#4ade80', '...아무것도 아님. 진짜 아무것도 없음. 쳐다보지 마', '...Nothing. Absolutely nothing over there. Do not look'),
          L(fr(5), '#a78bfa', '(속닥속닥) 30초 버티면 제작자가 숨겨둔 게 열린대...', "(whisper) If you hang around 30 s, the dev's secret opens..."),
        ];
        const opening = MOTION_STATE.idleSucked
          ? [
              L(fr(0), '#ff4d6d', '야 안 누르고 뭐했냐?! 남극 무너지는 거 30초 동안 멍때리고 구경했냐 ㅋㅋㅋ', 'Yo, why did you not press anything?! Watched Antarctica fall apart for 30 s? lol'),
              L(hero, '#38bdf8', '아니 그게... 셋 중에 뭐 탈지 고르다가... 정신 차려보니 빨려왔어...', 'Well... I was still picking a ride... and then I got sucked up...'),
              L(fr(1), '#fbbf24', `결정장애 펭귄 레전드 ㅋㅋㅋ 탈 것도 없이 맨몸 입성 축하한다!! ${INTRO_TOWN.ko} 환영~`, `Legendary indecisive penguin lol. Welcome to ${INTRO_TOWN.en}, no ride needed!!`),
            ]
          : [
              L(hero, '#38bdf8', `남극 탈출이고 나발이고 귀찮아서 바로 ${INTRO_TOWN.ko}로 째버렸지롱~`, `Skipped the whole escape game and walked straight to ${INTRO_TOWN.en}~`),
              L(fr(0), '#ff4d6d', `ㅋㅋㅋ 탈 것도 안 타고 날로 먹었네?! 어쨌든 ${INTRO_TOWN.ko} 환영한다!!`, `Haha you skipped the ride?! Welcome to ${INTRO_TOWN.en} anyway!!`),
            ];
        const talk = [...opening, ...chatter.slice(MOTION_STATE.idleSucked ? 1 : 0)];
        const line = talk[Math.min(talk.length - 1, Math.floor(elapsed / TOWN_TALK.turnMs))];
        drawPixelHeart(ctx, line.who.fx + spriteSize / 2, spriteY - 8 - ((now * 0.03) % 18), 2.6, line.col);
        drawRetroSpeechBubble(ctx, line.who.fx + spriteSize / 2, line.who.fy - 6, line.text, line.col, now);
      } else if (elapsed < TOWN_TALK.pilotFrom) {
        // Falling, slamming in and bouncing: no talking yet (anticipation -> action -> reaction)
      } else if (elapsed < TOWN_TALK.friendsFrom) {
        drawPixelHeart(ctx, 304, 336 + townDrop() - ((now * 0.03) % 18), 2.6, '#38bdf8');
        drawRetroSpeechBubble(
          ctx,
          256,
          306,
          CURRENT_LANG === 'ko'
            ? isBoatRun
              ? '쿠과광—!! 어우 내 허리... 배는 땅바닥에 처박혔는데 도착은 성공이다!!'
              : isCarRun
              ? '쿠과광—!! 어우 내 허리... 차는 폐차각인데 도착은 성공이다!!'
              : '쿠과광—!! 어우 내 허리... 비행기는 폐기각인데 불시착은 성공이다!!'
            : isBoatRun
            ? 'CRAAASH—!! Ow my back... the ship ran aground on dry land, but we made it!!'
            : isCarRun
            ? 'CRAAASH—!! Ow my back... the car is totaled, but we made it!!'
            : 'CRAAASH—!! Ow my back... the plane is totaled, but we made it!!',
          '#38bdf8',
          now
        );
      } else {
        const talkPhase = Math.floor(Math.max(0, elapsed - TOWN_TALK.friendsFrom) / TOWN_TALK.turnMs) % 3;
        drawPixelHeart(ctx, speaker1.fx + spriteSize / 2, spriteY - 8 - ((now * 0.03) % 20), 2.6, '#ff4d6d');
        drawPixelHeart(ctx, speaker2.fx + spriteSize / 2, spriteY - 12 - ((now * 0.03) % 20), 2.6, '#fbbf24');
        // The friends' bubbles stay right of the landed vehicle (the ship's bow ends at x ~394) so they never cover
        // the pilot; long lines wrap to two lines inside that band
        const friendBubbleX = (fx) => Math.max(fx + spriteSize / 2, 640);
        const friendArea = { minX: 410, maxX: 942 };
        if (talkPhase === 0) {
          drawRetroSpeechBubble(
            ctx,
            friendBubbleX(speaker1.fx),
            speaker1.fy - 4,
            CURRENT_LANG === 'ko'
              ? `우와 ${isCarRun ? '하늘에서 차가 떨어졌어' : isBoatRun ? '하늘에서 배가 떨어졌어' : '비행기 불시착했어'} ㅋㅋ 살아있냐?! ${INTRO_TOWN.koPixel}에 온 걸 환영해!!`
              : `Whoa ${isCarRun ? 'a car fell from the sky' : isBoatRun ? 'a ship fell from the sky' : 'your plane crash-landed'} haha—you alive?! Welcome to ${INTRO_TOWN.en}!!`,
            '#ff4d6d',
            now,
            friendArea
          );
        } else if (talkPhase === 1) {
          drawRetroSpeechBubble(
            ctx,
            friendBubbleX(speaker2.fx),
            speaker2.fy - 4,
            CURRENT_LANG === 'ko'
              ? '사신다고 뭐 안 드립니다 ㅋㅋ 내 눈에 제일 이쁜 자식 골라서 프사나 박아~'
              : 'Zero perks as promised haha—just pick the cutest penguin for your PFP~',
            '#fbbf24',
            now,
            friendArea
          );
        } else {
          drawRetroSpeechBubble(
            ctx,
            262,
            306,
            CURRENT_LANG === 'ko'
              ? `${rideKo} 수리비도 안 주네... 에라 모르겠다 10,000 도감도나 구경 가자!!`
              : `Not even paying for ${rideEn} repairs... Whatever, let us check the 10K Codex!!`,
            '#38bdf8',
            now
          );
        }
      }

      // Hidden village (town-easter.js) over the town once they have all walked off; it has its own banner, so the
      // corner tag (which would sit on the snowman) is left out there
      if (MOTION_STATE.skippedEscape) drawTownEaster(ctx, now, elapsed);
      const villageUp = MOTION_STATE.skippedEscape && townEasterCovers(elapsed);

      // Bottom-Left Retro Arcade Corner Tag
      if (!villageUp) {
      const tagX = 16;
      const tagY = 504;
      const tagW = 192;
      const tagH = 24;
      ctx.fillStyle = '#090b14';
      ctx.fillRect(tagX - 2, tagY - 2, tagW + 4, tagH + 4);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(tagX - 1, tagY - 1, tagW + 2, tagH + 2);
      ctx.fillStyle = 'rgba(18, 22, 41, 0.92)';
      ctx.fillRect(tagX, tagY, tagW, tagH);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '800 11.5px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PPENG · @happy Ahndoge', tagX + tagW / 2, tagY + tagH / 2 + 1);
      }
    }

    // 16-Bit Pixel Mosaic Wipe Transition at the start of each scene
    drawRetroSceneWipe(ctx, elapsed);

    requestAnimationFrame(renderIntroCutscene);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      MOTION_STATE.stageOnScreen = entries[entries.length - 1].isIntersecting;
    }).observe(canvas);
  }
  requestAnimationFrame(renderIntroCutscene);
}

// ============================================================================
// 3. DUAL-ROW INFINITE PIXEL PARADE MARQUEE
// ============================================================================
function buildPixelParadeMarquee() {
  const row1 = document.getElementById('pixel-parade-row-1');
  const row2 = document.getElementById('pixel-parade-row-2');
  if (!row1 || !row2) return;

  const renderCard = (item) => {
    const id = `P${String(item.edition).padStart(4, '0')}`;
    const src =
      item.edition <= 10 ? `/assets/specials/${item.edition}_fast.gif?v=v322` : `/img/${id}.png?v=v322`;
    const name = CURRENT_LANG === 'ko' ? item.labelKo : item.labelEn;
    return `
      <button type="button" class="parade-card" onclick="handleParadeClick(${item.edition})">
        <img src="${src}" alt="${escapeHtml(name)}" class="pixelated" loading="lazy" />
        <div class="parade-card-info">
          <div class="parade-card-top">
            <span class="parade-card-id">#${item.edition}</span>
            <span class="parade-card-rank">${escapeHtml(item.sub)}</span>
          </div>
          <div class="parade-card-name" data-ko="${escapeHtml(item.labelKo)}" data-en="${escapeHtml(item.labelEn)}">${escapeHtml(name)}</div>
          <div class="parade-card-sub">Verified PFP</div>
        </div>
      </button>
    `;
  };

  row1.innerHTML = [...PARADE_ROW_1_ITEMS, ...PARADE_ROW_1_ITEMS].map(renderCard).join('');
  row2.innerHTML = [...PARADE_ROW_2_ITEMS, ...PARADE_ROW_2_ITEMS].map(renderCard).join('');
}

function handleParadeClick(edition) {
  loadPfpPreview(Number(edition));
  openTokenModal(Number(edition));
}

// Live Countdown to the Mint (Mon 2026-10-26 10:00 UTC = 19:00 KST)
function startMintCountdown() {
  const badge = document.getElementById('mint-countdown');
  if (!badge) return;
  const targetDate = new Date('2026-10-26T10:00:00Z').getTime();

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
const PAGE_TITLE = {
  ko: 'PIXEL PENGUIN (PPENG) — 베리챗 픽셀 펭귄 10,000마리',
  en: 'PIXEL PENGUIN (PPENG) — 10,000 pixel penguins for VeryChat',
};
function applyLanguage(lang) {
  CURRENT_LANG = lang;
  document.documentElement.lang = lang;
  document.title = PAGE_TITLE[lang] || PAGE_TITLE.en;
  try {
    localStorage.setItem(LANG_STORE, lang);
  } catch (e) {}
  document.querySelectorAll('.lang-btn[data-lang]').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  document.querySelectorAll('[data-ko][data-en]').forEach((el) => {
    el.textContent = lang === 'ko' ? el.dataset.ko : el.dataset.en;
  });

  document.querySelectorAll('[data-placeholder-ko][data-placeholder-en]').forEach((el) => {
    el.placeholder = lang === 'ko' ? el.dataset.placeholderKo : el.dataset.placeholderEn;
  });

  updateMobileTraitFilterBtnLabel();
  updateUfoBoardingDockUI();
  updateFullscreenExitOrCodexButton();
  renderRankingPageList();
  if (APP_CONFIG) {
    renderTraitDirectory();
    if (CODEX_LOADED) fetchExplorerTokens();
  }
  setIntroScene(MOTION_STATE.sceneIdx, false);
  if (typeof updateSoundButton === 'function') updateSoundButton();
  if (typeof updateOpeningButton === 'function') updateOpeningButton();
}

// PFP Simulator
async function loadPfpPreview(tokenNum, syncUfoDock = false) {
  try {
    const res = await fetch(`/api/token/${tokenNum}`);
    if (!res.ok) return;
    const tok = await res.json();
    CURRENT_PFP_TOKEN = tok.edition;
    if (syncUfoDock) {
      setUfoPilotTokenId(tok.edition, false, false);
    }

    const imgUrl = tok.edition <= 10 ? tok.image_url : tok.pixel_48_url;
    document.getElementById('pfp-preview-img').src = imgUrl;
    document.getElementById('pfp-mini-img').src = imgUrl;
    const titleEl = document.getElementById('pfp-sim-title');
    if (titleEl) {
      const nameKo = tok.name_ko || tok.name;
      const nameEn = tok.name_en || tok.name;
      titleEl.dataset.ko = nameKo;
      titleEl.dataset.en = nameEn;
      titleEl.textContent = CURRENT_LANG === 'ko' ? nameKo : nameEn;
    }
    document.getElementById('pfp-sim-id').textContent = tok.id;

    const tierEl = document.getElementById('pfp-sim-tier');
    if (tierEl) {
      tierEl.textContent = tok.tier;
      tierEl.className = `tier-pill tier-${tok.tier}`;
    }

    const rankEl = document.getElementById('pfp-sim-rank');
    if (rankEl) {
      rankEl.textContent = `#${Number(tok.rarity_rank).toLocaleString()}`;
    }

    document.querySelectorAll('.pfp-thumb-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.num) === tok.edition);
    });
  } catch (err) {
    console.error('Failed to load PFP preview:', err);
  }
}

// 14 different penguins picked at random from #0-#9,999 (crypto when available), the current preview kept marked
function renderPfpPresetStrip() {
  const strip = document.getElementById('pfp-preset-strip');
  if (!strip) return;
  const picks = new Set();
  const rnd = () => {
    if (window.crypto && window.crypto.getRandomValues) return window.crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
    return Math.floor(Math.random() * 10000);
  };
  while (picks.size < 14) picks.add(rnd());
  strip.innerHTML = [...picks]
    .map((num) => {
      const id = `P${String(num).padStart(4, '0')}`;
      const src = num <= 10 ? `/assets/specials/${num}_fast.gif?v=v322` : `/img/${id}.png?v=v322`;
      return `<button type="button" class="pfp-thumb-btn ${num === CURRENT_PFP_TOKEN ? 'active' : ''}" data-num="${num}" title="#${num}">
          <img src="${src}" alt="#${num}" class="pixelated" loading="lazy" />
        </button>`;
    })
    .join('');
  strip.querySelectorAll('.pfp-thumb-btn').forEach((btn) => {
    btn.addEventListener('click', () => loadPfpPreview(Number(btn.dataset.num)));
  });
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

  // Preset strip (7x2 = 14): a fresh random draw from all 10,000 on every visit, and again on 다른 펭귄 / Shuffle
  renderPfpPresetStrip();
  document.getElementById('pfp-shuffle-btn')?.addEventListener('click', renderPfpPresetStrip);
  const jumpInput = document.getElementById('pfp-jump-input');
  const jumpBtn = document.getElementById('pfp-jump-btn');
  const detailBtn = document.getElementById('pfp-detail-btn');

  if (jumpBtn && jumpInput) {
    const triggerJump = () => {
      const raw = jumpInput.value.trim().replace(/^#/, '').replace(/^P/i, '');
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n) && n >= 0 && n <= 9999) {
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

// Render 11 Special Originals Section (Only if section element exists)
function renderSpecialsGrid(specials) {
  const grid = document.getElementById('specials-grid');
  if (!grid || !specials) return;

  grid.innerHTML = specials
    .map((sp) => {
      const subKo = sp.character_ko || sp.archetype;
      const m = String(sp.archetype || '').match(/\(([^)]+)\)\s*$/);
      const subEn = m ? m[1].trim() : subKo;
      const subText = CURRENT_LANG === 'ko' ? subKo : subEn;
      return `
    <button type="button" class="nft-card genesis-card" onclick="openTokenModal(${sp.edition})">
      <div class="nft-thumb-wrap">
        <img src="${sp.fast_gif_url}" alt="${escapeHtml(`Pixel Penguin #${sp.edition} — ${subText}`)}" class="pixelated" loading="lazy" />
        <div class="card-top-badges">
          <span class="tier-pill tier-${sp.tier}">${sp.tier}</span>
          <span class="rank-pill">Rank #${sp.rarity_rank}</span>
        </div>
      </div>
      <div class="nft-card-meta">
        <span>${sp.id}</span>
        <span>#${sp.edition}</span>
      </div>
      <div class="nft-card-title" data-ko="${escapeHtml(subKo)}" data-en="${escapeHtml(subEn)}">${escapeHtml(subText)}</div>
      <div class="nft-card-footer">
        <span class="score-tag">1-of-1 GIF</span>
        <span class="score-tag" style="color:var(--accent-cyan); font-weight:800;">${Number(sp.rarity_score).toLocaleString()} pts</span>
      </div>
    </button>
  `;
    })
    .join('');
}

function updateMobileTraitFilterBtnLabel() {
  const toggleBtn = document.getElementById('btn-toggle-trait-filters');
  if (!toggleBtn) return;
  let activeCount = 0;
  document.querySelectorAll('.exp-cat-select').forEach((s) => {
    if (s.value) activeCount++;
  });
  const span = toggleBtn.querySelector('span');
  if (span) {
    const base = CURRENT_LANG === 'ko' ? '파츠 필터' : 'Filters';
    span.textContent = activeCount > 0 ? `${base} · ${activeCount}` : base;
    toggleBtn.classList.toggle('active-toggle', activeCount > 0);
  }
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
    const labelKo = CAT_LABELS_KO[cat] || cat;
    const labelText = CURRENT_LANG === 'ko' ? labelKo : cat;
    const allText = CURRENT_LANG === 'ko' ? '전체' : 'All';
    return `
      <div class="trait-select-box">
        <label for="filter-cat-${cat}" data-ko="${escapeHtml(labelKo)}" data-en="${escapeHtml(cat)}">${escapeHtml(labelText)}</label>
        <select id="filter-cat-${cat}" data-cat="${cat}" class="filter-select exp-cat-select">
          <option value="" data-ko="전체" data-en="All">${allText}</option>
          ${optionsHtml}
        </select>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.exp-cat-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      CURRENT_PAGE = 1;
      updateMobileTraitFilterBtnLabel();
      fetchExplorerTokens();
    });
  });
}

// Fetch & Render 10K Explorer Grid (VeryPunks rarity.tools Reference)
async function fetchExplorerTokens() {
  const grid = document.getElementById('explorer-grid');
  const countEl = document.getElementById('exp-result-count');
  if (!grid) return;
  CODEX_LOADED = true;

  const params = new URLSearchParams();
  const q = document.getElementById('exp-search')?.value.trim() || '';
  const tier = document.getElementById('exp-tier')?.value || '';
  const edition = document.getElementById('exp-edition')?.value || '';
  const sort = document.getElementById('exp-sort')?.value || 'id_asc';

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
          ? `<strong>${data.total.toLocaleString()}</strong>마리 · ${data.page}/${TOTAL_PAGES} 페이지`
          : `<strong>${data.total.toLocaleString()}</strong> penguins · Page ${data.page}/${TOTAL_PAGES}`;
    }

    document.getElementById('page-indicator').textContent = `${data.page} / ${TOTAL_PAGES}`;
    document.getElementById('page-first-btn').disabled = data.page <= 1;
    document.getElementById('page-prev-btn').disabled = data.page <= 1;
    document.getElementById('page-next-btn').disabled = data.page >= TOTAL_PAGES;
    document.getElementById('page-last-btn').disabled = data.page >= TOTAL_PAGES;

    if (!data.items || data.items.length === 0) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">${
        CURRENT_LANG === 'ko' ? '맞는 펭귄이 없습니다. 필터를 초기화해 보세요.' : 'No penguins match. Try resetting the filters.'
      }</div>`;
      return;
    }

    grid.innerHTML = data.items
      .map((item) => {
        const isSpecial = item.edition <= 10;
        const genTrait = `${item.traits.Hat !== 'None' ? item.traits.Hat : item.traits.Clothes !== 'None' ? item.traits.Clothes : item.traits.Species}`;
        const subKo = isSpecial ? item.character_ko || item.archetype : genTrait;
        const subEn = isSpecial ? item.character_en || item.archetype : genTrait;
        const subtitle = CURRENT_LANG === 'ko' ? subKo : subEn;
        const cardTierClass =
          item.tier === 'Genesis' ? 'genesis-card' : item.tier === 'Mythic' ? 'mythic-card' : '';
        return `
        <button type="button" class="nft-card ${cardTierClass}" onclick="openTokenModal(${item.edition})">
          <div class="nft-thumb-wrap">
            <img src="${item.image_url}" alt="${escapeHtml(CURRENT_LANG === 'ko' ? item.name : item.name_en || item.name)}" class="pixelated" loading="lazy" />
            <div class="card-top-badges">
              <span class="tier-pill tier-${item.tier}">${item.tier}</span>
              <span class="rank-pill">Rank #${item.rarity_rank}</span>
            </div>
          </div>
          <div class="nft-card-title" data-ko="${escapeHtml(subKo)}" data-en="${escapeHtml(subEn)}">${escapeHtml(subtitle)}</div>
          <div class="nft-card-footer">
            <span class="score-tag" style="color:var(--text);">${item.id}</span>
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
  const tierEl = document.getElementById('exp-tier');
  if (tierEl) tierEl.value = '';
  const edEl = document.getElementById('exp-edition');
  if (edEl) edEl.value = '';
  const searchEl = document.getElementById('exp-search');
  if (searchEl) searchEl.value = '';
  CURRENT_PAGE = 1;
  updateMobileTraitFilterBtnLabel();
  fetchExplorerTokens();
  scrollToSection('sec-explorer');
}

// Build 210 Trait Directory Section (With rarity.tools +pts score)
function renderTraitDirectory() {
  const tabsWrap = document.getElementById('trait-cat-tabs');
  const gridWrap = document.getElementById('trait-catalog-grid');
  if (!tabsWrap || !gridWrap || !APP_CONFIG) return;

  tabsWrap.innerHTML = NINE_CATS.map(
    (cat) => `
    <button type="button" class="trait-tab-btn ${cat === ACTIVE_TRAIT_TAB ? 'active' : ''}" data-tcat="${cat}">
      ${escapeHtml(catLabel(cat))} <span class="trait-tab-count">${(APP_CONFIG.trait_summary[cat] || []).length}</span>
    </button>
  `
  ).join('');

  tabsWrap.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      ACTIVE_TRAIT_TAB = btn.dataset.tcat;
      renderTraitDirectory();
    });
  });

  centerActiveTraitTab();

  const rows = APP_CONFIG.trait_summary[ACTIVE_TRAIT_TAB] || [];
  gridWrap.innerHTML = rows
    .map(
      (r) => `
    <button type="button" class="trait-b-item is-link" onclick="filterExplorerByTrait('${escapeHtml(ACTIVE_TRAIT_TAB)}', '${escapeHtml(r.value).replace(/'/g, "\\'")}')">
      <div class="trait-b-val">${escapeHtml(r.value)}</div>
      <div class="trait-b-score">
        <span>${formatTraitCount(r.count, r.pct)}</span>
        <strong>+${Number(r.score).toLocaleString()}</strong>
      </div>
    </button>
  `
    )
    .join('');
}

// On mobile the tab bar side-scrolls; keep the selected category in view (no-op while the codex tab is hidden)
function centerActiveTraitTab() {
  const tabsWrap = document.getElementById('trait-cat-tabs');
  const activeTab = tabsWrap?.querySelector('.trait-tab-btn.active');
  if (!activeTab || tabsWrap.scrollWidth <= tabsWrap.clientWidth) return;
  const barBox = tabsWrap.getBoundingClientRect();
  const tabBox = activeTab.getBoundingClientRect();
  tabsWrap.scrollLeft += tabBox.left - barBox.left - (barBox.width - tabBox.width) / 2;
}

function catLabel(cat) {
  return CURRENT_LANG === 'ko' ? CAT_LABELS_KO[cat] || cat : cat;
}

function formatTraitCount(count, pct) {
  return CURRENT_LANG === 'ko'
    ? `${Number(count).toLocaleString()}마리 · ${pct}%`
    : `${Number(count).toLocaleString()} · ${pct}%`;
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

// Token Detail Inspector Modal (VeryPunks rarity.tools Reference)
async function openTokenModal(tokenNum) {
  const modal = document.getElementById('token-modal');
  const body = document.getElementById('modal-detail-body');
  if (!modal || !body) return;

  modal.classList.add('open');
  body.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">#${Number(tokenNum)} ${
    CURRENT_LANG === 'ko' ? '불러오는 중…' : 'loading…'
  }</div>`;

  try {
    const res = await fetch(`/api/token/${tokenNum}`);
    const tok = await res.json();
    const isSpecial = tok.edition <= 10;

    const traitsHtml = tok.trait_breakdown
      .map(
        (b) => `
      <button type="button" class="trait-b-item is-link" onclick="closeTokenModal(); filterExplorerByTrait('${escapeHtml(b.trait_type)}', '${escapeHtml(b.value).replace(/'/g, "\\'")}')">
        <div class="trait-b-cat">${escapeHtml(catLabel(b.trait_type))}</div>
        <div class="trait-b-val">${escapeHtml(b.value)}</div>
        <div class="trait-b-score">
          <span>${formatTraitCount(b.count, b.pct)}</span>
          <strong>+${Number(b.score).toLocaleString()}</strong>
        </div>
      </button>
    `
      )
      .join('');

    const dlIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
    const downloadBtnHtml = isSpecial
      ? `<a href="${tok.full_image_url}" download="${tok.id}.gif" class="btn-primary" style="text-decoration:none; width:100%;">
          ${dlIcon}<span>${CURRENT_LANG === 'ko' ? '원본 GIF 저장' : 'Save original GIF'}</span>
         </a>`
      : `<button type="button" class="btn-primary" style="width:100%;" onclick="downloadHighRes3072('${tok.id}', '${tok.pixel_48_url}')">
          ${dlIcon}<span>${CURRENT_LANG === 'ko' ? '고해상도 PNG 저장 (3072px)' : 'Save PNG (3072px)'}</span>
         </button>`;

    const titleKo = tok.name_ko || tok.name;
    const titleEn = tok.name_en || tok.name;
    const titleText = CURRENT_LANG === 'ko' ? titleKo : titleEn;

    body.innerHTML = `
      <div>
        <div class="modal-art-stage">
          <img src="${tok.full_image_url}" alt="${escapeHtml(titleText)}" class="pixelated" />
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:12px;">
          ${downloadBtnHtml}
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button type="button" class="btn-secondary" style="padding:9px;" onclick="loadPfpPreview(${tok.edition}); closeTokenModal(); scrollToSection('top');">
              ${CURRENT_LANG === 'ko' ? '프사로 써보기' : 'Try as PFP'}
            </button>
            <a href="/api/metadata/${tok.id}.json" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none; padding:9px;">
              ${CURRENT_LANG === 'ko' ? '메타데이터' : 'Metadata'}
            </a>
          </div>
        </div>
      </div>

      <div>
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
          <span class="tier-pill tier-${tok.tier}">${tok.tier}</span>
          <span class="pill-tag">Rank #${tok.rarity_rank} / 10,000</span>
          <span class="pill-tag gold">${Number(tok.rarity_score).toLocaleString()} pts</span>
        </div>

        <h2 id="modal-token-title" style="margin-bottom:12px;" data-ko="${escapeHtml(titleKo)}" data-en="${escapeHtml(titleEn)}">${escapeHtml(titleText)}</h2>

        <div class="spec-rows-stack" style="margin-bottom:12px;">
          <div class="spec-row">
            <span class="spec-label">${CURRENT_LANG === 'ko' ? '번호' : 'Token ID'}</span>
            <span class="spec-value">${tok.id} · #${tok.edition}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">${CURRENT_LANG === 'ko' ? '희귀도 순위' : 'Rarity rank'}</span>
            <span class="spec-value">#${Number(tok.rarity_rank).toLocaleString()} · ${Number(tok.rarity_score).toLocaleString()} pts</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">${CURRENT_LANG === 'ko' ? '착용 파츠 수' : 'Traits worn'}</span>
            <span class="spec-value">${tok.active_trait_stat.active_count} · +${Number(tok.active_trait_stat.score).toLocaleString()} pts</span>
          </div>
          ${
            isSpecial && tok.genesis_bonus > 0
              ? `<div class="spec-row">
            <span class="spec-label">${CURRENT_LANG === 'ko' ? 'Genesis 가산점' : 'Genesis bonus'}</span>
            <span class="spec-value" style="color:var(--tier-genesis);">+${Number(tok.genesis_bonus).toLocaleString()} pts</span>
          </div>`
              : ''
          }
        </div>

        <h4 class="modal-sub-title">${CURRENT_LANG === 'ko' ? '파츠별 점수' : 'Trait scores'} <span>rarity.tools · 10,000 ÷ ${CURRENT_LANG === 'ko' ? '보유 수' : 'count'}</span></h4>
        <div class="trait-breakdown-list">
          ${traitsHtml}
        </div>
      </div>
    `;
  } catch (err) {
    body.innerHTML = `<div class="empty-state error" style="grid-column:1/-1;">${
      CURRENT_LANG === 'ko' ? '정보를 불러오지 못했습니다.' : 'Could not load this token.'
    }</div>`;
  }
}

function closeTokenModal() {
  document.getElementById('token-modal')?.classList.remove('open');
}

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  startMintCountdown();
  initAmbientPixelCanvas();
  initPfpStudio();
  initPixelMotionStudio();
  buildPixelParadeMarquee();

  // Language buttons
  document.querySelectorAll('.lang-btn[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });
  // The page is written in Korean: switch it to the visitor's language (English unless they picked KR before)
  applyLanguage(CURRENT_LANG);

  // Navigation Tabs
  document.querySelectorAll('.market-tab').forEach((tab) => {
    tab.addEventListener('click', () => scrollToSection(tab.dataset.target));
  });
  initStickyHeaderHeight();

  // Ranking Page Search, Refresh & 10-Page Pagination (10 per page × 10 pages = Top 100)
  document.getElementById('btn-refresh-ranking-page')?.addEventListener('click', () => {
    fetchAndRenderRankingPage();
  });
  document.querySelectorAll('.rank-game-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.game === RANKING_GAME) return;
      setRankingGame(btn.dataset.game);
      fetchAndRenderRankingPage();
    });
  });
  setRankingGame(SHARED_RANK ? SHARED_RANK.board : RANKING_GAME);
  document.getElementById('btn-open-rank-share')?.addEventListener('click', openRankShare);
  document.getElementById('close-rank-share')?.addEventListener('click', closeRankShare);
  document.getElementById('rank-share-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'rank-share-modal') closeRankShare();
  });
  document.getElementById('rank-share-no')?.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits !== e.target.value) e.target.value = digits;
    try {
      localStorage.setItem(SHARE_NO_STORE, digits);
    } catch (err) {}
    setRankShareStatus('');
    renderRankShare();
  });
  document.getElementById('rank-share-copy-link')?.addEventListener('click', () => copyRankShare(false));
  document.getElementById('rank-share-copy-text')?.addEventListener('click', () => copyRankShare(true));
  document.getElementById('rank-share-native')?.addEventListener('click', nativeRankShare);
  document.getElementById('rank-share-verychat')?.addEventListener('click', veryChatRankShare);
  document.getElementById('rank-share-preview')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-share-reroll]')) rerollRankShare();
  });
  document.getElementById('ranking-search-input')?.addEventListener('input', () => {
    CURRENT_RANKING_PAGE = 1;
    renderRankingPageList();
  });
  document.getElementById('rank-page-first-btn')?.addEventListener('click', () => {
    goToRankingPage(1);
  });
  document.getElementById('rank-page-prev-btn')?.addEventListener('click', () => {
    if (CURRENT_RANKING_PAGE > 1) goToRankingPage(CURRENT_RANKING_PAGE - 1);
  });
  document.getElementById('rank-page-next-btn')?.addEventListener('click', () => {
    if (CURRENT_RANKING_PAGE < RANKING_TOTAL_PAGES) goToRankingPage(CURRENT_RANKING_PAGE + 1);
  });
  document.getElementById('rank-page-last-btn')?.addEventListener('click', () => {
    goToRankingPage(RANKING_TOTAL_PAGES);
  });

  // Mobile 9-Category Filter Drawer Toggle
  document.getElementById('btn-toggle-trait-filters')?.addEventListener('click', () => {
    const gridEl = document.getElementById('exp-trait-filters');
    if (gridEl) {
      gridEl.classList.toggle('mobile-open');
    }
  });

  // Update official website display
  const canonicalUrl = 'https://www.ppeng.org';
  const urlDisplay = document.getElementById('official-url-display');
  const globeLink = document.getElementById('official-globe-link');
  if (urlDisplay) urlDisplay.textContent = canonicalUrl;
  if (globeLink) globeLink.href = canonicalUrl;

  // Modal Close Events
  document.getElementById('close-token-modal')?.addEventListener('click', closeTokenModal);
  document.getElementById('token-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'token-modal') closeTokenModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTokenModal();
      closeLeaderboardModal();
      closeRankShare();
      if (MOTION_STATE.isFullscreen) exitUfoFullscreenGame();
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
    const searchEl = document.getElementById('exp-search');
    if (searchEl) searchEl.value = '';
    const tierEl = document.getElementById('exp-tier');
    if (tierEl) tierEl.value = '';
    const edEl = document.getElementById('exp-edition');
    if (edEl) edEl.value = '';
    const sortEl = document.getElementById('exp-sort');
    if (sortEl) sortEl.value = 'id_asc';
    document.querySelectorAll('.exp-cat-select').forEach((s) => {
      s.value = '';
    });
    updateMobileTraitFilterBtnLabel();
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
    loadPfpPreview(4441);
    // The codex grid and the board load when their page is first opened (scrollToSection)
    if (SHARED_RANK) openSharedRank();
  } catch (err) {
    console.error('Failed to initialize config:', err);
  }
});
