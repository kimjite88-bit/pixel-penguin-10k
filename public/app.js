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
//    Scene 0: Smooth 2D Blue Penguin walks on 2D snow cliff, slips on banana & pixelates into Blue Pixel Penguin (sp_01.png)
//    Scene 1: Lands in 16-Bit Cherry Blossom Pixel World & bounces with Blue Pixel Penguin friends
//    Scene 2: Authentic 16-Bit Arcade Title Screen (True Bitmap Pixel Logo + RPG Command Box)
// ============================================================================
const SCENE_DURATIONS = [6400, 5600, 5600]; // 3 Scenes: 0 (추락·도트변신), 1 (픽셀월드), 2 (타이틀)

const MOTION_STATE = {
  sceneIdx: 0,
  autoPlay: true,
  sceneStartTime: performance.now(),
  hero2DImg: null,
  hero2DLoaded: false,
  bgScene1Img: null,
  bgScene1Loaded: false,
  bgScene2Img: null,
  bgScene2Loaded: false,
  speciesSprites: new Map(),
  menuHoverIdx: 0,
};

function ensureHero2DSprite() {
  if (MOTION_STATE.hero2DImg) return MOTION_STATE.hero2DImg;
  const img = new Image();
  img.onload = () => {
    MOTION_STATE.hero2DLoaded = true;
  };
  img.src = '/assets/motion_sprites/hero_2d.png?v=4.7.0';
  MOTION_STATE.hero2DImg = img;
  return img;
}

function ensureIntroBackgrounds() {
  if (!MOTION_STATE.bgScene1Img) {
    const bg1 = new Image();
    bg1.onload = () => {
      MOTION_STATE.bgScene1Loaded = true;
    };
    bg1.src = '/assets/motion_sprites/bg_scene1_2d.jpg?v=4.7.0';
    MOTION_STATE.bgScene1Img = bg1;
  }
  if (!MOTION_STATE.bgScene2Img) {
    const bg2 = new Image();
    bg2.onload = () => {
      MOTION_STATE.bgScene2Loaded = true;
    };
    bg2.src = '/assets/motion_sprites/bg_scene2_pixel.jpg?v=4.7.0';
    MOTION_STATE.bgScene2Img = bg2;
  }
}

function ensureSpeciesSprite(spId = '01') {
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
  img.src = `/assets/motion_sprites/sp_${key}.png?v=4.7.0`;
  return entry;
}

function setIntroScene(sceneIdx, resetTimer = true) {
  MOTION_STATE.sceneIdx = ((sceneIdx % 3) + 3) % 3;
  if (resetTimer) {
    MOTION_STATE.sceneStartTime = performance.now();
  }
  document.querySelectorAll('.motion-mode-btn[data-scene]').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.scene) === MOTION_STATE.sceneIdx);
  });

  const labelEl = document.getElementById('motion-hud-mode-label');
  if (labelEl) {
    const labelsKo = [
      'SCENE 1/3 · 2D 눈밭 산책 → 도트 구덩이 추락 & 파란 도트 펭귄 변신',
      'SCENE 2/3 · 픽셀 월드 도착! 도트 펭귄 친구들과 환영식',
      'SCENE 3/3 · PIXEL PENGUIN WORLD — 베리챗 도트 펭귄 10,000마리',
    ];
    const labelsEn = [
      'SCENE 1/3 · 2D Snow Walk → Pixel Chasm Fall & Blue Pixel Transformation',
      'SCENE 2/3 · Welcome to Pixel World! Bouncing with Pixel Penguin Friends',
      'SCENE 3/3 · PIXEL PENGUIN WORLD — 10,000 VeryChat Pixel Penguins',
    ];
    labelEl.textContent =
      CURRENT_LANG === 'ko' ? labelsKo[MOTION_STATE.sceneIdx] : labelsEn[MOTION_STATE.sceneIdx];
  }
}

function selectMotionPenguin() {
  ensureSpeciesSprite('01');
}

// Helper: Draw the Uploaded 2D Full-Body Hero Penguin (hero_2d.png) with squash-and-stretch
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
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeCol;
    ctx.stroke();
  }
  ctx.restore();
}

