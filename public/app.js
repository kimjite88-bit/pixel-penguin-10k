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
      'SCENE 1/4 · 평화로운 2D 눈밭 산책 → 바나나 밟고 도트 벼랑 추락!!',
      'SCENE 2/4 · 차원 워프 터널! 매끈한 2D 몸매 → 48×48 도트 강제 재조립!!',
      'SCENE 3/4 · 픽셀 월드 도착! 먼저 빠진 도트 펭귄 친구들과 둠칫둠칫 환영식',
      'SCENE 4/4 · PIXEL PENGUIN WORLD — 베리챗 도트 펭귄 10,000마리',
    ];
    const labelsEn = [
      'SCENE 1/4 · Peaceful 2D Snow Walk → Banana Slip into the Pixel Chasm!!',
      'SCENE 2/4 · Dimensional Warp! Smooth 2D → 48×48 Pixel Reconstruction!!',
      'SCENE 3/4 · Welcome to Pixel World! Bouncing with Pixel Penguin Friends',
      'SCENE 4/4 · PIXEL PENGUIN WORLD — 10,000 VeryChat Pixel Penguins',
    ];
    labelEl.textContent =
      CURRENT_LANG === 'ko' ? labelsKo[MOTION_STATE.sceneIdx] : labelsEn[MOTION_STATE.sceneIdx];
  }
}

// Keep selectMotionPenguin as a clean no-op / hero-blue loader for compatibility
function selectMotionPenguin() {
  MOTION_STATE.activeIdx = 0;
  ensureSpeciesSprite('05');
}

// Offscreen Mosaic Canvas for real-time 2D -> Chunky Pixel block transition in Scene 2
let MOSAIC_CANVAS = null;
let MOSAIC_CTX = null;
function drawMosaic2DPenguin(ctx, cx, cy, size, blockCount = 16) {
  const img = ensureHero2DSprite();
  if (!MOTION_STATE.hero2DLoaded || !img) return;
  if (!MOSAIC_CANVAS) {
    MOSAIC_CANVAS = document.createElement('canvas');
    MOSAIC_CTX = MOSAIC_CANVAS.getContext('2d');
  }
  const b = Math.max(8, Math.min(48, Math.round(blockCount)));
  MOSAIC_CANVAS.width = b;
  MOSAIC_CANVAS.height = b;
  MOSAIC_CTX.clearRect(0, 0, b, b);
  MOSAIC_CTX.imageSmoothingEnabled = true;
  MOSAIC_CTX.drawImage(img, 0, 0, b, b);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(MOSAIC_CANVAS, cx - size / 2, cy - size / 2, size, size);
  ctx.restore();
}

// Helper: Draw the Uploaded 2D Full-Body Hero Penguin (hero_2d.png) with squash-and-stretch & comic flair
function drawUploaded2DPenguin(ctx, cx, cy, size, angleRad = 0, scaleX = 1, scaleY = 1) {
  const img = ensureHero2DSprite();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.scale(scaleX, scaleY);
  if (MOTION_STATE.hero2DLoaded && img) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  }
  ctx.restore();
}

// Helper: Draw a Comic Spiky Impact Starburst (for banana slip & transformations)
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
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeCol;
    ctx.stroke();
  }
  ctx.restore();
}

