// ============================================================================
// SKY ESCAPE (경비행기) — one-touch flying run, same structure as the car run (car-runner.js)
//
// Control follows CookieRun's Bonus Time flight (community wiki: pressing carries the cookie up, pressing
// nothing lets it go down) and Jetpack Joyride (hold to climb, release to drop). Like the car run:
// energy that drains and drops on hits, fuel cans to refill it, a speed ramp that keeps climbing (2.5x by ~3.5 min), and a course
// built from hand-made chunks that are proven passable (scratch/car_mode/verify_sky.js). Storms show a
// warning at the right edge before they arrive; the first seconds are clear. Stars are laid along the
// flight line like CookieRun jellies; air-race gates build a combo; a close shave past a storm pays.
// Units: 960x540 stage, px per 60fps frame, y grows downward (stage coords).
// ============================================================================
const SKY_CFG = {
  STAGE_W: 960,
  PLANE_X: 250,
  PLANE_SCALE: 0.95,
  Y_MIN: 112, // plane origin (cockpit rim) range; the stage edges just stop the plane
  Y_MAX: 432,
  START_Y: 290,
  // Gentler than v5.11 so the plane is easy to steer: less climb/fall force, a lower top vertical speed, and
  // REVERSE_ASSIST extra force while the input fights the current motion, so it turns round quickly instead
  // of overshooting
  LIFT: 0.46, // per-frame climb acceleration while held
  GRAVITY: 0.36,
  REVERSE_ASSIST: 0.3,
  MAX_VY: 5.9,
  // Speed climbs for the whole run: linearly to SPEED_KNEE in ~55 s (1.5x the Chrome dino's 0.001/frame), then
  // slower (OVERDRIVE_ACCELERATION) up to MAX_SPEED at ~3.5 min; all chunks/pairs re-checked at MAX_SPEED
  SPEED: 6.2,
  SPEED_KNEE: 11,
  MAX_SPEED: 15.5,
  ACCELERATION: 0.0015,
  OVERDRIVE_ACCELERATION: 0.0005,
  // Chunks stretch with speed by only this share of the speed-up, so at higher speed the next hazard comes
  // sooner (the Chrome dino does the same: gap = width * speed + a fixed minimum gap)
  CHUNK_STRETCH: 0.6,
  CLEAR_DISTANCE: 1260, // ~3 s with nothing in the way
  CHUNK_GAP: 240,
  MAX_CHUNK_DUPLICATION: 2,
  WARNING_FRAMES: 48, // "!" at the right edge 0.8 s before a storm enters
  STORM_R: 26,
  STORM_HIT: 0.75, // storm hit radius = r * 0.75 (the puffy edge is forgiving)
  ENERGY_MAX: 100,
  ENERGY_DRAIN_PER_SEC: 0.8,
  HIT_ENERGY: 34,
  FUEL: 20,
  INVULN_MS: 1000,
  DISTANCE_SCORE: 0.05,
  STAR_POINTS: 30,
  GATE_POINTS: 300,
  NEAR_MISS_POINTS: 100,
  NEAR_MISS_GAP: 26, // passing within this many px of a storm without touching it
  MAX_COMBO: 8,
  STAR_STEP: 40,
};

// Plane hit shapes in local units (origin = cockpit rim, y down): body ellipse + pilot circle
const SKY_PLANE_HIT = { cx: 4, cy: 22, rx: 90, ry: 22, px: 0, py: -34, pr: 28 };

