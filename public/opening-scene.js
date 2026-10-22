// ============================================================================
// OPENING — a ~19.5 s motion-graphics story played once, before the escape picker (scene 1, escape-scene.js):
//   A  0.0-3.8 s  a peaceful penguin land, snowing: one toboggans on its belly, two have a snowball fight, one
//                 hops, one dances, the blue hero laughs along; slow push-in
//   B  3.8-7.0 s  anticipation, action, reaction: the sky darkens and everyone looks up (?), a pixel star grows
//                 and falls, slams into the ground (one short flash, shockwave, flying ice, camera punch) and the
//                 land splits round the pillar (the bg_scene1_2d picture, which has the pillar in it); the
//                 penguins jump in shock and panic each their own way (trip and slide, run in circles, flap and
//                 yell, zigzag, crash into the hero, stranded on the far ledge)
//   C  7.0-10.3 s a pixel wave spreads out of the pillar: big blocks inside, finer blocks at the front, and each
//                 penguin it reaches pops into its pixel self with a white flash
//   D 10.3-13.3 s the blue penguin crouches and hops away on both feet (as penguins do over rough ground), the
//                 camera follows, the wave right behind
//   E 13.3-19.5 s pixel-block dissolve to the picker's crevasse field; the camera visits the plane, the icebreaker
//                 and the car as the penguin finds them one by one, then pulls back to the picker's exact framing,
//                 so it hands over without a cut
// Motion follows the animation basics (anticipation -> action -> reaction, ease in / out, squash and stretch,
// overshoot on pops); there is one full-screen flash, well under WCAG 2.3.1's three per second.
// It is drawn live on the stage (no video file), so it is sharp at any size and follows the language toggle.
// Shown once per browser (localStorage), always skippable (tap, Esc / Enter / Space, the 건너뛰기 tag); ?opening
// in the URL plays it again, and so does the next load after a hard reload (Ctrl+Shift+R / Cmd+Shift+R: the
// page gets that keydown before the browser reloads; only Ctrl+N / W / T are kept from pages). The film-slate icon button
// in the top bar turns it off for good (default on); turning it back on plays it again right away. With
// prefers-reduced-motion it is not played (flash and shaking).
// ============================================================================
const OPENING_MS = 19500;
const OPENING_STORE = 'ppeng-opening-seen';
const OPENING_PREF = 'ppeng-opening'; // 'off' = never show it
const OPENING_PILLAR = { x: 770, y: 300 };
const OPENING_FEET = 338; // the snow plateau in bg_scene1_2d
const OPENING_K = '#0b1020';
const OPENING_IMPACT = 5600;
const OPENING_CUT = 13350; // village -> crevasse field, under the dissolve
// Village penguins: species, x, size, what they do while it is calm and how they panic (openingCalmPose /
// openingPanicPose). All stand where bg_scene1_2d still has ground once the land splits (left plateau up to
// x ~580, the small ledge right of the chasm from ~900).
const OPENING_FOLK = [
  { sp: '05', x: 50, size: 74, calm: 'slide', panic: 'trip' },
  { sp: '22', x: 230, size: 68, calm: 'throw', facing: 1, panic: 'circle' },
  { sp: '06', x: 330, size: 64, calm: 'throw', facing: -1, panic: 'flail' },
  { sp: '04', x: 520, size: 72, calm: 'hop', panic: 'zigzag' },
  { sp: '09', x: 566, size: 66, calm: 'waddle', ph: 3.3, panic: 'bonk' },
  { sp: '10', x: 932, size: 64, calm: 'dance', panic: 'stranded' },
];
const OPENING_HERO_X = 430;
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

const OPENING = { want: null, start: 0, active: false, conv: [], debris: null, tmp: null, land: null, still: null };

