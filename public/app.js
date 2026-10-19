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
    tier: 'Mythic',
    rank: 12,
    score: '1,914.93',
    shortKo: '여우 잠옷 펭귄',
    shortEn: 'Fox Onesie',
    titleKo: '#963 여우 잠옷 입고 윙크하는 자식 (Fox Onesie)',
    titleEn: '#963 Fox Onesie Penguin (Mythic)',
    themeKo: 'Mythic · Rank #12 · Fox Onesie & Wink',
    themeEn: 'Mythic · Rank #12 · Fox Onesie & Wink',
    noteKo:
      '펭귄인데 여우 후드 잠옷(Fox Onesie) 뒤집어쓰고 윙크하는 귀여운 자식입니다. 일반 도트 펭귄들 중 희귀도 점수 1등(전체 #12, Mythic)으로 뽑혔는데, 역시나 뭐 주는 건 없습니다.',
    noteEn:
      'A penguin wearing a fox onesie and winking. Highest rarity.tools score among static 48×48 penguins (Rank #12, Mythic), though it still gives zero perks.',
  },
  {
    edition: 6522,
    id: 'P06522',
    isSpecial: false,
    tier: 'Mythic',
    rank: 15,
    score: '1,839.98',
    shortKo: '게코 후드 펭귄',
    shortEn: 'Gecko Onesie',
    titleKo: '#6522 도마뱀 후드 뒤집어쓴 자식 (Gecko Onesie)',
    titleEn: '#6522 Dreamglow Gecko Onesie (Mythic)',
    themeKo: 'Mythic · Rank #15 · Dreamglow & Gecko Onesie',
    themeEn: 'Mythic · Rank #15 · Dreamglow & Gecko Onesie',
    noteKo:
      '희귀한 드림글로우 스킨이랑 초록 도마뱀 후드가 겹쳐서 전체 15등(Mythic)에 오른 귀한 자식입니다. 눈웃음 짓고 있어서 프사로 쓰기 딱 좋습니다.',
    noteEn:
      'Ranked #15 (Mythic) thanks to its rare Dreamglow skin and Gecko Onesie hood. Smiling eyes make it a great PFP.',
  },
  {
    edition: 43,
    id: 'P00043',
    isSpecial: false,
    tier: 'Legendary',
    rank: 187,
    score: '517.67',
    shortKo: '꽃화관 빙어 낚시',
    shortEn: 'Floral Angler',
    titleKo: '#43 꽃화관 쓰고 빙어 낚는 자식 (Floral Wreath Angler)',
    titleEn: '#43 Floral Wreath Ice Angler (Legendary)',
    themeKo: 'Legendary · Rank #187 · Floral Wreath & Arctic Smelt',
    themeEn: 'Legendary · Rank #187 · Floral Wreath & Arctic Smelt',
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
    themeKo: 'Mythic · Rank #46 · Crystal Helmet & Bubble Pipe',
    themeEn: 'Mythic · Rank #46 · Crystal Helmet & Bubble Pipe',
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
    themeKo: 'Legendary · Rank #162 · Glacier Crown & Varsity Jacket',
    themeEn: 'Legendary · Rank #162 · Glacier Crown & Varsity Jacket',
    noteKo:
      '뜨거운 용암 동굴 배경에 얼음 왕관 쓰고 파란 과잠(Varsity Jacket) 입은 청개구리 같은 자식입니다.',
    noteEn:
      'Wearing an ice crown and blue varsity jacket inside a hot lava cave—a delightfully contradictory penguin.',
  },
  {
    edition: 192,
    id: 'P00192',
    isSpecial: false,
    tier: 'Common',
    rank: 7788,
    score: '146.63',
    shortKo: '군밤장수 털모자',
    shortEn: 'Polar Ushanka',
    titleKo: '#192 민트 배경에 털모자 쓴 초코 펭귄 (Polar Ushanka)',
    titleEn: '#192 Polar Ushanka & Cocoa Penguin (Common)',
    themeKo: 'Common · Rank #7,788 · Kelp Mint · Polar Ushanka',
    themeEn: 'Common · Rank #7,788 · Kelp Mint · Polar Ushanka',
    noteKo:
      '희귀도 순위는 7,788등(Common)이지만 민트색 배경에 코코아 색 깃털이랑 털모자 조합이 아주 기가 막히게 귀여운 자식입니다.',
    noteEn:
      'Ranked #7,788 (Common), but the mint background, cocoa feathers, and plush ushanka hat make it ridiculously cute.',
  },
  {
    edition: 21,
    id: 'P00021',
    isSpecial: false,
    tier: 'Common',
    rank: 6885,
    score: '162.54',
    shortKo: '핑크 비니 빙어',
    shortEn: 'Pink Smelt Catch',
    titleKo: '#21 핑크 배경에 초록 비니 쓰고 빙어 문 자식',
    titleEn: '#21 Orchid Pink & Green Beanie Smelt Catcher',
    themeKo: 'Common · Rank #6,885 · Orchid Pink · Green Beanie',
    themeEn: 'Common · Rank #6,885 · Orchid Pink · Green Beanie',
    noteKo:
      '분홍색 배경에 초록 비니 쓰고 입에 빙어 한 마리 야무지게 물고 있는 귀한 자식입니다. 프사로 해두면 볼 때마다 기분 좋아집니다.',
    noteEn:
      'Pink penguin in a green beanie holding a freshly caught smelt in its beak—guaranteed to brighten up your profile.',
  },
  {
    edition: 25,
    id: 'P00025',
    isSpecial: false,
    tier: 'Uncommon',
    rank: 2785,
    score: '252.41',
    shortKo: '안전모 세일러',
    shortEn: 'Hardhat Sailor',
    titleKo: '#25 박쥐 날개 달고 노란 안전모 쓴 자식 (Hardhat Sailor)',
    titleEn: '#25 Bat Wings & Sailor Collar Hardhat (Uncommon)',
    themeKo: 'Uncommon · Rank #2,785 · Bat Wings & Hardhat',
    themeEn: 'Uncommon · Rank #2,785 · Bat Wings & Hardhat',
    noteKo:
      '세일러 카라에 박쥐 날개 달고 머리엔 공사장 노란 안전모에 밀짚까지 물고 있는 종잡을 수 없는 귀한 자식입니다.',
    noteEn:
      'Rocking a sailor collar, bat wings, a yellow construction hardhat, and a wheat straw—chaotic B-grade charm.',
  },
  {
    edition: 4276,
    id: 'P04276',
    isSpecial: false,
    tier: 'Epic',
    rank: 310,
    score: '455.85',
    shortKo: '매화 로브 윙크',
    shortEn: 'Plum Robe Wink',
    titleKo: '#4276 프리즘 후광에 비눗방울 부는 자식 (Plum Robe)',
    titleEn: '#4276 Glacier Prism & Bubble Pipe Wink (Epic)',
    themeKo: 'Epic · Rank #310 · Glacier Prism & Wink',
    themeEn: 'Epic · Rank #310 · Glacier Prism & Wink',
    noteKo:
      '프리즘 후광이랑 매화 로브가 겹쳐서 전체 310등(Epic)에 오른 자식입니다. 어차피 등급 높아도 주는 건 똑같이 없습니다.',
    noteEn:
      'Ranked #310 (Epic) thanks to its Glacier Prism aura and Plum Blossom robe. Higher tier still means zero utility.',
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
    themeKo: 'Common · Rank #6,044 · Blue Varsity & Briar Pipe',
    themeEn: 'Common · Rank #6,044 · Blue Varsity & Briar Pipe',
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
    themeKo: 'Common · Rank #7,545 · Grey Hoodie & Blue Cap',
    themeEn: 'Common · Rank #7,545 · Grey Hoodie & Blue Cap',
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
    themeKo: 'Common · Rank #5,671 · Hawaiian Shirt & Headphones',
    themeEn: 'Common · Rank #5,671 · Hawaiian Shirt & Headphones',
    noteKo:
      '추운 남극 출신이면서 빨간 하와이안 셔츠 입고 선글라스에 보라색 헤드폰까지 낀 흥 넘치는 자식입니다.',
    noteEn:
      'An Antarctic penguin wearing a red Hawaiian shirt, blue wayfarer sunglasses, and purple headphones.',
  },
  {
    edition: 777,
    id: 'P00777',
    isSpecial: false,
    tier: 'Uncommon',
    rank: 4419,
    score: '209.51',
    shortKo: '보안관 모자 777',
    shortEn: 'Sheriff #777',
    titleKo: '#777 민트 폴로셔츠에 보안관 모자 쓴 럭키 자식',
    titleEn: '#777 Sheriff Hat & Mint Polo Penguin',
    themeKo: 'Uncommon · Rank #4,419 · Token #777 · Sheriff Hat',
    themeEn: 'Uncommon · Rank #4,419 · Token #777 · Sheriff Hat',
    noteKo:
      '번호가 무려 777번인 초코 펭귄입니다. 보안관 모자 쓰고 민트색 폴로셔츠 입었는데, 777번이라고 잭팟 터지는 기능 같은 건 없습니다.',
    noteEn:
      'Lucky edition #777 wearing a sheriff hat and mint polo shirt—though hitting #777 still pays out zero jackpot.',
  },
];