// Chunks: x relative to the chunk start (stretched by speed / start speed), y on the stage.
// storms: [x, y]; gates: [x, y]; stars: [[x0, x1, y0, y1]] lines; fuel: [x, y]
const SKY_CHUNKS = [
  { id: 'gap-mid', len: 760, storms: [[420, 112], [420, 180], [420, 400], [420, 468]], stars: [[120, 700, 290, 290]], gates: [[600, 290]] },
  { id: 'gap-high', len: 760, storms: [[420, 300], [420, 358], [420, 416], [420, 474]], stars: [[100, 360, 290, 200], [380, 700, 190, 190]] },
  { id: 'gap-low', len: 760, storms: [[420, 106], [420, 164], [420, 222], [420, 280]], stars: [[100, 360, 290, 390], [380, 700, 400, 400]], gates: [[620, 400]] },
  {
    id: 'zigzag', len: 1160,
    storms: [[340, 300], [340, 358], [340, 416], [340, 474], [820, 106], [820, 164], [820, 222], [820, 280]],
    stars: [[100, 300, 290, 200], [320, 400, 190, 190], [420, 780, 200, 400], [800, 1100, 400, 400]],
  },
  {
    id: 'tunnel', len: 1000,
    storms: [[200, 140], [330, 140], [460, 140], [590, 140], [720, 140], [200, 446], [330, 446], [460, 446], [590, 446], [720, 446]],
    stars: [[100, 900, 290, 290]], gates: [[460, 290]],
  },
  {
    id: 'singles', len: 1100,
    storms: [[300, 200], [600, 390], [900, 220]],
    stars: [[100, 330, 390, 390], [470, 620, 390, 240], [640, 760, 240, 240], [780, 900, 240, 400], [920, 1060, 400, 400]],
    fuel: [[1040, 300]],
  },
  { id: 'gates', len: 980, storms: [[480, 440], [740, 130]], gates: [[260, 200], [520, 300], [800, 380]], stars: [[120, 900, 200, 380]] },
  {
    id: 'squeeze', len: 1000, minSpeed: 8,
    storms: [[300, 112], [300, 170], [300, 228], [640, 360], [640, 418], [640, 476]],
    stars: [[100, 280, 290, 360], [320, 600, 360, 230], [660, 900, 230, 230]], gates: [[470, 290]],
  },
  {
    id: 'double-gap', len: 980,
    storms: [[360, 290], [360, 350], [360, 410], [360, 470], [660, 110], [660, 170], [660, 230], [660, 290]],
    stars: [[100, 300, 290, 200], [320, 400, 200, 200], [440, 600, 200, 400], [620, 940, 400, 400]],
  },
  {
    id: 'weave', len: 1080, minSpeed: 8,
    storms: [[300, 112], [300, 170], [300, 228], [560, 352], [560, 410], [560, 468], [820, 112], [820, 170], [820, 228]],
    stars: [[100, 240, 290, 345], [260, 360, 345, 345], [400, 500, 345, 250], [520, 620, 250, 250], [660, 760, 250, 345], [780, 880, 345, 345], [900, 1040, 345, 290]],
  },
  {
    id: 'needle', len: 800, minSpeed: 9.5,
    storms: [[440, 112], [440, 170], [440, 200], [440, 380], [440, 410], [440, 468]],
    stars: [[100, 760, 290, 290]], gates: [[440, 290]],
  },
  {
    id: 'fuel-cave', len: 1080, minSpeed: 8.5,
    storms: [[260, 150], [360, 150], [460, 150], [560, 150], [260, 430], [360, 430], [460, 430], [560, 430], [900, 300]],
    fuel: [[410, 290]], stars: [[100, 640, 290, 290], [720, 960, 190, 190]],
  },
];

function skyPlaneShapes(run) {
  const S = SKY_CFG.PLANE_SCALE;
  const h = SKY_PLANE_HIT;
  return {
    ex: SKY_CFG.PLANE_X + h.cx * S,
    ey: run.y + h.cy * S,
    rx: h.rx * S,
    ry: h.ry * S,
    px: SKY_CFG.PLANE_X + h.px * S,
    py: run.y + h.py * S,
    pr: h.pr * S,
  };
}

// Distance-like test of a circle against the plane: < 1 = touching (ellipse) / overlapping (pilot)
function skyHitsPlane(shapes, x, y, r) {
  const dx = (x - shapes.ex) / (shapes.rx + r);
  const dy = (y - shapes.ey) / (shapes.ry + r);
  if (dx * dx + dy * dy <= 1) return true;
  return Math.hypot(x - shapes.px, y - shapes.py) <= shapes.pr + r;
}

function skyDuplicateCheck(run, idx) {
  let dup = 0;
  for (let i = 0; i < run.history.length; i++) dup = run.history[i] === idx ? dup + 1 : 0;
  return dup >= SKY_CFG.MAX_CHUNK_DUPLICATION;
}