// Helper: Draw a proper 3-Petal Cartoon Banana Peel (NO cheap half-circle!)
function drawCartoonBananaPeel(ctx, x, y, angle = 0, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#713f12';
  ctx.fillStyle = '#facc15';

  // Left splayed peel petal
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(-18, -12, -26, 6);
  ctx.quadraticCurveTo(-12, 10, -3, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right splayed peel petal
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(18, -12, 26, 6);
  ctx.quadraticCurveTo(12, 10, 3, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Center forward peel petal
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(-4, -10);
  ctx.quadraticCurveTo(0, -20, 4, -10);
  ctx.quadraticCurveTo(9, 6, 0, 12);
  ctx.quadraticCurveTo(-9, 6, -4, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dark brown banana stem tip at top
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-3, -17, 6, 5);
  ctx.restore();
}

// Helper: Draw a 3D Isometric Voxel Cube (for Scene 1 Pit & Scene 2 Warp Vortex)
function drawIsoVoxelCube(ctx, cx, cy, r, topCol, leftCol, rightCol) {
  const dx = r * 0.866;
  const dy = r * 0.5;
  ctx.save();
  // Top face
  ctx.fillStyle = topCol;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + dx, cy - dy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - dx, cy - dy);
  ctx.closePath();
  ctx.fill();
  // Left face
  ctx.fillStyle = leftCol;
  ctx.beginPath();
  ctx.moveTo(cx - dx, cy - dy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - dx, cy + dy);
  ctx.closePath();
  ctx.fill();
  // Right face
  ctx.fillStyle = rightCol;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + dx, cy - dy);
  ctx.lineTo(cx + dx, cy + dy);
  ctx.lineTo(cx, cy + r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Helper: Draw a Retro Pixel Speech Bubble (Crisp & Clamped so it never clips or overlaps)
function drawRetroSpeechBubble(ctx, x, y, text, borderColor = '#ff4d6d', isDark = false) {
  ctx.save();
  ctx.font = '900 16px "Pretendard", "Malgun Gothic", sans-serif';
  const padX = 15;
  const tw = Math.ceil(ctx.measureText(text).width);
  const bw = tw + padX * 2;
  const bh = 36;
  const clampedX = Math.max(bw / 2 + 14, Math.min(960 - bw / 2 - 14, x));
  const bx = Math.round((clampedX - bw / 2) / 2) * 2;
  const by = Math.max(12, Math.round((y - bh) / 2) * 2);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(bx + 4, by + 4, bw, bh);

  ctx.fillStyle = borderColor;
  ctx.fillRect(bx - 3, by - 3, bw + 6, bh + 6);

  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(bx, by, bw, bh);

  const tailX = Math.max(bx + 14, Math.min(bx + bw - 14, x));
  ctx.fillStyle = borderColor;
  ctx.fillRect(tailX - 5, by + bh + 3, 10, 4);
  ctx.fillRect(tailX - 3, by + bh + 7, 6, 4);
  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(tailX - 3, by + bh, 6, 4);

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

// Helper: Draw Rich 2D Cartoon Snow Village Environment for Scene 1 (NO lazy rectangles/semicircles!)
function drawRich2DSnowVillage(ctx, now, pitLeft, pitRight) {
  // 1. Multi-stop 2D Anime Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 370);
  skyGrad.addColorStop(0, '#0284c7');
  skyGrad.addColorStop(0.45, '#38bdf8');
  skyGrad.addColorStop(0.82, '#bae6fd');
  skyGrad.addColorStop(1, '#f0f9ff');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 960, 380);

  // 2. Warm Glowing 2D Cartoon Sun with Rotating Sunbeams & Cool Shades
  ctx.save();
  ctx.translate(112, 74);
  const sunGlow = ctx.createRadialGradient(0, 0, 18, 0, 0, 92);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  sunGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.28)');
  sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 92, 0, Math.PI * 2);
  ctx.fill();

  // Rotating sun rays
  ctx.save();
  ctx.rotate(now * 0.0005);
  for (let i = 0; i < 12; i++) {
    ctx.rotate((Math.PI * 2) / 12);
    ctx.fillStyle = i % 2 === 0 ? '#fde047' : '#facc15';
    ctx.beginPath();
    ctx.moveTo(-6, -42);
    ctx.lineTo(0, -56);
    ctx.lineTo(6, -42);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Sun body
  ctx.fillStyle = '#fde047';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cool sunglasses on the sun
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-22, -10, 18, 11);
  ctx.fillRect(4, -10, 18, 11);
  ctx.fillRect(-4, -8, 8, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-19, -8, 5, 3);
  ctx.fillRect(7, -8, 5, 3);
  // Rosy cheeks & cheeky smile
  ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-18, 7, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(18, 7, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 7, 9, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.restore();

  // 3. Fluffy Multi-Puff 2D Cartoon Clouds
  const draw2DCloud = (baseX, cy, scale) => {
    const cx = ((baseX + now * 0.018) % 1140) - 120;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    // Soft blue bottom shadow
    ctx.fillStyle = '#cbeafe';
    ctx.beginPath();
    ctx.arc(-28, 8, 18, 0, Math.PI * 2);
    ctx.arc(0, 10, 22, 0, Math.PI * 2);
    ctx.arc(28, 8, 18, 0, Math.PI * 2);
    ctx.fill();
    // Bright white cloud puffs
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-28, 3, 18, 0, Math.PI * 2);
    ctx.arc(-8, -7, 22, 0, Math.PI * 2);
    ctx.arc(14, -4, 20, 0, Math.PI * 2);
    ctx.arc(30, 4, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  draw2DCloud(230, 62, 1.15);
  draw2DCloud(560, 48, 0.95);
  draw2DCloud(830, 72, 1.25);

  // 4. Far 2D Alpine Snow-Capped Mountains (2-tone directional light & shadow slopes)
  const peaks = [
    { x: 110, y: 150, w: 220, bY: 365 },
    { x: 295, y: 118, w: 260, bY: 365 },
    { x: 490, y: 162, w: 230, bY: 365 },
    { x: 735, y: 128, w: 270, bY: 365 },
    { x: 910, y: 168, w: 200, bY: 365 },
  ];
  peaks.forEach((pk) => {
    // Left sunlit face
    ctx.fillStyle = '#dbeafe';
    ctx.beginPath();
    ctx.moveTo(pk.x, pk.y);
    ctx.lineTo(pk.x - pk.w * 0.55, pk.bY);
    ctx.lineTo(pk.x + pk.w * 0.04, pk.bY);
    ctx.closePath();
    ctx.fill();

    // Right shaded glacier face
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.moveTo(pk.x, pk.y);
    ctx.lineTo(pk.x + pk.w * 0.04, pk.bY);
    ctx.lineTo(pk.x + pk.w * 0.55, pk.bY);
    ctx.closePath();
    ctx.fill();

    // Crisp white snow cap at peak
    const capH = (pk.bY - pk.y) * 0.38;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(pk.x, pk.y);
    ctx.lineTo(pk.x - pk.w * 0.21, pk.y + capH);
    ctx.lineTo(pk.x - pk.w * 0.08, pk.y + capH * 0.82);
    ctx.lineTo(pk.x + pk.w * 0.02, pk.y + capH * 1.05);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.moveTo(pk.x, pk.y);
    ctx.lineTo(pk.x + pk.w * 0.02, pk.y + capH * 1.05);
    ctx.lineTo(pk.x + pk.w * 0.11, pk.y + capH * 0.85);
    ctx.lineTo(pk.x + pk.w * 0.21, pk.y + capH);
    ctx.closePath();
    ctx.fill();
  });

  // 5. Mid-Ground Rolling Bezier Snow Hills
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.moveTo(0, 365);
  ctx.lineTo(0, 285);
  ctx.bezierCurveTo(160, 245, 310, 315, 480, 278);
  ctx.bezierCurveTo(640, 245, 810, 305, 960, 270);
  ctx.lineTo(960, 365);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f0f9ff';
  ctx.beginPath();
  ctx.moveTo(0, 365);
  ctx.lineTo(0, 318);
  ctx.bezierCurveTo(180, 290, 350, 340, 560, 312);
  ctx.bezierCurveTo(710, 292, 850, 330, 960, 308);
  ctx.lineTo(960, 365);
  ctx.closePath();
  ctx.fill();

  // 6. Cute 2D Snow Igloo on the Left Mid-Ground Hill (x = 185, y = 324)
  ctx.save();
  ctx.translate(185, 326);
  // Chimney smoke puffs
  for (let s = 0; s < 3; s++) {
    const sp = ((now * 0.001 + s * 0.33) % 1);
    ctx.fillStyle = `rgba(255, 255, 255, ${(1 - sp) * 0.7})`;
    ctx.beginPath();
    ctx.arc(22 + sp * 14, -46 - sp * 28, 6 + sp * 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#475569';
  ctx.fillRect(18, -42, 8, 16);
  // Igloo dome
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 38, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Igloo ice brick lines
  ctx.beginPath();
  ctx.moveTo(-34, -14);
  ctx.lineTo(34, -14);
  ctx.moveTo(-24, -27);
  ctx.lineTo(24, -27);
  ctx.stroke();
  // Igloo entrance arch
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(8, 0, 13, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#bae6fd';
  ctx.stroke();
  ctx.restore();

  // 7. Snow-Frosted 2D Evergreen Pine Trees
  const draw2DPineTree = (tx, ty, scale) => {
    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-5, -14, 10, 16);
    const tiers = [
      { y: -12, w: 30, h: 24 },
      { y: -28, w: 24, h: 22 },
      { y: -42, w: 18, h: 20 },
    ];
    tiers.forEach((t) => {
      ctx.fillStyle = '#0d9488';
      ctx.beginPath();
      ctx.moveTo(0, t.y - t.h);
      ctx.quadraticCurveTo(t.w * 0.6, t.y - t.h * 0.3, t.w, t.y);
      ctx.lineTo(-t.w, t.y);
      ctx.quadraticCurveTo(-t.w * 0.6, t.y - t.h * 0.3, 0, t.y - t.h);
      ctx.fill();
      // White snow frosting cap on each bough
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, t.y - t.h);
      ctx.lineTo(t.w * 0.55, t.y - t.h * 0.42);
      ctx.quadraticCurveTo(0, t.y - t.h * 0.25, -t.w * 0.55, t.y - t.h * 0.42);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  };
  draw2DPineTree(52, 332, 1.15);
  draw2DPineTree(94, 340, 0.85);
  draw2DPineTree(318, 330, 1.05);
  draw2DPineTree(415, 338, 0.9);
  draw2DPineTree(895, 332, 1.1);

  // 8. Cute Wooden Fence & Glowing Vintage Lamp Post along the Walk
  ctx.strokeStyle = '#92400e';
  ctx.fillStyle = '#b45309';
  for (let fx = 235; fx <= 385; fx += 30) {
    ctx.fillRect(fx, 336, 6, 26);
  }
  ctx.fillRect(232, 342, 162, 4);
  ctx.fillRect(232, 351, 162, 4);

  // Vintage Streetlamp at x = 442
  ctx.fillStyle = '#334155';
  ctx.fillRect(440, 286, 5, 76);
  ctx.fillRect(434, 358, 17, 5);
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(442.5, 282, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 9. Deep 3D-Perspective Dimensional Pixel Chasm (x = pitLeft..pitRight)
  const pitGrad = ctx.createLinearGradient(0, 358, 0, 540);
  pitGrad.addColorStop(0, '#090614');
  pitGrad.addColorStop(0.45, '#1e1b4b');
  pitGrad.addColorStop(0.8, '#4c1d95');
  pitGrad.addColorStop(1, '#ff4d6d');
  ctx.fillStyle = pitGrad;
  ctx.fillRect(pitLeft - 8, 358, pitRight - pitLeft + 16, 182);

  // Glowing concentric dimensional vortex rings inside the pit
  const pitCenterX = (pitLeft + pitRight) / 2;
  for (let r = 0; r < 4; r++) {
    const ringPhase = ((now * 0.0012 + r * 0.25) % 1);
    const ry = 525 - ringPhase * 150;
    const rx = (pitRight - pitLeft) * (0.44 - ringPhase * 0.12);
    ctx.strokeStyle = r % 2 === 0 ? `rgba(103, 232, 249, ${1 - ringPhase})` : `rgba(255, 77, 109, ${1 - ringPhase})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(pitCenterX, ry, rx, 12, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Rising 3D Isometric Voxel Cubes from the pit
  for (let i = 0; i < 18; i++) {
    const vx = pitLeft + 22 + ((i * 41) % (pitRight - pitLeft - 44));
    const vy = 535 - (((now * 0.16 + i * 31) % 175) | 0);
    if (i % 3 === 0) {
      drawIsoVoxelCube(ctx, vx, vy, 8, '#fde047', '#eab308', '#ca8a04');
    } else if (i % 2 === 0) {
      drawIsoVoxelCube(ctx, vx, vy, 8, '#67e8f9', '#06b6d4', '#0891b2');
    } else {
      drawIsoVoxelCube(ctx, vx, vy, 8, '#ff758f', '#ff4d6d', '#c9184a');
    }
  }

  // 10. Foreground 2D Snow Promenade & Jagged Cracked Ice Cliff Walls
  // Left Snow Ground
  const groundGrad = ctx.createLinearGradient(0, 358, 0, 540);
  groundGrad.addColorStop(0, '#ffffff');
  groundGrad.addColorStop(0.18, '#f1f5f9');
  groundGrad.addColorStop(0.45, '#cbd5e1');
  groundGrad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, 358, pitLeft, 182);
  ctx.fillRect(pitRight, 358, 960 - pitRight, 182);

  // 3D Jagged Ice Cliff Wall on Left & Right edges of the Chasm
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(pitLeft, 358);
  ctx.lineTo(pitLeft + 18, 385);
  ctx.lineTo(pitLeft + 6, 425);
  ctx.lineTo(pitLeft + 20, 475);
  ctx.lineTo(pitLeft + 8, 540);
  ctx.lineTo(pitLeft - 14, 540);
  ctx.lineTo(pitLeft - 14, 358);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(pitRight, 358);
  ctx.lineTo(pitRight - 18, 390);
  ctx.lineTo(pitRight - 6, 435);
  ctx.lineTo(pitRight - 22, 485);
  ctx.lineTo(pitRight - 8, 540);
  ctx.lineTo(pitRight + 14, 540);
  ctx.lineTo(pitRight + 14, 358);
  ctx.closePath();
  ctx.fill();

  // Fluffy snow lip overhang & hanging icicles along the promenade
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 2;
  for (let sx = 18; sx < pitLeft - 10; sx += 36) {
    ctx.beginPath();
    ctx.arc(sx, 362, 22, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  for (let sx = pitRight + 18; sx < 950; sx += 36) {
    ctx.beginPath();
    ctx.arc(sx, 362, 22, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Hanging sharp icicles near the chasm edges
  const icicleXs = [pitLeft - 32, pitLeft - 18, pitLeft - 6, pitRight + 6, pitRight + 18, pitRight + 32];
  ctx.fillStyle = '#bae6fd';
  icicleXs.forEach((ix, idx) => {
    const ih = idx % 2 === 0 ? 26 : 18;
    ctx.beginPath();
    ctx.moveTo(ix - 5, 368);
    ctx.lineTo(ix, 368 + ih);
    ctx.lineTo(ix + 5, 368);
    ctx.closePath();
    ctx.fill();
  });

  // Snow path stepping stones
  ctx.fillStyle = '#94a3b8';
  for (let px = 45; px < pitLeft - 45; px += 72) {
    ctx.beginPath();
    ctx.ellipse(px, 376, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 11. Crooked Wooden Warning Sign & Hazard Cone right before the Pit
  ctx.save();
  ctx.translate(492, 360);
  ctx.rotate(-0.07);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-5, -64, 10, 64);
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 3;
  ctx.fillRect(-76, -98, 152, 38);
  ctx.strokeRect(-76, -98, 152, 38);
  // Danger diagonal stripes on top border
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-74, -96, 148, 6);
  ctx.fillStyle = '#991b1b';
  ctx.font = '900 13px "Pretendard", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚠ 위험: 도트 벼랑!', 0, -73);
  ctx.restore();

  // Striped Orange Traffic Cone at x = 556
  ctx.save();
  ctx.translate(556, 362);
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(-11, 0);
  ctx.lineTo(-4, -26);
  ctx.lineTo(4, -26);
  ctx.lineTo(11, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-6, -16, 12, 5);
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(-14, -2, 28, 4);
  ctx.restore();
}

// Helper: Draw the 16-Bit Side-Scrolling Pixel Penguin World Background (with Wooden Bridge & Falling Cherry Petals)
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

  // Cute Pixel Wooden Bridge over the River (x = 520..640)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(520, 330, 120, 54);
  ctx.fillStyle = '#b45309';
  for (let bx = 524; bx < 636; bx += 12) {
    ctx.fillRect(bx, 334, 8, 46);
  }
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(520, 326, 120, 6);

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

  // Foreground Grass & Village Plaza Path
  ctx.fillStyle = '#3b8c5a';
  ctx.fillRect(0, 380, 960, 160);
  ctx.fillStyle = '#52b768';
  ctx.fillRect(0, 380, 960, 20);
  for (let x = 0; x < 960; x += P * 4) {
    ctx.fillRect(x, 400, P * 2, P * 2);
  }
  ctx.fillStyle = '#e9d8a6';
  ctx.fillRect(0, 412, 960, 94);
  ctx.fillStyle = '#f4e8c1';
  ctx.fillRect(0, 416, 960, 82);
  for (let fx = 36; fx < 940; fx += 92) {
    ctx.fillStyle = fx % 184 === 36 ? '#ff4d6d' : '#fbbf24';
    ctx.fillRect(fx, 390, P * 2, P * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + P, 390, P, P);
  }

  // Drifting Pink Cherry Blossom Pixel Petals across the sky & plaza
  for (let i = 0; i < 18; i++) {
    const px = snap((960 - ((now * 0.045 + i * 67) % 980) + 980) % 960);
    const py = snap(60 + ((now * 0.03 + i * 53) % 360));
    ctx.fillStyle = i % 2 === 0 ? '#ff9ebb' : '#ffd6e4';
    ctx.fillRect(px, py, P * 1.5, P);
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

  // Preload 2D Hero Penguin and all 22 Full-Body Pixel Penguins for the crowd scenes
  ensureHero2DSprite();
  MOTION_SPECIES_22.forEach((sp) => ensureSpeciesSprite(sp.id));

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

  // Canvas Click Interaction
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (MOTION_STATE.sceneIdx === 3) {
      if (mx >= 280 && mx <= 680 && my >= 186 && my <= 228) {
        scrollToSection('tab-codex');
        return;
      }
      if (mx >= 280 && mx <= 680 && my >= 229 && my <= 264) {
        document.querySelector('.hero-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (mx >= 280 && mx <= 680 && my >= 265 && my <= 304) {
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
    if (my >= 186 && my < 228) MOTION_STATE.menuHoverIdx = 0;
    else if (my >= 228 && my < 264) MOTION_STATE.menuHoverIdx = 1;
    else if (my >= 264 && my <= 310) MOTION_STATE.menuHoverIdx = 2;
  });

  setIntroScene(0, true);

  // Main 60 FPS Cutscene Loop
  function renderIntroCutscene(now) {
    // Protagonist is Always Classic Blue ('05') while all 22 colors populate the Pixel World!
    const heroPixelEntry = ensureSpeciesSprite('05');

    let elapsed = now - MOTION_STATE.sceneStartTime;
    const curDuration = SCENE_DURATIONS[MOTION_STATE.sceneIdx] || 5200;

    if (MOTION_STATE.autoPlay && elapsed >= curDuration) {
      setIntroScene((MOTION_STATE.sceneIdx + 1) % 4, true);
      elapsed = 0;
    }

    const p = Math.min(1, Math.max(0, elapsed / curDuration));
    ctx.clearRect(0, 0, 960, 540);

    // ========================================================================
    // SCENE 0 ("1. 추락"): Lush 2D Snow Village -> Banana Peel Slip -> Pixel Chasm!
    // ========================================================================
    if (MOTION_STATE.sceneIdx === 0) {
      const pitLeft = 585;
      const pitRight = 835;
      const pitCenterX = (pitLeft + pitRight) / 2;

      drawRich2DSnowVillage(ctx, now, pitLeft, pitRight);

      // Banana Peel at x = 528 (flies spinning into the air when stepped on!)
      const slipStartP = 0.42;
      if (p < slipStartP) {
        drawCartoonBananaPeel(ctx, 528, 362, 0, 1.05);
      } else {
        const flyP = Math.min(1, (p - slipStartP) / 0.32);
        const bx = 528 - flyP * 115;
        const by = 358 - Math.sin(flyP * Math.PI) * 145;
        drawCartoonBananaPeel(ctx, bx, by, flyP * Math.PI * 5, 1.1);
      }

      // 2D Hero Penguin Animation with Squash & Stretch, Footstep Snow Puffs, and 720-deg Flip!
      const runPhase = now * 0.024;
      let pengX = 95;
      let pengY = 294;
      let pengRot = 0;
      let scaleX = 1;
      let scaleY = 1;

      if (p < slipStartP) {
        const subP = p / slipStartP;
        pengX = 90 + subP * 432;
        const bounceSin = Math.sin(runPhase);
        pengY = 296 - Math.abs(bounceSin) * 18;
        pengRot = Math.sin(runPhase * 0.5) * 0.11;
        scaleX = 1 + bounceSin * 0.06;
        scaleY = 1 - bounceSin * 0.06;

        // Cute snow-dust puffs behind his feet while strolling
        for (let d = 0; d < 3; d++) {
          const dp = ((now * 0.004 + d * 0.33) % 1);
          ctx.fillStyle = `rgba(255, 255, 255, ${(1 - dp) * 0.85})`;
          ctx.beginPath();
          ctx.arc(pengX - 38 - dp * 28, 358 - dp * 12, 8 - dp * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Floating musical notes
        ctx.fillStyle = '#0284c7';
        ctx.font = '900 20px "Pretendard", sans-serif';
        ctx.fillText('♪', pengX - 58, pengY - 40 - Math.sin(now * 0.008) * 8);
        ctx.fillStyle = '#ec4899';
        ctx.fillText('♫', pengX + 48, pengY - 52 - Math.cos(now * 0.008) * 8);
      } else if (p < 0.68) {
        const subP = (p - slipStartP) / (0.68 - slipStartP);
        pengX = 522 + subP * (pitCenterX - 522);
        pengY = 292 - Math.sin(subP * Math.PI) * 115 + subP * 32;
        pengRot = subP * Math.PI * 3.2;
        scaleX = 1.08;
        scaleY = 0.94;

        // Comic Spiky Starburst at the slip point!
        if (subP < 0.65) {
          drawComicStarburst(ctx, 532, 344, 20, 42, 10, '#fde047', '#dc2626', now * 0.006);
          ctx.fillStyle = '#991b1b';
          ctx.font = '900 15px "Pretendard", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('미끄덩!!', 532, 349);
        }

        // Anime speed-arc trail behind the flipping penguin
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(610, 320, 88, Math.PI * 1.05, Math.PI * 1.05 + subP * Math.PI * 0.85);
        ctx.stroke();
      } else {
        const subP = (p - 0.68) / 0.32;
        pengX = pitCenterX;
        pengY = 324 + subP * subP * 245;
        pengRot = Math.PI * 3.2 + subP * Math.PI * 2;
        scaleX = Math.max(0.55, 0.92 - subP * 0.3);
        scaleY = Math.min(1.35, 1.08 + subP * 0.25);

        // Erupting Dimensional Pixel Beam from the chasm as the penguin plunges in!
        const beamGrad = ctx.createLinearGradient(pitCenterX, 540, pitCenterX, 140);
        beamGrad.addColorStop(0, 'rgba(255, 77, 109, 0.75)');
        beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
        beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(pitLeft + 24, 150, pitRight - pitLeft - 48, 390);
      }

      // Ground shadow before chasm
      if (pengX < pitLeft - 10) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.beginPath();
        ctx.ellipse(pengX, 364, 40, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Clip inside chasm depth so the penguin plunges down into the pit
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 960, 505);
      ctx.clip();
      drawUploaded2DPenguin(ctx, pengX, pengY, 146, pengRot, scaleX, scaleY);
      ctx.restore();

      if (p < slipStartP) {
        drawRetroSpeechBubble(
          ctx,
          pengX,
          pengY - 84,
          CURRENT_LANG === 'ko'
            ? '룰루랄라~ 눈밭 산책 날씨 죽인다~ ♪'
            : 'La la la~ Best snow day for a stroll~ ♪',
          '#0284c7'
        );
      } else if (p < 0.90) {
        drawRetroSpeechBubble(
          ctx,
          Math.min(735, pengX),
          Math.max(76, pengY - 88),
          CURRENT_LANG === 'ko'
            ? '어익후?! 웬 바나나야!! 으아아아악~!!'
            : 'WHOA?! A banana peel!! AHHHHH~!!',
          '#ff4d6d'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 1 · 추락',
        CURRENT_LANG === 'ko'
          ? '픽셀월드 가기 전 매끈했던 2D 주인공 펭귄! 눈밭을 산책하다 바나나를 밟고 도트 벼랑으로 추락하고 마는데...'
          : 'Our smooth 2D hero penguin was strolling through the snow, slipped on a banana peel, and plunged into the pixel chasm...'
      );
    }

    // ========================================================================
    // SCENE 1 ("2. 도트변신"): 3D Dimensional Warp Vortex & Real-Time Mosaic -> 48x48 Morph!
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 1) {
      const centerX = 480;
      const centerY = 262;

      // 1. Deep Cosmic Dimensional Vortex Gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 560);
      bgGrad.addColorStop(0, '#311042');
      bgGrad.addColorStop(0.45, '#150d2a');
      bgGrad.addColorStop(1, '#06050c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 960, 540);

      // 2. 16 Radiating 3D Perspective Tunnel Grid Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 16; i++) {
        const ang = (i * Math.PI * 2) / 16 + now * 0.0004;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(ang) * 32, centerY + Math.sin(ang) * 32);
        ctx.lineTo(centerX + Math.cos(ang) * 620, centerY + Math.sin(ang) * 620);
        ctx.stroke();
      }

      // 3. 8 Zooming Concentric 3D Perspective Neon Octagon/Rectangle Frames
      for (let f = 0; f < 8; f++) {
        const z = ((now * 0.00055 + f / 8) % 1);
        const scale = z * z;
        const fw = 60 + scale * 920;
        const fh = 36 + scale * 520;
        ctx.strokeStyle =
          f % 2 === 0
            ? `rgba(255, 77, 109, ${scale * 0.65})`
            : `rgba(103, 232, 249, ${scale * 0.65})`;
        ctx.lineWidth = 1.5 + scale * 3;
        ctx.strokeRect(centerX - fw / 2, centerY - fh / 2, fw, fh);
      }
      ctx.restore();

      // 4. Swirling Helix of 36 3D Isometric Voxel Cubes
      for (let i = 0; i < 36; i++) {
        const orbitAng = i * 0.52 + now * 0.0028 * (i % 2 === 0 ? 1 : -1);
        const dist = 135 + ((i * 29 + now * 0.12) % 280);
        const vx = centerX + Math.cos(orbitAng) * dist * 1.25;
        const vy = centerY + Math.sin(orbitAng) * dist * 0.68;
        const cubeR = 6 + (i % 3) * 3;
        if (i % 3 === 0) {
          drawIsoVoxelCube(ctx, vx, vy, cubeR, '#fde047', '#eab308', '#ca8a04');
        } else if (i % 2 === 0) {
          drawIsoVoxelCube(ctx, vx, vy, cubeR, '#67e8f9', '#06b6d4', '#0891b2');
        } else {
          drawIsoVoxelCube(ctx, vx, vy, cubeR, '#ff758f', '#ff4d6d', '#c9184a');
        }
      }

      // 5. Left & Right Cyber-Pixel Tesla Emitters
      const drawSideEmitter = (isLeft) => {
        const ex = isLeft ? 0 : 960;
        const dir = isLeft ? 1 : -1;
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.fillRect(isLeft ? 0 : 896, centerY - 56, 64, 112);
        ctx.strokeRect(isLeft ? 0 : 896, centerY - 56, 64, 112);
        ctx.fillStyle = '#ff4d6d';
        ctx.fillRect(isLeft ? 56 : 884, centerY - 34, 20, 68);
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(ex + dir * 82, centerY, 16 + Math.sin(now * 0.02) * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawSideEmitter(true);
      drawSideEmitter(false);

      const charSize = 224;
      const charY = centerY + Math.sin(now * 0.008) * 8;

      if (p < 0.25) {
        // Phase 1: 2D Penguin Caught in Holographic Target Rings!
        const subP = p / 0.25;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 126, charY - 126, 252, 252);
        drawUploaded2DPenguin(
          ctx,
          centerX,
          charY,
          charSize,
          (1 - subP) * Math.PI * 1.5 + Math.sin(now * 0.025) * 0.2,
          1,
          1
        );

        drawRetroSpeechBubble(
          ctx,
          centerX,
          charY - 126,
          CURRENT_LANG === 'ko'
            ? '어어어?! 여긴 어디야?! 내 매끈한 2D 몸매가!!'
            : 'Whoa?! Where am I?! My smooth 2D body!!',
          '#fbbf24'
        );
      } else if (p < 0.72) {
        // Phase 2: Real-Time Progressive Mosaic + Dual Tesla Lightning + Pixel Block Reconstruction!
        const morphP = (p - 0.25) / 0.47;
        const splitY = charY - charSize / 2 + morphP * charSize;

        // Crackling Lightning Bolts from Left & Right Tesla Emitters to the Scan Frontier!
        [82, 878].forEach((startX) => {
          ctx.strokeStyle = '#67e8f9';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(startX, centerY);
          const steps = 6;
          for (let s = 1; s < steps; s++) {
            const lx = startX + ((centerX - startX) * s) / steps;
            const ly =
              centerY +
              ((splitY - centerY) * s) / steps +
              Math.sin(now * 0.05 + s * 2.1) * 18;
            ctx.lineTo(lx, ly);
          }
          ctx.lineTo(centerX, splitY);
          ctx.stroke();
        });

        // Bottom Half: Real-Time Chunky Mosaic 2D Penguin (actively breaking into pixel blocks!)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, splitY, 960, 540 - splitY);
        ctx.clip();
        const resBlocks = morphP < 0.5 ? 18 : 12;
        drawMosaic2DPenguin(ctx, centerX, charY, charSize, resBlocks);
        ctx.restore();

        // Top Half: Crisp 48x48 Full-Body Pixel Penguin!
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 960, splitY);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        if (heroPixelEntry.loaded && heroPixelEntry.img) {
          ctx.drawImage(
            heroPixelEntry.img,
            centerX - charSize / 2,
            charY - charSize / 2,
            charSize,
            charSize
          );
        }
        ctx.restore();

        // High-Energy Pixel Matrix Scan Wave + Detaching Pixel Tiles along splitY
        ctx.fillStyle = 'rgba(255, 77, 109, 0.85)';
        ctx.fillRect(centerX - 165, splitY - 8, 330, 16);
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(centerX - 155, splitY - 4, 310, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX - 145, splitY - 2, 290, 4);

        for (let b = 0; b < 18; b++) {
          const bx = centerX - 110 + b * 13;
          const by = splitY + Math.sin(now * 0.03 + b) * 18;
          ctx.fillStyle = b % 2 === 0 ? '#fde047' : '#38bdf8';
          ctx.fillRect(bx, by - 5, 10, 10);
        }

        drawRetroSpeechBubble(
          ctx,
          centerX,
          charY - 128,
          CURRENT_LANG === 'ko'
            ? `⚡ 강제 48×48 도트 변환 가동 중... (${Math.round(morphP * 100)}%)`
            : `⚡ 48×48 Pixel Matrix Reconstruction... (${Math.round(morphP * 100)}%)`,
          '#67e8f9',
          true
        );
      } else {
        // Phase 3: 16-Bit Supernova Birth!
        const burstP = (p - 0.72) / 0.28;

        // Rotating golden starburst rays behind the reborn pixel penguin
        ctx.save();
        ctx.translate(centerX, charY);
        ctx.rotate(now * 0.0015);
        for (let r = 0; r < 12; r++) {
          ctx.rotate((Math.PI * 2) / 12);
          ctx.fillStyle =
            r % 2 === 0 ? 'rgba(251, 191, 36, 0.28)' : 'rgba(255, 77, 109, 0.22)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-22, -220);
          ctx.lineTo(22, -220);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Expanding pixel shockwave ring
        const ringR = Math.round((80 + burstP * 160) / 6) * 6;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.strokeRect(centerX - ringR, charY - ringR, ringR * 2, ringR * 2);

        const bounce = Math.floor(now / 190) % 2 === 0 ? 0 : -12;
        ctx.imageSmoothingEnabled = false;
        if (heroPixelEntry.loaded && heroPixelEntry.img) {
          ctx.drawImage(
            heroPixelEntry.img,
            centerX - charSize / 2,
            charY - charSize / 2 + bounce,
            charSize,
            charSize
          );
        }

        drawPixelHeart(ctx, centerX - 135, charY - 48 + bounce, 4, '#ff4d6d');
        drawPixelHeart(ctx, centerX + 135, charY - 48 + bounce, 4, '#fbbf24');
        drawPixelHeart(ctx, centerX - 115, charY + 42 + bounce, 3, '#67e8f9');
        drawPixelHeart(ctx, centerX + 115, charY + 42 + bounce, 3, '#ff4d6d');

        drawRetroSpeechBubble(
          ctx,
          centerX,
          charY - 126 + bounce,
          CURRENT_LANG === 'ko'
            ? '헐... 각진 48×48 도트 몸매 오히려 좋아?!!'
            : 'Whoa... This 48×48 pixel body actually rocks?!!',
          '#ff4d6d'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 2 · 도트변신',
        CURRENT_LANG === 'ko'
          ? '구덩이 속 차원 워프 터널에서 도트 변환 빔을 맞고 48×48 전신 도트 펭귄으로 다시 태어났다!'
          : 'Caught in the dimensional warp tunnel, our penguin is rebuilt block-by-block into a 48×48 Pixel Penguin!'
      );
    }

    // ========================================================================
    // SCENE 2 ("3. 픽셀월드"): Lively Pixel Village Meetup (ZERO Name Tags Under Feet & ZERO Overlapping Bubbles!)
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 2) {
      drawRetroPixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      // 1. Background Village Penguins strolling near the river, bridge & cherry trees (Multi-depth!)
      const bgPenguins = [
        { id: '12', baseX: 280, y: 278, size: 78, speed: 0.02, flip: false },
        { id: '15', baseX: 545, y: 266, size: 76, speed: -0.015, flip: true },
        { id: '07', baseX: 720, y: 280, size: 78, speed: 0.018, flip: false },
        { id: '19', baseX: 835, y: 286, size: 74, speed: -0.012, flip: true },
      ];
      bgPenguins.forEach((bp, idx) => {
        const entry = ensureSpeciesSprite(bp.id);
        const bx = bp.baseX + Math.sin(now * 0.0015 + idx * 1.7) * 22;
        const hop = Math.floor((now + idx * 170) / 280) % 2 === 0 ? 0 : -5;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
        ctx.fillRect(bx + 18, bp.y + bp.size - 7, bp.size - 36, 6);
        if (entry.loaded && entry.img) {
          ctx.save();
          if (bp.flip) {
            ctx.translate(bx + bp.size, bp.y + hop);
            ctx.scale(-1, 1);
            ctx.drawImage(entry.img, 0, 0, bp.size, bp.size);
          } else {
            ctx.drawImage(entry.img, bx, bp.y + hop, bp.size, bp.size);
          }
          ctx.restore();
        }
      });

      // 2. Protagonist drops from the sky on the Left (x = 132, y = 312)
      const spriteSize = 138;
      const heroGroundY = 312;
      const landP = Math.min(1, p / 0.16);
      const heroHop = landP >= 1 ? (Math.floor(now / 230) % 2 === 0 ? 0 : -10) : 0;
      const heroX = 132;
      const heroY = landP < 1 ? -140 + landP * (heroGroundY + 140) : heroGroundY + heroHop;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
      ctx.fillRect(heroX + 32, heroGroundY + spriteSize - 11, spriteSize - 64, 9);

      if (heroPixelEntry.loaded && heroPixelEntry.img) {
        ctx.save();
        ctx.translate(heroX + spriteSize, heroY);
        ctx.scale(-1, 1);
        ctx.drawImage(heroPixelEntry.img, 0, 0, spriteSize, spriteSize);
        ctx.restore();
      }

      // 3. 5 Foreground Penguin Friends in a Staggered Natural Semicircle (NO Name Tags Underneath!)
      const fgFriends = [
        { id: '04', x: 356, y: 318 },
        { id: '03', x: 472, y: 296 },
        { id: '09', x: 588, y: 322 },
        { id: '06', x: 702, y: 298 },
        { id: '02', x: 812, y: 318 },
      ];

      const walkInP = Math.min(1, p / 0.24);
      fgFriends.forEach((fr, idx) => {
        const fEntry = ensureSpeciesSprite(fr.id);
        const fx = Math.round(fr.x + (1 - walkInP) * 140);
        const fHop = Math.floor((now + idx * 130) / 230) % 2 === 0 ? 0 : -10;
        const fy = fr.y + fHop;

        // Clean oval pixel shadow under feet (NO text boxes or species names!)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
        ctx.fillRect(fx + 32, fr.y + spriteSize - 11, spriteSize - 64, 9);

        if (fEntry.loaded && fEntry.img) {
          ctx.drawImage(fEntry.img, fx, fy, spriteSize, spriteSize);
        }
      });

      // Floating Pixel Hearts & Musical Notes across the party
      drawPixelHeart(ctx, 308, 338 - ((now * 0.04) % 45), 3, '#ff4d6d');
      drawPixelHeart(ctx, 545, 315 - (((now + 300) * 0.04) % 45), 3, '#fbbf24');
      drawPixelHeart(ctx, 775, 325 - (((now + 600) * 0.04) % 45), 3, '#ff4d6d');

      // 4. Sequenced Single-Speaker Speech Bubbles (100% Zero Overlap!)
      if (p >= 0.14 && p < 0.42) {
        drawRetroSpeechBubble(
          ctx,
          heroX + spriteSize / 2 + 20,
          heroY - 8,
          CURRENT_LANG === 'ko'
            ? '야!! 너네도 그 바나나 밟고 빠졌냐?! 반갑다!!'
            : 'HEY!! Did you guys slip on that banana too?! Hi!!',
          '#38bdf8'
        );
      } else if (p >= 0.42 && p < 0.72) {
        drawRetroSpeechBubble(
          ctx,
          fgFriends[1].x + spriteSize / 2,
          fgFriends[1].y - 12,
          CURRENT_LANG === 'ko'
            ? 'ㅋㅋㅋ 어서와!! 여긴 아무 혜택 없는 도트 펭귄 천국이야 ♥'
            : 'Haha welcome!! This is the Zero-Perks Pixel Penguin Paradise ♥',
          '#ff4d6d'
        );
      } else if (p >= 0.72) {
        drawRetroSpeechBubble(
          ctx,
          fgFriends[3].x + spriteSize / 2 - 20,
          fgFriends[3].y - 12,
          CURRENT_LANG === 'ko'
            ? '복잡한 로드맵 따위 없다! 베리챗 프사 달고 다 같이 놀자 ♪'
            : 'No complicated roadmap here! Rock your VeryChat PFP and party ♪',
          '#fbbf24'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 3 · 픽셀월드',
        CURRENT_LANG === 'ko'
          ? '구덩이 아래 펼쳐진 픽셀 월드! 먼저 빠져서 살고 있던 각양각색 도트 펭귄 친구들이 몰려와 환영해 준다!'
          : 'Down below lies the Pixel World! Colorful pixel penguin friends who fell in earlier gather around to celebrate!'
      );
    }

    // ========================================================================
    // SCENE 3 ("4. 타이틀"): Retro 16-Bit Title Screen & 12-Penguin Parade (ZERO Name Tags!)
    // ========================================================================
    else {
      drawRetroPixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      const titleBounce = Math.floor(now / 480) % 2 === 0 ? 0 : -4;
      const titleY = 62 + titleBounce;

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

      const rbW = 340;
      const rbH = 26;
      const rbX = 480 - rbW / 2;
      const rbY = titleY + 40;
      ctx.fillStyle = '#4a153b';
      ctx.fillRect(rbX - 3, rbY - 3, rbW + 6, rbH + 6);
      ctx.fillStyle = '#ff758f';
      ctx.fillRect(rbX, rbY, rbW, rbH);
      ctx.fillStyle = '#fff0f3';
      ctx.font = '900 13.5px "Pretendard", monospace';
      ctx.fillText('★ 펭귄이 난무하는 베리챗 48×48 도트 월드 ★', 480, rbY + rbH / 2 + 1);
      ctx.restore();

      // Center RPG Command Box (Zero species mentions!)
      const menuW = 396;
      const menuH = 114;
      const menuX = 480 - menuW / 2;
      const menuY = 184;

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
              '▶ 10,000마리 도감도 구경하기 (OPEN CODEX)',
              '▼ 베리챗 6각형 프사 장착해보기 (TRY PFP)',
              '↻ 인트로 애니메이션 다시보기 (REPLAY)',
            ]
          : [
              '▶ EXPLORE 10,000 CODEX',
              '▼ TRY VERYCHAT HEXAGON PFP',
              '↻ REPLAY INTRO CUTSCENE',
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

      // Back row of 5 smaller pixel penguins strolling along the river bank
      const backRowIds = ['01', '07', '12', '16', '21'];
      backRowIds.forEach((sid, idx) => {
        const spEntry = ensureSpeciesSprite(sid);
        const bx = 115 + idx * 172 + Math.sin(now * 0.002 + idx) * 14;
        const by = 284 + (Math.floor((now + idx * 150) / 260) % 2 === 0 ? 0 : -5);
        if (spEntry.loaded && spEntry.img) {
          ctx.drawImage(spEntry.img, bx, by, 76, 76);
        }
      });

      // Front Lineup of 7 Full-Body Pixel Penguins Bouncing on the Village Plaza (ZERO Name Tags!)
      const lineupIds = ['02', '04', '03', '05', '09', '06', '15'];
      const pSize = 128;
      const startX = 54;
      const gapX = 120;
      const baseLineY = 332;

      lineupIds.forEach((sid, idx) => {
        const spEntry = ensureSpeciesSprite(sid);
        const lx = startX + idx * gapX;
        const isHeroCenter = idx === 3;
        const hop = Math.floor((now + idx * 140) / 250) % 2 === 0 ? 0 : -9;
        const ly = baseLineY + hop - (isHeroCenter ? 8 : 0);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(lx + 30, baseLineY + pSize - 10, pSize - 60, 9);

        if (spEntry.loaded && spEntry.img) {
          ctx.drawImage(spEntry.img, lx, ly, pSize, pSize);
        }

        if (isHeroCenter) {
          drawPixelHeart(ctx, lx + pSize / 2 - 42, ly + 8, 3, '#ff4d6d');
          drawPixelHeart(ctx, lx + pSize / 2 + 42, ly + 8, 3, '#fbbf24');
        }
      });

      drawRetroDialogueBar(
        ctx,
        'SCENE 4 · 타이틀',
        CURRENT_LANG === 'ko'
          ? '그렇게 시작된 베리챗 도트 펭귄 10,000마리 세상! 아래에서 내 마음에 드는 펭귄을 골라 6각형 프사로 장착해보세요.'
          : 'And so begins the world of 10,000 VeryChat Pixel Penguins! Pick your favorite penguin below and rock it as your Hexagon PFP.'
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
      item.edition <= 11 ? `/assets/specials/${item.edition}_fast.gif?v=v322` : `/img/${id}.png?v=v322`;
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
        const src = num <= 11 ? `/assets/specials/${num}_fast.gif?v=v322` : `/img/${id}.png?v=v322`;
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
