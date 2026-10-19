/**
 * PIXEL PENGUIN (Pixel Penguin 10K · Symbol: PPENG) — Frontend Application & 48x48 Pixel Motion Engine
 * Issued by Very Penguin Labs on VERY Mainnet (4613)
 */

let APP_CONFIG = null;
let CURRENT_LANG = 'ko';
let CURRENT_PAGE = 1;
let TOTAL_PAGES = 1;
let CURRENT_PFP_TOKEN = 2;
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

// Curated 14 Prettiest Masterpieces from our 10,000 Collection
const CURATED_BEAUTY_14 = [
  {
    edition: 2,
    id: 'P00002',
    isSpecial: true,
    tier: 'Mythic',
    rank: 1,
    score: '60,012.23',
    shortKo: '천상의 대천사',
    shortEn: 'Archangel',
    titleKo: '#2 천상의 대천사 (Celestial Archangel)',
    titleEn: '#2 Celestial Archangel (Mythic 1/1)',
    themeKo: '천상의 성소 · 세라핌 날개 & 황금 헤일로',
    themeEn: 'Celestial Sanctuary · Seraphim Wings & Halo',
    noteKo:
      '전체 10,000점 중 희귀도 1위(Rank #1 · 60,012.23점)에 빛나는 대표 신화 1-of-1 애니메이션 원화입니다. 황금빛 성소 배경 위에서 공중 부양하는 찬란한 황금 헤일로, 세라핌의 순백 날개, 사파이어빛 깃털과 깜찍한 윙크(F2 프레임)가 어우러져 컬렉션 최고의 미학을 자랑합니다.',
    noteEn:
      'Ranked #1 out of all 10,000 tokens (60,012.23 pts). A sapphire-blue angel penguin winking beneath a floating golden halo with seraphim white wings and glowing feather particles in a golden sanctuary.',
  },
  {
    edition: 5,
    id: 'P00005',
    isSpecial: true,
    tier: 'Mythic',
    rank: 3,
    score: '60,007.14',
    shortKo: '빙하의 제왕',
    shortEn: 'Glacier King',
    titleKo: '#5 빙하의 제왕 (Glacier Emperor)',
    titleEn: '#5 Glacier Emperor (Mythic 1/1)',
    themeKo: '오로라 빙하 궁전 · 얼음 결정 왕관',
    themeEn: 'Aurora Glacier Palace · Ice Crystal Crown',
    noteKo:
      '극지방 오로라가 일렁이는 빙하 궁전을 배경으로 눈보라 결정이 흩날리는 1-of-1 신화 원화(Rank #3)입니다. 정교한 얼음 결정 왕관과 황실 모피 망토, 맑은 프로스트 사파이어 눈빛과 귀여운 윙크 모션이 압권입니다.',
    noteEn:
      'Set in an aurora-lit glacier palace with swirling frost crystals (Rank #3). Features a sparkling ice crystal crown, royal glacier fur mantle, and a charming animated wink.',
  },
  {
    edition: 6,
    id: 'P00006',
    isSpecial: true,
    tier: 'Mythic',
    rank: 4,
    score: '60,007.14',
    shortKo: '심해의 지배자',
    shortEn: 'Abyssal Ruler',
    titleKo: '#6 심해의 지배자 (Abyssal Sea Ruler)',
    titleEn: '#6 Abyssal Sea Ruler (Mythic 1/1)',
    themeKo: '발광 심해 신전 · 해파리 & 산호 왕관',
    themeEn: 'Bioluminescent Palace · Jellyfish & Coral Crown',
    noteKo:
      '신비로운 생체발광 심해 신전에서 빛나는 해파리와 물방울이 피어오르는 1-of-1 신화 원화(Rank #4)입니다. 황금 산호·사파이어 바다 왕관과 진주 비늘 망토의 청록색 도트 그라데이션이 예술적인 작품입니다.',
    noteEn:
      'Glowing jellyfish and rising bubbles illuminate a bioluminescent deep-sea palace (Rank #4), crowned with golden coral and an abyssal pearl-scale royal mantle.',
  },
  {
    edition: 43,
    id: 'P00043',
    isSpecial: false,
    tier: 'Epic',
    rank: 187,
    score: '517.67',
    shortKo: '매화 꽃바람 낚시',
    shortEn: 'Maehwa Angler',
    titleKo: '#43 봄 매화 꽃바람 낚시꾼 (Maehwa Blossom Angler)',
    titleEn: '#43 Spring Maehwa Blossom Angler (Epic)',
    themeKo: '봄 매화 꽃바람 오라 · 화관 & 북극 빙어',
    themeEn: 'Spring Maehwa Breeze · Floral Wreath & Smelt',
    noteKo:
      '제너레이티브 펭귄 중 가장 사랑스러운 조합으로 손꼽히는 Epic 등급 대표작(Rank #187)입니다. 밤하늘 위로 분홍빛 봄 매화 꽃잎(Spring Maehwa Breeze)이 흩날리고, 머리엔 꽃화관(Floral Wreath), 등엔 얼음 낚싯대, 부리엔 방금 낚은 북극 빙어를 문 채 나른한 눈웃음을 짓고 있습니다.',
    noteEn:
      'One of the cutest generative combinations in the collection (Rank #187): Floral Wreath, Spring Maehwa Breeze petal aura, Fishing Rod & Ice Catch, and a freshly caught Arctic Smelt in its beak.',
  },
  {
    edition: 35,
    id: 'P00035',
    isSpecial: false,
    tier: 'Uncommon',
    rank: 2263,
    score: '265.17',
    shortKo: '설원 매화 한복',
    shortEn: 'Maehwa Hanbok',
    titleKo: '#35 설원 다이아몬드 왕실 매화 한복 (Snowfall Maehwa Hanbok)',
    titleEn: '#35 Snowfall Royal Maehwa Silk Hanbok',
    themeKo: '블러쉬 로즈 · 왕실 매화 비단 한복 & 눈웃음',
    themeEn: 'Blush Rose · Royal Maehwa Hanbok & Happy Eyes',
    noteKo:
      '따스한 블러쉬 로즈 파스텔 배경 위에 다이아몬드 눈꽃 오라(Polar Diamond Snowfall)가 내리고, 아이스 블루 펭귄이 화사한 왕실 매화 비단 한복(CLO-47)을 차려입은 채 반달 눈웃음(Happy Arches)을 짓는 한국 전통 파스텔 명작입니다.',
    noteEn:
      'A pastel Korean heritage gem: Glacier blue feathers dressed in the Royal Maehwa Silk Hanbok with smiling Happy Arches eyes and Polar Diamond Snowfall on a Blush Rose canvas.',
  },
  {
    edition: 963,
    id: 'P00963',
    isSpecial: false,
    tier: 'Legendary',
    rank: 12,
    score: '1,914.93',
    shortKo: '여우 원지 (#1 Gen)',
    shortEn: 'Fox Onesie #1',
    titleKo: '#963 태양 불꽃 여우 원지 윙크 (Solar Fox Onesie · 제너레이티브 1위)',
    titleEn: '#963 Solar Ember Fox Onesie (#1 Generative Rank #12)',
    themeKo: '제너레이티브 전체 희귀도 1위 (Rank #12) · 여우 후드',
    themeEn: '#1 Highest-Ranked Generative Penguin · Fox Onesie',
    noteKo:
      '11점의 1/1 원화 바로 다음인 전체 랭킹 12위(제너레이티브 9,989점 중 당당히 1위!)를 차지한 전설(Legendary) 펭귄입니다. 에메랄드 산호초 배경과 태양 불꽃 오라(Solar Ember Aura) 속에서 귀여운 여우 후드 원지(Fox Onesie)를 입고 윙크하는 독보적 존재감을 지녔습니다.',
    noteEn:
      'The #1 highest-ranked generative penguin in the entire 10,000 collection (Rank #12 overall)! Chrome Penguin wearing a cute Fox Onesie with a Wink and Solar Ember Aura.',
  },
  {
    edition: 1,
    id: 'P00001',
    isSpecial: true,
    tier: 'Mythic',
    rank: 7,
    score: '55,010.33',
    shortKo: 'GO 제우스',
    shortEn: 'GO Zeus',
    titleKo: '#1 GO 제우스 (Olympian Thunder God)',
    titleEn: '#1 GO Zeus (Mythic 1/1)',
    themeKo: '올림포스 폭풍 신전 · 번개 월계관 & GO 망토',
    themeEn: 'Olympian Storm Temple · Lightning Laurel Crown',
    noteKo:
      'PIXEL PENGUIN 10K 컬렉션의 상징적인 1번 토큰(P00001)입니다. 올림포스 폭풍 신전의 뇌전 이펙트, 황금 월계관, 골드림 스퀘어 안경, 그리고 GO 로열 망토가 어우러진 대장주 신화 원화입니다.',
    noteEn:
      'Token #1 of PIXEL PENGUIN 10K. Commands an Olympian thunderbolt storm with a golden laurel crown, gold-rim square glasses, and the signature GO royal mantle.',
  },
  {
    edition: 7,
    id: 'P00007',
    isSpecial: true,
    tier: 'Mythic',
    rank: 5,
    score: '60,007.14',
    shortKo: '시공간의 지배자',
    shortEn: 'Chronos Ruler',
    titleKo: '#7 시공간의 지배자 (Chronos Time-Space Ruler)',
    titleEn: '#7 Chronos Time-Space Ruler (Mythic 1/1)',
    themeKo: '크로노스 시계탑 성소 · 에메랄드/골드 오드아이',
    themeEn: 'Clockwork Sanctum · Heterochromia Eyes',
    noteKo:
      '정교한 황금 태엽 기어와 시공간 궤도 링이 회전하는 1-of-1 신화 원화(Rank #5)입니다. 에메랄드와 황금빛이 공존하는 오드아이(Heterochromia)와 모래시계 메달리온 망토가 돋보입니다.',
    noteEn:
      'Golden clockwork gears and temporal orbit rings surround a Chronomancer penguin with emerald-and-gold heterochromia eyes (Rank #5).',
  },
  {
    edition: 9,
    id: 'P00009',
    isSpecial: true,
    tier: 'Mythic',
    rank: 2,
    score: '60,010.33',
    shortKo: '사이버 네온 군주',
    shortEn: 'Cyber Overlord',
    titleKo: '#9 사이버 네온 군주 (Cyber Neon Overlord)',
    titleEn: '#9 Cyber Neon Overlord (Mythic 1/1)',
    themeKo: '사이버펑크 네온 시티 · 홀로그램 바이저 (Rank #2)',
    themeEn: 'Cyberpunk Metropolis · Holo-Spectrum Visor',
    noteKo:
      '전체 희귀도 2위(Rank #2 · 60,010.33점)에 빛나는 사이버펑크 신화 원화입니다. 네온 빗방울과 글리치 파동이 흐르는 미래 도시 위에서 홀로그램 바이저와 네온 크리스탈 크라운이 강렬한 색채 대비를 이룹니다.',
    noteEn:
      'Ranked #2 overall (60,010.33 pts). Cyberpunk neon rain and glitch pulses frame a Holo-Spectrum Cyber Visor and Neon Crystal Crown.',
  },
  {
    edition: 500,
    id: 'P00500',
    isSpecial: false,
    tier: 'Mythic',
    rank: 46,
    score: '932.31',
    shortKo: '수정 기사단장',
    shortEn: 'Crystal Knight',
    titleKo: '#500 수정 기사단 아크메이지 (Crystal Knight Archmage)',
    titleEn: '#500 Crystal Knight Archmage (Generative Mythic)',
    themeKo: '크릴 피치 · 크리스탈 나이트 투구 & 프로스트 스태프',
    themeEn: 'Krill Peach · Crystal Helmet & Frost Staff',
    noteKo:
      '제너레이티브 39점의 신화(Mythic) 등급 중에서도 색감이 가장 산뜻한 작품(Rank #46)입니다. 따뜻한 피치 배경 위에 엠버 펭귄, 투명하게 빛나는 크리스탈 기사 투구, 얼음 마법 지팡이와 조개 비눗방울 파이프가 완벽한 조화를 이룹니다.',
    noteEn:
      'A standout Generative Mythic (Rank #46): Ember Penguin on a warm Krill Peach background with a Crystal Knight Helmet, Frost Staff, and Seashell Bubble Pipe.',
  },
  {
    edition: 51,
    id: 'P00051',
    isSpecial: false,
    tier: 'Epic',
    rank: 1250,
    score: '321.25',
    shortKo: '빙하 왕관 당상관',
    shortEn: 'Glacier Danryeong',
    titleKo: '#51 빙하 왕관 조선 궁중 당상관 (Glacier Crown Court Danryeong)',
    titleEn: '#51 Glacier Crown Joseon Court Danryeong (Epic)',
    themeKo: '동서양 왕실 크로스오버 · 빙하 왕관 & 조선 단령',
    themeEn: 'Royal Crossover · Glacier Crown & Joseon Danryeong',
    noteKo:
      '화사한 핑크빛 배경 위에서 미드나잇 펭귄이 조선 궁중 당상관의 붉은 단령(흉배 자수·사모관대 각대)을 입고 머리에는 투명한 빙하 얼음 왕관(Glacier Iceberg Crown)을 쓴 품격 있는 작품입니다.',
    noteEn:
      'Midnight Penguin wearing the crimson Joseon Court Danryeong robe with embroidered chest badge, crowned with the translucent Glacier Iceberg Crown on Blush Rose.',
  },
  {
    edition: 1433,
    id: 'P01433',
    isSpecial: false,
    tier: 'Legendary',
    rank: 93,
    score: '659.72',
    shortKo: '도깨비불 대마법사',
    shortEn: 'Dokkaebi Wizard',
    titleKo: '#1433 조선 도깨비불 빙하 대마법사 (Dokkaebi Fire Glacier Wizard)',
    titleEn: '#1433 Joseon Dokkaebi Fire Glacier Wizard (Legendary)',
    themeKo: '드림 나이트 · 에메랄드 도깨비불 오라 & 빙하 왕관',
    themeEn: 'Dream Night · Joseon Dokkaebi Fire & Glacier Crown',
    noteKo:
      '전체 TOP 100(Rank #93)에 드는 전설(Legendary) 펭귄입니다. 깊은 밤하늘에 청록빛 조선 도깨비불(Joseon Dokkaebi Fire)이 타오르고, 빙하 왕관과 마법사 로브, 레드 웨이페어 선글라스가 힙한 판타지 무드를 완성합니다.',
    noteEn:
      'Top-100 Legendary (Rank #93): Emerald Joseon Dokkaebi Fire flames dance around a Glacier Penguin in Wizard Robes, Glacier Iceberg Crown, and Red Wayfarers.',
  },
  {
    edition: 21,
    id: 'P00021',
    isSpecial: false,
    tier: 'Rare',
    rank: 6885,
    score: '162.54',
    shortKo: '핑크 빙어 먹방',
    shortEn: 'Pink Smelt Catch',
    titleKo: '#21 북극 빙어 물고 신난 핑크 펭귄 (Pink Smelt Catcher)',
    titleEn: '#21 Orchid Pink Arctic Smelt Catcher (Rare)',
    themeKo: '오키드 핑크 · 그린 니트 비니 & 북극 빙어',
    themeEn: 'Orchid Pink · Green Beanie & Caught Arctic Smelt',
    noteKo:
      '오키드 핑크 배경과 로즈 핑크 깃털의 톤온톤 조합 위에 보색인 초록 니트 비니를 쓰고, 부리에 은빛 북극 빙어(Caught Arctic Smelt)를 앙증맞게 문 채 익살스러운 표정을 짓는 마스코트 같은 펭귄입니다.',
    noteEn:
      'Tone-on-tone Orchid Pink & Rose Penguin topped with a contrasting Green Beanie and a silvery Caught Arctic Smelt held proudly in its beak.',
  },
  {
    edition: 4276,
    id: 'P04276',
    isSpecial: false,
    tier: 'Common',
    rank: 310,
    score: '454.99',
    shortKo: '프리즘 매화 리본',
    shortEn: 'Prism Maehwa Bow',
    titleKo: '#4276 프리즘 윙크 매화 리본 펭귄 (Prism Wink Maehwa Bow)',
    titleEn: '#4276 Glacier Prism Wink Maehwa Bow',
    themeKo: '글래시어 스카이 · 프리즘 오라 & 리본 매화 한복',
    themeEn: 'Glacier Sky · Prism Aura, Bow & Maehwa Hanbok',
    noteKo:
      '살구빛(Apricot) 펭귄이 귀여운 머리 리본(Bow)과 왕실 매화 비단 한복을 입고, 무지개빛 빙하 프리즘 오라(Glacier Prism Aura) 속에서 조개 비눗방울 파이프를 불며 상큼하게 윙크(Wink)하는 고득점(Rank #310) 큐트 픽입니다.',
    noteEn:
      'Apricot Penguin wearing a cute Ribbon Bow and Royal Maehwa Silk Hanbok, winking with a Seashell Bubble Pipe inside a shimmering Glacier Prism Aura (Rank #310).',
  },
];