// A chunk is stretched by speed / start speed so the time between its pieces stays the same at any speed
function skyPlaceChunk(run, chunk, x0) {
  const k = Math.max(1, 1 + (run.speed / SKY_CFG.SPEED - 1) * SKY_CFG.CHUNK_STRETCH);
  const X = (v) => x0 + v * k;
  (chunk.storms || []).forEach(([x, y], n) =>
    run.storms.push({ x: X(x), y, r: SKY_CFG.STORM_R, seed: (run.chunks * 13 + n) % 97, nearChecked: false, closest: Infinity })
  );
  (chunk.gates || []).forEach(([x, y]) => run.gates.push({ x: X(x), y, done: false }));
  (chunk.fuel || []).forEach(([x, y]) => run.items.push({ x: X(x), y, kind: 'fuel' }));
  (chunk.stars || []).forEach(([a, b, y0, y1]) => {
    const xa = X(a);
    const xb = X(b);
    for (let x = xa; x <= xb; x += SKY_CFG.STAR_STEP) {
      const t = xb > xa ? (x - xa) / (xb - xa) : 0;
      run.items.push({ x, y: y0 + (y1 - y0) * t, kind: 'star' });
    }
  });
  run.chunkEnd = X(chunk.len) + SKY_CFG.CHUNK_GAP * k;
  run.chunks += 1;
}

function skyAddChunk(run, rng) {
  const candidates = [];
  SKY_CHUNKS.forEach((c, idx) => {
    if (run.speed >= (c.minSpeed || 0) && !skyDuplicateCheck(run, idx)) candidates.push(idx);
  });
  const idx = candidates[Math.floor(rng() * candidates.length)];
  skyPlaceChunk(run, SKY_CHUNKS[idx], run.chunkEnd);
  run.history.unshift(idx);
  if (run.history.length > SKY_CFG.MAX_CHUNK_DUPLICATION) run.history.length = SKY_CFG.MAX_CHUNK_DUPLICATION;
}

function createSkyRun(now = 0) {
  return {
    speed: SKY_CFG.SPEED,
    distance: 0,
    y: SKY_CFG.START_Y,
    vy: 0,
    held: false,
    storms: [],
    gates: [],
    items: [],
    chunkEnd: SKY_CFG.CLEAR_DISTANCE,
    chunks: 0,
    history: [],
    energy: SKY_CFG.ENERGY_MAX,
    invulnUntil: 0,
    combo: 1,
    bonus: 0,
    distScore: 0,
    score: 0,
    level: 1,
    hits: 0,
    stars: 0,
    gatesPassed: 0,
    nearMisses: 0,
    startAt: now,
    crashed: false,
  };
}

function skyLevelForSpeed(speed) {
  const t = (speed - SKY_CFG.SPEED) / (SKY_CFG.MAX_SPEED - SKY_CFG.SPEED);
  return Math.max(1, Math.min(10, 1 + Math.floor(t * 9 + 1e-9)));
}

