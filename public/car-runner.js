// ============================================================================
// CAR ESCAPE MODE (자동차 탈출) — Cookie Run-style snow trail for a lifted off-road car
//
// Rules follow CookieRun: OvenBreak as documented on the community wiki (cookierun.fandom.com):
// Energy drains slowly while running and drops on every obstacle hit (small flyers cost half);
// Energy Potions refill it; tall obstacles need the double jump; running off a ledge keeps the first
// jump, so two jumps are still available in the air; a pit ends the run unless the runner is lifted
// out ("Lifts from hole", up to 2 times); Jellies are the main source of points.
// The course is built from hand-made chunks (ground, pits, one-way ice ledges, obstacles, jelly lines);
// every chunk is checked to be clearable at the slowest and fastest speed (scratch/car_mode sim).
// The "no more than 2 of the same chunk in a row" rule follows the Chromium T-Rex runner
// (components/neterror/resources/dino_game, Copyright 2014 The Chromium Authors, BSD-3-Clause:
// redistribution with or without modification is permitted provided this notice is retained;
// the software is provided "as is" without warranty of any kind).
//
// Units: 960x540 logical stage, speeds in px per 60fps frame, heights measured upward from the snow
// line. Nothing at the top level touches the DOM, so the rules can be simulated outside the browser.
// ============================================================================
const CAR_CFG = {
  STAGE_W: 960,
  GROUND_Y: 470, // snow line on screen
  CAR_X: 200, // car origin (cockpit door line) on screen
  CAR_SCALE: 0.95,
  WHEEL_BOTTOM: 57, // local y of the tyre contact point below the car origin
  SUPPORT_HALF: 34, // the car stands on whatever is under its middle +-34px
  SPEED: 9.6,
  // Speed climbs for the whole run: 9.6 -> SPEED_KNEE in ~75 s, then slower (OVERDRIVE_ACCELERATION) up to
  // MAX_SPEED, so the run keeps getting harder after the first ramp (every chunk is re-checked at MAX_SPEED)
  SPEED_KNEE: 15,
  MAX_SPEED: 16.5,
  ACCELERATION: 0.0012,
  OVERDRIVE_ACCELERATION: 0.0003,
  // Chunks stretch with speed by only this share of the speed-up, so at higher speed the next hazard comes
  // sooner (the Chrome dino does the same: gap = width * speed + a fixed minimum gap)
  CHUNK_STRETCH: 0.6,
  GRAVITY: 0.6,
  JUMP_VELOCITY: 13.2, // first jump: ~145px apex
  DOUBLE_JUMP_VELOCITY: 12, // second jump in the air: +120px
  PIT_DEPTH_LIMIT: -150, // fell this deep into a crevasse = out
  PIT_NO_JUMP: -16, // below the rim there is nothing to jump off
  JUMP_BUFFER_MS: 140,
  ENERGY_MAX: 100,
  // Difficulty lives in the energy numbers (course stays the same); tuned so a 67ms-accurate player averages
  // ~2 min and a 100ms one ~50 s (scratch/car_mode/hp_estimate.py on the measured per-chunk success rates)
  ENERGY_DRAIN_PER_SEC: 1.1,
  HIT_ENERGY: 34,
  SMALL_HIT_ENERGY: 17,
  POTION_SMALL: 6,
  POTION_BIG: 19,
  PIT_RESCUES: 2,
  PIT_RESCUE_ENERGY: 34,
  INVULN_MS: 1000,
  CLEAR_DISTANCE: 700,
  CHUNK_RUNUP: 260, // flat snow between chunks
  MAX_CHUNK_DUPLICATION: 2,
  DISTANCE_SCORE: 0.05,
  JELLY_POINTS: 20,
  GOLD_JELLY_POINTS: 200,
  JELLY_STEP: 36,
};

// Car hit boxes in local car units (y down from the door line). The hat is left out on purpose.
const CAR_HIT_BOXES = [
  { x: -82, y: 2, w: 166, h: 53 }, // body + tyres
  { x: -56, y: -58, w: 70, h: 60 }, // pilot
];

// boxes: [x, bottom, width, height] relative to the obstacle's left edge and the surface it stands on
const CAR_OBSTACLE_TYPES = {
  SPIKE: { width: 46, boxes: [[5, 0, 36, 38]] },
  SNOWMAN: { width: 50, boxes: [[6, 0, 38, 40], [13, 40, 24, 30]] },
  GIFTS: { width: 56, boxes: [[2, 0, 52, 32], [10, 32, 36, 24]] },
  WALL: { width: 54, boxes: [[5, 0, 44, 150]] }, // taller than a single jump: needs the double jump
  SKUA: { width: 62, boxes: [[8, 6, 46, 20]], small: true },
};

// Chunks (x relative to the chunk start). pits: [[a, b]] gaps in the snow; ledges: [[a, b, top]] one-way ice
// ledges; obs: [[type, x, lift]]; jelly: [[a, b, h]] rows (h above the snow); gold: [[x, h]]; potion: [[x, h, size]]
const CAR_CHUNKS = [
  {
    id: 'spikes', len: 1220, minSpeed: 0,
    obs: [['SPIKE', 300, 0], ['SPIKE', 980, 0]],
    jelly: [[40, 220, 30], [260, 380, 150], [440, 880, 30], [940, 1060, 150], [1110, 1200, 30]],
    gold: [[323, 190], [1003, 190]],
  },
  {
    id: 'snowmen', len: 1260, minSpeed: 0,
    obs: [['SNOWMAN', 380, 0], ['GIFTS', 1040, 0]],
    jelly: [[40, 300, 30], [340, 470, 165], [540, 940, 30], [1000, 1130, 160], [1180, 1240, 30]],
  },
  {
    id: 'wall', len: 980, minSpeed: 0,
    obs: [['WALL', 470, 0]],
    jelly: [[40, 300, 30], [400, 600, 270], [700, 940, 30]],
    gold: [[497, 310]],
  },
  {
    id: 'crevasse', len: 920, minSpeed: 0,
    pits: [[340, 520]],
    jelly: [[40, 280, 30], [320, 560, 130], [600, 880, 30]],
    potion: [[430, 175, 'small']],
  },
  {
    id: 'ledge-over-spikes', len: 1160, minSpeed: 0,
    ledges: [[240, 880, 108]],
    obs: [['SPIKE', 470, 0], ['SPIKE', 700, 0]],
    jelly: [[40, 200, 30], [280, 860, 140]],
    gold: [[560, 140]],
  },
  {
    id: 'stairs', len: 1560, minSpeed: 0,
    pits: [[500, 1260]],
    ledges: [[220, 620, 100], [700, 1180, 196]],
    jelly: [[40, 180, 30], [250, 610, 132], [730, 1170, 228]],
    gold: [[940, 228]],
    potion: [[1400, 30, 'big']],
  },
  {
    id: 'skua-low', len: 1220, minSpeed: 10.5,
    obs: [['SKUA', 360, 26], ['SPIKE', 1020, 0]],
    jelly: [[40, 260, 30], [320, 460, 170], [520, 920, 30], [980, 1110, 150]],
  },
  {
    id: 'skua-high', len: 900, minSpeed: 10.5,
    obs: [['SKUA', 420, 140], ['SKUA', 640, 140]],
    jelly: [[40, 860, 30]],
    gold: [[450, 30], [670, 30]],
  },
  {
    id: 'bridge', len: 1300, minSpeed: 11,
    pits: [[300, 1000]],
    ledges: [[440, 860, 90]],
    obs: [['SPIKE', 640, 90]],
    jelly: [[40, 260, 30], [300, 430, 140], [460, 600, 122], [620, 720, 230], [740, 850, 122], [880, 1000, 140]],
  },
  {
    id: 'wall-pit', len: 1500, minSpeed: 12,
    obs: [['WALL', 330, 0]],
    pits: [[1000, 1180]],
    jelly: [[40, 220, 30], [280, 460, 270], [560, 940, 30], [980, 1200, 130], [1240, 1460, 30]],
    potion: [[760, 30, 'small']],
  },
];

function carHitLength() {
  let l = Infinity;
  let r = -Infinity;
  CAR_HIT_BOXES.forEach((b) => {
    l = Math.min(l, b.x);
    r = Math.max(r, b.x + b.w);
  });
  return (r - l) * CAR_CFG.CAR_SCALE;
}

function carTopHeight() {
  return Math.max(...CAR_HIT_BOXES.map((b) => (CAR_CFG.WHEEL_BOTTOM - b.y) * CAR_CFG.CAR_SCALE));
}

function carWorldBoxes(run) {
  const S = CAR_CFG.CAR_SCALE;
  return CAR_HIT_BOXES.map((b) => ({
    l: CAR_CFG.CAR_X + b.x * S,
    r: CAR_CFG.CAR_X + (b.x + b.w) * S,
    t: run.h + (CAR_CFG.WHEEL_BOTTOM - b.y) * S,
    b: run.h + (CAR_CFG.WHEEL_BOTTOM - b.y - b.h) * S,
  }));
}

function carObstacleBoxes(o) {
  const tp = CAR_OBSTACLE_TYPES[o.type];
  return tp.boxes.map(([bx, bb, bw, bh]) => ({ l: o.x + bx, r: o.x + bx + bw, b: o.lift + bb, t: o.lift + bb + bh }));
}

