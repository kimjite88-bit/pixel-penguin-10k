// ============================================================================
// OPENING — a ~19.5 s motion-graphics story played once, before the escape picker (scene 1, escape-scene.js):
//   A  0.0-3.8 s  a peaceful penguin land: colourful 2D penguins waddle about between two igloos; slow push-in
//   B  3.8-7.0 s  anticipation, action, reaction: the sky darkens and everyone looks up (?), a pixel star grows
//                 and falls, slams into the ground (one short flash, shockwave, flying ice, camera punch) and the
//                 land splits round the pillar (the bg_scene1_2d picture, which has the pillar in it); the
//                 penguins jump in shock and run
//   C  7.0-10.3 s a pixel wave spreads out of the pillar: big blocks inside, finer blocks at the front, and each
//                 penguin it reaches pops into its pixel self with a white flash
//   D 10.3-13.3 s the blue penguin crouches and bolts, the camera follows, the wave right behind
//   E 13.3-19.5 s pixel-block dissolve to the picker's crevasse field; the camera visits the plane, the icebreaker
//                 and the car as the penguin finds them one by one, then pulls back to the picker's exact framing,
//                 so it hands over without a cut
// Motion follows the animation basics (anticipation -> action -> reaction, ease in / out, squash and stretch,
// overshoot on pops); there is one full-screen flash, well under WCAG 2.3.1's three per second.
// It is drawn live on the stage (no video file), so it is sharp at any size and follows the language toggle.
// Shown once per browser (localStorage), always skippable (tap, Esc / Enter / Space, the 건너뛰기 tag); ?opening
// in the URL plays it again. With prefers-reduced-motion it is not played (flash and shaking).
// ============================================================================
const OPENING_MS = 19500;
const OPENING_STORE = 'ppeng-opening-seen';
const OPENING_PILLAR = { x: 770, y: 300 };
const OPENING_FEET = 338; // the snow plateau in bg_scene1_2d
const OPENING_K = '#0b1020';
const OPENING_IMPACT = 5600;
const OPENING_CUT = 13350; // village -> crevasse field, under the dissolve
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
  { at: 15050, kind: 'ufo', ko: '경비행기다!', en: 'A plane!' },
  { at: 16150, kind: 'boat', ko: '쇄빙선도 있어!', en: 'An icebreaker!' },
  { at: 17250, kind: 'car', ko: '자동차까지!', en: 'And a car!' },
];
// Camera keys [t, zoom, centre x, centre y], eased between; zoom 1 at 480/270 is the plain stage
const OPENING_CAM_VILLAGE = [
  [0, 1.0, 480, 270],
  [3800, 1.08, 440, 285],
  [4700, 1.0, 560, 270],
  [7000, 1.04, 600, 280],
  [10000, 1.04, 520, 280],
  [10400, 1.12, 420, 292],
  [12900, 1.12, 120, 292],
];
const OPENING_CAM_FIELD = [
  [OPENING_CUT, 1.16, 760, 330],
  [14600, 1.12, 590, 340],
  [14750, 1.12, 590, 340],
  [15050, 1.16, 300, 250],
  [15850, 1.16, 300, 250],
  [16150, 1.16, 565, 320],
  [16950, 1.16, 565, 320],
  [17250, 1.16, 850, 330],
  [18000, 1.16, 850, 330],
  [18600, 1.0, 480, 270],
];

const OPENING = { want: null, start: 0, active: false, conv: [], debris: null, buf: null, tmp: null };

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
// Easing, camera
// ---------------------------------------------------------------------------------------------------------------
function openingClamp01(t) {
  return Math.min(1, Math.max(0, t));
}
function openingSmooth(t) {
  t = openingClamp01(t);
  return t * t * (3 - 2 * t);
}
function openingBack(t) {
  // ease-out with overshoot (pops)
  t = openingClamp01(t);
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}
function openingHash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function openingCamAt(keys, t) {
  let k = keys[0];
  let cam = { z: k[1], x: k[2], y: k[3] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= a[0]) break;
    const p = openingSmooth((t - a[0]) / (b[0] - a[0]));
    cam = { z: a[1] + (b[1] - a[1]) * p, x: a[2] + (b[2] - a[2]) * p, y: a[3] + (b[3] - a[3]) * p };
  }
  return cam;
}

