/**
 * PIXEL PENGUIN (Pixel Penguin 10K · Symbol: PPENG) — Frontend Application & 48x48 Pixel Motion Engine
 * Issued by @happy Ahndoge on VERY Mainnet (4613)
 */

let APP_CONFIG = null;
let CURRENT_LANG = 'ko';
let CURRENT_PAGE = 1;
let TOTAL_PAGES = 1;
let CURRENT_PFP_TOKEN = 4442;
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
  Hat: '모자 (Hat)',
  Prop: '종합 소품 (Prop)',
};

// Featured Generative Penguins from our 10,000 Collection
const CURATED_BEAUTY_14 = [
  {
    edition: 4442,
    id: 'P04442',
    isSpecial: false,
    tier: 'Common',
    rank: 9811,
    score: '87.1',
    shortKo: '선글라스 펭귄',
    shortEn: 'Pixel Shades',
    titleKo: '#4442 선글라스 펭귄 (P04442)',
    titleEn: '#4442 Pixel Shades Penguin',
    themeKo: 'Common · Glacier Sky & Pixel Shades',
    themeEn: 'Common · Glacier Sky & Pixel Shades',
    noteKo: '파란 하늘에 도트 선글라스 낀 정감 가는 자식입니다.',
    noteEn: 'Blue sky and pixel shades.',
  },
  {
    edition: 963,
    id: 'P00963',
    isSpecial: false,
    tier: 'Legendary',
    rank: 12,
    score: '1,914.93',
    shortKo: '여우 잠옷 펭귄',
    shortEn: 'Fox Onesie',
    titleKo: '#963 여우 잠옷 입고 윙크하는 자식 (Fox Onesie)',
    titleEn: '#963 Fox Onesie Penguin (Legendary)',
    themeKo: 'Legendary · Fox Onesie & Wink',
    themeEn: 'Legendary · Fox Onesie & Wink',
    noteKo:
      '펭귄인데 여우 후드 잠옷(Fox Onesie) 뒤집어쓰고 윙크하는 귀여운 자식입니다. 기본 도트 펭귄들 중에서는 희귀도 점수가 제일 높게 나왔는데, 역시나 뭐 주는 건 없습니다.',
    noteEn:
      'A penguin wearing a fox onesie and winking. Highest rarity score among the static 48×48 penguins, though it still gives zero perks.',
  },
  {
    edition: 6522,
    id: 'P06522',
    isSpecial: false,
    tier: 'Uncommon',
    rank: 15,
    score: '1,839.98',
    shortKo: '게코 후드 펭귄',
    shortEn: 'Gecko Onesie',
    titleKo: '#6522 도마뱀 후드 뒤집어쓴 자식 (Gecko Onesie)',
    titleEn: '#6522 Dreamglow Gecko Onesie (Uncommon)',
    themeKo: 'Uncommon · Dreamglow & Gecko Onesie',
    themeEn: 'Uncommon · Dreamglow & Gecko Onesie',
    noteKo:
      '등급은 Uncommon인데 희귀한 스킨이랑 초록 도마뱀 후드가 겹쳐서 점수가 높게 나온 특이한 자식입니다. 눈웃음 짓고 있어서 프사로 쓰기 딱 좋습니다.',
    noteEn:
      'Labeled Uncommon tier but scored high thanks to its Dreamglow skin and Gecko Onesie hood. Smiling eyes make it a great PFP.',
  },
  {
    edition: 43,
    id: 'P00043',
    isSpecial: false,
    tier: 'Epic',
    rank: 187,
    score: '517.67',
    shortKo: '꽃화관 빙어 낚시',
    shortEn: 'Floral Angler',
    titleKo: '#43 꽃화관 쓰고 빙어 낚는 자식 (Floral Wreath Angler)',
    titleEn: '#43 Floral Wreath Ice Angler (Epic)',
    themeKo: 'Epic · Floral Wreath & Arctic Smelt',
    themeEn: 'Epic · Floral Wreath & Arctic Smelt',
    noteKo:
      '머리에 꽃화관 얹고 낚싯대에 빙어까지 물고 있는 알짜배기 자식입니다. 꼭 1등짜리 아니어도 이렇게 조합 이쁘게 뽑힌 애들이 수두룩합니다.',
    noteEn:
      'Wearing a floral wreath while catching an arctic smelt. Proof that you do not need a #1 rank to get an adorable combination.',
  },
  {
    edition: 500,
    id: 'P00500',
    isSpecial: false,
    tier: 'Mythic',
    rank: 46,
    score: '932.31',
    shortKo: '크리스탈 나이트',
    shortEn: 'Crystal Knight',
    titleKo: '#500 투구 쓰고 비눗방울 부는 자식 (Crystal Knight)',
    titleEn: '#500 Crystal Knight Helmet & Bubble Pipe',
    themeKo: 'Mythic · Crystal Helmet & Bubble Pipe',
    themeEn: 'Mythic · Crystal Helmet & Bubble Pipe',
    noteKo:
      '비장하게 기사 투구랑 지팡이 들어놓고 입에는 조개 비눗방울 파이프 물고 있는 하찮고 귀여운 자식입니다.',
    noteEn:
      'Wearing a serious knight helmet and frost staff while blowing bubbles from a seashell pipe—goofy and cute.',
  },
  {
    edition: 75,
    id: 'P00075',
    isSpecial: false,
    tier: 'Legendary',
    rank: 162,
    score: '550.29',
    shortKo: '빙하 왕관 과잠',
    shortEn: 'Glacier Varsity',
    titleKo: '#75 용암 동굴에서 과잠 입은 자식 (Glacier Crown)',
    titleEn: '#75 Glacier Crown & Varsity Jacket',
    themeKo: 'Legendary · Glacier Crown & Varsity Jacket',
    themeEn: 'Legendary · Glacier Crown & Varsity Jacket',
    noteKo:
      '뜨거운 용암 동굴 배경에 얼음 왕관 쓰고 파란 과잠(Varsity Jacket) 입은 청개구리 같은 자식입니다.',
    noteEn:
      'Wearing an ice crown and blue varsity jacket inside a hot lava cave—a delightfully contradictory penguin.',
  },
  {
    edition: 192,
    id: 'P00192',
    isSpecial: false,
    tier: 'Rare',
    rank: 7788,
    score: '146.63',
    shortKo: '군밤장수 털모자',
    shortEn: 'Polar Ushanka',
    titleKo: '#192 민트 배경에 털모자 쓴 초코 펭귄 (Polar Ushanka)',
    titleEn: '#192 Polar Ushanka & Cocoa Penguin (Rare)',
    themeKo: 'Rare · Kelp Mint · Polar Ushanka',
    themeEn: 'Rare · Kelp Mint · Polar Ushanka',
    noteKo:
      '희귀도 순위는 7,788등이지만 민트색 배경에 코코아 색 깃털이랑 털모자 조합이 아주 기가 막히게 귀여운 자식입니다.',
    noteEn:
      'Ranked #7,788, but the mint background, cocoa feathers, and plush ushanka hat make it ridiculously cute.',
  },
  {
    edition: 21,
    id: 'P00021',
    isSpecial: false,
    tier: 'Rare',
    rank: 6885,
    score: '162.54',
    shortKo: '핑크 비니 빙어',
    shortEn: 'Pink Smelt Catch',
    titleKo: '#21 핑크 배경에 초록 비니 쓰고 빙어 문 자식',
    titleEn: '#21 Orchid Pink & Green Beanie Smelt Catcher',
    themeKo: 'Rare · Orchid Pink · Green Beanie',
    themeEn: 'Rare · Orchid Pink · Green Beanie',
    noteKo:
      '분홍색 배경에 초록 비니 쓰고 입에 빙어 한 마리 야무지게 물고 있는 귀한 자식입니다. 프사로 해두면 볼 때마다 기분 좋아집니다.',
    noteEn:
      'Pink penguin in a green beanie holding a freshly caught smelt in its beak—guaranteed to brighten up your profile.',
  },
  {
    edition: 25,
    id: 'P00025',
    isSpecial: false,
    tier: 'Epic',
    rank: 2785,
    score: '252.41',
    shortKo: '안전모 세일러',
    shortEn: 'Hardhat Sailor',
    titleKo: '#25 박쥐 날개 달고 노란 안전모 쓴 자식 (Hardhat Sailor)',
    titleEn: '#25 Bat Wings & Sailor Collar Hardhat (Epic)',
    themeKo: 'Epic · Bat Wings & Hardhat',
    themeEn: 'Epic · Bat Wings & Hardhat',
    noteKo:
      '세일러 카라에 박쥐 날개 달고 머리엔 공사장 노란 안전모에 밀짚까지 물고 있는 종잡을 수 없는 귀한 자식입니다.',
    noteEn:
      'Rocking a sailor collar, bat wings, a yellow construction hardhat, and a wheat straw—chaotic B-grade charm.',
  },
  {
    edition: 4276,
    id: 'P04276',
    isSpecial: false,
    tier: 'Common',
    rank: 310,
    score: '455.85',
    shortKo: '매화 로브 윙크',
    shortEn: 'Plum Robe Wink',
    titleKo: '#4276 프리즘 후광에 비눗방울 부는 자식 (Plum Robe)',
    titleEn: '#4276 Glacier Prism & Bubble Pipe Wink (Common)',
    themeKo: 'Common · Glacier Prism & Wink',
    themeEn: 'Common · Glacier Prism & Wink',
    noteKo:
      '등급표 이름은 Common인데 프리즘 후광이랑 매화 로브가 겹쳐서 순위는 310등으로 껑충 뛴 자식입니다. 어차피 등급 달라도 주는 건 똑같이 없습니다.',
    noteEn:
      'Tagged Common tier yet ranked #310 thanks to its Glacier Prism aura and Plum Blossom robe. Tier labels really do not matter here.',
  },
  {
    edition: 88,
    id: 'P00088',
    isSpecial: false,
    tier: 'Common',
    rank: 6044,
    score: '177.49',
    shortKo: '초록 비니 과잠',
    shortEn: 'Beanie Varsity',
    titleKo: '#88 초록 비니에 파이프 물고 과잠 입은 자식',
    titleEn: '#88 Green Beanie & Blue Varsity Jacket',
    themeKo: 'Common · Blue Varsity & Briar Pipe',
    themeEn: 'Common · Blue Varsity & Briar Pipe',
    noteKo:
      '핑크색 배경에 파란 과잠 입고 초록 비니 쓴 복학생 느낌의 정감 가는 자식입니다. 프사로 달아두기 아주 무난하고 이쁩니다.',
    noteEn:
      'Midnight penguin in a blue varsity jacket and green beanie with a briar pipe—chill campus vibe for your PFP.',
  },
  {
    edition: 108,
    id: 'P00108',
    isSpecial: false,
    tier: 'Common',
    rank: 7545,
    score: '150.71',
    shortKo: '파란 캡모자 후드',
    shortEn: 'Blue Cap Hoodie',
    titleKo: '#108 회색 후드티에 파란 캡모자 쓴 자식',
    titleEn: '#108 Grey Hoodie & Blue Cap Penguin',
    themeKo: 'Common · Grey Hoodie & Blue Cap',
    themeEn: 'Common · Grey Hoodie & Blue Cap',
    noteKo:
      '살구색 깃털에 회색 후드티 입고 파란 모자 눌러쓴 뒤 입에 밀짚 하나 물고 있는 꾸안꾸 스타일 자식입니다.',
    noteEn:
      'Apricot penguin in a casual grey hoodie and blue cap chewing on a wheat straw. Effortlessly clean PFP.',
  },
  {
    edition: 312,
    id: 'P00312',
    isSpecial: false,
    tier: 'Common',
    rank: 5671,
    score: '184.47',
    shortKo: '하와이안 헤드폰',
    shortEn: 'Hawaiian Beats',
    titleKo: '#312 빨간 하와이안 셔츠에 헤드폰 낀 자식',
    titleEn: '#312 Red Hawaiian Shirt & Purple Headphones',
    themeKo: 'Common · Hawaiian Shirt & Headphones',
    themeEn: 'Common · Hawaiian Shirt & Headphones',
    noteKo:
      '추운 남극 출신이면서 빨간 하와이안 셔츠 입고 선글라스에 보라색 헤드폰까지 낀 흥 넘치는 자식입니다.',
    noteEn:
      'An Antarctic penguin wearing a red Hawaiian shirt, blue wayfarer sunglasses, and purple headphones.',
  },
  {
    edition: 777,
    id: 'P00777',
    isSpecial: false,
    tier: 'Common',
    rank: 4419,
    score: '209.51',
    shortKo: '보안관 모자 777',
    shortEn: 'Sheriff #777',
    titleKo: '#777 민트 폴로셔츠에 보안관 모자 쓴 럭키 자식',
    titleEn: '#777 Sheriff Hat & Mint Polo Penguin',
    themeKo: 'Common · Token #777 · Sheriff Hat',
    themeEn: 'Common · Token #777 · Sheriff Hat',
    noteKo:
      '번호가 무려 777번인 초코 펭귄입니다. 보안관 모자 쓰고 민트색 폴로셔츠 입었는데, 777번이라고 잭팟 터지는 기능 같은 건 없습니다.',
    noteEn:
      'Lucky edition #777 wearing a sheriff hat and mint polo shirt—though hitting #777 still pays out zero jackpot.',
  },
];

