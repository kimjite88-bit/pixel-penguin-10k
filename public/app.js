/**
 * PIXEL PENGUIN (Pixel Penguin 10K · Symbol: PPENG) — Frontend Application & 48x48 Pixel Motion Engine
 * Issued by @happy Ahndoge on VERY Mainnet (4613)
 */

let APP_CONFIG = null;
let CURRENT_LANG = 'ko';
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

function scrollToSection(id) {
  let tabKey = 'tab-intro';
  if (id === 'tab-codex' || id === 'sec-explorer' || id === 'sec-traits' || id === 'sec-provenance') {
    tabKey = 'tab-codex';
  } else if (id === 'tab-ranking' || id === 'sec-ranking') {
    tabKey = 'tab-ranking';
  } else if (id === 'tab-notices' || id === 'sec-notices') {
    tabKey = 'tab-notices';
  }

  if (tabKey !== 'tab-intro' && typeof exitUfoFullscreenGame === 'function') {
    exitUfoFullscreenGame();
  }

  const pageMap = {
    'tab-intro': 'tab-page-intro',
    'tab-codex': 'tab-page-codex',
    'tab-ranking': 'tab-page-ranking',
    'tab-notices': 'tab-page-notices',
  };

  Object.entries(pageMap).forEach(([k, pageId]) => {
    const pageEl = document.getElementById(pageId);
    if (pageEl) {
      pageEl.style.display = k === tabKey ? 'block' : 'none';
      pageEl.classList.toggle('active', k === tabKey);
    }
  });

  document.querySelectorAll('.market-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === tabKey);
  });

  if (tabKey === 'tab-ranking' && typeof fetchAndRenderRankingPage === 'function') {
    fetchAndRenderRankingPage();
  }

  if (
    id === 'tab-intro' ||
    id === 'tab-codex' ||
    id === 'tab-ranking' ||
    id === 'tab-notices' ||
    id === 'top'
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
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

  const count = 42;
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
// 2. RETRO 16-BIT PIXEL GAME INTRO CUTSCENE & GIANT UFO ESCAPE ENGINE (v5.2.0)
//    Scene 0 ("1. 🚨 남극탈출 & 탑승"): Antarctica is crumbling! Giant UFO on snow cliff -> Hatch closes -> Liftoff!
//    Scene 1 ("2. 🛸 하늘교전 & 픽셀화"): Mobile-first Sky Battle in Giant UFO -> Shot Down -> Whole Giant UFO + Pilot Pixelates!
//    Scene 2 ("3. 💥 불시착 & 환영"): Giant Pixel UFO crash-lands in Pixel World -> Only Top Hatch opens (zero lower body!) & Penguin Friends welcome!
// ============================================================================
const SCENE_DURATIONS = [4300, 9200, 6800]; // 0: 남극탈출 & 탑승, 1: 하늘교전 & 우주선 통째 픽셀화, 2: 불시착 & 대가리 해치 오픈 환영

const MOTION_STATE = {
  sceneIdx: 0,
  autoPlay: true,
  isFullscreen: false,
  sceneStartTime: performance.now(),
  hero2DImg: null,
  hero2DLoaded: false,
  hero2DSheet: null,
  hero2DSheetLoaded: false,
  recolored2DSheets: new Map(), // spId -> offscreen canvas of hero_2d_sheet recolored to match Species feather skin
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
// OPEN-SOURCE HYBRID GIANT UFO ARCADE ENGINE
// Protagonist: Selected NFT Penguin (Category #1 Feather Skin) OR Default Blue Penguin ('없음')
// ============================================================================
const UFO_GAME = {
  phase: 'combat', // 'combat' | 'scan' (in Scene 1)
  phaseStartTime: 0,
  lastTickAt: 0,
  userControlled: false,
  hasNft: false, // false = '없음 (기록 안 남음)', true = NFT #0~#9999 boarded & records score!
  pilotTokenId: null,
  pilotSpeciesId: '01',
  pilotSpeciesLabel: '기본 파란 펭귄 (Adelie Classic)',
  x: 225,
  y: 215,
  vx: 0,
  vy: 0,
  targetX: 225,
  targetY: 215,
  tiltRad: 0,
  shields: 3,
  maxShields: 3,
  score: 0,
  lastFinalScore: 0,
  lastRank: null,
  kills: 0,
  combo: 1,
  lastFireAt: 0,
  lastSpawnAt: 0,
  hitFlashUntil: 0,
  shakeUntil: 0,
  shotDownX: 480,
  shotDownY: 250,
  scoreSubmitted: false,
  keys: {},
  lasers: [],
  entities: [], // { type: 'banana'|'meteor'|'mine'|'fish'|'core', x, y, vx, vy, r, hp, rot, vrot }
  particles: [], // { x, y, vx, vy, col, sz, alpha, decay }
  popups: [], // { x, y, vy, text, col, alpha }
  stars: Array.from({ length: 32 }, (_, i) => ({
    x: (i * 73) % 960,
    y: 18 + ((i * 41) % 340),
    spd: 1.5 + (i % 4) * 0.85,
    sz: i % 3 === 0 ? 3 : 2,
  })),
};

function resetUfoGame(now = performance.now(), keepUserControl = false) {
  UFO_GAME.phase = 'combat';
  UFO_GAME.phaseStartTime = now;
  UFO_GAME.lastTickAt = now;
  UFO_GAME.userControlled = keepUserControl;
  UFO_GAME.x = 225;
  UFO_GAME.y = 215;
  UFO_GAME.vx = 0;
  UFO_GAME.vy = 0;
  UFO_GAME.targetX = 225;
  UFO_GAME.targetY = 215;
  UFO_GAME.tiltRad = 0;
  UFO_GAME.shields = 3;
  UFO_GAME.score = 0;
  UFO_GAME.kills = 0;
  UFO_GAME.combo = 1;
  UFO_GAME.lastFireAt = now;
  UFO_GAME.lastSpawnAt = now - 300;
  UFO_GAME.hitFlashUntil = 0;
  UFO_GAME.shakeUntil = 0;
  UFO_GAME.scoreSubmitted = false;
  UFO_GAME.lasers = [];
  UFO_GAME.entities = [];
  UFO_GAME.particles = [];
  UFO_GAME.popups = [];
}

function triggerUfoShotDown(now = performance.now()) {
  if (UFO_GAME.phase !== 'combat') return;
  UFO_GAME.phase = 'scan';
  UFO_GAME.phaseStartTime = now;
  UFO_GAME.shields = 0;
  UFO_GAME.shotDownX = Math.max(240, Math.min(680, UFO_GAME.x));
  UFO_GAME.shotDownY = Math.max(170, Math.min(290, UFO_GAME.y));
  UFO_GAME.shakeUntil = now + 520;
  UFO_GAME.lastFinalScore = Math.max(450, UFO_GAME.score);
  // Spawn dramatic shot-down explosion & EMP sparks around the Giant UFO
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
    const sp = 2.4 + Math.random() * 5.6;
    UFO_GAME.particles.push({
      x: UFO_GAME.x,
      y: UFO_GAME.y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      col: i % 3 === 0 ? '#facc15' : i % 2 === 0 ? '#fb7185' : '#67e8f9',
      sz: 5 + (i % 3) * 2,
      alpha: 1,
      decay: 0.022,
    });
  }
  if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
    submitUfoScoreToServer(UFO_GAME.pilotTokenId, UFO_GAME.lastFinalScore, UFO_GAME.kills);
  } else {
    UFO_GAME.lastRank = null;
  }
}

async function submitUfoScoreToServer(tokenId, score, kills) {
  if (!UFO_GAME.hasNft || tokenId === null || UFO_GAME.scoreSubmitted || score <= 0) return;
  UFO_GAME.scoreSubmitted = true;
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId, score, kills }),
    });
    if (res.ok) {
      const data = await res.json();
      UFO_GAME.lastRank = data.rank || null;
      if (Array.isArray(data.items)) {
        RANKING_PAGE_CACHE = data.items;
        renderRankingPageList();
      }
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

function updateUfoBoardingDockUI() {
  const nftBtn = document.getElementById('btn-ufo-board-nft');
  const noneBtn = document.getElementById('btn-ufo-board-none');
  const badgeEl = document.getElementById('ufo-pilot-skin-badge');
  const inputEl = document.getElementById('ufo-pilot-id-input');

  if (nftBtn) nftBtn.classList.toggle('active-mode', UFO_GAME.hasNft);
  if (noneBtn) noneBtn.classList.toggle('active-mode', !UFO_GAME.hasNft);

  if (badgeEl) {
    if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
      const code = `P${String(UFO_GAME.pilotTokenId).padStart(4, '0')}`;
      badgeEl.textContent =
        CURRENT_LANG === 'ko'
          ? `🎨 #${UFO_GAME.pilotTokenId}(${code}) ${UFO_GAME.pilotSpeciesLabel} · 랭킹 ON`
          : `🎨 #${UFO_GAME.pilotTokenId}(${code}) ${UFO_GAME.pilotSpeciesLabel} · Ranked`;
    } else {
      badgeEl.textContent =
        CURRENT_LANG === 'ko'
          ? '🎨 기본 파란 펭귄 (없음 · 기록 안 남음)'
          : '🎨 Default Blue Penguin (Unrecorded)';
    }
  }
  if (inputEl) {
    if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
      inputEl.value = String(UFO_GAME.pilotTokenId);
    } else {
      inputEl.value = '';
    }
  }
  const fsLabelEl = document.getElementById('fs-pilot-status-label');
  if (fsLabelEl) {
    if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
      fsLabelEl.textContent =
        CURRENT_LANG === 'ko'
          ? `탑승: Pixel Penguin #${UFO_GAME.pilotTokenId} (기록 ON)`
          : `Pilot: Pixel Penguin #${UFO_GAME.pilotTokenId}`;
    } else {
      fsLabelEl.textContent =
        CURRENT_LANG === 'ko' ? '탑승: 기본 파란 펭귄 (미기록)' : 'Pilot: Default Blue (No Record)';
    }
  }
}

function updateFullscreenExitOrCodexButton() {
  const lbl = document.getElementById('btn-exit-or-codex-label');
  if (lbl) {
    if (MOTION_STATE.isFullscreen) {
      lbl.textContent =
        CURRENT_LANG === 'ko' ? '✕ 전체화면 종료 (나가기)' : '✕ Exit Fullscreen';
    } else {
      lbl.textContent =
        CURRENT_LANG === 'ko' ? '10,000마리 도감도 구경하기' : 'Explore 10K Codex';
    }
  }
  const burstBtnSpan = document.querySelector('#btn-pixel-burst span');
  if (burstBtnSpan) {
    if (MOTION_STATE.isFullscreen) {
      burstBtnSpan.textContent =
        CURRENT_LANG === 'ko' ? '🔄 게임 다시 시작 (교전 리셋)' : '🔄 Restart UFO Battle';
    } else {
      burstBtnSpan.textContent =
        CURRENT_LANG === 'ko' ? '🎮 게임 참여 (전체화면 시작)' : '🎮 Join Game (Fullscreen)';
    }
  }
}