function skyStep(run, dt, now, rng = Math.random) {
  const events = [];
  if (run.crashed) return events;

  // 1. Hold to climb, release to drop; the stage edges stop the plane without damage
  const reversing = run.held ? run.vy > 0 : run.vy < 0;
  const force = (run.held ? -SKY_CFG.LIFT : SKY_CFG.GRAVITY) + (reversing ? (run.held ? -1 : 1) * SKY_CFG.REVERSE_ASSIST : 0);
  run.vy += force * dt;
  run.vy = Math.max(-SKY_CFG.MAX_VY, Math.min(SKY_CFG.MAX_VY, run.vy));
  run.y += run.vy * dt;
  if (run.y < SKY_CFG.Y_MIN) {
    run.y = SKY_CFG.Y_MIN;
    run.vy = 0;
  } else if (run.y > SKY_CFG.Y_MAX) {
    run.y = SKY_CFG.Y_MAX;
    run.vy = 0;
  }

  // 2. Scroll + spawn
  const dx = run.speed * dt;
  run.storms.forEach((s) => (s.x -= dx));
  run.gates.forEach((g) => (g.x -= dx));
  run.items.forEach((it) => (it.x -= dx));
  run.chunkEnd -= dx;
  while (run.chunkEnd < SKY_CFG.STAGE_W + 500) skyAddChunk(run, rng);

  // 3. Storms: hit, or a close shave once the storm has passed the plane
  const shapes = skyPlaneShapes(run);
  const canHit = now >= run.invulnUntil;
  for (let i = run.storms.length - 1; i >= 0; i--) {
    const s = run.storms[i];
    const hr = s.r * SKY_CFG.STORM_HIT;
    if (canHit && skyHitsPlane(shapes, s.x, s.y, hr)) {
      run.storms.splice(i, 1);
      run.energy -= SKY_CFG.HIT_ENERGY;
      run.hits += 1;
      run.combo = 1;
      run.invulnUntil = now + SKY_CFG.INVULN_MS;
      events.push({ type: 'hit', x: s.x, y: s.y });
      continue;
    }
    if (Math.abs(s.x - SKY_CFG.PLANE_X) < 120) {
      s.closest = Math.min(s.closest, skyHitsPlane(shapes, s.x, s.y, hr + SKY_CFG.NEAR_MISS_GAP) ? 0 : 1);
    }
    if (!s.nearChecked && s.x < SKY_CFG.PLANE_X - 130) {
      s.nearChecked = true;
      if (s.closest === 0 && now >= run.invulnUntil) {
        run.nearMisses += 1;
        run.bonus += SKY_CFG.NEAR_MISS_POINTS;
        events.push({ type: 'near', x: SKY_CFG.PLANE_X, y: run.y - 70 });
      }
    }
    if (s.x < -80) run.storms.splice(i, 1);
  }

  // 4. Gates build the combo (fly through the middle); a missed gate resets it
  for (let i = run.gates.length - 1; i >= 0; i--) {
    const g = run.gates[i];
    if (!g.done && g.x <= SKY_CFG.PLANE_X) {
      g.done = true;
      if (Math.abs(run.y + 10 - g.y) <= 46) {
        run.combo = Math.min(SKY_CFG.MAX_COMBO, run.combo + 1);
        const pts = SKY_CFG.GATE_POINTS * run.combo;
        run.bonus += pts;
        run.gatesPassed += 1;
        events.push({ type: 'gate', x: g.x, y: g.y, points: pts, combo: run.combo });
      } else {
        run.combo = 1;
        events.push({ type: 'gateMiss', x: g.x, y: g.y });
      }
    }
    if (g.x < -60) run.gates.splice(i, 1);
  }

  // 5. Stars and fuel
  for (let i = run.items.length - 1; i >= 0; i--) {
    const it = run.items[i];
    const r = it.kind === 'fuel' ? 18 : 12;
    if (skyHitsPlane(shapes, it.x, it.y, r)) {
      run.items.splice(i, 1);
      if (it.kind === 'fuel') {
        run.energy = Math.min(SKY_CFG.ENERGY_MAX, run.energy + SKY_CFG.FUEL);
        events.push({ type: 'fuel', x: it.x, y: it.y, gain: SKY_CFG.FUEL });
      } else {
        const pts = SKY_CFG.STAR_POINTS * run.combo;
        run.bonus += pts;
        run.stars += 1;
        events.push({ type: 'star', x: it.x, y: it.y, points: pts });
      }
      continue;
    }
    if (it.x < -40) run.items.splice(i, 1);
  }

  // 6. Energy, distance, speed
  run.energy -= (SKY_CFG.ENERGY_DRAIN_PER_SEC / 60) * dt;
  run.distance += dx;
  run.distScore = Math.floor(run.distance * SKY_CFG.DISTANCE_SCORE);
  const accel = run.speed < SKY_CFG.SPEED_KNEE ? SKY_CFG.ACCELERATION : SKY_CFG.OVERDRIVE_ACCELERATION;
  if (run.speed < SKY_CFG.MAX_SPEED) run.speed = Math.min(SKY_CFG.MAX_SPEED, run.speed + accel * dt);
  const lv = skyLevelForSpeed(run.speed);
  if (lv > run.level) {
    run.level = lv;
    const bonus = lv * 300;
    run.bonus += bonus;
    events.push({ type: 'level', level: lv, points: bonus });
  }
  run.score = run.distScore + run.bonus;
  if (run.energy <= 0) {
    run.energy = 0;
    run.crashed = true;
    events.push({ type: 'crash' });
  }
  return events;
}