function openingWanted() {
  if (OPENING.want !== null) return OPENING.want;
  let want = true;
  try {
    if (/[?&]opening\b/.test(window.location.search)) want = true;
    else if (localStorage.getItem(OPENING_PREF) === 'off') want = false;
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
  if (t < 10300) return 60 + openingSmooth((t - 7000) / 3300) * 250;
  return 310 + (t - 10300) * 0.22;
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
  // Put together once, then one blit per frame
  if (!OPENING.land) {
    const c = document.createElement('canvas');
    c.width = 960;
    c.height = 540;
    const lc = c.getContext('2d');
    const sw = img.naturalWidth / 2;
    lc.drawImage(img, 0, 0, sw, img.naturalHeight, 0, 0, 480, 540);
    lc.translate(960, 0);
    lc.scale(-1, 1);
    lc.drawImage(img, 0, 0, sw, img.naturalHeight, 0, 0, 480, 540);
    OPENING.land = c;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(OPENING.land, 0, 0);
}

// From OPENING_GROUND_STILL on the ground (split land + settled tint) no longer changes, so it and its two block
// versions inside the wave are drawn once and blitted
const OPENING_GROUND_STILL = OPENING_IMPACT + 900;
function openingStillGround(size) {
  if (!OPENING.still) OPENING.still = {};
  if (!OPENING.still[size]) {
    const c = document.createElement('canvas');
    c.width = 960;
    c.height = 540;
    const g = c.getContext('2d');
    if (size > 1) drawScene3Mosaic(g, size, (m) => drawOpeningGround(m, OPENING_GROUND_STILL));
    else drawOpeningGround(g, OPENING_GROUND_STILL);
    OPENING.still[size] = c;
  }
  return OPENING.still[size];
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

// 2D penguin from the species' 2D sheet. sx / sy squash and stretch, rot tips it over (pi/2 = lying on its belly
// head to the right, as when tobogganing); the feet stay on `feet` however it is squashed or tipped
function drawOpeningPenguin2D(ctx, sp, x, feet, size, frame, flip, sx = 1, sy = 1, rot = 0) {
  const sheet = getHero2DSheetForSpecies(sp);
  if (!sheet) return;
  const lying = Math.abs(Math.sin(rot));
  const py = feet - size * (0.45 - 0.15 * lying) * (lying > 0.5 ? 1 : sy);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(py));
  ctx.rotate(rot);
  ctx.scale(flip ? -sx : sx, sy);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sheet, frame * 256, 0, 256, 256, -size / 2, -size * 0.55, size, size);
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
  // One fixed-size scratch canvas (resizing it per penguin reallocated it every frame while several flash)
  if (!OPENING.tmp) {
    OPENING.tmp = document.createElement('canvas');
    OPENING.tmp.width = 128;
    OPENING.tmp.height = 128;
  }
  const c = OPENING.tmp;
  const n = Math.min(128, Math.ceil(s) + 8);
  const tc = c.getContext('2d');
  tc.setTransform(1, 0, 0, 1, 0, 0);
  tc.globalCompositeOperation = 'source-over';
  tc.clearRect(0, 0, n, n);
  drawAnimatedPixelPenguin(tc, entry, 4, 4, s, now, { seed, isWalking: false, flipX: flip });
  tc.globalCompositeOperation = 'source-atop';
  tc.fillStyle = `rgba(255, 255, 255, ${flash.toFixed(3)})`;
  tc.fillRect(0, 0, n, n);
  ctx.drawImage(c, 0, 0, n, n, Math.round(x - s / 2 - 4), Math.round(top - 4), n, n);
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

// Small shout bubble over a penguin
function drawOpeningYell(ctx, x, y, text, t0, t1, t) {
  if (t < t0 || t >= t1) return;
  const pop = openingBack((t - t0) / 200);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(pop, pop);
  ctx.font = '900 15px "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';
  const w = Math.ceil(ctx.measureText(text).width) + 16;
  ctx.fillStyle = OPENING_K;
  ctx.fillRect(-w / 2 - 2, -30, w + 4, 26);
  ctx.fillRect(-4, -6, 8, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-w / 2, -28, w, 22);
  ctx.fillRect(-2, -6, 4, 6);
  ctx.fillStyle = OPENING_K;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, -16);
  ctx.restore();
}

// Sweat drops flying off a panicking head
function drawOpeningSweat(ctx, x, top, now, seed) {
  for (let s = 0; s < 2; s++) {
    const sp = (now * 0.003 + s * 0.5 + seed * 0.21) % 1;
    const side = (s + seed) % 2 ? 1 : -1;
    const sx = Math.round(x + side * (16 + sp * 20));
    const sy = Math.round(top + 14 - Math.sin(sp * Math.PI) * 14 + sp * 10);
    ctx.globalAlpha = 1 - sp;
    ctx.fillStyle = OPENING_K;
    ctx.fillRect(sx - 1, sy - 1, 6, 8);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(sx, sy, 4, 6);
  }
  ctx.globalAlpha = 1;
}

// Dust kicked up behind a runner (dir = the way it runs)
function drawOpeningDust(ctx, x, feet, now, dir, seed) {
  for (let k = 0; k < 3; k++) {
    const age = ((now / 140 + k / 3 + seed * 0.13) % 1);
    const px = x - dir * (14 + age * 34);
    const s = Math.round(5 + age * 9);
    ctx.globalAlpha = (1 - age) * 0.9;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(Math.round(px - s / 2), Math.round(feet - s - age * 6), s, s);
  }
  ctx.globalAlpha = 1;
}

// Dizzy stars turning over a bonked head
function drawOpeningDizzy(ctx, x, y, now) {
  for (let k = 0; k < 3; k++) {
    const a = now * 0.008 + (k * Math.PI * 2) / 3;
    const sx = Math.round(x + Math.cos(a) * 18);
    const sy = Math.round(y + Math.sin(a) * 6);
    ctx.fillStyle = OPENING_K;
    ctx.fillRect(sx - 4, sy - 1, 8, 2);
    ctx.fillRect(sx - 1, sy - 4, 2, 8);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(sx - 3, sy, 6, 1);
    ctx.fillRect(sx, sy - 3, 1, 6);
  }
}

// Running pose helpers
function openingRunFrame(now, i, ms = 70) {
  return 2 + (Math.floor(now / ms + i) % 2);
}
function openingRunLift(now, i, ms = 70) {
  return Math.floor(now / ms + i) % 2 ? 5 : 0;
}

// A (calm): what each penguin is doing before anything happens. Returns a pose.
function openingCalmPose(i, f, t, now) {
  const p = { x: f.x, lift: 0, rot: 0, frame: Math.floor(now / 1700 + i) % 5 === 0 ? 1 : 0, flip: false, sx: 1, sy: 1 };
  if (f.calm === 'slide') {
    // Waddle, belly-flop and toboggan to the right, get up, waddle back
    if (t < 500) {
      p.x = f.x + (t / 500) * 16;
      p.frame = openingRunFrame(now, i, 160);
    } else if (t < 1900) {
      const q = (t - 500) / 1400;
      p.x = f.x + 16 + (1 - (1 - q) * (1 - q)) * 120;
      p.rot = Math.min(1, q * 6) * (Math.PI / 2);
      p.frame = 0;
      p.spray = q < 0.85;
    } else if (t < 2300) {
      const q = (t - 1900) / 400;
      p.x = f.x + 136;
      p.rot = (1 - openingSmooth(q)) * (Math.PI / 2);
      p.lift = Math.sin(q * Math.PI) * 10;
    } else {
      p.x = f.x + 136 - ((t - 2300) / 1500) * 60;
      p.flip = true;
      p.frame = openingRunFrame(now, i, 180);
    }
  } else if (f.calm === 'throw') {
    // Snowball fight: wind up, throw; flinch when hit (OPENING_SNOWBALLS)
    p.flip = f.facing < 0;
    OPENING_SNOWBALLS.forEach(([at, from, to]) => {
      if (from === i && t > at - 220 && t < at + 120) {
        const q = (t - at + 220) / 340;
        p.rot = (q < 0.65 ? -0.25 : 0.2) * (f.facing > 0 ? 1 : -1);
        p.sy = q < 0.65 ? 0.92 : 1.06;
        p.sx = 2 - p.sy;
      }
      const hit = at + 450;
      if (to === i && t > hit && t < hit + 260) {
        const q = (t - hit) / 260;
        p.sy = 1 - Math.sin(q * Math.PI) * 0.18;
        p.sx = 2 - p.sy;
        p.frame = 6;
      }
    });
  } else if (f.calm === 'hop') {
    const q = (t % 600) / 600;
    p.lift = Math.sin(q * Math.PI) * 16;
    p.sy = q < 0.1 || q > 0.9 ? 0.86 : 1.06;
    p.sx = 2 - p.sy;
    p.note = true;
  } else if (f.calm === 'waddle') {
    p.x = f.x + Math.sin(now * 0.0016 + f.ph) * 8;
    p.frame = openingRunFrame(now, i, 200);
    p.flip = Math.cos(now * 0.0016 + f.ph) < 0;
  } else if (f.calm === 'dance') {
    const beat = Math.floor(t / 380);
    const q = (t % 380) / 380;
    p.flip = beat % 2 === 0;
    p.lift = Math.sin(q * Math.PI) * 9;
    p.rot = (beat % 2 ? 1 : -1) * 0.12;
    p.heart = true;
  }
  return p;
}

// After the hit (from ~6 s): each penguin panics its own way. Penguins waddle slowly on land (about 2-3 km/h at
// most), so for all the flailing they hardly get anywhere and the wave catches them; the hero keeps its head
// and hops away (drawOpeningHero).
function openingPanicPose(i, f, t, now, base) {
  const ko = CURRENT_LANG === 'ko';
  const d = t - 6000;
  const p = { x: base, lift: 0, rot: 0, frame: 6, flip: false, sx: 1, sy: 1, sweat: true };
  // Legs going flat out, bouncing high and leaning into the run
  const run = (dir, ms = 65) => {
    p.frame = openingRunFrame(now, i, ms);
    p.lift = openingRunLift(now, i, ms) * 1.6;
    p.flip = dir < 0;
    p.rot = dir * 0.22;
    p.dust = dir;
  };
  if (f.panic === 'trip') {
    // Runs, trips flat on its face and slides, lies there, gets up and runs the wrong way, notices, turns
    if (d < 500) {
      p.x = base - d * 0.08;
      run(-1);
    } else if (d < 1100) {
      const q = (d - 500) / 600;
      p.x = base - 40 - (1 - (1 - q) * (1 - q)) * 26;
      p.rot = -Math.min(1, q * 5) * (Math.PI / 2);
      p.flip = true;
      p.frame = 6;
      p.sweat = false;
      p.spray = q < 0.8;
    } else if (d < 1900) {
      p.x = base - 66;
      p.rot = -Math.PI / 2;
      p.flip = true;
      p.sx = 1 + Math.sin(now * 0.04) * 0.04;
      p.sweat = false;
      p.yell = [ko ? '아야야...' : 'Ouch...', 7100, 7900];
    } else if (d < 3400) {
      p.x = base - 66 + (d - 1900) * 0.06;
      run(1);
    } else {
      p.x = base - 66 + 90 - (d - 3400) * 0.03;
      run(-1, 80);
      p.yell = [ko ? '앗 이쪽 아니야!!' : 'Wrong way!!', 9400, 10300];
    }
  } else if (f.panic === 'circle') {
    // Runs round in circles, getting nowhere
    const c = base - d * 0.025;
    const a = d * 0.009;
    p.x = c + Math.cos(a) * 50;
    run(-Math.sin(a) < 0 ? -1 : 1, 60);
    p.sy = 1 + Math.sin(a) * 0.04;
  } else if (f.panic === 'flail') {
    // Hops on the spot flapping, yelling for its mum, then waddles off
    if (d < 1600) {
      const q = (d % 260) / 260;
      p.lift = Math.sin(q * Math.PI) * 18;
      p.rot = Math.sin(now * 0.03) * 0.3;
      p.flip = Math.floor(now / 130) % 2 === 0;
      p.yell = [ko ? '엄마아아!!' : 'MOMMY!!', 6200, 7600];
    } else {
      p.x = base - (d - 1600) * 0.05;
      run(-1, 75);
      p.rot = Math.sin(now * 0.02) * 0.12;
    }
  } else if (f.panic === 'zigzag') {
    // Zigzags off, looking back over its shoulder
    const w = d * 0.006;
    p.x = base - d * 0.06 + Math.sin(w) * 34;
    run(Math.cos(w) * 34 * 0.006 - 0.06 < 0 ? -1 : 1, 60);
  } else if (f.panic === 'bonk') {
    // Sprints straight into the hero, bounces off onto its back, sees stars, gets up and runs the wrong way
    const hit = (base - (OPENING_HERO_X + 42)) / 0.12;
    if (d < hit) {
      p.x = base - d * 0.12;
      run(-1, 55);
    } else if (d < hit + 320) {
      const q = (d - hit) / 320;
      p.x = OPENING_HERO_X + 42 + q * 56;
      p.lift = Math.sin(q * Math.PI) * 26;
      p.rot = q * (Math.PI / 2);
      p.flip = true;
      p.sweat = false;
    } else if (d < hit + 1500) {
      p.x = OPENING_HERO_X + 98;
      p.rot = Math.PI / 2;
      p.flip = true;
      p.frame = 1;
      p.sweat = false;
      p.dizzy = true;
    } else {
      p.x = OPENING_HERO_X + 98 + (d - hit - 1500) * 0.06;
      run(1, 60);
      p.yell = [ko ? '어디로 가야 돼?!' : 'Which way?!', 6000 + hit + 1500, 6000 + hit + 2600];
    }
  } else if (f.panic === 'stranded') {
    // Cut off on the far ledge: jumps up and down waving, nearly topples into the chasm
    const q = (d % 300) / 300;
    p.lift = Math.sin(q * Math.PI) * 20;
    p.flip = Math.floor(now / 150) % 2 === 0;
    p.rot = d > 1400 && d < 1800 ? -Math.sin(((d - 1400) / 400) * Math.PI) * 0.5 : Math.sin(now * 0.03) * 0.15;
    p.yell = [ko ? '살려줘~!' : 'Help me~!', 6100, 8100];
  }
  return p;
}

// Village folk: calm activities, look up, jump in shock, panic, get changed by the wave
function drawOpeningFolk(ctx, now, t) {
  const R = openingWaveRadius(t);
  OPENING_FOLK.forEach((f, i) => {
    const feet = OPENING_FEET;
    // Pose: calm, frozen in place while looking up, a jump at the hit, then panic
    const calmEnd = openingCalmPose(i, f, 3799, now);
    let p;
    if (t < 3800) p = openingCalmPose(i, f, t, now);
    else if (t < 6000) {
      p = { ...calmEnd, lift: 0, rot: 0, sx: 1, sy: 1, spray: false, note: false, heart: false, flip: calmEnd.flip };
      p.frame = t > 4700 ? 6 : 0;
      const jt = t - OPENING_IMPACT - i * 40;
      if (jt >= 0 && jt < 380) {
        // Jump in shock: squash, stretch in the air, squash on landing
        const q = jt / 380;
        p.lift = Math.sin(q * Math.PI) * 30;
        p.sy = q < 0.12 || q > 0.88 ? 0.82 : 1.12;
        p.sx = 2 - p.sy;
        p.frame = 6;
      }
    } else p = openingPanicPose(i, f, t, now, calmEnd.x);
    const x = Math.max(16, Math.min(f.panic === 'stranded' ? 950 : 572, p.x));
    if (openingInWave(x, feet - 30, R)) {
      if (!OPENING.conv[i]) OPENING.conv[i] = { t, x };
      const c = OPENING.conv[i];
      const since = t - c.t;
      const flash = since < 260 ? 1 - since / 260 : 0;
      const scale = since < 320 ? 0.7 + 0.3 * openingBack(since / 320) : 1;
      const hop = Math.floor(now / 260 + i) % 2 ? 0 : 4;
      drawOpeningPixelPenguin(ctx, f.sp, c.x, feet - hop, f.size * 1.05, now, 3 + i, i % 2 === 0, flash, scale);
      if (since < 500) {
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 + i;
          const r = 14 + (since / 500) * 46;
          ctx.globalAlpha = 1 - since / 500;
          ctx.fillStyle = k % 2 ? '#67e8f9' : '#f472b6';
          ctx.fillRect(Math.round(c.x + Math.cos(a) * r) - 3, Math.round(feet - f.size / 2 + Math.sin(a) * r) - 3, 6, 6);
        }
        ctx.globalAlpha = 1;
      } else if (since < 1600) {
        // ...and looks itself over, baffled
        drawScene0Mark(ctx, c.x + 18, feet - f.size - 8 - hop, '?', '#fde047');
      }
      return;
    }
    if (p.dust) drawOpeningDust(ctx, x, feet, now, p.dust, i);
    if (p.spray) drawOpeningDust(ctx, x - (p.rot > 0 ? 20 : -20), feet, now, p.rot > 0 ? 1 : -1, i + 3);
    drawOpeningPenguin2D(ctx, f.sp, x, feet - p.lift, f.size, p.frame, p.flip, p.sx, p.sy, p.rot);
    const top = feet - p.lift - f.size * (Math.abs(Math.sin(p.rot)) > 0.5 ? 0.5 : 0.95);
    if (p.sweat) drawOpeningSweat(ctx, x, top, now, i);
    if (p.dizzy) drawOpeningDizzy(ctx, x, top - 4, now);
    if (p.note) {
      const q = (now % 1200) / 1200;
      ctx.globalAlpha = 1 - q;
      ctx.fillStyle = '#7c3aed';
      ctx.font = '900 18px "Pretendard", sans-serif';
      ctx.fillText('♪', x + 18 + q * 10, top - q * 26);
      ctx.globalAlpha = 1;
    }
    if (p.heart) drawPixelHeart(ctx, x + 16, top - ((now * 0.03) % 22), 2.2, '#ff4d6d');
    if (t >= 3800 && t < OPENING_IMPACT) drawOpeningMarkOver(ctx, x + 2, feet - f.size - 10, t > 4700 ? '!' : '?', t > 4700 ? '#fb7185' : '#fde047', 3850 + i * 70, t);
    if (p.yell) drawOpeningYell(ctx, x, top - 6, p.yell[0], p.yell[1], p.yell[2], t);
  });
  drawOpeningSnowballs(ctx, t);
}

