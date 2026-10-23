// ============================================================================
// ICEBREAKER RESCUE (쇄빙선) — top-down run through Antarctic pack ice with one button: hold to charge, let go to ram
//
// Rules follow how a real icebreaker gets through ice too thick to cut continuously (NASA ICESCAPE blog on USCGC
// Healy, 2010-07-26): it backs off a ship length or two to build momentum and rams, and in ridges gets only
// 30-40 yards per ram; ram studies (MDPI J. Mar. Sci. Eng. 11(10) 2022) find that the bow gets further and the
// contact load grows with ramming speed. So here:
//   - holding the button backs the ship off and fills the ram gauge; it peaks and falls back if held too long;
//   - a ram at least as strong as the ice breaks it; a weaker one only cracks it (the next ram needs less);
//   - a ram much stronger than needed breaks the ice but dents the hull (the contact load);
//   - an iceberg pack drifts in behind the ship, so every stalled ram costs lead; the pack catching the stern
//     or the hull giving out ends the run. Penguins stranded on a floe come aboard when it breaks;
//   - only a ram in the green zone is clean: one that breaks the ice but misses the green scrapes the hull,
//     one too weak to break it bounces off and scrapes it harder.
// Letting go just short of a floe (within RAM_REACH) rams it without stopping, so a good run never stalls.
// Tuned with a release-timing bot (scratch/boat_mode/sim_boat.js, 200 runs each): an exact player never sinks;
// a 67ms-accurate one lasts ~46-59 s, 100ms ~33 s, 150ms ~17 s (close to the car run).
// Units: 960x540 stage, px per 60fps frame. World y grows ahead of the ship; the bow sits at screen y BOW_Y.
// Nothing at the top level touches the DOM, so the rules can be simulated outside the browser.
// ============================================================================
const BOAT_CFG = {
  STAGE_W: 960,
  STAGE_H: 540,
  BOAT_X: 480,
  BOW_Y: 250, // screen y of the bow tip
  BOAT_LEN: 190, // bow to stern on screen
  BOAT_HALF_W: 58,
  CHANNEL_L: 150, // the pack ice shelves either side of the lead
  CHANNEL_R: 810,
  // Everything speeds up with time, not with floes broken: cruise speed, the freeze line, the ram gauge and the
  // ice thickness. First ramp ~50-60 s, then a slower overdrive that keeps going.
  CRUISE: 5.4,
  CRUISE_KNEE: 8.4,
  MAX_CRUISE: 12.4,
  CRUISE_ACCEL: 0.08, // per frame towards the cruise speed
  CRUISE_RAMP: 0.001, // cruise speed gain per frame up to CRUISE_KNEE (~50 s)
  CRUISE_OVERDRIVE: 0.0004,
  SECONDS_PER_LEVEL: 6,
  LUNGE_SPEED: 16,
  RAM_REACH: 150, // letting go this close to a floe rams it without stopping
  BACK_OFF: 46, // how far a full charge backs the ship off (drawn; the lunge covers it again)
  CHARGE_MS: 900, // empty to full at LV.1
  MIN_CHARGE_MS: 560, // at LV.10
  PERFECT: 12, // power - ice in [0, PERFECT] = perfect ram (the green)
  SAFE: 22, // power - ice above this dents the hull
  HULL_MAX: 100,
  HULL_PER_EXCESS: 1.6,
  MISS_GREEN_HULL: 3, // broke the ice but outside the green
  WEAK_HULL: 6, // too weak: bounced off
  CRACK: 0.4, // a weak ram takes power * CRACK off the ice
  MIN_ICE: 12,
  BOUNCE: 34, // a weak ram pushes the ship back this far
  BOUNCE_FRAMES: 20,
  LEAD_START: 320, // freeze line distance behind the stern
  LEAD_MAX: 420,
  FREEZE: 1.8, // freeze line speed at the start
  FREEZE_RAMP: 0.035, // per second for the first 60 s (1.8 -> 3.9)
  FREEZE_KNEE_SEC: 60,
  FREEZE_OVERDRIVE: 0.012, // per second after that
  MAX_FREEZE: 6.2,
  PERFECT_LEAD: 70,
  PERFECT_BOOST: 3,
  GOOD_BOOST: 1.2,
  REPAIR: 25,
  MAX_LEVEL: 10,
  GAP_MIN: 170, // open water between floes
  GAP_MAX: 300,
  FIRST_GAP: 420,
  DISTANCE_SCORE: 0.05,
  BREAK_POINTS: 50,
  PERFECT_POINTS: 100, // x combo
  PENGUIN_POINTS: 150,
};

// Ice by level: [min, max] thickness in gauge units. Multi-year ice (>= 70) shows up from LV.3.
function boatIceRange(level) {
  const lo = Math.min(48, 20 + (level - 1) * 3);
  const hi = Math.min(94, 52 + (level - 1) * 6);
  return [lo, hi];
}

function boatLevelFor(seconds) {
  return Math.min(BOAT_CFG.MAX_LEVEL, 1 + Math.floor(seconds / BOAT_CFG.SECONDS_PER_LEVEL));
}

function boatFreezeSpeed(seconds) {
  const knee = BOAT_CFG.FREEZE_KNEE_SEC;
  const v = seconds <= knee ? BOAT_CFG.FREEZE + BOAT_CFG.FREEZE_RAMP * seconds : BOAT_CFG.FREEZE + BOAT_CFG.FREEZE_RAMP * knee + BOAT_CFG.FREEZE_OVERDRIVE * (seconds - knee);
  return Math.min(BOAT_CFG.MAX_FREEZE, v);
}

function boatChargeMs(level) {
  const t = (level - 1) / (BOAT_CFG.MAX_LEVEL - 1);
  return BOAT_CFG.CHARGE_MS + (BOAT_CFG.MIN_CHARGE_MS - BOAT_CFG.CHARGE_MS) * t;
}

// Gauge 0..100 after holding for ms: rises to 100, then falls back (ping-pong), so holding too long weakens the ram
function boatPowerAt(ms, level) {
  const period = boatChargeMs(level);
  const ph = (Math.max(0, ms) / period) % 2;
  return Math.round((ph <= 1 ? ph : 2 - ph) * 100);
}

function boatAddBand(run, rng) {
  const last = run.bands.length ? run.bands[run.bands.length - 1] : null;
  // Floes are laid ~1400px ahead: give them the level the ship will have when it gets there
  const ahead = last ? (last.y0 - run.y) / Math.max(1, run.cruise) / 60 : 0;
  const [lo, hi] = boatIceRange(boatLevelFor(run.frames / 60 + ahead));
  const T = Math.round(lo + rng() * (hi - lo));
  const gap = last ? BOAT_CFG.GAP_MIN + rng() * (BOAT_CFG.GAP_MAX - BOAT_CFG.GAP_MIN) : BOAT_CFG.FIRST_GAP;
  const y0 = (last ? last.y0 + last.h : 0) + gap;
  const h = Math.round(26 + T * 0.55);
  const penguins = [];
  const nP = rng() < 0.55 ? 1 + Math.floor(rng() * (T >= 60 ? 3 : 2)) : 0;
  for (let i = 0; i < nP; i++) {
    // On the floe ahead of the bow, spread so they do not overlap
    penguins.push({ x: BOAT_CFG.BOAT_X - 70 + i * 52 + rng() * 22, dy: 8 + rng() * Math.max(4, h - 30), hop: rng() * 1000 });
  }
  run.bands.push({
    id: run.nextId++,
    y0,
    h,
    T,
    T0: T,
    cracks: 0,
    broken: false,
    brokenAt: 0,
    penguins,
    crate: nP === 0 && rng() < 0.22,
    seed: Math.floor(rng() * 1e6),
  });
}

function createBoatRun(now = 0, rng = Math.random) {
  const run = {
    startAt: now,
    y: 0, // bow position in the world
    v: 0,
    cruise: BOAT_CFG.CRUISE,
    boost: 0,
    state: 'cruise', // 'cruise' | 'lunge' | 'bounce' | 'crash'
    bounceLeft: 0,
    charging: false,
    chargeStart: 0,
    power: 0, // live gauge while charging
    ramPower: 0,
    lead: BOAT_CFG.LEAD_START,
    hull: BOAT_CFG.HULL_MAX,
    level: 1,
    broken: 0,
    perfects: 0,
    combo: 0,
    rescued: 0,
    rams: 0,
    score: 0,
    distScore: 0,
    frames: 0,
    bands: [],
    nextId: 1,
    crashReason: null,
  };
  for (let i = 0; i < 6; i++) boatAddBand(run, rng);
  return run;
}

function boatNextBand(run) {
  return run.bands.find((b) => !b.broken) || null;
}

function boatPress(run, now) {
  if (run.state === 'crash' || run.charging) return;
  run.charging = true;
  run.chargeStart = now;
  run.power = 0;
}

// Returns true if the release launched a ram
function boatRelease(run, now) {
  if (!run.charging) return false;
  run.charging = false;
  const p = boatPowerAt(now - run.chargeStart, run.level);
  run.power = 0;
  const band = boatNextBand(run);
  if (run.state !== 'cruise' || !band || band.y0 - run.y > BOAT_CFG.RAM_REACH) {
    run.pendingWhiff = true;
    return false;
  }
  run.state = 'lunge';
  run.ramPower = p;
  run.rams++;
  return true;
}

