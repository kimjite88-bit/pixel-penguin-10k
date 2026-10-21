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
  g.addColorStop(0, '#0e4f6e');
  g.addColorStop(1, '#0a3550');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 960, 540);
  // Wave dashes scroll with the world
  ctx.fillStyle = 'rgba(186, 230, 253, 0.22)';
  for (let i = 0; i < 46; i++) {
    const wx = 150 + boatHash(i) * 660;
    const wy = ((i * 97 + run.y) % 620) - 40;
    const len = 10 + boatHash(i + 50) * 22;
    const sway = Math.sin(now * 0.002 + i) * 4;
    ctx.fillRect(Math.round(wx + sway), Math.round(wy), Math.round(len), 3);
  }
}

// Pack ice shelves on both sides of the lead, scrolling with the ship
function drawBoatShelves(ctx, run) {
  const L = BOAT_CFG.CHANNEL_L;
  const R = BOAT_CFG.CHANNEL_R;
  const seg = 60;
  const base = Math.floor(run.y / seg);
  for (const side of [0, 1]) {
    ctx.beginPath();
    ctx.moveTo(side ? 960 : 0, -20);
    for (let k = -2; k < 13; k++) {
      const wy = (base + 11 - k) * seg;
      const sy = boatScreenY(run, wy);
      const jag = (boatHash((base + 11 - k) * 2 + side * 7) - 0.5) * 30;
      ctx.lineTo(side ? R + jag : L + jag, sy);
    }
    ctx.lineTo(side ? 960 : 0, 560);
    ctx.closePath();
    ctx.fillStyle = '#e8f4fb';
    ctx.fill();
    ctx.strokeStyle = '#7fb7d4';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  // Pressure ridges on the shelves
  ctx.fillStyle = '#c7e2f0';
  for (let k = -1; k < 12; k++) {
    const n = base + 11 - k;
    const sy = boatScreenY(run, n * seg) + 20;
    ctx.fillRect(Math.round(30 + boatHash(n) * 80), Math.round(sy), 34, 6);
    ctx.fillRect(Math.round(840 + boatHash(n + 3) * 80), Math.round(sy + 18), 30, 6);
  }
}

function boatIceColors(T) {
  if (T >= 70) return { top: '#ffffff', side: '#93c5fd', line: '#3b82f6' }; // multi-year
  if (T >= 45) return { top: '#eaf6fd', side: '#a5d8f0', line: '#60a5fa' };
  return { top: '#c9ecf8', side: '#8fd3ea', line: '#38bdf8' }; // young ice
}

function drawBoatPenguinOnIce(ctx, x, y, now, hop) {
  // Tiny stranded penguin (top-down 3/4): black back, white belly, orange feet, flapping when the ship is near
  const bob = Math.floor((now + hop) / 220) % 2 === 0 ? 0 : -2;
  const px = Math.round(x);
  const py = Math.round(y + bob);
  ctx.fillStyle = 'rgba(11, 16, 32, 0.25)';
  ctx.fillRect(px - 7, py + 9, 16, 4);
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(px - 6, py - 12, 14, 20);
  ctx.fillRect(px - 9, py - 6, 3, 9);
  ctx.fillRect(px + 8, py - 6, 3, 9);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(px - 3, py - 6, 8, 13);
  ctx.fillRect(px - 3, py - 10, 2, 2);
  ctx.fillRect(px + 3, py - 10, 2, 2);
  ctx.fillStyle = '#fb923c';
  ctx.fillRect(px, py - 8, 2, 2);
  ctx.fillRect(px - 4, py + 8, 4, 2);
  ctx.fillRect(px + 2, py + 8, 4, 2);
}

function drawBoatCrate(ctx, x, y) {
  const px = Math.round(x);
  const py = Math.round(y);
  ctx.fillStyle = BOAT_K;
  ctx.fillRect(px - 13, py - 11, 26, 22);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(px - 11, py - 9, 22, 18);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px - 2, py - 7, 4, 14);
  ctx.fillRect(px - 7, py - 2, 14, 4);
}