// Apply a camera (plus punch zoom and shake) around fn; the view never leaves the 960 x 540 picture
function withOpeningCamera(ctx, cam, shake, fn) {
  const z = Math.max(1, cam.z);
  const hw = 480 / z;
  const hh = 270 / z;
  const x = Math.min(960 - hw, Math.max(hw, cam.x));
  const y = Math.min(540 - hh, Math.max(hh, cam.y));
  ctx.save();
  ctx.translate(480 + (shake ? (Math.random() - 0.5) * shake : 0), 270 + (shake ? (Math.random() - 0.5) * shake * 0.7 : 0));
  ctx.scale(z, z);
  ctx.translate(-x, -y);
  fn();
  ctx.restore();
}

function openingShake(t) {
  if (t > 4300 && t < OPENING_IMPACT) return ((t - 4300) / (OPENING_IMPACT - 4300)) * 3; // rumble building up
  if (t >= OPENING_IMPACT && t < 7400) return 16 * Math.exp(-(t - OPENING_IMPACT) / 320);
  return 0;
}

function openingWaveRadius(t) {
  if (t < 7000) return 0;
  // Up to the hero's heels (it stands 370 px left of the pillar), then right behind it as it runs
  if (t < 10300) return 60 + openingSmooth((t - 7000) / 3300) * 280;
  return 340 + (t - 10300) * 0.3;
}

function openingInWave(x, y, R) {
  return R > 0 && Math.hypot((x - OPENING_PILLAR.x) / R, (y - OPENING_PILLAR.y) / (R * 0.62)) < 0.95;
}

// ---------------------------------------------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------------------------------------------
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

function drawOpeningGround(ctx, t) {
  drawOpeningLand(ctx);
  if (t >= OPENING_IMPACT && MOTION_STATE.bgScene1Loaded) {
    // The land splits open under the flash
    ctx.globalAlpha = openingClamp01((t - OPENING_IMPACT) / 160);
    ctx.drawImage(MOTION_STATE.bgScene1Img, 0, 0, 960, 540);
    ctx.globalAlpha = 1;
  }
  // Mood: the sky darkens before the hit; the pillar's glow tints everything after it
  if (t > 3800) {
    const a = t < OPENING_IMPACT ? openingSmooth((t - 3800) / 1500) * 0.3 : 0.3 - openingSmooth((t - OPENING_IMPACT) / 900) * 0.18;
    ctx.fillStyle = t < OPENING_IMPACT ? `rgba(30, 27, 75, ${a.toFixed(3)})` : `rgba(76, 29, 149, ${a.toFixed(3)})`;
    ctx.fillRect(0, 0, 960, 540);
  }
}

// 2D penguin from the species' 2D sheet; sx / sy squash and stretch about the feet
function drawOpeningPenguin2D(ctx, sp, x, feet, size, frame, flip, sx = 1, sy = 1) {
  const sheet = getHero2DSheetForSpecies(sp);
  if (!sheet) return;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(feet + 4));
  ctx.scale(flip ? -sx : sx, sy);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sheet, frame * 256, 0, 256, 256, -size / 2, -size, size, size);
  ctx.restore();
}

// Pixel penguin, optionally with a white flash over it (the moment of the change)
function drawOpeningPixelPenguin(ctx, sp, x, feet, size, now, seed, flip, flash, scale) {
  const entry = ensureSpeciesSprite(sp);
  const s = size * scale;
  const top = feet - s * (243 / 256);
  if (!flash) {
    drawAnimatedPixelPenguin(ctx, entry, x - s / 2, top, s, now, { seed, isWalking: true, flipX: flip });
    return;
  }
  if (!OPENING.tmp) OPENING.tmp = document.createElement('canvas');
  const c = OPENING.tmp;
  const n = Math.ceil(s) + 8;
  if (c.width !== n) {
    c.width = n;
    c.height = n;
  }
  const tc = c.getContext('2d');
  tc.setTransform(1, 0, 0, 1, 0, 0);
  tc.globalCompositeOperation = 'source-over';
  tc.clearRect(0, 0, n, n);
  drawAnimatedPixelPenguin(tc, entry, 4, 4, s, now, { seed, isWalking: false, flipX: flip });
  tc.globalCompositeOperation = 'source-atop';
  tc.fillStyle = `rgba(255, 255, 255, ${flash.toFixed(3)})`;
  tc.fillRect(0, 0, n, n);
  ctx.drawImage(c, Math.round(x - s / 2 - 4), Math.round(top - 4));
}