// Additional Penguins for the 28-Token Dual-Row Infinite Pixel Parade (All 48x48 Generative Penguins)
const PARADE_ROW_1_ITEMS = [
  { edition: 4442, labelKo: '선글라스 펭귄', labelEn: 'Pixel Shades Penguin', sub: 'Pixel Shades · #4442' },
  { edition: 963, labelKo: '여우 잠옷 펭귄', labelEn: 'Fox Onesie Penguin', sub: 'Legendary · #963' },
  { edition: 6522, labelKo: '도마뱀 후드 펭귄', labelEn: 'Gecko Onesie Penguin', sub: 'Uncommon · #6522' },
  { edition: 43, labelKo: '꽃화관 빙어 낚시', labelEn: 'Floral Wreath Angler', sub: 'Epic · #43' },
  { edition: 500, labelKo: '크리스탈 나이트', labelEn: 'Crystal Knight', sub: 'Mythic · #500' },
  { edition: 75, labelKo: '빙하 왕관 과잠', labelEn: 'Glacier Varsity', sub: 'Legendary · #75' },
  { edition: 192, labelKo: '군밤장수 털모자', labelEn: 'Polar Ushanka', sub: 'Rare · #192' },
  { edition: 21, labelKo: '핑크 비니 빙어', labelEn: 'Pink Smelt Catcher', sub: 'Rare · #21' },
  { edition: 25, labelKo: '안전모 세일러', labelEn: 'Hardhat Sailor', sub: 'Epic · #25' },
  { edition: 4276, labelKo: '매화 로브 윙크', labelEn: 'Plum Robe Wink', sub: 'Common · #4276' },
  { edition: 88, labelKo: '초록 비니 과잠', labelEn: 'Beanie Varsity', sub: 'Common · #88' },
  { edition: 108, labelKo: '파란 캡모자 후드', labelEn: 'Blue Cap Hoodie', sub: 'Common · #108' },
  { edition: 312, labelKo: '하와이안 헤드폰', labelEn: 'Hawaiian Headphones', sub: 'Common · #312' },
  { edition: 777, labelKo: '보안관 모자 777', labelEn: 'Sheriff Hat #777', sub: 'Common · #777' },
];

const PARADE_ROW_2_ITEMS = [
  { edition: 12, labelKo: '픽셀 펭귄 #12', labelEn: 'Pixel Penguin #12', sub: 'Generative · #12' },
  { edition: 33, labelKo: '픽셀 펭귄 #33', labelEn: 'Pixel Penguin #33', sub: 'Generative · #33' },
  { edition: 55, labelKo: '픽셀 펭귄 #55', labelEn: 'Pixel Penguin #55', sub: 'Generative · #55' },
  { edition: 100, labelKo: '픽셀 펭귄 #100', labelEn: 'Pixel Penguin #100', sub: 'Generative · #100' },
  { edition: 256, labelKo: '픽셀 펭귄 #256', labelEn: 'Pixel Penguin #256', sub: 'Generative · #256' },
  { edition: 365, labelKo: '픽셀 펭귄 #365', labelEn: 'Pixel Penguin #365', sub: 'Generative · #365' },
  { edition: 512, labelKo: '픽셀 펭귄 #512', labelEn: 'Pixel Penguin #512', sub: 'Generative · #512' },
  { edition: 1000, labelKo: '픽셀 펭귄 #1000', labelEn: 'Pixel Penguin #1000', sub: 'Generative · #1000' },
  { edition: 1024, labelKo: '픽셀 펭귄 #1024', labelEn: 'Pixel Penguin #1024', sub: 'Generative · #1024' },
  { edition: 2026, labelKo: '픽셀 펭귄 #2026', labelEn: 'Pixel Penguin #2026', sub: 'Generative · #2026' },
  { edition: 3333, labelKo: '픽셀 펭귄 #3333', labelEn: 'Pixel Penguin #3333', sub: 'Generative · #3333' },
  { edition: 5555, labelKo: '픽셀 펭귄 #5555', labelEn: 'Pixel Penguin #5555', sub: 'Generative · #5555' },
  { edition: 8888, labelKo: '픽셀 펭귄 #8888', labelEn: 'Pixel Penguin #8888', sub: 'Generative · #8888' },
  { edition: 10000, labelKo: '픽셀 펭귄 #10000', labelEn: 'Pixel Penguin #10000', sub: 'Generative · #10000' },
];

