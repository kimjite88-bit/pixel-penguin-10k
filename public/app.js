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

// Featured Generative Penguins from our 10,000 Collection (0-based #0 ~ #9,999)
const CURATED_BEAUTY_14 = [
  {
    edition: 4441,
    id: 'P04441',
    isSpecial: false,
    tier: 'Common',
    rank: 9811,
    score: '87.1',
    shortKo: '선글라스 펭귄',
    shortEn: 'Pixel Shades',
    titleKo: '#4441 선글라스 펭귄 (P04441)',
    titleEn: '#4441 Pixel Shades Penguin',
    themeKo: 'Common · Glacier Sky & Pixel Shades',
    themeEn: 'Common · Glacier Sky & Pixel Shades',
    noteKo: '파란 하늘에 픽셀 선글라스 낀 정감 가는 자식입니다.',
    noteEn: 'Blue sky and pixel shades.',
  },
  {
    edition: 962,
    id: 'P00962',
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
    id: 'P06521',
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
    id: 'P00042',
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
    id: 'P00499',
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
    id: 'P00074',
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
    id: 'P00191',
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
    id: 'P00020',
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
    id: 'P00024',
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
    id: 'P04275',
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
    id: 'P00087',
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
    id: 'P00107',
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
    id: 'P00311',
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
    id: 'P00776',
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
// 2. RETRO 16-BIT PIXEL GAME INTRO CUTSCENE ENGINE (#pixel-stage-canvas 1920x1080 HiDPI, 960x540 Logical)
//    Scene 0: Smooth 2D Blue Penguin walks on 2D snow cliff, slips on banana & pixelates into Blue Pixel Penguin (sp_01.png)
//    Scene 1: Lands in 16-Bit Cherry Blossom Pixel World & bounces with Blue Pixel Penguin friends
//    Scene 2: Authentic 16-Bit Arcade Title Screen (Sculpted Bitmap Pixel Logo + RPG Command Box + Centered 5-Penguin Crew)
// ============================================================================
const SCENE_DURATIONS = [6200, 5400, 5600]; // 3 Scenes: 0 (추락·도트변신), 1 (픽셀월드), 2 (타이틀)

const MOTION_STATE = {
  sceneIdx: 0,
  autoPlay: true,
  sceneStartTime: performance.now(),
  hero2DImg: null,
  hero2DLoaded: false,
  hero2DSheet: null,
  hero2DSheetLoaded: false,
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
  img.src = '/assets/motion_sprites/hero_2d.png?v=4.9.3';
  MOTION_STATE.hero2DImg = img;

  const sheet = new Image();
  sheet.onload = () => {
    MOTION_STATE.hero2DSheetLoaded = true;
  };
  sheet.src = '/assets/motion_sprites/hero_2d_sheet.png?v=4.9.3';
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
  img.src = `/assets/motion_sprites/sp_${key}.png?v=4.9.3`;

  const sheet = new Image();
  sheet.onload = () => {
    entry.sheet = sheet;
    entry.sheetLoaded = true;
  };
  sheet.src = `/assets/motion_sprites/sp_${key}_sheet.png?v=4.9.3`;
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
  }
  document.querySelectorAll('.motion-mode-btn[data-scene]').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.scene) === MOTION_STATE.sceneIdx);
  });

  const labelEl = document.getElementById('motion-hud-mode-label');
  if (labelEl) {
    const labelsKo = [
      'SCENE 1/3 · 2D 눈밭 산책 → 픽셀 구덩이 추락 & 파란 픽셀 펭귄 변신',
      'SCENE 2/3 · 16-BIT 픽셀 월드 도착! 알록달록 픽셀 펭귄 친구들과 환영 산책',
      'SCENE 3/3 · PIXEL PENGUIN WORLD — 베리챗 픽셀 펭귄 10,000마리',
    ];
    const labelsEn = [
      'SCENE 1/3 · 2D Snow Walk → Pixel Chasm Fall & Blue Pixel Transformation',
      'SCENE 2/3 · Welcome to 16-Bit Pixel World! Strolling with Colorful Penguin Friends',
      'SCENE 3/3 · PIXEL PENGUIN WORLD — 10,000 VeryChat Pixel Penguins',
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
  let stepBobY = 0;
  let waddleRot = 0;

  if (stepPhase === 0) {
    frameIdx = isBlinking ? 4 : 2; // walkL
    stepBobY = -3;
    waddleRot = -0.036;
  } else if (stepPhase === 2) {
    frameIdx = isBlinking ? 5 : 3; // walkR
    stepBobY = -3;
    waddleRot = 0.036;
  } else {
    frameIdx = isBlinking ? 1 : 0; // mid-stride pass
    stepBobY = 0;
    waddleRot = 0;
  }

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
  ctx.save();
  ctx.translate(cx, cy + anim.stepBobY);
  ctx.rotate(angleRad + anim.waddleRot);
  ctx.scale(scaleX, scaleY);
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

  // Clamp bubble horizontally & vertically so it never clips off-canvas
  const bx = Math.max(18, Math.min(960 - bw - 18, Math.round(anchorX - bw / 2)));
  const by = Math.max(14, Math.round(anchorY - bh - 10 + bob));
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

// Helper: Sleek Cyber-Arcade HUD Scanner Pill (for Scene 0 Phase C Pixel Conversion)
function drawPixelScanHudPill(ctx, cx, y, pct) {
  const w = 228;
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
    pct < 100 ? `BLUE PIXEL SCAN · ${pct}%` : 'PIXEL PENGUIN COMPLETE!',
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

function initPixelMotionStudio() {
  const canvas = document.getElementById('pixel-stage-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Preload Studio Backgrounds, 2D Hero Penguin (hero_2d_sheet.png), Hero Blue (sp_01), and Colorful Friends (04, 05, 06, 09, 15)
  ensureIntroBackgrounds();
  ensureHero2DSprite();
  ['01', '04', '05', '06', '09', '15'].forEach((id) => ensureSpeciesSprite(id));

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

  // Canvas Click Interaction (Mapped to 960x540 Logical Coordinates)
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 960;
    const my = ((e.clientY - rect.top) / rect.height) * 540;

    if (MOTION_STATE.sceneIdx === 2) {
      if (mx >= 310 && mx <= 650 && my >= 180 && my <= 225) {
        scrollToSection('tab-codex');
        return;
      }
      if (mx >= 310 && mx <= 650 && my >= 226 && my <= 272) {
        setIntroScene(0, true);
        return;
      }
    }
    setIntroScene((MOTION_STATE.sceneIdx + 1) % 3, true);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (MOTION_STATE.sceneIdx !== 2) return;
    const rect = canvas.getBoundingClientRect();
    const my = ((e.clientY - rect.top) / rect.height) * 540;
    if (my >= 180 && my < 226) MOTION_STATE.menuHoverIdx = 0;
    else if (my >= 226 && my <= 275) MOTION_STATE.menuHoverIdx = 1;
  });

  setIntroScene(0, true);

  // Main 60 FPS Cutscene Loop (1920x1080 HiDPI Buffer, 960x540 Logical Space)
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
    updateIntroProgressBars(MOTION_STATE.sceneIdx, p);

    // Render in 2x HiDPI (1920x1080) using 960x540 logical coordinates
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 960, 540);

    // ========================================================================
    // SCENE 0 ("1. 추락 & 도트변신"): 2D Snow Walk (Alternating Feet + Blink) -> Banana Slip -> Blue-to-Blue Pixel Scan!
    // ========================================================================
    if (MOTION_STATE.sceneIdx === 0) {
      const pitCenterX = 744;
      drawScene1Background(ctx, now);

      const slipStartP = 0.32;
      const scanStartP = 0.56;

      // Banana Peel on the Snow Cliff Edge (x = 532, y = 355)
      if (p < slipStartP) {
        drawCartoonBananaPeel(ctx, 532, 355, 0, 1.05);
      } else if (p < 0.72) {
        const flyP = Math.min(1, (p - slipStartP) / 0.34);
        const bx = 532 - flyP * 125;
        const by = 350 - Math.sin(flyP * Math.PI) * 145;
        drawCartoonBananaPeel(ctx, bx, by, flyP * Math.PI * 5, 1.08);
      }

      let pengX = 100;
      let pengY = 288;
      let pengRot = 0;
      let scaleX = 1;
      let scaleY = 1;
      const spriteSize = 148;

      if (p < slipStartP) {
        // Phase A: Happy 2D Snow Walk along the cliff path with Real Alternating Foot Steps & Eye Blinking!
        const subP = p / slipStartP;
        pengX = 96 + subP * 428;
        pengY = 288;

        // Soft elliptical ground shadow on snow cliff
        ctx.fillStyle = 'rgba(15, 23, 42, 0.20)';
        ctx.beginPath();
        ctx.ellipse(pengX, 356, 36, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Snow puff footsteps behind walking feet
        for (let d = 0; d < 3; d++) {
          const dp = (now * 0.004 + d * 0.33) % 1;
          ctx.fillStyle = `rgba(255, 255, 255, ${(1 - dp) * 0.8})`;
          ctx.beginPath();
          ctx.arc(pengX - 36 - dp * 26, 352 - dp * 10, 7 - dp * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        drawUploaded2DPenguin(ctx, pengX, pengY, spriteSize, pengRot, scaleX, scaleY, now, true);
        drawRetroSpeechBubble(
          ctx,
          pengX + 8,
          pengY - 76,
          CURRENT_LANG === 'ko'
            ? '룰루랄라~ 눈밭 산책 날씨 죽인다~ ♪'
            : 'La-la-la~ Perfect day for a snow walk~ ♪',
          '#38bdf8',
          now
        );

        drawRetroDialogueBar(
          ctx,
          'SCENE 1 · 눈밭 산책',
          CURRENT_LANG === 'ko'
            ? '픽셀월드 가기 전 매끈했던 2D 파란 펭귄! 눈을 깜빡이며 아장아장 눈밭 산책로를 걸어가는데...'
            : 'Before Pixel World, our smooth 2D blue penguin waddles and blinks happily along the snowy cliff...'
        );
      } else if (p < scanStartP) {
        // Phase B: Banana Slip Shock & High Arc into the Pixel Portal Chasm
        const subP = (p - slipStartP) / (scanStartP - slipStartP);
        if (subP < 0.48) {
          // Rear back in shock right as he steps on the banana peel so the shocked face (O_O) is crystal clear!
          const shockP = subP / 0.48;
          pengX = 524 + shockP * 42 + Math.sin(now * 0.09) * 2.5;
          pengY = 284 - Math.sin(shockP * Math.PI * 0.5) * 36;
          pengRot = -0.22 - shockP * 0.16;
          scaleX = 0.95;
          scaleY = 1.07;
        } else {
          // Launch from the banana peel and tumble into the Pixel Portal Chasm
          const fallP = (subP - 0.48) / 0.52;
          pengX = 566 + fallP * (pitCenterX - 566);
          pengY = 248 - Math.sin(fallP * Math.PI) * 82 + fallP * 26;
          pengRot = -0.38 + fallP * Math.PI * 1.65;
          scaleX = 1.04;
          scaleY = 0.96;
        }

        if (subP < 0.72) {
          drawComicStarburst(ctx, 534, 342, 18, 38, 10, '#fde047', '#e11d48', now * 0.006);
        }

        drawUploaded2DPenguin(
          ctx,
          pengX,
          pengY,
          spriteSize,
          pengRot,
          scaleX,
          scaleY,
          now,
          false,
          true
        );

        // Comic shock radiate lines above the penguin's head during the banana slip
        if (subP < 0.56) {
          ctx.save();
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          for (let k = -2; k <= 2; k++) {
            const ang = -Math.PI / 2 + k * 0.34 + pengRot * 0.5;
            const r1 = spriteSize * 0.48;
            const r2 = spriteSize * 0.6;
            ctx.beginPath();
            ctx.moveTo(pengX + Math.cos(ang) * r1, pengY - 8 + Math.sin(ang) * r1);
            ctx.lineTo(pengX + Math.cos(ang) * r2, pengY - 8 + Math.sin(ang) * r2);
            ctx.stroke();
          }
          ctx.restore();
        }

        drawRetroSpeechBubble(
          ctx,
          Math.min(790, pengX),
          Math.max(68, pengY - 88),
          CURRENT_LANG === 'ko'
            ? '어익후?! 웬 바나나야!! 으아아아악~!!'
            : 'WHOA?! A banana peel?! AAAAAAH~!!',
          '#fb7185',
          now
        );

        drawRetroDialogueBar(
          ctx,
          'SCENE 1 · 바나나 미끄덩!',
          CURRENT_LANG === 'ko'
            ? '어익후?! 눈밭 위의 바나나 껍질을 밟고 화들짝 놀라 픽셀 차원 균열(구덩이) 속으로 추락한다!'
            : 'WHOA?! Shocked as he slips on a banana peel, he tumbles into the glowing Pixel Rift!'
        );
      } else {
        // Phase C: Real-Time Holographic Scan-Beam Transformation (2D Blue hero_2d -> Pixel Blue sp_01!)
        const subP = (p - scanStartP) / (1 - scanStartP);
        const scanRatio = Math.min(1, subP / 0.78);
        pengX = pitCenterX;
        pengY = 274 + Math.sin(now * 0.01) * 4 + (subP > 0.86 ? (subP - 0.86) * 420 : 0);

        const topEdge = pengY - spriteSize / 2;
        const scanY = topEdge + scanRatio * spriteSize;
        const isScanShocked = scanRatio < 0.82;
        const scanAnim = getPenguinAnimState(now, 1, true, false, isScanShocked);

        // Top Portion (Above Laser Scan Line): Crisp 48x48 BLUE Pixel Penguin (sp_01_sheet.png)
        if (bluePixelPenguin.sheetLoaded && bluePixelPenguin.sheet) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(pengX - spriteSize, topEdge - 20, spriteSize * 2, scanY - topEdge + 20);
          ctx.clip();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            bluePixelPenguin.sheet,
            scanAnim.frameIdx * 256,
            0,
            256,
            256,
            pengX - spriteSize / 2,
            topEdge,
            spriteSize,
            spriteSize
          );
          ctx.restore();
        } else if (bluePixelPenguin.loaded && bluePixelPenguin.img) {
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

        // Bottom Portion (Below Laser Scan Line): Smooth 2D BLUE Penguin (hero_2d_sheet.png)
        if (scanRatio < 1 && MOTION_STATE.hero2DSheetLoaded && MOTION_STATE.hero2DSheet) {
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
            MOTION_STATE.hero2DSheet,
            scanAnim.frameIdx * 256,
            0,
            256,
            256,
            pengX - spriteSize / 2,
            topEdge,
            spriteSize,
            spriteSize
          );
          ctx.restore();
        } else if (scanRatio < 1 && MOTION_STATE.hero2DLoaded && hero2DImg) {
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

        // Holographic Laser Scan Beam + Live 48x48 Blue Pixel Block Reconstruction Band
        if (scanRatio < 1) {
          ctx.save();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
          ctx.fillRect(pengX - 88, scanY - 12, 176, 24);
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(pengX - 90, scanY - 4, 180, 8);
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(pengX - 86, scanY - 2, 172, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(pengX - 80, scanY - 1, 160, 2);

          // Live Blue & Cyan Pixel Blocks snapping into place along the beam
          for (let k = 0; k < 9; k++) {
            const kx = Math.round(pengX - 64 + k * 16);
            const ky = Math.round(scanY + Math.sin(now * 0.03 + k * 1.7) * 9);
            ctx.fillStyle = k % 3 === 0 ? '#ffffff' : k % 2 === 0 ? '#3b82f6' : '#67e8f9';
            ctx.fillRect(kx - 3, ky - 3, 6, 6);
          }
          ctx.restore();
        }

        const pct = Math.min(100, Math.round(scanRatio * 100));
        drawPixelScanHudPill(ctx, pengX, Math.max(20, topEdge - 92), pct);
        drawRetroSpeechBubble(
          ctx,
          pengX - 24,
          Math.max(104, topEdge - 6),
          isScanShocked
            ? CURRENT_LANG === 'ko'
              ? '어어어?! 내 몸이 픽셀로 변하고 있어!!'
              : 'Whoa?! I am turning into pixels!!'
            : CURRENT_LANG === 'ko'
              ? '우와아!! 파란 픽셀 펭귄으로 변신 완료!!'
              : 'Woohoo!! Transformed into a Blue Pixel Penguin!!',
          isScanShocked ? '#38bdf8' : '#34d399',
          now
        );

        drawRetroDialogueBar(
          ctx,
          'SCENE 1 · 픽셀 변환',
          CURRENT_LANG === 'ko'
            ? `삐리릭—! 차원 균열의 픽셀 광선을 맞고 매끈했던 파란 펭귄이 파란 픽셀 펭귄으로 변신 완료! (${pct}%)`
            : `BEEP—! Scanned by the dimensional pixel beam, our smooth blue penguin transforms into a Blue Pixel Penguin! (${pct}%)`
        );
      }
    }

    // ========================================================================
    // SCENE 1 ("2. 픽셀월드"): Hero Blue Penguin + Colorful Friends Strolling, Blinking & Chatting!
    // ========================================================================
    else if (MOTION_STATE.sceneIdx === 1) {
      drawScene2PixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      // Foreground Protagonist on Left: Default Blue Pixel Penguin (sp_01) Walking & Blinking on Stone Promenade!
      const spriteSize = 128;
      const heroGroundY = 338;
      const landP = Math.min(1, p / 0.14);
      const heroWalkOffset = landP >= 1 ? Math.sin(now * 0.0028) * 26 : 0;
      const heroX = Math.round(166 + heroWalkOffset);
      const heroY = landP < 1 ? Math.round(-130 + landP * (heroGroundY + 130)) : heroGroundY;

      drawPixelGroundShadow(ctx, heroX + spriteSize / 2, heroGroundY + spriteSize - 6, 58, 0);
      drawAnimatedPixelPenguin(ctx, bluePixelPenguin, heroX, heroY, spriteSize, now, {
        seed: 1,
        isWalking: true,
        flipX: false, // Native sprite faces RIGHT toward his colorful friends!
      });

      // 4 Colorful Pixel Penguin Friends Strolling, Stepping & Blinking on the Stone Promenade (ZERO labels under feet!)
      const colorfulFriends = [
        { sp: '05', baseX: 356, y: 338, seed: 2, amp: 22, speed: 0.0026 }, // Rose Pink
        { sp: '04', baseX: 476, y: 332, seed: 3, amp: 24, speed: 0.0023 }, // Apricot Orange
        { sp: '09', baseX: 596, y: 338, seed: 4, amp: 22, speed: 0.0027 }, // Jade Green
        { sp: '06', baseX: 716, y: 332, seed: 5, amp: 20, speed: 0.0024 }, // Violet Purple
      ];

      const walkInP = Math.min(1, p / 0.20);
      const renderedFriends = [];

      colorfulFriends.forEach((fr, idx) => {
        const spEntry = ensureSpeciesSprite(fr.sp);
        const strollX = walkInP >= 1 ? Math.sin(now * fr.speed + idx * 1.4) * fr.amp : 0;
        const fx = Math.round(fr.baseX + (1 - walkInP) * 115 + strollX);
        const fy = fr.y;

        drawPixelGroundShadow(ctx, fx + spriteSize / 2, fy + spriteSize - 6, 58, 0);

        // Friends on the right use flipX: true so they face LEFT toward the hero on the left!
        drawAnimatedPixelPenguin(ctx, spEntry, fx, fy, spriteSize, now, {
          seed: fr.seed,
          isWalking: true,
          flipX: true,
        });

        renderedFriends.push({ fx, fy });
      });

      // Funny Sequenced 16-Bit Speech Bubbles (1 active speaker at a time, zero overlap with hearts or heads!)
      if (p < 0.36) {
        drawPixelHeart(ctx, 668, 316 - ((now * 0.03) % 22), 2.8, '#ff4d6d');
        drawRetroSpeechBubble(
          ctx,
          heroX + spriteSize / 2 + 24,
          heroY - 4,
          CURRENT_LANG === 'ko'
            ? '헐 내 몸이 픽셀이 됐잖아?! 너네도 빠졌냐?!'
            : 'Whoa, I am pixels now?! Did you guys fall in too?!',
          '#38bdf8',
          now
        );
        drawRetroDialogueBar(
          ctx,
          'SCENE 2 · 픽셀월드 도착',
          CURRENT_LANG === 'ko'
            ? '"헐?! 내 몸이 네모난 픽셀이 됐잖아?!" 벚꽃 날리는 16비트 픽셀 월드에 무사히 착지한 파란 펭귄!'
            : '"Whoa?! I turned into a Blue Pixel Penguin?!" Safely landed in the 16-bit Cherry Blossom Pixel World!'
        );
      } else if (p < 0.68) {
        const speaker1 = renderedFriends[0] || { fx: 356, fy: 338 };
        drawPixelHeart(ctx, 738, 314 - ((now * 0.03) % 22), 2.8, '#fbbf24');
        drawRetroSpeechBubble(
          ctx,
          speaker1.fx + spriteSize / 2,
          speaker1.fy - 6,
          CURRENT_LANG === 'ko'
            ? 'ㅋㅋㅋ 어서와!! 여긴 사도 아무 혜택 없는 픽셀 천국이야!'
            : 'Haha welcome!! This is the Zero-Perks Pixel Penguin Paradise!',
          '#ff4d6d',
          now
        );
        drawRetroDialogueBar(
          ctx,
          'SCENE 2 · 알록달록 친구들 환영식',
          CURRENT_LANG === 'ko'
            ? '"ㅋㅋㅋ 어서와!! 여긴 사도 아무 혜택 없는 순수 베리챗 프사(PFP) 픽셀 천국이야!"'
            : '"Haha welcome!! This is the 100% Zero-Perks VeryChat PFP Pixel Penguin Paradise!"'
        );
      } else {
        const speaker2 = renderedFriends[2] || { fx: 596, fy: 338 };
        drawPixelHeart(ctx, 312, 318 - ((now * 0.03) % 22), 2.8, '#ff4d6d');
        drawRetroSpeechBubble(
          ctx,
          speaker2.fx + spriteSize / 2 - 12,
          speaker2.fy - 6,
          CURRENT_LANG === 'ko'
            ? '복잡한 로드맵 따위 없다! 다 같이 벚꽃길 산책하자!'
            : 'No complicated roadmap here! Let us stroll the cherry blossom road!',
          '#34d399',
          now
        );
        drawRetroDialogueBar(
          ctx,
          'SCENE 2 · 벚꽃 강변 산책 파티',
          CURRENT_LANG === 'ko'
            ? '"거창한 로드맵 따위 없다! 알록달록 픽셀 펭귄 친구들과 다 같이 벚꽃 강변을 걸으며 놀자!"'
            : '"No complicated roadmap here! Let\'s all stroll and party with our colorful penguin friends!"'
        );
      }
    }

    // ========================================================================
    // SCENE 2 ("3. 타이틀"): Authentic LOVE ATTACK-Grade 16-Bit Arcade Title Screen!
    // ========================================================================
    else {
      drawScene2PixelWorldBackground(ctx, now);
      ctx.imageSmoothingEnabled = false;

      const titleBounce = Math.floor(now / 480) % 2 === 0 ? 0 : -4;
      const logoTopY = 16 + titleBounce;

      // Row 1: Sculpted 9-Row "PIXEL" + Outlined Golden Arcade Heart on Right
      drawArcadePixelWord(ctx, 'PIXEL', 480, logoTopY, 5);
      drawGoldenArcadeHeart(ctx, 646, logoTopY + 18, 3.5);

      // Row 2: Sculpted 9-Row "PENGUIN"
      drawArcadePixelWord(ctx, 'PENGUIN', 480, logoTopY + 52, 5);

      // Clean Pixel-Outlined Subtitle Floating Over Sky (Matches "RESCENE" in LOVE ATTACK!)
      drawPixelOutlinedSubtitle(ctx, 'PPENG · 10,000 VERYCHAT PFP', 480, logoTopY + 124);

      // Compact, Authentic Dark-Navy RPG Command Box (Matches LOVE ATTACK Reference: 332x84)
      const menuW = 332;
      const menuH = 84;
      const menuX = 480 - menuW / 2;
      const menuY = 176;

      // Drop shadow + Notched 16-bit White/Slate Double Pixel Frame
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
          ? ['START WORLD · 10K 도감도', 'REPLAY INTRO · 다시보기']
          : ['START WORLD · 10K CODEX', 'REPLAY INTRO · WATCH AGAIN'];

      menuItems.forEach((mText, idx) => {
        const rowY = menuY + 26 + idx * 32;
        const isSelected = (MOTION_STATE.menuHoverIdx % 2) === idx;
        if (isSelected) {
          ctx.fillStyle = 'rgba(255, 77, 109, 0.22)';
          ctx.fillRect(menuX + 10, rowY - 13, menuW - 20, 26);
          drawPixelHeart(ctx, menuX + 28, rowY, 2.4, '#ff4d6d');
        }
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.font = '900 15.5px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(mText, menuX + 46, rowY + 1);
      });

      // Cozy Centered 5-Penguin Crew Strolling & Blinking on the Stone Walkway
      // Center is Hero Default Blue ('01'), flanked by Rose Pink ('05'), Apricot ('04'), Jade Green ('09'), Violet ('06')!
      const titleSquad = [
        { sp: '05', baseX: 236, seed: 2 },
        { sp: '04', baseX: 328, seed: 3 },
        { sp: '01', baseX: 420, seed: 1 }, // Hero Blue in Center
        { sp: '09', baseX: 512, seed: 4 },
        { sp: '06', baseX: 604, seed: 5 },
      ];
      const pSize = 122;
      const baseLineY = 342;

      titleSquad.forEach((member, idx) => {
        const spEntry = ensureSpeciesSprite(member.sp);
        const strollWave = Math.sin(now * 0.0024 + idx * 1.1) * 14;
        const lx = Math.round(member.baseX + strollWave);
        const ly = baseLineY;
        // Left 2 face right (flipX: false), Right 2 face left (flipX: true), Center Hero faces right (flipX: false)
        const flipX = idx > 2;

        drawPixelGroundShadow(ctx, lx + pSize / 2, baseLineY + pSize - 6, 54, 0);
        drawAnimatedPixelPenguin(ctx, spEntry, lx, ly, pSize, now, {
          seed: member.seed,
          isWalking: true,
          flipX,
        });
      });

      // Bottom-Left Retro Arcade Corner Tag (Matches "FAN-MADE · 비공식" in LOVE ATTACK!)
      const tagX = 16;
      const tagY = 500;
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

      drawRetroDialogueBar(
        ctx,
        'SCENE 3 · 타이틀',
        CURRENT_LANG === 'ko'
          ? '그렇게 시작된 베리챗 픽셀 펭귄 10,000마리 세상! 아래에서 내 마음에 드는 펭귄을 골라 6각형 프사로 장착해보세요.'
          : 'And so begins the world of 10,000 VeryChat Pixel Penguins! Pick your favorite penguin below and rock it as your Hexagon PFP.'
      );
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
    const id = `P${String(item.edition).padStart(5, '0')}`;
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

    const imgUrl = tok.edition <= 10 ? tok.image_url : tok.pixel_48_url;
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
    .map(
      (sp) => `
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
        const subtitle = isSpecial
          ? item.archetype
          : `${item.traits.Hat !== 'None' ? item.traits.Hat : item.traits.Clothes !== 'None' ? item.traits.Clothes : item.traits.Species}`;
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
          ${
            isSpecial && tok.genesis_bonus > 0
              ? `<div class="spec-row">
            <span class="spec-label">Genesis 1-of-1 Origin 가산점 (#0~#10 순번)</span>
            <span class="spec-value" style="color:var(--tier-genesis);">+${Number(tok.genesis_bonus).toLocaleString()} pts</span>
          </div>`
              : ''
          }
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
  } catch (err) {
    console.error('Failed to initialize config:', err);
  }
});