// A: snowballs between the two throwers [time thrown, from, to]
const OPENING_SNOWBALLS = [
  [700, 1, 2],
  [1550, 2, 1],
  [2400, 1, 2],
  [3250, 2, 1],
];
function drawOpeningSnowballs(ctx, t) {
  OPENING_SNOWBALLS.forEach(([at, from, to]) => {
    const a = OPENING_FOLK[from];
    const b = OPENING_FOLK[to];
    const q = (t - at) / 450;
    const y0 = OPENING_FEET - a.size * 0.6;
    if (q >= 0 && q < 1) {
      const x = a.x + (b.x - a.x) * q;
      const y = y0 - Math.sin(q * Math.PI) * 44;
      ctx.fillStyle = OPENING_K;
      ctx.fillRect(Math.round(x) - 8, Math.round(y) - 8, 16, 16);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.round(x) - 6, Math.round(y) - 6, 12, 12);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(Math.round(x) - 6, Math.round(y) + 2, 12, 4);
    } else if (q >= 1 && q < 1.6) {
      // Puff of snow on the hit
      const r = (q - 1) / 0.6;
      ctx.globalAlpha = 1 - r;
      ctx.fillStyle = '#ffffff';
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * Math.PI * 2;
        ctx.fillRect(Math.round(b.x + Math.cos(ang) * (8 + r * 20)) - 3, Math.round(y0 + Math.sin(ang) * (6 + r * 14)) - 3, 6, 6);
      }
      ctx.globalAlpha = 1;
    }
  });
}