function enterUfoFullscreenGame(startCombatImmediately = true) {
  const theaterEl = document.getElementById('retro-intro-theater');
  if (!theaterEl) return;
  MOTION_STATE.isFullscreen = true;
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
    setIntroScene(1, true);
    UFO_GAME.userControlled = true;
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

function boardUfoWithoutNft(restartScene = true) {
  UFO_GAME.hasNft = false;
  UFO_GAME.pilotTokenId = null;
  UFO_GAME.pilotSpeciesId = '01';
  UFO_GAME.pilotSpeciesLabel = '기본 파란 펭귄 (Adelie Classic)';
  UFO_GAME.lastRank = null;
  ensureSpeciesSprite('01');
  updateUfoBoardingDockUI();
  if (restartScene) {
    setIntroScene(0, true);
  }
}

async function setUfoPilotTokenId(tokenNum, triggerPfp = true, restartScene = false) {
  const raw = String(tokenNum ?? '').trim().replace(/^#/, '').replace(/^P/i, '');
  if (raw === '' || Number.isNaN(Number(raw))) {
    boardUfoWithoutNft(restartScene);
    return;
  }
  const num = Math.max(0, Math.min(9999, Math.floor(Number(raw))));
  UFO_GAME.hasNft = true;
  UFO_GAME.pilotTokenId = num;

  // Fetch token metadata to extract Category #1 (Species / 깃털스킨)
  try {
    const res = await fetch(`/api/token/${num}`);
    if (res.ok) {
      const tok = await res.json();
      const spName = tok?.traits?.Species || 'Adelie Classic';
      const mappedId = SPECIES_NAME_TO_ID[spName] || '01';
      UFO_GAME.pilotSpeciesId = mappedId;
      UFO_GAME.pilotSpeciesLabel = spName;
      ensureSpeciesSprite(mappedId);
      getHero2DSheetForSpecies(mappedId);
    }
  } catch (e) {
    // Fallback to '01' if offline
  }

  updateUfoBoardingDockUI();

  const pfpInput = document.getElementById('pfp-jump-input');
  if (pfpInput) {
    pfpInput.value = String(num);
  }
  if (triggerPfp && typeof loadPfpPreview === 'function') {
    loadPfpPreview(num, false);
  }
  if (restartScene) {
    setIntroScene(0, true);
  }
}

let RANKING_PAGE_CACHE = [];

function getNftDisplayName(item) {
  if (!item) return 'Pixel Penguin #0';
  if (CURRENT_LANG === 'ko') {
    return item.name_ko || item.name || `Pixel Penguin #${item.edition}`;
  }
  return item.name_en || item.name || `Pixel Penguin #${item.edition}`;
}

function buildLeaderboardRowsHtml(items, showBoardAction = true) {
  if (!items || items.length === 0) {
    return `<div style="padding:32px; text-align:center; color:#94a3b8; font-weight:800;">${
      CURRENT_LANG === 'ko'
        ? '검색 조건에 해당하는 NFT 게임 순위 기록이 없습니다.'
        : 'No matching NFT ranking records found.'
    }</div>`;
  }
  return items
    .map((item) => {
      const medal =
        item.rank === 1
          ? '🥇 1위'
          : item.rank === 2
          ? '🥈 2위'
          : item.rank === 3
          ? '🥉 3위'
          : `#${item.rank}`;
      const topClass = item.rank <= 3 ? `rank-top-${item.rank}` : '';
      const nftName = getNftDisplayName(item);
      const spText = item.species || 'Classic';
      const subText =
        CURRENT_LANG === 'ko'
          ? `깃털스킨: ${spText} · 희귀도 순위 #${Number(item.rarity_rank).toLocaleString()} · 장애물 격파 ${item.kills || 0}기`
          : `Feather Skin: ${spText} · Rarity Rank #${Number(item.rarity_rank).toLocaleString()} · ${item.kills || 0} Hits`;
      const goLabel = CURRENT_LANG === 'ko' ? '🔍 NFT 상세·프사 ▶' : '🔍 Inspect NFT ▶';
      const boardLabel = CURRENT_LANG === 'ko' ? '🛸 이 NFT로 탑승' : '🛸 Board UFO';

      return `
        <div class="rank-row-card ${topClass}" onclick="jumpToRankedNft(${item.edition})">
          <div class="rank-badge-num">${medal}</div>
          <img src="${item.image_url}" alt="${escapeHtml(nftName)}" class="rank-avatar-thumb" loading="lazy" />
          <div class="rank-nft-info">
            <div class="rank-nft-title">
              <span>${escapeHtml(nftName)}</span>
              <span class="pill-tag" style="font-size:10.5px; padding:2px 6px;">${escapeHtml(item.id)}</span>
              <span class="tier-pill tier-${item.tier}" style="font-size:10.5px; padding:2px 7px;">${item.tier}</span>
            </div>
            <div class="rank-nft-sub">${escapeHtml(subText)}</div>
          </div>
          <div class="rank-score-val">${Number(item.score).toLocaleString()} PTS</div>
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

function renderRankingPageList() {
  const listEl = document.getElementById('ranking-page-list-body');
  if (!listEl) return;
  const q = (document.getElementById('ranking-search-input')?.value || '').trim().toLowerCase();

  let filtered = RANKING_PAGE_CACHE;
  if (q) {
    filtered = RANKING_PAGE_CACHE.filter((item) => {
      const nameKo = String(item.name_ko || item.name || `Pixel Penguin #${item.edition}`).toLowerCase();
      const nameEn = String(item.name_en || item.name || `Pixel Penguin #${item.edition}`).toLowerCase();
      const idStr = String(item.id || '').toLowerCase();
      const edStr = String(item.edition);
      const spStr = String(item.species || '').toLowerCase();
      return (
        nameKo.includes(q) ||
        nameEn.includes(q) ||
        idStr.includes(q) ||
        edStr === q.replace(/^#/, '') ||
        spStr.includes(q)
      );
    });
  }

  listEl.innerHTML = buildLeaderboardRowsHtml(filtered, true);

  // Update KPI summary cards
  const totalEl = document.getElementById('ranking-kpi-total');
  const topNameEl = document.getElementById('ranking-kpi-top-name');
  const topScoreEl = document.getElementById('ranking-kpi-top-score');
  if (totalEl) totalEl.textContent = `${RANKING_PAGE_CACHE.length.toLocaleString()}마리`;
  if (RANKING_PAGE_CACHE.length > 0) {
    const first = RANKING_PAGE_CACHE[0];
    if (topNameEl) topNameEl.textContent = `${getNftDisplayName(first)} (${first.id})`;
    if (topScoreEl) topScoreEl.textContent = `${Number(first.score).toLocaleString()} PTS`;
  }
}

async function fetchAndRenderRankingPage() {
  const listEl = document.getElementById('ranking-page-list-body');
  if (listEl && RANKING_PAGE_CACHE.length === 0) {
    listEl.innerHTML = `<div style="padding:32px; text-align:center; color:#94a3b8; font-weight:800;">${
      CURRENT_LANG === 'ko' ? 'NFT 이름별 게임 순위를 불러오는 중...' : 'Loading NFT Game Rankings...'
    }</div>`;
  }
  try {
    const res = await fetch('/api/leaderboard?limit=50');
    if (res.ok) {
      const data = await res.json();
      RANKING_PAGE_CACHE = data.items || [];
      renderRankingPageList();
    }
  } catch (e) {
    if (listEl) {
      listEl.innerHTML = `<div style="padding:32px; text-align:center; color:#fb7185;">게임 순위 로드 실패</div>`;
    }
  }
}

function boardRankedNftAndPlay(edition, event) {
  if (event && typeof event.stopPropagation === 'function') {
    event.stopPropagation();
  }
  const num = Math.max(0, Math.min(9999, Number(edition) || 0));
  closeLeaderboardModal();
  setUfoPilotTokenId(num, true, true);
  scrollToSection('tab-intro');
  enterUfoFullscreenGame(true);
}

async function openLeaderboardModal() {
  // Navigate directly to the dedicated "게임 순위" (tab-ranking) menu tab between 도감도 & 공지사항!
  scrollToSection('tab-ranking');
}

function closeLeaderboardModal() {
  document.getElementById('leaderboard-modal')?.classList.remove('open');
}

function jumpToRankedNft(edition) {
  const num = Math.max(0, Math.min(9999, Number(edition) || 0));
  closeLeaderboardModal();
  setUfoPilotTokenId(num, false, false);
  loadPfpPreview(num, false);
  openTokenModal(num);
}

// Helper: Draw GIANT 2D UFO Spaceship with Upper-Body Penguin Pilot (Normal Head Size + Full Upper Torso & Wings Visible!)
// Cropped at srcH = 216 (out of 256) so Head + Neck + Chest + Both Side Flippers show 100%, hiding ONLY the feet inside the saucer hull!
function drawUfoSpaceshipWithPilot(
  ctx,
  cx,
  cy,
  tiltRad = 0,
  now = 0,
  isShocked = false,
  isImpactBlink = false,
  shields = 3,
  options = {}
) {
  const {
    scale = 1.40,
    openHatchRatio = 0,
    spId = UFO_GAME.pilotSpeciesId || '01',
    thrusterBoost = 1,
  } = options;

  const sheet2D = getHero2DSheetForSpecies(spId);
  const anim = getPenguinAnimState(
    isImpactBlink ? 320 : now,
    0,
    false,
    isImpactBlink,
    isShocked && !isImpactBlink
  );

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);

  // 0. Outer Energy Shield Aura (when shields > 0)
  if (shields > 0) {
    const pulse = 0.22 + 0.1 * Math.sin(now * 0.008);
    ctx.save();
    ctx.strokeStyle =
      shields >= 3
        ? `rgba(103, 232, 249, ${pulse + 0.18})`
        : shields === 2
        ? `rgba(250, 204, 21, ${pulse + 0.22})`
        : `rgba(251, 113, 133, ${pulse + 0.28})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, -14, 76, 56, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 1. Rear Propulsion Plasma Flame + Bottom Anti-Gravity Core Glow
  if (thrusterBoost > 0) {
    const jetFlicker = (18 + Math.sin(now * 0.06) * 7) * thrusterBoost;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.38)';
    ctx.beginPath();
    ctx.ellipse(-60 - jetFlicker * 0.4, 10, jetFlicker, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(-58 - jetFlicker * 0.2, 10, jetFlicker * 0.55, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bottom anti-gravity rings
    const ringSpread = (now * 0.04) % 14;
    ctx.strokeStyle = `rgba(103, 232, 249, ${0.68 - ringSpread / 22})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 24 + ringSpread * 0.6 * thrusterBoost, 32 - ringSpread * 0.8, 5.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Pilot Seat Backrest behind Penguin's Torso
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#090d1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-24, -42, 14, 44, 5);
  ctx.fill();
  ctx.stroke();

  // 3. UPPER-BODY PENGUIN PILOT (Normal Head Size + Full Chest, Belly & Both Wings Visible!)
  //    pilotSize = 86 (at scale 1.40 -> 120px on screen, matching normal penguin size!)
  //    srcH = 216 (out of 256): includes Full Head (y=15..156) + Full Upper Body/Chest/Wings (y=156..216), hiding ONLY the feet (y=220..248)!
  ctx.save();
  ctx.beginPath();
  ctx.rect(-56, -86, 112, 91); // Clips cleanly at y = +5 (cockpit rim)
  ctx.clip();

  const pilotSize = 86;
  const srcCropH = 216;
  const drawH = pilotSize * (srcCropH / 256); // 72.5px tall (Head ~44px + Torso/Wings ~28.5px!)
  const pilotTopY = 5 - drawH - openHatchRatio * 4; // Bottom of torso sits at y = +5, so whole chest & wings are above rim!
  ctx.imageSmoothingEnabled = true;
  if (sheet2D) {
    ctx.drawImage(
      sheet2D,
      anim.frameIdx * 256,
      0,
      256,
      srcCropH,
      -pilotSize / 2 + 1,
      pilotTopY,
      pilotSize,
      drawH
    );
  } else if (MOTION_STATE.hero2DLoaded && MOTION_STATE.hero2DImg) {
    ctx.drawImage(
      MOTION_STATE.hero2DImg,
      0,
      0,
      256,
      srcCropH,
      -pilotSize / 2 + 1,
      pilotTopY,
      pilotSize,
      drawH
    );
  }
  ctx.restore();

  // 4. Cockpit Control Collar (Wraps around the lower waist at y = +4..+8)
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(0, 5, 45, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.fillRect(-14, 3, 5, 3);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-4, 4, 5, 3);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(7, 3, 5, 3);

  // 5. Top Glass Dome Hatch ("우주선 대가리"): Hinges open on left pivot (-44, 4) when openHatchRatio > 0!
  //    Encloses both the normal-sized head AND the upper torso/wings!
  ctx.save();
  ctx.translate(-44, 4);
  ctx.rotate(-openHatchRatio * 0.92);
  ctx.translate(44, -4);

  const domeGrad = ctx.createLinearGradient(0, -68, 0, 4);
  domeGrad.addColorStop(0, 'rgba(186, 230, 253, 0.26)');
  domeGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.10)');
  domeGrad.addColorStop(1, 'rgba(14, 116, 144, 0.24)');
  ctx.fillStyle = domeGrad;
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.92)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(0, 4, 44, 68, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(0, 3, 37, 58, 0, Math.PI * 1.14, Math.PI * 1.48);
  ctx.stroke();
  ctx.restore();

  // 6. Metallic UFO Saucer Main Hull (Completely covers y = 3..25, hiding only the feet!)
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#090d1a';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(0, 18, 32, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const hullGrad = ctx.createLinearGradient(0, -1, 0, 23);
  hullGrad.addColorStop(0, '#e2e8f0');
  hullGrad.addColorStop(0.35, '#38bdf8');
  hullGrad.addColorStop(0.75, '#0284c7');
  hullGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = hullGrad;
  ctx.strokeStyle = '#090d1a';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.ellipse(0, 11, 64, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 9, 58, 9, 0, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // 5 Rotating Neon Rim Lights
  const lightPhase = Math.floor(now / 110);
  const rimPositions = [-44, -22, 0, 22, 44];
  rimPositions.forEach((lx, idx) => {
    const ly = 12 + Math.cos((lx / 50) * (Math.PI / 2)) * 3.5;
    const isLit = (lightPhase + idx) % 2 === 0;
    ctx.fillStyle = '#090d1a';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 5.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isLit ? '#facc15' : '#67e8f9';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 4, 2.3, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Twin Front Plasma Laser Cannon Nozzles
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#090d1a';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(56, 5, 13, 5, 2);
  ctx.roundRect(52, 12, 13, 5, 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Helper: Draw GIANT 16-BIT PIXEL UFO Spaceship with Upper-Body Pixel Penguin Pilot (Normal Head Size + Full Upper Torso & Wings Visible!)
function drawPixelUfoSpaceshipWithPilot(
  ctx,
  cx,
  cy,
  tiltRad = 0,
  now = 0,
  options = {}
) {
  const {
    scale = 1.42,
    openHatchRatio = 0,
    spId = UFO_GAME.pilotSpeciesId || '01',
    forceBlink = false,
    isShocked = false,
    showSmoke = false,
  } = options;

  const spEntry = ensureSpeciesSprite(spId);
  const anim = getPenguinAnimState(now, 1, false, forceBlink, isShocked);
  const P = 4; // Stepped 16-bit pixel block size

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;

  // Optional cute pixel smoke puffs after crash-landing
  if (showSmoke) {
    for (let s = 0; s < 3; s++) {
      const sp = ((now * 0.0022 + s * 0.33) % 1);
      const sx = Math.round((-46 - sp * 18) / P) * P;
      const sy = Math.round((-2 - sp * 28) / P) * P;
      const sz = s % 2 === 0 ? 8 : 6;
      ctx.fillStyle = s % 2 === 0 ? 'rgba(148, 163, 184, 0.65)' : 'rgba(250, 204, 21, 0.72)';
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  // 1. Stepped Pixel Pilot Seat Backrest behind Penguin's Torso
  ctx.fillStyle = '#090d1a';
  ctx.fillRect(-25, -42, 15, 44);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-22, -39, 9, 38);

  // 2. UPPER-BODY 16-BIT PIXEL PENGUIN PILOT (Normal Head Size + Full Chest, Belly & Both Wings Visible!)
  //    pilotSize = 86 (at scale 1.42 -> 122px on screen, identical to the 124px penguin friends!)
  //    srcCropH = 216 (out of 256): shows Full Head (15..156) + Full Upper Body/Chest/Wings (156..216), hiding ONLY the feet (220..245)!
  ctx.save();
  ctx.beginPath();
  ctx.rect(-58, -88, 116, 92);
  ctx.clip();

  const pilotSize = 86;
  const srcCropH = 216;
  const drawH = Math.round(pilotSize * (srcCropH / 256)); // 73px tall (Head + Full Upper Torso & Wings!)
  const happyBob = openHatchRatio > 0.6 ? (Math.floor(now / 260) % 2 === 0 ? 0 : -3) : 0;
  const pilotTopY = 4 - drawH - Math.round(openHatchRatio * 4) + happyBob;
  if (spEntry && spEntry.sheetLoaded && spEntry.sheet) {
    ctx.drawImage(
      spEntry.sheet,
      anim.frameIdx * 256,
      0,
      256,
      srcCropH,
      -pilotSize / 2 + 2,
      pilotTopY,
      pilotSize,
      drawH
    );
  } else if (spEntry && spEntry.loaded && spEntry.img) {
    ctx.drawImage(
      spEntry.img,
      0,
      0,
      256,
      srcCropH,
      -pilotSize / 2 + 2,
      pilotTopY,
      pilotSize,
      drawH
    );
  }
  ctx.restore();

  // 3. Stepped 16-Bit Pixel Cockpit Collar (y = 1..9)
  ctx.fillStyle = '#090d1a';
  ctx.fillRect(-46, 1, 92, 8);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-42, 3, 84, 4);
  ctx.fillStyle = '#34d399';
  ctx.fillRect(-16, 3, 6, 4);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-3, 3, 6, 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(10, 3, 6, 4);

  // 4. Stepped 16-Bit Pixel Glass Dome Hatch ("우주선 대가리" — Hinges open on left pivot (-44, 3)!)
  //    Tinted glass interior rotates WITH the hatch so there is NEVER a dark box left behind the penguin's head when open!
  ctx.save();
  ctx.translate(-44, 3);
  ctx.rotate(-openHatchRatio * 0.95);
  ctx.translate(44, -3);

  // Translucent cyan glass fill inside the dome arch
  ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
  ctx.fillRect(-32, -60, 64, 62);
  ctx.fillRect(-40, -48, 80, 50);

  // Stepped 16-Bit Pixel Arch Outline (#7dd3fc)
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(-28, -64, 56, P);
  ctx.fillRect(-36, -60, 8, P);
  ctx.fillRect(28, -60, 8, P);
  ctx.fillRect(-40, -56, P, 8);
  ctx.fillRect(36, -56, P, 8);
  ctx.fillRect(-44, -48, P, 48);
  ctx.fillRect(40, -48, P, 48);

  // Crisp white pixel glass reflection blocks
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-28, -56, 12, P);
  ctx.fillRect(-32, -52, P, 14);
  ctx.restore();

  // 5. Stepped 16-Bit Pixel UFO Saucer Hull (Covers y = 3..27 completely!)
  // Bottom dark pixel engine pod
  ctx.fillStyle = '#090d1a';
  ctx.fillRect(-32, 19, 64, 8);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-28, 19, 56, 5);

  // Main stepped pixel saucer body
  ctx.fillStyle = '#090d1a';
  ctx.fillRect(-56, 3, 112, 18);
  ctx.fillRect(-64, 7, 128, 10);

  // Top silver-white pixel bevel
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-52, 5, 104, 4);
  // Mid cyan pixel band
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-60, 9, 120, 5);
  // Lower royal blue pixel shadow band
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-52, 14, 104, 5);

  // 5 Blinking 16-Bit Pixel Neon Rim Lights
  const lightPhase = Math.floor(now / 140);
  const rimX = [-44, -22, 0, 22, 44];
  rimX.forEach((lx, idx) => {
    const isLit = (lightPhase + idx) % 2 === 0;
    ctx.fillStyle = '#090d1a';
    ctx.fillRect(lx - 5, 9, 10, 6);
    ctx.fillStyle = isLit ? '#facc15' : '#67e8f9';
    ctx.fillRect(lx - 3, 10, 6, 4);
  });

  // Stepped Pixel Twin Nose Laser Cannons
  ctx.fillStyle = '#090d1a';
  ctx.fillRect(54, 5, 14, 12);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(56, 7, 10, 3);
  ctx.fillRect(54, 12, 10, 3);

  ctx.restore();
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
    bg2.src = '/assets/motion_sprites/bg_scene2_pixel.jpg?v=4.9.0';
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
  for (let i = 0; i < 3; i++) {
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
  MOTION_STATE.sceneIdx = ((sceneIdx % 3) + 3) % 3;
  if (resetTimer) {
    MOTION_STATE.sceneStartTime = performance.now();
    if (MOTION_STATE.sceneIdx === 1) {
      resetUfoGame(MOTION_STATE.sceneStartTime, false);
    }
  }
  document.querySelectorAll('.motion-mode-btn[data-scene]').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.scene) === MOTION_STATE.sceneIdx);
  });

  const labelEl = document.getElementById('motion-hud-mode-label');
  if (labelEl) {
    const labelsKo = [
      'SCENE 1/3 · 🚨 남극이 파괴되고 있어요! 대형 우주선 탑승 & 긴급 탈출',
      'SCENE 2/3 · 🛸 하늘 교전 미니게임 → 격추 시 우주선 통째 픽셀화 변신',
      'SCENE 3/3 · 💥 픽셀월드 불시착! 우주선 해치 오픈 & 펭귄 친구들 환영',
    ];
    const labelsEn = [
      'SCENE 1/3 · 🚨 Antarctica is Crumbling! Board Giant UFO & Escape',
      'SCENE 2/3 · 🛸 Sky Battle Mini-Game → Shot Down & Whole-UFO Pixelation',
      'SCENE 3/3 · 💥 Crash-Landed in Pixel World! UFO Hatch Opens & Friends Welcome',
    ];
    labelEl.textContent =
      CURRENT_LANG === 'ko' ? labelsKo[MOTION_STATE.sceneIdx] : labelsEn[MOTION_STATE.sceneIdx];
  }
}