function carBoxesOverlap(a, b) {
  return a.l < b.r && a.r > b.l && a.b < b.t && a.t > b.b;
}

// Surfaces under the middle of the car: snow (top 0) where there is no pit, plus ice ledges
function carSurfacesUnder(run) {
  const l = CAR_CFG.CAR_X - CAR_CFG.SUPPORT_HALF;
  const r = CAR_CFG.CAR_X + CAR_CFG.SUPPORT_HALF;
  const out = [];
  if (run.ground.some((g) => g.a < r && g.b > l)) out.push(0);
  run.ledges.forEach((p) => {
    if (p.a < r && p.b > l) out.push(p.top);
  });
  return out;
}

function carOverPit(run) {
  const l = CAR_CFG.CAR_X - CAR_CFG.SUPPORT_HALF;
  const r = CAR_CFG.CAR_X + CAR_CFG.SUPPORT_HALF;
  return !run.ground.some((g) => g.a < r && g.b > l);
}

function carRandInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// Chrome Horizon.duplicateObstacleCheck, applied to chunks
function carDuplicateChunkCheck(run, idx) {
  let dup = 0;
  for (let i = 0; i < run.history.length; i++) dup = run.history[i] === idx ? dup + 1 : 0;
  return dup >= CAR_CFG.MAX_CHUNK_DUPLICATION;
}

// A chunk is stretched by speed / start speed (Chrome widens its gaps with speed too): the jump covers
// proportionally more ground, so the timing of every chunk stays the same at any speed
function carPlaceChunk(run, chunk, x0) {
  const k = Math.max(1, 1 + (run.speed / CAR_CFG.SPEED - 1) * CAR_CFG.CHUNK_STRETCH);
  const X = (v) => x0 + v * k;
  let cursor = x0;
  (chunk.pits || []).forEach(([a, b]) => {
    run.ground.push({ a: cursor, b: X(a) });
    cursor = X(b);
  });
  const end = X(chunk.len) + CAR_CFG.CHUNK_RUNUP * k;
  run.ground.push({ a: cursor, b: end });
  (chunk.ledges || []).forEach(([a, b, top]) => run.ledges.push({ a: X(a), b: X(b), top }));
  (chunk.obs || []).forEach(([type, x, lift], n) =>
    run.obstacles.push({ type, x: X(x), lift, w: CAR_OBSTACLE_TYPES[type].width, seed: (run.chunks * 7 + n) % 97, passed: false })
  );
  (chunk.jelly || []).forEach(([a, b, h]) => {
    for (let x = X(a); x <= X(b); x += CAR_CFG.JELLY_STEP) run.jellies.push({ x, h, kind: 'jelly' });
  });
  (chunk.gold || []).forEach(([x, h]) => run.jellies.push({ x: X(x), h, kind: 'gold' }));
  (chunk.potion || []).forEach(([x, h, size]) => run.jellies.push({ x: X(x), h, kind: size === 'big' ? 'potionBig' : 'potion' }));
  run.chunkEnd = end;
  run.chunks += 1;
}

function carAddChunk(run, rng) {
  const candidates = [];
  CAR_CHUNKS.forEach((c, idx) => {
    if (run.speed >= c.minSpeed && !carDuplicateChunkCheck(run, idx)) candidates.push(idx);
  });
  const idx = candidates[Math.floor(rng() * candidates.length)];
  carPlaceChunk(run, CAR_CHUNKS[idx], run.chunkEnd);
  run.history.unshift(idx);
  if (run.history.length > CAR_CFG.MAX_CHUNK_DUPLICATION) run.history.length = CAR_CFG.MAX_CHUNK_DUPLICATION;
}

function createCarRun(now = 0) {
  const run = {
    speed: CAR_CFG.SPEED,
    distance: 0,
    h: 0,
    vh: 0,
    grounded: true,
    jumpsUsed: 0,
    jumpHeld: false,
    bufferedAt: -Infinity,
    ground: [{ a: -400, b: CAR_CFG.CLEAR_DISTANCE }],
    ledges: [],
    obstacles: [],
    jellies: [],
    chunkEnd: CAR_CFG.CLEAR_DISTANCE,
    chunks: 0,
    history: [],
    energy: CAR_CFG.ENERGY_MAX,
    rescuesLeft: CAR_CFG.PIT_RESCUES,
    invulnUntil: 0,
    distScore: 0,
    bonus: 0,
    score: 0,
    jellyCount: 0,
    level: 1,
    jumps: 0,
    cleared: 0,
    hits: 0,
    pits: 0,
    startAt: now,
    crashed: false,
    crashReason: '',
  };
  return run;
}

function carDoJump(run) {
  if (run.grounded) {
    run.grounded = false;
    run.vh = CAR_CFG.JUMP_VELOCITY;
    run.jumpsUsed = 1;
    run.jumps += 1;
    return 'jump';
  }
  if (run.jumpsUsed < 2 && run.h > CAR_CFG.PIT_NO_JUMP) {
    run.vh = run.jumpsUsed === 0 ? CAR_CFG.JUMP_VELOCITY : CAR_CFG.DOUBLE_JUMP_VELOCITY;
    run.jumpsUsed += 1;
    run.jumps += 1;
    return run.jumpsUsed === 2 ? 'double' : 'jump';
  }
  return null;
}

function carPressJump(run, now) {
  run.jumpHeld = true;
  const kind = carDoJump(run);
  if (!kind) run.bufferedAt = now;
  run.pendingJumpEvent = kind;
}

function carReleaseJump(run) {
  run.jumpHeld = false;
}

function carLevelForSpeed(speed) {
  const t = (speed - CAR_CFG.SPEED) / (CAR_CFG.MAX_SPEED - CAR_CFG.SPEED);
  return Math.max(1, Math.min(10, 1 + Math.floor(t * 9 + 1e-9)));
}

function carEndRun(run, reason, events) {
  run.crashed = true;
  run.crashReason = reason;
  events.push({ type: 'crash', reason });
}

// One simulation step (dt in 60fps frames)
function carStep(run, dt, now, rng = Math.random) {
  const events = [];
  if (run.crashed) return events;
  if (run.pendingJumpEvent) {
    events.push({ type: run.pendingJumpEvent });
    run.pendingJumpEvent = null;
  }

  // 1. Scroll the course
  const dx = run.speed * dt;
  run.ground.forEach((g) => {
    g.a -= dx;
    g.b -= dx;
  });
  run.ledges.forEach((p) => {
    p.a -= dx;
    p.b -= dx;
  });
  run.obstacles.forEach((o) => {
    o.x -= dx;
  });
  run.jellies.forEach((j) => {
    j.x -= dx;
  });
  run.chunkEnd -= dx;
  run.ground = run.ground.filter((g) => g.b > -400);
  run.ledges = run.ledges.filter((p) => p.b > -200);
  run.obstacles = run.obstacles.filter((o) => o.x + o.w > -60);
  run.jellies = run.jellies.filter((j) => j.x > -40);
  while (run.chunkEnd < CAR_CFG.STAGE_W + 400) carAddChunk(run, rng);

  // 2. Vertical motion: stand, fall off ledges, land on one-way surfaces, sink into crevasses
  if (run.grounded) {
    if (!carSurfacesUnder(run).some((top) => Math.abs(top - run.h) < 0.5)) {
      run.grounded = false; // ran off a ledge or into a pit: both jumps stay available
      run.vh = 0;
      run.jumpsUsed = 0;
    }
  }
  if (!run.grounded) {
    const prevH = run.h;
    run.h += run.vh * dt;
    run.vh -= CAR_CFG.GRAVITY * dt;
    if (run.vh <= 0) {
      const landing = carSurfacesUnder(run)
        .filter((top) => prevH >= top - 0.01 && run.h <= top)
        .sort((a, b) => b - a)[0];
      if (landing !== undefined) {
        run.h = landing;
        run.vh = 0;
        run.grounded = true;
        run.jumpsUsed = 0;
        events.push({ type: 'land' });
        if (now - run.bufferedAt <= CAR_CFG.JUMP_BUFFER_MS) {
          run.bufferedAt = -Infinity;
          const kind = carDoJump(run);
          if (kind) events.push({ type: kind });
        }
      }
    }
    if (!run.grounded && run.h < CAR_CFG.PIT_DEPTH_LIMIT) {
      run.pits += 1;
      if (run.rescuesLeft > 0) {
        // Lifted out of the crevasse ("Lifts from hole"), at an energy cost
        run.rescuesLeft -= 1;
        run.energy -= CAR_CFG.PIT_RESCUE_ENERGY;
        run.h = 170;
        run.vh = 3;
        run.jumpsUsed = 0;
        run.invulnUntil = now + 1500;
        events.push({ type: 'rescue' });
      } else {
        carEndRun(run, 'pit', events);
        return events;
      }
    }
  }

  // 3. Obstacles, jellies, potions
  const carBoxes = carWorldBoxes(run);
  const carLeft = Math.min(...carBoxes.map((b) => b.l));
  const canHit = now >= run.invulnUntil;
  for (let i = run.obstacles.length - 1; i >= 0; i--) {
    const o = run.obstacles[i];
    if (canHit) {
      const oBoxes = carObstacleBoxes(o);
      if (carBoxes.some((cb) => oBoxes.some((ob) => carBoxesOverlap(cb, ob)))) {
        run.obstacles.splice(i, 1);
        const cost = CAR_OBSTACLE_TYPES[o.type].small ? CAR_CFG.SMALL_HIT_ENERGY : CAR_CFG.HIT_ENERGY;
        run.energy -= cost;
        run.hits += 1;
        run.invulnUntil = now + CAR_CFG.INVULN_MS;
        events.push({ type: 'hit', obstacle: o, cost });
        continue;
      }
    }
    if (!o.passed && o.x + o.w < carLeft) {
      o.passed = true;
      run.cleared += 1;
    }
  }
  for (let i = run.jellies.length - 1; i >= 0; i--) {
    const j = run.jellies[i];
    const r = j.kind === 'jelly' ? 12 : 18;
    if (carBoxes.some((cb) => j.x + r > cb.l && j.x - r < cb.r && j.h + r > cb.b && j.h - r < cb.t)) {
      run.jellies.splice(i, 1);
      if (j.kind === 'potion' || j.kind === 'potionBig') {
        const gain = j.kind === 'potionBig' ? CAR_CFG.POTION_BIG : CAR_CFG.POTION_SMALL;
        run.energy = Math.min(CAR_CFG.ENERGY_MAX, run.energy + gain);
        events.push({ type: 'potion', x: j.x, h: j.h, gain });
      } else {
        const pts = j.kind === 'gold' ? CAR_CFG.GOLD_JELLY_POINTS : CAR_CFG.JELLY_POINTS;
        run.bonus += pts;
        run.jellyCount += 1;
        events.push({ type: j.kind, x: j.x, h: j.h, points: pts });
      }
    }
  }

  // 4. Energy drains while running (CookieRun), distance, speed
  run.energy -= (CAR_CFG.ENERGY_DRAIN_PER_SEC / 60) * dt;
  run.distance += dx;
  run.distScore = Math.floor(run.distance * CAR_CFG.DISTANCE_SCORE);
  const accel = run.speed < CAR_CFG.SPEED_KNEE ? CAR_CFG.ACCELERATION : CAR_CFG.OVERDRIVE_ACCELERATION;
  if (run.speed < CAR_CFG.MAX_SPEED) run.speed = Math.min(CAR_CFG.MAX_SPEED, run.speed + accel * dt);
  const lv = carLevelForSpeed(run.speed);
  if (lv > run.level) {
    run.level = lv;
    const bonus = lv * 300;
    run.bonus += bonus;
    events.push({ type: 'level', level: lv, points: bonus });
  }
  run.score = run.distScore + run.bonus;
  if (run.energy <= 0) {
    run.energy = 0;
    carEndRun(run, 'energy', events);
  }
  return events;
}