// Helper: Draw a proper 3-Petal Cartoon Banana Peel
function drawCartoonBananaPeel(ctx, x, y, angle = 0, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#713f12';
  ctx.fillStyle = '#facc15';

  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(-18, -12, -26, 6);
  ctx.quadraticCurveTo(-12, 10, -3, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.quadraticCurveTo(18, -12, 26, 6);
  ctx.quadraticCurveTo(12, 10, 3, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(-4, -10);
  ctx.quadraticCurveTo(0, -20, 4, -10);
  ctx.quadraticCurveTo(9, 6, 0, 12);
  ctx.quadraticCurveTo(-9, 6, -4, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#451a03';
  ctx.fillRect(-3, -17, 6, 5);
  ctx.restore();
}

// Helper: Draw a 3D Isometric Voxel Cube
function drawIsoVoxelCube(ctx, cx, cy, r, topCol, leftCol, rightCol) {
  const dx = r * 0.866;
  const dy = r * 0.5;
  ctx.save();
  ctx.fillStyle = topCol;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + dx, cy - dy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - dx, cy - dy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = leftCol;
  ctx.beginPath();
  ctx.moveTo(cx - dx, cy - dy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - dx, cy + dy);
  ctx.closePath();
  ctx.fill();
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
  ctx.font = '900 15.5px "Pretendard", "Malgun Gothic", sans-serif';
  const padX = 16;
  const tw = Math.ceil(ctx.measureText(text).width);
  const bw = tw + padX * 2;
  const bh = 36;
  const clampedX = Math.max(bw / 2 + 14, Math.min(960 - bw / 2 - 14, x));
  const bx = Math.round((clampedX - bw / 2) / 2) * 2;
  const by = Math.max(12, Math.round((y - bh) / 2) * 2);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(bx + 4, by + 4, bw, bh);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(bx - 4, by - 4, bw + 8, bh + 8);

  ctx.fillStyle = borderColor;
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);

  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(bx, by, bw, bh);

  const tailX = Math.max(bx + 14, Math.min(bx + bw - 14, x));
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(tailX - 6, by + bh + 2, 12, 5);
  ctx.fillRect(tailX - 4, by + bh + 7, 8, 4);
  ctx.fillStyle = borderColor;
  ctx.fillRect(tailX - 4, by + bh + 2, 8, 4);
  ctx.fillStyle = isDark ? '#11162b' : '#fffdf9';
  ctx.fillRect(tailX - 3, by + bh, 6, 3);

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
        ctx.fillStyle = '#14081c';
        ctx.fillRect(startX + c * p + p, startY + r * p + p, p, p);
        ctx.fillStyle = color;
        ctx.fillRect(startX + c * p, startY + r * p, p, p);
      }
    }
  }
  ctx.restore();
}

// Authentic 16-Bit Arcade Bitmap Font Matrix (7x7 Grid per Character for Chunky Pixel-Block Logo)
const ARCADE_BITMAP_FONT = {
  P: [
    '1111110',
    '1100011',
    '1100011',
    '1111110',
    '1100000',
    '1100000',
    '1100000',
  ],
  I: [
    '1111110',
    '0011000',
    '0011000',
    '0011000',
    '0011000',
    '0011000',
    '1111110',
  ],
  X: [
    '1100011',
    '1100011',
    '0110110',
    '0011100',
    '0110110',
    '1100011',
    '1100011',
  ],
  E: [
    '1111111',
    '1100000',
    '1100000',
    '1111110',
    '1100000',
    '1100000',
    '1111111',
  ],
  L: [
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1100000',
    '1111111',
  ],
  N: [
    '1100011',
    '1110011',
    '1111011',
    '1101111',
    '1100111',
    '1100011',
    '1100011',
  ],
  G: [
    '0111110',
    '1100011',
    '1100000',
    '1101111',
    '1100011',
    '1100011',
    '0111110',
  ],
  U: [
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '1100011',
    '0111110',
  ],
};