function selectMotionPenguin() {
  ['01', '04', '05', '06', '09', '15'].forEach((id) => ensureSpeciesSprite(id));
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
  ctx.restore();
  return anim;
}

// Helper: Soft Stepped Pixel Ground Shadow (Replaces ugly gray bricks under feet!)
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
    // Pixel Eighth Note (♪)
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

// Helper: Authentic 16-Bit Pixel Speech Bubble for Funny Cutscene Dialogue
function drawRetroSpeechBubble(
  ctx,
  anchorX,
  anchorY,
  text,
  accentColor = '#38bdf8',
  now = 0
) {
  const P = 3;
  const bob = Math.floor(now / 250) % 2 === 0 ? 0 : -2;
  ctx.save();
  ctx.font = '800 13.5px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
  const textW = Math.ceil(ctx.measureText(text).width);
  const bw = Math.max(128, Math.round((textW + 32) / 4) * 4);
  const bh = 36;

  // Clamp bubble horizontally & vertically so it never clips off-canvas or overlaps top HUD bars (y=12..48)
  const bx = Math.max(18, Math.min(960 - bw - 18, Math.round(anchorX - bw / 2)));
  const by = Math.max(56, Math.round(anchorY - bh - 10 + bob));
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
  ctx.fillText(text, bx + bw / 2, by + bh / 2 + 2);
  ctx.restore();
}