function boatEndRun(run, reason, events) {
  if (run.state === 'crash') return;
  run.state = 'crash';
  run.charging = false;
  run.crashReason = reason;
  events.push({ type: 'crash', reason });
}

function boatImpact(run, band, now, events) {
  const p = run.ramPower;
  if (p >= band.T) {
    const excess = p - band.T;
    band.broken = true;
    band.brokenAt = now;
    run.broken++;
    let points = BOAT_CFG.BREAK_POINTS;
    const perfect = excess <= BOAT_CFG.PERFECT;
    if (perfect) {
      run.combo++;
      run.perfects++;
      points += BOAT_CFG.PERFECT_POINTS * Math.min(5, run.combo);
      run.boost = BOAT_CFG.PERFECT_BOOST;
      run.lead = Math.min(BOAT_CFG.LEAD_MAX, run.lead + BOAT_CFG.PERFECT_LEAD);
    } else {
      run.combo = 0;
      run.boost = BOAT_CFG.GOOD_BOOST;
    }
    let dent = 0;
    if (!perfect) dent += BOAT_CFG.MISS_GREEN_HULL;
    if (excess > BOAT_CFG.SAFE) dent += Math.round((excess - BOAT_CFG.SAFE) * BOAT_CFG.HULL_PER_EXCESS);
    run.hull = Math.max(0, run.hull - dent);
    const saved = band.penguins.length;
    run.rescued += saved;
    points += saved * BOAT_CFG.PENGUIN_POINTS;
    if (band.crate) run.hull = Math.min(BOAT_CFG.HULL_MAX, run.hull + BOAT_CFG.REPAIR);
    run.score += points;
    events.push({ type: 'break', band, perfect, excess, dent, saved, crate: band.crate, points, combo: run.combo });
    run.state = 'cruise';
    run.v = Math.max(run.v, run.cruise + run.boost);
    if (run.hull <= 0) boatEndRun(run, 'hull', events);
  } else {
    band.T = Math.max(BOAT_CFG.MIN_ICE, Math.round(band.T - p * BOAT_CFG.CRACK));
    band.cracks++;
    run.combo = 0;
    run.state = 'bounce';
    run.bounceLeft = BOAT_CFG.BOUNCE_FRAMES;
    run.v = 0;
    run.hull = Math.max(0, run.hull - BOAT_CFG.WEAK_HULL);
    events.push({ type: 'stuck', band, power: p, left: band.T, dent: BOAT_CFG.WEAK_HULL });
    if (run.hull <= 0) boatEndRun(run, 'hull', events);
  }
}

function boatStep(run, dt, now, rng = Math.random) {
  const events = [];
  if (run.state === 'crash') return events;
  if (run.pendingWhiff) {
    run.pendingWhiff = false;
    events.push({ type: 'whiff' });
  }
  run.frames += dt;
  const sec = run.frames / 60;
  const ramp = run.cruise < BOAT_CFG.CRUISE_KNEE ? BOAT_CFG.CRUISE_RAMP : BOAT_CFG.CRUISE_OVERDRIVE;
  run.cruise = Math.min(BOAT_CFG.MAX_CRUISE, run.cruise + ramp * dt);
  const level = boatLevelFor(sec);
  if (level > run.level) {
    run.level = level;
    events.push({ type: 'level', level });
  }
  run.boost = Math.max(0, run.boost - 0.04 * dt);
  if (run.charging) run.power = boatPowerAt(now - run.chargeStart, run.level);

  const band = boatNextBand(run);
  const y0 = run.y;
  if (run.state === 'cruise') {
    const target = run.cruise + run.boost;
    run.v += Math.sign(target - run.v) * Math.min(Math.abs(target - run.v), BOAT_CFG.CRUISE_ACCEL * dt * 3);
    run.y += run.v * dt;
    if (band && run.y >= band.y0) {
      run.y = band.y0; // bow against the floe: stalled until a ram gets through
      run.v = 0;
      if (!run.stalled) events.push({ type: 'contact', band });
      run.stalled = true;
    } else {
      run.stalled = false;
    }
  } else if (run.state === 'lunge') {
    run.v = BOAT_CFG.LUNGE_SPEED;
    run.y += run.v * dt;
    if (band && run.y >= band.y0) {
      run.y = band.y0;
      run.stalled = false;
      boatImpact(run, band, now, events);
    } else if (!band) {
      run.state = 'cruise';
    }
  } else if (run.state === 'bounce') {
    const step = (BOAT_CFG.BOUNCE / BOAT_CFG.BOUNCE_FRAMES) * Math.min(dt, run.bounceLeft);
    run.y -= step;
    run.bounceLeft -= dt;
    run.v = 0;
    if (run.bounceLeft <= 0) run.state = 'cruise';
  }

  // The freeze line follows at its own speed; only forward progress outruns it
  const freeze = boatFreezeSpeed(sec);
  run.lead = Math.min(BOAT_CFG.LEAD_MAX, run.lead + (run.y - y0) - freeze * dt);
  if (run.lead <= 0) {
    run.lead = 0;
    boatEndRun(run, 'freeze', events);
  }

  const dist = Math.floor(Math.max(0, run.y) * BOAT_CFG.DISTANCE_SCORE);
  if (dist > run.distScore) {
    run.score += dist - run.distScore;
    run.distScore = dist;
  }

  // Keep the sea ahead stocked; drop floes far behind
  while (run.bands.length < 4 || run.bands[run.bands.length - 1].y0 - run.y < 1400) boatAddBand(run, rng);
  while (run.bands.length && run.bands[0].broken && run.bands[0].y0 + run.bands[0].h < run.y - 900) run.bands.shift();
  return events;
}

// ============================================================================
// DRAWING — top-down sea, floes, the icebreaker (Araon-style red hull, open foredeck so the pilot shows)
// ============================================================================
const BOAT_K = '#0b1020';
const BOAT_RED = '#d7263d';
const BOAT_RED_DARK = '#9f1239';

function boatHash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Screen y of a world y (the bow is at BOW_Y)
function boatScreenY(run, wy, backOff = 0) {
  return BOAT_CFG.BOW_Y - (wy - run.y) + backOff;
}

function drawBoatSea(ctx, now, run) {
  const g = ctx.createLinearGradient(0, 0, 0, 540);
  g.addColorStop(0, '#0f5b80');
  g.addColorStop(0.55, '#0c4566');
  g.addColorStop(1, '#09324c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 960, 540);
  // Wave crests: short light arcs that scroll with the world and sway
  // (two batched paths, one per shade, instead of a stroke per crest)
  ctx.save();
  ctx.lineWidth = 2;
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    for (let i = 0; i < 40; i++) {
      if ((i % 3 === 0) !== (pass === 1)) continue;
      const wx = 150 + boatHash(i) * 660 + Math.sin(now * 0.0015 + i) * 5;
      const wy = ((i * 97 + run.y) % 620) - 40;
      const w = 12 + boatHash(i + 50) * 22;
      const a0 = Math.PI * 1.08;
      ctx.moveTo(wx + Math.cos(a0) * w, wy + Math.sin(a0) * w * 0.28);
      ctx.ellipse(wx, wy, w, w * 0.28, 0, a0, Math.PI * 1.92);
    }
    ctx.strokeStyle = pass ? 'rgba(224, 242, 254, 0.32)' : 'rgba(186, 230, 253, 0.2)';
    ctx.stroke();
  }
  ctx.restore();
  // Sun glints twinkling on the water
  for (let i = 0; i < 16; i++) {
    if (Math.floor(now / 260 + i * 3.7) % 4) continue;
    const sx = 170 + boatHash(i + 300) * 620;
    const sy = ((i * 151 + run.y * 0.98) % 600) - 30;
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(Math.round(sx), Math.round(sy), 3, 3);
    ctx.fillRect(Math.round(sx) - 2, Math.round(sy) + 1, 7, 1);
  }
  // Brash ice: small chunks drifting in the lead (below the floes, scrolling with the world)
  for (let i = 0; i < 12; i++) {
    const bx = 175 + boatHash(i + 900) * 610 + Math.sin(now * 0.001 + i * 2) * 6;
    const by = ((i * 173 + run.y) % 660) - 60;
    const s = 6 + Math.round(boatHash(i + 950) * 8);
    ctx.fillStyle = 'rgba(4, 20, 34, 0.3)';
    ctx.fillRect(Math.round(bx - s / 2) + 2, Math.round(by) + 3, s, Math.round(s * 0.7));
    ctx.fillStyle = '#a5d8f0';
    ctx.fillRect(Math.round(bx - s / 2), Math.round(by) + 2, s, Math.round(s * 0.7));
    ctx.fillStyle = '#eef8fd';
    ctx.fillRect(Math.round(bx - s / 2), Math.round(by), s, Math.round(s * 0.5));
  }
}