// Additional Penguins for the 28-Token Dual-Row Infinite Pixel Parade (All 48x48 Generative Penguins)
const PARADE_ROW_1_ITEMS = [
  { edition: 4442, labelKo: '선글라스 펭귄', labelEn: 'Pixel Shades Penguin', sub: 'Common · #4442' },
  { edition: 963, labelKo: '여우 잠옷 펭귄', labelEn: 'Fox Onesie Penguin', sub: 'Mythic · #963' },
  { edition: 6522, labelKo: '도마뱀 후드 펭귄', labelEn: 'Gecko Onesie Penguin', sub: 'Mythic · #6522' },
  { edition: 43, labelKo: '꽃화관 빙어 낚시', labelEn: 'Floral Wreath Angler', sub: 'Legendary · #43' },
  { edition: 500, labelKo: '크리스탈 나이트', labelEn: 'Crystal Knight', sub: 'Mythic · #500' },
  { edition: 75, labelKo: '빙하 왕관 과잠', labelEn: 'Glacier Varsity', sub: 'Legendary · #75' },
  { edition: 192, labelKo: '군밤장수 털모자', labelEn: 'Polar Ushanka', sub: 'Common · #192' },
  { edition: 21, labelKo: '핑크 비니 빙어', labelEn: 'Pink Smelt Catcher', sub: 'Common · #21' },
  { edition: 25, labelKo: '안전모 세일러', labelEn: 'Hardhat Sailor', sub: 'Uncommon · #25' },
  { edition: 4276, labelKo: '매화 로브 윙크', labelEn: 'Plum Robe Wink', sub: 'Epic · #4276' },
  { edition: 88, labelKo: '초록 비니 과잠', labelEn: 'Beanie Varsity', sub: 'Common · #88' },
  { edition: 108, labelKo: '파란 캡모자 후드', labelEn: 'Blue Cap Hoodie', sub: 'Common · #108' },
  { edition: 312, labelKo: '하와이안 헤드폰', labelEn: 'Hawaiian Headphones', sub: 'Common · #312' },
  { edition: 777, labelKo: '보안관 모자 777', labelEn: 'Sheriff Hat #777', sub: 'Uncommon · #777' },
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
//    Scene 1: Falling through warp tunnel -> transforms into Full-Body Pixel Penguin!
//    Scene 2: Lands in Pixel World & greets full-body pixel penguin friends (22 species colors)
//    Scene 3: Retro 16-bit Game Title Screen (PIXEL PENGUIN / START PIXEL WORLD)
// ============================================================================
const SCENE_DURATIONS = [4800, 4500, 5400, 5400]; // ms per scene

const MOTION_SPECIES_22 = [
  { id: '01', code: 'SPC-05', ko: '기본 블루', en: 'Classic Blue' },
  { id: '02', code: 'SPC-01', ko: '코코아 브라운', en: 'Cocoa Brown' },
  { id: '03', code: 'SPC-02', ko: '미드나잇 블랙', en: 'Midnight' },
  { id: '04', code: 'SPC-03', ko: '살구 오렌지', en: 'Apricot Orange' },
  { id: '05', code: 'SPC-04', ko: '로즈 핑크', en: 'Rose Pink' },
  { id: '06', code: 'SPC-06', ko: '바이올렛 퍼플', en: 'Violet Purple' },
  { id: '07', code: 'SPC-07', ko: '스노우 화이트', en: 'Snow White' },
  { id: '08', code: 'SPC-08', ko: '듄 샌드', en: 'Dune Sand' },
  { id: '09', code: 'SPC-09', ko: '제이드 그린', en: 'Jade Green' },
  { id: '10', code: 'SPC-10', ko: '엠버 레드', en: 'Ember Red' },
  { id: '11', code: 'SPC-11', ko: '본 스켈레톤', en: 'Bone Skeleton' },
  { id: '12', code: 'SPC-12', ko: '글래시어 아이스', en: 'Glacier Ice' },
  { id: '13', code: 'SPC-13', ko: '펄 라벤더', en: 'Pearl Lavender' },
  { id: '14', code: 'SPC-14', ko: '크롬 실버', en: 'Chrome Silver' },
  { id: '15', code: 'SPC-15', ko: '골드 황금', en: 'Golden' },
  { id: '16', code: 'SPC-16', ko: '고대 석상', en: 'Ancient Stone' },
  { id: '17', code: 'SPC-17', ko: '심연 에메랄드', en: 'Abyssal' },
  { id: '18', code: 'SPC-18', ko: '먹구름 스톰', en: 'Stormcloud' },
  { id: '19', code: 'SPC-19', ko: '드림글로우', en: 'Dreamglow' },
  { id: '20', code: 'SPC-20', ko: '데몬 다크레드', en: 'Demon Red' },
  { id: '21', code: 'SPC-21', ko: '블레이즈 파이어', en: 'Blaze Fire' },
  { id: '22', code: 'SPC-22', ko: '리프 오션', en: 'Reef Ocean' },
];

const MOTION_STATE = {
  activeIdx: 0, // 0..21 index into MOTION_SPECIES_22
  sceneIdx: 0, // 0: 2D Run & Pit, 1: Transform, 2: Greet Friends, 3: Title Screen
  autoPlay: true,
  sceneStartTime: performance.now(),
  hero2DImg: null,
  hero2DLoaded: false,
  speciesSprites: new Map(), // '01'..'22' -> { img, loaded }
  menuHoverIdx: 0,
};

function ensureHero2DSprite() {
  if (MOTION_STATE.hero2DImg) return MOTION_STATE.hero2DImg;
  const img = new Image();
  img.onload = () => {
    MOTION_STATE.hero2DLoaded = true;
  };
  img.src = '/assets/motion_sprites/hero_2d.png?v=3.9.0';
  MOTION_STATE.hero2DImg = img;
  return img;
}

function ensureSpeciesSprite(spId) {
  const key = String(spId).padStart(2, '0');
  if (MOTION_STATE.speciesSprites.has(key)) {
    return MOTION_STATE.speciesSprites.get(key);
  }
  const entry = { img: null, loaded: false };
  MOTION_STATE.speciesSprites.set(key, entry);
  const img = new Image();
  img.onload = () => {
    entry.img = img;
    entry.loaded = true;
  };
  img.src = `/assets/motion_sprites/sp_${key}.png?v=3.9.0`;
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
      'SCENE 1/4 · 2D 펭귄 눈밭 산책 중 → 바나나 껍질 밟고 구덩이 추락!!',
      'SCENE 2/4 · 구덩이 속 강제 도트 변환 빔!! (매끈 2D → 각진 픽셀)',
      'SCENE 3/4 · 픽셀 월드 정모! 먼저 빠진 색깔별 도트 펭귄들과 둠칫둠칫',
      'SCENE 4/4 · PIXEL PENGUIN B급 타이틀 화면 (화면을 눌러보세요)',
    ];
    const labelsEn = [
      'SCENE 1/4 · 2D Penguin slips on a banana peel into the Pit!!',
      'SCENE 2/4 · Forced Pixelation Laser Beam!! (2D → Pixel)',
      'SCENE 3/4 · Pixel World Meetup! Dancing with 22 Species Friends',
      'SCENE 4/4 · PIXEL PENGUIN Retro Title Screen (Click to interact)',
    ];
    labelEl.textContent =
      CURRENT_LANG === 'ko' ? labelsKo[MOTION_STATE.sceneIdx] : labelsEn[MOTION_STATE.sceneIdx];
  }
}

