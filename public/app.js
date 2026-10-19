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

// Official Logo (#4442) + 14 Featured Generative Penguins from our 10,000 Collection
const CURATED_BEAUTY_14 = [
  {
    edition: 4442,
    id: 'P04442',
    isSpecial: false,
    isLogo: true,
    tier: 'Common',
    rank: 9811,
    score: '87.1',
    shortKo: '대표 로고',
    shortEn: 'Official Logo',
    titleKo: '#4442 공식 대표 로고 — Pixel Penguin #4442 (P04442)',
    titleEn: '#4442 Official Collection Logo — Pixel Penguin #4442',
    themeKo: 'Common (#9811) · Glacier Sky & Pixel Shades',
    themeEn: 'Common (#9811) · Glacier Sky & Pixel Shades',
    noteKo:
      '희귀도 순위는 10,000마리 중 9,811등짜리 Common이지만, 파란 하늘에 도트 선글라스 낀 게 제일 정감 가서 당당히 공식 대표 로고로 뽑힌 귀한 자식입니다. 등급 낮아도 이렇게 이쁩니다.',
    noteEn:
      'Ranked #9,811 out of 10,000 (Common tier), yet chosen as our official collection logo simply because the blue sky and pixel shades look great. Proof that tier means nothing here.',
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
  { edition: 4442, labelKo: '공식 대표 로고', labelEn: 'Official Logo', sub: 'Pixel Shades · #4442' },
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
// 2. LIVE 48x48 (2,304 PIXELS) MOTION GRAPHICS ENGINE (#pixel-stage-canvas)
// ============================================================================
const MOTION_STATE = {
  activeIdx: 0,
  mode: 'morph', // 'morph' | 'matrix' | 'vortex'
  autoPlay: true,
  showGrid: false,
  lastSwitchTime: performance.now(),
  transitionStart: performance.now(),
  transitionDuration: 920,
  mouseX: -1000,
  mouseY: -1000,
  hoverGridX: -1,
  hoverGridY: -1,
  cells: [], // 2,304 cells (48x48)
  sparkles: [], // floating pixel aura particles on stage
  paletteHex: ['#FF4D6D', '#67E8F9', '#FBBF24', '#C084FC'],
};

// Initialize 2,304 (48x48) pixel cells
function createMotionCells() {
  const cells = [];
  const scale = 12; // 48 * 12 = 576px canvas
  for (let gy = 0; gy < 48; gy++) {
    for (let gx = 0; gx < 48; gx++) {
      const tx = gx * scale;
      const ty = gy * scale;
      cells.push({
        gx,
        gy,
        tx,
        ty,
        x: tx + (Math.random() - 0.5) * 280,
        y: ty + (Math.random() - 0.5) * 280,
        vx: 0,
        vy: 0,
        r: 17,
        g: 16,
        b: 25,
        sr: 17,
        sg: 16,
        sb: 25,
        tr: 17,
        tg: 16,
        tb: 25,
        isSubject: false,
        delay: (gx + gy) * 6,
        angleOffset: Math.random() * Math.PI * 2,
      });
    }
  }
  MOTION_STATE.cells = cells;

  // Create 36 floating stage pixel particles
  MOTION_STATE.sparkles = Array.from({ length: 36 }, (_, i) => ({
    x: Math.random() * 576,
    y: Math.random() * 576,
    vy: -0.6 - Math.random() * 0.9,
    vx: (Math.random() - 0.5) * 0.6,
    size: i % 3 === 0 ? 8 : 6,
    colorIdx: i % 4,
    phase: Math.random() * Math.PI * 2,
  }));
}

// Trigger a dramatic 2,304-pixel burst / vortex assembly
function triggerPixelBurst(style = 'vortex') {
  const now = performance.now();
  MOTION_STATE.transitionStart = now;
  const center = 288;

  for (const c of MOTION_STATE.cells) {
    c.sr = c.r;
    c.sg = c.g;
    c.sb = c.b;
    const dx = c.tx + 6 - center;
    const dy = c.ty + 6 - center;
    const dist = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx);

    if (style === 'vortex') {
      const swirlAngle = angle + 1.85 + (Math.random() - 0.5) * 0.5;
      const radius = dist * (1.25 + Math.random() * 0.55) + 40;
      c.x = center + Math.cos(swirlAngle) * radius;
      c.y = center + Math.sin(swirlAngle) * radius;
      c.delay = Math.min(340, dist * 0.75 + Math.random() * 70);
    } else {
      // Arcade cascade drop
      c.x = c.tx + (Math.random() - 0.5) * 60;
      c.y = c.ty - 180 - Math.random() * 240;
      c.delay = c.gy * 7 + (c.gx % 6) * 14;
    }
  }
}

// Decode native 48x48 PNG into 2,304 exact RGB pixels & extract palette
function load48x48IntoMotionEngine(item, burstStyle = 'vortex') {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const off = document.createElement('canvas');
    off.width = 48;
    off.height = 48;
    const octx = off.getContext('2d');
    octx.imageSmoothingEnabled = false;
    octx.drawImage(img, 0, 0, 48, 48);
    const data = octx.getImageData(0, 0, 48, 48).data;

    // Sample corner/border pixels to identify background color
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    const colorCounts = new Map();

    for (let i = 0; i < 2304; i++) {
      const pIdx = i * 4;
      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];

      const cell = MOTION_STATE.cells[i];
      cell.tr = r;
      cell.tg = g;
      cell.tb = b;

      // Determine if this pixel is part of the central character/aura vs flat background
      const colorDist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      const inCenter = cell.gx >= 7 && cell.gx <= 40 && cell.gy >= 4 && cell.gy <= 47;
      cell.isSubject = inCenter && colorDist > 28;

      const hex = rgbToHex(r, g, b);
      colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
    }

    // Extract top 7 dominant colors for the palette bar & stage particles
    const sortedColors = [...colorCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map((entry) => entry[0]);

    MOTION_STATE.paletteHex = sortedColors.length ? sortedColors : ['#FF4D6D', '#67E8F9'];
    renderPaletteSwatches(sortedColors);

    triggerPixelBurst(burstStyle);
  };
  img.src = `/img/${item.id}.png`;
}