// Additional Iconic Penguins for the 28-Token Dual-Row Infinite Pixel Parade
const PARADE_ROW_1_ITEMS = [
  { edition: 2, labelKo: '천상의 대천사', labelEn: 'Celestial Archangel', sub: 'Mythic 1/1 · Rank #1' },
  { edition: 43, labelKo: '매화 꽃바람 낚시꾼', labelEn: 'Maehwa Blossom Angler', sub: 'Epic · Rank #187' },
  { edition: 5, labelKo: '빙하의 제왕', labelEn: 'Glacier Emperor', sub: 'Mythic 1/1 · Rank #3' },
  { edition: 963, labelKo: '태양 불꽃 여우 원지', labelEn: 'Solar Fox Onesie', sub: 'Legendary · Rank #12' },
  { edition: 6, labelKo: '심해의 지배자', labelEn: 'Abyssal Sea Ruler', sub: 'Mythic 1/1 · Rank #4' },
  { edition: 35, labelKo: '설원 매화 한복', labelEn: 'Snowfall Maehwa Hanbok', sub: 'Uncommon · Happy Eyes' },
  { edition: 1, labelKo: 'GO 제우스', labelEn: 'GO Zeus', sub: 'Mythic 1/1 · Rank #7' },
  { edition: 500, labelKo: '수정 기사단장', labelEn: 'Crystal Knight Mage', sub: 'Mythic · Rank #46' },
  { edition: 7, labelKo: '시공간의 지배자', labelEn: 'Chronos Time Ruler', sub: 'Mythic 1/1 · Rank #5' },
  { edition: 51, labelKo: '빙하 왕관 당상관', labelEn: 'Glacier Court Danryeong', sub: 'Epic · Joseon Royal' },
  { edition: 9, labelKo: '사이버 네온 군주', labelEn: 'Cyber Neon Overlord', sub: 'Mythic 1/1 · Rank #2' },
  { edition: 4276, labelKo: '프리즘 윙크 매화 리본', labelEn: 'Prism Wink Maehwa', sub: 'Rank #310 · Cute Wink' },
  { edition: 8, labelKo: '황금 파라오', labelEn: 'Golden Pharaoh', sub: 'Mythic 1/1 · Rank #11' },
  { edition: 21, labelKo: '핑크 빙어 먹방', labelEn: 'Pink Smelt Catcher', sub: 'Rare · Arctic Smelt' },
];