// Pack ice shelves on both sides of the lead, scrolling with the ship: snow on top, a blue shade along the water
// edge, foam lapping at it
function drawBoatShelves(ctx, run) {
  const L = BOAT_CFG.CHANNEL_L;
  const R = BOAT_CFG.CHANNEL_R;
  const seg = 60;
  const base = Math.floor(run.y / seg);
  const now = performance.now();
  for (const side of [0, 1]) {
    const pts = [];
    for (let k = -2; k < 13; k++) {
      const wy = (base + 11 - k) * seg;
      const sy = boatScreenY(run, wy);
      const jag = (boatHash((base + 11 - k) * 2 + side * 7) - 0.5) * 30;
      pts.push([side ? R + jag : L + jag, sy]);
    }
    const shelf = () => {
      ctx.beginPath();
      ctx.moveTo(side ? 960 : 0, -20);
      pts.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(side ? 960 : 0, 560);
      ctx.closePath();
    };
    // Shadow on the water under the shelf edge
    ctx.save();
    ctx.translate(side ? -6 : 6, 6);
    shelf();
    ctx.fillStyle = 'rgba(4, 20, 34, 0.35)';
    ctx.fill();
    ctx.restore();
    // Blue shade along the water edge: the shelf in shade colour, then its snow top stepped back from the edge
    // (two fills; a clipped wide stroke cost about as much as the rest of the scene on a phone)
    shelf();
    ctx.fillStyle = '#9fcfe8';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(side ? 960 : 0, -20);
    pts.forEach(([x, y]) => ctx.lineTo(x + (side ? 16 : -16), y));
    ctx.lineTo(side ? 960 : 0, 560);
    ctx.closePath();
    ctx.fillStyle = '#eef7fc';
    ctx.fill();
    // Snow drifts on the shelf top
    ctx.fillStyle = '#ffffff';
    for (let k = -1; k < 12; k += 2) {
      const n = base + 11 - k;
      const sy = boatScreenY(run, n * seg);
      const sx = side ? 870 + boatHash(n + 11) * 60 : 24 + boatHash(n + 5) * 60;
      ctx.fillRect(Math.round(sx), Math.round(sy + 18), 44, 5);
      ctx.fillRect(Math.round(sx) + 6, Math.round(sy + 14), 30, 4);
    }
    // Edge line and foam lapping just off it
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = '#5f9fc0';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Foam: short white dashes along the edge, drifting
    ctx.fillStyle = 'rgba(240, 249, 255, 0.75)';
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const q = (now * 0.0006 + i * 0.37) % 1;
      ctx.fillRect(Math.round(x0 + (x1 - x0) * q + (side ? -9 : 5)), Math.round(y0 + (y1 - y0) * q), 4, 12);
    }
  }
  // Pressure ridges on the shelves: little raised blocks with a lit top and a shaded side
  for (let k = -1; k < 12; k++) {
    const n = base + 11 - k;
    const sy = boatScreenY(run, n * seg) + 36;
    const lx = Math.round(26 + boatHash(n) * 70);
    const rx = Math.round(846 + boatHash(n + 3) * 70);
    for (const [x, y] of [[lx, sy], [rx, sy + 18]]) {
      ctx.fillStyle = '#b7d8ea';
      ctx.fillRect(x, Math.round(y) + 4, 30, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 2, Math.round(y), 26, 5);
    }
  }
}

function boatIceColors(T) {
  if (T >= 70) return { top: '#f8fcff', top2: '#dcefff', side: '#7fb2e5', dark: '#4f7fb8', line: '#3b82f6' }; // multi-year
  if (T >= 45) return { top: '#eef8fd', top2: '#d3ecf8', side: '#94cdea', dark: '#5f9fc4', line: '#60a5fa' };
  return { top: '#d4f0fa', top2: '#bfe6f5', side: '#86cde6', dark: '#4f9fbf', line: '#38bdf8' }; // young ice
}

// Rescued-to-be penguins use the same 2D penguins as the opening and the town (species sheets), on their floe
const BOAT_FLOE_SPECIES = ['05', '22', '04', '09', '10', '06', '15', '02'];
function boatPenguinSpecies(seed, i) {
  return BOAT_FLOE_SPECIES[Math.floor(boatHash(seed * 0.37 + i * 17.3) * BOAT_FLOE_SPECIES.length)];
}

// A stranded penguin standing on the ice, feet at (x, feet). alert = the ship is close: it jumps up and down
// waving for it instead of just standing there blinking
function drawBoatPenguinOnIce(ctx, x, feet, now, hop, sp = '05', size = 46, alert = false) {
  const sheet = typeof getHero2DSheetForSpecies === 'function' ? getHero2DSheetForSpecies(sp) : null;
  const phase = (now + hop) / (alert ? 260 : 900);
  const q = phase % 1;
  const lift = alert ? Math.sin(q * Math.PI) * 10 : 0;
  const sy = alert ? (q < 0.12 || q > 0.88 ? 0.86 : 1.06) : 1 + Math.sin(phase * Math.PI * 2) * 0.015;
  const flip = alert ? Math.floor(phase) % 2 === 0 : Math.floor(phase / 3) % 2 === 0;
  const frame = alert ? 6 : Math.floor(phase * 2) % 7 === 0 ? 1 : 0;
  // Shadow on the ice, smaller while it is in the air
  ctx.fillStyle = 'rgba(30, 64, 104, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x, feet - 1, size * 0.3 * (1 - lift / 40), 4, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!sheet) return;
  const sprite = boatPenguinSprite(sheet, sp, frame, size);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(feet - lift));
  ctx.scale(flip ? -(2 - sy) : 2 - sy, sy);
  ctx.imageSmoothingEnabled = true;
  if (sprite) ctx.drawImage(sprite, -size / 2, -size + 2, size, size);
  else ctx.drawImage(sheet, frame * 256, 0, 256, 256, -size / 2, -size + 2, size, size);
  ctx.restore();
}

// Penguin frames shrunk once per size (2x for the HiDPI stage): scaling a 256px frame every draw was the floes'
// biggest cost on phones
const BOAT_SPRITE_CACHE = new Map();
function boatPenguinSprite(sheet, sp, frame, size) {
  const ready = sheet.naturalWidth ? sheet.complete : sheet.width > 0;
  if (!ready || typeof document === 'undefined') return null;
  const px = Math.max(8, Math.round(size / 4) * 4);
  const key = `${sp}|${frame}|${px}`;
  let c = BOAT_SPRITE_CACHE.get(key);
  if (!c) {
    if (BOAT_SPRITE_CACHE.size > 400) BOAT_SPRITE_CACHE.clear();
    c = document.createElement('canvas');
    c.width = px * 2;
    c.height = px * 2;
    const cc = c.getContext('2d');
    cc.imageSmoothingEnabled = true;
    cc.imageSmoothingQuality = 'high';
    cc.drawImage(sheet, frame * 256, 0, 256, 256, 0, 0, px * 2, px * 2);
    BOAT_SPRITE_CACHE.set(key, c);
  }
  return c;
}

function drawBoatCrate(ctx, x, y) {
  const px = Math.round(x);
  const py = Math.round(y);
  ctx.fillStyle = 'rgba(30, 64, 104, 0.3)';
  ctx.fillRect(px - 12, py + 9, 28, 6);
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(px - 14, py - 13, 28, 24);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(px - 12, py - 11, 24, 20);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(px - 12, py - 11, 24, 12);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px - 2, py - 8, 4, 14);
  ctx.fillRect(px - 7, py - 3, 14, 4);
}

// One ice slab, top-down with a little depth: shadow on the water, the near face (taller for thicker ice), the top
// with a lit far rim; edges are ragged. splitL / splitR = that side is a fresh break (jagged, no rim).
function boatSlabPoints(x0, x1, yFar, yNear, seed, splitL, splitR) {
  const far = [];
  const near = [];
  const step = 36;
  for (let x = x0; x <= x1 + 0.1; x += step) {
    const xx = Math.min(x, x1);
    far.push([xx, yFar + (boatHash(seed + xx * 0.13) - 0.5) * 6]);
    near.push([xx, yNear + (boatHash(seed + 51 + xx * 0.17) - 0.5) * 6]);
  }
  if (far[far.length - 1][0] < x1) {
    far.push([x1, yFar]);
    near.push([x1, yNear]);
  }
  const side = (x, split, s) => {
    const out = [];
    if (!split) return out;
    for (let k = 1; k < 4; k++) out.push([x + (boatHash(seed + s + k * 7) - 0.5) * 16, yFar + ((yNear - yFar) * k) / 4]);
    return out;
  };
  return { far, near, right: side(x1, splitR, 3), left: side(x0, splitL, 9).reverse() };
}