// Snow falling over the village (two speeds for depth)
function drawOpeningSnow(ctx, now) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let k = 0; k < 42; k++) {
    const far = k % 2;
    const x = (k * 97 + now * (far ? 0.012 : 0.03) + Math.sin(now * 0.001 + k) * 12) % 980;
    const y = (k * 53 + now * (far ? 0.025 : 0.06)) % 560;
    const s = far ? 2 : 4;
    ctx.fillRect(Math.round(x) - 10, Math.round(y) - 10, s, s);
  }
}

// The blue hero: watches the fun, looks up, jumps at the hit, trembles and looks round, gets knocked by a
// fleeing local, then crouches and hops away on both feet, just ahead of the wave
function drawOpeningHero(ctx, now, t) {
  const ko = CURRENT_LANG === 'ko';
  const feet = OPENING_FEET + 8;
  const size = 100;
  const X = OPENING_HERO_X;
  if (t < 3800) {
    // Watching the snowball fight, laughing along
    const laugh = OPENING_SNOWBALLS.some(([at]) => t > at + 450 && t < at + 900);
    const bob = laugh && Math.floor(now / 110) % 2 ? 3 : 0;
    drawOpeningPenguin2D(ctx, '01', X, feet - bob, size, laugh ? 1 : Math.floor(now / 1800) % 5 === 0 ? 1 : 0, true);
    return;
  }
  if (t < 10000) {
    const jt = t - OPENING_IMPACT;
    let sy = 1;
    let lift = 0;
    let xo = 0;
    let flip = true;
    if (jt >= 0 && jt < 420) {
      const q = jt / 420;
      lift = Math.sin(q * Math.PI) * 36;
      sy = q < 0.12 || q > 0.88 ? 0.8 : 1.14;
    } else if (jt >= 420) {
      flip = Math.floor(t / 520) % 2 === 0; // looking this way and that
      xo = Math.round(Math.sin(now * 0.07) * 2); // trembling
      const bonk = t - (6000 + (OPENING_FOLK[4].x - (X + 42)) / 0.12);
      if (bonk >= 0 && bonk < 300) {
        const q = bonk / 300;
        xo -= Math.sin(q * Math.PI) * 14;
        sy = 1 - Math.sin(q * Math.PI) * 0.15;
      }
    }
    drawOpeningPenguin2D(ctx, '01', X + xo, feet - lift, size, t > 4700 ? 6 : 0, flip, 2 - sy, sy);
    if (t > 4700) drawOpeningSweat(ctx, X + xo, feet - lift - size * 0.95, now, 9);
    drawOpeningMarkOver(ctx, X - 30, feet - size - 6 - lift, t > 4700 ? '!' : '?', t > 4700 ? '#fb7185' : '#fde047', 3800, t);
    return;
  }
  if (t < 10300) {
    // Anticipation: crouch, ready to run
    const q = (t - 10000) / 300;
    drawOpeningPenguin2D(ctx, '01', X + q * 8, feet, size, 6, false, 1 + q * 0.14, 1 - q * 0.16);
    drawOpeningYell(ctx, X, feet - size - 8, ko ? '튀어!!' : 'RUN!!', 10000, 10700, t);
    return;
  }
  // Hops away on both feet, the way penguins hop over rough ground, flippers out for balance: squash, spring,
  // stretch in the air, squash on landing, a puff of snow each time it lands. 96 px every 300 ms keeps it just
  // ahead of the wave (0.22 px/ms); on the third hop it looks back over its shoulder.
  const HOP_MS = 300;
  const HOP_DX = 96;
  const d = t - 10300;
  const k = Math.floor(d / HOP_MS);
  const p = (d % HOP_MS) / HOP_MS;
  const x = X - (k + openingSmooth(p)) * HOP_DX;
  let lift = 0;
  let sy = 1;
  if (p < 0.12) sy = 0.8 + (p / 0.12) * 0.2; // pushing off
  else if (p > 0.88) sy = 1 - ((p - 0.88) / 0.12) * 0.2; // landing
  else {
    const a = (p - 0.12) / 0.76;
    lift = Math.sin(a * Math.PI) * 34;
    sy = a < 0.5 ? 1.12 - a * 0.24 : 1; // stretched on the way up
  }
  const lookBack = k === 2 && p > 0.2 && p < 0.85;
  const rot = (k % 2 ? 1 : -1) * 0.1 * Math.sin(p * Math.PI);
  // Snow puff where it last landed
  if (p < 0.5) {
    const lx = X - k * HOP_DX;
    const age = p / 0.5;
    ctx.globalAlpha = 1 - age;
    ctx.fillStyle = '#f1f5f9';
    for (let s = -1; s <= 1; s += 2) {
      const sz = Math.round(6 + age * 8);
      ctx.fillRect(Math.round(lx + s * (14 + age * 22) - sz / 2), Math.round(feet - sz - age * 4), sz, sz);
    }
    ctx.globalAlpha = 1;
  }
  drawOpeningPenguin2D(ctx, '01', x, feet - lift, size, lift > 0 ? 6 : 0, !lookBack, 2 - sy, sy, rot);
  drawOpeningSweat(ctx, x, feet - lift - size * 0.95, now, 9);
  if (lookBack) drawScene0Mark(ctx, x + 34, feet - lift - size - 4, '!', '#fb7185');
  drawOpeningYell(ctx, X, feet - size - 8, ko ? '튀어!!' : 'RUN!!', 10000, 10700, t);
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
  // Drawn straight through the camera (no in-between buffer: one full-stage blit less per frame, and sharper)
  let cam = openingCamAt(OPENING_CAM_VILLAGE, t);
  if (t >= OPENING_IMPACT) cam = { ...cam, z: cam.z + 0.1 * Math.exp(-(t - OPENING_IMPACT) / 200) }; // punch-in on the hit
  withOpeningCamera(ctx, cam, openingShake(t), () => drawOpeningVillageWorld(ctx, now, t));
  // One short flash as it hits (rises in 1 frame, gone in 0.3 s)
  const fd = t - OPENING_IMPACT;
  if (fd >= 0 && fd < 300) {
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * (1 - fd / 300)).toFixed(3)})`;
    ctx.fillRect(0, 0, 960, 540);
  }
}

function drawOpeningVillageWorld(b, now, t) {
  const R = openingWaveRadius(t);
  const still = t >= OPENING_GROUND_STILL && MOTION_STATE.bgScene1Loaded;
  const ground = (c) => drawOpeningGround(c, t);
  if (still) b.drawImage(openingStillGround(1), 0, 0);
  else ground(b);
  drawOpeningStar(b, now, t);
  if (R > 0) {
    // Inside the wave: 12 px blocks, with a ring of finer 6 px blocks at the front (each drawn only where it shows)
    const ellipse = (r) => b.ellipse(OPENING_PILLAR.x, OPENING_PILLAR.y, r, r * 0.62, 0, 0, Math.PI * 2);
    const inner = R > 60 ? R - 46 : 0;
    b.save();
    b.beginPath();
    ellipse(R);
    if (inner) {
      b.moveTo(OPENING_PILLAR.x + inner, OPENING_PILLAR.y);
      ellipse(inner);
    }
    b.clip('evenodd');
    if (still) b.drawImage(openingStillGround(6), 0, 0);
    else drawScene3Mosaic(b, 6, ground);
    b.restore();
    if (inner) {
      b.save();
      b.beginPath();
      ellipse(inner);
      b.clip();
      if (still) b.drawImage(openingStillGround(12), 0, 0);
      else drawScene3Mosaic(b, 12, ground);
      b.restore();
    }
  }
  drawOpeningImpact(b, t);
  drawOpeningFolk(b, now, t);
  drawOpeningWaveFront(b, now, R);
  drawOpeningHero(b, now, t);
  drawOpeningSnow(b, now);
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

function openingPrefOn() {
  try {
    return localStorage.getItem(OPENING_PREF) !== 'off';
  } catch (e) {
    return true;
  }
}

function setOpeningPref(on) {
  try {
    localStorage.setItem(OPENING_PREF, on ? 'on' : 'off');
    if (on) localStorage.removeItem(OPENING_STORE);
  } catch (e) {}
  if (on) {
    // Play it again now if the picker is showing (otherwise the next time it does)
    OPENING.want = true;
    OPENING.active = false;
  } else {
    skipOpening();
    OPENING.want = false;
  }
  updateOpeningButton();
}

// The film slate is the everyday picture for "the movie", so it reads without a word; drawn like the sound icons
// (ppGlyph in audio.js: one colour, play mark and stripes cut out, slashed when off). The button still carries its
// name (aria-label + title)
function updateOpeningButton() {
  const btn = typeof document !== 'undefined' && document.getElementById('btn-opening-toggle');
  if (!btn) return;
  const on = openingPrefOn();
  const en = typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'en';
  const label = en
    ? on
      ? 'Intro video on (tap to turn off)'
      : 'Intro video off (tap to watch it)'
    : on
    ? '오프닝 영상 켜짐 (누르면 끄기)'
    : '오프닝 영상 꺼짐 (누르면 바로 보기)';
  btn.innerHTML = ppGlyph(['slate'], !on);
  btn.setAttribute('aria-label', label);
  btn.title = label;
  btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  btn.classList.toggle('is-off', !on);
}

if (typeof window !== 'undefined') {
  // Hard reload (Ctrl+Shift+R, Cmd+Shift+R, Safari's Cmd+Option+R): forget that it was seen
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.code !== 'KeyR' || !(e.ctrlKey || e.metaKey) || !(e.shiftKey || (e.metaKey && e.altKey))) return;
      try {
        localStorage.removeItem(OPENING_STORE);
      } catch (err) {}
    },
    true
  );
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-opening-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpeningPref(!openingPrefOn());
    });
    document.querySelectorAll('.lang-btn').forEach((b) => b.addEventListener('click', () => setTimeout(updateOpeningButton, 0)));
    updateOpeningButton();
  });
  window.addEventListener('keydown', (e) => {
    if (!OPENING.active || !openingActive()) return;
    if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      skipOpening();
    }
  });
}
