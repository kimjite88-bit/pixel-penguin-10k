// ============================================================================
// OPENING — a ~19 s motion-graphics story played once, before the escape picker (scene 1, escape-scene.js):
//   A  0.0-4.0 s  a peaceful penguin land: colourful 2D penguins waddle about between two igloos
//   B  4.0-7.0 s  a pixel pillar falls from the sky: beam, falling cubes, the ground shakes, white flash and
//                 the land splits open round it (the bg_scene1_2d picture, which has the pillar in it)
//   C  7.0-10.5 s a pixel wave spreads out of the pillar: everything inside it turns into blocks, and each
//                 penguin it reaches becomes its pixel self
//   D 10.5-13.0 s the blue penguin runs for it, the wave right behind
//   E 13.0-19.4 s it reaches the crevasse field of the picker and finds the plane, the icebreaker and the car
//                 one by one; the last frame is the picker's own layout, so it hands over without a cut
// It is drawn live on the stage (no video file), so it is sharp at any size and follows the language toggle.
// Shown once per browser (localStorage), always skippable (tap, Esc / Enter / Space, the 건너뛰기 tag); ?opening
// in the URL plays it again. With prefers-reduced-motion it is not played (flashes and shaking).
// ============================================================================
const OPENING_MS = 19400;
const OPENING_STORE = 'ppeng-opening-seen';
const OPENING_PILLAR = { x: 770, y: 300 };
const OPENING_FEET = 338; // the snow plateau in bg_scene1_2d
const OPENING_K = '#0b1020';
// Village penguins: species, x, size, walk range, phase. All stand where bg_scene1_2d still has ground once the
// land splits (left plateau up to x ~580, the small ledge right of the chasm from ~900)
const OPENING_FOLK = [
  { sp: '05', x: 90, size: 66, range: 34, ph: 0.2 },
  { sp: '22', x: 205, size: 60, range: 26, ph: 1.4 },
  { sp: '06', x: 298, size: 56, range: 14, ph: 5.2 },
  { sp: '04', x: 495, size: 64, range: 20, ph: 2.1 },
  { sp: '09', x: 556, size: 58, range: 10, ph: 3.3 },
  { sp: '10', x: 932, size: 58, range: 6, ph: 4.0 },
];
const OPENING_HERO_X = 400;
const OPENING_FOUND = [
  { at: 14800, kind: 'ufo', ko: '경비행기다!', en: 'A plane!' },
  { at: 15900, kind: 'boat', ko: '쇄빙선도 있어!', en: 'An icebreaker!' },
  { at: 17000, kind: 'car', ko: '자동차까지!', en: 'And a car!' },
];

const OPENING = { want: null, start: 0, active: false };

function openingWanted() {
  if (OPENING.want !== null) return OPENING.want;
  let want = true;
  try {
    if (/[?&]opening\b/.test(window.location.search)) want = true;
    else if (localStorage.getItem(OPENING_STORE) === '1') want = false;
    else if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) want = false;
  } catch (e) {}
  OPENING.want = want;
  return want;
}

function openingActive() {
  return MOTION_STATE.sceneIdx === 0 && openingWanted();
}

function setOpeningOverlay(on) {
  const theater = document.getElementById('retro-intro-theater');
  if (theater) theater.classList.toggle('is-opening', on);
}

function finishOpening(now = performance.now()) {
  OPENING.want = false;
  OPENING.active = false;
  try {
    localStorage.setItem(OPENING_STORE, '1');
  } catch (e) {}
  setOpeningOverlay(false);
  // The picker starts now: its waiting stages and the idle timer count from here
  MOTION_STATE.sceneStartTime = now;
  MOTION_STATE.scene0LastInput = now;
}

// ---------------------------------------------------------------------------------------------------------------
function openingSmooth(t) {
  t = Math.min(1, Math.max(0, t));
  return t * t * (3 - 2 * t);
}

function openingWaveRadius(t) {
  if (t < 7000) return 0;
  // Up to the hero's heels (it stands 370 px left of the pillar), then right behind it as it runs
  if (t < 10300) return 60 + openingSmooth((t - 7000) / 3300) * 280;
  return 340 + (t - 10300) * 0.3;
}