function drawBoatBand(ctx, run, band, now) {
  const L = BOAT_CFG.CHANNEL_L - 20;
  const R = BOAT_CFG.CHANNEL_R + 20;
  const yNear = boatScreenY(run, band.y0);
  const yFar = yNear - band.h;
  if (yNear < -40 || yFar > 580) return;
  const c = boatIceColors(band.T0);
  if (!band.broken) {
    ctx.fillStyle = c.side;
    ctx.fillRect(L, yFar + 6, R - L, band.h);
    ctx.fillStyle = c.top;
    ctx.fillRect(L, yFar, R - L, band.h);
    ctx.fillStyle = BOAT_K;
    ctx.fillRect(L, yNear + 4, R - L, 2);
    // Ridge lines show how thick it is: 1 for young ice, up to 4 for multi-year
    ctx.fillStyle = c.line;
    const ridges = band.T0 >= 70 ? 4 : band.T0 >= 45 ? 2 : 1;
    for (let r = 0; r < ridges; r++) {
      const ry = Math.round(yFar + ((r + 1) * band.h) / (ridges + 1));
      for (let s = 0; s < 9; s++) {
        const sx = L + 20 + s * 76 + Math.round(boatHash(band.seed + s + r * 13) * 30);
        ctx.fillRect(sx, ry, 26 + Math.round(boatHash(band.seed + s * 3 + r) * 20), 3);
      }
    }
    // Cracks from weak rams, around the bow
    if (band.cracks) {
      ctx.strokeStyle = BOAT_K;
      ctx.lineWidth = 2;
      for (let k = 0; k < band.cracks * 3; k++) {
        const a = -Math.PI / 2 + (boatHash(band.seed + k * 7) - 0.5) * 2.4;
        const len = 14 + boatHash(band.seed + k) * (band.h * 0.9);
        ctx.beginPath();
        ctx.moveTo(BOAT_CFG.BOAT_X, yNear);
        ctx.lineTo(BOAT_CFG.BOAT_X + Math.cos(a) * len * 0.5, yNear + Math.sin(a) * len * 0.5 + 3);
        ctx.lineTo(BOAT_CFG.BOAT_X + Math.cos(a) * len, yNear + Math.sin(a) * len);
        ctx.stroke();
      }
    }
    band.penguins.forEach((pg) => drawBoatPenguinOnIce(ctx, pg.x, yNear - pg.dy, now, pg.hop));
    if (band.crate) drawBoatCrate(ctx, BOAT_CFG.BOAT_X, yNear - band.h / 2);
  } else {
    // Broken: the floe split along the channel, with shards drifting apart
    const t = Math.min(1, (now - band.brokenAt) / 700);
    const open = 70 + t * 20;
    ctx.fillStyle = c.side;
    ctx.fillRect(L, yFar + 6, BOAT_CFG.BOAT_X - open - L, band.h);
    ctx.fillRect(BOAT_CFG.BOAT_X + open, yFar + 6, R - BOAT_CFG.BOAT_X - open, band.h);
    ctx.fillStyle = c.top;
    ctx.fillRect(L, yFar, BOAT_CFG.BOAT_X - open - L, band.h);
    ctx.fillRect(BOAT_CFG.BOAT_X + open, yFar, R - BOAT_CFG.BOAT_X - open, band.h);
    for (let s = 0; s < 7; s++) {
      const side = s % 2 ? 1 : -1;
      const sx = BOAT_CFG.BOAT_X + side * (open - 14 - boatHash(band.seed + s) * 30);
      const sy = yFar + boatHash(band.seed + s * 5) * band.h;
      const sz = 8 + Math.round(boatHash(band.seed + s * 9) * 10);
      ctx.fillStyle = BOAT_K;
      ctx.fillRect(Math.round(sx - sz / 2) - 1, Math.round(sy) - 1, sz + 2, sz + 2);
      ctx.fillStyle = c.top;
      ctx.fillRect(Math.round(sx - sz / 2), Math.round(sy), sz, sz);
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
  // Rescued penguins line up on the aft deck (up to 5 shown)
  for (let i = 0; i < Math.min(5, rescuedAboard); i++) {
    drawBoatPenguinOnIce(ctx, -34 + i * 17, L - 18, now, i * 137);
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
let BOAT_PIXEL_BUFFER = null;

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

function drawBoatSideBody(ctx, now, opts) {
  const { withPilot = true, spId, isShocked = false, isImpactBlink = false, smokeOn = true, pixelMode = false } = opts;
  const lw = pixelMode ? 0 : 3;
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
  // Pilot on the open foredeck: the hull's bulwark (y = -2) hides the waist
  if (withPilot && typeof drawCarPilot === 'function') {
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
    // Pixel version: render the hull small and blow it up without smoothing, then the pixel pilot on top
    if (!BOAT_PIXEL_BUFFER && typeof document !== 'undefined') {
      BOAT_PIXEL_BUFFER = document.createElement('canvas');
      BOAT_PIXEL_BUFFER.width = 80;
      BOAT_PIXEL_BUFFER.height = 50;
    }
    if (BOAT_PIXEL_BUFFER) {
      const b = BOAT_PIXEL_BUFFER.getContext('2d');
      b.clearRect(0, 0, 80, 50);
      b.save();
      b.scale(0.25, 0.25);
      b.translate(160, 130);
      drawBoatSideBody(b, now, { ...options, withPilot: false, pixelMode: false, smokeOn: false });
      b.restore();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(BOAT_PIXEL_BUFFER, -160, -130, 320, 200);
    }
    if (options.withPilot !== false && typeof drawCarPilot === 'function') {
      ctx.save();
      drawCarPilot(ctx, true, now, { ...options, rect: BOAT_SIDE_PILOT_RECT, clip: (c) => c.rect(-70, -140, 150, 138) });
      ctx.restore();
    }
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
  // Brash ice and mist ahead of the pack
  ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
  ctx.fillRect(0, edge - 10, 960, 560 - edge + 10);
  // Bergs: blocky white tops with blue faces, bobbing and jostling
  for (let k = 0; k < 13; k++) {
    const bx = -30 + k * 78 + (boatHash(k * 3) - 0.5) * 30;
    const bw = 70 + boatHash(k) * 46;
    const bh = 34 + boatHash(k + 7) * 40;
    const by = edge - bh * 0.55 + Math.sin(now * 0.003 + k * 1.3) * 3 + boatHash(k + 2) * 14;
    ctx.fillStyle = BOAT_K;
    ctx.beginPath();
    ctx.moveTo(bx - 2, by + bh);
    ctx.lineTo(bx + bw * 0.18 - 2, by - 2);
    ctx.lineTo(bx + bw * 0.55, by - bh * 0.35 - 2);
    ctx.lineTo(bx + bw * 0.85 + 2, by + bh * 0.05);
    ctx.lineTo(bx + bw + 2, by + bh);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.moveTo(bx, by + bh);
    ctx.lineTo(bx + bw * 0.18, by);
    ctx.lineTo(bx + bw * 0.55, by - bh * 0.35);
    ctx.lineTo(bx + bw * 0.85, by + bh * 0.05);
    ctx.lineTo(bx + bw, by + bh);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.18, by);
    ctx.lineTo(bx + bw * 0.55, by - bh * 0.35);
    ctx.lineTo(bx + bw * 0.85, by + bh * 0.05);
    ctx.lineTo(bx + bw * 0.5, by + bh * 0.25);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
  ctx.fillRect(0, edge + 30, 960, 560 - edge);
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
  ctx.fillText(typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'ko' ? '충격' : 'RAM', gx + gw / 2, gy + gh + 16);
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
    ctx.fillText(ko ? 'GUEST (기본)' : 'GUEST', hx + 12, hy + hh / 2 + 1);
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
  ctx.fillText(ko ? '선체' : 'HULL', bx - 6, hy + hh / 2 + 1);

  ctx.textAlign = 'right';
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.fillStyle = '#bae6fd';
  ctx.fillText(`${ko ? '구조' : 'SAVED'} ${run.rescued} · LV.${run.level}`, hx + hw - 12, hy + hh / 2 + 1);
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
    if (ev.type === 'break') {
      const cols = ['#ffffff', '#bae6fd', '#7dd3fc'];
      spawnBoatBurst(X, bowY - 6, cols, ev.perfect ? 22 : 14, ev.perfect ? 6 : 4.5, 7);
      BOAT_GAME.shakeUntil = now + (ev.perfect ? 260 : 180);
      const label = ev.perfect ? (ko ? `PERFECT x${Math.min(5, ev.combo)}` : `PERFECT x${Math.min(5, ev.combo)}`) : ko ? '쾅!' : 'CRUNCH!';
      BOAT_GAME.popups.push({ x: X, y: bowY - 40, vy: -1.5, text: `${label} +${ev.points}`, col: ev.perfect ? '#4ade80' : '#fde047', alpha: 1 });
      if (ev.saved) {
        BOAT_GAME.popups.push({ x: X + 130, y: bowY - 10, vy: -1.2, text: ko ? `펭귄 ${ev.saved}마리 구조!` : `${ev.saved} saved!`, col: '#fde68a', alpha: 1 });
      }
      if (ev.crate) BOAT_GAME.popups.push({ x: X - 130, y: bowY - 10, vy: -1.2, text: ko ? `선체 수리 +${BOAT_CFG.REPAIR}` : `Repair +${BOAT_CFG.REPAIR}`, col: '#fbbf24', alpha: 1 });
      if (ev.dent) {
        BOAT_GAME.hitFlashUntil = now + 520;
        BOAT_GAME.shakeUntil = now + 360;
        const tooHard = ev.excess > BOAT_CFG.SAFE;
        const label = tooHard ? (ko ? '너무 셌다!' : 'Too hard!') : ko ? '초록 칸 놓침!' : 'Missed the green!';
        BOAT_GAME.popups.push({ x: X, y: bowY + 40, vy: -1.3, text: `${label} ${ko ? '선체' : 'Hull'} -${ev.dent}`, col: '#fb7185', alpha: 1 });
        spawnBoatBurst(X, bowY + 10, ['#fb7185', '#fecaca', '#ffffff'], 10, 3.4, 5);
      }
    } else if (ev.type === 'stuck') {
      BOAT_GAME.shakeUntil = now + 200;
      spawnBoatBurst(X, bowY - 4, ['#e0f2fe', '#ffffff'], 8, 3, 5);
      BOAT_GAME.hitFlashUntil = now + 520;
      BOAT_GAME.popups.push({ x: X, y: bowY - 40, vy: -1.3, text: ko ? `약했다! 튕겨남 선체 -${ev.dent}` : `Too weak! Bounced, hull -${ev.dent}`, col: '#fb7185', alpha: 1 });
    } else if (ev.type === 'whiff') {
      BOAT_GAME.popups.push({ x: X, y: bowY - 40, vy: -1.2, text: ko ? '너무 멀어요' : 'Too far away', col: '#cbd5e1', alpha: 1 });
    } else if (ev.type === 'level') {
      BOAT_GAME.popups.push({ x: 480, y: 92, vy: -1.2, text: ko ? `LV.${ev.level} 얼음이 두꺼워진다!` : `LV.${ev.level} Thicker ice!`, col: '#fde047', alpha: 1 });
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
  drawBoatHud(ctx, now, run);

  if (run.rams < 3 && now - run.startAt < 15000) {
    const msg = ko ? '누르고 있으면 힘이 모이고 · 떼면 들이받기 · 초록 칸을 놓치면 선체가 깎여요' : 'Hold to charge · let go to ram · miss the green and the hull takes damage';
    ctx.save();
    ctx.font = '800 14px "Pretendard", "Malgun Gothic", sans-serif';
    const tw = Math.ceil(ctx.measureText(msg).width) + 28;
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
    ctx.fillText(ko ? '뒤에서 빙하떼가 몰려온다!' : 'The iceberg pack is right behind you!', 480, 524);
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
      CURRENT_LANG === 'ko' ? '뒤에서 기둥이 빨아들인다!! 전속력 출항, 얼음 부수고 도망간다!!' : 'The pillar is sucking everything in!! Full ahead, ram our way out!!',
      '#38bdf8',
      now
    );
  }
}

if (typeof module !== 'undefined') {
  module.exports = { BOAT_CFG, createBoatRun, boatStep, boatPress, boatRelease, boatPowerAt, boatChargeMs, boatNextBand, boatIceRange, boatLevelFor };
}