function renderPaletteSwatches(hexList) {
  const wrap = document.getElementById('motion-palette-swatches');
  if (!wrap) return;
  wrap.innerHTML = hexList
    .map(
      (hex) => `
    <span class="palette-chip" title="${hex}">
      <span class="palette-color-box" style="background:${hex};"></span>
      <span>${hex}</span>
    </span>
  `
    )
    .join('');
}

// Select one of the 14 Curated Penguins (or any token) for the Motion Studio
async function selectMotionPenguin(editionOrItem, userInitiated = true) {
  let idx = CURATED_BEAUTY_14.findIndex((c) => c.edition === Number(editionOrItem));
  let item = idx !== -1 ? CURATED_BEAUTY_14[idx] : null;

  if (!item) {
    idx = 0;
    item = CURATED_BEAUTY_14[0];
  }

  MOTION_STATE.activeIdx = idx;
  MOTION_STATE.lastSwitchTime = performance.now();

  // Highlight active button in 14-penguin dock
  document.querySelectorAll('.dock-penguin-btn').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.edition) === item.edition);
  });

  // Update PiP badge
  const pipWrap = document.getElementById('motion-gif-pip');
  const pipImg = document.getElementById('motion-pip-img');
  const pipLabel = document.getElementById('motion-pip-label');
  if (pipWrap && pipImg && pipLabel) {
    if (item.isSpecial) {
      pipImg.src = `/assets/specials/${item.edition}_fast.gif`;
      pipLabel.textContent = `MYTHIC #${item.edition}`;
    } else {
      pipImg.src = `/img/${item.id}.png`;
      pipLabel.textContent = item.isLogo ? 'OFFICIAL LOGO' : 'NATIVE 48×48 PNG';
    }
  }

  // Update Right-Side Curator Spotlight Card
  const tierPill = document.getElementById('spot-tier-pill');
  if (tierPill) {
    tierPill.textContent = item.isLogo
      ? 'OFFICIAL LOGO'
      : item.tier.toUpperCase();
    tierPill.className = `tier-pill tier-${item.tier}`;
  }

  const rankPill = document.getElementById('spot-rank-pill');
  if (rankPill) {
    rankPill.textContent = item.isLogo
      ? `Official Logo #4442 (P04442) · Rank #${item.rank.toLocaleString()} (${item.score} pts)`
      : `rarity.tools Rank #${item.rank.toLocaleString()} / 10,000 (${item.score} pts)`;
  }

  const themePill = document.getElementById('spot-theme-pill');
  if (themePill) {
    themePill.textContent = CURRENT_LANG === 'ko' ? item.themeKo : item.themeEn;
  }

  const idEl = document.getElementById('spot-token-id');
  if (idEl) idEl.textContent = item.id;

  const titleEl = document.getElementById('spot-title');
  if (titleEl) {
    titleEl.textContent = CURRENT_LANG === 'ko' ? item.titleKo : item.titleEn;
  }

  const noteEl = document.getElementById('spot-curator-note');
  if (noteEl) {
    noteEl.textContent = CURRENT_LANG === 'ko' ? item.noteKo : item.noteEn;
  }

  // Load 48x48 pixels into Canvas Motion Engine
  const style = idx % 2 === 0 ? 'vortex' : 'cascade';
  load48x48IntoMotionEngine(item, style);

  // Fetch trait chips for the spotlight card
  try {
    const res = await fetch(`/api/token/${item.edition}`);
    if (res.ok) {
      const tok = await res.json();
      const chipsWrap = document.getElementById('spot-traits-chips');
      if (chipsWrap && tok.trait_breakdown) {
        chipsWrap.innerHTML = tok.trait_breakdown
          .filter((b) => b.value !== 'None')
          .slice(0, 6)
          .map(
            (b) => `
          <div class="spot-trait-chip" onclick="filterExplorerByTrait('${escapeHtml(b.trait_type)}', '${escapeHtml(b.value).replace(/'/g, "\\'")}')" title="클릭 시 동일 파츠 검색">
            <div class="c-cat">${escapeHtml(b.trait_type)} (+${b.score} pts)</div>
            <div class="c-val">${escapeHtml(b.value)}</div>
          </div>
        `
          )
          .join('');
      }
    }
  } catch (e) {
    // Ignore transient fetch errors
  }

  // Wire spotlight buttons
  const equipBtn = document.getElementById('spot-equip-pfp-btn');
  if (equipBtn) {
    equipBtn.onclick = () => {
      loadPfpPreview(item.edition);
      scrollToSection('top');
    };
  }
  const inspectBtn = document.getElementById('spot-inspect-btn');
  if (inspectBtn) {
    inspectBtn.onclick = () => {
      openTokenModal(item.edition);
    };
  }
}