// Storms about to enter from the right edge (for the "!" warnings)
function skyIncomingStorms(run) {
  const lead = run.speed * SKY_CFG.WARNING_FRAMES;
  return run.storms.filter((s) => s.x - s.r > SKY_CFG.STAGE_W && s.x - s.r < SKY_CFG.STAGE_W + lead);
}

// ============================================================================
// SKY GAME STATE + SCENE 3 FRAME (sceneIdx === 2 with the plane)
// ============================================================================
const SKY_GAME = {
  run: null,
  lastTickAt: 0,
  particles: [],
  popups: [],
  shakeUntil: 0,
  hitFlashUntil: 0,
};

function resetSkyGame(now = performance.now()) {
  SKY_GAME.run = createSkyRun(now);
  SKY_GAME.lastTickAt = now;
  SKY_GAME.particles = [];
  SKY_GAME.popups = [];
  SKY_GAME.shakeUntil = 0;
  SKY_GAME.hitFlashUntil = 0;
  UFO_GAME.score = 0;
  UFO_GAME.scoreSubmitted = false;
}

function skyGameActive() {
  return MOTION_STATE.vehicle !== 'car' && MOTION_STATE.sceneIdx === 2 && Boolean(SKY_GAME.run);
}

function skyPress() {
  if (skyGameActive()) SKY_GAME.run.held = true;
}

function skyRelease() {
  if (SKY_GAME.run) SKY_GAME.run.held = false;
}

function spawnSkyBurst(x, y, cols, count = 10, speed = 4, size = 6) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const sp = speed * (0.5 + Math.random() * 0.8);
    SKY_GAME.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, col: cols[i % cols.length], sz: size - (i % 3), alpha: 1, decay: 0.035 });
  }
}

function drawFuelCan(ctx, x, y, now) {
  const bob = Math.sin(now * 0.008 + x * 0.02) * 2;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-12, -14, 24, 30, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-7, -20, 6, 6);
  ctx.strokeRect(-7, -20, 6, 6);
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -6);
  ctx.lineTo(8, 10);
  ctx.moveTo(8, -6);
  ctx.lineTo(-8, 10);
  ctx.stroke();
  ctx.restore();
}

// "!" at the right edge for a storm that is about to enter
function drawStormWarning(ctx, y, now) {
  if (Math.floor(now / 140) % 2 === 1) return;
  const x = 924;
  ctx.save();
  ctx.fillStyle = PLANE_K;
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x + 22, y + 16);
  ctx.lineTo(x - 22, y + 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(x, y - 14);
  ctx.lineTo(x + 16, y + 12);
  ctx.lineTo(x - 16, y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(x - 2, y - 6, 4, 10);
  ctx.fillRect(x - 2, y + 6, 4, 3);
  ctx.restore();
}

function drawSkyHud(ctx, now, run) {
  ctx.save();
  const hx = 16;
  const hy = 12;
  const hw = 500;
  const hh = 34;
  ctx.fillStyle = 'rgba(9, 13, 26, 0.88)';
  ctx.fillRect(hx - 2, hy - 2, hw + 4, hh + 4);
  ctx.strokeStyle = '#2dd4bf';
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
  if (run.combo > 1) {
    ctx.fillStyle = '#34d399';
    ctx.fillText(`x${run.combo}`, hx + 196, hy + hh / 2 + 1);
  }
  const bx = hx + 238;
  const bw = 140;
  const ratio = Math.max(0, run.energy / SKY_CFG.ENERGY_MAX);
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
  ctx.fillStyle = run.level >= 7 ? '#fb7185' : run.level >= 4 ? '#fde047' : '#bae6fd';
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`LV.${run.level} · ${Math.round(run.speed * 22)}km/h`, hx + hw - 12, hy + hh / 2 + 1);
  ctx.restore();
}