function drawBoatSlab(ctx, x0, x1, yFar, yNear, face, c, seed, splitL = false, splitR = false) {
  const P = boatSlabPoints(x0, x1, yFar, yNear, seed, splitL, splitR);
  const outline = (dy = 0) => {
    ctx.beginPath();
    P.far.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy)));
    P.right.forEach(([x, y]) => ctx.lineTo(x, y + dy));
    for (let i = P.near.length - 1; i >= 0; i--) ctx.lineTo(P.near[i][0], P.near[i][1] + dy);
    P.left.forEach(([x, y]) => ctx.lineTo(x, y + dy));
    ctx.closePath();
  };
  // Shadow on the water
  ctx.save();
  ctx.translate(5, face + 5);
  outline();
  ctx.fillStyle = 'rgba(4, 20, 34, 0.38)';
  ctx.fill();
  ctx.restore();
  // Near face: the strip between the near edge and the same edge `face` px lower
  ctx.beginPath();
  P.near.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  for (let i = P.near.length - 1; i >= 0; i--) ctx.lineTo(P.near[i][0], P.near[i][1] + face);
  ctx.closePath();
  ctx.fillStyle = c.side;
  ctx.fill();
  ctx.beginPath();
  P.near.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + face - 3) : ctx.moveTo(x, y + face - 3)));
  for (let i = P.near.length - 1; i >= 0; i--) ctx.lineTo(P.near[i][0], P.near[i][1] + face);
  ctx.closePath();
  ctx.fillStyle = c.dark;
  ctx.fill();
  // Top, lighter towards the far edge (where the light comes from)
  outline();
  const g = ctx.createLinearGradient(0, yFar, 0, yNear);
  g.addColorStop(0, c.top);
  g.addColorStop(1, c.top2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = BOAT_K;
  ctx.lineWidth = 2;
  ctx.stroke();
  // Lit far rim
  ctx.beginPath();
  P.far.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + 2) : ctx.moveTo(x, y + 2)));
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Bottom edge of the face
  ctx.beginPath();
  P.near.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + face) : ctx.moveTo(x, y + face)));
  ctx.strokeStyle = BOAT_K;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// The floe's unchanging look: slab, melt patches, hairline cracks, snow drifts, pressure ridges (thickness cue)