// Draw a True 16-Bit Pixel-Block Word (Like "LOVE ATTACK" in the user's sample!)
function drawArcadePixelWord(ctx, word, centerX, topY, pSize = 6) {
  const chars = word.split('');
  const charW = 7 * pSize;
  const gap = pSize * 1.5;
  const totalW = chars.length * charW + (chars.length - 1) * gap;
  const startX = Math.round(centerX - totalW / 2);
  const startY = Math.round(topY);

  const rowColors = [
    '#ffb3c6',
    '#ff8fab',
    '#ff6b8b',
    '#ff4d6d',
    '#e0315a',
    '#c9184a',
    '#a4133c',
  ];

  // Pass 1: Deep 3D Pixel Extrusion & Thick Black Pixel Outline
  chars.forEach((ch, idx) => {
    const grid = ARCADE_BITMAP_FONT[ch];
    if (!grid) return;
    const cx = Math.round(startX + idx * (charW + gap));
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (grid[r][c] === '1') {
          const px = cx + c * pSize;
          const py = startY + r * pSize;
          // 3D Drop shadow block
          ctx.fillStyle = '#14061f';
          ctx.fillRect(px + pSize, py + pSize * 1.5, pSize + 2, pSize + 2);
          // 8-direction thick black pixel border
          ctx.fillStyle = '#1b0929';
          ctx.fillRect(px - pSize * 0.7, py - pSize * 0.7, pSize * 2.4, pSize * 2.4);
        }
      }
    }
  });

  // Pass 2: Vibrant Arcade Pink Pixel Fill + Specular Top-Left Highlight
  chars.forEach((ch, idx) => {
    const grid = ARCADE_BITMAP_FONT[ch];
    if (!grid) return;
    const cx = Math.round(startX + idx * (charW + gap));
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (grid[r][c] === '1') {
          const px = cx + c * pSize;
          const py = startY + r * pSize;
          ctx.fillStyle = rowColors[r];
          ctx.fillRect(px, py, pSize, pSize);

          const upEmpty = r === 0 || grid[r - 1][c] === '0';
          const leftEmpty = c === 0 || grid[r][c - 1] === '0';
          if (upEmpty && leftEmpty) {
            ctx.fillStyle = '#fff0f3';
            ctx.fillRect(px, py, Math.ceil(pSize * 0.6), Math.ceil(pSize * 0.6));
          }
        }
      }
    }
  });
}