function triggerSkyCrash(now = performance.now()) {
  const run = SKY_GAME.run;
  UFO_GAME.score = run.score;
  UFO_GAME.lastFinalScore = Math.max(1, run.score);
  UFO_GAME.lastRank = null;
  UFO_GAME.lastBestScore = 0;
  if (UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
    submitUfoScoreToServer(UFO_GAME.pilotTokenId, UFO_GAME.lastFinalScore, run.gatesPassed);
  }
  setIntroScene(3, true);
}

function drawSkyRunnerFrame(ctx, now, spId) {
  if (!SKY_GAME.run) resetSkyGame(now);
  const run = SKY_GAME.run;
  const dt = Math.min(32, Math.max(8, now - (SKY_GAME.lastTickAt || now))) / 16.67;
  SKY_GAME.lastTickAt = now;
  const S = SKY_CFG.PLANE_SCALE;
  const ko = CURRENT_LANG === 'ko';

  const events = skyStep(run, dt, now, Math.random);
  let crashed = false;
  events.forEach((ev) => {
    playIntroSfx(ev.type, ev);
    if (ev.type === 'star') {
      spawnSkyBurst(ev.x, ev.y, ['#fde047', '#fef08a', '#ffffff'], 4, 2, 4);
    } else if (ev.type === 'gate') {
      SKY_GAME.popups.push({ x: ev.x, y: ev.y - 60, vy: -1.4, text: `GATE x${ev.combo} +${ev.points}`, col: '#f472b6', alpha: 1 });
      spawnSkyBurst(ev.x, ev.y, ['#f472b6', '#ffffff', '#67e8f9'], 12, 3.5, 5);
    } else if (ev.type === 'gateMiss') {
      SKY_GAME.popups.push({ x: ev.x, y: ev.y - 60, vy: -1, text: 'MISS', col: '#94a3b8', alpha: 0.9 });
    } else if (ev.type === 'near') {
      SKY_GAME.popups.push({ x: ev.x + 40, y: ev.y, vy: -1.3, text: ko ? '아슬아슬! +100' : 'CLOSE CALL +100', col: '#67e8f9', alpha: 1 });
    } else if (ev.type === 'fuel') {
      SKY_GAME.popups.push({ x: ev.x, y: ev.y - 24, vy: -1.4, text: `FUEL +${ev.gain}`, col: '#f472b6', alpha: 1 });
      spawnSkyBurst(ev.x, ev.y, ['#ef4444', '#fde047', '#ffffff'], 10, 3, 5);
    } else if (ev.type === 'hit') {
      spawnSkyBurst(ev.x, ev.y, ['#64748b', '#fde047', '#e2e8f0'], 16, 5, 7);
      SKY_GAME.hitFlashUntil = now + 520;
      SKY_GAME.shakeUntil = now + 300;
      SKY_GAME.popups.push({ x: SKY_CFG.PLANE_X, y: run.y - 90, vy: -1.5, text: `ENERGY -${SKY_CFG.HIT_ENERGY}`, col: '#fb7185', alpha: 1 });
    } else if (ev.type === 'level') {
      SKY_GAME.popups.push({ x: 480, y: 92, vy: -1.2, text: `LV.${ev.level} SPEED UP! +${ev.points}`, col: '#fde047', alpha: 1 });
    } else if (ev.type === 'crash') {
      crashed = true;
    }
  });

  ctx.save();
  if (now < SKY_GAME.shakeUntil) {
    const mag = ((SKY_GAME.shakeUntil - now) / 520) * 8;
    ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
  }
  drawRefSkyGameBackground(ctx, now);

  run.gates.forEach((g) => {
    if (g.x > -40 && g.x < 1000) {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.globalAlpha = g.done ? 0.35 : 1;
      drawPinkNeonWarpRing(ctx, now);
      ctx.restore();
    }
  });
  run.items.forEach((it) => {
    if (it.x < -30 || it.x > 990) return;
    if (it.kind === 'fuel') {
      drawFuelCan(ctx, it.x, it.y, now);
    } else {
      ctx.save();
      ctx.translate(it.x, it.y);
      drawGoldenStarCollectible(ctx, 11, now);
      ctx.restore();
    }
  });
  run.storms.forEach((st) => {
    if (st.x < -60 || st.x > 1010) return;
    ctx.save();
    ctx.translate(st.x, st.y);
    drawStormCloud(ctx, st.r, now, st.seed);
    ctx.restore();
  });
  skyIncomingStorms(run).forEach((st) => drawStormWarning(ctx, st.y, now));

  // Exhaust puffs behind the tail, then the plane (nose follows the climb)
  ctx.save();
  for (let t = 0; t < 7; t++) {
    const tp = (now * 0.005 + t * 0.143) % 1;
    const sz = Math.max(3, Math.round((1 - tp) * 9));
    ctx.globalAlpha = 0.75 * (1 - tp);
    ctx.fillStyle = t % 2 === 0 ? '#ffffff' : '#cbd5e1';
    ctx.fillRect(SKY_CFG.PLANE_X - 100 * S - tp * 110, run.y + 18 * S + Math.sin(now * 0.02 + t) * 4, sz, sz);
  }
  ctx.restore();
  const tilt = Math.max(-0.26, Math.min(0.26, run.vy * 0.04));
  const invuln = now < run.invulnUntil;
  if (!invuln || Math.floor(now / 90) % 2 === 0) {
    drawPlaneWithPilot(ctx, SKY_CFG.PLANE_X, run.y, tilt, now, {
      scale: S,
      spId,
      isShocked: now < SKY_GAME.hitFlashUntil,
      isImpactBlink: now < SKY_GAME.hitFlashUntil - 420,
    });
  }

  for (let i = SKY_GAME.particles.length - 1; i >= 0; i--) {
    const pt = SKY_GAME.particles[i];
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.alpha -= pt.decay * dt;
    if (pt.alpha <= 0) {
      SKY_GAME.particles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.alpha);
    ctx.fillStyle = PLANE_K;
    ctx.fillRect(pt.x - pt.sz / 2 - 1, pt.y - pt.sz / 2 - 1, pt.sz + 2, pt.sz + 2);
    ctx.fillStyle = pt.col;
    ctx.fillRect(pt.x - pt.sz / 2, pt.y - pt.sz / 2, pt.sz, pt.sz);
    ctx.restore();
  }
  for (let i = SKY_GAME.popups.length - 1; i >= 0; i--) {
    const pop = SKY_GAME.popups[i];
    pop.y += pop.vy * dt;
    pop.alpha -= 0.024 * dt;
    if (pop.alpha <= 0) {
      SKY_GAME.popups.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, pop.alpha);
    ctx.font = '900 14px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = PLANE_K;
    ctx.fillText(pop.text, pop.x + 2, pop.y + 2);
    ctx.fillStyle = pop.col;
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  withStageUi(ctx, 16, 12, 564, () => drawSkyHud(ctx, now, run));
  if (now - run.startAt < 6000) {
    const msg = ko ? '누르고 있으면 상승 · 떼면 하강 · 별을 따라 날아요' : 'Hold to climb · release to dive · follow the stars';
    ctx.save();
    ctx.font = '800 14px "Pretendard", "Malgun Gothic", sans-serif';
    const tw = Math.ceil(ctx.measureText(msg).width) + 28;
    const hk = Math.min(stageUiK(), 940 / tw); // bigger on phones, never wider than the stage
    const hy = hk > 1 ? 516 - 15 * hk : 485; // bottom stays on the stage
    ctx.translate(480, hy); // hy = where the box centre (485) ends up
    ctx.scale(hk, hk);
    ctx.translate(-480, -485);
    const bx = 480 - tw / 2;
    ctx.fillStyle = 'rgba(9, 13, 26, 0.82)';
    ctx.fillRect(bx, 470, tw, 30);
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(bx, 470, 4, 30);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(msg, 482, 486);
    ctx.restore();
  }
  ctx.restore();

  if (crashed) triggerSkyCrash(now);
}