// ============================================================================
// DRAWING — lifted open-top off-road car: mint body, hot-pink stripe, black fender flares, chunky snow
// tyres, snorkel, winch and a bumper LED bar; nothing over the cabin, so the NFT pilot is fully visible.
// ============================================================================
const CAR_PILOT_DX = -14; // the pilot sits behind the windshield, not mid-car
const CAR_K = '#090d1a';
const CAR_WHEELS = [-56, 58]; // wheel centres (local x); y = 36, tyre radius 21
const CAR_WHEEL_Y = 36;

// rect / clip let the plane reuse this: its pilot sits smaller, behind a side window
function drawCarPilot(ctx, pixelMode, now, options = {}) {
  const { spId = UFO_GAME.pilotSpeciesId || '01', isShocked = false, isImpactBlink = false, lift = 0, rect = null, clip = null } = options;
  ensureDefaultPilotSheets();
  const r = rect || { x: PILOT_DRAW_RECT.x + CAR_PILOT_DX, y: PILOT_DRAW_RECT.y, size: PILOT_DRAW_RECT.size };
  const px = r.x;
  const py = r.y - lift;
  // Species-sprite fallback (sheet still loading): same footprint as the composed pilot
  const fbSize = Math.round(r.size * (86 / 79));
  const fbH = Math.round(fbSize * (220 / 256));
  const fbY = py + r.size - fbH;
  ctx.save();
  ctx.beginPath();
  if (clip) clip(ctx);
  else ctx.rect(px - 16, -130, r.size + 32, 134); // the door line (y = +4) hides the waist
  ctx.clip();
  if (pixelMode) {
    ctx.imageSmoothingEnabled = false;
    const anim = getPenguinAnimState(now, 1, false, isImpactBlink, isShocked);
    const sheet = UFO_GAME.hasNft ? UFO_GAME.pilotPixelSheet : UFO_GAME.pilotPixelSheet || MOTION_STATE.defaultPilotPixelSheet;
    const f3 = isShocked ? 2 : anim.frameIdx === 1 ? 1 : 0;
    if (sheet) {
      ctx.drawImage(sheet, f3 * 48, 0, 48, 48, px, py, r.size, r.size);
    } else {
      const spEntry = ensureSpeciesSprite(spId);
      const src = spEntry && spEntry.sheetLoaded ? spEntry.sheet : spEntry && spEntry.loaded ? spEntry.img : null;
      if (src) {
        ctx.drawImage(src, src === spEntry.sheet ? anim.frameIdx * 256 : 0, 0, 256, 220, px - 2, fbY, fbSize, fbH);
      }
    }
  } else {
    ctx.imageSmoothingEnabled = true;
    const anim = getPenguinAnimState(isImpactBlink ? 320 : now, 0, false, isImpactBlink, isShocked && !isImpactBlink);
    const sheet = UFO_GAME.hasNft ? UFO_GAME.pilot2DSheet : UFO_GAME.pilot2DSheet || MOTION_STATE.defaultPilot2DSheet;
    const f3 = anim.frameIdx === 6 ? 2 : anim.frameIdx === 1 || anim.frameIdx === 4 || anim.frameIdx === 5 ? 1 : 0;
    if (sheet) {
      ctx.drawImage(sheet, f3 * 288, 0, 288, 288, px, py, r.size, r.size);
    } else {
      const heroSheet = getHero2DSheetForSpecies(spId);
      if (heroSheet && (MOTION_STATE.hero2DSheetLoaded || heroSheet.width)) {
        ctx.drawImage(heroSheet, anim.frameIdx * 256, 0, 256, 220, px - 2, fbY, fbSize, fbH);
      }
    }
  }
  ctx.restore();
}

function drawCarExhaustFlame(ctx, now, boost) {
  if (boost <= 0) return;
  const cols = ['#fde047', '#fb923c', '#f472b6'];
  for (let k = 0; k < 4; k++) {
    const flick = Math.floor(now / 60 + k) % 2;
    const sz = Math.max(3, Math.round((8 - k * 1.6) * Math.min(1.6, boost)));
    const fx = -112 - k * 8 - flick * 2;
    const fy = 26 - Math.round(sz / 2) + (flick ? -1 : 1);
    ctx.fillStyle = CAR_K;
    ctx.fillRect(fx - 1, fy - 1, sz + 2, sz + 2);
    ctx.fillStyle = cols[k % 3];
    ctx.fillRect(fx, fy, sz, sz);
  }
}