function scrollToSection(id) {
  let tabKey = 'tab-intro';
  if (id === 'tab-codex' || id === 'sec-explorer' || id === 'sec-traits' || id === 'sec-provenance') {
    tabKey = 'tab-codex';
  } else if (id === 'tab-notices' || id === 'sec-notices') {
    tabKey = 'tab-notices';
  }

  const pageMap = {
    'tab-intro': 'tab-page-intro',
    'tab-codex': 'tab-page-codex',
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

  if (id === 'tab-intro' || id === 'tab-codex' || id === 'tab-notices' || id === 'top') {
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
// 2. RETRO 16-BIT PIXEL GAME INTRO CUTSCENE ENGINE (#pixel-stage-canvas 960x540)
//    Scene 0: Smooth 2D Penguin runs, trips & falls into a glowing pit (구덩이)
//    Scene 1: Falling through warp tunnel -> transforms into 48x48 Pixel Penguin!
//    Scene 2: Lands in Pixel World & greets pixel penguin friends (#963, #6522, #43...)
//    Scene 3: Retro 16-bit Game Title Screen (PIXEL PENGUIN / START PIXEL WORLD)
// ============================================================================
const SCENE_DURATIONS = [4600, 4400, 5200, 5400]; // ms per scene (total 19.6s trailer)

const MOTION_STATE = {
  activeIdx: 0,
  sceneIdx: 0, // 0: 2D Run & Pit, 1: Transform, 2: Greet Friends, 3: Title Screen
  autoPlay: true,
  sceneStartTime: performance.now(),
  sprites: new Map(), // edition -> { rawImg, cutoutCanvas }
  menuHoverIdx: 0,
};

// Remove outer solid background from 48x48 PNG via corner flood-fill so penguins stand cleanly on the pixel grass
function createCutoutSprite(img) {
  const w = 48;
  const h = 48;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const visited = new Uint8Array(w * h);
  const queue = [];

  const pushSeed = (sx, sy) => {
    const idx = sy * w + sx;
    if (!visited[idx]) {
      visited[idx] = 1;
      queue.push(idx);
    }
  };

  // Seed along top, left, and right edges using each edge pixel's neighbor similarity
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  for (let x = 0; x < w; x++) pushSeed(x, 0);
  for (let y = 0; y < h - 4; y++) {
    pushSeed(0, y);
    pushSeed(w - 1, y);
  }

  while (queue.length > 0) {
    const curr = queue.pop();
    const cx = curr % w;
    const cy = (curr / w) | 0;
    const p = curr * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    const diffCorner = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
    if (diffCorner <= 48) {
      data[p + 3] = 0; // make background transparent
      const neighbors = [
        [cx - 1, cy],
        [cx + 1, cy],
        [cx, cy - 1],
        [cx, cy + 1],
      ];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nIdx = ny * w + nx;
          if (!visited[nIdx]) {
            const np = nIdx * 4;
            const stepDiff =
              Math.abs(data[np] - r) +
              Math.abs(data[np + 1] - g) +
              Math.abs(data[np + 2] - b);
            const totalDiff =
              Math.abs(data[np] - bgR) +
              Math.abs(data[np + 1] - bgG) +
              Math.abs(data[np + 2] - bgB);
            if (stepDiff <= 24 && totalDiff <= 48) {
              visited[nIdx] = 1;
              queue.push(nIdx);
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return c;
}

function ensurePenguinSprite(edition) {
  const ed = Number(edition);
  if (MOTION_STATE.sprites.has(ed)) {
    return MOTION_STATE.sprites.get(ed);
  }
  const entry = { rawImg: null, cutoutCanvas: null, loaded: false };
  MOTION_STATE.sprites.set(ed, entry);

  const id = `P${String(ed).padStart(5, '0')}`;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    entry.rawImg = img;
    entry.cutoutCanvas = createCutoutSprite(img);
    entry.loaded = true;
  };
  img.src = `/img/${id}.png`;
  return entry;
}

function setIntroScene(sceneIdx, resetTimer = true) {
  MOTION_STATE.sceneIdx = ((sceneIdx % 4) + 4) % 4;
  if (resetTimer) {
    MOTION_STATE.sceneStartTime = performance.now();
  }
  document.querySelectorAll('.motion-mode-btn[data-scene]').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.scene) === MOTION_STATE.sceneIdx);
  });

  const labelEl = document.getElementById('motion-hud-mode-label');
  if (labelEl) {
    const labelsKo = [
      'SCENE 1/4 · 일반 2D 펭귄이 신나게 달리다가 구덩이에 빠지는 중...',
      'SCENE 2/4 · 구덩이 속 픽셀 터널 추락 → 48×48 도트 펭귄으로 변신!',
      'SCENE 3/4 · 픽셀 월드 도착! 먼저 와 있던 픽셀 펭귄 친구들과 인사 나누기',
      'SCENE 4/4 · PIXEL PENGUIN WORLD 시작 타이틀 화면 (화면을 클릭해보세요)',
    ];
    const labelsEn = [
      'SCENE 1/4 · Regular 2D Penguin running & tumbling into the Pit...',
      'SCENE 2/4 · Falling through the Pixel Tunnel -> 48×48 Pixel Transformation!',
      'SCENE 3/4 · Arrived in Pixel World! Greeting Pixel Penguin Friends',
      'SCENE 4/4 · PIXEL PENGUIN WORLD Title Screen (Click to interact)',
    ];
    labelEl.textContent =
      CURRENT_LANG === 'ko' ? labelsKo[MOTION_STATE.sceneIdx] : labelsEn[MOTION_STATE.sceneIdx];
  }
}

// Select Hero Penguin for the Intro Trailer
async function selectMotionPenguin(editionOrItem, userInitiated = true) {
  let idx = CURATED_BEAUTY_14.findIndex((c) => c.edition === Number(editionOrItem));
  let item = idx !== -1 ? CURATED_BEAUTY_14[idx] : CURATED_BEAUTY_14[0];
  if (idx === -1) idx = 0;

  MOTION_STATE.activeIdx = idx;
  ensurePenguinSprite(item.edition);

  document.querySelectorAll('.dock-penguin-btn').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.edition) === item.edition);
  });

  const titleEl = document.getElementById('spot-title');
  if (titleEl) {
    titleEl.textContent = CURRENT_LANG === 'ko' ? item.titleKo : item.titleEn;
  }

  const hudCoords = document.getElementById('motion-hud-coords');
  if (hudCoords) {
    hudCoords.textContent = `HERO: #${item.edition} (${item.id}) · CLICK SCREEN TO INTERACT`;
  }

  const nextBtn = document.getElementById('btn-motion-next');
  if (nextBtn) {
    const span = nextBtn.querySelector('span');
    if (span) {
      span.textContent =
        CURRENT_LANG === 'ko'
          ? `주인공 펭귄 바꾸기 (현재 #${item.edition} → 다음)`
          : `Switch Hero Penguin (#${item.edition} → Next)`;
    }
  }

  if (userInitiated) {
    loadPfpPreview(item.edition);
  }
}