const PARADE_ROW_2_ITEMS = [
  { edition: 1433, labelKo: '도깨비불 대마법사', labelEn: 'Dokkaebi Fire Wizard', sub: 'Legendary · Rank #93' },
  { edition: 10, labelKo: '다크 히어로', labelEn: 'Dark Hero Vigilante', sub: 'Mythic 1/1 · Rank #10' },
  { edition: 48, labelKo: '도깨비불 베레모', labelEn: 'Dokkaebi Fire Beret', sub: 'Rare · Dokkaebi Aura' },
  { edition: 3, labelKo: '크립토 불 황제', labelEn: 'Crypto Bull Emperor', sub: 'Mythic 1/1 · Rank #8' },
  { edition: 479, labelKo: '조선 왕실 익선관', labelEn: 'Joseon Royal Ikseongwan', sub: 'Rare · Rank #261' },
  { edition: 4, labelKo: '네온 디제이 마에스트로', labelEn: 'Neon DJ Maestro', sub: 'Mythic 1/1 · Rank #6' },
  { edition: 26, labelKo: '왕실 단청 광휘 천사', labelEn: 'Dancheong Halo Angel', sub: 'Epic · Rank #708' },
  { edition: 11, labelKo: '밤의 신사 탐정', labelEn: 'Noir Gentleman Detective', sub: 'Mythic 1/1 · Rank #9' },
  { edition: 53, labelKo: '설원 조선 궁중 단령', labelEn: 'Snowfall Court Danryeong', sub: 'Rare · Snowfall Aura' },
  { edition: 6522, labelKo: '드림글로우 게코 후드', labelEn: 'Dreamglow Gecko Onesie', sub: 'Rank #15 · Happy Eyes' },
  { edition: 75, labelKo: '썬더볼트 빙하 왕관', labelEn: 'Thunderbolt Glacier Crown', sub: 'Legendary · Rank #162' },
  { edition: 136, labelKo: '조선 왕실 두정갑 헤일로', labelEn: 'Royal Dujeonggap Halo', sub: 'Rank #173 · Joseon Armor' },
  { edition: 25, labelKo: '마도로스 세일러 카라', labelEn: 'Harbor Sailor Collar', sub: 'Epic · Bat Wings' },
  { edition: 192, labelKo: '극지 탐험가 우샨카', labelEn: 'Polar Explorer Ushanka', sub: 'Rare · Kelp Mint' },
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

  // Update PiP GIF badge for 1-of-1 animated originals vs generative
  const pipWrap = document.getElementById('motion-gif-pip');
  const pipImg = document.getElementById('motion-pip-img');
  const pipLabel = document.getElementById('motion-pip-label');
  if (pipWrap && pipImg && pipLabel) {
    if (item.isSpecial) {
      pipImg.src = `/assets/specials/${item.edition}_fast.gif`;
      pipLabel.textContent = '1/1 4-FRAME GIF';
    } else {
      pipImg.src = `/img/${item.id}.png`;
      pipLabel.textContent = 'NATIVE 48×48 PNG';
    }
  }

  // Update Right-Side Curator Spotlight Card
  const tierPill = document.getElementById('spot-tier-pill');
  if (tierPill) {
    tierPill.textContent = item.isSpecial ? 'MYTHIC 1/1 GIF' : item.tier.toUpperCase();
    tierPill.className = `tier-pill tier-${item.tier}`;
  }

  const rankPill = document.getElementById('spot-rank-pill');
  if (rankPill) {
    rankPill.textContent = `rarity.tools Rank #${item.rank.toLocaleString()} / 10,000 (${item.score} pts)`;
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
    const iconEl = document.getElementById('autoplay-icon');
    const lblEl = document.getElementById('autoplay-label');
    if (iconEl) iconEl.textContent = MOTION_STATE.autoPlay ? '⏸' : '▶';
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

  // Load initial #2 Celestial Archangel
  selectMotionPenguin(2, false);

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
          <div class="parade-card-sub">1 VERY · Verified PFP</div>
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
        ? '이번 주 금요일 (2026. 10. 23) VERY Mainnet (4613) 공식 민팅 오픈 · 민팅가 1 VERY · 총 10,000개 (심볼: PPENG)'
        : 'THIS FRIDAY (OCT 23, 2026) OFFICIAL MINT ON VERY MAINNET (4613) · MINT PRICE: 1 VERY · SUPPLY: 10,000 (SYMBOL: PPENG)';
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

  // Preset strip: Prettiest curated Mythic 1/1s & Generative gems
  const presets = [2, 5, 6, 1, 7, 9, 43, 35, 963, 500, 51, 1433, 21, 4276];
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
    loadPfpPreview(2);
    fetchExplorerTokens();
  } catch (err) {
    console.error('Failed to initialize config:', err);
  }
});