// Select Hero Species (0..21) for the Motion Graphic Intro
function selectMotionPenguin(speciesIdxOrEdition, userInitiated = true) {
  let idx = Number(speciesIdxOrEdition);
  if (idx >= 0 && idx < MOTION_SPECIES_22.length) {
    MOTION_STATE.activeIdx = idx;
  } else {
    MOTION_STATE.activeIdx = (MOTION_STATE.activeIdx + 1) % MOTION_SPECIES_22.length;
  }
  const sp = MOTION_SPECIES_22[MOTION_STATE.activeIdx];
  ensureSpeciesSprite(sp.id);

  document.querySelectorAll('.dock-penguin-btn').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.spidx) === MOTION_STATE.activeIdx);
  });

  const titleEl = document.getElementById('spot-title');
  if (titleEl) {
    titleEl.textContent =
      CURRENT_LANG === 'ko'
        ? `[${sp.id}] ${sp.ko} (${sp.code})`
        : `[${sp.id}] ${sp.en} (${sp.code})`;
  }

  const hudCoords = document.getElementById('motion-hud-coords');
  if (hudCoords) {
    hudCoords.textContent = `SPECIES: [${sp.id}] ${sp.ko}`;
  }

  const nextBtn = document.getElementById('btn-motion-next');
  if (nextBtn) {
    const span = nextBtn.querySelector('span');
    if (span) {
      span.textContent =
        CURRENT_LANG === 'ko'
          ? `주인공 색깔 바꾸기 (${sp.ko} → 다음)`
          : `Change Species (${sp.en} → Next)`;
    }
  }
}

// Helper: Draw the Uploaded 2D Full-Body Hero Penguin (Image 2: hero_2d.png) with B-grade bounce/spin
function drawUploaded2DPenguin(ctx, cx, cy, size, angleRad, isShocked) {
  const img = ensureHero2DSprite();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  if (MOTION_STATE.hero2DLoaded && img) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  }
  // B-grade comic sweat drops & shock lines when slipping/falling!
  if (isShocked) {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(-size * 0.42, -size * 0.28, 5, 9, -0.4, 0, Math.PI * 2);
    ctx.ellipse(size * 0.42, -size * 0.25, 5, 9, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-size * 0.35, -size * 0.48);
    ctx.lineTo(-size * 0.48, -size * 0.62);
    ctx.moveTo(0, -size * 0.52);
    ctx.lineTo(0, -size * 0.68);
    ctx.moveTo(size * 0.35, -size * 0.48);
    ctx.lineTo(size * 0.48, -size * 0.62);
    ctx.stroke();
  }
  ctx.restore();
}