function drawBoatFloeArt(ctx, band, L, R, yFar, yNear, face, c) {
  drawBoatSlab(ctx, L, R, yFar, yNear, face, c, band.seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(L, yFar, R - L, band.h);
  ctx.clip();
  // Snow drifts on the floe
  for (let s = 0; s < 5; s++) {
    const sx = L + 40 + boatHash(band.seed + s * 11) * (R - L - 80);
    const sy = yFar + 6 + boatHash(band.seed + s * 5) * (band.h - 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 22 + boatHash(band.seed + s) * 20, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
    // Faint melt patches and hairline cracks so the top is not a flat colour
    for (let s = 0; s < 3; s++) {
      ctx.fillStyle = 'rgba(125, 183, 220, 0.16)';
      ctx.beginPath();
      ctx.ellipse(L + 80 + boatHash(band.seed + s * 23) * (R - L - 160), yFar + band.h * (0.3 + boatHash(band.seed + s * 29) * 0.4), 50 + boatHash(band.seed + s) * 40, band.h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(95, 159, 196, 0.45)';
    ctx.lineWidth = 1.5;
    for (let s = 0; s < 4; s++) {
      let cx = L + 60 + boatHash(band.seed + s * 41) * (R - L - 120);
      let cy = yFar + 4 + boatHash(band.seed + s * 43) * (band.h - 8);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let k = 0; k < 4; k++) {
        cx += 10 + boatHash(band.seed + s * 7 + k) * 16;
        cy += (boatHash(band.seed + s * 3 + k * 5) - 0.5) * 10;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
    // Pressure ridges show how thick it is: 1 for young ice, up to 4 for multi-year. Each is a line of rubble
    // blocks pushed up out of the floe (white top, blue shade under)
    const ridges = band.T0 >= 70 ? 4 : band.T0 >= 45 ? 2 : 1;
    for (let r = 0; r < ridges; r++) {
      const ry = yFar + ((r + 1) * band.h) / (ridges + 1);
      for (let s = 0; s < 9; s++) {
        const sx = L + 20 + s * 76 + boatHash(band.seed + s + r * 13) * 30;
        const len = 26 + boatHash(band.seed + s * 3 + r) * 20;
        for (let x = sx, k = 0; x < sx + len; k++) {
          const h0 = boatHash(band.seed + s * 17 + r * 5 + k * 3);
          const w = Math.round(7 + h0 * 6);
          const h = Math.round(5 + boatHash(band.seed + k * 11 + s) * 4);
          const y = Math.round(ry - h / 2 + (h0 - 0.5) * 3);
          ctx.fillStyle = c.line;
          ctx.fillRect(Math.round(x) + 1, y + 2, w, h);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(Math.round(x), y, w, h - 1);
          x += w - 1;
        }
      }
    }
  ctx.restore();
}

function drawBoatBand(ctx, run, band, now) {
  const L = BOAT_CFG.CHANNEL_L - 20;
  const R = BOAT_CFG.CHANNEL_R + 20;
  const X = BOAT_CFG.BOAT_X;
  const yNear = boatScreenY(run, band.y0);
  const yFar = yNear - band.h;
  if (yNear < -40 || yFar > 580) return;
  const c = boatIceColors(band.T0);
  // Thicker ice shows a taller face (and more ridges): the strength reads at a glance
  const face = 6 + Math.round(Math.min(90, band.T0) * 0.1);
  if (!band.broken) {
    // The floe itself never changes until it breaks: drawn once into its own 2x canvas, then blitted
    if (!band.art && typeof document !== 'undefined') {
      const pad = 12;
      const w = R - L + pad * 2;
      const hh = band.h + face + pad * 2;
      const cv = document.createElement('canvas');
      cv.width = w * 2;
      cv.height = hh * 2;
      const cc = cv.getContext('2d');
      cc.scale(2, 2);
      cc.translate(pad - L, pad + band.h);
      drawBoatFloeArt(cc, band, L, R, -band.h, 0, face, c);
      band.art = { cv, x: L - pad, dy: -band.h - pad, w, h: hh };
    }
    if (band.art) ctx.drawImage(band.art.cv, band.art.x, yNear + band.art.dy, band.art.w, band.art.h);
    else drawBoatFloeArt(ctx, band, L, R, yFar, yNear, face, c);
    // Cracks from weak rams, spreading from the bow: dark split with a light edge
    if (band.cracks) {
      for (let k = 0; k < band.cracks * 3; k++) {
        const a = -Math.PI / 2 + (boatHash(band.seed + k * 7) - 0.5) * 2.4;
        const len = 14 + boatHash(band.seed + k) * (band.h * 0.9);
        const pts = [
          [X, yNear],
          [X + Math.cos(a) * len * 0.5 + (boatHash(k + band.seed) - 0.5) * 8, yNear + Math.sin(a) * len * 0.5 + 3],
          [X + Math.cos(a) * len, yNear + Math.sin(a) * len],
        ];
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.strokeStyle = BOAT_K;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    // Penguins: wave and jump once the ship is close
    const alert = yNear > BOAT_CFG.BOW_Y - 230;
    band.penguins.forEach((pg, i) =>
      drawBoatPenguinOnIce(ctx, pg.x, yNear - pg.dy, now, pg.hop, boatPenguinSpecies(band.seed, i), 58, alert)
    );
    if (alert && band.penguins.length && typeof drawScene0Mark === 'function') {
      const pg = band.penguins[0];
      const beat = Math.floor(now / 300) % 2;
      drawScene0Mark(ctx, pg.x + 22, yNear - pg.dy - 70 - (beat ? 4 : 0), '!', '#fde047');
    }
    if (band.crate) drawBoatCrate(ctx, X, yNear - band.h / 2);
  } else {
    band.art = null;
    // Broken: the floe split along the channel, the halves drifting apart, shards tumbling, foam in the gap
    const t = Math.min(1, (now - band.brokenAt) / 700);
    const open = 70 + t * 20;
    drawBoatSlab(ctx, L, X - open, yFar, yNear, face, c, band.seed, false, true);
    drawBoatSlab(ctx, X + open, R, yFar, yNear, face, c, band.seed + 77, true, false);
    ctx.save();
    ctx.globalAlpha = 1 - t * 0.6;
    ctx.strokeStyle = '#f0f9ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(X, yNear - band.h / 2, open * 0.8, band.h * 0.7, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    for (let s = 0; s < 7; s++) {
      const side = s % 2 ? 1 : -1;
      const sx = X + side * (open - 14 - boatHash(band.seed + s) * 30);
      const sy = yFar + boatHash(band.seed + s * 5) * band.h;
      const sz = 8 + Math.round(boatHash(band.seed + s * 9) * 10);
      ctx.save();
      ctx.translate(Math.round(sx), Math.round(sy));
      ctx.rotate(side * t * (0.6 + boatHash(band.seed + s) * 0.8));
      ctx.fillStyle = 'rgba(4, 20, 34, 0.35)';
      ctx.fillRect(-sz / 2 + 3, -sz / 2 + 4, sz, sz);
      ctx.fillStyle = BOAT_K;
      ctx.fillRect(-sz / 2 - 1, -sz / 2 - 1, sz + 2, sz + 2);
      ctx.fillStyle = c.side;
      ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
      ctx.fillStyle = c.top;
      ctx.fillRect(-sz / 2, -sz / 2, sz, sz - 3);
      ctx.restore();
    }
  }
}

// Top-down icebreaker. Origin = bow tip; the hull runs down the screen. The pilot stands on the open foredeck,
// nothing drawn over the penguin.
function drawBoatTopDown(ctx, cx, bowY, now, opts = {}) {
  const { spId, isShocked = false, isImpactBlink = false, rescuedAboard = 0 } = opts;
  const L = BOAT_CFG.BOAT_LEN;
  const W = BOAT_CFG.BOAT_HALF_W;
  ctx.save();
  ctx.translate(cx, bowY);
  // Wake + shadow
  ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
  for (let i = 0; i < 5; i++) {
    const fy = L - 30 + ((now * 0.12 + i * 22) % 110);
    const spread = (fy - (L - 30)) * 0.35;
    ctx.fillRect(Math.round(-W - 6 - spread), Math.round(fy), 10, 3);
    ctx.fillRect(Math.round(W - 4 + spread), Math.round(fy), 10, 3);
  }
  ctx.fillStyle = 'rgba(4, 20, 34, 0.35)';
  ctx.beginPath();
  ctx.ellipse(6, L * 0.55 + 8, W + 6, L * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  const hull = () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(W * 0.9, 30, W, 80);
    ctx.lineTo(W, L - 18);
    ctx.quadraticCurveTo(W, L, W - 18, L);
    ctx.lineTo(-W + 18, L);
    ctx.quadraticCurveTo(-W, L, -W, L - 18);
    ctx.lineTo(-W, 80);
    ctx.quadraticCurveTo(-W * 0.9, 30, 0, 0);
    ctx.closePath();
  };
  // Red hull with a darker sheer strake
  hull();
  ctx.fillStyle = BOAT_RED;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = BOAT_K;
  ctx.stroke();
  // Deck (inset)
  ctx.save();
  ctx.translate(0, 12);
  ctx.scale(0.8, 0.9);
  hull();
  ctx.restore();
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();
  ctx.strokeStyle = BOAT_RED_DARK;
  ctx.lineWidth = 2;
  ctx.stroke();
  // Deck planks
  ctx.fillStyle = '#cbd5e1';
  for (let i = 0; i < 7; i++) ctx.fillRect(-W * 0.62, 70 + i * 16, W * 1.24, 2);
  // Ice knife / bow reinforcement
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-3, 6, 6, 26);
  // Superstructure aft: white block with bridge windows and the yellow mast
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(-W * 0.68 - 2, L - 102, W * 1.36 + 4, 66);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-W * 0.68, L - 100, W * 1.36, 62);
  ctx.fillStyle = '#1e3a5f';
  for (let i = 0; i < 5; i++) ctx.fillRect(-W * 0.6 + i * 15, L - 96, 10, 7);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-6, L - 80, 12, 26);
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(-10, L - 56, 20, 6);
  // Funnel
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(14, L - 74, 26, 22);
  ctx.fillStyle = BOAT_RED;
  ctx.fillRect(16, L - 72, 22, 18);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(16, L - 66, 22, 4);
  // Rescued penguins crowd the aft deck (up to 6 shown, the same 2D penguins as on the floes), bobbing
  for (let i = 0; i < Math.min(6, rescuedAboard); i++) {
    const bob = Math.floor((now + i * 137) / 240) % 2 ? 0 : -2;
    drawBoatPenguinOnIce(ctx, -40 + (i % 3) * 40 + (i >= 3 ? 20 : 0), L - 4 - (i >= 3 ? 14 : 0) + bob, now, i * 137, BOAT_FLOE_SPECIES[i % BOAT_FLOE_SPECIES.length], 30, false);
  }
  ctx.restore();

  // The NFT pilot stands on the open foredeck, full size, nothing over it
  ctx.save();
  ctx.translate(cx, bowY + 96);
  if (typeof drawCarPilot === 'function') {
    drawCarPilot(ctx, false, now, {
      spId,
      isShocked,
      isImpactBlink,
      rect: { x: -38, y: -70, size: 76 },
      clip: (c) => c.rect(-60, -90, 120, 102),
    });
  }
  ctx.restore();
}

// Side-view icebreaker for the picker, the departure, the pixel scan and the crash landing.
// Origin = foredeck under the pilot, facing right; waterline at y = +34, keel at +48.
const BOAT_SIDE_PILOT_RECT = { x: -40, y: -81, size: 79 };
// Pixel ship by the pixel car's rules (see drawPixelPlaneWithPilot): 2px grid, every part its own outlined block
// with a light top band and a dark bottom band; the hull follows the 2D hull outline on the grid.
// layer 'back' = superstructure, mast, funnel; 'front' = hull, portholes, rail (the pixel pilot goes between).
const PIXEL_BOAT_HULL_BOX = { x: -152, y: -16, w: 304, h: 66 };
const BOAT_RED_LIGHT = '#f05a6e';

function drawBoatPixelLayer(ctx, now, layer) {
  const K = BOAT_K;
  if (layer === 'back') {
    // Mast with a crossbar
    drawPixelBlock(ctx, -94, -116, 6, 34, '#facc15', null, null, K);
    drawPixelBlock(ctx, -104, -110, 26, 4, '#facc15', null, null, K);
    // Bridge and deckhouse: white with a light top and a grey shade band, navy windows with a glint
    drawPixelBlock(ctx, -120, -84, 60, 28, '#f8fafc', '#ffffff', '#cbd5e1', K);
    drawPixelBlock(ctx, -134, -58, 92, 58, '#f8fafc', '#ffffff', '#cbd5e1', K);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(-114 + i * 14, -78, 8, 10);
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(-114 + i * 14, -78, 4, 2);
    }
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(-126 + i * 16, -44, 10, 8);
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(-126 + i * 16, -44, 4, 2);
    }
    // Funnel: red with the white band
    drawPixelBlock(ctx, -60, -92, 24, 36, BOAT_RED, BOAT_RED_LIGHT, BOAT_RED_DARK, K);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-60, -80, 24, 6);
    return;
  }
  // Hull on the 2D hull's outline: red with a light top band, dark strake, white boot stripe, dark bottom
  if (typeof document !== 'undefined') {
    const hull = pixelGridMask('boat-hull', traceBoatSideHull, PIXEL_BOAT_HULL_BOX);
    fillPixelMask(ctx, hull, K);
    fillPixelMask(ctx, hull, BOAT_RED, { inset: 1 });
    fillPixelMask(ctx, hull, BOAT_RED_LIGHT, { inset: 1, y1: 4 });
    fillPixelMask(ctx, hull, BOAT_RED_DARK, { inset: 1, y0: 6, y1: 8 });
    fillPixelMask(ctx, hull, '#ffffff', { inset: 1, y0: 30, y1: 34 });
    fillPixelMask(ctx, hull, '#7f1d1d', { inset: 1, y0: 34 });
  }
  // Portholes (lit, outlined like the car's lamps) and the anchor
  for (let i = 0; i < 6; i++) {
    const px = -122 + i * 34;
    ctx.fillStyle = K;
    ctx.fillRect(px, 12, 12, 12);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(px + 2, 14, 8, 8);
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(px + 2, 14, 4, 2);
  }
  ctx.fillStyle = K;
  ctx.fillRect(112, 6, 8, 8);
  // Foredeck rail
  ctx.fillStyle = K;
  ctx.fillRect(-42, -14, 140, 6);
  for (let i = 0; i < 6; i++) ctx.fillRect(-38 + i * 26, -14, 7, 14);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-40, -12, 136, 2);
  for (let i = 0; i < 6; i++) ctx.fillRect(-36 + i * 26, -12, 3, 10);
}

function traceBoatSideHull(ctx) {
  ctx.beginPath();
  ctx.moveTo(-150, -2);
  ctx.lineTo(96, -2);
  ctx.lineTo(150, -14); // raked icebreaker bow
  ctx.quadraticCurveTo(138, 30, 104, 48);
  ctx.lineTo(-132, 48);
  ctx.quadraticCurveTo(-150, 40, -150, -2);
  ctx.closePath();
}