function drawCarCargo2D(ctx) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = CAR_K;
  if (INTRO_TOWN.id === 'xmas') {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-97, -20, 21, 14, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-88, -19, 3, 12);
    ctx.fillRect(-96, -14.5, 19, 3);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(-93, -31, 14, 11, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-87, -30, 2.5, 9);
  } else {
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.roundRect(-98, -21, 25, 15, 2.5);
    ctx.fill();
    ctx.stroke();
    [-92, -79].forEach((sx) => {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(sx, -13.5, 4.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

// Chunky snow tyre: tread blocks turn with the wheel, beadlock rim with a pink cap
function drawCarTyre2D(ctx, wx, wy, angle) {
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(wx, wy, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#334155';
  for (let i = 0; i < 12; i++) {
    const a = angle + (i * Math.PI * 2) / 12;
    ctx.save();
    ctx.translate(wx + Math.cos(a) * 19, wy + Math.sin(a) * 19);
    ctx.rotate(a);
    ctx.fillRect(-2.5, -3.5, 5, 7);
    ctx.restore();
  }
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(wx, wy, 14.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(wx, wy, 11.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  for (let i = 0; i < 6; i++) {
    const a = angle + (i * Math.PI) / 3;
    ctx.fillRect(wx + Math.cos(a) * 8.5 - 1.2, wy + Math.sin(a) * 8.5 - 1.2, 2.4, 2.4);
  }
  ctx.fillStyle = '#f472b6';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(wx, wy, 3.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Packed snow in the tread
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < 3; i++) {
    const a = angle * 1 + i * 2.1;
    ctx.fillRect(wx + Math.cos(a) * 18 - 1.5, wy + Math.sin(a) * 18 - 1.5, 3, 3);
  }
}

function traceOffroadBody2D(ctx) {
  ctx.beginPath();
  ctx.moveTo(-92, -6);
  ctx.lineTo(-64, -6);
  ctx.lineTo(-62, 0);
  ctx.lineTo(34, 0);
  ctx.lineTo(42, 2);
  ctx.lineTo(88, 4);
  ctx.quadraticCurveTo(98, 5, 98, 13);
  ctx.lineTo(98, 24);
  ctx.quadraticCurveTo(97, 30, 90, 30);
  ctx.lineTo(-92, 30);
  ctx.quadraticCurveTo(-99, 30, -99, 24);
  ctx.lineTo(-98, 0);
  ctx.quadraticCurveTo(-97, -6, -92, -6);
  ctx.closePath();
}

// Smooth 2D car (scenes 1–3). Origin = door line under the pilot; tyres touch y = +57.
function drawCarWithPilot(ctx, cx, cy, tiltRad = 0, now = 0, options = {}) {
  const {
    scale = 1,
    withPilot = true,
    spId = UFO_GAME.pilotSpeciesId || '01',
    isShocked = false,
    isImpactBlink = false,
    wheelAngle = now * 0.02,
    lightsOn = true,
    beam = lightsOn,
    boost = 0,
    pilotLift = 0,
  } = options;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);

  if (lightsOn) {
    const glow = 0.4 + Math.sin(now * 0.012) * 0.14;
    const ug = ctx.createRadialGradient(0, 52, 4, 0, 52, 104);
    ug.addColorStop(0, `rgba(34, 211, 238, ${glow})`);
    ug.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = ug;
    ctx.beginPath();
    ctx.ellipse(0, 50, 104, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (lightsOn && beam) {
    const light = ctx.createLinearGradient(98, 0, 220, 0);
    light.addColorStop(0, 'rgba(253, 224, 71, 0.3)');
    light.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.moveTo(96, 6);
    ctx.lineTo(220, -14);
    ctx.lineTo(220, 36);
    ctx.lineTo(96, 16);
    ctx.closePath();
    ctx.fill();
  }
  drawCarExhaustFlame(ctx, now, boost);

  // Spare tyre on the tailgate, suspension links
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-102, 6, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(-102, 6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  CAR_WHEELS.forEach((wx) => {
    ctx.beginPath();
    ctx.moveTo(wx - 12, 29);
    ctx.lineTo(wx, CAR_WHEEL_Y);
    ctx.lineTo(wx + 12, 29);
    ctx.stroke();
  });

  // Seat + cargo behind the pilot
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-60, -30, 12, 34, 4);
  ctx.fill();
  ctx.stroke();
  drawCarCargo2D(ctx);

  if (withPilot) drawCarPilot(ctx, false, now, { spId, isShocked, isImpactBlink, lift: pilotLift });

  // Body: mint paint, pink stripe, white pinstripe
  traceOffroadBody2D(ctx);
  const paint = ctx.createLinearGradient(0, -6, 0, 30);
  paint.addColorStop(0, '#a7f3e8');
  paint.addColorStop(0.4, '#2dd4bf');
  paint.addColorStop(1, '#0f766e');
  ctx.fillStyle = paint;
  ctx.fill();
  ctx.save();
  traceOffroadBody2D(ctx);
  ctx.clip();
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-100, 15, 200, 8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(-100, 12.5, 200, 1.6);
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(-100, 26, 200, 6);
  ctx.restore();
  traceOffroadBody2D(ctx);
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-56, 5);
  ctx.lineTo(30, 5);
  ctx.moveTo(48, 8);
  ctx.lineTo(86, 9);
  ctx.stroke();
  ctx.fillStyle = CAR_K;
  ctx.fillRect(-22, 6, 9, 2.6);
  drawPixelHeart(ctx, 8, 7, 1.6, '#f472b6');

  // Black fender flares
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 8;
  CAR_WHEELS.forEach((wx) => {
    ctx.beginPath();
    ctx.arc(wx, CAR_WHEEL_Y, 25, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  });

  // Windshield + snorkel (open top: no cage over the pilot)
  ctx.fillStyle = 'rgba(186, 230, 253, 0.32)';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(26, 0);
  ctx.lineTo(38, 0);
  ctx.lineTo(33, -36);
  ctx.lineTo(27, -36);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#111827';
  ctx.fillRect(54, -36, 5, 40);
  ctx.fillRect(50, -42, 12, 7);

  // Bumpers, winch, lights
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 1.8;
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(90, 20, 14, 11, 2);
  ctx.roundRect(-106, 20, 11, 11, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(102, 24, 5, 4);
  // LED light bar on the front bumper (moved off the roof so nothing sits over the pilot)
  ctx.fillStyle = CAR_K;
  ctx.beginPath();
  ctx.roundRect(88, 12, 20, 8, 2);
  ctx.fill();
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = lightsOn ? (Math.floor(now / 200 + i) % 3 === 0 ? '#ffffff' : '#fde047') : '#78716c';
    ctx.fillRect(90 + i * 6, 14, 4, 4);
  }
  ctx.fillStyle = lightsOn ? '#fde047' : '#a16207';
  ctx.beginPath();
  ctx.arc(92, 10, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = lightsOn ? '#fb7185' : '#9f1239';
  ctx.beginPath();
  ctx.roundRect(-99, 4, 4, 9, 1.5);
  ctx.fill();
  ctx.stroke();

  CAR_WHEELS.forEach((wx) => drawCarTyre2D(ctx, wx, CAR_WHEEL_Y, wheelAngle));
  ctx.restore();
}

function fillPixelDisc(ctx, cx, cy, r, color, maxY = Infinity) {
  ctx.fillStyle = color;
  for (let y = -r; y < r; y += 2) {
    const yy = y + 1;
    const half = Math.round(Math.sqrt(Math.max(0, r * r - yy * yy)) / 2) * 2;
    if (half <= 0 || cy + y >= maxY) continue;
    ctx.fillRect(cx - half, cy + y, half * 2, Math.min(2, maxY - (cy + y)));
  }
}

// 16-bit pixel car (scenes 3–5), same silhouette on a 2px grid
function drawPixelCarWithPilot(ctx, cx, cy, tiltRad = 0, now = 0, options = {}) {
  const {
    scale = 1,
    spId = UFO_GAME.pilotSpeciesId || '01',
    forceBlink = false,
    isShocked = false,
    showSmoke = false,
    wheelAngle = now * 0.02,
    lightsOn = true,
    beam = lightsOn,
    boost = 0,
    pilotLift = 0,
  } = options;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;

  if (showSmoke) {
    for (let s = 0; s < 3; s++) {
      const sp = (now * 0.0022 + s * 0.33) % 1;
      const sx = Math.round((64 + sp * 16) / 4) * 4;
      const sy = Math.round((-2 - sp * 34) / 4) * 4;
      const sz = s % 2 === 0 ? 8 : 6;
      ctx.fillStyle = s % 2 === 0 ? 'rgba(148, 163, 184, 0.7)' : 'rgba(250, 204, 21, 0.72)';
      ctx.fillRect(sx, sy, sz, sz);
    }
  }
  if (lightsOn) {
    const glow = 0.4 + (Math.floor(now / 160) % 2) * 0.16;
    ctx.fillStyle = `rgba(34, 211, 238, ${glow})`;
    ctx.fillRect(-86, 54, 172, 4);
  }
  if (lightsOn && beam) {
    ctx.fillStyle = 'rgba(253, 224, 71, 0.18)';
    ctx.fillRect(100, 4, 44, 14);
    ctx.fillStyle = 'rgba(253, 224, 71, 0.09)';
    ctx.fillRect(144, 0, 44, 22);
  }
  drawCarExhaustFlame(ctx, now, boost);

  // Spare tyre, suspension, seat
  fillPixelDisc(ctx, -102, 6, 14, CAR_K);
  fillPixelDisc(ctx, -102, 6, 12, '#1f2937');
  fillPixelDisc(ctx, -102, 6, 6, '#64748b');
  ctx.fillStyle = '#64748b';
  CAR_WHEELS.forEach((wx) => {
    ctx.fillRect(wx - 12, 28, 4, 4);
    ctx.fillRect(wx - 8, 30, 4, 4);
    ctx.fillRect(wx + 8, 28, 4, 4);
    ctx.fillRect(wx + 4, 30, 4, 4);
  });
  ctx.fillStyle = CAR_K;
  ctx.fillRect(-62, -32, 16, 38);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-60, -30, 12, 34);

  if (INTRO_TOWN.id === 'xmas') {
    ctx.fillStyle = CAR_K;
    ctx.fillRect(-99, -22, 26, 18);
    ctx.fillRect(-95, -34, 18, 14);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-97, -20, 22, 14);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-93, -32, 14, 10);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-88, -20, 4, 14);
    ctx.fillRect(-97, -14, 22, 2);
  } else {
    ctx.fillStyle = CAR_K;
    ctx.fillRect(-100, -24, 28, 20);
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-98, -22, 24, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-96, -18, 8, 8);
    ctx.fillRect(-84, -18, 8, 8);
  }

  drawCarPilot(ctx, true, now, { spId, isShocked, isImpactBlink: forceBlink, lift: pilotLift });

  // Body blocks: outline, mint fill, highlight, pink stripe, black rocker
  const blocks = [
    [-96, -6, 34, 36],
    [-60, 0, 98, 30],
    [40, 4, 54, 26],
    [94, 10, 4, 18],
  ];
  ctx.fillStyle = CAR_K;
  blocks.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#2dd4bf';
  blocks.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#99f6e4';
  blocks.slice(0, 3).forEach(([x, y, w]) => ctx.fillRect(x, y, w, 4));
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-96, 12, 194, 2);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-96, 14, 194, 8);
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(-96, 24, 194, 6);
  ctx.fillStyle = CAR_K;
  ctx.fillRect(-22, 6, 8, 2);
  drawPixelHeart(ctx, 8, 6, 2, '#f472b6');

  // Fender flares
  ctx.fillStyle = '#111827';
  CAR_WHEELS.forEach((wx) => {
    ctx.fillRect(wx - 26, 12, 6, 10);
    ctx.fillRect(wx - 22, 8, 8, 6);
    ctx.fillRect(wx - 14, 6, 28, 6);
    ctx.fillRect(wx + 14, 8, 8, 6);
    ctx.fillRect(wx + 20, 12, 6, 10);
  });

  // Windshield pillar + snorkel (open top)
  ctx.fillStyle = CAR_K;
  ctx.fillRect(26, -40, 8, 42);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(28, -38, 4, 38);
  ctx.fillStyle = '#111827';
  ctx.fillRect(54, -36, 6, 40);
  ctx.fillRect(50, -42, 12, 8);

  // Bumpers, lights
  ctx.fillStyle = CAR_K;
  ctx.fillRect(90, 18, 16, 14);
  ctx.fillRect(-108, 18, 14, 14);
  ctx.fillRect(86, 6, 10, 10);
  ctx.fillRect(-100, 2, 8, 14);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(104, 24, 4, 4);
  ctx.fillStyle = CAR_K;
  ctx.fillRect(88, 12, 20, 8);
  ctx.fillStyle = lightsOn ? '#fde047' : '#78716c';
  for (let i = 0; i < 3; i++) ctx.fillRect(90 + i * 6, 14, 4, 4);
  ctx.fillStyle = lightsOn ? '#fde047' : '#a16207';
  ctx.fillRect(88, 8, 6, 6);
  ctx.fillStyle = lightsOn ? '#fb7185' : '#9f1239';
  ctx.fillRect(-98, 4, 4, 10);

  // Tyres with stepped tread blocks
  const step = Math.floor(((wheelAngle % (Math.PI / 4)) + Math.PI / 4) / (Math.PI / 8)) % 2;
  CAR_WHEELS.forEach((wx) => {
    fillPixelDisc(ctx, wx, CAR_WHEEL_Y, 22, CAR_K);
    fillPixelDisc(ctx, wx, CAR_WHEEL_Y, 20, '#1f2937');
    ctx.fillStyle = '#475569';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + (step * Math.PI) / 8;
      ctx.fillRect(Math.round(wx + Math.cos(a) * 17) - 2, Math.round(CAR_WHEEL_Y + Math.sin(a) * 17) - 2, 4, 4);
    }
    fillPixelDisc(ctx, wx, CAR_WHEEL_Y, 12, '#94a3b8');
    fillPixelDisc(ctx, wx, CAR_WHEEL_Y, 9, '#475569');
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(wx - 2, CAR_WHEEL_Y - 2, 4, 4);
  });

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Obstacles, ice ledges, jellies and potions
// ---------------------------------------------------------------------------
function drawCarObstacle(ctx, o, groundY, now) {
  ctx.save();
  ctx.lineJoin = 'round';
  const x = Math.round(o.x);
  const base = groundY - o.lift; // surface the obstacle stands on (snow or a ledge)

  if (o.type === 'SPIKE') {
    ctx.fillStyle = 'rgba(9, 13, 26, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 23, base + 2, 28, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    [
      [4, 26, 30],
      [14, 40, 38],
      [26, 22, 28],
    ].forEach(([dx, w, h]) => {
      const g = ctx.createLinearGradient(x + dx, base - h, x + dx + w, base);
      g.addColorStop(0, '#f0f9ff');
      g.addColorStop(1, '#38bdf8');
      ctx.fillStyle = g;
      ctx.strokeStyle = '#0c4a6e';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x + dx, base);
      ctx.lineTo(x + dx + w / 2, base - h);
      ctx.lineTo(x + dx + w / 2 + 0.01 + w / 2 - 6, base);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(x + 30, base - 28, 3, 10);
  } else if (o.type === 'WALL') {
    const h = 152;
    const g = ctx.createLinearGradient(x, 0, x + 54, 0);
    g.addColorStop(0, '#e0f2fe');
    g.addColorStop(0.5, '#7dd3fc');
    g.addColorStop(1, '#0284c7');
    ctx.fillStyle = 'rgba(9, 13, 26, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 27, base + 2, 34, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = g;
    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(x + 4, base);
    ctx.lineTo(x + 2, base - h + 18);
    ctx.lineTo(x + 14, base - h);
    ctx.lineTo(x + 40, base - h + 4);
    ctx.lineTo(x + 52, base - h + 22);
    ctx.lineTo(x + 50, base);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(x + 2, base - h + 18);
    ctx.lineTo(x + 14, base - h - 4);
    ctx.lineTo(x + 40, base - h);
    ctx.lineTo(x + 53, base - h + 20);
    ctx.lineTo(x + 40, base - h + 12);
    ctx.lineTo(x + 14, base - h + 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(12, 74, 110, 0.5)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x + 30, base - h + 20);
    ctx.lineTo(x + 22, base - 90);
    ctx.lineTo(x + 34, base - 60);
    ctx.lineTo(x + 26, base - 24);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(x + 10, base - h + 30, 5, 50);
  } else if (o.type === 'GIFTS') {
    const palette = [
      ['#ef4444', '#fde047'],
      ['#22c55e', '#f8fafc'],
      ['#8b5cf6', '#fde047'],
    ];
    const [c1, r1] = palette[o.seed % 3];
    const [c2, r2] = palette[(o.seed + 1) % 3];
    ctx.strokeStyle = CAR_K;
    ctx.lineWidth = 2.4;
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.roundRect(x + 2, base - 32, 52, 32, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = r1;
    ctx.fillRect(x + 25, base - 31, 6, 30);
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.roundRect(x + 10, base - 56, 36, 24, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = r2;
    ctx.fillRect(x + 25, base - 55, 6, 22);
  } else if (o.type === 'SNOWMAN') {
    const cx = x + 25;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.4;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, base - 21, 21, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, base - 56, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 17, base - 32);
    ctx.lineTo(cx - 32, base - 46);
    ctx.moveTo(cx + 17, base - 32);
    ctx.lineTo(cx + 30, base - 44);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 13, base - 43, 26, 6);
    ctx.fillRect(cx + 4, base - 41, 6, 13);
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - 15, base - 72, 30, 5);
    ctx.fillRect(cx - 9, base - 89, 18, 18);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 9, base - 76, 18, 4);
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - 8, base - 62, 4, 4);
    ctx.fillRect(cx + 2, base - 62, 4, 4);
    ctx.fillRect(cx - 2, base - 26, 4, 4);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(cx - 2, base - 57);
    ctx.lineTo(cx - 19, base - 54);
    ctx.lineTo(cx - 2, base - 51);
    ctx.closePath();
    ctx.fill();
  } else if (o.type === 'SKUA') {
    const flap = Math.floor((now + o.seed * 37) / 140) % 2;
    const y = base - 18;
    ctx.fillStyle = '#57534e';
    ctx.strokeStyle = CAR_K;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    if (flap) {
      ctx.moveTo(x + 20, y);
      ctx.lineTo(x + 34, y - 20);
      ctx.lineTo(x + 46, y - 2);
    } else {
      ctx.moveTo(x + 20, y + 2);
      ctx.lineTo(x + 36, y + 18);
      ctx.lineTo(x + 46, y + 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.ellipse(x + 32, y + 2, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e7e5e4';
    ctx.beginPath();
    ctx.ellipse(x + 28, y + 6, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.arc(x + 10, y - 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 3);
    ctx.lineTo(x - 6, y);
    ctx.lineTo(x + 2, y + 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = CAR_K;
    ctx.fillRect(x + 7, y - 5, 3, 3);
    ctx.fillRect(x + 5, y - 9, 8, 2);
    ctx.fillStyle = '#57534e';
    ctx.beginPath();
    ctx.moveTo(x + 54, y);
    ctx.lineTo(x + 64, y - 5);
    ctx.lineTo(x + 64, y + 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawIceLedge(ctx, p, groundY) {
  const x0 = Math.round(p.a);
  const w = Math.round(p.b - p.a);
  const y = groundY - p.top;
  ctx.save();
  // Icicles under the slab
  ctx.fillStyle = '#7dd3fc';
  ctx.strokeStyle = '#0c4a6e';
  ctx.lineWidth = 1.6;
  for (let ix = x0 + 10; ix < x0 + w - 8; ix += 26) {
    const len = 10 + ((ix - x0) % 3) * 5;
    ctx.beginPath();
    ctx.moveTo(ix, y + 18);
    ctx.lineTo(ix + 5, y + 18 + len);
    ctx.lineTo(ix + 10, y + 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  const g = ctx.createLinearGradient(0, y, 0, y + 22);
  g.addColorStop(0, '#e0f2fe');
  g.addColorStop(1, '#38bdf8');
  ctx.fillStyle = g;
  ctx.strokeStyle = '#0c4a6e';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(x0, y, w, 20, 6);
  ctx.fill();
  ctx.stroke();
  // Snow cap
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(x0 - 3, y - 5, w + 6, 9, 5);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  for (let ix = x0 + 6; ix < x0 + w - 10; ix += 34) ctx.fillRect(ix, y - 8, 14, 4);
  ctx.restore();
}

function drawCarJelly(ctx, j, groundY, now) {
  const bob = Math.sin(now * 0.008 + j.x * 0.03) * 2;
  const x = j.x;
  const y = groundY - j.h + bob;
  ctx.save();
  if (j.kind === 'jelly') {
    // Little fish snack facing the car
    ctx.fillStyle = '#7dd3fc';
    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 13, y - 6);
    ctx.lineTo(x + 13, y + 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x - 1, y, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 5, y - 3, 3, 2);
    ctx.fillStyle = CAR_K;
    ctx.fillRect(x - 6, y - 2, 2, 2);
  } else if (j.kind === 'gold') {
    ctx.translate(x, y);
    drawGoldenStarCollectible(ctx, 15, now);
  } else {
    const big = j.kind === 'potionBig';
    const w = big ? 22 : 16;
    const h = big ? 24 : 18;
    ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y, w, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = CAR_K;
    ctx.lineWidth = 2;
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2 + 3, w, h, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(x - 4, y - h / 2 - 3, 8, 6);
    ctx.strokeRect(x - 4, y - h / 2 - 3, 8, 6);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - 3, y - h / 2 - 7, 6, 4);
    drawPixelHeart(ctx, x, y + 4, big ? 2 : 1.5, '#ffffff');
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Snow trail world: scrolling sky, pine ridge, trail markers, snow with tyre tracks, crevasses
// ---------------------------------------------------------------------------
function drawCarSnowWorld(ctx, now, run) {
  const scroll = run.distance;
  ensureIntroBackgrounds();
  const img = MOTION_STATE.bgRefSkyGameImg;
  if (MOTION_STATE.bgRefSkyGameLoaded && img) {
    ctx.imageSmoothingEnabled = true;
    const tile = 1920;
    const off = -((scroll * 0.12) % tile);
    for (let k = 0; k < 2; k++) {
      const x = Math.floor(off + k * tile);
      ctx.drawImage(img, x, 0, 961, 540);
      ctx.save();
      ctx.translate(x + tile, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, 961, 540);
      ctx.restore();
    }
  } else {
    const sky = ctx.createLinearGradient(0, 0, 0, 540);
    sky.addColorStop(0, '#0284c7');
    sky.addColorStop(1, '#bae6fd');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 960, 540);
  }

  const G = CAR_CFG.GROUND_Y;
  const isXmas = INTRO_TOWN.id === 'xmas';

  // Snowy pine ridge (parallax)
  const ridgeOff = -((scroll * 0.4) % 150);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, G - 40, 960, 40);
  for (let k = -1; k < 8; k++) {
    const tx = Math.round(ridgeOff + k * 150);
    const idx = Math.floor(scroll * 0.4 / 150) + k;
    const th = 46 + (Math.abs(idx * 37) % 3) * 14;
    ctx.fillStyle = '#1e5a4f';
    ctx.beginPath();
    ctx.moveTo(tx + 40, G - 40 - th);
    ctx.lineTo(tx + 64, G - 40);
    ctx.lineTo(tx + 16, G - 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(tx + 40, G - 40 - th);
    ctx.lineTo(tx + 50, G - 40 - th * 0.55);
    ctx.lineTo(tx + 30, G - 40 - th * 0.55);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, G - 42, 960, 3);

  // Crevasse base under everything; the snow is drawn on top of it
  const crev = ctx.createLinearGradient(0, G, 0, 540);
  crev.addColorStop(0, '#0369a1');
  crev.addColorStop(0.35, '#0c4a6e');
  crev.addColorStop(1, '#020617');
  ctx.fillStyle = crev;
  ctx.fillRect(0, G - 2, 960, 540 - G + 2);

  // Trail marker posts with string lights (only where there is snow under them)
  const postGap = 300;
  const postOff = -(scroll % postGap);
  const onSnow = (px) => run.ground.some((g) => g.a < px && g.b > px);
  const bulbCols = isXmas ? ['#ef4444', '#22c55e', '#facc15', '#38bdf8'] : ['#f9a8d4', '#fff1f2', '#f472b6', '#fde047'];
  for (let k = -1; k < 5; k++) {
    const px = Math.round(postOff + k * postGap);
    const nx = px + postGap;
    if (onSnow(px) && onSnow(nx)) {
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px, G - 104);
      ctx.quadraticCurveTo(px + postGap / 2, G - 80, nx, G - 104);
      ctx.stroke();
      for (let b = 1; b < 10; b++) {
        const t = b / 10;
        const bx = Math.round(px + postGap * t);
        const by = Math.round(G - 104 + 2 * t * (1 - t) * 24 + 3);
        const lit = (Math.floor(now / 380) + b + k) % 3 !== 0;
        ctx.fillStyle = CAR_K;
        ctx.fillRect(bx - 3, by - 1, 6, 7);
        ctx.fillStyle = lit ? bulbCols[(b + k + 8) % 4] : '#475569';
        ctx.fillRect(bx - 2, by, 4, 5);
      }
    }
    if (onSnow(px)) {
      ctx.fillStyle = CAR_K;
      ctx.fillRect(px - 3, G - 108, 6, 86);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(px - 2, G - 106, 4, 82);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(px + 2, G - 106, 14, 9);
      ctx.fillStyle = CAR_K;
      ctx.fillRect(px + 2, G - 98, 14, 1);
    }
  }

  // Snow segments
  const trackOff = -(scroll % 44);
  run.ground.forEach((g) => {
    if (g.b < -30 || g.a > 990) return;
    const x0 = Math.max(-30, Math.round(g.a));
    const x1 = Math.min(990, Math.round(g.b));
    const snow = ctx.createLinearGradient(0, G, 0, 540);
    snow.addColorStop(0, '#ffffff');
    snow.addColorStop(0.45, '#e0f2fe');
    snow.addColorStop(1, '#bfdbfe');
    ctx.fillStyle = snow;
    ctx.fillRect(x0, G - 2, x1 - x0, 540 - G + 2);
    // Drift bumps along the top
    ctx.fillStyle = '#ffffff';
    const bumpOff = -(scroll % 28);
    for (let bx = bumpOff; bx < 990; bx += 28) {
      if (bx + 22 < x0 || bx > x1) continue;
      const bh = 3 + (Math.abs(Math.round((bx - bumpOff) / 28 + Math.floor(scroll / 28))) % 3) * 2;
      const l = Math.max(x0, Math.round(bx));
      const r = Math.min(x1, Math.round(bx) + 22);
      if (r > l) ctx.fillRect(l, G - 2 - bh, r - l, bh);
    }
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(x0, G + 6, x1 - x0, 2);
    // Tyre tracks
    ctx.fillStyle = 'rgba(100, 116, 139, 0.22)';
    ctx.fillRect(x0, G + 18, x1 - x0, 7);
    ctx.fillRect(x0, G + 34, x1 - x0, 7);
    ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
    for (let tx = trackOff; tx < 990; tx += 11) {
      if (tx < x0 || tx + 5 > x1) continue;
      ctx.fillRect(Math.round(tx), G + 19, 5, 5);
      ctx.fillRect(Math.round(tx) + 4, G + 35, 5, 5);
    }
    // Crevasse walls + icicles where a pit starts or ends
    [
      [g.a, 1],
      [g.b, -1],
    ].forEach(([edge, dir]) => {
      if (edge < -20 || edge > 980) return;
      const ex = Math.round(edge);
      const wallX = dir === 1 ? ex : ex - 10;
      if (run.ground.some((o) => o !== g && Math.abs((dir === 1 ? o.b : o.a) - edge) < 1)) return; // joined segments
      const wg = ctx.createLinearGradient(0, G, 0, 540);
      wg.addColorStop(0, '#7dd3fc');
      wg.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = wg;
      ctx.fillRect(wallX, G, 10, 540 - G);
      ctx.fillStyle = '#e0f2fe';
      for (let iy = 0; iy < 3; iy++) {
        const ix = ex - dir * (6 + iy * 9);
        ctx.beginPath();
        ctx.moveTo(ix - 4, G + 2);
        ctx.lineTo(ix, G + 14 + iy * 4);
        ctx.lineTo(ix + 4, G + 2);
        ctx.closePath();
        ctx.fill();
      }
    });
  });

  // Speed streaks + falling snow
  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  for (let w = 0; w < 8; w++) {
    const wx = 960 - (((now * (0.5 + (w % 3) * 0.16) + w * 149 + scroll * 0.4) % 1100) | 0);
    const wy = 92 + ((w * 47) % 220);
    ctx.fillRect(wx, wy, 60 + (w % 4) * 26, 2);
  }
  if (isXmas) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let s = 0; s < 26; s++) {
      const sx = ((((s * 97 - scroll * 0.55 - now * 0.02) % 980) + 980) % 980) - 10;
      const sy = (s * 53 + now * 0.06) % (G - 30);
      ctx.fillRect(Math.round(sx), Math.round(sy), s % 3 === 0 ? 4 : 2, s % 3 === 0 ? 4 : 2);
    }
  }
}

function drawCarRunHud(ctx, now, run) {
  ctx.save();
  const hx = 16;
  const hy = 12;
  const hw = 500;
  const hh = 34;
  ctx.fillStyle = 'rgba(9, 13, 26, 0.88)';
  ctx.fillRect(hx - 2, hy - 2, hw + 4, hh + 4);
  ctx.strokeStyle = '#f472b6';
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
    ctx.fillText(CURRENT_LANG === 'ko' ? 'GUEST (기본)' : 'GUEST', hx + 12, hy + hh / 2 + 1);
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.fillText(`SCORE ${run.score.toLocaleString()}`, hx + 100, hy + hh / 2 + 1);

  // Energy bar (blinks when low)
  const bx = hx + 222;
  const bw = 150;
  const ratio = Math.max(0, run.energy / CAR_CFG.ENERGY_MAX);
  const low = ratio < 0.25;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(bx, hy + 11, bw, 12);
  ctx.fillStyle = low && Math.floor(now / 200) % 2 === 0 ? '#fecdd3' : low ? '#fb7185' : '#f472b6';
  ctx.fillRect(bx, hy + 11, Math.round(bw * ratio), 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(bx, hy + 11, Math.round(bw * ratio), 3);
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(bx, hy + 11, bw, 12);
  drawPixelHeart(ctx, bx - 10, hy + hh / 2, 1.8, '#f472b6');

  const kmh = Math.round(run.speed * 12);
  ctx.fillStyle = run.level >= 7 ? '#fb7185' : run.level >= 4 ? '#fde047' : '#bae6fd';
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`LV.${run.level} · ${kmh}km/h`, hx + hw - 12, hy + hh / 2 + 1);
  ctx.restore();
}

// ============================================================================
// CAR GAME STATE + SCENE 3 FRAME (sceneIdx === 2 with MOTION_STATE.vehicle === 'car')
// ============================================================================
const CAR_GAME = {
  run: null,
  lastTickAt: 0,
  particles: [],
  popups: [],
  shakeUntil: 0,
  hitFlashUntil: 0,
  landAt: 0,
  lastFinalScore: 0,
  lastRank: null,
  lastBestScore: 0,
  lastIsNewBest: false,
  scoreSubmitted: false,
};

function resetCarGame(now = performance.now()) {
  CAR_GAME.run = createCarRun(now);
  CAR_GAME.lastTickAt = now;
  CAR_GAME.particles = [];
  CAR_GAME.popups = [];
  CAR_GAME.shakeUntil = 0;
  CAR_GAME.hitFlashUntil = 0;
  CAR_GAME.landAt = 0;
  CAR_GAME.scoreSubmitted = false;
}

function carGameActive() {
  return MOTION_STATE.vehicle === 'car' && MOTION_STATE.sceneIdx === 2 && Boolean(CAR_GAME.run);
}

function carJumpPress(now = performance.now()) {
  if (!carGameActive()) return;
  carPressJump(CAR_GAME.run, now);
}

function carJumpRelease() {
  if (!CAR_GAME.run) return;
  carReleaseJump(CAR_GAME.run);
}

function spawnCarBurst(x, y, cols, count = 10, speed = 4, size = 6) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const sp = speed * (0.5 + Math.random() * 0.8);
    CAR_GAME.particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 1.2,
      col: cols[i % cols.length],
      sz: size - (i % 3),
      alpha: 1,
      decay: 0.03,
      grav: 0.18,
    });
  }
}

async function submitCarScoreToServer(tokenId, score, cleared) {
  if (
    !UFO_GAME.hasNft ||
    tokenId === null ||
    tokenId === undefined ||
    !/^\d+$/.test(String(tokenId).trim()) ||
    CAR_GAME.scoreSubmitted ||
    score <= 0
  ) {
    return;
  }
  CAR_GAME.scoreSubmitted = true;
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'car', tokenId: Number(String(tokenId).trim()), score, kills: cleared }),
    });
    if (res.ok) {
      const data = await res.json();
      CAR_GAME.lastRank = data.rank || null;
      CAR_GAME.lastBestScore = data.best_score || score;
      CAR_GAME.lastIsNewBest = Boolean(data.is_new_best);
      if (Array.isArray(data.items) && RANKING_GAME === 'car') {
        RANKING_PAGE_CACHE = data.items;
        renderRankingPageList();
      }
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

function triggerCarCrash(now = performance.now()) {
  const run = CAR_GAME.run;
  CAR_GAME.shakeUntil = now + 520;
  CAR_GAME.lastFinalScore = Math.max(1, run.score);
  CAR_GAME.lastRank = null;
  CAR_GAME.lastBestScore = 0;
  if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
    submitCarScoreToServer(UFO_GAME.pilotTokenId, CAR_GAME.lastFinalScore, run.cleared);
  }
  setIntroScene(3, true);
}