function drawOpeningMarkOver(ctx, x, y, ch, col, t0, t) {
  if (t < t0) return;
  const pop = openingBack((t - t0) / 220);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pop, pop);
  drawScene0Mark(ctx, 0, 0, ch, col);
  ctx.restore();
}

// Village folk: wander, look up, jump in shock, run from the pillar, get changed by the wave
function drawOpeningFolk(ctx, now, t) {
  const R = openingWaveRadius(t);
  OPENING_FOLK.forEach((f, i) => {
    const away = f.x < OPENING_PILLAR.x ? -1 : 1;
    let x = f.x;
    if (t < 3800) x += Math.sin(now * 0.0011 + f.ph) * f.range;
    else if (t > OPENING_IMPACT + 300) x += away * Math.min(70, (t - OPENING_IMPACT - 300) * 0.05);
    x = Math.min(i === OPENING_FOLK.length - 1 ? 950 : 560, x);
    const feet = OPENING_FEET;
    if (openingInWave(x, feet - 30, R)) {
      if (!OPENING.conv[i]) OPENING.conv[i] = t;
      const since = t - OPENING.conv[i];
      const flash = since < 260 ? 1 - since / 260 : 0;
      const scale = since < 320 ? 0.7 + 0.3 * openingBack(since / 320) : 1;
      const hop = Math.floor(now / 260 + i) % 2 ? 0 : 4;
      drawOpeningPixelPenguin(ctx, f.sp, x, feet - hop, f.size * 1.05, now, 3 + i, away < 0, flash, scale);
      if (since < 500) {
        // Shards flying off as it changes
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 + i;
          const r = 14 + (since / 500) * 46;
          ctx.globalAlpha = 1 - since / 500;
          ctx.fillStyle = k % 2 ? '#67e8f9' : '#f472b6';
          ctx.fillRect(Math.round(x + Math.cos(a) * r) - 3, Math.round(feet - f.size / 2 + Math.sin(a) * r) - 3, 6, 6);
        }
        ctx.globalAlpha = 1;
      }
      return;
    }
    let frame = 0;
    let flip = false;
    let sx = 1;
    let sy = 1;
    let lift = 0;
    if (t < 3800) {
      const c = Math.cos(now * 0.0011 + f.ph);
      frame = Math.abs(c) > 0.2 ? 2 + (Math.floor(now / 220 + i) % 2) : Math.floor(now / 1700 + i) % 4 === 0 ? 1 : 0;
      flip = c < 0;
    } else if (t < OPENING_IMPACT) {
      frame = t > 4700 ? 6 : 0; // looks up, then sees it coming
      flip = away < 0;
    } else {
      const jt = t - OPENING_IMPACT - i * 40;
      if (jt >= 0 && jt < 380) {
        // Jump: squash before, stretch in the air, squash on landing
        const p = jt / 380;
        lift = Math.sin(p * Math.PI) * 30;
        sy = p < 0.12 || p > 0.88 ? 0.82 : 1.12;
        sx = 2 - sy;
        frame = 6;
      } else if (jt >= 380) {
        frame = 2 + (Math.floor(now / 90 + i) % 2); // running away
        flip = away < 0;
        lift = Math.floor(now / 90 + i) % 2 ? 3 : 0;
      } else frame = 6;
    }
    drawOpeningPenguin2D(ctx, f.sp, x, feet - lift, f.size, frame, flip, sx, sy);
    if (t >= 3800 && t < OPENING_IMPACT) drawOpeningMarkOver(ctx, x + 2, feet - f.size - 10, t > 4700 ? '!' : '?', t > 4700 ? '#fb7185' : '#fde047', 3850 + i * 70, t);
  });
}