// layer: 'all', or 'back' (superstructure, funnel, smoke) / 'front' (hull, rail) for the pixel ship
function drawBoatSideBody(ctx, now, opts) {
  const { withPilot = true, spId, isShocked = false, isImpactBlink = false, smokeOn = true, pixelMode = false, layer = 'all' } = opts;
  const lw = pixelMode ? 0 : 3;
  if (layer !== 'front') {
  // Superstructure aft (left), kept behind and below the pilot's head line
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-134, -58, 92, 58);
  ctx.fillRect(-120, -84, 60, 28);
  ctx.fillStyle = '#1e3a5f';
  for (let i = 0; i < 4; i++) ctx.fillRect(-114 + i * 14, -78, 9, 10);
  for (let i = 0; i < 5; i++) ctx.fillRect(-126 + i * 16, -44, 10, 9);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-94, -116, 6, 34);
  ctx.fillRect(-104, -110, 26, 4);
  // Funnel
  ctx.fillStyle = BOAT_RED;
  ctx.fillRect(-60, -92, 24, 36);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-60, -80, 24, 6);
  if (lw) {
    ctx.strokeStyle = BOAT_K;
    ctx.lineWidth = lw;
    ctx.strokeRect(-134, -58, 92, 58);
    ctx.strokeRect(-120, -84, 60, 28);
    ctx.strokeRect(-60, -92, 24, 36);
  }
  if (smokeOn) {
    for (let s = 0; s < 4; s++) {
      const tp = ((now * 0.0008 + s * 0.25) % 1);
      const r = 6 + tp * 12;
      ctx.fillStyle = `rgba(226, 232, 240, ${0.8 - tp * 0.7})`;
      ctx.beginPath();
      ctx.arc(-48 - tp * 60, -100 - tp * 50, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  }
  if (layer === 'back') return;
  // Pilot on the open foredeck: the hull's bulwark (y = -2) hides the waist
  if (withPilot && layer === 'all' && typeof drawCarPilot === 'function') {
    drawCarPilot(ctx, pixelMode, now, { spId, isShocked, isImpactBlink, rect: BOAT_SIDE_PILOT_RECT, clip: (c) => c.rect(-70, -140, 150, 140) });
  }
  // Hull: red above the waterline, dark below, white boot stripe; ARAON-style lettering band
  traceBoatSideHull(ctx);
  ctx.fillStyle = BOAT_RED;
  ctx.fill();
  ctx.save();
  traceBoatSideHull(ctx);
  ctx.clip();
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(-160, 34, 320, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-160, 30, 320, 4);
  ctx.fillStyle = BOAT_RED_DARK;
  ctx.fillRect(-160, 6, 320, 3);
  ctx.restore();
  if (lw) {
    traceBoatSideHull(ctx);
    ctx.strokeStyle = BOAT_K;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
  // Portholes + anchor
  ctx.fillStyle = '#fde68a';
  for (let i = 0; i < 6; i++) ctx.fillRect(-120 + i * 34, 14, 8, 8);
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(112, 6, 8, 8);
  // Rail on the foredeck
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-40, -12, 136, 3);
  for (let i = 0; i < 6; i++) ctx.fillRect(-36 + i * 26, -12, 3, 10);
}

function drawBoatWithPilot(ctx, cx, cy, tiltRad = 0, now = 0, options = {}) {
  const { scale = 1, pixelMode = false, flipX = false } = options;
  ctx.save();
  ctx.translate(Math.round(cx), Math.round(cy));
  ctx.rotate(tiltRad);
  ctx.scale(flipX ? -scale : scale, scale);
  if (!pixelMode) {
    drawBoatSideBody(ctx, now, options);
  } else {
    // Pixel version by the pixel car's rules (drawBoatPixelLayer): superstructure, the pixel pilot, then the hull
    ctx.imageSmoothingEnabled = false;
    if (options.smokeOn) {
      // Blocky funnel smoke, on the same 2px grid
      for (let k = 0; k < 4; k++) {
        const tp = (now * 0.0008 + k * 0.25) % 1;
        const sz = Math.round((6 + tp * 8) / 2) * 2;
        ctx.fillStyle = `rgba(226, 232, 240, ${(0.85 - tp * 0.7).toFixed(2)})`;
        ctx.fillRect(Math.round((-52 - tp * 60) / 2) * 2, Math.round((-104 - tp * 50) / 2) * 2, sz, sz);
      }
    }
    drawBoatPixelLayer(ctx, now, 'back');
    if (options.withPilot !== false && typeof drawCarPilot === 'function') {
      drawCarPilot(ctx, true, now, { ...options, rect: BOAT_SIDE_PILOT_RECT, clip: (c) => c.rect(-70, -140, 150, 140) });
    }
    drawBoatPixelLayer(ctx, now, 'front');
  }
  ctx.restore();
}

// The iceberg pack drifting in behind the stern: always peeking in at the bottom, closer as the lead shrinks
function drawBoatFreeze(ctx, run, now) {
  const stern = BOAT_CFG.BOW_Y + BOAT_CFG.BOAT_LEN;
  const edge = stern + 6 + (run.lead / BOAT_CFG.LEAD_MAX) * 92;
  const danger = run.lead < 120;
  ctx.save();
  if (danger) ctx.translate(Math.round((Math.random() - 0.5) * 3), 0);
  // Cold mist rolling ahead of the pack
  const mist = ctx.createLinearGradient(0, edge - 60, 0, edge + 20);
  mist.addColorStop(0, 'rgba(224, 242, 254, 0)');
  mist.addColorStop(1, 'rgba(224, 242, 254, 0.65)');
  ctx.fillStyle = mist;
  ctx.fillRect(0, edge - 60, 960, 80);
  ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
  ctx.fillRect(0, edge + 20, 960, 560 - edge);
  // Bergs, back row then front row: lit left face, shaded right face, snow cap, foam where they meet the water,
  // bobbing and jostling
  for (let row = 0; row < 2; row++) {
    for (let k = 0; k < 13; k++) {
      const n = k + row * 31;
      const bx = -40 + k * 78 + (boatHash(n * 3) - 0.5) * 30 + row * 36;
      const bw = (70 + boatHash(n) * 46) * (row ? 1.1 : 0.9);
      const bh = (34 + boatHash(n + 7) * 40) * (row ? 1 : 0.8);
      const by = edge - bh * 0.55 + Math.sin(now * 0.003 + n * 1.3) * 3 + boatHash(n + 2) * 14 + row * 18;
      const peak = [bx + bw * (0.4 + boatHash(n + 4) * 0.25), by - bh * 0.35];
      const L0 = [bx, by + bh];
      const L1 = [bx + bw * 0.16, by + bh * 0.1];
      const R1 = [bx + bw * 0.86, by + bh * 0.02];
      const R0 = [bx + bw, by + bh];
      const mid = [peak[0] + bw * 0.04, by + bh];
      const poly = (pts, fill) => {
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      };
      // Shadow on the water, outline
      poly([[L0[0] + 6, L0[1] + 6], [R0[0] + 6, R0[1] + 6], [R0[0] - 10, R0[1] + 14], [L0[0] + 10, L0[1] + 14]], 'rgba(4, 20, 34, 0.3)');
      ctx.beginPath();
      [L0, L1, peak, R1, R0].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = BOAT_K;
      ctx.stroke();
      poly([L0, L1, peak, mid], row ? '#e6f4fc' : '#d6ebf7');
      poly([mid, peak, R1, R0], row ? '#8fbfe6' : '#7eaed8');
      // Snow cap and a crack line down the lit face
      poly([L1, peak, R1, [peak[0] + bw * 0.12, peak[1] + bh * 0.3], [peak[0] - bw * 0.1, peak[1] + bh * 0.34]], '#ffffff');
      ctx.strokeStyle = '#a9cde6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(peak[0] - bw * 0.12, peak[1] + bh * 0.5);
      ctx.lineTo(peak[0] - bw * 0.18, peak[1] + bh * 0.8);
      ctx.lineTo(peak[0] - bw * 0.14, by + bh);
      ctx.stroke();
      // Foam at the waterline
      ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
      const fw = Math.sin(now * 0.006 + n) * 3;
      ctx.fillRect(Math.round(L0[0] - 4 + fw), Math.round(L0[1] - 3), Math.round(bw + 8), 5);
    }
  }
  ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
  ctx.fillRect(0, edge + 46, 960, 560 - edge);
  ctx.restore();
}

// Ram gauge next to the ship, with the next floe's zone marked: green = perfect, yellow = breaks, red = dents
function drawBoatGauge(ctx, run, now) {
  const band = boatNextBand(run);
  const gx = 590;
  const gy = 268;
  const gh = 170;
  const gw = 20;
  ctx.save();
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(gx - 3, gy - 3, gw + 6, gh + 6);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(gx, gy, gw, gh);
  const yOf = (p) => gy + gh - (Math.max(0, Math.min(100, p)) / 100) * gh;
  if (band) {
    const T = band.T;
    ctx.fillStyle = 'rgba(251, 113, 133, 0.75)';
    ctx.fillRect(gx, yOf(100), gw, yOf(T + BOAT_CFG.SAFE) - yOf(100));
    ctx.fillStyle = 'rgba(250, 204, 21, 0.75)';
    ctx.fillRect(gx, yOf(T + BOAT_CFG.SAFE), gw, yOf(T + BOAT_CFG.PERFECT) - yOf(T + BOAT_CFG.SAFE));
    ctx.fillStyle = 'rgba(74, 222, 128, 0.9)';
    ctx.fillRect(gx, yOf(T + BOAT_CFG.PERFECT), gw, yOf(T) - yOf(T + BOAT_CFG.PERFECT));
  }
  if (run.charging) {
    const y = yOf(run.power);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(gx, y, gw, gy + gh - y);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gx - 8, Math.round(y) - 2, gw + 16, 4);
    ctx.fillStyle = BOAT_K;
    ctx.fillRect(gx + gw + 8, Math.round(y) - 5, 6, 10);
  }
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(gx, gy, gw, gh);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 11px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'ko' ? '충격' : i18n('RAM'), gx + gw / 2, gy + gh + 16);
  ctx.restore();
}