// Helper: Sleek Cyber-Arcade HUD Scanner Pill (for Scene 1 Phase B Whole-UFO Pixel Conversion)
function drawPixelScanHudPill(ctx, cx, y, pct) {
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
    pct < 100 ? `UFO & PILOT PIXEL SCAN · ${pct}%` : 'PIXEL UFO COMPLETE!',
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

// Draw a Sculpted 16-Bit Arcade Title Word (Exact Integer Grid + 1-Pixel Black Border + 3D Shadow + Top Bevel)
function drawArcadePixelWord(ctx, word, centerX, topY, pSize = 5) {
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

// Helper: Draw Scene 1 Background (Studio 2D Snow Cliff + Subtle Glowing Portal Sparks & Snowfall)
function drawScene1Background(ctx, now) {
  ensureIntroBackgrounds();
  if (MOTION_STATE.bgScene1Loaded && MOTION_STATE.bgScene1Img) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(MOTION_STATE.bgScene1Img, 0, 0, 960, 540);
  } else {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 540);
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(0.65, '#bae6fd');
    skyGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 960, 540);
  }

  // Subtle Glowing Pixel Energy Motes rising inside the Portal Chasm (x = 640..850)
  ctx.save();
  for (let i = 0; i < 12; i++) {
    const vx = 645 + ((i * 39) % 200);
    const vy = 520 - (((now * 0.11 + i * 47) % 460) | 0);
    const sz = i % 3 === 0 ? 6 : 4;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(103, 232, 249, 0.85)' : 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(vx, vy, sz, sz);
  }
  ctx.restore();

  // Gentle 2D Snowflakes drifting across the left snow cliff
  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  for (let s = 0; s < 14; s++) {
    const sx = (s * 61 + now * 0.022) % 580;
    const sy = (s * 47 + now * 0.045) % 340;
    ctx.beginPath();
    ctx.arc(sx, sy, (s % 2) + 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Helper: Draw Scene 2 & 3 Background (Studio 16-Bit Pixel Cherry-Blossom Park + Live Petals & Water Glints)
function drawScene2PixelWorldBackground(ctx, now) {
  ensureIntroBackgrounds();
  const P = 4;
  const snap = (v) => Math.floor(v / P) * P;

  if (MOTION_STATE.bgScene2Loaded && MOTION_STATE.bgScene2Img) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(MOTION_STATE.bgScene2Img, 0, 0, 960, 540);
  } else {
    ctx.fillStyle = '#5899e2';
    ctx.fillRect(0, 0, 960, 410);
    ctx.fillStyle = '#52b768';
    ctx.fillRect(0, 410, 960, 130);
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

// Helper: Draw Damaged Empty UFO Saucer Spiraling Away After Shot-Down (Glass Dome Popped Open!)
function drawDamagedUfoSaucer(ctx, cx, cy, rotRad = 0, now = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotRad);

  // Dark smoke puffs & fiery orange sparks erupting from the damaged engine
  for (let s = 0; s < 4; s++) {
    const sp = (now * 0.005 + s * 0.25) % 1;
    ctx.fillStyle = s % 2 === 0 ? `rgba(251, 113, 133, ${(1 - sp) * 0.85})` : `rgba(30, 41, 59, ${(1 - sp) * 0.82})`;
    ctx.beginPath();
    ctx.arc(8 - sp * 34, -8 - sp * 32, 7 + sp * 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Open glass canopy dome hinging backward on the left
  ctx.save();
  ctx.translate(-38, 2);
  ctx.rotate(-0.72);
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.88)';
  ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(38, 0, 38, 32, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Bottom engine pod
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#090d1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 16, 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Main metallic saucer disc (matching live UFO hull)
  const hullGrad = ctx.createLinearGradient(0, -2, 0, 20);
  hullGrad.addColorStop(0, '#cbd5e1');
  hullGrad.addColorStop(0.4, '#0284c7');
  hullGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = hullGrad;
  ctx.strokeStyle = '#090d1a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 9, 58, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Empty cockpit rim opening
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#fb7185';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(0, 3, 40, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Helper: Draw a Pixel Golden Ice-Fish or Cyber Meteor / Plasma Mine for the UFO Game
function drawUfoEntity(ctx, ent, now) {
  ctx.save();
  ctx.translate(ent.x, ent.y);

  if (ent.type === 'banana') {
    drawCartoonBananaPeel(ctx, 0, 0, ent.rot, 0.96);
  } else if (ent.type === 'meteor') {
    ctx.rotate(ent.rot);
    // Glowing cyber-pixel asteroid with craters
    ctx.fillStyle = '#090d1a';
    ctx.beginPath();
    ctx.arc(0, 0, ent.r + 3, 0, Math.PI * 2);
    ctx.fill();
    const mGrad = ctx.createRadialGradient(-5, -5, 2, 0, 0, ent.r);
    mGrad.addColorStop(0, '#a855f7');
    mGrad.addColorStop(0.55, '#4c1d95');
    mGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = mGrad;
    ctx.beginPath();
    ctx.arc(0, 0, ent.r, 0, Math.PI * 2);
    ctx.fill();
    // Pixel neon cracks
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(-ent.r * 0.4, -4, 6, 4);
    ctx.fillRect(2, 3, 5, 5);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-3, -ent.r * 0.5, 4, 4);
  } else if (ent.type === 'mine') {
    ctx.rotate(ent.rot);
    // Spiky neon plasma mine
    drawComicStarburst(ctx, 0, 0, ent.r * 0.55, ent.r + 5, 8, '#fb7185', '#090d1a', 0);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, ent.r * 0.36, 0, Math.PI * 2);
    ctx.fill();
  } else if (ent.type === 'fish') {
    // Golden Ice-Fish collectible (+500 PTS)
    const bob = Math.sin(now * 0.012 + ent.x * 0.03) * 3;
    ctx.translate(0, bob);
    // Outer golden aura
    ctx.fillStyle = 'rgba(250, 204, 21, 0.24)';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    // Tail fin
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#090d1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(20, -9);
    ctx.lineTo(18, 0);
    ctx.lineTo(20, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Fish body
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(-2, 0, 14, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Cute eye
    ctx.fillStyle = '#090d1a';
    ctx.beginPath();
    ctx.arc(-8, -2, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-9, -3, 1.5, 1.5);
  } else if (ent.type === 'core') {
    // Glowing Very Crystal Core (+350 PTS)
    ctx.rotate(now * 0.004);
    drawComicStarburst(ctx, 0, 0, 8, 16, 4, '#67e8f9', '#090d1a', 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3, -3, 6, 6);
  }
  ctx.restore();
}

// Helper: Top Arcade HUD Bar inside Scene 1 Combat Phase
function drawUfoCombatHud(ctx, now) {
  ctx.save();
  const hx = 16;
  const hy = 12;
  const hw = 452;
  const hh = 34;
  ctx.fillStyle = 'rgba(9, 13, 26, 0.88)';
  ctx.fillRect(hx - 2, hy - 2, hw + 4, hh + 4);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(hx, hy, hw, hh);

  // Pilot NFT Tag OR Guest Tag ('없음')
  if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
    const idCode = `P${String(UFO_GAME.pilotTokenId).padStart(4, '0')}`;
    ctx.fillStyle = '#fde047';
    ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`🛸 ${idCode}`, hx + 10, hy + hh / 2 + 1);
  } else {
    ctx.fillStyle = '#67e8f9';
    ctx.font = '900 11.5px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(CURRENT_LANG === 'ko' ? '🛸 없음(미기록)' : '🛸 NO-NFT', hx + 10, hy + hh / 2 + 1);
  }

  // Score
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.fillText(
    `SCORE ${UFO_GAME.score.toLocaleString()}`,
    hx + 96,
    hy + hh / 2 + 1
  );

  // Combo
  if (UFO_GAME.combo > 1) {
    ctx.fillStyle = '#34d399';
    ctx.fillText(`x${UFO_GAME.combo}`, hx + 202, hy + hh / 2 + 1);
  }

  // 3 Shield Hearts
  for (let s = 0; s < UFO_GAME.maxShields; s++) {
    const active = s < UFO_GAME.shields;
    drawPixelHeart(
      ctx,
      hx + 248 + s * 22,
      hy + hh / 2,
      2.1,
      active ? '#38bdf8' : '#334155'
    );
  }

  // Control mode indicator
  ctx.fillStyle = UFO_GAME.userControlled ? '#34d399' : '#bae6fd';
  ctx.font = '800 11.5px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(
    UFO_GAME.userControlled
      ? CURRENT_LANG === 'ko'
        ? '🎮 직접 조종중'
        : '🎮 PLAYING'
      : CURRENT_LANG === 'ko'
      ? '터치·마우스 조종'
      : 'TOUCH / MOVE',
    hx + hw - 12,
    hy + hh / 2 + 1
  );

  // Center-Right Interactive Action Pill: "[💥 격추 & 픽셀화 ▶]" (x = 478..636, y = 12..46)
  const bx = 478;
  const by = 12;
  const bw = 158;
  const bh = 34;
  ctx.fillStyle = 'rgba(225, 29, 72, 0.9)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#fda4af';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    CURRENT_LANG === 'ko' ? '💥 격추 & 픽셀화 ▶' : '💥 Shot Down & Scan ▶',
    bx + bw / 2,
    by + bh / 2 + 1
  );

  ctx.restore();
}

function initPixelMotionStudio() {
  const canvas = document.getElementById('pixel-stage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Preload Studio Backgrounds, 2D Hero Penguin (hero_2d_sheet.png), Hero Blue (sp_01), and Colorful Friends (04, 05, 06, 09, 15)
  ensureIntroBackgrounds();
  ensureHero2DSprite();
  ['01', '04', '05', '06', '09', '15'].forEach((id) => ensureSpeciesSprite(id));

  // UFO Boarding Dock Controls:
  // 1) NFT Number Input + "[🚀 NFT 탑승]" button (Applies Category #1 Feather Skin & Enables Leaderboard Recording)
  const pilotInput = document.getElementById('ufo-pilot-id-input');
  const boardNftBtn = document.getElementById('btn-ufo-board-nft');
  const boardNoneBtn = document.getElementById('btn-ufo-board-none');

  const handleBoardWithInput = () => {
    const raw = pilotInput ? pilotInput.value.trim() : '';
    if (raw === '') {
      setUfoPilotTokenId(0, true, true);
    } else {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) {
        setUfoPilotTokenId(n, true, true);
      }
    }
  };

  if (pilotInput) {
    pilotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleBoardWithInput();
      }
    });
    pilotInput.addEventListener('change', () => {
      const raw = pilotInput.value.trim();
      if (raw !== '' && !Number.isNaN(parseInt(raw, 10))) {
        setUfoPilotTokenId(parseInt(raw, 10), true, false);
      }
    });
  }

  boardNftBtn?.addEventListener('click', handleBoardWithInput);

  // 2) "[없음 (기록 안 남음)]" button (Plays with Default Blue Penguin '01' & Does NOT Record Score)
  boardNoneBtn?.addEventListener('click', () => {
    boardUfoWithoutNft(true);
  });

  // 3) "[🎲 랜덤 NFT]" button
  document.getElementById('btn-ufo-random-id')?.addEventListener('click', () => {
    const rnd = Math.floor(Math.random() * 10000);
    setUfoPilotTokenId(rnd, true, true);
  });

  // Default initial state: '없음 (기록 안 남음)' with Default Blue Penguin ('01') until user enters an NFT number or clicks NFT 탑승!
  updateUfoBoardingDockUI();

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

  // Keyboard Controls for Giant UFO Spaceship (Arrow Keys & WASD)
  window.addEventListener('keydown', (e) => {
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(
        e.code
      )
    ) {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA') return;
      UFO_GAME.keys[e.code] = true;
      if (MOTION_STATE.sceneIdx === 1 && UFO_GAME.phase === 'combat') {
        UFO_GAME.userControlled = true;
        if (e.code.startsWith('Arrow')) e.preventDefault();
      }
    }
  });
  window.addEventListener('keyup', (e) => {
    UFO_GAME.keys[e.code] = false;
  });

  // Scene Chapter Buttons (0: 남극탈출 & 탑승, 1: 하늘교전 & 픽셀화, 2: 불시착 & 환영)
  document.querySelectorAll('.motion-mode-btn[data-scene]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setIntroScene(Number(btn.dataset.scene), true);
    });
  });

  // HTML Dialogue Next Scene Button
  document.getElementById('intro-dialogue-next-btn')?.addEventListener('click', () => {
    if (MOTION_STATE.sceneIdx === 1 && UFO_GAME.phase === 'combat') {
      triggerUfoShotDown(performance.now());
      return;
    }
    setIntroScene((MOTION_STATE.sceneIdx + 1) % 3, true);
  });

  // Launch Fullscreen UFO Game ("🎮 게임 참여 (전체화면)") Buttons
  const handleEnterFullscreenClick = () => {
    // Sync NFT input if user typed a number before clicking 게임 참여
    const raw = pilotInput ? pilotInput.value.trim() : '';
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
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && MOTION_STATE.isFullscreen) {
      // Keep CSS lock-shell unless user pressed ESC on desktop native fullscreen
    }
  });

  // Autoplay Toggle Button
  const autoBtn = document.getElementById('btn-motion-autoplay');
  autoBtn?.addEventListener('click', () => {
    MOTION_STATE.autoPlay = !MOTION_STATE.autoPlay;
    MOTION_STATE.sceneStartTime = performance.now();
    autoBtn.classList.toggle('active-toggle', MOTION_STATE.autoPlay);
    const lblEl = document.getElementById('autoplay-label');
    if (lblEl) {
      lblEl.textContent =
        CURRENT_LANG === 'ko'
          ? `자동진행: ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`
          : `Auto: ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`;
    }
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
      // Clicking anywhere in Scene 0 launches straight into Scene 1 Sky Battle!
      setIntroScene(1, true);
      return;
    }

    if (MOTION_STATE.sceneIdx === 1) {
      // Clicking "[💥 격추 & 픽셀화 ▶]" button on top HUD triggers immediate shot-down & whole-UFO pixel scan!
      if (UFO_GAME.phase === 'combat' && mx >= 474 && mx <= 640 && my >= 10 && my <= 50) {
        triggerUfoShotDown(performance.now());
        return;
      }
      if (UFO_GAME.phase === 'combat') {
        UFO_GAME.userControlled = true;
        UFO_GAME.targetX = Math.max(125, Math.min(580, mx));
        UFO_GAME.targetY = Math.max(96, Math.min(325, my));
        return;
      }
    }

    if (MOTION_STATE.sceneIdx === 2) {
      // Clicking the top Score/Leaderboard banner in Scene 2 opens the NFT Leaderboard Modal!
      if (mx >= 160 && mx <= 800 && my >= 8 && my <= 48) {
        openLeaderboardModal();
        return;
      }
      // Clicking RPG Command Box options
      if (mx >= 310 && mx <= 650 && my >= 176 && my <= 218) {
        scrollToSection('tab-codex');
        return;
      }
      if (mx >= 310 && mx <= 650 && my >= 219 && my <= 264) {
        setIntroScene(0, true);
        return;
      }
    }
    setIntroScene((MOTION_STATE.sceneIdx + 1) % 3, true);
  });

  canvas.addEventListener('mousemove', (e) => {
    const { mx, my } = getLogicalCoords(e.clientX, e.clientY);
    if (MOTION_STATE.sceneIdx === 1 && UFO_GAME.phase === 'combat') {
      if (my > 54 && mx < 700) {
        UFO_GAME.userControlled = true;
        UFO_GAME.targetX = Math.max(125, Math.min(580, mx));
        UFO_GAME.targetY = Math.max(96, Math.min(325, my));
      }
      return;
    }
    if (MOTION_STATE.sceneIdx === 2) {
      if (my >= 176 && my < 219) MOTION_STATE.menuHoverIdx = 0;
      else if (my >= 219 && my <= 268) MOTION_STATE.menuHoverIdx = 1;
    }
  });

  // Mobile-First Touch Drag Steering for Giant UFO Spaceship (Zero Page Scroll in Fullscreen / Combat!)
  const handleTouchSteer = (e) => {
    const touch = e.touches[0];
    if (!touch) return;

    // When in Fullscreen Mode OR actively steering in Scene 1 Combat, block page scroll 100%!
    if (
      MOTION_STATE.isFullscreen ||
      (MOTION_STATE.sceneIdx === 1 && UFO_GAME.phase === 'combat' && UFO_GAME.userControlled)
    ) {
      if (e.cancelable) e.preventDefault();
    }

    const { mx, my } = getLogicalCoords(touch.clientX, touch.clientY);

    if (MOTION_STATE.sceneIdx === 1 && UFO_GAME.phase === 'combat') {
      if (mx >= 474 && mx <= 640 && my >= 10 && my <= 50) {
        triggerUfoShotDown(performance.now());
        return;
      }
      UFO_GAME.userControlled = true;
      UFO_GAME.targetX = Math.max(125, Math.min(580, mx));
      UFO_GAME.targetY = Math.max(96, Math.min(325, my - 38));
    }
  };
  canvas.addEventListener('touchstart', handleTouchSteer, { passive: false });
  canvas.addEventListener('touchmove', handleTouchSteer, { passive: false });

  // Dedicated Mobile Fullscreen Touchpad Below Canvas (Maps relative pad coordinates to UFO flight zone!)
  const touchpadEl = document.getElementById('mobile-fullscreen-touchpad');
  if (touchpadEl) {
    const steerFromPad = (clientX, clientY, ev) => {
      if (ev && ev.cancelable) ev.preventDefault();
      if (MOTION_STATE.sceneIdx === 0) {
        setIntroScene(1, true);
      }
      if (MOTION_STATE.sceneIdx === 1 && UFO_GAME.phase === 'combat') {
        const rect = touchpadEl.getBoundingClientRect();
        const rx = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
        const ry = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
        UFO_GAME.userControlled = true;
        UFO_GAME.targetX = Math.round(125 + rx * (580 - 125));
        UFO_GAME.targetY = Math.round(96 + ry * (325 - 96));
      }
    };
    touchpadEl.addEventListener(
      'touchstart',
      (e) => {
        const t = e.touches[0];
        if (t) steerFromPad(t.clientX, t.clientY, e);
      },
      { passive: false }
    );
    touchpadEl.addEventListener(
      'touchmove',
      (e) => {
        const t = e.touches[0];
        if (t) steerFromPad(t.clientX, t.clientY, e);
      },
      { passive: false }
    );
    touchpadEl.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) {
        steerFromPad(e.clientX, e.clientY, e);
      }
    });
  }

  setIntroScene(0, true);

  // Main 60 FPS Cutscene & Giant UFO Arcade Loop (1920x1080 HiDPI Buffer, 960x540 Logical Space)
  function renderIntroCutscene(now) {
    const activeSpId = UFO_GAME.pilotSpeciesId || '01';
    ensureSpeciesSprite(activeSpId);
    ensureHero2DSprite();

    let elapsed = now - MOTION_STATE.sceneStartTime;
    const curDuration = SCENE_DURATIONS[MOTION_STATE.sceneIdx] || 5600;

    // Scene 0 & Scene 2 auto-advance on timer; Scene 1 advances when Whole-UFO Pixel Scan finishes!
    if (MOTION_STATE.sceneIdx !== 1 && MOTION_STATE.autoPlay && elapsed >= curDuration) {
      setIntroScene((MOTION_STATE.sceneIdx + 1) % 3, true);
      elapsed = 0;
    }

    let p = Math.min(1, Math.max(0, elapsed / curDuration));
    if (MOTION_STATE.sceneIdx === 1) {
      if (UFO_GAME.phase === 'combat') {
        const combatEl = now - UFO_GAME.phaseStartTime;
        p = Math.min(0.55, (combatEl / 4800) * 0.55);
      } else {
        const scEl = now - UFO_GAME.phaseStartTime;
        p = 0.55 + Math.min(0.45, (scEl / 2900) * 0.45);
      }
    }
    updateIntroProgressBars(MOTION_STATE.sceneIdx, p);

    // Render in 2x HiDPI (1920x1080) using 960x540 logical coordinates
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 960, 540);

    // ========================================================================
    // SCENE 0 ("1. 🚨 남극탈출 & 탑승"):
    //   "남극이 파괴되고 있어요! 탈출하세요!"
    //   Crumbling Antarctica snow cliff + Giant UFO parked on snow -> Open top hatch closes -> Blasts off into the sky!
    // ========================================================================
    if (MOTION_STATE.sceneIdx === 0) {
      ctx.save();
      // Subtle earthquake tremor as Antarctica crumbles!
      const quakeMag = p < 0.7 ? 2.4 : 4.2;
      ctx.translate(
        Math.sin(now * 0.055) * quakeMag,
        Math.cos(now * 0.048) * (quakeMag * 0.75)
      );

      drawScene1Background(ctx, now);

      // Red Emergency Warning Strobe Overlay & Falling Ice Boulders into the Chasm
      const redPulse = 0.08 + 0.07 * Math.max(0, Math.sin(now * 0.012));
      ctx.fillStyle = `rgba(225, 29, 72, ${redPulse})`;
      ctx.fillRect(0, 0, 960, 540);

      // Crumbling ice boulders tumbling down the cliff edge (x = 575..665)
      for (let b = 0; b < 6; b++) {
        const fallT = ((now * 0.0016 + b * 0.19) % 1);
        const bx = 575 + ((b * 23) % 75) + fallT * 28;
        const by = 345 + fallT * fallT * 195;
        const bSz = 10 + (b % 3) * 5;
        ctx.fillStyle = '#bae6fd';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, bSz, bSz * 0.85, 3);
        ctx.fill();
        ctx.stroke();
      }

      // Top Emergency Alert Banner
      const alW = 540;
      const alH = 36;
      const alX = 480 - alW / 2;
      const alY = 14;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(alX - 2, alY - 2, alW + 4, alH + 4);
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 2;
      ctx.strokeRect(alX, alY, alW, alH);
      ctx.fillStyle = Math.floor(now / 260) % 2 === 0 ? '#fda4af' : '#fde047';
      ctx.font = '900 13.5px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const pilotTag =
        UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null
          ? `NFT #${UFO_GAME.pilotTokenId} (${UFO_GAME.pilotSpeciesLabel})`
          : CURRENT_LANG === 'ko'
          ? '기본 파란 펭귄 (기록 안 남음)'
          : 'Default Blue Penguin';
      ctx.fillText(
        CURRENT_LANG === 'ko'
          ? `🚨 남극 붕괴 경보! 탈출 우주선 가동 · 탑승자: ${pilotTag}`
          : `🚨 ANTARCTICA CRUMBLING! ESCAPE UFO READY · PILOT: ${pilotTag}`,
        480,
        alY + alH / 2 + 1
      );

      // Launchpad Rings under Giant UFO on the Antarctica Snow Cliff (x = 285, y = 352)
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.beginPath();
      ctx.ellipse(285, 356, 108, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p < 0.62 ? '#facc15' : '#67e8f9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(285, 356, 94, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Giant UFO Kinematics in Scene 0:
      // p = 0.00..0.42: Parked on snow cliff, top glass dome hatch is OPEN (openHatchRatio = 1) showing penguin boarding!
      // p = 0.42..0.64: Top glass dome hatch smoothly locks shut (openHatchRatio: 1 -> 0, "철컥!")
      // p = 0.64..1.00: Plasma thrusters roar to life & Giant UFO blasts off into the upper-right sky!
      const openHatchRatio =
        p < 0.42 ? 1 : p < 0.64 ? Math.max(0, 1 - (p - 0.42) / 0.22) : 0;
      const launchP = p < 0.64 ? 0 : Math.pow((p - 0.64) / 0.36, 2);
      const ufoX = 285 + launchP * 260;
      const ufoY = 324 - launchP * 390 + (p < 0.64 ? Math.sin(now * 0.015) * 3 : 0);
      const ufoTilt = launchP > 0 ? -0.22 * Math.min(1, launchP * 1.8) : 0;
      const thrusterBoost = p < 0.5 ? 0.4 : p < 0.64 ? 1.1 : 2.3;

      drawUfoSpaceshipWithPilot(
        ctx,
        ufoX,
        ufoY,
        ufoTilt,
        now,
        p < 0.38, // Surprised expression at crumbling Antarctica initially, then determined pilot!
        false,
        3,
        {
          scale: 1.40,
          openHatchRatio,
          spId: activeSpId,
          thrusterBoost,
        }
      );

      // Speech Bubble above the Giant UFO
      if (p < 0.88) {
        drawRetroSpeechBubble(
          ctx,
          ufoX + 12,
          Math.max(66, ufoY - 104),
          p < 0.45
            ? CURRENT_LANG === 'ko'
              ? '으아악!! 남극이 파괴되고 있어요!! 어서 우주선 타고 탈출하자!!'
              : 'AAAAH!! Antarctica is crumbling!! Board the Giant UFO and escape!!'
            : p < 0.68
            ? CURRENT_LANG === 'ko'
              ? '철컥! 우주선 해치 잠금 완료! 엔진 점화— 하늘로 출격!!'
              : 'CLANK! UFO Hatch Locked! Igniting plasma thrusters— LIFTOFF!!'
            : CURRENT_LANG === 'ko'
            ? '부우우웅—!! 남극 상공 돌파! 장애물을 피해 날아가자!!'
            : 'VROOOOM—!! Blasting into the sky! Dodge the obstacles!!',
          p < 0.45 ? '#fb7185' : '#38bdf8',
          now
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 1 · 🚨 남극 붕괴 & 우주선 탑승',
        CURRENT_LANG === 'ko'
          ? `남극이 파괴되고 있어요! ${pilotTag} 대원이 대형 UFO 우주선에 탑승해 하늘로 긴급 탈출합니다! (클릭 시 즉시 교전 시작)`
          : `Antarctica is crumbling! Pilot ${pilotTag} boards the Giant UFO on the snow cliff and blasts off into the sky!`
      );

      ctx.restore();
    }

    // ========================================================================
    // SCENE 1 ("2. 🛸 하늘교전 & 픽셀화"):
    //   Phase A ('combat'): Mobile-First Sky Battle in the Giant UFO (Scale 1.44x)!
    //   Phase B ('scan'): Shot Down (격추!) -> The ENTIRE Giant UFO + Penguin Pilot inside get scanned into a 16-Bit Pixel UFO + Pixel Penguin!
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 1) {
      const dt = Math.min(32, Math.max(8, now - (UFO_GAME.lastTickAt || now))) / 16.67;
      UFO_GAME.lastTickAt = now;

      ctx.save();
      if (now < UFO_GAME.shakeUntil) {
        const mag = ((UFO_GAME.shakeUntil - now) / 520) * 8;
        ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
      }

      drawScene1Background(ctx, now);

      // Cosmic speed lines & starfield in the upper sky
      ctx.save();
      UFO_GAME.stars.forEach((st) => {
        st.x -= st.spd * dt * (UFO_GAME.phase === 'combat' ? 2.3 : 0.8);
        if (st.x < 0) st.x += 960;
        ctx.fillStyle = 'rgba(224, 242, 254, 0.78)';
        ctx.fillRect(st.x, st.y, st.sz * 3, st.sz);
      });
      ctx.restore();

      if (UFO_GAME.phase === 'combat') {
        const combatElapsed = now - UFO_GAME.phaseStartTime;

        // 1. Update Giant UFO Position (Keyboard OR Touch/Mouse Target OR Smart AI Autopilot)
        const keySpd = 5.6 * dt;
        let keyMoved = false;
        if (UFO_GAME.keys['ArrowLeft'] || UFO_GAME.keys['KeyA']) {
          UFO_GAME.targetX -= keySpd;
          keyMoved = true;
        }
        if (UFO_GAME.keys['ArrowRight'] || UFO_GAME.keys['KeyD']) {
          UFO_GAME.targetX += keySpd;
          keyMoved = true;
        }
        if (UFO_GAME.keys['ArrowUp'] || UFO_GAME.keys['KeyW']) {
          UFO_GAME.targetY -= keySpd;
          keyMoved = true;
        }
        if (UFO_GAME.keys['ArrowDown'] || UFO_GAME.keys['KeyS']) {
          UFO_GAME.targetY += keySpd;
          keyMoved = true;
        }
        if (keyMoved) {
          UFO_GAME.targetX = Math.max(125, Math.min(580, UFO_GAME.targetX));
          UFO_GAME.targetY = Math.max(96, Math.min(325, UFO_GAME.targetY));
        }

        if (!UFO_GAME.userControlled) {
          UFO_GAME.targetX = 245 + Math.sin(now * 0.0028) * 65;
          UFO_GAME.targetY = 242 + Math.sin(now * 0.0052) * 48;
        }

        const dx = UFO_GAME.targetX - UFO_GAME.x;
        const dy = UFO_GAME.targetY - UFO_GAME.y;
        UFO_GAME.vx = dx * 0.16;
        UFO_GAME.vy = dy * 0.16;
        UFO_GAME.x += UFO_GAME.vx * dt;
        UFO_GAME.y += UFO_GAME.vy * dt;
        UFO_GAME.tiltRad = Math.max(-0.24, Math.min(0.24, UFO_GAME.vy * 0.03 + UFO_GAME.vx * 0.01));

        // 2. Auto-Fire Twin Plasma Lasers from Giant UFO Nose Cannons every 175ms
        if (now - UFO_GAME.lastFireAt >= 175) {
          UFO_GAME.lastFireAt = now;
          UFO_GAME.lasers.push(
            { x: UFO_GAME.x + 88, y: UFO_GAME.y + 5, vx: 14.0 },
            { x: UFO_GAME.x + 82, y: UFO_GAME.y + 17, vx: 14.0 }
          );
        }

        // 3. Spawn Incoming Obstacles & Collectibles
        const spawnInterval = UFO_GAME.userControlled ? 420 : 380;
        if (now - UFO_GAME.lastSpawnAt >= spawnInterval) {
          UFO_GAME.lastSpawnAt = now;
          const roll = Math.random();
          const spawnY = 86 + Math.random() * 235;
          if (roll < 0.28) {
            UFO_GAME.entities.push({
              type: 'banana',
              x: 920,
              y: spawnY,
              vx: -(5.2 + Math.random() * 2.4),
              vy: (Math.random() - 0.5) * 1.4,
              r: 23,
              hp: 1,
              rot: 0,
              vrot: -0.14,
            });
          } else if (roll < 0.58) {
            UFO_GAME.entities.push({
              type: 'meteor',
              x: 920,
              y: spawnY,
              vx: -(4.6 + Math.random() * 2.2),
              vy: (Math.random() - 0.5) * 1.1,
              r: 22,
              hp: 2,
              rot: 0,
              vrot: 0.07,
            });
          } else if (roll < 0.74) {
            UFO_GAME.entities.push({
              type: 'mine',
              x: 920,
              y: spawnY,
              vx: -(6.0 + Math.random() * 2.0),
              vy: Math.sin(now * 0.01) * 1.6,
              r: 19,
              hp: 1,
              rot: 0,
              vrot: 0.12,
            });
          } else if (roll < 0.90) {
            UFO_GAME.entities.push({
              type: 'fish',
              x: 920,
              y: spawnY,
              vx: -4.8,
              vy: 0,
              r: 21,
              hp: 1,
              rot: 0,
              vrot: 0,
            });
          } else {
            UFO_GAME.entities.push({
              type: 'core',
              x: 920,
              y: spawnY,
              vx: -5.0,
              vy: 0,
              r: 19,
              hp: 1,
              rot: 0,
              vrot: 0.08,
            });
          }
        }

        // 4. Update & Draw Twin Plasma Lasers
        ctx.save();
        for (let i = UFO_GAME.lasers.length - 1; i >= 0; i--) {
          const b = UFO_GAME.lasers[i];
          b.x += b.vx * dt;
          if (b.x > 960) {
            UFO_GAME.lasers.splice(i, 1);
            continue;
          }
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(b.x - 2, b.y - 3, 24, 7);
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(b.x, b.y - 2, 20, 5);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(b.x + 4, b.y - 1, 14, 2);
        }
        ctx.restore();

        // 5. Update & Draw Entities + Laser/UFO Collisions
        for (let i = UFO_GAME.entities.length - 1; i >= 0; i--) {
          const ent = UFO_GAME.entities[i];
          ent.x += ent.vx * dt;
          ent.y += ent.vy * dt;
          ent.rot += ent.vrot * dt;

          if (ent.x < -50) {
            UFO_GAME.entities.splice(i, 1);
            continue;
          }

          const isCollectible = ent.type === 'fish' || ent.type === 'core';

          if (!isCollectible) {
            let destroyedByLaser = false;
            for (let j = UFO_GAME.lasers.length - 1; j >= 0; j--) {
              const b = UFO_GAME.lasers[j];
              if (Math.hypot(b.x - ent.x, b.y - ent.y) <= ent.r + 12) {
                UFO_GAME.lasers.splice(j, 1);
                ent.hp -= 1;
                if (ent.hp <= 0) {
                  destroyedByLaser = true;
                  const pts =
                    (ent.type === 'mine' ? 300 : ent.type === 'banana' ? 200 : 180) *
                    UFO_GAME.combo;
                  UFO_GAME.score += pts;
                  UFO_GAME.kills += 1;
                  UFO_GAME.popups.push({
                    x: ent.x,
                    y: ent.y - 10,
                    vy: -1.4,
                    text: `+${pts}`,
                    col: '#67e8f9',
                    alpha: 1,
                  });
                  for (let k = 0; k < 7; k++) {
                    const a = (k / 7) * Math.PI * 2;
                    UFO_GAME.particles.push({
                      x: ent.x,
                      y: ent.y,
                      vx: Math.cos(a) * 3.2,
                      vy: Math.sin(a) * 3.2,
                      col: k % 2 === 0 ? '#facc15' : '#67e8f9',
                      sz: 5,
                      alpha: 1,
                      decay: 0.04,
                    });
                  }
                  break;
                }
              }
            }
            if (destroyedByLaser) {
              UFO_GAME.entities.splice(i, 1);
              continue;
            }
          }

          // Check collision with Giant UFO Spaceship
          const distToUfo = Math.hypot(ent.x - UFO_GAME.x, ent.y - UFO_GAME.y);
          if (distToUfo <= ent.r + 56) {
            if (isCollectible) {
              const pts = (ent.type === 'fish' ? 500 : 350) * UFO_GAME.combo;
              UFO_GAME.score += pts;
              UFO_GAME.combo = Math.min(8, UFO_GAME.combo + 1);
              UFO_GAME.popups.push({
                x: ent.x,
                y: ent.y - 14,
                vy: -1.8,
                text: ent.type === 'fish' ? `🐟 +${pts}!` : `💎 +${pts}!`,
                col: '#fde047',
                alpha: 1,
              });
              UFO_GAME.entities.splice(i, 1);
              continue;
            } else {
              UFO_GAME.entities.splice(i, 1);
              UFO_GAME.hitFlashUntil = now + 520;
              UFO_GAME.shakeUntil = now + 260;
              UFO_GAME.combo = 1;
              if (UFO_GAME.userControlled) {
                UFO_GAME.shields -= 1;
                UFO_GAME.popups.push({
                  x: UFO_GAME.x,
                  y: UFO_GAME.y - 48,
                  vy: -1.5,
                  text: UFO_GAME.shields > 0 ? '🛡️ SHIELD HIT!' : '💥 SHOT DOWN!!',
                  col: '#fb7185',
                  alpha: 1,
                });
                if (UFO_GAME.shields <= 0) {
                  triggerUfoShotDown(now);
                  break;
                }
              }
              continue;
            }
          }

          drawUfoEntity(ctx, ent, now);
        }

        // Passive auto-cinematic mode: after 4.8s of exciting demo combat, trigger dramatic shot-down!
        if (!UFO_GAME.userControlled && MOTION_STATE.autoPlay && combatElapsed >= 4800) {
          triggerUfoShotDown(now);
        }

        // 6. Draw the GIANT 2D UFO Spaceship (scale = 1.36) with Upper-Body Penguin Pilot (wearing Category #1 Feather Skin!)
        const isHitShocked = now < UFO_GAME.hitFlashUntil;
        const isHitImpactBlink = now < UFO_GAME.hitFlashUntil - 420;
        drawUfoSpaceshipWithPilot(
          ctx,
          UFO_GAME.x,
          UFO_GAME.y,
          UFO_GAME.tiltRad,
          now,
          isHitShocked,
          isHitImpactBlink,
          UFO_GAME.shields,
          {
            scale: 1.36,
            openHatchRatio: 0,
            spId: activeSpId,
            thrusterBoost: 1.25,
          }
        );

        drawRetroSpeechBubble(
          ctx,
          UFO_GAME.x + 10,
          Math.max(58, UFO_GAME.y - 96),
          isHitShocked
            ? CURRENT_LANG === 'ko'
              ? '으앗!! 운석에 맞았어!! 방어막 위험해!!'
              : 'Whoa!! Hit by a meteor!! Shield critical!!'
            : UFO_GAME.userControlled
            ? CURRENT_LANG === 'ko'
              ? '삐비빅~ 우주 바나나랑 운석 다 부숴버리자!! ♪'
              : 'Pew-pew~ Blast the space bananas & collect Golden Fish!! ♪'
            : CURRENT_LANG === 'ko'
            ? '모바일 터치·마우스로 대형 우주선을 직접 조종해보세요! ♪'
            : 'Touch or move mouse to steer the Giant UFO! ♪',
          isHitShocked ? '#fb7185' : '#38bdf8',
          now
        );

        drawUfoCombatHud(ctx, now);

        const recordStatusKo =
          UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null
            ? `NFT #${UFO_GAME.pilotTokenId} 랭킹 기록 ON`
            : 'NFT 없음 · 기록 안 남음';
        drawRetroDialogueBar(
          ctx,
          'SCENE 2 · 🛸 하늘 교전 미니게임',
          CURRENT_LANG === 'ko'
            ? `대형 우주선을 터치/마우스/방향키로 조종하세요! 격추되면 우주선 통째로 픽셀화되어 픽셀월드에 불시착합니다! (${UFO_GAME.score.toLocaleString()}점 · ${recordStatusKo})`
            : `Steer the Giant UFO with touch/mouse/arrows! When shot down, the entire UFO + Pilot pixelates together! (${UFO_GAME.score.toLocaleString()} PTS)`
        );
      } else {
        // ====================================================================
        // Phase B ('scan'): SHOT DOWN (격추!) -> THE ENTIRE GIANT UFO + PENGUIN PILOT
        // GET SCANNED TOGETHER INTO A 16-BIT PIXEL UFO + PIXEL PENGUIN!
        // (Zero ejection -> lower body is NEVER exposed!)
        // ====================================================================
        const scElapsed = now - UFO_GAME.phaseStartTime;
        const subP = Math.min(1, scElapsed / 2900);

        // First 0.22 of subP: Giant UFO glides smoothly into the Dimensional Pixel Rift center (x = 580, y = 258)
        const pullP = Math.min(1, subP / 0.22);
        const smoothPull = pullP * pullP * (3 - 2 * pullP);
        const scanRatio = subP < 0.14 ? 0 : Math.min(1, (subP - 0.14) / 0.66);
        const completeP = subP > 0.80 ? (subP - 0.80) / 0.20 : 0;
        const dropToWorld = subP > 0.88 ? Math.pow((subP - 0.88) / 0.12, 2) * 280 : 0;

        const ufoX = UFO_GAME.shotDownX + smoothPull * (580 - UFO_GAME.shotDownX);
        const ufoY =
          UFO_GAME.shotDownY +
          smoothPull * (258 - UFO_GAME.shotDownY) +
          Math.sin(now * 0.012) * 4 +
          dropToWorld;
        const ufoScale = 1.44;
        const ufoTilt = (1 - smoothPull) * -0.22 + Math.sin(now * 0.02) * 0.04;

        // Impact starburst right when shot down
        if (subP < 0.24) {
          const burstP = subP / 0.24;
          ctx.save();
          ctx.globalAlpha = 1 - burstP;
          drawComicStarburst(
            ctx,
            ufoX,
            ufoY,
            24 + burstP * 32,
            56 + burstP * 58,
            10,
            '#facc15',
            '#e11d48',
            burstP * 0.5
          );
          ctx.restore();
        }

        // Bounding vertical span of the Giant UFO (from top of glass dome -112 to bottom of engine pod +52)
        const topEdge = ufoY - 112;
        const botEdge = ufoY + 52;
        const totalSpanH = botEdge - topEdge;
        const scanY = topEdge + scanRatio * totalSpanH;

        // Natural eye-blink transition as the laser beam crosses the penguin's eyes inside the UFO!
        const pixelBlinkDuringBeam = scanRatio > 0.05 && scanRatio < 0.58;

        // 1. Back Half of Wide Holographic Dimensional Capture Rings (Sized for the Giant UFO!)
        ctx.save();
        for (let r = 0; r < 3; r++) {
          const ry = ufoY - 52 + r * 48 + Math.sin(now * 0.006 + r) * 5;
          const rx = 128 - r * 8;
          ctx.strokeStyle =
            r % 2 === 0 ? 'rgba(103, 232, 249, 0.42)' : 'rgba(244, 114, 182, 0.36)';
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.ellipse(ufoX, ry, rx, 18, 0, Math.PI, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // 2. Top Portion (Above Laser Scan Line): GIANT 16-BIT PIXEL UFO + PIXEL PENGUIN PILOT!
        if (scanRatio > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(ufoX - 180, topEdge - 40, 360, scanY - topEdge + 40);
          ctx.clip();
          drawPixelUfoSpaceshipWithPilot(ctx, ufoX, ufoY, ufoTilt, now, {
            scale: ufoScale,
            openHatchRatio: 0,
            spId: activeSpId,
            forceBlink: pixelBlinkDuringBeam,
            isShocked: false,
            showSmoke: false,
          });
          ctx.restore();
        }

        // 3. Bottom Portion (Below Laser Scan Line): GIANT 2D UFO + 2D PENGUIN PILOT!
        if (scanRatio < 1) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(ufoX - 180, scanY, 360, botEdge - scanY + 50);
          ctx.clip();
          drawUfoSpaceshipWithPilot(
            ctx,
            ufoX,
            ufoY,
            ufoTilt,
            now,
            true, // Shocked 2D expression below the scan line!
            subP < 0.09, // Brief impact blink at moment of shot-down
            0,
            {
              scale: ufoScale,
              openHatchRatio: 0,
              spId: activeSpId,
              thrusterBoost: 0.5,
            }
          );
          ctx.restore();
        }

        // 4. Front Half of Wide Holographic Capture Rings
        ctx.save();
        for (let r = 0; r < 3; r++) {
          const ry = ufoY - 52 + r * 48 + Math.sin(now * 0.006 + r) * 5;
          const rx = 128 - r * 8;
          ctx.strokeStyle =
            r % 2 === 0 ? 'rgba(103, 232, 249, 0.68)' : 'rgba(244, 114, 182, 0.55)';
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.ellipse(ufoX, ry, rx, 18, 0, 0, Math.PI);
          ctx.stroke();
        }
        ctx.restore();

        // 5. Wide High-Density Voxel Matrix Scan Beam & Emitter Nodes (Spanning the full Giant UFO width = 276px!)
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

          for (const ex of [ufoX - beamHalfW - 2, ufoX + beamHalfW + 2]) {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(ex - 7, scanY - 7, 14, 14);
            ctx.fillStyle = '#67e8f9';
            ctx.fillRect(ex - 5, scanY - 5, 10, 10);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(ex - 2, scanY - 2, 4, 4);
          }

          const cols = 21;
          for (let k = 0; k < cols; k++) {
            const kx = Math.round(ufoX - 100 + k * 10);
            const wave = Math.sin(now * 0.032 + k * 1.35);
            const ky = Math.round(scanY + wave * 10);
            const pCol =
              k % 4 === 0
                ? '#ffffff'
                : k % 3 === 0
                ? '#facc15'
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
        const isStillScanning = scanRatio < 0.94;
        drawRetroSpeechBubble(
          ctx,
          ufoX - 10,
          Math.max(54, topEdge - 8),
          subP < 0.16
            ? CURRENT_LANG === 'ko'
              ? '콰과광?! 격추당했다!! 우주선째로 포털에 빨려들어가고 있어!!'
              : 'KABOOM?! Shot down!! My whole UFO is pulled into the Pixel Rift!!'
            : isStillScanning
            ? CURRENT_LANG === 'ko'
              ? '어어어?! 우주선이랑 내 몸이 통째로 픽셀로 변하고 있어!!'
              : 'Whoa?! Both my Giant UFO and I are turning into 16-bit pixels!!'
            : CURRENT_LANG === 'ko'
            ? '우와아!! 픽셀 우주선 변신 완료!! 벚꽃 픽셀월드로 불시착한다!!'
            : 'Woohoo!! Pixel UFO complete!! Crash-landing into Pixel World!!',
          subP < 0.16 ? '#fb7185' : isStillScanning ? '#38bdf8' : '#34d399',
          now
        );
        drawPixelScanHudPill(ctx, ufoX, Math.min(488, botEdge + 18), pct);

        drawRetroDialogueBar(
          ctx,
          'SCENE 2 · 💥 격추 & 우주선 통째 픽셀화!',
          CURRENT_LANG === 'ko'
            ? `콰과광—! 격추당한 대형 우주선이 차원 포털에 진입하며 우주선과 펭귄이 통째로 16비트 픽셀로 변신합니다! (${pct}%)`
            : `KABOOM—! Shot down into the dimensional rift, the entire Giant UFO and Penguin Pilot transform into 16-Bit Pixels! (${pct}%)`
        );

        if (scElapsed >= 2900) {
          setIntroScene(2, true);
        }
      }

      // Render Explosion Particles & Floating Score Popups
      for (let i = UFO_GAME.particles.length - 1; i >= 0; i--) {
        const pt = UFO_GAME.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= pt.decay * dt;
        if (pt.alpha <= 0) {
          UFO_GAME.particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = '#090d1a';
        ctx.fillRect(pt.x - pt.sz / 2 - 1, pt.y - pt.sz / 2 - 1, pt.sz + 2, pt.sz + 2);
        ctx.fillStyle = pt.col;
        ctx.fillRect(pt.x - pt.sz / 2, pt.y - pt.sz / 2, pt.sz, pt.sz);
        ctx.restore();
      }

      for (let i = UFO_GAME.popups.length - 1; i >= 0; i--) {
        const pop = UFO_GAME.popups[i];
        pop.y += pop.vy * dt;
        pop.alpha -= 0.024 * dt;
        if (pop.alpha <= 0) {
          UFO_GAME.popups.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, pop.alpha);
        ctx.font = '900 14px "Pretendard", "Malgun Gothic", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#090d1a';
        ctx.fillText(pop.text, pop.x + 2, pop.y + 2);
        ctx.fillStyle = pop.col;
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.restore();
      }

      ctx.restore();
    }

    // ========================================================================
    // SCENE 2 ("3. 💥 불시착 & 환영"):
    //   1) Giant 16-Bit Pixel UFO crash-lands on the Cherry Blossom Stone Promenade (x = 228, y = 408)!
    //   2) ONLY the top glass dome hatch ("우주선 대가리") pops open (openHatchRatio: 0 -> 1) so the lower body is NEVER exposed!
    //   3) 4 Colorful Pixel Penguin Friends on the right welcome the pilot under the sculpted PIXEL PENGUIN arcade title & RPG menu!
    // ========================================================================
    else {
      drawScene2PixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      // 1. Top Arcade Landing Score & Leaderboard Banner (Clickable to open #leaderboard-modal!)
      const finalPts = UFO_GAME.lastFinalScore || UFO_GAME.score || 3450;
      const banW = 580;
      const banH = 32;
      const banX = 480 - banW / 2;
      const banY = 10;
      ctx.save();
      ctx.fillStyle = 'rgba(9, 13, 26, 0.90)';
      ctx.fillRect(banX - 2, banY - 2, banW + 4, banH + 4);
      ctx.strokeStyle = UFO_GAME.hasNft ? '#facc15' : '#67e8f9';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(banX, banY, banW, banH);
      ctx.fillStyle = UFO_GAME.hasNft ? '#fde047' : '#bae6fd';
      ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
        const pilotCode = `P${String(UFO_GAME.pilotTokenId).padStart(4, '0')}`;
        const rankTag = UFO_GAME.lastRank ? ` · RANK #${UFO_GAME.lastRank}` : '';
        ctx.fillText(
          CURRENT_LANG === 'ko'
            ? `🏆 불시착 성공! NFT #${UFO_GAME.pilotTokenId} (${pilotCode}) · ${finalPts.toLocaleString()} PTS${rankTag} 기록 완료!  [랭킹보기 ▶]`
            : `🏆 Crash-Landed! NFT #${UFO_GAME.pilotTokenId} (${pilotCode}) · ${finalPts.toLocaleString()} PTS${rankTag} Recorded!  [Leaderboard ▶]`,
          480,
          banY + banH / 2 + 1
        );
      } else {
        ctx.fillText(
          CURRENT_LANG === 'ko'
            ? `🛸 불시착 성공! 기본 파란 펭귄 (NFT 없음 · 기록 안 남음) · ${finalPts.toLocaleString()} PTS  [전체 랭킹보기 ▶]`
            : `🛸 Crash-Landed! Default Blue Penguin (No NFT · Unrecorded) · ${finalPts.toLocaleString()} PTS  [Leaderboard ▶]`,
          480,
          banY + banH / 2 + 1
        );
      }
      ctx.restore();

      // 2. Sculpted 16-Bit "PIXEL PENGUIN" Arcade Logo & RPG Command Box in Upper Sky
      const titleBounce = Math.floor(now / 480) % 2 === 0 ? 0 : -3;
      const logoTopY = 50 + titleBounce;

      drawArcadePixelWord(ctx, 'PIXEL', 480, logoTopY, 4.5);
      drawGoldenArcadeHeart(ctx, 636, logoTopY + 16, 3.2);
      drawArcadePixelWord(ctx, 'PENGUIN', 480, logoTopY + 46, 4.5);
      drawPixelOutlinedSubtitle(ctx, 'PPENG · 10,000 VERYCHAT PFP', 480, logoTopY + 108);

      const menuW = 332;
      const menuH = 78;
      const menuX = 480 - menuW / 2;
      const menuY = 176;

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
          ? ['START WORLD · 10K 도감도', 'REPLAY GAME · 다시 탈출하기']
          : ['START WORLD · 10K CODEX', 'REPLAY GAME · PLAY AGAIN'];

      menuItems.forEach((mText, idx) => {
        const rowY = menuY + 24 + idx * 30;
        const isSelected = (MOTION_STATE.menuHoverIdx % 2) === idx;
        if (isSelected) {
          ctx.fillStyle = 'rgba(255, 77, 109, 0.22)';
          ctx.fillRect(menuX + 10, rowY - 12, menuW - 20, 24);
          drawPixelHeart(ctx, menuX + 28, rowY, 2.3, '#ff4d6d');
        }
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.font = '900 15px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(mText, menuX + 46, rowY + 1);
      });

      // 3. GIANT 16-BIT PIXEL UFO CRASH-LANDING ON LEFT STONE PROMENADE (x = 228, y = 412)
      //    p = 0.00..0.14: Drops from sky & thuds onto the stone walkway with a bounce!
      //    p = 0.16..0.34: ONLY the Top Glass Dome Hatch ("우주선 대가리") pops open (openHatchRatio: 0 -> 1)!
      //    Lower body stays 100% inside the Pixel UFO hull while the upper-body Pixel Penguin greets the welcoming crew!
      const crashP = Math.min(1, p / 0.14);
      const bounceOffset =
        p >= 0.14 && p < 0.24 ? -Math.abs(Math.sin(((p - 0.14) / 0.10) * Math.PI)) * 18 : 0;
      const openHatchRatio =
        p < 0.16 ? 0 : Math.min(1, (p - 0.16) / 0.18);

      const ufoLandX = 228;
      const ufoGroundY = 418;
      const ufoCurY =
        crashP < 1
          ? Math.round(90 + crashP * crashP * (ufoGroundY - 90))
          : Math.round(ufoGroundY + bounceOffset);
      // Slight cozy crash-landing tilt (+0.04 rad) on the stone promenade
      const ufoCrashTilt = crashP < 1 ? 0.18 : 0.04;

      // Wide stepped pixel ground shadow under the crash-landed Giant Pixel UFO
      drawPixelGroundShadow(ctx, ufoLandX, ufoGroundY + 32, 162, bounceOffset);

      drawPixelUfoSpaceshipWithPilot(ctx, ufoLandX, ufoCurY, ufoCrashTilt, now, {
        scale: 1.42,
        openHatchRatio,
        spId: activeSpId,
        forceBlink: false,
        isShocked: crashP < 1,
        showSmoke: true,
      });

      // 4. 4 Colorful Pixel Penguin Friends on the Right Walking Up & Welcoming the Crash-Landed UFO Pilot!
      const spriteSize = 124;
      const colorfulFriends = [
        { sp: '05', baseX: 432, y: 342, seed: 2, amp: 18, speed: 0.0026 }, // Rose Pink
        { sp: '04', baseX: 544, y: 336, seed: 3, amp: 20, speed: 0.0023 }, // Apricot Orange
        { sp: '09', baseX: 656, y: 342, seed: 4, amp: 18, speed: 0.0027 }, // Mint Glacier
        { sp: '06', baseX: 768, y: 336, seed: 5, amp: 16, speed: 0.0024 }, // Lavender Frost
      ];

      const walkInP = Math.min(1, p / 0.20);
      const renderedFriends = [];

      colorfulFriends.forEach((fr, idx) => {
        const spEntry = ensureSpeciesSprite(fr.sp);
        const strollX = walkInP >= 1 ? Math.sin(now * fr.speed + idx * 1.4) * fr.amp : 0;
        const fx = Math.round(fr.baseX + (1 - walkInP) * 95 + strollX);
        const fy = fr.y;

        drawPixelGroundShadow(ctx, fx + spriteSize / 2, fy + spriteSize - 6, 56, 0);
        // Friends face LEFT (flipX: true) toward the crash-landed Pixel UFO on the left!
        drawAnimatedPixelPenguin(ctx, spEntry, fx, fy, spriteSize, now, {
          seed: fr.seed,
          isWalking: true,
          flipX: true,
        });

        renderedFriends.push({ fx, fy });
      });

      // 5. Sequenced 16-Bit Speech Bubbles (UFO Pilot pops open the top hatch -> Friends welcome him!)
      if (p < 0.44) {
        drawPixelHeart(ctx, ufoLandX + 76, ufoCurY - 68 - ((now * 0.03) % 18), 2.8, '#38bdf8');
        drawRetroSpeechBubble(
          ctx,
          ufoLandX + 24,
          ufoCurY - 94,
          CURRENT_LANG === 'ko'
            ? '푸슈욱—! 콜록콜록.. 우주선 해치 오픈! 여기가 픽셀월드야?!'
            : 'Psssh—! *Cough* UFO Hatch Open! Is this Pixel World?!',
          '#38bdf8',
          now
        );
        drawRetroDialogueBar(
          ctx,
          'SCENE 3 · 💥 픽셀 우주선 불시착 & 해치 오픈!',
          CURRENT_LANG === 'ko'
            ? '"푸슈욱—!" 벚꽃 강변에 불시착한 픽셀 우주선의 윗부분 유리 해치(대가리)만 열리며 상반신 펭귄이 고개를 내밉니다!'
            : '"Psssh—!" Only the top glass dome hatch of the crash-landed Pixel UFO pops open as our Penguin Pilot pokes his head out!'
        );
      } else {
        const speaker1 = renderedFriends[0] || { fx: 432, fy: 342 };
        drawPixelHeart(ctx, 512, 318 - ((now * 0.03) % 20), 2.8, '#ff4d6d');
        drawPixelHeart(ctx, 684, 314 - ((now * 0.03) % 20), 2.8, '#fbbf24');
        drawRetroSpeechBubble(
          ctx,
          speaker1.fx + spriteSize / 2 + 18,
          speaker1.fy - 8,
          CURRENT_LANG === 'ko'
            ? 'ㅋㅋㅋ 우주선 타고 불시착한 대원 환영해!! 여긴 픽셀 천국이야!'
            : 'Haha welcome UFO Pilot!! This is the 10,000 Pixel Penguin Paradise!',
          '#ff4d6d',
          now
        );
        drawRetroDialogueBar(
          ctx,
          'SCENE 3 · 🐧 픽셀 펭귄 친구들 총출동 환영식',
          CURRENT_LANG === 'ko'
            ? '"ㅋㅋㅋ 우주선 타고 불시착한 대원 어서와!!" 알록달록 픽셀 펭귄 친구들이 몰려와 해치가 열린 우주선 주변에서 격하게 환영합니다!'
            : '"Haha welcome UFO Pilot!!" Colorful Pixel Penguin friends gather around the open-hatch Pixel UFO to celebrate your arrival!'
        );
      }

      // Bottom-Left Retro Arcade Corner Tag
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

    // 16-Bit Pixel Mosaic Wipe Transition at the start of each scene
    drawRetroSceneWipe(ctx, elapsed);

    requestAnimationFrame(renderIntroCutscene);
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
  setIntroScene(MOTION_STATE.sceneIdx, false);
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

  // Preset strip: Featured generative penguins (7x2 = 14 Grid)
  const presets = CURATED_BEAUTY_14.map((c) => c.edition);
  const strip = document.getElementById('pfp-preset-strip');
  if (strip) {
    strip.innerHTML = presets
      .map((num, idx) => {
        const id = `P${String(num).padStart(4, '0')}`;
        const src = num <= 10 ? `/assets/specials/${num}_fast.gif?v=v322` : `/img/${id}.png?v=v322`;
        return `<button type="button" class="pfp-thumb-btn ${idx === 0 ? 'active' : ''}" data-num="${num}" title="#${num}">
          <img src="${src}" alt="#${num}" class="pixelated" loading="lazy" />
        </button>`;
      })
      .join('');

    strip.querySelectorAll('.pfp-thumb-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const n = Number(btn.dataset.num);
        loadPfpPreview(n);
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
        <img src="${sp.fast_gif_url}" alt="${escapeHtml(sp.title)}" class="pixelated" loading="lazy" />
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
    if (activeCount > 0) {
      span.textContent = CURRENT_LANG === 'ko' ? `파츠 필터 (${activeCount}개 적용)` : `Filters (${activeCount})`;
      toggleBtn.classList.add('active-toggle');
    } else {
      span.textContent = CURRENT_LANG === 'ko' ? '파츠 필터 (9종)' : 'Trait Filters (9)';
      toggleBtn.classList.remove('active-toggle');
    }
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
        <select id="filter-cat-${cat}" data-cat="${cat}" class="filter-select exp-cat-select" style="padding:7px 8px; font-size:12px;">
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
          ? `총 <strong>${data.total.toLocaleString()}</strong>마리 검색됨 (페이지 ${data.page} / ${TOTAL_PAGES})`
          : `Showing <strong>${data.total.toLocaleString()}</strong> Penguins (Page ${data.page} of ${TOTAL_PAGES})`;
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
            <img src="${item.image_url}" alt="${escapeHtml(item.name)}" class="pixelated" loading="lazy" />
            <div class="card-top-badges">
              <span class="tier-pill tier-${item.tier}">${item.tier}</span>
              <span class="rank-pill">Rank #${item.rarity_rank}</span>
            </div>
          </div>
          <div class="nft-card-title" data-ko="${escapeHtml(subKo)}" data-en="${escapeHtml(subEn)}">${escapeHtml(subtitle)}</div>
          <div class="nft-card-footer">
            <span class="score-tag" style="font-weight:800; color:#e2e8f0;">${item.id}</span>
            <span class="score-tag" style="color:var(--accent-cyan); font-weight:800;">${Number(item.rarity_score).toLocaleString()} pts</span>
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
      <div class="trait-b-score" style="display:flex; justify-content:space-between; align-items:center;">
        <span>${r.count.toLocaleString()}마리 (${r.pct}%)</span>
        <strong style="color:var(--accent-cyan);">+${Number(r.score).toLocaleString()} pts</strong>
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

// Token Detail Inspector Modal (VeryPunks rarity.tools Reference)
async function openTokenModal(tokenNum) {
  const modal = document.getElementById('token-modal');
  const body = document.getElementById('modal-detail-body');
  if (!modal || !body) return;

  modal.classList.add('open');
  body.innerHTML = `<div style="grid-column:1/-1; padding:40px; text-align:center;">Loading Token #${tokenNum}...</div>`;

  try {
    const res = await fetch(`/api/token/${tokenNum}`);
    const tok = await res.json();
    const isSpecial = tok.edition <= 10;

    const traitsHtml = tok.trait_breakdown
      .map(
        (b) => `
      <div class="trait-b-item" style="cursor:pointer;" onclick="closeTokenModal(); filterExplorerByTrait('${escapeHtml(b.trait_type)}', '${escapeHtml(b.value).replace(/'/g, "\\'")}')">
        <div class="trait-b-cat">${escapeHtml(b.trait_type)}</div>
        <div class="trait-b-val">${escapeHtml(b.value)}</div>
        <div class="trait-b-score" style="display:flex; justify-content:space-between; align-items:center;">
          <span>${b.count.toLocaleString()}마리 (${b.pct}%)</span>
          <strong style="color:var(--accent-cyan);">+${Number(b.score).toLocaleString()} pts</strong>
        </div>
      </div>
    `
      )
      .join('');

    const downloadBtnHtml = isSpecial
      ? `<a href="${tok.full_image_url}" download="${tok.id}.gif" class="btn-primary" style="text-decoration:none; width:100%; justify-content:center;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span data-ko="1254×1254 원본 이미지 다운로드" data-en="Download 1254×1254 Original GIF">${CURRENT_LANG === 'ko' ? '1254×1254 원본 이미지 다운로드' : 'Download 1254×1254 Original GIF'}</span>
         </a>`
      : `<button type="button" class="btn-primary" style="width:100%; justify-content:center;" onclick="downloadHighRes3072('${tok.id}', '${tok.pixel_48_url}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span data-ko="3072×3072 고해상도 PNG 다운로드 (64× NEAREST)" data-en="Download 3072×3072 High-Res PNG (64× NEAREST)">${CURRENT_LANG === 'ko' ? '3072×3072 고해상도 PNG 다운로드 (64× NEAREST)' : 'Download 3072×3072 High-Res PNG (64× NEAREST)'}</span>
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
            <button type="button" class="btn-secondary" style="justify-content:center; padding:9px;" onclick="loadPfpPreview(${tok.edition}); closeTokenModal(); scrollToSection('top');" data-ko="PFP 시뮬레이터 장착" data-en="Try in PFP Simulator">
              ${CURRENT_LANG === 'ko' ? 'PFP 시뮬레이터 장착' : 'Try in PFP Simulator'}
            </button>
            <a href="/api/metadata/${tok.id}.json" target="_blank" rel="noopener" class="btn-secondary" style="text-decoration:none; justify-content:center; padding:9px;" data-ko="{ } 온체인 JSON 보기" data-en="{ } View On-Chain JSON">
              ${CURRENT_LANG === 'ko' ? '{ } 온체인 JSON 보기' : '{ } View On-Chain JSON'}
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

        <h2 id="modal-token-title" style="font-size:22px; font-weight:900; margin-bottom:10px;" data-ko="${escapeHtml(titleKo)}" data-en="${escapeHtml(titleEn)}">${escapeHtml(titleText)}</h2>

        <div class="spec-rows-stack" style="margin-bottom:12px;">
          <div class="spec-row">
            <span class="spec-label" data-ko="번호 (Token ID)" data-en="Token ID">${CURRENT_LANG === 'ko' ? '번호 (Token ID)' : 'Token ID'}</span>
            <span class="spec-value">${tok.id} (#${tok.edition})</span>
          </div>
          <div class="spec-row">
            <span class="spec-label" data-ko="희귀도 순위 · 점수 (rarity.tools)" data-en="Rarity Rank · Score (rarity.tools)">${CURRENT_LANG === 'ko' ? '희귀도 순위 · 점수 (rarity.tools)' : 'Rarity Rank · Score (rarity.tools)'}</span>
            <span class="spec-value" style="color:var(--accent-cyan);">Rank #${tok.rarity_rank} (${Number(tok.rarity_score).toLocaleString()} pts)</span>
          </div>
          <div class="spec-row">
            <span class="spec-label" data-ko="장착 파츠 수 (특성 개수 점수)" data-en="Active Traits (Trait Count Score)">${CURRENT_LANG === 'ko' ? '장착 파츠 수 (특성 개수 점수)' : 'Active Traits (Trait Count Score)'}</span>
            <span class="spec-value">${tok.active_trait_stat.active_count} (${tok.active_trait_stat.pct}% · +${Number(tok.active_trait_stat.score).toLocaleString()} pts)</span>
          </div>
          ${
            isSpecial && tok.genesis_bonus > 0
              ? `<div class="spec-row">
            <span class="spec-label" data-ko="Genesis 1-of-1 Origin 가산점 (#0~#10 순번)" data-en="Genesis 1-of-1 Origin Bonus (#0~#10)">${CURRENT_LANG === 'ko' ? 'Genesis 1-of-1 Origin 가산점 (#0~#10 순번)' : 'Genesis 1-of-1 Origin Bonus (#0~#10)'}</span>
            <span class="spec-value" style="color:var(--tier-genesis);">+${Number(tok.genesis_bonus).toLocaleString()} pts</span>
          </div>`
              : ''
          }
        </div>

        <h4 style="font-size:13.5px; font-weight:800; margin-bottom:6px;" data-ko="파츠별 rarity.tools 점수 (전체 수 10,000 ÷ 보유 수)" data-en="Trait Breakdown · rarity.tools Score (10,000 ÷ Count)">${CURRENT_LANG === 'ko' ? '파츠별 rarity.tools 점수 (전체 수 10,000 ÷ 보유 수)' : 'Trait Breakdown · rarity.tools Score (10,000 ÷ Count)'}</h4>
        <div class="trait-breakdown-list">
          ${traitsHtml}
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

  // Navigation Tabs
  document.querySelectorAll('.market-tab').forEach((tab) => {
    tab.addEventListener('click', () => scrollToSection(tab.dataset.target));
  });

  // Ranking Page Search & Refresh
  document.getElementById('btn-refresh-ranking-page')?.addEventListener('click', () => {
    fetchAndRenderRankingPage();
  });
  document.getElementById('ranking-search-input')?.addEventListener('input', () => {
    renderRankingPageList();
  });

  // Mobile 9-Category Filter Drawer Toggle
  document.getElementById('btn-toggle-trait-filters')?.addEventListener('click', () => {
    const gridEl = document.getElementById('exp-trait-filters');
    if (gridEl) {
      gridEl.classList.toggle('mobile-open');
    }
  });

  // Update official website display
  const canonicalUrl = 'https://ppeng.verycloud.io';
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
    fetchExplorerTokens();
    fetchAndRenderRankingPage();
  } catch (err) {
    console.error('Failed to initialize config:', err);
  }
});