// The blue hero: idle, looks up, shocked, then crouches and bolts to the left
function drawOpeningHero(ctx, now, t) {
  const feet = OPENING_FEET + 8;
  const size = 92;
  let x = OPENING_HERO_X;
  if (t < 3800) {
    drawOpeningPenguin2D(ctx, '01', x, feet, size, Math.floor(now / 1800) % 5 === 0 ? 1 : 0, false);
    return;
  }
  if (t < 10000) {
    const jt = t - OPENING_IMPACT;
    let sy = 1;
    let lift = 0;
    if (jt >= 0 && jt < 420) {
      const p = jt / 420;
      lift = Math.sin(p * Math.PI) * 36;
      sy = p < 0.12 || p > 0.88 ? 0.8 : 1.14;
    }
    drawOpeningPenguin2D(ctx, '01', x, feet - lift, size, t > 4700 ? 6 : 0, false, 2 - sy, sy);
    drawOpeningMarkOver(ctx, x - 30, feet - size - 6 - lift, t > 4700 ? '!' : '?', t > 4700 ? '#fb7185' : '#fde047', 3800, t);
    return;
  }
  if (t < 10300) {
    // Anticipation: crouch, ready to run
    const p = (t - 10000) / 300;
    drawOpeningPenguin2D(ctx, '01', x + p * 8, feet, size, 6, false, 1 + p * 0.14, 1 - p * 0.16);
    drawOpeningMarkOver(ctx, x - 30, feet - size, '!', '#fb7185', 10000, t);
    return;
  }
  const r = Math.min(1, (t - 10300) / 2000);
  x = OPENING_HERO_X - r * 600;
  const step = Math.floor(now / 70) % 2;
  // Speed lines and dust puffs behind it
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let k = 0; k < 5; k++) {
    const ly = feet - 20 - k * 15;
    const len = 30 + openingHash(k + Math.floor(now / 70)) * 40;
    ctx.fillRect(Math.round(x + 40 + k * 6), ly, Math.round(len), 3);
  }
  for (let k = 0; k < 5; k++) {
    const age = ((now / 120 + k) % 5) / 5;
    const px = x + 30 + age * 60;
    ctx.globalAlpha = 1 - age;
    ctx.fillStyle = '#e2e8f0';
    const s = Math.round(6 + age * 10);
    ctx.fillRect(Math.round(px), Math.round(feet - s / 2), s, s);
  }
  ctx.restore();
  drawOpeningPenguin2D(ctx, '01', x, feet - (step ? 6 : 0), size, 2 + step, false, step ? 0.94 : 1.06, step ? 1.06 : 0.94);
}