// Helper: Draw Scene 1 Background (Studio 2D Snow Cliff + Live Animated Portal Voxels & Snowfall)
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

  // Live Rising 3D Voxel Cubes inside the Right Pixel Portal Chasm (x = 625..865)
  for (let i = 0; i < 14; i++) {
    const vx = 632 + ((i * 37) % 225);
    const vy = 535 - (((now * 0.14 + i * 43) % 480) | 0);
    const pulseR = 6 + (i % 3) * 2;
    if (i % 3 === 0) {
      drawIsoVoxelCube(ctx, vx, vy, pulseR, '#67e8f9', '#06b6d4', '#0891b2');
    } else if (i % 3 === 1) {
      drawIsoVoxelCube(ctx, vx, vy, pulseR, '#93c5fd', '#3b82f6', '#1d4ed8');
    } else {
      drawIsoVoxelCube(ctx, vx, vy, pulseR, '#ff8fab', '#ff4d6d', '#c9184a');
    }
  }

  // Gentle 2D Snowflakes drifting across the left snow cliff
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let s = 0; s < 16; s++) {
    const sx = ((s * 61 + now * 0.025) % 590);
    const sy = ((s * 47 + now * 0.05) % 345);
    ctx.beginPath();
    ctx.arc(sx, sy, (s % 2) + 2, 0, Math.PI * 2);
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

  // Animated Pixel Water Sparkles on the River (y = 336..396, x = 310..860)
  const waveTick = Math.floor(now / 280) % 2;
  ctx.fillStyle = '#ffffff';
  for (let w = 0; w < 10; w++) {
    const wx = snap(340 + w * 48 + (waveTick ? 8 : 0));
    const wy = snap(346 + ((w * 19) % 44));
    ctx.fillRect(wx, wy, P * 2, P);
  }

  // Live Drifting Pink Cherry Blossom Pixel Petals across the sky & riverside
  for (let i = 0; i < 20; i++) {
    const px = snap((960 - ((now * 0.048 + i * 67) % 980) + 980) % 960);
    const py = snap(40 + ((now * 0.032 + i * 53) % 395));
    ctx.fillStyle = i % 2 === 0 ? '#ff8fab' : '#ffd6e4';
    ctx.fillRect(px, py, P * 1.5, P);
  }
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

function initPixelMotionStudio() {
  const canvas = document.getElementById('pixel-stage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Preload Studio Backgrounds, 2D Hero Penguin (hero_2d.png), and Default Blue Pixel Penguin (sp_01.png)
  ensureIntroBackgrounds();
  ensureHero2DSprite();
  ensureSpeciesSprite('01');

  // Scene Chapter Buttons (0: 추락, 1: 픽셀월드, 2: 타이틀)
  document.querySelectorAll('.motion-mode-btn[data-scene]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setIntroScene(Number(btn.dataset.scene), true);
    });
  });

  // HTML Dialogue Next Scene Button
  document.getElementById('intro-dialogue-next-btn')?.addEventListener('click', () => {
    setIntroScene((MOTION_STATE.sceneIdx + 1) % 3, true);
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

  // Canvas Click Interaction (2 Menu Options on Scene 2 Title Screen)
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (MOTION_STATE.sceneIdx === 2) {
      if (mx >= 270 && mx <= 690 && my >= 188 && my <= 238) {
        scrollToSection('tab-codex');
        return;
      }
      if (mx >= 270 && mx <= 690 && my >= 239 && my <= 288) {
        setIntroScene(0, true);
        return;
      }
    }
    setIntroScene((MOTION_STATE.sceneIdx + 1) % 3, true);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (MOTION_STATE.sceneIdx !== 2) return;
    const rect = canvas.getBoundingClientRect();
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height;
    if (my >= 188 && my < 238) MOTION_STATE.menuHoverIdx = 0;
    else if (my >= 238 && my <= 290) MOTION_STATE.menuHoverIdx = 1;
  });

  setIntroScene(0, true);

  // Main 60 FPS Cutscene Loop (Strictly Default Blue Penguin: hero_2d.png -> sp_01.png!)
  function renderIntroCutscene(now) {
    const bluePixelPenguin = ensureSpeciesSprite('01');
    const hero2DImg = ensureHero2DSprite();

    let elapsed = now - MOTION_STATE.sceneStartTime;
    const curDuration = SCENE_DURATIONS[MOTION_STATE.sceneIdx] || 5600;

    if (MOTION_STATE.autoPlay && elapsed >= curDuration) {
      setIntroScene((MOTION_STATE.sceneIdx + 1) % 3, true);
      elapsed = 0;
    }

    const p = Math.min(1, Math.max(0, elapsed / curDuration));
    ctx.clearRect(0, 0, 960, 540);

    // ========================================================================
    // SCENE 0 ("1. 추락"): 2D Snow Cliff Walk -> Banana Slip -> Blue-to-Blue Pixel Scan Transformation!
    // ========================================================================
    if (MOTION_STATE.sceneIdx === 0) {
      const pitCenterX = 744;
      drawScene1Background(ctx, now);

      const slipStartP = 0.36;
      const scanStartP = 0.56;

      // Banana Peel on the Snow Cliff Edge (x = 532, y = 355)
      if (p < slipStartP) {
        drawCartoonBananaPeel(ctx, 532, 355, 0, 1.05);
      } else if (p < 0.72) {
        const flyP = Math.min(1, (p - slipStartP) / 0.32);
        const bx = 532 - flyP * 125;
        const by = 350 - Math.sin(flyP * Math.PI) * 150;
        drawCartoonBananaPeel(ctx, bx, by, flyP * Math.PI * 5, 1.1);
      }

      const runPhase = now * 0.024;
      let pengX = 95;
      let pengY = 290;
      let pengRot = 0;
      let scaleX = 1;
      let scaleY = 1;
      const spriteSize = 148;

      if (p < slipStartP) {
        // Phase A: Happy 2D Snow Walk along the cliff path
        const subP = p / slipStartP;
        pengX = 92 + subP * 432;
        const bounceSin = Math.sin(runPhase);
        pengY = 290 - Math.abs(bounceSin) * 18;
        pengRot = Math.sin(runPhase * 0.5) * 0.1;
        scaleX = 1 + bounceSin * 0.05;
        scaleY = 1 - bounceSin * 0.05;

        // Ground shadow on snow cliff
        ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
        ctx.beginPath();
        ctx.ellipse(pengX, 356, 38, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Snow puff footsteps
        for (let d = 0; d < 3; d++) {
          const dp = ((now * 0.004 + d * 0.33) % 1);
          ctx.fillStyle = `rgba(255, 255, 255, ${(1 - dp) * 0.85})`;
          ctx.beginPath();
          ctx.arc(pengX - 38 - dp * 28, 352 - dp * 12, 8 - dp * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        drawUploaded2DPenguin(ctx, pengX, pengY, spriteSize, pengRot, scaleX, scaleY);

        drawRetroSpeechBubble(
          ctx,
          pengX,
          pengY - 84,
          CURRENT_LANG === 'ko'
            ? '룰루랄라~ 눈밭 산책 날씨 죽인다~'
            : 'La la la~ Best snow day for a stroll~',
          '#0284c7'
        );
      } else if (p < scanStartP) {
        // Phase B: Banana Slip & High Arc into the Pixel Portal Chasm
        const subP = (p - slipStartP) / (scanStartP - slipStartP);
        pengX = 524 + subP * (pitCenterX - 524);
        pengY = 288 - Math.sin(subP * Math.PI) * 115 - subP * 14;
        pengRot = subP * Math.PI * 2.0;
        scaleX = 1.06;
        scaleY = 0.95;

        if (subP < 0.7) {
          drawComicStarburst(ctx, 534, 340, 20, 42, 10, '#fde047', '#dc2626', now * 0.006);
          ctx.fillStyle = '#991b1b';
          ctx.font = '900 15px "Pretendard", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('미끄덩!!', 534, 345);
        }

        drawUploaded2DPenguin(ctx, pengX, pengY, spriteSize, pengRot, scaleX, scaleY);

        drawRetroSpeechBubble(
          ctx,
          Math.min(760, pengX),
          Math.max(68, pengY - 86),
          CURRENT_LANG === 'ko'
            ? '어익후?! 웬 바나나야!! 으아아아악~!!'
            : 'WHOA?! A banana peel!! AHHHHH~!!',
          '#ff4d6d'
        );
      } else {
        // Phase C: Real-Time Holographic Scan-Beam Transformation (2D Blue hero_2d.png -> 48x48 Blue sp_01.png!)
        const subP = (p - scanStartP) / (1 - scanStartP);
        const scanRatio = Math.min(1, subP / 0.78);
        pengX = pitCenterX;
        pengY = 268 + Math.sin(now * 0.01) * 6 + (subP > 0.82 ? (subP - 0.82) * 420 : 0);

        const topEdge = pengY - spriteSize / 2;
        const scanY = topEdge + scanRatio * spriteSize;

        // Glowing Holographic Conversion Ring around the Penguin
        ctx.save();
        ctx.strokeStyle = 'rgba(103, 232, 249, 0.75)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(pengX, scanY, 88, 16, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Top Portion (Above Laser Scan Line): Crisp 48x48 BLUE Pixel Penguin (sp_01.png)
        if (bluePixelPenguin.loaded && bluePixelPenguin.img) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(pengX - spriteSize, topEdge - 20, spriteSize * 2, scanY - topEdge + 20);
          ctx.clip();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            bluePixelPenguin.img,
            pengX - spriteSize / 2,
            topEdge,
            spriteSize,
            spriteSize
          );
          ctx.restore();
        }

        // Bottom Portion (Below Laser Scan Line): Smooth 2D BLUE Penguin (hero_2d.png)
        if (scanRatio < 1 && MOTION_STATE.hero2DLoaded && hero2DImg) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            pengX - spriteSize,
            scanY,
            spriteSize * 2,
            topEdge + spriteSize - scanY + 20
          );
          ctx.clip();
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(
            hero2DImg,
            pengX - spriteSize / 2,
            topEdge,
            spriteSize,
            spriteSize
          );
          ctx.restore();
        }

        // Laser Scan Bar & Blue Voxel Particles along the Scan Line
        if (scanRatio < 1) {
          ctx.save();
          ctx.fillStyle = '#ff4d6d';
          ctx.fillRect(pengX - 92, scanY - 5, 184, 10);
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(pengX - 86, scanY - 2, 172, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(pengX - 80, scanY - 1, 160, 2);

          for (let k = 0; k < 7; k++) {
            const kx = pengX - 66 + k * 22 + Math.sin(now * 0.02 + k) * 6;
            const ky = scanY + Math.cos(now * 0.025 + k * 2) * 8;
            ctx.fillStyle = k % 2 === 0 ? '#3b82f6' : '#67e8f9';
            ctx.fillRect(kx - 4, ky - 4, 8, 8);
          }
          ctx.restore();
        }

        const pct = Math.min(100, Math.round(scanRatio * 100));
        drawRetroSpeechBubble(
          ctx,
          pengX,
          Math.max(62, topEdge - 14),
          scanRatio < 1
            ? CURRENT_LANG === 'ko'
              ? `어어어?! 파란 도트 펭귄으로 변환 중... (${pct}%)`
              : `Whoa?! Converting into Blue Pixel Penguin... (${pct}%)`
            : CURRENT_LANG === 'ko'
              ? '삐리릭! 48×48 파란 도트 펭귄 변신 완료!!'
              : 'BEEP! 48×48 Blue Pixel Penguin Complete!!',
          '#67e8f9',
          true
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 1 · 추락 & 도트변신',
        CURRENT_LANG === 'ko'
          ? '픽셀월드 가기 전 매끈했던 2D 파란 펭귄! 바나나를 밟고 도트 차원 균열에 빠져 48×48 파란 도트 펭귄으로 변신한다!'
          : 'Our smooth 2D blue penguin slips on a banana peel into the pixel rift and transforms into a 48×48 Blue Pixel Penguin!'
      );
    }

    // ========================================================================
    // SCENE 1 ("2. 픽셀월드"): 16-Bit Cherry Blossom Riverside Promenade Meetup!
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 1) {
      drawScene2PixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      // Protagonist Blue Pixel Penguin drops onto the Stone Riverside Promenade (x = 126, feet at y = 472)
      const spriteSize = 136;
      const heroGroundY = 336;
      const landP = Math.min(1, p / 0.16);
      const heroHop = landP >= 1 ? (Math.floor(now / 230) % 2 === 0 ? 0 : -10) : 0;
      const heroX = 126;
      const heroY = landP < 1 ? -140 + landP * (heroGroundY + 140) : heroGroundY + heroHop;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.fillRect(heroX + 32, heroGroundY + spriteSize - 10, spriteSize - 64, 8);

      if (bluePixelPenguin.loaded && bluePixelPenguin.img) {
        ctx.save();
        ctx.translate(heroX + spriteSize, heroY);
        ctx.scale(-1, 1);
        ctx.drawImage(bluePixelPenguin.img, 0, 0, spriteSize, spriteSize);
        ctx.restore();
      }

      // 5 Foreground Default Blue Pixel Penguin Friends on the Stone Walkway (ZERO Name Tags!)
      const fgFriends = [
        { x: 350, y: 338 },
        { x: 468, y: 326 },
        { x: 586, y: 340 },
        { x: 704, y: 326 },
        { x: 816, y: 338 },
      ];

      const walkInP = Math.min(1, p / 0.24);
      fgFriends.forEach((fr, idx) => {
        const fx = Math.round(fr.x + (1 - walkInP) * 130);
        const fHop = Math.floor((now + idx * 130) / 230) % 2 === 0 ? 0 : -10;
        const fy = fr.y + fHop;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(fx + 32, fr.y + spriteSize - 10, spriteSize - 64, 8);

        if (bluePixelPenguin.loaded && bluePixelPenguin.img) {
          ctx.drawImage(bluePixelPenguin.img, fx, fy, spriteSize, spriteSize);
        }
      });

      drawPixelHeart(ctx, 304, 356 - ((now * 0.04) % 45), 3, '#ff4d6d');
      drawPixelHeart(ctx, 545, 336 - (((now + 300) * 0.04) % 45), 3, '#fbbf24');
      drawPixelHeart(ctx, 775, 344 - (((now + 600) * 0.04) % 45), 3, '#ff4d6d');

      // Sequenced Single-Speaker Speech Bubbles (100% Zero Overlap!)
      if (p >= 0.14 && p < 0.42) {
        drawRetroSpeechBubble(
          ctx,
          heroX + spriteSize / 2 + 24,
          heroY - 8,
          CURRENT_LANG === 'ko'
            ? '헐 내 몸이 48×48 파란 도트가 됐잖아?! 너네도 빠졌냐?!'
            : 'Whoa I turned into a 48×48 Blue Pixel Penguin?! Did you fall in too?!',
          '#38bdf8'
        );
      } else if (p >= 0.42 && p < 0.72) {
        drawRetroSpeechBubble(
          ctx,
          fgFriends[1].x + spriteSize / 2,
          fgFriends[1].y - 10,
          CURRENT_LANG === 'ko'
            ? 'ㅋㅋㅋ 어서와!! 여긴 사도 아무 혜택 없는 도트 천국이야!'
            : 'Haha welcome!! This is the Zero-Perks Pixel Penguin Paradise!',
          '#ff4d6d'
        );
      } else if (p >= 0.72) {
        drawRetroSpeechBubble(
          ctx,
          fgFriends[3].x + spriteSize / 2 - 20,
          fgFriends[3].y - 10,
          CURRENT_LANG === 'ko'
            ? '복잡한 로드맵 따위 없다! 다 같이 둠칫둠칫 놀자!'
            : 'No complicated roadmap here! Just bounce and party!',
          '#fbbf24'
        );
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 2 · 픽셀월드',
        CURRENT_LANG === 'ko'
          ? '벚꽃 날리는 16비트 픽셀 월드 도착! 먼저 빠져서 살고 있던 파란 도트 펭귄 친구들이 몰려와 반갑게 환영해 준다!'
          : 'Arrived in the 16-bit Cherry Blossom Pixel World! Blue pixel penguin friends gather around to welcome him!'
      );
    }

    // ========================================================================
    // SCENE 2 ("3. 타이틀"): Authentic 16-Bit Bitmap Pixel Logo + Arcade RPG Command Box
    // ========================================================================
    else {
      drawScene2PixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      const titleBounce = Math.floor(now / 460) % 2 === 0 ? 0 : -4;
      const logoTopY = 26 + titleBounce;

      // Row 1: "PIXEL" in True 16-Bit Arcade Bitmap Pixel Blocks + Golden Pixel Heart
      drawArcadePixelWord(ctx, 'PIXEL', 480, logoTopY, 6);
      drawPixelHeart(ctx, 648, logoTopY + 18, 4, '#fbbf24');

      // Row 2: "PENGUIN" in True 16-Bit Arcade Bitmap Pixel Blocks
      drawArcadePixelWord(ctx, 'PENGUIN', 480, logoTopY + 56, 6);

      // Subtitle Pixel Tag ("PPENG · 10,000 VERYCHAT PFP")
      const subW = 284;
      const subH = 24;
      const subX = 480 - subW / 2;
      const subY = logoTopY + 112;
      ctx.fillStyle = '#0f0718';
      ctx.fillRect(subX - 3, subY - 3, subW + 6, subH + 6);
      ctx.fillStyle = '#ff4d6d';
      ctx.fillRect(subX, subY, subW, subH);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 12.5px "Pretendard", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PPENG · 10,000 VERYCHAT PFP', 480, subY + subH / 2 + 1);

      // Center RPG Command Box (Matches LOVE ATTACK Reference: Dark Navy + Crisp White/Slate Double Pixel Frame)
      const menuW = 396;
      const menuH = 92;
      const menuX = 480 - menuW / 2;
      const menuY = 190;

      ctx.fillStyle = '#090b14';
      ctx.fillRect(menuX - 6, menuY - 6, menuW + 12, menuH + 12);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(menuX - 3, menuY - 3, menuW + 6, menuH + 6);
      ctx.fillStyle = '#14182b';
      ctx.fillRect(menuX, menuY, menuW, menuH);

      const menuItems =
        CURRENT_LANG === 'ko'
          ? [
              'START PIXEL WORLD (10,000마리 도감도)',
              'REPLAY INTRO (인트로 처음부터 보기)',
            ]
          : [
              'START PIXEL WORLD (Open 10K Codex)',
              'REPLAY INTRO (Watch Cutscene)',
            ];

      menuItems.forEach((mText, idx) => {
        const rowY = menuY + 29 + idx * 34;
        const isSelected = (MOTION_STATE.menuHoverIdx % 2) === idx;
        if (isSelected) {
          ctx.fillStyle = 'rgba(255, 77, 109, 0.24)';
          ctx.fillRect(menuX + 12, rowY - 14, menuW - 24, 28);
          drawPixelHeart(ctx, menuX + 30, rowY, 2.5, '#ff4d6d');
        }
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.font = '900 14px "Pretendard", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(mText, menuX + 48, rowY + 1);
      });

      // Bottom Lineup of 6 Default Blue Pixel Penguins (sp_01.png) on the Stone Walkway (feet at y = 472)
      const pSize = 128;
      const startX = 96;
      const gapX = 132;
      const baseLineY = 344;

      for (let idx = 0; idx < 6; idx++) {
        const lx = startX + idx * gapX;
        const hop = Math.floor((now + idx * 140) / 250) % 2 === 0 ? 0 : -9;
        const ly = baseLineY + hop;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
        ctx.fillRect(lx + 30, baseLineY + pSize - 10, pSize - 60, 8);

        if (bluePixelPenguin.loaded && bluePixelPenguin.img) {
          ctx.drawImage(bluePixelPenguin.img, lx, ly, pSize, pSize);
        }
      }

      drawRetroDialogueBar(
        ctx,
        'SCENE 3 · 타이틀',
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