function initPixelMotionStudio() {
  const canvas = document.getElementById('pixel-stage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  createMotionCells();

  // Build 14 Curated Dock Buttons
  const dockGrid = document.getElementById('curator-dock-grid');
  if (dockGrid) {
    dockGrid.innerHTML = CURATED_BEAUTY_14.map((item, i) => {
      const thumbSrc = item.isSpecial
        ? `/assets/specials/${item.edition}_fast.gif`
        : `/img/${item.id}.png`;
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
      });
    });
  }

  // Mode Switcher Buttons
  document.querySelectorAll('.motion-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.motion-mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      MOTION_STATE.mode = btn.dataset.mode;

      const labelEl = document.getElementById('motion-hud-mode-label');
      if (labelEl) {
        if (MOTION_STATE.mode === 'morph') {
          labelEl.textContent = 'LIVE 48×48 PIXEL ASSEMBLER & AURA · 60 FPS';
        } else if (MOTION_STATE.mode === 'matrix') {
          labelEl.textContent = '48×48 LED DOT MATRIX & LASER SCANNER';
        } else {
          labelEl.textContent = 'INTERACTIVE PIXEL GRAVITY & VORTEX FIELD';
        }
      }
      triggerPixelBurst('vortex');
    });
  });

  // Control Buttons
  document.getElementById('btn-pixel-burst')?.addEventListener('click', () => {
    triggerPixelBurst('vortex');
  });

  const autoBtn = document.getElementById('btn-motion-autoplay');
  autoBtn?.addEventListener('click', () => {
    MOTION_STATE.autoPlay = !MOTION_STATE.autoPlay;
    MOTION_STATE.lastSwitchTime = performance.now();
    autoBtn.classList.toggle('active-toggle', MOTION_STATE.autoPlay);
    const lblEl = document.getElementById('autoplay-label');
    if (lblEl) {
      lblEl.textContent =
        CURRENT_LANG === 'ko'
          ? `자동 쇼케이스 전환: ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`
          : `Auto-Cycle Showcase: ${MOTION_STATE.autoPlay ? 'ON' : 'OFF'}`;
    }
  });

  const gridBtn = document.getElementById('btn-motion-grid');
  gridBtn?.addEventListener('click', () => {
    MOTION_STATE.showGrid = !MOTION_STATE.showGrid;
    gridBtn.classList.toggle('active-toggle', MOTION_STATE.showGrid);
  });

  document.getElementById('btn-motion-next')?.addEventListener('click', () => {
    const nextIdx = (MOTION_STATE.activeIdx + 1) % CURATED_BEAUTY_14.length;
    selectMotionPenguin(CURATED_BEAUTY_14[nextIdx].edition, true);
  });

  // Mouse interaction on 576x576 canvas
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    MOTION_STATE.mouseX = mx;
    MOTION_STATE.mouseY = my;

    const gx = Math.max(0, Math.min(47, Math.floor(mx / 12)));
    const gy = Math.max(0, Math.min(47, Math.floor(my / 12)));
    MOTION_STATE.hoverGridX = gx;
    MOTION_STATE.hoverGridY = gy;

    const cell = MOTION_STATE.cells[gy * 48 + gx];
    const hudCoords = document.getElementById('motion-hud-coords');
    if (cell && hudCoords) {
      const hex = rgbToHex(cell.tr, cell.tg, cell.tb);
      hudCoords.textContent = `PIXEL (${gx}, ${gy}) · ${hex} · ${cell.isSubject ? 'CHARACTER/AURA' : 'BACKGROUND'}`;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    MOTION_STATE.mouseX = -1000;
    MOTION_STATE.mouseY = -1000;
    MOTION_STATE.hoverGridX = -1;
    MOTION_STATE.hoverGridY = -1;
    const hudCoords = document.getElementById('motion-hud-coords');
    if (hudCoords) {
      hudCoords.textContent = 'GRID: 48×48 (2,304 PX) · HOVER TO INSPECT';
    }
  });

  canvas.addEventListener('click', () => {
    triggerPixelBurst('vortex');
  });

  // Load initial #4442 Official Collection Logo
  selectMotionPenguin(4442, false);

  // Main 60 FPS Render Loop for the 48x48 Pixel Motion Stage
  function renderStage(now) {
    // Auto-cycle every 5.4 seconds if autoPlay is enabled and mouse is not hovering canvas
    if (
      MOTION_STATE.autoPlay &&
      MOTION_STATE.mouseX < 0 &&
      now - MOTION_STATE.lastSwitchTime > 5400
    ) {
      const nextIdx = (MOTION_STATE.activeIdx + 1) % CURATED_BEAUTY_14.length;
      selectMotionPenguin(CURATED_BEAUTY_14[nextIdx].edition, false);
    }

    ctx.fillStyle = '#09080f';
    ctx.fillRect(0, 0, 576, 576);

    const elapsed = now - MOTION_STATE.transitionStart;
    // Stepped bobbing offset for the character silhouette (authentic 16-bit RPG idle bounce: 0 or -4px on 576px canvas)
    const idleStepBob = Math.floor(now / 420) % 2 === 0 ? 0 : -4;
    // Laser scanline row (0..47) for Matrix mode
    const scanRow = Math.floor((now / 45) % 56) - 4;

    const isMatrix = MOTION_STATE.mode === 'matrix';
    const isVortex = MOTION_STATE.mode === 'vortex';
    const showGrid = MOTION_STATE.showGrid || isMatrix;
    const cellDrawSize = showGrid ? 11 : 12;

    for (let i = 0; i < 2304; i++) {
      const c = MOTION_STATE.cells[i];
      const localElapsed = Math.max(0, elapsed - c.delay);
      const t = Math.min(1, localElapsed / 560);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - t, 3);

      let targetX = c.tx;
      let targetY = c.ty + (c.isSubject && t >= 0.98 ? idleStepBob : 0);

      // Mouse interaction (repulsion / swirl in Vortex mode, or subtle lens push in Morph mode)
      if (MOTION_STATE.mouseX >= 0) {
        const dx = targetX + 6 - MOTION_STATE.mouseX;
        const dy = targetY + 6 - MOTION_STATE.mouseY;
        const dist = Math.hypot(dx, dy);
        const radius = isVortex ? 135 : 68;
        if (dist < radius && dist > 0.1) {
          const force = Math.pow((radius - dist) / radius, 1.6);
          const angle = Math.atan2(dy, dx) + (isVortex ? 0.95 : 0);
          const push = isVortex ? 54 * force : 14 * force;
          targetX += Math.cos(angle) * push;
          targetY += Math.sin(angle) * push;
        }
      }

      const drawX = Math.round(c.x + (targetX - c.x) * ease);
      const drawY = Math.round(c.y + (targetY - c.y) * ease);

      c.r = c.sr + (c.tr - c.sr) * ease;
      c.g = c.sg + (c.tg - c.sg) * ease;
      c.b = c.sb + (c.tb - c.sb) * ease;

      let rr = c.r;
      let gg = c.g;
      let bb = c.b;

      // Matrix Scanner highlight
      if (isMatrix && Math.abs(c.gy - scanRow) <= 1) {
        const boost = c.gy === scanRow ? 70 : 32;
        rr = Math.min(255, rr + boost);
        gg = Math.min(255, gg + boost + 18);
        bb = Math.min(255, bb + boost + 25);
      }

      // Transition wave shimmer
      if (t > 0.1 && t < 0.85) {
        rr = Math.min(255, rr + 28);
        gg = Math.min(255, gg + 28);
        bb = Math.min(255, bb + 35);
      }

      ctx.fillStyle = `rgb(${rr | 0}, ${gg | 0}, ${bb | 0})`;
      ctx.fillRect(drawX, drawY, cellDrawSize, cellDrawSize);
    }

    // Render live floating pixel aura particles over the stage
    const pal = MOTION_STATE.paletteHex;
    for (const sp of MOTION_STATE.sparkles) {
      sp.y += sp.vy;
      sp.x += sp.vx + Math.sin(now * 0.003 + sp.phase) * 0.25;
      if (sp.y < -12) {
        sp.y = 584;
        sp.x = Math.random() * 576;
      }
      const px = Math.round(sp.x / 6) * 6;
      const py = Math.round(sp.y / 6) * 6;

      ctx.fillStyle = pal[sp.colorIdx % pal.length] || '#67E8F9';
      ctx.globalAlpha = 0.55 + 0.35 * Math.sin(now * 0.006 + sp.phase);
      ctx.fillRect(px, py, sp.size, sp.size);
    }
    ctx.globalAlpha = 1;

    // Highlight hovered 48x48 pixel cell with a crisp reticle
    if (MOTION_STATE.hoverGridX >= 0 && MOTION_STATE.hoverGridY >= 0) {
      const hx = MOTION_STATE.hoverGridX * 12;
      const hy = MOTION_STATE.hoverGridY * 12;
      ctx.strokeStyle = '#67E8F9';
      ctx.lineWidth = 2;
      ctx.strokeRect(hx - 1, hy - 1, 14, 14);
    }

    requestAnimationFrame(renderStage);
  }

  requestAnimationFrame(renderStage);
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

  // Duplicate items twice for seamless infinite 0 -> -50% loop
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

  const topbar = document.getElementById('topbar-mint-text');
  if (topbar) {
    topbar.textContent =
      lang === 'ko'
        ? '이번 주 금요일 (2026. 10. 23) VERY Mainnet (4613) 공식 민팅 오픈 · 민팅가 100 VERY · 총 10,000개 (심볼: PPENG)'
        : 'THIS FRIDAY (OCT 23, 2026) OFFICIAL MINT ON VERY MAINNET (4613) · MINT PRICE: 100 VERY · SUPPLY: 10,000 (SYMBOL: PPENG)';
  }

  // Refresh active curated spotlight text in new language
  const activeItem = CURATED_BEAUTY_14[MOTION_STATE.activeIdx];
  if (activeItem) {
    const themePill = document.getElementById('spot-theme-pill');
    const titleEl = document.getElementById('spot-title');
    const noteEl = document.getElementById('spot-curator-note');
    if (themePill) themePill.textContent = lang === 'ko' ? activeItem.themeKo : activeItem.themeEn;
    if (titleEl) titleEl.textContent = lang === 'ko' ? activeItem.titleKo : activeItem.titleEn;
    if (noteEl) noteEl.textContent = lang === 'ko' ? activeItem.noteKo : activeItem.noteEn;
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
    document.getElementById('pfp-sim-title').textContent =
      tok.edition === 4442 ? `${tok.name} (공식 대표 로고)` : tok.name;
    document.getElementById('pfp-sim-id').textContent = tok.id;

    const tierEl = document.getElementById('pfp-sim-tier');
    tierEl.textContent = tok.edition === 4442 ? `${tok.tier} (Official Logo)` : tok.tier;
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
        selectMotionPenguin(n, true);
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
          <span class="tier-pill tier-Mythic">MYTHIC</span>
          <span class="rank-pill">Rank #${sp.rarity_rank}</span>
        </div>
      </div>
      <div class="nft-card-meta">
        <span>${sp.id}</span>
        <span>Edition #${sp.edition} / 10,000</span>
      </div>
      <div class="nft-card-title">${escapeHtml(sp.archetype)}</div>
      <div class="nft-card-footer">
        <span class="price-tag">100 VERY</span>
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
              <span class="rank-pill">#${item.rarity_rank}</span>
            </div>
          </div>
          <div class="nft-card-meta">
            <span>${item.id}</span>
            <span>#${item.edition}</span>
          </div>
          <div class="nft-card-title">${escapeHtml(subtitle)}</div>
          <div class="nft-card-footer">
            <span class="price-tag">100 VERY</span>
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
          <span class="pill-tag">Rank #${tok.rarity_rank.toLocaleString()} / 10,000</span>
          <span class="pill-tag gold">Mint Price: 100 VERY</span>
        </div>

        <h2 id="modal-token-title" style="font-size:24px; font-weight:900; margin-bottom:6px;">${escapeHtml(tok.name)}</h2>
        <p style="font-size:13.5px; color:var(--text-secondary); margin-bottom:14px;">
          VERY CHAT 고인물 @happy Ahndoge가 빚은 10,000마리 중 ${tok.edition}번째로 태어난 귀한 자식입니다. 등급(${tok.tier})이나 순위(#${tok.rarity_rank.toLocaleString()})가 높든 낮든 사신다고 돈 드리거나 뭐 해드리는 거 일절 없으며, 철저히 베리챗 프사(Verified PFP) 전용입니다.
        </p>

        <div class="spec-rows-stack" style="margin-bottom:14px;">
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">번호 (Token ID / Edition)</span>
            <span class="spec-value">${tok.id} (#${tok.edition} / 10,000)</span>
          </div>
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">나누라길래 매긴 점수 (Rarity Score)</span>
            <span class="spec-value ice">${tok.rarity_score.toLocaleString()} pts (Rank #${tok.rarity_rank.toLocaleString()} · 점수 높다고 뭐 안 줌)</span>
          </div>
          <div class="spec-row" style="padding:10px 14px;">
            <span class="spec-label">장착한 옵션 파츠 수</span>
            <span class="spec-value">${tok.active_trait_stat.active_count}개 장착 (+${tok.active_trait_stat.score} pts · ${tok.active_trait_stat.pct}%)</span>
          </div>
        </div>

        <h4 style="font-size:14px; font-weight:800; margin-bottom:6px;">9가지 파츠 차림새 (누르면 같은 파츠 낀 자식들만 모아봄)</h4>
        <div class="trait-breakdown-list">
          ${traitsHtml}
        </div>

        <div class="hash-box">
          <div><strong>[쌍둥이 없음 증명 해시 (SHA-256)]</strong></div>
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
    { label: '2. 발행자 명 (Issuer / Creator)', value: '@happy Ahndoge (VERY CHAT 고인물)' },
    { label: '3. 심볼 (Symbol)', value: 'PPENG' },
    {
      label: '4. 공식 대표 로고 (#4442 · P04442 · 1024×1024 PNG)',
      value: `${siteUrl}/assets/logo_4442_1024.png`,
    },
    { label: '5. 공식 홈페이지 링크 (Official Website · 단독 링크)', value: siteUrl },
    { label: '6. 프로젝트 설명 — 영문 (VERY PUNKS 레퍼런스 스타일)', value: storyEn },
    { label: '7. 프로젝트 설명 / 취지 — 국문', value: storyKo },
    {
      label: '8. 민팅 및 마켓 스펙 요약',
      value: '체인: VERY Mainnet (4613) | 토큰 표준: ERC-721 | 공급량: 10,000 | 대표 로고: #4442 (P04442) | 민팅 일정: 2026년 10월 23일 (금) | 민팅가: 100 VERY | VERY 소각: 거래 금액의 5% (0x0000...dEaD) | 컬렉션 수수료: 0%',
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
        `• 발행자 명: @happy Ahndoge (VERY CHAT 고인물)`,
        `• 심볼(Symbol): PPENG`,
        `• 공식 대표 로고: #4442 (P04442) — ${siteUrl}/assets/logo_4442_1024.png`,
        `• 체인 / 표준: VERY Mainnet (4613) / ERC-721`,
        `• 총 공급량: 10,000`,
        `• 민팅 일정 / 가격: 2026년 10월 23일(금) / 100 VERY`,
        `• VERY 소각 / 컬렉션 수수료: 거래 금액의 5% (0x0000...dEaD) / 0%`,
        `• 공식 홈페이지(단독 링크): ${siteUrl}`,
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