function drawCarRunnerFrame(ctx, now, spId) {
  if (!CAR_GAME.run) resetCarGame(now);
  const run = CAR_GAME.run;
  const dt = Math.min(32, Math.max(8, now - (CAR_GAME.lastTickAt || now))) / 16.67;
  CAR_GAME.lastTickAt = now;
  const S = CAR_CFG.CAR_SCALE;
  const G = CAR_CFG.GROUND_Y;
  const carOriginY = () => G - CAR_CFG.WHEEL_BOTTOM * S - run.h;
  const ko = CURRENT_LANG === 'ko';

  const events = carStep(run, dt, now, Math.random);
  let crashed = false;
  events.forEach((ev) => {
    if (ev.type === 'jump') {
      spawnCarBurst(CAR_CFG.CAR_X - 56 * S, carOriginY() + 54 * S, ['#f8fafc', '#cbd5e1'], 6, 2.6, 6);
    } else if (ev.type === 'double') {
      spawnCarBurst(CAR_CFG.CAR_X, carOriginY() + 40 * S, ['#67e8f9', '#f472b6', '#ffffff'], 12, 3.6, 5);
    } else if (ev.type === 'land') {
      CAR_GAME.landAt = now;
      spawnCarBurst(CAR_CFG.CAR_X - 56 * S, carOriginY() + 54 * S, ['#f8fafc', '#e2e8f0', '#bae6fd'], 6, 3, 6);
      spawnCarBurst(CAR_CFG.CAR_X + 58 * S, carOriginY() + 54 * S, ['#f8fafc', '#e2e8f0', '#bae6fd'], 6, 3, 6);
    } else if (ev.type === 'jelly') {
      spawnCarBurst(ev.x, G - ev.h, ['#bae6fd', '#ffffff'], 3, 1.6, 3);
    } else if (ev.type === 'gold') {
      CAR_GAME.popups.push({ x: ev.x, y: G - ev.h - 18, vy: -1.6, text: `+${ev.points}`, col: '#fde047', alpha: 1 });
      spawnCarBurst(ev.x, G - ev.h, ['#fde047', '#fef08a', '#ffffff'], 8, 3.2, 5);
    } else if (ev.type === 'potion') {
      CAR_GAME.popups.push({ x: ev.x, y: G - ev.h - 20, vy: -1.4, text: `ENERGY +${ev.gain}`, col: '#f472b6', alpha: 1 });
      spawnCarBurst(ev.x, G - ev.h, ['#f472b6', '#fbcfe8', '#ffffff'], 10, 3, 5);
    } else if (ev.type === 'hit') {
      const o = ev.obstacle;
      const cols =
        o.type === 'SPIKE' || o.type === 'WALL'
          ? ['#e0f2fe', '#7dd3fc', '#ffffff']
          : o.type === 'GIFTS'
          ? ['#ef4444', '#22c55e', '#fde047']
          : o.type === 'SNOWMAN'
          ? ['#f8fafc', '#e2e8f0', '#f97316']
          : ['#78716c', '#e7e5e4', '#facc15'];
      spawnCarBurst(o.x + o.w / 2, G - o.lift - 24, cols, 16, 5, 7);
      CAR_GAME.hitFlashUntil = now + 520;
      CAR_GAME.shakeUntil = now + 300;
      CAR_GAME.popups.push({ x: CAR_CFG.CAR_X, y: carOriginY() - 100, vy: -1.5, text: `ENERGY -${ev.cost}`, col: '#fb7185', alpha: 1 });
    } else if (ev.type === 'rescue') {
      CAR_GAME.shakeUntil = now + 260;
      spawnCarBurst(CAR_CFG.CAR_X, carOriginY(), ['#ffffff', '#67e8f9', '#fde047'], 18, 4.5, 6);
      CAR_GAME.popups.push({
        x: CAR_CFG.CAR_X + 40,
        y: carOriginY() - 110,
        vy: -1.2,
        text: ko ? `크레바스 탈출! ENERGY -${CAR_CFG.PIT_RESCUE_ENERGY}` : `Pulled out! ENERGY -${CAR_CFG.PIT_RESCUE_ENERGY}`,
        col: '#fde047',
        alpha: 1,
      });
    } else if (ev.type === 'level') {
      CAR_GAME.popups.push({ x: 480, y: 92, vy: -1.2, text: `LV.${ev.level} SPEED UP! +${ev.points}`, col: '#fde047', alpha: 1 });
    } else if (ev.type === 'crash') {
      crashed = true;
    }
  });

  ctx.save();
  if (now < CAR_GAME.shakeUntil) {
    const mag = ((CAR_GAME.shakeUntil - now) / 520) * 8;
    ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
  }

  drawCarSnowWorld(ctx, now, run);
  run.ledges.forEach((p) => {
    if (p.b > -40 && p.a < 1000) drawIceLedge(ctx, p, G);
  });
  run.obstacles.forEach((o) => {
    if (o.x < 1000) drawCarObstacle(ctx, o, G, now);
  });
  run.jellies.forEach((j) => {
    if (j.x < 990) drawCarJelly(ctx, j, G, now);
  });

  // Shadow on whatever surface is under the car
  const under = carSurfacesUnder(run).filter((top) => top <= run.h + 0.5);
  if (under.length) {
    const top = Math.max(...under);
    const gap = run.h - top;
    ctx.fillStyle = `rgba(9, 13, 26, ${Math.max(0.1, 0.3 - gap * 0.001)})`;
    ctx.beginPath();
    ctx.ellipse(CAR_CFG.CAR_X + 2, G - top + 2, Math.max(60, 170 - gap * 0.45) / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const sinceLand = now - CAR_GAME.landAt;
  const squash = sinceLand < 140 && run.grounded ? Math.sin((sinceLand / 140) * Math.PI) * 3 : 0;
  const bob = run.grounded ? Math.round(Math.sin(now * 0.05) * 1.2) + squash : 0;
  const tilt = run.grounded ? 0 : Math.max(-0.2, Math.min(0.22, -run.vh * 0.014));
  const invuln = now < run.invulnUntil;
  if (!invuln || Math.floor(now / 90) % 2 === 0) {
    drawCarWithPilot(ctx, CAR_CFG.CAR_X, carOriginY() + bob, tilt, now, {
      scale: S,
      spId,
      isShocked: now < CAR_GAME.hitFlashUntil || run.h < -10,
      isImpactBlink: now < CAR_GAME.hitFlashUntil - 420,
      wheelAngle: run.distance / 20,
      boost: run.grounded ? 0.6 + (run.speed - CAR_CFG.SPEED) / 10 : 1.4,
    });
  }

  for (let i = CAR_GAME.particles.length - 1; i >= 0; i--) {
    const pt = CAR_GAME.particles[i];
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vy += (pt.grav || 0) * dt;
    pt.alpha -= pt.decay * dt;
    if (pt.alpha <= 0) {
      CAR_GAME.particles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.alpha);
    ctx.fillStyle = CAR_K;
    ctx.fillRect(pt.x - pt.sz / 2 - 1, pt.y - pt.sz / 2 - 1, pt.sz + 2, pt.sz + 2);
    ctx.fillStyle = pt.col;
    ctx.fillRect(pt.x - pt.sz / 2, pt.y - pt.sz / 2, pt.sz, pt.sz);
    ctx.restore();
  }
  for (let i = CAR_GAME.popups.length - 1; i >= 0; i--) {
    const pop = CAR_GAME.popups[i];
    pop.y += pop.vy * dt;
    pop.alpha -= 0.024 * dt;
    if (pop.alpha <= 0) {
      CAR_GAME.popups.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, pop.alpha);
    ctx.font = '900 14px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = CAR_K;
    ctx.fillText(pop.text, pop.x + 2, pop.y + 2);
    ctx.fillStyle = pop.col;
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  drawCarRunHud(ctx, now, run);

  if (run.jumps < 4 && now - run.startAt < 10000) {
    const msg = ko ? '누르면 점프 · 공중에서 한 번 더 누르면 2단 점프' : 'Tap to jump · tap again in the air to double jump';
    ctx.save();
    ctx.font = '800 14px "Pretendard", "Malgun Gothic", sans-serif';
    const tw = Math.ceil(ctx.measureText(msg).width) + 28;
    const bx = 480 - tw / 2;
    const by = 112;
    ctx.fillStyle = 'rgba(9, 13, 26, 0.82)';
    ctx.fillRect(bx, by, tw, 30);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(bx, by, 4, 30);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(msg, 480 + 2, by + 16);
    ctx.restore();
  }

  ctx.restore();

  if (crashed) triggerCarCrash(now);
}

// Snow road the car flees along (scene 2) and is dragged back on (scene 4): packed snow, ruts, marker posts
// moving by `scroll`, and a crack from the pillar side reaching to x = crackEnd
function drawCarSnowRoad(ctx, groundY, scroll, crackEnd) {
  ctx.save();
  ctx.fillStyle = '#e8f1f8';
  ctx.fillRect(0, groundY - 30, 960, 100);
  ctx.fillStyle = '#c9dcea';
  ctx.fillRect(0, groundY - 30, 960, 6);
  ctx.fillStyle = '#b8cfe0';
  ctx.fillRect(0, groundY - 6, 960, 4);
  ctx.fillRect(0, groundY + 18, 960, 4);
  for (let k = 0; k < 8; k++) {
    const mx = 960 - ((scroll + k * 160) % 1120) + 80;
    ctx.fillStyle = CAR_K;
    ctx.fillRect(Math.round(mx) - 1, groundY - 58, 8, 32);
    ctx.fillStyle = k % 2 ? '#ef4444' : '#f8fafc';
    ctx.fillRect(Math.round(mx), groundY - 57, 6, 10);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(Math.round(mx), groundY - 47, 6, 20);
  }
  // The crack chasing the car from the pillar side
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 6);
  for (let x = 0; x <= crackEnd; x += 24) ctx.lineTo(x, groundY + 6 + (((x * 7) % 13) - 6));
  ctx.stroke();
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

// ============================================================================
// SCENE 2 — car escape: the pillar behind (left) sucks at the car; it floors it, gets dragged back with the tyres
// spinning, breaks free and races off to the right. It never leaves the ground: running away, not lifting off.
// ============================================================================
function drawCarScene1Liftoff(ctx, now, p, spId) {
  const S = 1.15;
  const groundY = 478;
  const ko = CURRENT_LANG === 'ko';
  // 0-0.3 floor it | 0.3-0.58 dragged back, struggling | 0.58-1 breaks free and races off
  let carX;
  let phase;
  if (p < 0.3) {
    carX = 190 + (p / 0.3) * 190;
    phase = 'go';
  } else if (p < 0.58) {
    const d = (p - 0.3) / 0.28;
    carX = 380 - Math.sin(d * Math.PI * 0.5) * 90 + Math.sin(now * 0.08) * 3;
    phase = 'drag';
  } else {
    const f = (p - 0.58) / 0.42;
    carX = 290 + f * f * 860;
    phase = 'free';
  }
  const shake = phase === 'drag' ? Math.sin(now * 0.11) * 2 : 0;
  const hop = Math.abs(Math.sin(now * 0.03)) * (phase === 'free' ? 2 : 4);
  const carY = groundY - CAR_CFG.WHEEL_BOTTOM * S - hop + shake;
  // Rear squats while dragged (nose up), nose dips as it breaks free
  const tilt = phase === 'drag' ? -0.07 + Math.sin(now * 0.06) * 0.02 : phase === 'free' ? 0.03 : -0.02;
  const scroll = now * (phase === 'free' ? 0.9 : phase === 'go' ? 0.5 : 0.25);

  drawCarSnowRoad(ctx, groundY, scroll, Math.min(carX - 120 * S, 120 + p * 520));

  // Snow thrown back by the tyres: a big rooster tail while it fights the pull
  ctx.save();
  const n = phase === 'drag' ? 18 : 12;
  for (let t = 0; t < n; t++) {
    const tp = (now * (phase === 'drag' ? 0.006 : 0.004) + t / n) % 1;
    const tx = carX - 70 * S - tp * (phase === 'drag' ? 120 : 170) + Math.sin(t * 2.1) * 10;
    const ty = groundY - 6 - Math.sin(tp * Math.PI) * (phase === 'drag' ? 70 : 40);
    const sz = Math.max(4, Math.round((1 - tp) * 12));
    ctx.fillStyle = CAR_K;
    ctx.fillRect(tx - 1, ty - 1, sz + 2, sz + 2);
    ctx.fillStyle = t % 3 === 0 ? '#bae6fd' : '#f8fafc';
    ctx.fillRect(tx, ty, sz, sz);
  }
  // Speed lines once it is free
  if (phase === 'free') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    for (let i = 0; i < 12; i++) {
      const ly = 300 + ((i * 47) % 170);
      const lx = ((now * 1.4 + i * 211) % 1100) - 140;
      ctx.lineWidth = i % 3 === 0 ? 3 : 1.6;
      ctx.beginPath();
      ctx.moveTo(960 - lx, ly);
      ctx.lineTo(960 - lx - 120, ly);
      ctx.stroke();
    }
  }
  ctx.fillStyle = 'rgba(9, 13, 26, 0.3)';
  ctx.beginPath();
  ctx.ellipse(carX, groundY + 2, 104, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawCarWithPilot(ctx, carX, carY, tilt, now, {
    scale: S,
    spId,
    isShocked: phase === 'drag',
    wheelAngle: now * (phase === 'drag' ? 0.12 : 0.06),
    boost: phase === 'free' ? 2.2 : phase === 'drag' ? 2.6 : 1.4,
  });

  const line =
    phase === 'go'
      ? ko ? '기둥이 다 빨아들인다!! 풀악셀 밟는다!!' : 'The pillar is sucking everything in!! Floor it!!'
      : phase === 'drag'
      ? ko ? '끌려간다 끌려가!! 바퀴야 버텨어어!!' : 'It is dragging us back!! Hold on, tyres!!'
      : ko ? '빠져나왔다!! 최대한 멀리 도망간다!!' : 'We broke free!! As far away as we can!!';
  drawRetroSpeechBubble(ctx, Math.max(300, Math.min(560, carX + 10)), carY - 130, line, phase === 'drag' ? '#fb7185' : '#f472b6', now);
}