// B: a pixel star appears high up, grows, then falls with a trail
function drawOpeningStar(ctx, now, t) {
  if (t < 3900 || t >= OPENING_IMPACT) return;
  const X = OPENING_PILLAR.x;
  const fall = t < 4700 ? 0 : Math.pow((t - 4700) / (OPENING_IMPACT - 4700), 2.2);
  const y = 40 + fall * (OPENING_FEET - 40);
  const s = Math.round((t < 4700 ? openingSmooth((t - 3900) / 800) : 1) * 10 + fall * 18 + 4);
  const glow = ctx.createRadialGradient(X, y, 2, X, y, 40 + s * 2);
  glow.addColorStop(0, 'rgba(236, 254, 255, 0.95)');
  glow.addColorStop(0.4, 'rgba(244, 114, 182, 0.45)');
  glow.addColorStop(1, 'rgba(103, 232, 249, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(X - 120, y - 120, 240, 240);
  // Trail of cubes
  if (fall > 0) {
    const cols = ['#67e8f9', '#f472b6', '#a78bfa', '#ffffff'];
    for (let k = 1; k < 10; k++) {
      const ty = y - k * (12 + fall * 16);
      if (ty < 0) break;
      const ts = Math.max(3, s - k * 2);
      ctx.globalAlpha = 1 - k / 10;
      ctx.fillStyle = cols[k % cols.length];
      ctx.fillRect(Math.round(X - ts / 2 + Math.sin(k * 1.7) * 6), Math.round(ty), ts, ts);
    }
    ctx.globalAlpha = 1;
  }
  const twinkle = Math.floor(now / 90) % 2;
  ctx.fillStyle = OPENING_K;
  ctx.fillRect(X - s / 2 - 2, y - s / 2 - 2, s + 4, s + 4);
  ctx.fillStyle = twinkle ? '#ffffff' : '#a5f3fc';
  ctx.fillRect(X - s / 2, y - s / 2, s, s);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(X - s / 2, y + s / 2 - 3, s, 3);
}

// B: shockwave ring, ice chunks, a brief burst of light on the pillar
function drawOpeningImpact(ctx, t) {
  const d = t - OPENING_IMPACT;
  if (d < 0 || d > 1600) return;
  const X = OPENING_PILLAR.x;
  const Y = OPENING_FEET;
  if (d < 700) {
    const p = d / 700;
    ctx.save();
    ctx.globalAlpha = 1 - p;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10 * (1 - p) + 2;
    ctx.beginPath();
    ctx.ellipse(X, Y, 40 + p * 560, 10 + p * 90, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(X, Y, 20 + p * 380, 6 + p * 60, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if (!OPENING.debris) {
    OPENING.debris = [];
    for (let k = 0; k < 16; k++) {
      const a = -Math.PI / 2 + (openingHash(k) - 0.5) * 2.4;
      const v = 0.35 + openingHash(k + 40) * 0.45;
      OPENING.debris.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 8 + Math.round(openingHash(k + 80) * 3) * 4, spin: (openingHash(k + 9) - 0.5) * 0.02 });
    }
  }
  OPENING.debris.forEach((c, k) => {
    const x = X + c.vx * d;
    const y = Y - 10 + c.vy * d + 0.0009 * d * d;
    if (y > 560) return;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.rotate(c.spin * d);
    ctx.fillStyle = OPENING_K;
    ctx.fillRect(-c.s / 2 - 2, -c.s / 2 - 2, c.s + 4, c.s + 4);
    ctx.fillStyle = k % 3 ? '#e0f2fe' : '#7dd3fc';
    ctx.fillRect(-c.s / 2, -c.s / 2, c.s, c.s);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-c.s / 2, -c.s / 2, c.s, 2);
    ctx.restore();
  });
  if (d < 900) {
    const a = 1 - d / 900;
    const g = ctx.createLinearGradient(X - 90, 0, X + 90, 0);
    g.addColorStop(0, 'rgba(236, 254, 255, 0)');
    g.addColorStop(0.5, `rgba(236, 254, 255, ${(a * 0.9).toFixed(3)})`);
    g.addColorStop(1, 'rgba(236, 254, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(X - 90, 0, 180, Y + 20);
  }
}

// C: the ring of blocks at the wave front, with a glowing scan line
function drawOpeningWaveFront(ctx, now, R) {
  if (R <= 0) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(165, 243, 252, 0.7)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(OPENING_PILLAR.x, OPENING_PILLAR.y, R, R * 0.62, 0, 0, Math.PI * 2);
  ctx.stroke();
  const cols = ['#67e8f9', '#f472b6', '#ffffff', '#a78bfa'];
  for (let k = 0; k < 64; k++) {
    const a = (k / 64) * Math.PI * 2 + Math.sin(now * 0.002 + k) * 0.03;
    const rr = R + Math.sin(now * 0.02 + k * 1.7) * 7;
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

// A-D: the village, drawn flat into a buffer, then through the camera
function drawOpeningVillage(ctx, now, t) {
  if (!OPENING.buf) {
    OPENING.buf = document.createElement('canvas');
    OPENING.buf.width = 960;
    OPENING.buf.height = 540;
  }
  const b = OPENING.buf.getContext('2d');
  b.setTransform(1, 0, 0, 1, 0, 0);
  b.clearRect(0, 0, 960, 540);
  const R = openingWaveRadius(t);
  const ground = (c) => drawOpeningGround(c, t);
  ground(b);
  drawOpeningStar(b, now, t);
  if (R > 0) {
    // Inside the wave: 12 px blocks, with a band of finer 6 px blocks at the front
    const clip = (r) => {
      b.save();
      b.beginPath();
      b.ellipse(OPENING_PILLAR.x, OPENING_PILLAR.y, r, r * 0.62, 0, 0, Math.PI * 2);
      b.clip();
    };
    clip(R);
    drawScene3Mosaic(b, 6, ground);
    b.restore();
    if (R > 60) {
      clip(R - 46);
      drawScene3Mosaic(b, 12, ground);
      b.restore();
    }
  }
  drawOpeningImpact(b, t);
  drawOpeningFolk(b, now, t);
  drawOpeningWaveFront(b, now, R);
  drawOpeningHero(b, now, t);

  let cam = openingCamAt(OPENING_CAM_VILLAGE, t);
  if (t >= OPENING_IMPACT) cam = { ...cam, z: cam.z + 0.1 * Math.exp(-(t - OPENING_IMPACT) / 200) }; // punch-in on the hit
  withOpeningCamera(ctx, cam, openingShake(t), () => ctx.drawImage(OPENING.buf, 0, 0));
  // One short flash as it hits (rises in 1 frame, gone in 0.3 s)
  const fd = t - OPENING_IMPACT;
  if (fd >= 0 && fd < 300) {
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * (1 - fd / 300)).toFixed(3)})`;
    ctx.fillRect(0, 0, 960, 540);
  }
}

// E: the picker's crevasse field; the vehicles turn up one by one
function drawOpeningFound(ctx, now, t) {
  const spots = { ufo: SCENE0_UFO_SPOT, boat: SCENE0_BOAT_SPOT, car: SCENE0_CAR_SPOT };
  const ko = CURRENT_LANG === 'ko';
  const cam = openingCamAt(OPENING_CAM_FIELD, t);
  const looking = [...OPENING_FOUND].reverse().find((f) => t >= f.at - 300);
  withOpeningCamera(ctx, cam, 0, () => {
    drawRefScene1ChoiceBackground(ctx, now);
    OPENING_FOUND.forEach((f) => {
      const p = (t - f.at) / 450;
      if (p < 0) return;
      const sp = spots[f.kind];
      // Spotlight on the one just found
      if (p < 2.2 && t < 18100) {
        const a = Math.min(1, p * 3, (2.2 - p) * 2) * 0.32;
        const g = ctx.createRadialGradient(sp.x, sp.y, 60, sp.x, sp.y, 420);
        g.addColorStop(0, 'rgba(11, 16, 32, 0)');
        g.addColorStop(1, `rgba(11, 16, 32, ${a.toFixed(3)})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 960, 540);
      }
      // Burst out of the snow: squash on landing, stretch up, settle
      const k = openingBack(p);
      const sy = p < 1 ? k : 1 + Math.sin((p - 1) * Math.PI * 3) * Math.exp(-(p - 1) * 3) * 0.05;
      ctx.save();
      ctx.translate(sp.x, sp.y + 30 * sp.scale);
      ctx.scale(Math.max(0.01, p < 1 ? 0.7 + 0.3 * k : 2 - sy), Math.max(0.01, sy));
      ctx.translate(-sp.x, -sp.y - 30 * sp.scale);
      if (f.kind === 'ufo') drawPlaneWithPilot(ctx, sp.x, sp.y, sp.tilt, now, { scale: sp.scale, withPilot: false, propSpin: false });
      else if (f.kind === 'boat') drawBoatWithPilot(ctx, sp.x, sp.y + Math.round(Math.sin(now * 0.004) * 1.5), 0, now, { scale: sp.scale, withPilot: false, smokeOn: false });
      else drawCarWithPilot(ctx, sp.x, sp.y, sp.tilt, now, { scale: sp.scale, withPilot: false, lightsOn: false, wheelAngle: 0 });
      ctx.restore();
      if (p < 1.6) {
        // Snow thrown up, sparkles round it
        for (let s = 0; s < 12; s++) {
          const a = (s / 12) * Math.PI * 2;
          const r = 30 + p * 60;
          ctx.globalAlpha = Math.max(0, 1 - p / 1.6);
          ctx.fillStyle = s % 3 === 0 ? '#fde047' : '#ffffff';
          const q = s % 3 === 0 ? 6 : 8;
          ctx.fillRect(Math.round(sp.x + Math.cos(a) * r) - q / 2, Math.round(sp.y - 10 + Math.sin(a) * r * 0.6 + p * p * 20) - q / 2, q, q);
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
    // The hero runs in from the right onto its floe, turns to each find, then strikes the picker's pose
    drawScene0HeroLedge(ctx, now, 0, 0);
    const H = SCENE0_HERO;
    const r = Math.min(1, (t - OPENING_CUT) / 1250);
    if (r < 1) {
      const x = 1060 - (1060 - H.x) * (1 - (1 - r) * (1 - r));
      const step = Math.floor(now / 75) % 2;
      drawOpeningPenguin2D(ctx, '01', x, H.feet - 6 - (step ? 5 : 0), H.size, 2 + step, true, step ? 0.95 : 1.05, step ? 1.05 : 0.95);
    } else if (t < 18300) {
      // Skid to a stop, then looks at whatever it just found
      const st = t - OPENING_CUT - 1250;
      const sq = st < 200 ? Math.sin((st / 200) * Math.PI) * 0.12 : 0;
      const flip = looking ? spots[looking.kind].x > H.x : true;
      const shocked = looking && t - looking.at < 900;
      drawOpeningPenguin2D(ctx, '01', H.x, H.feet - 6, H.size, shocked ? 6 : 0, flip, 1 + sq, 1 - sq);
      if (shocked) drawOpeningMarkOver(ctx, H.x + (flip ? 40 : -40), H.feet - H.size - 4, '!', '#fde047', looking.at, t);
    } else {
      drawScene0Hero(ctx, now, 0, 0);
    }
  });
  // Pixel-block dissolve in (the village closes up) and out (the field opens)
  drawOpeningDissolve(ctx, t);
}