function drawBoatHud(ctx, now, run) {
  const ko = CURRENT_LANG === 'ko';
  ctx.save();
  const hx = 16;
  const hy = 12;
  const hw = 560;
  const hh = 34;
  ctx.fillStyle = 'rgba(9, 13, 26, 0.88)';
  ctx.fillRect(hx - 2, hy - 2, hw + 4, hh + 4);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(hx, hy, hw, hh);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
    ctx.fillStyle = '#fde047';
    ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.fillText(`NFT P${String(UFO_GAME.pilotTokenId).padStart(4, '0')}`, hx + 12, hy + hh / 2 + 1);
  } else {
    ctx.fillStyle = '#5eead4';
    ctx.font = '900 11.5px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.fillText(ko ? 'GUEST (기본)' : i18n('GUEST'), hx + 12, hy + hh / 2 + 1);
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.fillText(`SCORE ${run.score.toLocaleString()}`, hx + 100, hy + hh / 2 + 1);

  // Hull bar
  const bx = hx + 230;
  const bw = 130;
  const ratio = Math.max(0, run.hull / BOAT_CFG.HULL_MAX);
  const low = ratio < 0.3;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(bx, hy + 11, bw, 12);
  ctx.fillStyle = low && Math.floor(now / 200) % 2 === 0 ? '#fecdd3' : low ? '#fb7185' : '#f87171';
  ctx.fillRect(bx, hy + 11, Math.round(bw * ratio), 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(bx, hy + 11, Math.round(bw * ratio), 3);
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(bx, hy + 11, bw, 12);
  ctx.fillStyle = '#fecaca';
  ctx.font = '900 10px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(ko ? '선체' : i18n('HULL'), bx - 6, hy + hh / 2 + 1);

  ctx.textAlign = 'right';
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#bae6fd';
  ctx.fillText(`${ko ? '구조' : i18n('SAVED')} ${run.rescued} · LV.${run.level}`, hx + hw - 12, hy + hh / 2 + 1);
  ctx.restore();
}

// ============================================================================
// BOAT GAME STATE + SCENE 3 FRAME (sceneIdx === 2 with MOTION_STATE.vehicle === 'boat')
// ============================================================================
const BOAT_GAME = {
  run: null,
  lastTickAt: 0,
  particles: [],
  popups: [],
  jumpers: [], // rescued penguins leaping from their floe onto the deck
  shakeUntil: 0,
  hitFlashUntil: 0,
  lastFinalScore: 0,
  lastRank: null,
  lastBestScore: 0,
  lastIsNewBest: false,
  scoreSubmitted: false,
};

function resetBoatGame(now = performance.now()) {
  BOAT_GAME.run = createBoatRun(now);
  BOAT_GAME.lastTickAt = now;
  BOAT_GAME.particles = [];
  BOAT_GAME.popups = [];
  BOAT_GAME.jumpers = [];
  BOAT_GAME.shakeUntil = 0;
  BOAT_GAME.hitFlashUntil = 0;
  BOAT_GAME.scoreSubmitted = false;
}

function boatGameActive() {
  return MOTION_STATE.vehicle === 'boat' && MOTION_STATE.sceneIdx === 2 && Boolean(BOAT_GAME.run);
}

function boatRamPress(now = performance.now()) {
  if (!boatGameActive()) return;
  boatPress(BOAT_GAME.run, now);
}

function boatRamRelease(now = performance.now()) {
  if (!BOAT_GAME.run) return;
  boatRelease(BOAT_GAME.run, now);
}

function spawnBoatBurst(x, y, cols, count = 10, speed = 4, size = 6) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const sp = speed * (0.5 + Math.random() * 0.8);
    BOAT_GAME.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, col: cols[i % cols.length], sz: size - (i % 3), alpha: 1, decay: 0.03 });
  }
}

async function submitBoatScoreToServer(tokenId, score, rescued) {
  if (
    !UFO_GAME.hasNft ||
    tokenId === null ||
    tokenId === undefined ||
    !/^\d+$/.test(String(tokenId).trim()) ||
    BOAT_GAME.scoreSubmitted ||
    score <= 0
  ) {
    return;
  }
  BOAT_GAME.scoreSubmitted = true;
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'boat', tokenId: Number(String(tokenId).trim()), score, kills: rescued }),
    });
    if (res.ok) {
      const data = await res.json();
      BOAT_GAME.lastRank = data.rank || null;
      BOAT_GAME.lastBestScore = data.best_score || score;
      BOAT_GAME.lastIsNewBest = Boolean(data.is_new_best);
      if (Array.isArray(data.items) && RANKING_GAME === 'boat') {
        RANKING_PAGE_CACHE = data.items;
        renderRankingPageList();
      }
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

function triggerBoatCrash(now = performance.now()) {
  const run = BOAT_GAME.run;
  BOAT_GAME.shakeUntil = now + 520;
  BOAT_GAME.lastFinalScore = Math.max(1, run.score);
  BOAT_GAME.lastRank = null;
  BOAT_GAME.lastBestScore = 0;
  if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
    submitBoatScoreToServer(UFO_GAME.pilotTokenId, BOAT_GAME.lastFinalScore, run.rescued);
  }
  setIntroScene(3, true);
}