// The peaceful land: the left (pillar-free) half of bg_scene1_2d and its mirror image
function drawOpeningLand(ctx) {
  const img = MOTION_STATE.bgScene1Img;
  if (!(MOTION_STATE.bgScene1Loaded && img)) {
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(0, 0, 960, 540);
    return;
  }
  const sw = img.naturalWidth / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0, sw, img.naturalHeight, 0, 0, 480, 540);
  ctx.save();
  ctx.translate(960, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0, sw, img.naturalHeight, 0, 0, 480, 540);
  ctx.restore();
}

function drawOpeningSplitLand(ctx) {
  const img = MOTION_STATE.bgScene1Img;
  if (MOTION_STATE.bgScene1Loaded && img) ctx.drawImage(img, 0, 0, 960, 540);
}

function drawOpeningPenguin2D(ctx, sp, x, feet, size, frame, flip) {
  const sheet = getHero2DSheetForSpecies(sp);
  if (!sheet) return;
  ctx.save();
  ctx.translate(Math.round(x), 0);
  if (flip) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sheet, frame * 256, 0, 256, 256, -size / 2, feet - size + 4, size, size);
  ctx.restore();
}

// Village folk (and, from C on, their pixel selves inside the wave)
function drawOpeningFolk(ctx, now, t, pixelPass) {
  const R = openingWaveRadius(t);
  OPENING_FOLK.forEach((f, i) => {
    const panic = t > 4400;
    const walk = panic ? 0 : Math.sin(now * 0.0011 + f.ph) * f.range;
    const x = f.x + walk;
    const inWave = R > 0 && Math.hypot((x - OPENING_PILLAR.x) / R, (OPENING_FEET - 30 - OPENING_PILLAR.y) / (R * 0.62)) < 0.95;
    if (pixelPass !== inWave) return;
    if (inWave) {
      // Pixel self, hopping a little: it is quite happy about it
      const entry = ensureSpeciesSprite(f.sp);
      const s = f.size * 1.05;
      const hop = Math.floor(now / 260 + i) % 2 ? 0 : 4;
      drawAnimatedPixelPenguin(ctx, entry, x - s / 2, OPENING_FEET - s * (243 / 256) - hop, s, now, { seed: 3 + i, isWalking: true, flipX: i % 2 === 0 });
      return;
    }
    const step = Math.floor(now / 220 + i) % 2;
    const frame = panic ? 6 : Math.abs(Math.cos(now * 0.0011 + f.ph)) > 0.2 ? 2 + step : 0;
    const flip = !panic && Math.cos(now * 0.0011 + f.ph) < 0;
    const jitter = panic && t > 6000 ? Math.round(Math.sin(now * 0.05 + i) * 2) : 0;
    drawOpeningPenguin2D(ctx, f.sp, x + jitter, OPENING_FEET, f.size, frame, flip);
  });
}

// The blue hero in the village: idle, shocked, then running off to the left
function drawOpeningHero(ctx, now, t) {
  let x = OPENING_HERO_X;
  let frame = Math.floor(now / 1800) % 5 === 0 ? 1 : 0;
  if (t > 4600) frame = 6;
  if (t > 10300) {
    const r = Math.min(1, (t - 10300) / 2000);
    x = OPENING_HERO_X - r * 600;
    frame = 2 + (Math.floor(now / 80) % 2);
  }
  const bob = t > 10300 && Math.floor(now / 80) % 2 ? -4 : 0;
  drawOpeningPenguin2D(ctx, '01', x, OPENING_FEET + 8 + bob, 92, frame, false);
  if (t > 4600 && t < 10300) {
    const beat = Math.floor(now / 420) % 2;
    drawScene0Mark(ctx, x - 30, OPENING_FEET - 96 - (beat ? 6 : 0), '!', '#fb7185');
  }
}