// Helper: Draw a Retro Pixel Speech Bubble (Scaled up for crisp Mobile legibility)
function drawRetroSpeechBubble(ctx, x, y, text, borderColor = '#ff4d6d', isDark = false) {
  ctx.save();
  ctx.font = '900 16px "Pretendard", "Malgun Gothic", sans-serif';
  const padX = 14;
  const tw = Math.ceil(ctx.measureText(text).width);
  const bw = tw + padX * 2;
  const bh = 34;
  const clampedX = Math.max(bw / 2 + 12, Math.min(960 - bw / 2 - 12, x));
  const bx = Math.round((clampedX - bw / 2) / 2) * 2;
  const by = Math.max(10, Math.round((y - bh) / 2) * 2);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(bx + 4, by + 4, bw, bh);

  ctx.fillStyle = borderColor;
  ctx.fillRect(bx - 3, by - 3, bw + 6, bh + 6);

  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(bx, by, bw, bh);

  ctx.fillStyle = borderColor;
  ctx.fillRect(clampedX - 5, by + bh + 3, 10, 4);
  ctx.fillRect(clampedX - 3, by + bh + 7, 6, 4);
  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(clampedX - 3, by + bh, 6, 4);

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

// Helper: Draw the 16-Bit Side-Scrolling Pixel Penguin World Background
function drawRetroPixelWorldBackground(ctx, now) {
  const P = 4;
  const snap = (v) => Math.floor(v / P) * P;

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

  for (let i = 1; i < skyBands.length; i++) {
    const by = skyBands[i].y;
    ctx.fillStyle = skyBands[i - 1].color;
    for (let x = 0; x < 960; x += P * 2) {
      ctx.fillRect(x, by, P, P);
    }
  }

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

  // Distant Pixel Snow Mountain
  ctx.fillStyle = '#8aa8d6';
  for (let step = 0; step < 18; step++) {
    const mw = (18 - step) * P * 4;
    ctx.fillRect(snap(250 - mw / 2), snap(308 - step * P * 2), mw, P * 2);
  }
  ctx.fillStyle = '#f1f7ff';
  for (let step = 11; step < 18; step++) {
    const mw = (18 - step) * P * 4;
    ctx.fillRect(snap(250 - mw / 2), snap(308 - step * P * 2), mw, P * 2);
  }

  // Distant Pixel Tower
  const tx = snap(468);
  const ty = snap(196);
  ctx.fillStyle = '#d6c7db';
  ctx.fillRect(tx, ty + P * 6, P * 7, P * 18);
  ctx.fillStyle = '#f4eff8';
  ctx.fillRect(tx + P, ty + P * 6, P * 4, P * 18);
  ctx.fillStyle = '#e06388';
  for (let s = 0; s < 6; s++) {
    ctx.fillRect(tx + s * P * 0.5, ty + (5 - s) * P, P * (7 - s), P);
  }
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(tx + P * 3, ty - P * 3, P * 3, P * 2);

  // Rolling Hills
  ctx.fillStyle = '#68b684';
  ctx.fillRect(0, 304, 960, 48);
  for (let x = 0; x < 960; x += P * 12) {
    const hillH = ((x / 48) % 3) * P * 2 + P * 2;
    ctx.fillRect(x, 304 - hillH, P * 10, hillH);
  }

  // Pixel River
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

  // Cherry-Blossom Pixel Trees
  const drawCherryTree = (treeX, treeY) => {
    const x = snap(treeX);
    const y = snap(treeY);
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(x - P * 2, y - P * 12, P * 4, P * 12);
    ctx.fillStyle = '#8d5b38';
    ctx.fillRect(x - P, y - P * 12, P * 2, P * 12);
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

  // Foreground Grass & Path
  ctx.fillStyle = '#3b8c5a';
  ctx.fillRect(0, 380, 960, 160);
  ctx.fillStyle = '#52b768';
  ctx.fillRect(0, 380, 960, 20);
  for (let x = 0; x < 960; x += P * 4) {
    ctx.fillRect(x, 400, P * 2, P * 2);
  }
  ctx.fillStyle = '#e9d8a6';
  ctx.fillRect(0, 412, 960, 74);
  ctx.fillStyle = '#f4e8c1';
  ctx.fillRect(0, 416, 960, 62);
  for (let fx = 36; fx < 940; fx += 92) {
    ctx.fillStyle = fx % 184 === 36 ? '#ff4d6d' : '#fbbf24';
    ctx.fillRect(fx, 390, P * 2, P * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + P, 390, P, P);
  }
}

// Helper: Update the Crisp HTML RPG Dialogue Box below the Canvas (100% legible on Mobile & Desktop!)
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

function initPixelMotionStudio() {
  const canvas = document.getElementById('pixel-stage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Preload 2D Hero Penguin (Image 2) and all 22 Species Full-Body Pixel Penguins (Image 1 recolors)
  ensureHero2DSprite();
  MOTION_SPECIES_22.forEach((sp) => ensureSpeciesSprite(sp.id));

  // Build 22 Species Full-Body Selector Dock (#curator-dock-grid) — Exact 11x2 = 22 Grid!
  const dockGrid = document.getElementById('curator-dock-grid');
  if (dockGrid) {
    dockGrid.innerHTML = MOTION_SPECIES_22.map((sp, idx) => {
      const thumbSrc = `/assets/motion_sprites/sp_${sp.id}.png?v=3.9.0`;
      return `
        <button type="button" class="dock-penguin-btn ${idx === 0 ? 'active' : ''}" data-spidx="${idx}" title="${escapeHtml(sp.ko)} (${sp.code})">
          <img src="${thumbSrc}" alt="${escapeHtml(sp.ko)}" class="pixelated" style="background:transparent;" loading="lazy" />
          <span class="dock-id">${sp.code}</span>
          <span class="dock-label" data-ko="${escapeHtml(sp.ko)}" data-en="${escapeHtml(sp.en)}">${escapeHtml(sp.ko)}</span>
        </button>
      `;
    }).join('');

    dockGrid.querySelectorAll('.dock-penguin-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectMotionPenguin(Number(btn.dataset.spidx), true);
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

  // HTML Dialogue Next Scene Button
  document.getElementById('intro-dialogue-next-btn')?.addEventListener('click', () => {
    setIntroScene((MOTION_STATE.sceneIdx + 1) % 4, true);
  });

  // Replay Full Intro Button
  document.getElementById('btn-pixel-burst')?.addEventListener('click', () => {
    MOTION_STATE.autoPlay = true;
    const autoBtn = document.getElementById('btn-motion-autoplay');
    autoBtn?.classList.add('active-toggle');
    const lblEl = document.getElementById('autoplay-label');
    if (lblEl) {
      lblEl.textContent = CURRENT_LANG === 'ko' ? '자동재생: ON' : 'Auto: ON';
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
          ? `자동재생: ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`
          : `Auto: ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`;
    }
  });

  // Switch Hero Species Color Button
  document.getElementById('btn-motion-next')?.addEventListener('click', () => {
    const nextIdx = (MOTION_STATE.activeIdx + 1) % MOTION_SPECIES_22.length;
    selectMotionPenguin(nextIdx, true);
  });

  // Canvas Click Interaction
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (MOTION_STATE.sceneIdx === 3) {
      if (mx >= 300 && mx <= 660 && my >= 195 && my <= 235) {
        scrollToSection('tab-codex');
        return;
      }
      if (mx >= 300 && mx <= 660 && my >= 236 && my <= 270) {
        const nextIdx = (MOTION_STATE.activeIdx + 1) % MOTION_SPECIES_22.length;
        selectMotionPenguin(nextIdx, true);
        return;
      }
      if (mx >= 300 && mx <= 660 && my >= 271 && my <= 310) {
        setIntroScene(0, true);
        return;
      }
    }
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

  selectMotionPenguin(0, false);
  setIntroScene(0, true);

  // Main 60 FPS Cutscene Loop
  function renderIntroCutscene(now) {
    const heroSp = MOTION_SPECIES_22[MOTION_STATE.activeIdx] || MOTION_SPECIES_22[0];
    const heroPixelEntry = ensureSpeciesSprite(heroSp.id);

    let elapsed = now - MOTION_STATE.sceneStartTime;
    const curDuration = SCENE_DURATIONS[MOTION_STATE.sceneIdx] || 4800;

    if (MOTION_STATE.autoPlay && elapsed >= curDuration) {
      setIntroScene((MOTION_STATE.sceneIdx + 1) % 4, true);
      elapsed = 0;
    }

    const p = Math.min(1, Math.max(0, elapsed / curDuration));
    ctx.clearRect(0, 0, 960, 540);

    // ========================================================================
    // SCENE 0: Uploaded 2D Penguin (Image 2) waddles -> slips on banana -> falls in pit!
    // ========================================================================
    if (MOTION_STATE.sceneIdx === 0) {
      // Bright B-grade cartoon sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 380);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.65, '#93c5fd');
      skyGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 960, 380);

      // Goofy B-grade smiling sun in top-left sky
      ctx.save();
      ctx.translate(115, 78);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ca8a04';
      ctx.stroke();
      ctx.fillStyle = '#713f12';
      ctx.fillRect(-12, -8, 6, 6);
      ctx.fillRect(6, -8, 6, 6);
      ctx.beginPath();
      ctx.arc(0, 6, 10, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      // Soft 2D snow hills
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(240, 375, 180, Math.PI, 0);
      ctx.arc(540, 375, 210, Math.PI, 0);
      ctx.fill();

      // 2D Snow Ground with a deep Pixel Pit at x = 605..805
      const pitLeft = 605;
      const pitRight = 805;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 365, pitLeft, 175);
      ctx.fillRect(pitRight, 365, 960 - pitRight, 175);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, 388, pitLeft, 152);
      ctx.fillRect(pitRight, 388, 960 - pitRight, 152);

      // Glowing Pixel Portal Pit (구덩이)
      const pitGrad = ctx.createLinearGradient(0, 365, 0, 540);
      pitGrad.addColorStop(0, '#090812');
      pitGrad.addColorStop(0.5, '#1e1b4b');
      pitGrad.addColorStop(1, '#ff4d6d');
      ctx.fillStyle = pitGrad;
      ctx.fillRect(pitLeft, 365, pitRight - pitLeft, 175);

      // Rising pixel blocks from the pit
      for (let i = 0; i < 16; i++) {
        const px = pitLeft + 14 + ((i * 37) % (pitRight - pitLeft - 28));
        const py = 520 - (((now * 0.14 + i * 29) % 165) | 0);
        ctx.fillStyle = i % 3 === 0 ? '#fbbf24' : i % 2 === 0 ? '#67e8f9' : '#ff4d6d';
        ctx.fillRect(px, py, 10, 10);
      }

      // Crooked B-grade wooden signpost before the pit
      ctx.save();
      ctx.translate(510, 365);
      ctx.rotate(-0.08);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-5, -58, 10, 58);
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 3;
      ctx.fillRect(-72, -88, 144, 34);
      ctx.strokeRect(-72, -88, 144, 34);
      ctx.fillStyle = '#991b1b';
      ctx.font = '900 12px "Pretendard", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ 절대 빠지지 마시오!', 0, -67);
      ctx.restore();

      // Goofy Banana Peel / Rock right at x = 576
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(576, 362, 14, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // 2D Hero Penguin (Image 2: hero_2d.png) animation:
      // Phase A (p = 0..0.46): Waddling happily from x=95 to x=566
      // Phase B (p = 0.46..0.70): Slips! Cartwheels in an arc into the pit center x=705
      // Phase C (p = 0.70..1.0): Plunges down inside the pit
      const runPhase = now * 0.022;
      let pengX = 100;
      let pengY = 302;
      let pengRot = 0;
      let isShocked = false;

      if (p < 0.46) {
        const subP = p / 0.46;
        pengX = 95 + subP * 470;
        pengY = 300 - Math.abs(Math.sin(runPhase)) * 16;
        pengRot = Math.sin(runPhase * 0.7) * 0.12;
      } else if (p < 0.70) {
        const subP = (p - 0.46) / 0.24;
        pengX = 565 + subP * 140;
        pengY = 300 - Math.sin(subP * Math.PI) * 95 + subP * 25;
        pengRot = subP * Math.PI * 2.2; // hilarious B-grade 396-degree flip!
        isShocked = true;

        if (subP < 0.5) {
          ctx.fillStyle = '#ef4444';
          ctx.font = '900 20px "Pretendard", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('💥 미끄덩!!', 576, 326);
        }
      } else {
        const subP = (p - 0.70) / 0.30;
        pengX = 705;
        pengY = 325 + subP * subP * 250;
        pengRot = Math.PI * 2.2 + subP * Math.PI * 1.5;
        isShocked = true;
      }

      // Shadow on snow before pit
      if (pengX < pitLeft) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.beginPath();
        ctx.ellipse(pengX, 368, 42, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Clip so penguin falls inside the pit
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 960, 458);
      ctx.clip();
      drawUploaded2DPenguin(ctx, pengX, pengY, 148, pengRot, isShocked);
      ctx.restore();

      if (p < 0.45) {
        drawRetroSpeechBubble(
          ctx,
          pengX,
          pengY - 82,
          CURRENT_LANG === 'ko'
            ? '룰루랄라~ 매끈한 2D 펭귄 산책 개꿀~ ♪'
            : 'La la la~ Smooth 2D Penguin walk~ ♪',
          '#0284c7'
        );
      } else if (p < 0.88) {
        drawRetroSpeechBubble(
          ctx,
          Math.min(720, pengX),
          Math.max(96, pengY - 84),
          CURRENT_LANG === 'ko'
            ? '어익후?! 구덩이다!! 엄마야아아아~!!'
            : 'WHOA?! A PIT!! MOMMYYYY~!!',
          '#ff4d6d'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 1 · 추락',
        CURRENT_LANG === 'ko'
          ? '픽셀월드 가기 전 매끈했던 2D 주인공 펭귄! 신나게 달리다 구덩이에 빠지고 말았는데...'
          : 'Our smooth 2D hero penguin was running happily, slipped right into a pit...'
      );
    }

    // ========================================================================
    // SCENE 1: Warp Tunnel -> Laser scans Image 2 (2D) into Image 1 (Full-Body Pixel)!
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 1) {
      ctx.fillStyle = '#090814';
      ctx.fillRect(0, 0, 960, 540);

      const scrollY = (now * 0.28) % 32;
      for (let y = -32; y < 540; y += 32) {
        const wy = Math.round(y + scrollY);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(140, wy, 680, 2);
        ctx.fillStyle = ((y / 32) & 1) === 0 ? '#ff4d6d' : '#67e8f9';
        ctx.fillRect(116, wy, 20, 24);
        ctx.fillRect(824, wy, 20, 24);
      }

      for (let i = 0; i < 28; i++) {
        const bx = 170 + ((i * 73) % 620);
        const by = 520 - (((now * 0.35 + i * 47) % 520) | 0);
        ctx.fillStyle = i % 3 === 0 ? '#fbbf24' : i % 2 === 0 ? '#67e8f9' : '#ff4d6d';
        ctx.fillRect(bx, by, 10, 10);
      }

      const centerX = 480;
      const centerY = 240 + Math.sin(now * 0.008) * 10;
      const charSize = 216;

      if (p < 0.34) {
        // Tumbling 2D Hero Penguin (Image 2)
        drawUploaded2DPenguin(ctx, centerX, centerY, charSize, Math.sin(now * 0.015) * 0.45, true);
        drawRetroSpeechBubble(
          ctx,
          centerX,
          centerY - 118,
          CURRENT_LANG === 'ko'
            ? '어어어?! 내 매끈한 2D 몸매가 왜 이래?!!'
            : 'Whoa?! What is happening to my smooth 2D body?!!',
          '#fbbf24'
        );
      } else if (p < 0.68) {
        // Split-screen laser scan: Bottom is Image 2 (2D), Top is Image 1 (Full-Body Pixel)!
        const morphP = (p - 0.34) / 0.34;
        const splitY = centerY - charSize / 2 + morphP * charSize;

        // Bottom half: Uploaded 2D Penguin
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, splitY, 960, 540 - splitY);
        ctx.clip();
        drawUploaded2DPenguin(ctx, centerX, centerY, charSize, 0, true);
        ctx.restore();

        // Top half: Full-Body Recolored Pixel Penguin!
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 960, splitY);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        if (heroPixelEntry.loaded && heroPixelEntry.img) {
          ctx.drawImage(
            heroPixelEntry.img,
            centerX - charSize / 2,
            centerY - charSize / 2,
            charSize,
            charSize
          );
        }
        ctx.restore();

        // Chunky B-grade Laser Beam
        ctx.fillStyle = '#ff4d6d';
        ctx.fillRect(centerX - 150, splitY - 6, 300, 12);
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(centerX - 140, splitY - 3, 280, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX - 130, splitY - 1, 260, 2);

        drawRetroSpeechBubble(
          ctx,
          centerX,
          centerY - 122,
          CURRENT_LANG === 'ko'
            ? `⚡ 삐리릭—! 강제 도트 변환기 가동 중 (${Math.round(morphP * 100)}%)`
            : `⚡ BZZT—! Forced Pixelation Beam (${Math.round(morphP * 100)}%)`,
          '#67e8f9',
          true
        );
      } else {
        // 100% Transformed into Full-Body Pixel Penguin!
        const ringP = (p - 0.68) / 0.32;
        const ringR = Math.round((70 + ringP * 135) / 6) * 6;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.strokeRect(centerX - ringR, centerY - ringR, ringR * 2, ringR * 2);

        const bounce = Math.floor(now / 210) % 2 === 0 ? 0 : -10;
        ctx.imageSmoothingEnabled = false;
        if (heroPixelEntry.loaded && heroPixelEntry.img) {
          ctx.drawImage(
            heroPixelEntry.img,
            centerX - charSize / 2,
            centerY - charSize / 2 + bounce,
            charSize,
            charSize
          );
        }

        drawPixelHeart(ctx, centerX - 125, centerY - 45 + bounce, 4, '#ff4d6d');
        drawPixelHeart(ctx, centerX + 125, centerY - 45 + bounce, 4, '#fbbf24');

        drawRetroSpeechBubble(
          ctx,
          centerX,
          centerY - 118 + bounce,
          CURRENT_LANG === 'ko'
            ? `헐... 각진 도트 몸매(${heroSp.ko}) 오히려 좋아?!`
            : `Whoa... Chunky pixel body (${heroSp.en}) actually looks great?!`,
          '#ff4d6d'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 2 · 도트화',
        CURRENT_LANG === 'ko'
          ? `구덩이 속 강제 도트 변환 빔을 맞고 전신 픽셀 펭귄(${heroSp.ko})으로 다시 태어났다!`
          : `Zapped by the pit's pixelation beam and reborn as a full-body Pixel Penguin (${heroSp.en})!`
      );
    }

    // ========================================================================
    // SCENE 2: Pixel World Meetup — Full-Body Recolored Species Penguins (NO NFT boxes!)
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 2) {
      drawRetroPixelWorldBackground(ctx, now);

      ctx.imageSmoothingEnabled = false;
      const spriteSize = 142;
      const groundY = 308;

      // Hero drops onto the grass on the left (x = 140)
      const landP = Math.min(1, p / 0.18);
      const heroHop = landP >= 1 ? (Math.floor(now / 240) % 2 === 0 ? 0 : -10) : 0;
      const heroX = 140;
      const heroY = landP < 1 ? -140 + landP * (groundY + 140) : groundY + heroHop;

      // Oval pixel shadow under Hero's orange feet
      ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
      ctx.fillRect(heroX + 34, groundY + spriteSize - 12, spriteSize - 68, 10);

      if (heroPixelEntry.loaded && heroPixelEntry.img) {
        // Flip horizontally so our Hero faces right toward the 5 friends!
        ctx.save();
        ctx.translate(heroX + spriteSize, heroY);
        ctx.scale(-1, 1);
        ctx.drawImage(heroPixelEntry.img, 0, 0, spriteSize, spriteSize);
        ctx.restore();
      }

      // 5 Full-Body Recolored Species Penguin Friends on the right!
      const friendCandidateIds = ['05', '04', '09', '06', '15', '02'].filter(
        (id) => id !== heroSp.id
      );
      const friendIds = friendCandidateIds.slice(0, 5);

      const friendGreetingsKo = [
        '야 너도 바나나 밟고 빠졌냐?! ㅋㅋ 어서와!',
        '여긴 사도 아무 혜택 없는 픽셀 월드야 ♥',
        '로드맵 그딴 거 없고 다 같이 둠칫둠칫 놀자!',
        '우와 도트 기가 막히게 잘 찍혔네! 반가워~!',
        '베리챗 6각형 프사 달고 온 동네방네 몰려다니자!',
      ];
      const friendGreetingsEn = [
        'Did you slip on the banana too?! Haha welcome!',
        'Welcome to the Zero-Perks Pixel World ♥',
        'No roadmap here—just bounce and vibe together!',
        'Look at those crisp pixels! Nice to meet you~!',
        "Let's flood VeryChat with hexagon penguin PFPs!",
      ];

      const walkInP = Math.min(1, p / 0.26);
      friendIds.forEach((fid, idx) => {
        const fEntry = ensureSpeciesSprite(fid);
        const fMeta = MOTION_SPECIES_22.find((s) => s.id === fid) || MOTION_SPECIES_22[0];
        const targetX = 348 + idx * 114;
        const fx = Math.round(targetX + (1 - walkInP) * 150);
        const fHop = Math.floor((now + idx * 130) / 240) % 2 === 0 ? 0 : -10;
        const fy = groundY + fHop;

        // Shadow under feet
        ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
        ctx.fillRect(fx + 34, groundY + spriteSize - 12, spriteSize - 68, 10);

        if (fEntry.loaded && fEntry.img) {
          // Default Image 1 looks slightly right; keep or flip so they face left toward Hero
          ctx.drawImage(fEntry.img, fx, fy, spriteSize, spriteSize);
        }

        // Species color tag below feet
        ctx.fillStyle = 'rgba(11, 16, 33, 0.84)';
        ctx.fillRect(fx + 26, groundY + spriteSize - 4, 90, 18);
        ctx.fillStyle = '#67e8f9';
        ctx.font = '900 11px "Pretendard", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          CURRENT_LANG === 'ko' ? fMeta.ko : fMeta.en,
          fx + 71,
          groundY + spriteSize + 9
        );
      });

      // Pixel Hearts floating between Hero and Friends
      drawPixelHeart(ctx, 305, 330 - ((now * 0.04) % 45), 3, '#ff4d6d');
      drawPixelHeart(ctx, 328, 350 - (((now + 500) * 0.04) % 45), 3, '#fbbf24');

      if (p > 0.16) {
        drawRetroSpeechBubble(
          ctx,
          heroX + spriteSize / 2 + 12,
          heroY - 4,
          CURRENT_LANG === 'ko'
            ? '야!! 너네도 그 구덩이로 빠졌냐?! 반갑다!!'
            : 'HEY!! Did you guys fall in that pit too?! Hi!!',
          '#38bdf8'
        );

        const activeFriendIdx = Math.floor(((p - 0.16) / 0.84) * 3) % friendIds.length;
        const speakerX = 348 + activeFriendIdx * 114 + spriteSize / 2;
        const msg =
          CURRENT_LANG === 'ko'
            ? friendGreetingsKo[activeFriendIdx]
            : friendGreetingsEn[activeFriendIdx];
        drawRetroSpeechBubble(ctx, speakerX, groundY - 18, msg, '#ff4d6d');
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 3 · 픽셀월드',
        CURRENT_LANG === 'ko'
          ? '픽셀 월드에 떨어지자 먼저 빠져서 살고 있던 색깔별 도트 펭귄들이 몰려와 둠칫둠칫 인사한다!'
          : 'Landing in Pixel World, the full-body pixel penguin friends gather around to bounce and say hi!'
      );
    }

    // ========================================================================
    // SCENE 3: Retro 16-Bit Game Title Screen with 7 Full-Body Species Penguins!
    // ========================================================================
    else {
      drawRetroPixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      const titleBounce = Math.floor(now / 480) % 2 === 0 ? 0 : -4;
      const titleY = 64 + titleBounce;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 54px "Courier New", "Pretendard", monospace';

      ctx.fillStyle = '#4a153b';
      for (let ox = -4; ox <= 4; ox += 2) {
        for (let oy = -4; oy <= 8; oy += 2) {
          ctx.fillText('PIXEL   PENGUIN', 480 + ox, titleY + oy);
        }
      }
      ctx.fillStyle = '#ff5c8a';
      ctx.fillText('PIXEL   PENGUIN', 480, titleY + 3);
      ctx.fillStyle = '#ffe5ec';
      ctx.fillText('PIXEL   PENGUIN', 480, titleY);

      drawPixelHeart(ctx, 456, titleY + 2, 6, '#fbbf24');
      drawPixelHeart(ctx, 456, titleY + 2, 4, '#ff4d6d');

      const rbW = 320;
      const rbH = 26;
      const rbX = 480 - rbW / 2;
      const rbY = titleY + 40;
      ctx.fillStyle = '#4a153b';
      ctx.fillRect(rbX - 3, rbY - 3, rbW + 6, rbH + 6);
      ctx.fillStyle = '#ff758f';
      ctx.fillRect(rbX, rbY, rbW, rbH);
      ctx.fillStyle = '#fff0f3';
      ctx.font = '900 13.5px "Pretendard", monospace';
      ctx.fillText('★ 펭귄이 난무하는 베리챗 픽셀 월드 ★', 480, rbY + rbH / 2 + 1);
      ctx.restore();

      // Center RPG Command Box
      const menuW = 384;
      const menuH = 114;
      const menuX = 480 - menuW / 2;
      const menuY = 186;

      ctx.fillStyle = '#090b14';
      ctx.fillRect(menuX - 6, menuY - 6, menuW + 12, menuH + 12);
      ctx.fillStyle = '#f4a261';
      ctx.fillRect(menuX - 3, menuY - 3, menuW + 6, menuH + 6);
      ctx.fillStyle = '#141829';
      ctx.fillRect(menuX, menuY, menuW, menuH);

      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(menuX + 4, menuY + 4, 4, 4);
      ctx.fillRect(menuX + menuW - 8, menuY + 4, 4, 4);
      ctx.fillRect(menuX + 4, menuY + menuH - 8, 4, 4);
      ctx.fillRect(menuX + menuW - 8, menuY + menuH - 8, 4, 4);

      const menuItems =
        CURRENT_LANG === 'ko'
          ? [
              'START PIXEL WORLD (10,000마리 도감도)',
              `CHANGE COLOR (주인공: ${heroSp.ko})`,
              'REPLAY INTRO (인트로 처음부터 보기)',
            ]
          : [
              'START PIXEL WORLD (Open 10K Codex)',
              `CHANGE COLOR (Hero: ${heroSp.en})`,
              'REPLAY INTRO (Watch Cutscene)',
            ];

      menuItems.forEach((mText, idx) => {
        const rowY = menuY + 26 + idx * 31;
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

      // Bottom Lineup of 7 Full-Body Species Penguins Standing & Bouncing on the Grass!
      const lineupIds = ['02', '04', '05', heroSp.id, '09', '06', '15'];
      const pSize = 126;
      const startX = 56;
      const gapX = 120;
      const baseLineY = 326;

      lineupIds.forEach((sid, idx) => {
        const spEntry = ensureSpeciesSprite(sid);
        const lx = startX + idx * gapX;
        const isHeroCenter = idx === 3;
        const hop = Math.floor((now + idx * 140) / 260) % 2 === 0 ? 0 : -8;
        const ly = baseLineY + hop - (isHeroCenter ? 8 : 0);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(lx + 30, baseLineY + pSize - 10, pSize - 60, 9);

        if (spEntry.loaded && spEntry.img) {
          ctx.drawImage(spEntry.img, lx, ly, pSize, pSize);
        }

        if (isHeroCenter) {
          drawRetroSpeechBubble(
            ctx,
            lx + pSize / 2,
            ly - 2,
            CURRENT_LANG === 'ko'
              ? `${heroSp.ko} · 픽셀 월드 시작!`
              : `${heroSp.en} · Pixel World Start!`,
            '#fbbf24'
          );
        }
      });

      drawRetroDialogueBar(
        ctx,
        'PIXEL WORLD',
        CURRENT_LANG === 'ko'
          ? '그렇게 시작된 픽셀 펭귄 월드! 아래 22종 색깔 버튼을 눌러 주인공 펭귄 색을 바꿔보세요.'
          : 'And so begins the Pixel Penguin World! Click any of the 22 species below to change colors.'
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

  const activeSp = MOTION_SPECIES_22[MOTION_STATE.activeIdx];
  if (activeSp) {
    const titleEl = document.getElementById('spot-title');
    if (titleEl) {
      titleEl.textContent =
        lang === 'ko'
          ? `[${activeSp.id}] ${activeSp.ko} (${activeSp.en})`
          : `[${activeSp.id}] ${activeSp.en}`;
    }
    const nextBtn = document.getElementById('btn-motion-next');
    if (nextBtn) {
      nextBtn.innerHTML =
        lang === 'ko'
          ? `주인공 색깔 바꾸기 (${activeSp.ko})`
          : `Change Color (${activeSp.en})`;
    }
  }
  setIntroScene(MOTION_STATE.sceneIdx, false);
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
    if (tierEl) {
      tierEl.textContent = tok.tier;
      tierEl.className = `tier-${tok.tier}`;
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
        const id = `P${String(num).padStart(5, '0')}`;
        const src = num <= 11 ? `/assets/specials/${num}_fast.gif` : `/img/${id}.png`;
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
          <span class="rank-pill">Rank #${sp.rarity_rank}</span>
        </div>
      </div>
      <div class="nft-card-meta">
        <span>${sp.id}</span>
        <span>#${sp.edition}</span>
      </div>
      <div class="nft-card-title">${escapeHtml(sp.archetype)}</div>
      <div class="nft-card-footer">
        <span class="score-tag">1-of-1 GIF</span>
        <span class="score-tag" style="color:var(--accent-cyan); font-weight:800;">${Number(sp.rarity_score).toLocaleString()} pts</span>
      </div>
    </button>
  `
    )
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
      span.textContent = CURRENT_LANG === 'ko' ? `🎛️ 파츠 필터 (${activeCount}개 적용)` : `🎛️ Filters (${activeCount})`;
      toggleBtn.classList.add('active-toggle');
    } else {
      span.textContent = CURRENT_LANG === 'ko' ? '🎛️ 파츠 필터 (9종)' : '🎛️ Trait Filters (9)';
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
    return `
      <div class="trait-select-box">
        <label for="filter-cat-${cat}">${CAT_LABELS_KO[cat] || cat}</label>
        <select id="filter-cat-${cat}" data-cat="${cat}" class="filter-select exp-cat-select" style="padding:7px 8px; font-size:12px;">
          <option value="">전체 (All)</option>
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
              <span class="rank-pill">Rank #${item.rarity_rank}</span>
            </div>
          </div>
          <div class="nft-card-title">${escapeHtml(subtitle)}</div>
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
    const isSpecial = tok.edition <= 11;

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
          <span class="pill-tag">Rank #${tok.rarity_rank} / 10,000</span>
          <span class="pill-tag gold">${Number(tok.rarity_score).toLocaleString()} pts</span>
        </div>

        <h2 id="modal-token-title" style="font-size:22px; font-weight:900; margin-bottom:10px;">${escapeHtml(tok.name)}</h2>

        <div class="spec-rows-stack" style="margin-bottom:12px;">
          <div class="spec-row">
            <span class="spec-label">번호 (Token ID)</span>
            <span class="spec-value">${tok.id} (#${tok.edition})</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">희귀도 순위 · 점수 (rarity.tools)</span>
            <span class="spec-value" style="color:var(--accent-cyan);">Rank #${tok.rarity_rank} (${Number(tok.rarity_score).toLocaleString()} pts)</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">장착 파츠 수 (특성 개수 점수)</span>
            <span class="spec-value">${tok.active_trait_stat.active_count}개 (${tok.active_trait_stat.pct}% · +${Number(tok.active_trait_stat.score).toLocaleString()} pts)</span>
          </div>
        </div>

        <h4 style="font-size:13.5px; font-weight:800; margin-bottom:6px;">파츠별 rarity.tools 점수 (전체 수 10,000 ÷ 보유 수)</h4>
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
    if (sortEl) sortEl.value = 'rank_asc';
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
    loadPfpPreview(4442);
    fetchExplorerTokens();
  } catch (err) {
    console.error('Failed to initialize config:', err);
  }
});