function drawBoatRunnerFrame(ctx, now, spId) {
  if (!BOAT_GAME.run) resetBoatGame(now);
  const run = BOAT_GAME.run;
  const dt = Math.min(32, Math.max(8, now - (BOAT_GAME.lastTickAt || now))) / 16.67;
  BOAT_GAME.lastTickAt = now;
  const ko = CURRENT_LANG === 'ko';
  const X = BOAT_CFG.BOAT_X;
  const bowY = BOAT_CFG.BOW_Y;

  const events = boatStep(run, dt, now, Math.random);
  let crashed = false;
  events.forEach((ev) => {
    playIntroSfx(ev.type, ev);
    if (ev.type === 'break') {
      const cols = ['#ffffff', '#bae6fd', '#7dd3fc'];
      spawnBoatBurst(X, bowY - 6, cols, ev.perfect ? 22 : 14, ev.perfect ? 6 : 4.5, 7);
      BOAT_GAME.shakeUntil = now + (ev.perfect ? 260 : 180);
      const label = ev.perfect ? (ko ? `PERFECT x${Math.min(5, ev.combo)}` : `PERFECT x${Math.min(5, ev.combo)}`) : ko ? '쾅!' : i18n('CRUNCH!');
      BOAT_GAME.popups.push({ x: X, y: bowY - 40, vy: -1.5, text: `${label} +${ev.points}`, col: ev.perfect ? '#4ade80' : '#fde047', alpha: 1 });
      if (ev.saved) {
        // Each one leaps from where it stood onto the aft deck
        const yNear = boatScreenY(run, ev.band.y0);
        ev.band.penguins.forEach((pg, i) =>
          BOAT_GAME.jumpers.push({ sp: boatPenguinSpecies(ev.band.seed, i), x: pg.x, y: yNear - pg.dy, t0: now + i * 90, slot: (run.rescued - ev.saved + i) % 6 })
        );
        BOAT_GAME.popups.push({ x: X + 130, y: bowY - 10, vy: -1.2, text: ko ? `펭귄 ${ev.saved}마리 구조!` : i18n('{0} saved!', ev.saved), col: '#fde68a', alpha: 1 });
      }
      if (ev.crate) BOAT_GAME.popups.push({ x: X - 130, y: bowY - 10, vy: -1.2, text: ko ? `선체 수리 +${BOAT_CFG.REPAIR}` : i18n('Repair +{0}', BOAT_CFG.REPAIR), col: '#fbbf24', alpha: 1 });
      if (ev.dent) {
        BOAT_GAME.hitFlashUntil = now + 520;
        BOAT_GAME.shakeUntil = now + 360;
        const tooHard = ev.excess > BOAT_CFG.SAFE;
        const label = tooHard ? (ko ? '너무 셌다!' : i18n('Too hard!')) : ko ? '초록 칸 놓침!' : i18n('Missed the green!');
        BOAT_GAME.popups.push({ x: X, y: bowY + 40, vy: -1.3, text: `${label} ${ko ? '선체' : i18n('Hull')} -${ev.dent}`, col: '#fb7185', alpha: 1 });
        spawnBoatBurst(X, bowY + 10, ['#fb7185', '#fecaca', '#ffffff'], 10, 3.4, 5);
      }
    } else if (ev.type === 'stuck') {
      BOAT_GAME.shakeUntil = now + 200;
      spawnBoatBurst(X, bowY - 4, ['#e0f2fe', '#ffffff'], 8, 3, 5);
      BOAT_GAME.hitFlashUntil = now + 520;
      BOAT_GAME.popups.push({ x: X, y: bowY - 40, vy: -1.3, text: ko ? `약했다! 튕겨남 선체 -${ev.dent}` : i18n('Too weak! Bounced, hull -{0}', ev.dent), col: '#fb7185', alpha: 1 });
    } else if (ev.type === 'whiff') {
      BOAT_GAME.popups.push({ x: X, y: bowY - 40, vy: -1.2, text: ko ? '너무 멀어요' : i18n('Too far away'), col: '#cbd5e1', alpha: 1 });
    } else if (ev.type === 'level') {
      BOAT_GAME.popups.push({ x: 480, y: 92, vy: -1.2, text: ko ? `LV.${ev.level} 얼음이 두꺼워진다!` : i18n('LV.{0} Thicker ice!', ev.level), col: '#fde047', alpha: 1 });
    } else if (ev.type === 'crash') {
      crashed = true;
    }
  });

  ctx.save();
  if (now < BOAT_GAME.shakeUntil) {
    const mag = ((BOAT_GAME.shakeUntil - now) / 520) * 8;
    ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
  }
  // Charging backs the ship off (drawn), the lunge closes it again
  const backOff = run.charging && run.state === 'cruise' ? (run.power / 100) * BOAT_CFG.BACK_OFF : 0;
  drawBoatSea(ctx, now, run);
  drawBoatShelves(ctx, run);
  run.bands.forEach((b) => drawBoatBand(ctx, run, b, now));
  const invulnBlink = now < BOAT_GAME.hitFlashUntil;
  drawBoatTopDown(ctx, X, bowY + backOff + Math.round(Math.sin(now * 0.004) * 1.5), now, {
    spId,
    isShocked: invulnBlink || run.lead < 60,
    isImpactBlink: now < BOAT_GAME.hitFlashUntil - 420,
    rescuedAboard: run.rescued,
  });
  drawBoatFreeze(ctx, run, now);
  // Rescued penguins in the air: an arc from the floe to the deck, stretched on the way up, tucked on the way down
  for (let i = BOAT_GAME.jumpers.length - 1; i >= 0; i--) {
    const j = BOAT_GAME.jumpers[i];
    const q = (now - j.t0) / 560;
    if (q >= 1) {
      BOAT_GAME.jumpers.splice(i, 1);
      continue;
    }
    if (q < 0) {
      drawBoatPenguinOnIce(ctx, j.x, j.y, now, 0, j.sp, 58, true);
      continue;
    }
    const tx = X - 40 + (j.slot % 3) * 40 + (j.slot >= 3 ? 20 : 0);
    const ty = bowY + BOAT_CFG.BOAT_LEN - 4 - (j.slot >= 3 ? 14 : 0);
    const e = q * q * (3 - 2 * q);
    const x = j.x + (tx - j.x) * e;
    const y = j.y + (ty - j.y) * e - Math.sin(q * Math.PI) * 70;
    drawBoatPenguinOnIce(ctx, x, y, now, 0, j.sp, 58 - 28 * e, false);
  }

  for (let i = BOAT_GAME.particles.length - 1; i >= 0; i--) {
    const pt = BOAT_GAME.particles[i];
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vx *= 0.96;
    pt.vy *= 0.96;
    pt.alpha -= pt.decay * dt;
    if (pt.alpha <= 0) {
      BOAT_GAME.particles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.alpha);
    ctx.fillStyle = BOAT_K;
    ctx.fillRect(pt.x - pt.sz / 2 - 1, pt.y - pt.sz / 2 - 1, pt.sz + 2, pt.sz + 2);
    ctx.fillStyle = pt.col;
    ctx.fillRect(pt.x - pt.sz / 2, pt.y - pt.sz / 2, pt.sz, pt.sz);
    ctx.restore();
  }
  for (let i = BOAT_GAME.popups.length - 1; i >= 0; i--) {
    const pop = BOAT_GAME.popups[i];
    pop.y += pop.vy * dt;
    pop.alpha -= 0.024 * dt;
    if (pop.alpha <= 0) {
      BOAT_GAME.popups.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, pop.alpha);
    ctx.font = '900 14px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = BOAT_K;
    ctx.fillText(pop.text, pop.x + 2, pop.y + 2);
    ctx.fillStyle = pop.col;
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  drawBoatGauge(ctx, run, now);
  withStageUi(ctx, 16, 12, 564, () => drawBoatHud(ctx, now, run));

  if (run.rams < 3 && now - run.startAt < 15000) {
    const msg = ko ? '누르고 있으면 힘이 모이고 · 떼면 들이받기 · 초록 칸을 놓치면 선체가 깎여요' : i18n('Hold to charge · let go to ram · miss the green and the hull takes damage');
    ctx.save();
    ctx.font = '800 14px "Pretendard", "Malgun Gothic", sans-serif';
    const tw = Math.ceil(ctx.measureText(msg).width) + 28;
    const hk = Math.min(stageUiK(), 940 / tw); // bigger on phones, never wider than the stage
    const hy = stageUiK() > 1 ? 12 + 38 * Math.min(stageUiK(), 944 / 564) + 6 + 15 * hk : 77; // under the bigger HUD
    ctx.translate(480, hy); // hy = where the box centre (77) ends up
    ctx.scale(hk, hk);
    ctx.translate(-480, -77);
    const bx = 480 - tw / 2;
    const by = 62;
    ctx.fillStyle = 'rgba(9, 13, 26, 0.82)';
    ctx.fillRect(bx, by, tw, 30);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bx, by, 4, 30);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(msg, 480 + 2, by + 16);
    ctx.restore();
  }
  if (run.lead < 120 && run.state !== 'crash') {
    ctx.save();
    ctx.font = '900 15px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = Math.floor(now / 220) % 2 === 0 ? '#fb7185' : '#ffffff';
    ctx.fillText(ko ? '뒤에서 빙하떼가 몰려온다!' : i18n('The iceberg pack is right behind you!'), 480, 524);
    ctx.restore();
  }
  ctx.restore();

  if (crashed) triggerBoatCrash(now);
}

// ============================================================================
// SCENE 2 — boat departure: the ice shelf cracks and the icebreaker shoves off through the floes
// ============================================================================
function drawBoatScene1Departure(ctx, now, p, spId) {
  // Runs from the pillar (left) to the right edge, speeding up; it never leaves the water
  const S = 1.0;
  const boatX = 230 + p * p * 820;
  const waterY = 438;
  const roll = Math.sin(now * 0.006) * 0.03;
  const boatY = waterY - 34 * S + Math.sin(now * 0.008) * 3;

  ctx.save();
  // Open water band
  ctx.fillStyle = '#0e4f6e';
  ctx.fillRect(0, waterY - 4, 960, 120);
  ctx.fillStyle = 'rgba(186, 230, 253, 0.35)';
  for (let i = 0; i < 18; i++) {
    const wx = (i * 83 - now * 0.12) % 1000;
    ctx.fillRect(Math.round((wx + 1000) % 1000) - 20, waterY + 8 + (i % 4) * 22, 34, 3);
  }
  // Floes being shoved aside ahead of the bow
  for (let f = 0; f < 6; f++) {
    const fx = 320 + f * 120;
    const pushed = boatX + 150 * S - (fx - 44);
    if (pushed <= 0) {
      ctx.fillStyle = CAR_K;
      ctx.fillRect(fx - 44, waterY - 10, 88, 16);
      ctx.fillStyle = '#eaf6fd';
      ctx.fillRect(fx - 42, waterY - 8, 84, 8);
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(fx - 42, waterY, 84, 4);
    } else {
      const fade = Math.max(0, 1 - pushed / 260);
      if (fade <= 0) continue;
      ctx.save();
      ctx.globalAlpha = fade;
      for (let k = 0; k < 4; k++) {
        const kx = fx - 40 + k * 26 + pushed * (0.25 + k * 0.08);
        const ky = waterY - 6 + (k % 2) * 6 + pushed * 0.04;
        ctx.fillStyle = CAR_K;
        ctx.fillRect(Math.round(kx) - 1, Math.round(ky) - 1, 20, 12);
        ctx.fillStyle = '#eaf6fd';
        ctx.fillRect(Math.round(kx), Math.round(ky), 18, 10);
      }
      ctx.restore();
    }
  }
  // Bow spray
  for (let t = 0; t < 12; t++) {
    const tp = (now * 0.003 + t * 0.083) % 1;
    const tx = boatX + 140 * S + tp * 50;
    const ty = waterY - 10 - Math.sin(tp * Math.PI) * 50;
    const sz = Math.max(3, Math.round((1 - tp) * 10));
    ctx.fillStyle = CAR_K;
    ctx.fillRect(tx - 1, ty - 1, sz + 2, sz + 2);
    ctx.fillStyle = t % 3 === 0 ? '#bae6fd' : '#f8fafc';
    ctx.fillRect(tx, ty, sz, sz);
  }
  ctx.restore();

  drawBoatWithPilot(ctx, boatX, boatY, roll - 0.04, now, { scale: S, spId });

  // The bubble rides with the ship and goes with it: it used to stop at x = 520 and hang there after the ship left
  if (boatX < 760) {
    drawRetroSpeechBubble(
      ctx,
      boatX + 10,
      Math.max(64, boatY - 150),
      CURRENT_LANG === 'ko' ? '뒤에서 기둥이 빨아들인다!! 전속력 출항, 얼음 부수고 도망간다!!' : i18n('The pillar is sucking everything in!! Full ahead, ram our way out!!'),
      '#38bdf8',
      now
    );
  }
}

if (typeof module !== 'undefined') {
  module.exports = { BOAT_CFG, createBoatRun, boatStep, boatPress, boatRelease, boatPowerAt, boatChargeMs, boatNextBand, boatIceRange, boatLevelFor };
}