function drawOpeningDissolve(ctx, t) {
  const a = OPENING_CUT - 380;
  const b = OPENING_CUT + 380;
  if (t < a || t > b) return;
  const p = t < OPENING_CUT ? (t - a) / 380 : 1 - (t - OPENING_CUT) / 380;
  const S = 48;
  for (let gy = 0; gy < 540 / S; gy++) {
    for (let gx = 0; gx < 960 / S; gx++) {
      // Sweeps right to left (the way the penguin ran) with a ragged edge
      const order = (1 - gx / 20) * 0.6 + openingHash(gx * 31 + gy * 7) * 0.4;
      if (order > p) continue;
      ctx.fillStyle = p - order < 0.06 ? '#67e8f9' : OPENING_K;
      ctx.fillRect(gx * S, gy * S, S, S);
    }
  }
}

// Letterbox (slides in), the story caption, the skip tag
function drawOpeningCaption(ctx, now, t) {
  const ko = CURRENT_LANG === 'ko';
  const beats = [
    [400, 3700, '평화로운 남극 펭귄나라', 'A peaceful penguin land in Antarctica'],
    [3900, 6900, '그러던 어느 날, 하늘에서 픽셀 기둥이 떨어졌다', 'Then one day, a pixel pillar fell from the sky'],
    [7100, 10000, '닿는 것마다 전부 도트로 변해버렸다!', 'Everything it touched turned into pixels!'],
    [10100, 12900, '나까지 도트 되기 전에... 도망쳐!!', 'Run before you get pixelated too!!'],
    [13900, 14900, '헉헉... 여기까지 왔는데...', 'Huff... made it this far...'],
    [18300, OPENING_MS, '하나 골라 타고 탈출하자!!', 'Pick one and get out of here!!'],
  ];
  const k = stageUiK();
  const slide = openingSmooth(t / 500);
  const bar = (k > 1 ? 60 : 48) * slide; // phones: the 1.6x caption needs the taller bar
  ctx.fillStyle = OPENING_K;
  ctx.fillRect(0, 0, 960, 48 * slide);
  ctx.fillRect(0, 540 - bar, 960, bar);
  // Fade in from black
  if (t < 600) {
    ctx.fillStyle = `rgba(11, 16, 32, ${(1 - t / 600).toFixed(3)})`;
    ctx.fillRect(0, 0, 960, 540);
  }
  const line = beats.find(([a, b]) => t >= a && t < b);
  if (line) {
    const [a, b] = line;
    const alpha = Math.min(1, (t - a) / 250, (b - t) / 250);
    const text = ko ? line[2] : line[3];
    // Typed out, one character per 30 ms
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
  ctx.globalAlpha = slide;
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
    OPENING.conv = [];
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
  if (t < OPENING_CUT) drawOpeningVillage(ctx, now, t);
  else drawOpeningFound(ctx, now, t);
  if (t >= OPENING_CUT - 380 && t < OPENING_CUT) drawOpeningDissolve(ctx, t);
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