// Helper: Draw a Smooth 2D Vector Cartoon Penguin (for Scene 0 & early Scene 1 before pixelation!)
function drawSmooth2DPenguin(ctx, cx, cy, scale, angleRad, runPhase, isShocked) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.scale(scale, scale);

  const legSwing = Math.sin(runPhase) * 14;
  const wingFlap = Math.cos(runPhase * 1.3) * 18;

  // Shadow if not falling
  // Left & Right Webbed Feet (Smooth orange)
  ctx.fillStyle = '#fb923c';
  ctx.beginPath();
  ctx.ellipse(-12 + legSwing, 42, 13, 6, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(12 - legSwing, 42, 13, 6, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Back Flipper
  ctx.save();
  ctx.translate(22, -2);
  ctx.rotate((isShocked ? -0.9 : -0.35) + (wingFlap * Math.PI) / 180);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, 12, 8, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Smooth Chubby 2D Body
  const bodyGrad = ctx.createLinearGradient(0, -48, 0, 42);
  bodyGrad.addColorStop(0, '#334155');
  bodyGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#090d16';
  ctx.stroke();

  // Smooth White Belly
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(4, 6, 23, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute Red Scarf (2D Vector)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.ellipse(2, -14, 28, 7, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(-24, -14, 11, 24, 5);
  ctx.fill();

  // Rosy Cheeks
  ctx.fillStyle = 'rgba(251, 113, 133, 0.65)';
  ctx.beginPath();
  ctx.arc(-7, -20, 5.5, 0, Math.PI * 2);
  ctx.arc(21, -20, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (Shocked wide eyes when tripping, cute curved/round eyes when running)
  if (isShocked) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2, -28, 7.5, 0, Math.PI * 2);
    ctx.arc(16, -28, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-1, -28, 3, 0, Math.PI * 2);
    ctx.arc(17, -28, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-1, -27, 4.8, 0, Math.PI * 2);
    ctx.arc(16, -27, 4.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2.5, -28.8, 1.8, 0, Math.PI * 2);
    ctx.arc(14.5, -28.8, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smooth Rounded Beak
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  if (isShocked) {
    ctx.ellipse(9, -19, 9, 7, 0, 0, Math.PI * 2);
  } else {
    ctx.ellipse(9, -20, 9, 5, 0, 0, Math.PI * 2);
  }
  ctx.fill();

  // Front Flipper
  ctx.save();
  ctx.translate(-22, -2);
  ctx.rotate((isShocked ? 1.1 : 0.35) - (wingFlap * Math.PI) / 180);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, 12, 8.5, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// Helper: Draw a Retro Pixel Speech Bubble
function drawRetroSpeechBubble(ctx, x, y, text, borderColor = '#ff4d6d', isDark = false) {
  ctx.save();
  ctx.font = '900 13px "Pretendard", "Malgun Gothic", monospace';
  const padX = 11;
  const tw = Math.ceil(ctx.measureText(text).width);
  const bw = tw + padX * 2;
  const bh = 28;
  const bx = Math.round((x - bw / 2) / 2) * 2;
  const by = Math.round((y - bh) / 2) * 2;

  // Pixel drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(bx + 4, by + 4, bw, bh);

  // Outer pixel border
  ctx.fillStyle = borderColor;
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);

  // Inner box
  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(bx, by, bw, bh);

  // Little pixel pointer tail at bottom center
  ctx.fillStyle = borderColor;
  ctx.fillRect(x - 4, by + bh + 2, 8, 4);
  ctx.fillRect(x - 2, by + bh + 6, 4, 4);
  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(x - 2, by + bh, 4, 4);

  // Crisp text
  ctx.fillStyle = isDark ? '#ffffff' : '#11162b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, bx + bw / 2, by + bh / 2 + 1);
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
        ctx.fillStyle = '#1e1024';
        ctx.fillRect(startX + c * p + p, startY + r * p + p, p, p);
        ctx.fillStyle = color;
        ctx.fillRect(startX + c * p, startY + r * p, p, p);
      }
    }
  }
  ctx.restore();
}

// Helper: Draw the 16-Bit Side-Scrolling Pixel Penguin World Background (inspired by LOVE ATTACK reference)
function drawRetroPixelWorldBackground(ctx, now) {
  const P = 4; // 4px chunky retro grid on 960x540 canvas (240x135 virtual resolution)
  const snap = (v) => Math.floor(v / P) * P;

  // 1. Stepped 16-bit Sky Bands
  const skyBands = [
    { y: 0, h: 88, color: '#5899e2' },
    { y: 88, h: 76, color: '#74b3f0' },
    { y: 164, h: 80, color: '#97ccf8' },
    { y: 244, h: 96, color: '#bce0fd' },
  ];
  for (const b of skyBands) {
    ctx.fillStyle = b.color;
    ctx.fillRect(0, b.y, 960, b.h);
  }

  // Pixel Dither Lines between sky bands
  for (let i = 1; i < skyBands.length; i++) {
    const by = skyBands[i].y;
    ctx.fillStyle = skyBands[i - 1].color;
    for (let x = 0; x < 960; x += P * 2) {
      ctx.fillRect(x, by, P, P);
    }
  }

  // 2. Drifting Chunky Pixel Clouds
  const drawCloud = (baseX, y, wBlocks) => {
    const cx = snap(((baseX + now * 0.015) % 1120) - 120);
    const cy = snap(y);
    ctx.fillStyle = '#d8ecff';
    ctx.fillRect(cx + P * 2, cy + P * 3, wBlocks * P, P * 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + P * 3, cy, (wBlocks - 6) * P, P * 2);
    ctx.fillRect(cx + P, cy + P * 2, (wBlocks - 2) * P, P * 3);
  };
  drawCloud(80, 44, 22);
  drawCloud(420, 68, 28);
  drawCloud(780, 36, 24);

  // 3. Distant Pixel Snow Mountain & Cute Pixel Castle Tower (Center-Left & Far Right)
  ctx.fillStyle = '#8aa8d6';
  for (let step = 0; step < 18; step++) {
    const mw = (18 - step) * P * 4;
    ctx.fillRect(snap(250 - mw / 2), snap(308 - step * P * 2), mw, P * 2);
  }
  // Snow cap on mountain
  ctx.fillStyle = '#f1f7ff';
  for (let step = 11; step < 18; step++) {
    const mw = (18 - step) * P * 4;
    ctx.fillRect(snap(250 - mw / 2), snap(308 - step * P * 2), mw, P * 2);
  }

  // Distant Pixel Tower on Hill (like the reference image)
  const tx = snap(468);
  const ty = snap(196);
  ctx.fillStyle = '#d6c7db';
  ctx.fillRect(tx, ty + P * 6, P * 7, P * 18);
  ctx.fillStyle = '#f4eff8';
  ctx.fillRect(tx + P, ty + P * 6, P * 4, P * 18);
  // Pink spire roof
  ctx.fillStyle = '#e06388';
  for (let s = 0; s < 6; s++) {
    ctx.fillRect(tx + s * P * 0.5, ty + (5 - s) * P, P * (7 - s), P);
  }
  // Little flag on top
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(tx + P * 3, ty - P * 3, P * 3, P * 2);

  // 4. Rolling Background Hills & Bushes
  ctx.fillStyle = '#68b684';
  ctx.fillRect(0, 304, 960, 48);
  for (let x = 0; x < 960; x += P * 12) {
    const hillH = ((x / 48) % 3) * P * 2 + P * 2;
    ctx.fillRect(x, 304 - hillH, P * 10, hillH);
  }

  // 5. Sparkling Pixel River (Middle strip y=336..384)
  ctx.fillStyle = '#4ea8de';
  ctx.fillRect(0, 336, 960, 48);
  ctx.fillStyle = '#72efdd';
  ctx.fillRect(0, 336, 960, P);
  const waveShift = Math.floor(now / 260) % 2;
  ctx.fillStyle = '#90e0ef';
  for (let x = 16; x < 960; x += 64) {
    ctx.fillRect(x + waveShift * 8, 350, P * 4, P);
    ctx.fillRect(x + 28 - waveShift * 8, 366, P * 3, P);
  }

  // 6. Cherry-Blossom & Snow Pixel Trees (Left & Right, just like reference)
  const drawCherryTree = (treeX, treeY) => {
    const x = snap(treeX);
    const y = snap(treeY);
    // Trunk
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(x - P * 2, y - P * 12, P * 4, P * 12);
    ctx.fillStyle = '#8d5b38';
    ctx.fillRect(x - P, y - P * 12, P * 2, P * 12);
    // Pink blossom canopy (chunky pixel clusters)
    ctx.fillStyle = '#e56b92';
    ctx.fillRect(x - P * 10, y - P * 22, P * 20, P * 11);
    ctx.fillRect(x - P * 7, y - P * 26, P * 14, P * 5);
    ctx.fillStyle = '#ff9ebb';
    ctx.fillRect(x - P * 9, y - P * 21, P * 18, P * 8);
    ctx.fillRect(x - P * 6, y - P * 25, P * 12, P * 4);
    ctx.fillStyle = '#ffd6e4';
    ctx.fillRect(x - P * 6, y - P * 23, P * 10, P * 4);
  };
  drawCherryTree(88, 340);
  drawCherryTree(876, 340);
  drawCherryTree(760, 326);

  // 7. Foreground Stepped Pixel Grass & Path (y=380..540)
  ctx.fillStyle = '#3b8c5a';
  ctx.fillRect(0, 380, 960, 160);
  ctx.fillStyle = '#52b768';
  ctx.fillRect(0, 380, 960, 20);
  // Stepped grass teeth
  for (let x = 0; x < 960; x += P * 4) {
    ctx.fillRect(x, 400, P * 2, P * 2);
  }
  // Warm sandy/snow cobblestone path where penguins stand (y=412..472)
  ctx.fillStyle = '#e9d8a6';
  ctx.fillRect(0, 412, 960, 56);
  ctx.fillStyle = '#f4e8c1';
  ctx.fillRect(0, 416, 960, 44);
  // Pixel flowers on the grass
  for (let fx = 36; fx < 940; fx += 92) {
    ctx.fillStyle = fx % 184 === 36 ? '#ff4d6d' : '#fbbf24';
    ctx.fillRect(fx, 390, P * 2, P * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + P, 390, P, P);
  }
}

// Helper: Draw Retro Bottom RPG Narrative Dialogue Box
function drawRetroDialogueBar(ctx, speaker, lineText, stepHint = 'CLICK SCENE TABS OR SCREEN') {
  ctx.save();
  const bx = 28;
  const by = 468;
  const bw = 904;
  const bh = 58;

  // Outer pixel border
  ctx.fillStyle = '#090b14';
  ctx.fillRect(bx - 4, by - 4, bw + 8, bh + 8);
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  ctx.fillStyle = 'rgba(13, 16, 33, 0.94)';
  ctx.fillRect(bx, by, bw, bh);

  // Speaker badge
  ctx.fillStyle = '#ff4d6d';
  ctx.fillRect(bx + 12, by + 11, 132, 22);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 11.5px "Pretendard", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(speaker, bx + 78, by + 22);

  // Main story caption
  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 14.5px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(lineText, bx + 158, by + 23);

  // Sub hint
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 11px monospace';
  ctx.fillText(stepHint, bx + 158, by + 44);

  // Blinking arcade triangle on right
  if (Math.floor(performance.now() / 380) % 2 === 0) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('▼ NEXT', bx + bw - 16, by + 32);
  }
  ctx.restore();
}