// B: the pillar comes down — a widening beam with cubes tumbling in it
function drawOpeningPillarFall(ctx, now, t) {
  const p = openingSmooth((t - 4000) / 1500);
  const x = OPENING_PILLAR.x;
  const bottom = p * 540;
  const w = 26 + p * 44;
  ctx.save();
  ctx.globalAlpha = 0.85;
  const g = ctx.createLinearGradient(x - w, 0, x + w, 0);
  g.addColorStop(0, 'rgba(244, 114, 182, 0)');
  g.addColorStop(0.3, 'rgba(244, 114, 182, 0.55)');
  g.addColorStop(0.5, 'rgba(236, 254, 255, 0.95)');
  g.addColorStop(0.7, 'rgba(103, 232, 249, 0.55)');
  g.addColorStop(1, 'rgba(103, 232, 249, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - w, 0, w * 2, bottom);
  ctx.globalAlpha = 1;
  const cols = ['#67e8f9', '#f472b6', '#a78bfa', '#fde047', '#ffffff'];
  for (let k = 0; k < 18; k++) {
    const cy = ((k * 71 + now * 0.4) % 560) - 20;
    if (cy > bottom) continue;
    const cx = x + Math.sin(k * 2.3) * w * 0.7;
    const s = 6 + (k % 3) * 4;
    ctx.fillStyle = OPENING_K;
    ctx.fillRect(Math.round(cx - s / 2) - 2, Math.round(cy) - 2, s + 4, s + 4);
    ctx.fillStyle = cols[k % cols.length];
    ctx.fillRect(Math.round(cx - s / 2), Math.round(cy), s, s);
  }
  ctx.restore();
}

// C: the ring of blocks at the wave front
function drawOpeningWaveFront(ctx, now, R) {
  if (R <= 0) return;
  const cols = ['#67e8f9', '#f472b6', '#ffffff', '#a78bfa'];
  ctx.save();
  for (let k = 0; k < 56; k++) {
    const a = (k / 56) * Math.PI * 2 + Math.sin(now * 0.002 + k) * 0.03;
    const rr = R + Math.sin(now * 0.02 + k * 1.7) * 6;
    const bx = Math.round((OPENING_PILLAR.x + Math.cos(a) * rr) / 4) * 4;
    const by = Math.round((OPENING_PILLAR.y + Math.sin(a) * rr * 0.62) / 4) * 4;
    if (bx < -10 || bx > 970 || by < -10 || by > 550) continue;
    const s = k % 3 ? 8 : 12;
    ctx.fillStyle = OPENING_K;
    ctx.fillRect(bx - 2, by - 2, s + 4, s + 4);
    ctx.fillStyle = cols[k % cols.length];
    ctx.fillRect(bx, by, s, s);
  }
  ctx.restore();
}

// A-D: the village
function drawOpeningVillage(ctx, now, t) {
  const R = openingWaveRadius(t);
  const shake = t > 4600 && t < 7400 ? Math.min(1, (t - 4600) / 1400) * (t > 6000 ? 1.6 : 1) : 0;
  ctx.save();
  if (shake) ctx.translate((Math.random() - 0.5) * 8 * shake, (Math.random() - 0.5) * 5 * shake);
  const scene = (c, pixel) => {
    if (t < 6000) drawOpeningLand(c);
    else {
      drawOpeningLand(c);
      c.globalAlpha = Math.min(1, (t - 6000) / 500);
      drawOpeningSplitLand(c);
      c.globalAlpha = 1;
    }
    if (t >= 4000 && t < 6600) drawOpeningPillarFall(c, now, t);
    drawOpeningFolk(c, now, t, pixel);
  };
  scene(ctx, false);
  if (R > 0) {
    // Inside the wave: the same picture in 10 px blocks, with the penguins there drawn as pixel sprites
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(OPENING_PILLAR.x, OPENING_PILLAR.y, R, R * 0.62, 0, 0, Math.PI * 2);
    ctx.clip();
    drawScene3Mosaic(ctx, 10, (c) => scene(c, false));
    drawOpeningFolk(ctx, now, t, true);
    ctx.restore();
    drawOpeningWaveFront(ctx, now, R);
  }
  drawOpeningHero(ctx, now, t);
  ctx.restore();
  // The flash as the pillar hits the ground
  if (t > 5800 && t < 6700) {
    ctx.fillStyle = `rgba(255, 255, 255, ${(1 - Math.abs(t - 6000) / 700).toFixed(3)})`;
    ctx.fillRect(0, 0, 960, 540);
  }
}

// E: the picker's crevasse field; the vehicles turn up one by one
function drawOpeningFound(ctx, now, t) {
  drawRefScene1ChoiceBackground(ctx, now);
  const spots = { ufo: SCENE0_UFO_SPOT, boat: SCENE0_BOAT_SPOT, car: SCENE0_CAR_SPOT };
  const ko = CURRENT_LANG === 'ko';
  OPENING_FOUND.forEach((f) => {
    const p = (t - f.at) / 420;
    if (p < 0) return;
    const sp = spots[f.kind];
    // Pop in with an overshoot
    const k = p >= 1 ? 1 : Math.sin(p * Math.PI * 0.5) * (1 + 0.18 * Math.sin(p * Math.PI));
    ctx.save();
    ctx.translate(sp.x, sp.y);
    ctx.scale(k, k);
    ctx.translate(-sp.x, -sp.y);
    if (f.kind === 'ufo') drawPlaneWithPilot(ctx, sp.x, sp.y, sp.tilt, now, { scale: sp.scale, withPilot: false, propSpin: false });
    else if (f.kind === 'boat') drawBoatWithPilot(ctx, sp.x, sp.y + Math.round(Math.sin(now * 0.004) * 1.5), 0, now, { scale: sp.scale, withPilot: false, smokeOn: false });
    else drawCarWithPilot(ctx, sp.x, sp.y, sp.tilt, now, { scale: sp.scale, withPilot: false, lightsOn: false, wheelAngle: 0 });
    ctx.restore();
    // Sparkle burst on arrival
    if (p < 2) {
      for (let s = 0; s < 10; s++) {
        const a = (s / 10) * Math.PI * 2;
        const r = 30 + p * 50;
        ctx.globalAlpha = Math.max(0, 1 - p / 2);
        ctx.fillStyle = s % 2 ? '#fde047' : '#ffffff';
        ctx.fillRect(Math.round(sp.x + Math.cos(a) * r) - 3, Math.round(sp.y - 20 + Math.sin(a) * r * 0.7) - 3, 6, 6);
      }
      ctx.globalAlpha = 1;
    }
    if (t < f.at + 1500) {
      const target =
        f.kind === 'car'
          ? { x: sp.x - 10, y: sp.y - 60 * sp.scale - 6 }
          : f.kind === 'boat'
          ? { x: sp.x - 30, y: sp.y - 116 * sp.scale - 4 }
          : { x: sp.x - 20, y: sp.y - 46 * sp.scale - 4 };
      drawScene0Marker(ctx, now, target, ko ? f.ko : f.en, SCENE0_ACCENT[f.kind]);
    }
  });
  // The hero runs in from the right onto its floe, then looks round in shock like the picker's penguin
  drawScene0HeroLedge(ctx, now, 0, 0);
  const r = Math.min(1, (t - 13000) / 1400);
  if (r < 1) {
    const x = 1040 - (1040 - SCENE0_HERO.x) * (1 - (1 - r) * (1 - r));
    const bob = Math.floor(now / 80) % 2 ? -5 : 0;
    drawOpeningPenguin2D(ctx, '01', x, SCENE0_HERO.feet + bob, SCENE0_HERO.size, 2 + (Math.floor(now / 80) % 2), true);
  } else {
    drawScene0Hero(ctx, now, 0, 0);
  }
  // A pixel-block wipe in from the right as the scene changes
  if (t < 13450) {
    const w = (1 - (t - 13000) / 450) * 960;
    for (let y = 0; y < 540; y += 30) {
      const off = ((y / 30) % 3) * 24;
      ctx.fillStyle = (y / 30) % 2 ? '#67e8f9' : '#ffffff';
      ctx.fillRect(960 - w - off, y, w + off, 30);
    }
  }
}

// Letterbox with the story caption and the skip tag
function drawOpeningCaption(ctx, now, t) {
  const ko = CURRENT_LANG === 'ko';
  const beats = [
    [300, 3800, '평화로운 남극 펭귄나라', 'A peaceful penguin land in Antarctica'],
    [4100, 6800, '그러던 어느 날, 하늘에서 픽셀 기둥이 떨어졌다', 'Then one day, a pixel pillar fell from the sky'],
    [7200, 10200, '닿는 것마다 전부 도트로 변해버렸다!', 'Everything it touched turned into pixels!'],
    [10400, 12900, '나까지 도트 되기 전에... 도망쳐!!', 'Run before you get pixelated too!!'],
    [13600, 14700, '헉헉... 여기까지 왔는데...', 'Huff... made it this far...'],
    [18100, OPENING_MS, '하나 골라 타고 탈출하자!!', 'Pick one and get out of here!!'],
  ];
  const k = stageUiK();
  const bar = k > 1 ? 60 : 48; // phones: the 1.6x caption needs the taller bar
  ctx.fillStyle = OPENING_K;
  ctx.fillRect(0, 0, 960, 48);
  ctx.fillRect(0, 540 - bar, 960, bar);
  const line = beats.find(([a, b]) => t >= a && t < b);
  if (line) {
    const [a, b] = line;
    const alpha = Math.min(1, (t - a) / 250, (b - t) / 250);
    const text = ko ? line[2] : line[3];
    // Typed out, two characters per 60 ms
    const shown = text.slice(0, Math.ceil((t - a) / 30));
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    const size = Math.min(22 * k, 30);
    ctx.font = `900 ${size}px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const y = 540 - bar / 2;
    ctx.lineWidth = 6;
    ctx.strokeStyle = OPENING_K;
    ctx.strokeText(shown, 480, y);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(shown, 480, y);
    ctx.restore();
  }
  // Skip tag, top right
  const label = ko ? '건너뛰기 ▶' : 'SKIP ▶';
  ctx.save();
  const fs = 14 * Math.min(k, 1.5);
  ctx.font = `800 ${fs}px "Pretendard", "Malgun Gothic", sans-serif`;
  const w = ctx.measureText(label).width + 20;
  ctx.fillStyle = 'rgba(248, 250, 252, 0.16)';
  ctx.fillRect(948 - w, 10, w, fs + 14);
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 938, 10 + (fs + 14) / 2);
  ctx.restore();
  // Progress line along the bottom bar
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(0, 538, Math.round((t / OPENING_MS) * 960), 2);
}

// Called from drawScene0Escape; true while the opening owns the stage
function drawOpening(ctx, now) {
  if (!openingWanted()) return false;
  if (!OPENING.active) {
    OPENING.active = true;
    OPENING.start = 0;
    setOpeningOverlay(true);
    ensureIntroBackgrounds();
    ensureHero2DSprite();
    OPENING_FOLK.forEach((f) => {
      ensureSpeciesSprite(f.sp);
      getHero2DSheetForSpecies(f.sp);
    });
  }
  // Wait on the first frame until the stage is on screen and the pictures are in
  const ready = MOTION_STATE.bgScene1Loaded && MOTION_STATE.bgRefVortexLoaded && MOTION_STATE.hero2DSheetLoaded;
  if (!OPENING.start && ready && scene0StageVisible()) OPENING.start = now;
  const t = OPENING.start ? now - OPENING.start : 0;
  if (t >= OPENING_MS) {
    finishOpening(now);
    return false;
  }
  if (t < 13000) drawOpeningVillage(ctx, now, t);
  else drawOpeningFound(ctx, now, t);
  drawOpeningCaption(ctx, now, t);
  return true;
}

function skipOpening() {
  if (!OPENING.active) return false;
  finishOpening();
  return true;
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (!OPENING.active || !openingActive()) return;
    if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      skipOpening();
    }
  });
}