function initPixelMotionStudio() {
  const canvas = document.getElementById('pixel-stage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Preload all 14 featured penguin sprites so the intro cutscene has instant access
  CURATED_BEAUTY_14.forEach((c) => ensurePenguinSprite(c.edition));

  // Build 14 Curated Dock Buttons (SELECT PLAYER bar)
  const dockGrid = document.getElementById('curator-dock-grid');
  if (dockGrid) {
    dockGrid.innerHTML = CURATED_BEAUTY_14.map((item, i) => {
      const thumbSrc = `/img/${item.id}.png`;
      return `
        <button type="button" class="dock-penguin-btn ${i === 0 ? 'active' : ''}" data-edition="${item.edition}" title="${escapeHtml(item.titleKo)}">
          <img src="${thumbSrc}" alt="${escapeHtml(item.shortKo)}" class="pixelated" loading="lazy" />
          <span class="dock-id">#${item.edition}</span>
          <span class="dock-label" data-ko="${escapeHtml(item.shortKo)}" data-en="${escapeHtml(item.shortEn)}">${escapeHtml(item.shortKo)}</span>
        </button>
      `;
    }).join('');

    dockGrid.querySelectorAll('.dock-penguin-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectMotionPenguin(Number(btn.dataset.edition), true);
        // Jump to Scene 1 (Transformation) or Scene 2 (Greeting) if user picks a character
        if (MOTION_STATE.sceneIdx === 0) {
          setIntroScene(1, true);
        }
      });
    });
  }

  // Scene Chapter Buttons (0, 1, 2, 3)
  document.querySelectorAll('.motion-mode-btn[data-scene]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setIntroScene(Number(btn.dataset.scene), true);
    });
  });

  // Replay Full Intro Button
  document.getElementById('btn-pixel-burst')?.addEventListener('click', () => {
    MOTION_STATE.autoPlay = true;
    const autoBtn = document.getElementById('btn-motion-autoplay');
    autoBtn?.classList.add('active-toggle');
    const lblEl = document.getElementById('autoplay-label');
    if (lblEl) {
      lblEl.textContent =
        CURRENT_LANG === 'ko' ? '연속 재생 (예고편 모드): ON' : 'Auto-Play Trailer: ON';
    }
    setIntroScene(0, true);
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
          ? `연속 재생 (예고편 모드): ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`
          : `Auto-Play Trailer: ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`;
    }
  });

  // Switch Hero Penguin Button
  document.getElementById('btn-motion-next')?.addEventListener('click', () => {
    const nextIdx = (MOTION_STATE.activeIdx + 1) % CURATED_BEAUTY_14.length;
    selectMotionPenguin(CURATED_BEAUTY_14[nextIdx].edition, true);
  });

  // Canvas Click Interaction (Menu clicks on Scene 3 Title Screen, or advance scene)
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (MOTION_STATE.sceneIdx === 3) {
      // Check if clicked inside the Title Screen RPG Menu Box (x: 310..650, y: 195..305)
      if (mx >= 300 && mx <= 660 && my >= 195 && my <= 235) {
        // START PIXEL WORLD -> Open 10,000 Codex
        scrollToSection('tab-codex');
        return;
      }
      if (mx >= 300 && mx <= 660 && my >= 236 && my <= 270) {
        // SELECT PLAYER -> Switch Hero Penguin
        const nextIdx = (MOTION_STATE.activeIdx + 1) % CURATED_BEAUTY_14.length;
        selectMotionPenguin(CURATED_BEAUTY_14[nextIdx].edition, true);
        return;
      }
      if (mx >= 300 && mx <= 660 && my >= 271 && my <= 310) {
        // REPLAY INTRO -> Restart from Scene 0
        setIntroScene(0, true);
        return;
      }
    }
    // Otherwise advance to next scene
    setIntroScene((MOTION_STATE.sceneIdx + 1) % 4, true);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (MOTION_STATE.sceneIdx !== 3) return;
    const rect = canvas.getBoundingClientRect();
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height;
    if (my >= 195 && my < 235) MOTION_STATE.menuHoverIdx = 0;
    else if (my >= 235 && my < 270) MOTION_STATE.menuHoverIdx = 1;
    else if (my >= 270 && my <= 315) MOTION_STATE.menuHoverIdx = 2;
  });

  // Initialize Hero #4442 and Scene 0
  selectMotionPenguin(4442, false);
  setIntroScene(0, true);

  // Main 60 FPS Cutscene Loop
  function renderIntroCutscene(now) {
    const heroItem = CURATED_BEAUTY_14[MOTION_STATE.activeIdx] || CURATED_BEAUTY_14[0];
    const heroSprite = ensurePenguinSprite(heroItem.edition);

    let elapsed = now - MOTION_STATE.sceneStartTime;
    const curDuration = SCENE_DURATIONS[MOTION_STATE.sceneIdx] || 4800;

    if (MOTION_STATE.autoPlay && elapsed >= curDuration) {
      setIntroScene((MOTION_STATE.sceneIdx + 1) % 4, true);
      elapsed = 0;
    }

    const p = Math.min(1, Math.max(0, elapsed / curDuration));
    ctx.clearRect(0, 0, 960, 540);

    // ========================================================================
    // SCENE 0: Regular 2D Penguin runs happily -> trips on rock -> falls in pit!
    // ========================================================================
    if (MOTION_STATE.sceneIdx === 0) {
      // Smooth 2D Winter Twilight Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 380);
      skyGrad.addColorStop(0, '#1e293b');
      skyGrad.addColorStop(0.55, '#334155');
      skyGrad.addColorStop(1, '#64748b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 960, 380);

      // Soft 2D hills in background
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(220, 380, 190, Math.PI, 0);
      ctx.arc(620, 380, 240, Math.PI, 0);
      ctx.fill();

      // Smooth 2D Snow Ground (Left side 0..620, and far right 790..960, with a deep PIT in between!)
      const pitLeft = 610;
      const pitRight = 795;

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 365, pitLeft, 175);
      ctx.fillRect(pitRight, 365, 960 - pitRight, 175);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 385, pitLeft, 155);
      ctx.fillRect(pitRight, 385, 960 - pitRight, 155);

      // Glowing Pixel Portal Pit (구덩이) at x = 610..795
      const pitGrad = ctx.createLinearGradient(0, 365, 0, 540);
      pitGrad.addColorStop(0, '#090812');
      pitGrad.addColorStop(0.5, '#1e1b4b');
      pitGrad.addColorStop(1, '#ec4899');
      ctx.fillStyle = pitGrad;
      ctx.fillRect(pitLeft, 365, pitRight - pitLeft, 175);

      // Rising pixel blocks from the pit (hinting that the pit leads to the Pixel World!)
      for (let i = 0; i < 14; i++) {
        const px = pitLeft + 16 + ((i * 37) % (pitRight - pitLeft - 32));
        const py = 520 - (((now * 0.12 + i * 29) % 165) | 0);
        ctx.fillStyle = i % 2 === 0 ? '#67e8f9' : '#ff4d6d';
        ctx.fillRect(px, py, 8, 8);
      }

      // Signpost before the pit: "⚠ PIXEL PIT (구덩이 주의)"
      ctx.fillStyle = '#78350f';
      ctx.fillRect(525, 315, 8, 52);
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.fillRect(475, 292, 108, 28);
      ctx.strokeRect(475, 292, 108, 28);
      ctx.fillStyle = '#b45309';
      ctx.font = '900 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ 구덩이 주의!', 529, 310);

      // Little bumping rock right at x = 575
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(578, 365, 13, Math.PI, 0);
      ctx.fill();

      // Calculate 2D Penguin position across 3 sub-phases:
      // Phase A (p = 0..0.46): Running happily from x=90 to x=568
      // Phase B (p = 0.46..0.68): Trips on rock! Jumps in arc to x=695, y=310 while spinning
      // Phase C (p = 0.68..1.0): Plunges down into the pit (y=310 -> y=520)
      let pengX = 100;
      let pengY = 322;
      let pengRot = 0;
      let isShocked = false;
      const runPhase = now * 0.022;

      if (p < 0.46) {
        const subP = p / 0.46;
        pengX = 95 + subP * 473;
        pengY = 322 - Math.abs(Math.sin(runPhase)) * 12;
        pengRot = Math.sin(runPhase * 0.5) * 0.08;
        // Dust puffs behind feet
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(pengX - 35, 360, 7 + ( (now / 60) % 5 ), 0, Math.PI * 2);
        ctx.fill();
      } else if (p < 0.68) {
        const subP = (p - 0.46) / 0.22;
        pengX = 568 + subP * 130;
        pengY = 322 - Math.sin(subP * Math.PI) * 85 + subP * 25;
        pengRot = subP * Math.PI * 1.15;
        isShocked = true;

        // "턱!!" impact star at the rock
        if (subP < 0.45) {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '900 18px sans-serif';
          ctx.fillText('💥 턱!!', 578, 338);
        }
      } else {
        const subP = (p - 0.68) / 0.32;
        pengX = 698;
        pengY = 347 + subP * subP * 230;
        pengRot = Math.PI * 1.15 + subP * Math.PI * 1.2;
        isShocked = true;
      }

      // Clip so when penguin falls inside the pit (y > 368), it disappears into the pit!
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 960, 445);
      ctx.clip();
      drawSmooth2DPenguin(ctx, pengX, pengY, 1.0, pengRot, runPhase, isShocked);
      ctx.restore();

      // Speech Bubble above 2D Penguin
      if (p < 0.44) {
        drawRetroSpeechBubble(
          ctx,
          pengX,
          pengY - 64,
          CURRENT_LANG === 'ko' ? '룰루랄라~ 신나게 달려보자!' : 'La la la~ Running happily!',
          '#38bdf8'
        );
      } else if (p < 0.85) {
        drawRetroSpeechBubble(
          ctx,
          Math.min(720, pengX),
          Math.max(120, pengY - 68),
          CURRENT_LANG === 'ko' ? '헉!! 발 걸렸다!! 어어어어?!' : 'WHOA!! I tripped!! Ahhhh?!',
          '#ff4d6d'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'INTRO · SCENE 1',
        CURRENT_LANG === 'ko'
          ? '평범한 2D 펭귄이 신나게 달려가다가 그만 돌부리에 걸려 구덩이에 빠지고 말았는데...'
          : 'A regular 2D penguin was running along happily, tripped on a rock, and fell into a mysterious pit...'
      );
    }

    // ========================================================================
    // SCENE 1: Falling through the Pixel Warp Tunnel -> 48x48 Pixel Transformation!
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 1) {
      // Deep retro warp background
      ctx.fillStyle = '#090814';
      ctx.fillRect(0, 0, 960, 540);

      // Scrolling vertical pixel tunnel walls & grid lines
      const scrollY = (now * 0.28) % 32;
      for (let y = -32; y < 540; y += 32) {
        const wy = Math.round(y + scrollY);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(140, wy, 680, 2);
        // Left & right neon pixel tunnel pillars
        ctx.fillStyle = ((y / 32) & 1) === 0 ? '#ff4d6d' : '#67e8f9';
        ctx.fillRect(116, wy, 20, 24);
        ctx.fillRect(824, wy, 20, 24);
      }

      // Rising pixel code blocks in the tunnel
      for (let i = 0; i < 28; i++) {
        const bx = 170 + ((i * 73) % 620);
        const by = 520 - (((now * 0.35 + i * 47) % 520) | 0);
        ctx.fillStyle = i % 3 === 0 ? '#fbbf24' : i % 2 === 0 ? '#67e8f9' : '#ff4d6d';
        ctx.fillRect(bx, by, 10, 10);
      }

      const centerX = 480;
      const centerY = 235 + Math.sin(now * 0.008) * 10;

      // Sub-phases:
      // p = 0..0.38: 2D Penguin falling & spinning, surrounded by pixel lightning
      // p = 0.38..0.68: Pixel scanner beam converts 2D Penguin into 48x48 Pixel Penguin!
      // p = 0.68..1.0: Crisp 48x48 Pixel Penguin Hero (#4442) shines in full pixel glory!
      if (p < 0.38) {
        drawSmooth2DPenguin(ctx, centerX, centerY, 1.25, now * 0.006, now * 0.02, true);
        drawRetroSpeechBubble(
          ctx,
          centerX,
          centerY - 92,
          CURRENT_LANG === 'ko'
            ? '어어어?! 내 몸이 네모난 도트로 바뀌고 있어!!'
            : 'Whoa?! My body is turning into square pixels!!',
          '#fbbf24'
        );
      } else if (p < 0.68) {
        const morphP = (p - 0.38) / 0.3; // 0 -> 1
        const splitY = centerY - 90 + morphP * 180;

        // Bottom half: still 2D penguin
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, splitY, 960, 540 - splitY);
        ctx.clip();
        drawSmooth2DPenguin(ctx, centerX, centerY, 1.25, 0, now * 0.02, true);
        ctx.restore();

        // Top half: Newly transformed 48x48 Pixel Penguin!
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 960, splitY);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        const drawSource = heroSprite.cutoutCanvas || heroSprite.rawImg;
        if (drawSource) {
          ctx.drawImage(drawSource, centerX - 96, centerY - 96, 192, 192);
        }
        ctx.restore();

        // Glowing Pixel Laser Scan Bar at splitY
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(centerX - 130, splitY - 4, 260, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX - 120, splitY - 2, 240, 4);

        drawRetroSpeechBubble(
          ctx,
          centerX,
          centerY - 112,
          CURRENT_LANG === 'ko'
            ? '⚡ 삐리릭—! 2D → 48×48 도트 변환 중...'
            : '⚡ BZZT—! Converting 2D → 48×48 Pixels...',
          '#67e8f9',
          true
        );
      } else {
        // Expanding pixel ring celebration
        const ringP = (p - 0.68) / 0.32;
        const ringR = Math.round((60 + ringP * 140) / 6) * 6;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.strokeRect(centerX - ringR, centerY - ringR, ringR * 2, ringR * 2);

        const bounce = Math.floor(now / 220) % 2 === 0 ? 0 : -8;
        ctx.imageSmoothingEnabled = false;
        const drawSource = heroSprite.cutoutCanvas || heroSprite.rawImg;
        if (drawSource) {
          ctx.drawImage(drawSource, centerX - 96, centerY - 96 + bounce, 192, 192);
        }

        drawPixelHeart(ctx, centerX - 115, centerY - 50 + bounce, 4, '#ff4d6d');
        drawPixelHeart(ctx, centerX + 115, centerY - 50 + bounce, 4, '#fbbf24');

        drawRetroSpeechBubble(
          ctx,
          centerX,
          centerY - 110 + bounce,
          CURRENT_LANG === 'ko'
            ? `짠!! 48×48 픽셀 펭귄(#${heroItem.edition})으로 변신 완료!`
            : `TA-DA!! Transformed into 48×48 Pixel Penguin #${heroItem.edition}!`,
          '#ff4d6d'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'INTRO · SCENE 2',
        CURRENT_LANG === 'ko'
          ? `구덩이 속 차원 터널을 통과하자 내 몸도 48×48 도트 펭귄(#${heroItem.edition})으로 완벽 변신했다!`
          : `Falling through the dimensional pit transformed me into a 48×48 Pixel Penguin (#${heroItem.edition})!`
      );
    }

    // ========================================================================
    // SCENE 2: Arriving in Pixel World & Greeting Pixel Penguin Friends!
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 2) {
      drawRetroPixelWorldBackground(ctx, now);

      ctx.imageSmoothingEnabled = false;
      const spriteSize = 132; // 48 * 2.75
      const groundY = 318;

      // Hero drops in from top during first 0.18 of scene, then hops & waves on the left (x = 185)
      const landP = Math.min(1, p / 0.18);
      const heroHop = landP >= 1 ? (Math.floor(now / 260) % 2 === 0 ? 0 : -8) : 0;
      const heroX = 165;
      const heroY =
        landP < 1 ? -120 + landP * (groundY + 120) : groundY + heroHop;

      // Pixel shadow under Hero
      ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
      ctx.fillRect(heroX + 26, groundY + spriteSize - 10, spriteSize - 52, 10);

      const heroSource = heroSprite.cutoutCanvas || heroSprite.rawImg;
      if (heroSource) {
        // Flip horizontally so our hero faces right toward the friends if needed (our penguins face slightly center/right)
        ctx.drawImage(heroSource, heroX, heroY, spriteSize, spriteSize);
      }

      // 5 Pixel Penguin Friends on the right walking in & hopping to greet Hero!
      const friendEditions = [963, 6522, 43, 500, 21].filter((e) => e !== heroItem.edition);
      if (friendEditions.length < 5) friendEditions.push(4442);

      const friendGreetingsKo = [
        '어서와! 여긴 픽셀 월드야 ♥',
        '새로운 도트 친구다! 반가워~!',
        '우와 도트 잘 찍혔네! 안녕!',
        '환영한다 친구여! 삐약!',
        '같이 베리챗 프사 하러 가자!',
      ];
      const friendGreetingsEn = [
        'Welcome to Pixel World ♥',
        'A new pixel friend! Hi there~!',
        'Nice pixels! Hello!',
        'Welcome, my friend!',
        "Let's rock VeryChat PFPs!",
      ];

      const walkInP = Math.min(1, p / 0.28);
      friendEditions.forEach((ed, idx) => {
        const fSprite = ensurePenguinSprite(ed);
        const targetX = 365 + idx * 112;
        const fx = Math.round(targetX + (1 - walkInP) * 160);
        const fHop =
          Math.floor((now + idx * 130) / 250) % 2 === 0 ? 0 : -8;
        const fy = groundY + fHop;

        // Shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
        ctx.fillRect(fx + 26, groundY + spriteSize - 10, spriteSize - 52, 10);

        const fSrc = fSprite.cutoutCanvas || fSprite.rawImg;
        if (fSrc) {
          // Flip friends horizontally so they face left toward our Hero penguin!
          ctx.save();
          ctx.translate(fx + spriteSize, fy);
          ctx.scale(-1, 1);
          ctx.drawImage(fSrc, 0, 0, spriteSize, spriteSize);
          ctx.restore();
        }

        // Floating #ID tag below feet
        ctx.fillStyle = 'rgba(11, 16, 33, 0.82)';
        ctx.fillRect(fx + 36, groundY + spriteSize - 4, 60, 18);
        ctx.fillStyle = '#67e8f9';
        ctx.font = '900 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`#${ed}`, fx + 66, groundY + spriteSize + 9);
      });

      // Pixel Hearts floating between Hero and Friends
      drawPixelHeart(
        ctx,
        325,
        335 - ((now * 0.04) % 45),
        3,
        '#ff4d6d'
      );
      drawPixelHeart(
        ctx,
        348,
        355 - (((now + 500) * 0.04) % 45),
        3,
        '#fbbf24'
      );

      // Alternating Greeting Speech Bubbles!
      if (p > 0.16) {
        drawRetroSpeechBubble(
          ctx,
          heroX + spriteSize / 2 + 10,
          heroY - 8,
          CURRENT_LANG === 'ko'
            ? `우와!! 나도 도트가 됐어! 다들 안녕~!!`
            : `Whoa!! I'm pixel art too! Hello everyone~!!`,
          '#38bdf8'
        );

        const activeFriendIdx = Math.floor(((p - 0.16) / 0.84) * 3) % friendEditions.length;
        const speakerX = 365 + activeFriendIdx * 112 + spriteSize / 2;
        const msg =
          CURRENT_LANG === 'ko'
            ? friendGreetingsKo[activeFriendIdx]
            : friendGreetingsEn[activeFriendIdx];
        drawRetroSpeechBubble(ctx, speakerX, groundY - 22, msg, '#ff4d6d');
      }

      drawRetroDialogueBar(
        ctx,
        'INTRO · SCENE 3',
        CURRENT_LANG === 'ko'
          ? '픽셀 월드에 도착하자 먼저 살고 있던 도트 펭귄 친구들이 몰려와 반갑게 인사한다!'
          : 'Upon landing in Pixel World, the Pixel Penguin friends gather around and wave hello!'
      );
    }

    // ========================================================================
    // SCENE 3: Retro 16-Bit Game Title Screen (LOVE ATTACK Reference Style!)
    // ========================================================================
    else {
      drawRetroPixelWorldBackground(ctx, now);

      ctx.imageSmoothingEnabled = false;

      // 1. Big Chunky 16-Bit Pixel Title Logo at Top Center ("PIXEL ♥ PENGUIN")
      const titleBounce = Math.floor(now / 480) % 2 === 0 ? 0 : -4;
      const titleY = 66 + titleBounce;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 54px "Courier New", "Pretendard", monospace';

      // Heavy 3D Pixel Block Extrusion Shadow (Dark purple/maroon like LOVE ATTACK logo)
      ctx.fillStyle = '#4a153b';
      for (let ox = -4; ox <= 4; ox += 2) {
        for (let oy = -4; oy <= 8; oy += 2) {
          ctx.fillText('PIXEL   PENGUIN', 480 + ox, titleY + oy);
        }
      }
      // Mid pink bevel
      ctx.fillStyle = '#ff5c8a';
      ctx.fillText('PIXEL   PENGUIN', 480, titleY + 3);
      // Crisp bright pink-white top face
      ctx.fillStyle = '#ffe5ec';
      ctx.fillText('PIXEL   PENGUIN', 480, titleY);

      // Golden/Pink Pixel Heart right between PIXEL and PENGUIN
      drawPixelHeart(ctx, 456, titleY + 2, 6, '#fbbf24');
      drawPixelHeart(ctx, 456, titleY + 2, 4, '#ff4d6d');

      // Sub-banner Ribbon ("VERYCHAT 10K PFP WORLD")
      const rbW = 310;
      const rbH = 26;
      const rbX = 480 - rbW / 2;
      const rbY = titleY + 40;
      ctx.fillStyle = '#4a153b';
      ctx.fillRect(rbX - 3, rbY - 3, rbW + 6, rbH + 6);
      ctx.fillStyle = '#ff758f';
      ctx.fillRect(rbX, rbY, rbW, rbH);
      ctx.fillStyle = '#fff0f3';
      ctx.font = '900 13.5px monospace';
      ctx.fillText('★ VERYCHAT 10,000 PFP WORLD ★', 480, rbY + rbH / 2 + 1);
      ctx.restore();

      // 2. Center Retro Dark-Navy RPG Command Box (START PIXEL WORLD / SELECT PLAYER / REPLAY INTRO)
      const menuW = 376;
      const menuH = 116;
      const menuX = 480 - menuW / 2;
      const menuY = 190;

      // Outer gold & dark pixel frame
      ctx.fillStyle = '#090b14';
      ctx.fillRect(menuX - 6, menuY - 6, menuW + 12, menuH + 12);
      ctx.fillStyle = '#f4a261';
      ctx.fillRect(menuX - 3, menuY - 3, menuW + 6, menuH + 6);
      ctx.fillStyle = '#141829';
      ctx.fillRect(menuX, menuY, menuW, menuH);

      // Inner corner pixel rivets
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(menuX + 4, menuY + 4, 4, 4);
      ctx.fillRect(menuX + menuW - 8, menuY + 4, 4, 4);
      ctx.fillRect(menuX + 4, menuY + menuH - 8, 4, 4);
      ctx.fillRect(menuX + menuW - 8, menuY + menuH - 8, 4, 4);

      const menuItems =
        CURRENT_LANG === 'ko'
          ? [
              'START PIXEL WORLD (도감도 열기)',
              `SELECT PLAYER (주인공 #${heroItem.edition} 변경)`,
              'REPLAY INTRO (인트로 다시보기)',
            ]
          : [
              'START PIXEL WORLD (Open 10K Codex)',
              `SELECT PLAYER (Hero #${heroItem.edition})`,
              'REPLAY INTRO (Watch Cutscene)',
            ];

      menuItems.forEach((mText, idx) => {
        const rowY = menuY + 26 + idx * 32;
        const isSelected = MOTION_STATE.menuHoverIdx === idx;
        if (isSelected) {
          ctx.fillStyle = 'rgba(255, 77, 109, 0.22)';
          ctx.fillRect(menuX + 12, rowY - 13, menuW - 24, 26);
          drawPixelHeart(ctx, menuX + 30, rowY, 2.5, '#ff4d6d');
        }
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.font = '900 14px "Pretendard", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(mText, menuX + 48, rowY + 1);
      });

      // 3. Bottom Lineup of 7 Actual 48x48 Pixel Penguins Standing & Bouncing on the Grass!
      const lineupEditions = [963, 6522, 43, heroItem.edition, 500, 192, 21];
      const pSize = 114;
      const startX = 68;
      const gapX = 118;
      const baseLineY = 338;

      lineupEditions.forEach((ed, idx) => {
        const sp = ensurePenguinSprite(ed);
        const lx = startX + idx * gapX;
        const isHeroCenter = idx === 3;
        const hop = Math.floor((now + idx * 140) / 280) % 2 === 0 ? 0 : -7;
        const ly = baseLineY + hop - (isHeroCenter ? 8 : 0);

        // Shadow
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(lx + 22, baseLineY + pSize - 8, pSize - 44, 8);

        const src = sp.cutoutCanvas || sp.rawImg;
        if (src) {
          ctx.drawImage(src, lx, ly, pSize, pSize);
        }

        if (isHeroCenter) {
          drawRetroSpeechBubble(
            ctx,
            lx + pSize / 2,
            ly - 4,
            CURRENT_LANG === 'ko'
              ? `HERO #${ed} · 인사해 안녕!`
              : `HERO #${ed} · Hello World!`,
            '#fbbf24'
          );
        }
      });

      drawRetroDialogueBar(
        ctx,
        'PIXEL WORLD START',
        CURRENT_LANG === 'ko'
          ? '그렇게 시작된 10,000마리 픽셀 펭귄 월드! 메뉴를 클릭해 도감도를 열거나 주인공을 바꿔보세요.'
          : 'And so begins the 10,000 Pixel Penguin World! Click the menu to open the Codex or switch heroes.'
      );
    }

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
    const id = `P${String(item.edition).padStart(5, '0')}`;
    const src =
      item.edition <= 11 ? `/assets/specials/${item.edition}_fast.gif` : `/img/${id}.png`;
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
          <div class="parade-card-sub">100 VERY · Verified PFP</div>
        </div>
      </button>
    `;
  };

  row1.innerHTML = [...PARADE_ROW_1_ITEMS, ...PARADE_ROW_1_ITEMS].map(renderCard).join('');
  row2.innerHTML = [...PARADE_ROW_2_ITEMS, ...PARADE_ROW_2_ITEMS].map(renderCard).join('');
}

function handleParadeClick(edition) {
  const inCurated = CURATED_BEAUTY_14.some((c) => c.edition === Number(edition));
  if (inCurated) {
    selectMotionPenguin(Number(edition), true);
    loadPfpPreview(Number(edition));
    scrollToSection('sec-motion');
  } else {
    loadPfpPreview(Number(edition));
    openTokenModal(Number(edition));
  }
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

  const activeItem = CURATED_BEAUTY_14[MOTION_STATE.activeIdx];
  if (activeItem) {
    const titleEl = document.getElementById('spot-title');
    if (titleEl) titleEl.textContent = lang === 'ko' ? activeItem.titleKo : activeItem.titleEn;
  }
  setIntroScene(MOTION_STATE.sceneIdx, false);
}

// PFP Simulator (No Rarity Rank / Score)
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
    if (tierEl) {
      tierEl.textContent = tok.tier;
      tierEl.className = `tier-${tok.tier}`;
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

  // Preset strip: Official Logo #4442 + Featured generative penguins
  const presets = CURATED_BEAUTY_14.map((c) => c.edition);
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
        const n = Number(btn.dataset.num);
        loadPfpPreview(n);
        selectMotionPenguin(n, false);
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

// Render 11 Special Originals Section (Only if section element exists)
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
          <span class="tier-pill tier-등급없음">등급없음</span>
          <span class="rank-pill">#${sp.edition}</span>
        </div>
      </div>
      <div class="nft-card-meta">
        <span>${sp.id}</span>
        <span>Edition #${sp.edition} / 10,000</span>
      </div>
      <div class="nft-card-title">${escapeHtml(sp.archetype)}</div>
      <div class="nft-card-footer">
        <span class="price-tag">100 VERY</span>
        <span class="score-tag">Verified PFP</span>
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

// Fetch & Render 10K Explorer Grid (Default sort: id_asc, no rarity rank/score badges)
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
          ? `총 <strong>${data.total.toLocaleString()}</strong>마리 귀한 자식들 검색됨 (페이지 ${data.page} / ${TOTAL_PAGES})`
          : `Showing <strong>${data.total.toLocaleString()}</strong> Precious Penguins (Page ${data.page} of ${TOTAL_PAGES})`;
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
              <span class="rank-pill">#${item.edition}</span>
            </div>
          </div>
          <div class="nft-card-meta">
            <span>${item.id}</span>
            <span>#${item.edition} / 10,000</span>
          </div>
          <div class="nft-card-title">${escapeHtml(subtitle)}</div>
          <div class="nft-card-footer">
            <span class="price-tag">100 VERY</span>
            <span class="score-tag">Verified PFP</span>
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
  fetchExplorerTokens();
  scrollToSection('sec-explorer');
}

// Build 210 Trait Directory Section (Without +pts score)
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
        <span>보유 펭귄: ${r.count.toLocaleString()}마리 (${r.pct}%)</span>
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

// Token Detail Inspector Modal (Without Rarity Rank / Rarity Score)
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
          <span>${b.count.toLocaleString()}마리 보유 (${b.pct}%)</span>
        </div>
      </div>
    `
      )
      .join('');

    const downloadBtnHtml = isSpecial
      ? `<a href="${tok.full_image_url}" download="${tok.id}.gif" class="btn-primary" style="text-decoration:none; width:100%; justify-content:center;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>1254×1254 원본 이미지 다운로드</span>
         </a>`
      : `<button type="button" class="btn-primary" style="width:100%; justify-content:center;" onclick="downloadHighRes3072('${tok.id}', '${tok.pixel_48_url}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>3072×3072 고해상도 PNG 다운로드 (64× NEAREST)</span>
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
              PFP 시뮬레이터 장착
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
          <span class="pill-tag">#${tok.edition} / 10,000</span>
          <span class="pill-tag gold">100 VERY</span>
        </div>

        <h2 id="modal-token-title" style="font-size:24px; font-weight:900; margin-bottom:12px;">${escapeHtml(tok.name)}</h2>

        <div class="spec-rows-stack" style="margin-bottom:14px;">
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">번호 (Token ID)</span>
            <span class="spec-value">${tok.id} (#${tok.edition})</span>
          </div>
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">장착 파츠 수</span>
            <span class="spec-value">${tok.active_trait_stat.active_count}개 (${tok.active_trait_stat.pct}%)</span>
          </div>
        </div>

        <h4 style="font-size:14px; font-weight:800; margin-bottom:6px;">파츠 구성 (누르면 같은 파츠 낀 펭귄 검색)</h4>
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
    loadPfpPreview(4442);
    fetchExplorerTokens();
  } catch (err) {
    console.error('Failed to initialize config:', err);
  }
});
