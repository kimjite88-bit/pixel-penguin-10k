// ============================================================================
// CAR ESCAPE MODE (자동차 탈출) — auto-run road + tap-to-jump obstacle course
//
// The jump (variable height: release early for a short hop), the obstacle gap formula and the
// "no more than 2 of the same obstacle in a row" rule follow the Chromium T-Rex runner
// (components/neterror/resources/dino_game). Only the game rules are ported; every sprite here is new.
//
// Copyright 2014 The Chromium Authors
// Redistribution and use in source and binary forms, with or without modification, are permitted
// provided that the following conditions are met:
//   * Redistributions of source code must retain the above copyright notice, this list of conditions
//     and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice, this list of conditions
//     and the following disclaimer in the documentation and/or other materials provided with the
//     distribution.
//   * Neither the name of Google LLC nor the names of its contributors may be used to endorse or promote
//     products derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
// PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
// Units: 960x540 logical stage, speeds in px per 60fps frame (Chrome's 600px values x1.6),
// heights measured upward from the road. Nothing at the top level touches the DOM, so the rules
// can be loaded and simulated outside the browser.
// ============================================================================
const CAR_CFG = {
  STAGE_W: 960,
  GROUND_Y: 474, // tyre contact line on the road
  CAR_X: 186, // car origin (cockpit door line) on screen
  CAR_SCALE: 0.95,
  WHEEL_BOTTOM: 47, // local y of the tyre contact point below the car origin
  SPEED: 9.6,
  MAX_SPEED: 18.5,
  ACCELERATION: 0.0016,
  GRAVITY: 0.6, // Chrome's value; the car is ~4x longer than the T-Rex, so the jump is floatier instead of heavier
  INITIAL_JUMP_VELOCITY: 15.4, // minus speed / 10, as in Chrome's startJump
  MIN_JUMP_HEIGHT: 110, // a tap always rises this high (clears one block even at the starting speed)
  MAX_JUMP_HEIGHT: 170, // holding past this height ends the climb
  DROP_VELOCITY: 6, // climb speed left after the jump button is released
  GAP_COEFFICIENT: 0.6,
  MAX_GAP_COEFFICIENT: 1.5,
  MAX_OBSTACLE_LENGTH: 3,
  MAX_OBSTACLE_DUPLICATION: 2,
  CLEAR_DISTANCE: 620, // obstacle-free run-up (Chrome CLEAR_TIME)
  MIN_CLEAR_WINDOW: 10, // a held jump must clear every obstacle group with this many frames to spare
  REACTION_SLACK: 14, // frames of slack between the two jumps of a back-to-back pair
  JUMP_BUFFER_MS: 150, // a press just before landing jumps again on touchdown
  INVULN_MS: 1100,
  HEARTS: 3,
  DISTANCE_SCORE: 0.1,
  CLEAR_BONUS: 100,
  STAR_POINTS: 150,
};

// Car hit boxes in local car units (y down from the door line). The hat and the windshield pillar
// are left out on purpose, like Chrome's trimmed T-Rex boxes.
const CAR_HIT_BOXES = [
  { x: -82, y: 4, w: 166, h: 41 }, // body + tyres (bumpers and exhaust trimmed)
  { x: -56, y: -58, w: 70, h: 62 }, // pilot
];

// boxes: [x, bottom height, width, height] per obstacle unit; groups repeat the unit
const CAR_OBSTACLE_TYPES = [
  { type: 'ICE', width: 42, height: 42, multipleSpeed: 0, minGap: 200, minSpeed: 0, boxes: [[3, 0, 36, 38]] },
  {
    type: 'GIFTS',
    width: 56,
    height: 58,
    multipleSpeed: 14,
    minGap: 220,
    minSpeed: 0,
    boxes: [
      [2, 0, 52, 32],
      [10, 32, 36, 24],
    ],
  },
  {
    type: 'SNOWMAN',
    width: 50,
    height: 96,
    multipleSpeed: 999,
    minGap: 230,
    minSpeed: 0,
    boxes: [
      [6, 0, 38, 40],
      [13, 40, 24, 30],
    ],
  },
  // Flies low (jump it) or high (stay on the road and pass under it); appears once the road is fast
  { type: 'SKUA', width: 62, height: 34, multipleSpeed: 999, minGap: 260, minSpeed: 12.5, lifts: [26, 118], boxes: [[8, 6, 46, 20]] },
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
  let top = -Infinity;
  CAR_HIT_BOXES.forEach((b) => {
    top = Math.max(top, (CAR_CFG.WHEEL_BOTTOM - b.y) * CAR_CFG.CAR_SCALE);
  });
  return top;
}

// Car boxes on screen: l/r in stage px, b/t as heights above the road
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
  const tp = CAR_OBSTACLE_TYPES[o.typeIdx];
  const out = [];
  for (let u = 0; u < o.size; u++) {
    tp.boxes.forEach(([bx, bb, bw, bh]) => {
      out.push({ l: o.x + u * tp.width + bx, r: o.x + u * tp.width + bx + bw, b: o.lift + bb, t: o.lift + bb + bh });
    });
  }
  return out;
}

function carBoxesOverlap(a, b) {
  return a.l < b.r && a.r > b.l && a.b < b.t && a.t > b.b;
}

// ---------------------------------------------------------------------------
// Jump (Chrome Trex.startJump / endJump / updateJump with heights measured upward)
// ---------------------------------------------------------------------------
function carStartJump(run) {
  if (run.jumping) return false;
  run.jumping = true;
  run.vh = CAR_CFG.INITIAL_JUMP_VELOCITY - run.speed / 10;
  run.reachedMinHeight = false;
  run.jumps += 1;
  return true;
}

function carEndJump(run) {
  if (run.reachedMinHeight && run.vh > CAR_CFG.DROP_VELOCITY) {
    run.vh = CAR_CFG.DROP_VELOCITY;
  }
}

// Returns true on the frame the car touches down
function carUpdateJump(run, dt) {
  run.h += run.vh * dt;
  run.vh -= CAR_CFG.GRAVITY * dt;
  if (run.h >= CAR_CFG.MIN_JUMP_HEIGHT) run.reachedMinHeight = true;
  // Chrome ends the climb at max height or on release; a release before the minimum height takes effect
  // once the car gets there (Chrome drops it, which turns a very quick tap into a full jump)
  if (run.h >= CAR_CFG.MAX_JUMP_HEIGHT || !run.jumpHeld) carEndJump(run);
  if (run.h <= 0) {
    run.h = 0;
    run.vh = 0;
    run.jumping = false;
    return true;
  }
  return false;
}

// Height profile of one jump at a fixed speed, holding for holdFrames (Infinity = full jump)
function carJumpProfile(speed, holdFrames = Infinity) {
  const r = { h: 0, vh: 0, jumping: false, reachedMinHeight: false, jumpHeld: true, speed, jumps: 0 };
  carStartJump(r);
  const heights = [];
  for (let f = 1; f < 400; f++) {
    if (f > holdFrames) r.jumpHeld = false;
    const landed = carUpdateJump(r, 1);
    heights.push(r.h);
    if (landed) break;
  }
  return heights;
}

// Frames a held jump needs to rise to height h, and how long it stays at or above it
function carRiseFrames(h, speed) {
  if (h <= 0) return 0;
  const prof = carJumpProfile(speed);
  const i = prof.findIndex((y) => y >= h);
  return i < 0 ? Infinity : i + 1;
}

function carFramesAbove(h, speed) {
  return carJumpProfile(speed).filter((y) => y >= h).length;
}

function carClearHeight(tp, lift) {
  let top = 0;
  tp.boxes.forEach(([, bb, , bh]) => {
    top = Math.max(top, lift + bb + bh);
  });
  return top + 2;
}

// Largest group a held jump still clears with MIN_CLEAR_WINDOW frames to spare
function carMaxClearableSize(tp, clearH, speed) {
  const above = carFramesAbove(clearH, speed);
  for (let size = CAR_CFG.MAX_OBSTACLE_LENGTH; size > 1; size--) {
    const need = (carHitLength() + tp.width * size) / speed;
    if (above - need >= CAR_CFG.MIN_CLEAR_WINDOW) return size;
  }
  return 1;
}

function carRandInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// Chrome Obstacle.getGap, with the obstacle's unit width (not the whole group) and a physics floor:
// after landing from this obstacle there is always time to rise over the next one
function carObstacleGap(o, speed, rng) {
  const tp = CAR_OBSTACLE_TYPES[o.typeIdx];
  const minGapChrome = Math.round(tp.width * speed + tp.minGap * CAR_CFG.GAP_COEFFICIENT);
  const v = speed * 1.03;
  let maxRise = 0;
  CAR_OBSTACLE_TYPES.forEach((t) => {
    (t.lifts || [0]).forEach((lift) => {
      if (lift + 0 > carTopHeight()) return; // pass-under flyers need no jump
      maxRise = Math.max(maxRise, carRiseFrames(carClearHeight(t, lift), v));
    });
  });
  const rise = o.mode === 'over' ? carRiseFrames(o.clearH, v) : 0;
  const floor = Math.ceil(carHitLength() + v * (rise + maxRise + CAR_CFG.REACTION_SLACK));
  const minGap = Math.max(minGapChrome, floor);
  return carRandInt(rng, minGap, Math.round(minGap * CAR_CFG.MAX_GAP_COEFFICIENT));
}

// Chrome Horizon.duplicateObstacleCheck
function carDuplicateObstacleCheck(run, typeIdx) {
  let dup = 0;
  for (let i = 0; i < run.history.length; i++) {
    dup = run.history[i] === typeIdx ? dup + 1 : 0;
  }
  return dup >= CAR_CFG.MAX_OBSTACLE_DUPLICATION;
}

function carAddObstacle(run, rng) {
  const candidates = [];
  CAR_OBSTACLE_TYPES.forEach((tp, idx) => {
    if (run.speed >= tp.minSpeed && !carDuplicateObstacleCheck(run, idx)) candidates.push(idx);
  });
  const typeIdx = candidates[Math.floor(rng() * candidates.length)];
  const tp = CAR_OBSTACLE_TYPES[typeIdx];
  const lift = tp.lifts ? tp.lifts[Math.floor(rng() * tp.lifts.length)] : 0;
  const mode = lift > carTopHeight() ? 'under' : 'over';
  const o = {
    typeIdx,
    type: tp.type,
    x: CAR_CFG.STAGE_W + 8,
    size: 1,
    lift,
    mode,
    clearH: carClearHeight(tp, lift),
    gap: 0,
    passed: false,
    seed: Math.floor(rng() * 1000),
  };
  if (mode === 'over' && run.speed > tp.multipleSpeed) {
    o.size = Math.min(carRandInt(rng, 1, CAR_CFG.MAX_OBSTACLE_LENGTH), carMaxClearableSize(tp, o.clearH, run.speed));
  }
  o.w = tp.width * o.size;
  o.gap = carObstacleGap(o, run.speed, rng);
  run.obstacles.push(o);
  run.history.unshift(typeIdx);
  if (run.history.length > CAR_CFG.MAX_OBSTACLE_DUPLICATION) run.history.length = CAR_CFG.MAX_OBSTACLE_DUPLICATION;

  // Stars: an arc over a jump (reward for a full jump) or a low row under a high flyer (reward for not jumping)
  if (rng() < 0.5) {
    const cx = o.x + o.w / 2;
    if (mode === 'over') {
      [-54, 0, 54].forEach((dx, k) => run.stars.push({ x: cx + dx, h: o.clearH + (k === 1 ? 74 : 48) }));
    } else {
      [-44, 0, 44].forEach((dx) => run.stars.push({ x: cx + dx, h: 24 }));
    }
  }
}

function createCarRun(now = 0) {
  return {
    speed: CAR_CFG.SPEED,
    distance: 0,
    h: 0,
    vh: 0,
    jumping: false,
    reachedMinHeight: false,
    jumpHeld: false,
    bufferedAt: -Infinity,
    obstacles: [],
    stars: [],
    history: [],
    hearts: CAR_CFG.HEARTS,
    invulnUntil: 0,
    distScore: 0,
    bonus: 0,
    score: 0,
    combo: 1,
    level: 1,
    jumps: 0,
    cleared: 0,
    hits: 0,
    startAt: now,
    crashed: false,
  };
}

function carPressJump(run, now) {
  run.jumpHeld = true;
  if (!carStartJump(run)) run.bufferedAt = now;
}

function carReleaseJump(run) {
  run.jumpHeld = false;
  if (run.jumping) carEndJump(run);
}

function carLevelForSpeed(speed) {
  const t = (speed - CAR_CFG.SPEED) / (CAR_CFG.MAX_SPEED - CAR_CFG.SPEED);
  return Math.max(1, Math.min(10, 1 + Math.floor(t * 9 + 1e-9)));
}

// One simulation step (dt in 60fps frames). Returns events for effects and sound-free feedback.
function carStep(run, dt, now, rng = Math.random) {
  const events = [];
  if (run.crashed) return events;

  // 1. Jump physics (Chrome updates the T-Rex before the horizon)
  if (run.jumping && carUpdateJump(run, dt)) {
    events.push({ type: 'land' });
    if (now - run.bufferedAt <= CAR_CFG.JUMP_BUFFER_MS) {
      run.bufferedAt = -Infinity;
      if (carStartJump(run)) events.push({ type: 'jump' });
    }
  }

  // 2. Scroll obstacles and stars
  const dx = run.speed * dt;
  for (let i = run.obstacles.length - 1; i >= 0; i--) {
    const o = run.obstacles[i];
    o.x -= dx;
    if (o.x + o.w < -40) run.obstacles.splice(i, 1);
  }
  for (let i = run.stars.length - 1; i >= 0; i--) {
    run.stars[i].x -= dx;
    if (run.stars[i].x < -30) run.stars.splice(i, 1);
  }

  // 3. Spawn (Chrome Horizon.updateObstacles)
  const last = run.obstacles[run.obstacles.length - 1];
  if (!last) {
    if (run.distance >= CAR_CFG.CLEAR_DISTANCE) carAddObstacle(run, rng);
  } else if (last.x + last.w + last.gap < CAR_CFG.STAGE_W) {
    carAddObstacle(run, rng);
  }

  // 4. Collisions, cleared obstacles and stars
  const carBoxes = carWorldBoxes(run);
  const carLeft = Math.min(...carBoxes.map((b) => b.l));
  const canHit = now >= run.invulnUntil;
  for (let i = run.obstacles.length - 1; i >= 0; i--) {
    const o = run.obstacles[i];
    if (canHit) {
      const oBoxes = carObstacleBoxes(o);
      const hit = carBoxes.some((cb) => oBoxes.some((ob) => carBoxesOverlap(cb, ob)));
      if (hit) {
        run.obstacles.splice(i, 1);
        run.hearts -= 1;
        run.hits += 1;
        run.combo = 1;
        run.invulnUntil = now + CAR_CFG.INVULN_MS;
        events.push({ type: 'hit', obstacle: o });
        if (run.hearts <= 0) {
          run.crashed = true;
          events.push({ type: 'crash' });
          return events;
        }
        continue;
      }
    }
    if (!o.passed && o.x + o.w < carLeft) {
      o.passed = true;
      run.cleared += 1;
      run.bonus += CAR_CFG.CLEAR_BONUS;
      events.push({ type: 'clear', obstacle: o, points: CAR_CFG.CLEAR_BONUS });
    }
  }
  for (let i = run.stars.length - 1; i >= 0; i--) {
    const s = run.stars[i];
    const r = 15;
    const hitStar = carBoxes.some((cb) => s.x + r > cb.l && s.x - r < cb.r && s.h + r > cb.b && s.h - r < cb.t);
    if (hitStar) {
      const pts = CAR_CFG.STAR_POINTS * run.combo;
      run.bonus += pts;
      run.combo = Math.min(8, run.combo + 1);
      run.stars.splice(i, 1);
      events.push({ type: 'star', x: s.x, h: s.h, points: pts });
    }
  }

  // 5. Distance, score and speed (Chrome DistanceMeter + ACCELERATION)
  run.distance += dx;
  run.distScore = Math.floor(run.distance * CAR_CFG.DISTANCE_SCORE);
  if (run.speed < CAR_CFG.MAX_SPEED) {
    run.speed = Math.min(CAR_CFG.MAX_SPEED, run.speed + CAR_CFG.ACCELERATION * dt);
  }
  const lv = carLevelForSpeed(run.speed);
  if (lv > run.level) {
    run.level = lv;
    const bonus = lv * 300;
    run.bonus += bonus;
    events.push({ type: 'level', level: lv, points: bonus });
  }
  run.score = run.distScore + run.bonus;
  return events;
}

// ============================================================================
// DRAWING — "Y2K neon lowrider": mint box body, hot-pink rocker panel, chrome spinner rims,
// cyan underglow, roll bar and a seasonal load on the rear deck. The NFT pilot sits in the open top.
// ============================================================================
const CAR_PILOT_DX = -14; // the pilot sits behind the windshield, not mid-car
const CAR_K = '#090d1a';

function drawCarPilot(ctx, pixelMode, now, options = {}) {
  const { spId = UFO_GAME.pilotSpeciesId || '01', isShocked = false, isImpactBlink = false, lift = 0 } = options;
  ensureDefaultPilotSheets();
  const r = PILOT_DRAW_RECT;
  const px = r.x + CAR_PILOT_DX;
  const py = r.y - lift;
  ctx.save();
  ctx.beginPath();
  ctx.rect(px - 16, -120, r.size + 32, 124); // the door line (y = +4) hides the waist
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
        const drawH = Math.round(86 * (220 / 256));
        ctx.drawImage(src, src === spEntry.sheet ? anim.frameIdx * 256 : 0, 0, 256, 220, px - 2, 9 - drawH - lift, 86, drawH);
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
        const drawH = 86 * (220 / 256);
        ctx.drawImage(heroSheet, anim.frameIdx * 256, 0, 256, 220, px - 2, 9 - drawH - lift, 86, drawH);
      }
    }
  }
  ctx.restore();
}

function drawCarExhaustFlame(ctx, now, boost, pixelMode) {
  if (boost <= 0) return;
  const cols = ['#fde047', '#fb923c', '#f472b6'];
  for (let k = 0; k < 4; k++) {
    const flick = Math.floor(now / 60 + k) % 2;
    const sz = Math.max(3, Math.round((8 - k * 1.6) * Math.min(1.6, boost)));
    const fx = -108 - k * 8 - flick * 2;
    const fy = 32 - Math.round(sz / 2) + (flick ? -1 : 1);
    ctx.fillStyle = CAR_K;
    ctx.fillRect(fx - 1, fy - 1, sz + 2, sz + 2);
    ctx.fillStyle = cols[k % 3];
    ctx.fillRect(fx, fy, sz, sz);
  }
  if (!pixelMode) {
    ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-112, 32, 12 * Math.min(1.6, boost), 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCarCargo2D(ctx) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = CAR_K;
  if (INTRO_TOWN.id === 'xmas') {
    // Gift stack + bow
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-96, -16, 21, 14, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-87, -15, 3, 12);
    ctx.fillRect(-95, -10.5, 19, 3);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.roundRect(-92, -27, 14, 11, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-86, -26, 2.5, 9);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(-88, -30, 3, 2.2, -0.5, 0, Math.PI * 2);
    ctx.ellipse(-81.5, -30, 3, 2.2, 0.5, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Boombox
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.roundRect(-97, -17, 25, 15, 2.5);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-93, -17);
    ctx.lineTo(-93, -22);
    ctx.lineTo(-76, -22);
    ctx.lineTo(-76, -17);
    ctx.stroke();
    [-91, -78].forEach((sx) => {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(sx, -9.5, 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(sx, -9.5, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function drawCarWheel2D(ctx, wx, wy, angle) {
  ctx.fillStyle = '#0b1020';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(wx, wy, 16.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(wx, wy, 13, 0, Math.PI * 2);
  ctx.stroke();
  const rim = ctx.createRadialGradient(wx - 3, wy - 3, 1, wx, wy, 10);
  rim.addColorStop(0, '#ffffff');
  rim.addColorStop(0.55, '#e2e8f0');
  rim.addColorStop(1, '#94a3b8');
  ctx.fillStyle = rim;
  ctx.beginPath();
  ctx.arc(wx, wy, 10, 0, Math.PI * 2);
  ctx.fill();
  // Spinner spokes
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const a = angle + (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.moveTo(wx + Math.cos(a) * 3, wy + Math.sin(a) * 3);
    ctx.lineTo(wx + Math.cos(a + 0.35) * 8.6, wy + Math.sin(a + 0.35) * 8.6);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#f472b6';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(wx, wy, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function traceCarBody2D(ctx) {
  ctx.beginPath();
  ctx.moveTo(-92, -2);
  ctx.lineTo(-62, -2);
  ctx.lineTo(-60, 3);
  ctx.lineTo(34, 3);
  ctx.lineTo(44, 6);
  ctx.lineTo(86, 9);
  ctx.quadraticCurveTo(95, 10, 96, 18);
  ctx.lineTo(96, 30);
  ctx.quadraticCurveTo(95, 36, 88, 36);
  ctx.lineTo(-90, 36);
  ctx.quadraticCurveTo(-97, 36, -97, 29);
  ctx.lineTo(-96, 4);
  ctx.quadraticCurveTo(-95, -2, -92, -2);
  ctx.closePath();
}

// Smooth 2D car (scenes 1–3). Origin = door line under the pilot; tyres touch y = +47.
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

  // 1. Cyan underglow + headlight beam
  if (lightsOn) {
    const glow = 0.42 + Math.sin(now * 0.012) * 0.14;
    const ug = ctx.createRadialGradient(0, 46, 4, 0, 46, 100);
    ug.addColorStop(0, `rgba(34, 211, 238, ${glow})`);
    ug.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.fillStyle = ug;
    ctx.beginPath();
    ctx.ellipse(0, 46, 100, 11, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (lightsOn && beam) {
    const light = ctx.createLinearGradient(96, 0, 210, 0);
    light.addColorStop(0, 'rgba(253, 224, 71, 0.32)');
    light.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.moveTo(94, 12);
    ctx.lineTo(210, -6);
    ctx.lineTo(210, 40);
    ctx.lineTo(94, 20);
    ctx.closePath();
    ctx.fill();
  }

  drawCarExhaustFlame(ctx, now, boost, false);

  // 2. Roll bar, seat and cargo behind the pilot
  const bar = ctx.createLinearGradient(-70, 0, -62, 0);
  bar.addColorStop(0, '#f8fafc');
  bar.addColorStop(1, '#94a3b8');
  ctx.fillStyle = bar;
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-71, -36, 9, 42, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(-58, -30, 12, 34, 4);
  ctx.fill();
  ctx.stroke();
  drawCarCargo2D(ctx);

  // 3. Pilot (upper body in the open top)
  if (withPilot) drawCarPilot(ctx, false, now, { spId, isShocked, isImpactBlink, lift: pilotLift });

  // 4. Body: mint paint, hot-pink rocker, white pinstripe
  traceCarBody2D(ctx);
  const paint = ctx.createLinearGradient(0, -2, 0, 36);
  paint.addColorStop(0, '#a7f3e8');
  paint.addColorStop(0.35, '#2dd4bf');
  paint.addColorStop(1, '#0f766e');
  ctx.fillStyle = paint;
  ctx.fill();
  ctx.save();
  traceCarBody2D(ctx);
  ctx.clip();
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-100, 24, 200, 14);
  ctx.fillStyle = '#be185d';
  ctx.fillRect(-100, 32, 200, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(-100, 21, 200, 1.6);
  // Dark wheel arches
  ctx.fillStyle = '#0b1020';
  [-52, 54].forEach((wx) => {
    ctx.beginPath();
    ctx.arc(wx, 31, 20, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  traceCarBody2D(ctx);
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Gloss, door seam, handle, heart decal
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-56, 7);
  ctx.lineTo(30, 7);
  ctx.moveTo(48, 11);
  ctx.lineTo(84, 13);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(9, 13, 26, 0.4)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-6, 6);
  ctx.lineTo(-6, 21);
  ctx.stroke();
  ctx.fillStyle = CAR_K;
  ctx.fillRect(-22, 10, 9, 2.6);
  drawPixelHeart(ctx, 12, 14, 1.7, '#f472b6');

  // 5. Windshield (glass tint only, the pilot stays visible) and chrome bits
  ctx.fillStyle = 'rgba(186, 230, 253, 0.34)';
  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(24, 3);
  ctx.lineTo(42, 4);
  ctx.lineTo(31, -30);
  ctx.lineTo(23, -30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(29, -1);
  ctx.lineTo(28, -24);
  ctx.stroke();

  ctx.strokeStyle = CAR_K;
  ctx.lineWidth = 1.8;
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(90, 24, 9, 8, 2);
  ctx.roundRect(-101, 24, 9, 8, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.roundRect(-105, 30, 9, 4, 1.5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = lightsOn ? '#fde047' : '#a16207';
  ctx.beginPath();
  ctx.roundRect(87, 12, 8, 6, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = lightsOn ? '#fb7185' : '#9f1239';
  ctx.beginPath();
  ctx.roundRect(-98, 6, 5, 10, 1.5);
  ctx.fill();
  ctx.stroke();

  // 6. Chrome spinner wheels
  drawCarWheel2D(ctx, -52, 31, wheelAngle);
  drawCarWheel2D(ctx, 54, 31, wheelAngle);

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

// 16-bit pixel car (scenes 3–5), same silhouette as the 2D car on a 2px grid
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
      const sx = Math.round((60 + sp * 16) / 4) * 4;
      const sy = Math.round((2 - sp * 34) / 4) * 4;
      const sz = s % 2 === 0 ? 8 : 6;
      ctx.fillStyle = s % 2 === 0 ? 'rgba(148, 163, 184, 0.7)' : 'rgba(250, 204, 21, 0.72)';
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  if (lightsOn) {
    const glow = 0.4 + (Math.floor(now / 160) % 2) * 0.16;
    ctx.fillStyle = `rgba(34, 211, 238, ${glow})`;
    ctx.fillRect(-84, 44, 168, 4);
    ctx.fillStyle = `rgba(34, 211, 238, ${glow * 0.5})`;
    ctx.fillRect(-64, 48, 128, 4);
  }
  if (lightsOn && beam) {
    ctx.fillStyle = 'rgba(253, 224, 71, 0.18)';
    ctx.fillRect(98, 8, 44, 14);
    ctx.fillStyle = 'rgba(253, 224, 71, 0.09)';
    ctx.fillRect(142, 4, 44, 22);
  }
  drawCarExhaustFlame(ctx, now, boost, true);

  // Roll bar + seat
  ctx.fillStyle = CAR_K;
  ctx.fillRect(-72, -38, 12, 44);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-70, -36, 8, 40);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-64, -36, 2, 40);
  ctx.fillStyle = CAR_K;
  ctx.fillRect(-60, -32, 16, 38);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-58, -30, 12, 34);

  // Cargo
  if (INTRO_TOWN.id === 'xmas') {
    ctx.fillStyle = CAR_K;
    ctx.fillRect(-98, -18, 26, 18);
    ctx.fillRect(-94, -30, 18, 14);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-96, -16, 22, 14);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-92, -28, 14, 10);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-87, -16, 4, 14);
    ctx.fillRect(-96, -10, 22, 2);
    ctx.fillRect(-90, -34, 4, 4);
    ctx.fillRect(-82, -34, 4, 4);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-86, -28, 2, 10);
  } else {
    ctx.fillStyle = CAR_K;
    ctx.fillRect(-98, -24, 28, 24);
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-96, -18, 24, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-94, -14, 8, 8);
    ctx.fillRect(-82, -14, 8, 8);
    ctx.fillStyle = CAR_K;
    ctx.fillRect(-92, -12, 4, 4);
    ctx.fillRect(-80, -12, 4, 4);
  }

  drawCarPilot(ctx, true, now, { spId, isShocked, isImpactBlink: forceBlink, lift: pilotLift });

  // Body blocks: outline, mint fill, highlight, pink rocker
  const blocks = [
    [-96, -2, 34, 38],
    [-60, 2, 96, 34],
    [38, 6, 54, 30],
    [92, 12, 4, 22],
  ];
  ctx.fillStyle = CAR_K;
  blocks.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#2dd4bf';
  blocks.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#99f6e4';
  blocks.slice(0, 3).forEach(([x, y, w]) => ctx.fillRect(x, y, w, 4));
  ctx.fillStyle = '#14b8a6';
  ctx.fillRect(-96, 16, 188, 6);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-96, 22, 192, 2);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-96, 24, 192, 8);
  ctx.fillStyle = '#be185d';
  ctx.fillRect(-96, 32, 192, 4);
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(-8, 8, 2, 14);
  ctx.fillStyle = CAR_K;
  ctx.fillRect(-22, 10, 8, 2);
  drawPixelHeart(ctx, 12, 13, 2, '#f472b6');

  // Wheel arches (inside the body only), tyres and spinner rims
  [-52, 54].forEach((wx) => fillPixelDisc(ctx, wx, 31, 20, CAR_K, 36));
  const spinState = Math.floor(((wheelAngle % (Math.PI / 2)) + Math.PI / 2) / (Math.PI / 4)) % 2;
  [-52, 54].forEach((wx) => {
    fillPixelDisc(ctx, wx, 31, 18, CAR_K);
    fillPixelDisc(ctx, wx, 31, 16, '#1f2937');
    fillPixelDisc(ctx, wx, 31, 12, '#374151');
    fillPixelDisc(ctx, wx, 31, 10, '#e2e8f0');
    ctx.fillStyle = '#64748b';
    if (spinState === 0) {
      ctx.fillRect(wx - 1, 23, 2, 16);
      ctx.fillRect(wx - 8, 30, 16, 2);
    } else {
      for (let k = -3; k <= 3; k++) {
        ctx.fillRect(wx + k * 2 - 1, 30 + k * 2, 2, 2);
        ctx.fillRect(wx - k * 2 - 1, 30 + k * 2, 2, 2);
      }
    }
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(wx - 2, 29, 4, 4);
  });

  // Windshield pillar (stepped), bumpers, exhaust, lights
  const pillar = [
    [23, -32, 8, 10],
    [25, -22, 8, 10],
    [27, -12, 8, 10],
    [29, -2, 8, 6],
  ];
  ctx.fillStyle = CAR_K;
  pillar.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#e2e8f0';
  pillar.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#7dd3fc';
  pillar.forEach(([x, y, , h]) => ctx.fillRect(x + 4, y, 2, h));
  ctx.fillStyle = CAR_K;
  ctx.fillRect(90, 22, 12, 12);
  ctx.fillRect(-104, 22, 12, 12);
  ctx.fillRect(-110, 28, 14, 8);
  ctx.fillRect(86, 10, 10, 10);
  ctx.fillRect(-100, 4, 8, 14);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(92, 24, 8, 8);
  ctx.fillRect(-102, 24, 8, 8);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-108, 30, 10, 4);
  ctx.fillStyle = lightsOn ? '#fde047' : '#a16207';
  ctx.fillRect(88, 12, 6, 6);
  ctx.fillStyle = lightsOn ? '#fb7185' : '#9f1239';
  ctx.fillRect(-98, 6, 4, 10);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Obstacles (drawn from their left edge on the road; heights grow upward)
// ---------------------------------------------------------------------------
function drawCarObstacle(ctx, o, groundY, now) {
  ctx.save();
  ctx.lineJoin = 'round';
  const baseX = Math.round(o.x);
  if (o.mode === 'over') {
    ctx.fillStyle = 'rgba(9, 13, 26, 0.28)';
    ctx.beginPath();
    ctx.ellipse(baseX + o.w / 2, groundY + 2, o.w / 2 + 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (o.type === 'ICE') {
    for (let u = 0; u < o.size; u++) {
      const x = baseX + u * 42 + 2;
      const y = groundY - 40 - (u % 2) * 2;
      const g = ctx.createLinearGradient(x, y, x + 38, y + 40);
      g.addColorStop(0, '#f0f9ff');
      g.addColorStop(0.5, '#bae6fd');
      g.addColorStop(1, '#38bdf8');
      ctx.fillStyle = g;
      ctx.strokeStyle = '#0c4a6e';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.roundRect(x, y, 38, 40 + (u % 2) * 2, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(x + 6, y + 6, 10, 4);
      ctx.fillRect(x + 6, y + 12, 4, 8);
      ctx.strokeStyle = 'rgba(12, 74, 110, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 24, y + 4);
      ctx.lineTo(x + 20, y + 18);
      ctx.lineTo(x + 28, y + 26);
      ctx.stroke();
    }
  } else if (o.type === 'GIFTS') {
    const palette = [
      ['#ef4444', '#fde047'],
      ['#22c55e', '#f8fafc'],
      ['#8b5cf6', '#fde047'],
    ];
    for (let u = 0; u < o.size; u++) {
      const x = baseX + u * 56;
      const [c1, r1] = palette[(o.seed + u) % 3];
      const [c2, r2] = palette[(o.seed + u + 1) % 3];
      ctx.strokeStyle = CAR_K;
      ctx.lineWidth = 2.4;
      ctx.fillStyle = c1;
      ctx.beginPath();
      ctx.roundRect(x + 2, groundY - 32, 52, 32, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = r1;
      ctx.fillRect(x + 25, groundY - 31, 6, 30);
      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.roundRect(x + 10, groundY - 56, 36, 24, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = r2;
      ctx.fillRect(x + 25, groundY - 55, 6, 22);
      ctx.strokeStyle = r2;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(x + 22, groundY - 60, 6, 4, -0.5, 0, Math.PI * 2);
      ctx.ellipse(x + 34, groundY - 60, 6, 4, 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (o.type === 'SNOWMAN') {
    const cx = baseX + 25;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.4;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, groundY - 22, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, groundY - 59, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Stick arms
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 18, groundY - 34);
    ctx.lineTo(cx - 34, groundY - 48);
    ctx.moveTo(cx + 18, groundY - 34);
    ctx.lineTo(cx + 32, groundY - 46);
    ctx.stroke();
    // Scarf
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 14, groundY - 46, 28, 6);
    ctx.fillRect(cx + 4, groundY - 44, 6, 14);
    // Hat
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - 16, groundY - 76, 32, 5);
    ctx.fillRect(cx - 10, groundY - 94, 20, 19);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 10, groundY - 80, 20, 4);
    // Face (looks at the car) and coal buttons
    ctx.fillStyle = '#111827';
    ctx.fillRect(cx - 8, groundY - 65, 4, 4);
    ctx.fillRect(cx + 2, groundY - 65, 4, 4);
    ctx.fillRect(cx - 2, groundY - 28, 4, 4);
    ctx.fillRect(cx - 2, groundY - 16, 4, 4);
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(cx - 2, groundY - 60);
    ctx.lineTo(cx - 20, groundY - 57);
    ctx.lineTo(cx - 2, groundY - 54);
    ctx.closePath();
    ctx.fill();
  } else if (o.type === 'SKUA') {
    const flap = Math.floor((now + o.seed * 37) / 140) % 2;
    const y = groundY - o.lift - 18;
    const x = baseX;
    // Wings
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
    // Body
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.ellipse(x + 32, y + 2, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e7e5e4';
    ctx.beginPath();
    ctx.ellipse(x + 28, y + 6, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head, angry brow and hooked beak (faces the car)
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
    // Tail
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

// ---------------------------------------------------------------------------
// Road + scrolling sky (bg_ref_skygame tiled with its mirror so the seam never shows)
// ---------------------------------------------------------------------------
function drawCarRoadBackground(ctx, now, scroll) {
  ensureIntroBackgrounds();
  const img = MOTION_STATE.bgRefSkyGameImg;
  if (MOTION_STATE.bgRefSkyGameLoaded && img) {
    ctx.imageSmoothingEnabled = true;
    const tile = 1920;
    const off = -((scroll * 0.16) % tile);
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

  // String-light poles along the far edge of the road
  const poleGap = 320;
  const poleOff = -(scroll % poleGap);
  const bulbCols = isXmas ? ['#ef4444', '#22c55e', '#facc15', '#38bdf8'] : ['#f9a8d4', '#fff1f2', '#f472b6', '#fde047'];
  for (let k = -1; k < 5; k++) {
    const px = Math.round(poleOff + k * poleGap);
    const nx = px + poleGap;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(px, G - 96);
    ctx.quadraticCurveTo(px + poleGap / 2, G - 70, nx, G - 96);
    ctx.stroke();
    for (let b = 1; b < 10; b++) {
      const t = b / 10;
      const bx = px + poleGap * t;
      const by = G - 96 + 2 * t * (1 - t) * 26 + 3;
      const lit = (Math.floor(now / 380) + b + k) % 3 !== 0;
      ctx.fillStyle = CAR_K;
      ctx.fillRect(Math.round(bx) - 3, Math.round(by) - 1, 6, 7);
      ctx.fillStyle = lit ? bulbCols[(b + k + 8) % 4] : '#475569';
      ctx.fillRect(Math.round(bx) - 2, Math.round(by), 4, 5);
    }
    ctx.fillStyle = CAR_K;
    ctx.fillRect(px - 3, G - 102, 6, 72);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(px - 2, G - 100, 4, 68);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(px - 5, G - 106, 10, 5);
  }

  // Snowbank lip, neon road edge, asphalt, lane dashes, near shoulder
  const lipOff = -(scroll % 32);
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, G - 36, 960, 10);
  for (let x = lipOff - 32; x < 960; x += 32) {
    const bump = 4 + (Math.abs(Math.round((x - lipOff) / 32 + Math.floor(scroll / 32))) % 3) * 3;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(Math.round(x), G - 36 - bump, 30, bump);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(Math.round(x), G - 28, 30, 2);
  }
  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(0, G - 26, 960, 3);
  ctx.fillStyle = '#0b1020';
  ctx.fillRect(0, G - 23, 960, 2);
  ctx.fillStyle = '#1b2232';
  ctx.fillRect(0, G - 21, 960, 540 - (G - 21));
  ctx.fillStyle = '#232c40';
  const grainOff = -(scroll % 74);
  for (let x = grainOff - 74; x < 960; x += 74) {
    ctx.fillRect(Math.round(x), G - 8, 6, 2);
    ctx.fillRect(Math.round(x) + 33, G + 14, 8, 2);
    ctx.fillRect(Math.round(x) + 51, G + 40, 5, 2);
  }
  const dashOff = -(scroll % 128);
  for (let x = dashOff - 128; x < 960; x += 128) {
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(Math.round(x) - 1, G + 25, 50, 7);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(Math.round(x), G + 26, 48, 5);
  }
  ctx.fillStyle = '#0b1020';
  ctx.fillRect(0, 528, 960, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 530, 960, 10);

  // Speed streaks get denser as the road speeds up
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let w = 0; w < 9; w++) {
    const wx = 960 - (((now * (0.5 + (w % 3) * 0.16) + w * 149 + scroll * 0.4) % 1100) | 0);
    const wy = 92 + ((w * 47) % 250);
    ctx.fillRect(wx, wy, 60 + (w % 4) * 26, 2);
  }

  // Falling snow
  if (isXmas) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let s = 0; s < 26; s++) {
      const sx = (((s * 97 - scroll * 0.55 - now * 0.02) % 980) + 980) % 980 - 10;
      const sy = (s * 53 + now * 0.06) % (G - 30);
      ctx.fillRect(Math.round(sx), Math.round(sy), s % 3 === 0 ? 4 : 2, s % 3 === 0 ? 4 : 2);
    }
  }
}

function drawCarRunHud(ctx, now, run) {
  ctx.save();
  const hx = 16;
  const hy = 12;
  const hw = 452;
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
  ctx.fillText(`SCORE ${run.score.toLocaleString()}`, hx + 102, hy + hh / 2 + 1);
  if (run.combo > 1) {
    ctx.fillStyle = '#34d399';
    ctx.fillText(`x${run.combo}`, hx + 212, hy + hh / 2 + 1);
  }
  for (let s = 0; s < CAR_CFG.HEARTS; s++) {
    drawPixelHeart(ctx, hx + 256 + s * 22, hy + hh / 2, 2.1, s < run.hearts ? '#f472b6' : '#334155');
  }
  const kmh = Math.round(run.speed * 12);
  ctx.fillStyle = run.level >= 7 ? '#fb7185' : run.level >= 4 ? '#fde047' : '#bae6fd';
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`LV.${run.level} · ${kmh}km/h`, hx + hw - 14, hy + hh / 2 + 1);
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

  const events = carStep(run, dt, now, Math.random);
  let crashed = false;
  events.forEach((ev) => {
    if (ev.type === 'jump') {
      spawnCarBurst(CAR_CFG.CAR_X - 50 * S, G - 4, ['#f8fafc', '#cbd5e1'], 6, 2.6, 6);
    } else if (ev.type === 'land') {
      CAR_GAME.landAt = now;
      spawnCarBurst(CAR_CFG.CAR_X - 50 * S, G - 4, ['#f8fafc', '#e2e8f0', '#bae6fd'], 6, 3, 6);
      spawnCarBurst(CAR_CFG.CAR_X + 54 * S, G - 4, ['#f8fafc', '#e2e8f0', '#bae6fd'], 6, 3, 6);
    } else if (ev.type === 'star') {
      CAR_GAME.popups.push({ x: ev.x, y: G - ev.h - 18, vy: -1.6, text: `+${ev.points}`, col: '#fde047', alpha: 1 });
      spawnCarBurst(ev.x, G - ev.h, ['#fde047', '#fef08a', '#ffffff'], 7, 3.2, 5);
    } else if (ev.type === 'clear') {
      const o = ev.obstacle;
      CAR_GAME.popups.push({ x: o.x + o.w / 2, y: G - o.clearH - 20, vy: -1.2, text: `+${ev.points}`, col: '#67e8f9', alpha: 0.9 });
    } else if (ev.type === 'hit') {
      const o = ev.obstacle;
      const ox = o.x + o.w / 2;
      const oy = G - o.lift - 24;
      const cols =
        o.type === 'ICE'
          ? ['#e0f2fe', '#7dd3fc', '#ffffff']
          : o.type === 'GIFTS'
          ? ['#ef4444', '#22c55e', '#fde047']
          : o.type === 'SNOWMAN'
          ? ['#f8fafc', '#e2e8f0', '#f97316']
          : ['#78716c', '#e7e5e4', '#facc15'];
      spawnCarBurst(ox, oy, cols, 16, 5, 7);
      CAR_GAME.hitFlashUntil = now + 520;
      CAR_GAME.shakeUntil = now + 300;
      CAR_GAME.popups.push({
        x: CAR_CFG.CAR_X,
        y: carOriginY() - 80,
        vy: -1.5,
        text: run.hearts > 0 ? 'BUMP -1' : 'CRASH',
        col: '#fb7185',
        alpha: 1,
      });
    } else if (ev.type === 'level') {
      CAR_GAME.popups.push({
        x: 480,
        y: 92,
        vy: -1.2,
        text: `LV.${ev.level} SPEED UP! +${ev.points}`,
        col: '#fde047',
        alpha: 1,
      });
    } else if (ev.type === 'crash') {
      crashed = true;
    }
  });

  ctx.save();
  if (now < CAR_GAME.shakeUntil) {
    const mag = ((CAR_GAME.shakeUntil - now) / 520) * 8;
    ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
  }

  drawCarRoadBackground(ctx, now, run.distance);

  // Obstacles behind stars and the car
  run.obstacles.forEach((o) => drawCarObstacle(ctx, o, G, now));
  run.stars.forEach((s) => {
    ctx.save();
    ctx.translate(s.x, G - s.h + Math.sin(now * 0.01 + s.x * 0.02) * 3);
    drawGoldenStarCollectible(ctx, 14, now);
    ctx.restore();
  });

  // Car shadow + car
  const shadowW = Math.max(60, 170 - run.h * 0.45);
  ctx.fillStyle = `rgba(9, 13, 26, ${Math.max(0.12, 0.34 - run.h * 0.001)})`;
  ctx.beginPath();
  ctx.ellipse(CAR_CFG.CAR_X + 2, G + 2, shadowW / 2, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const sinceLand = now - CAR_GAME.landAt;
  const squash = sinceLand < 140 && !run.jumping ? Math.sin((sinceLand / 140) * Math.PI) * 3 : 0;
  const bob = run.jumping ? 0 : Math.round(Math.sin(now * 0.05) * 0.8) + squash;
  const tilt = run.jumping ? Math.max(-0.2, Math.min(0.22, -run.vh * 0.012)) : 0;
  const invuln = now < run.invulnUntil;
  if (!invuln || Math.floor(now / 90) % 2 === 0) {
    drawCarWithPilot(ctx, CAR_CFG.CAR_X, carOriginY() + bob, tilt, now, {
      scale: S,
      spId,
      isShocked: now < CAR_GAME.hitFlashUntil,
      isImpactBlink: now < CAR_GAME.hitFlashUntil - 420,
      wheelAngle: run.distance / 16,
      boost: run.jumping ? 1.4 : 0.6 + (run.speed - CAR_CFG.SPEED) / 12,
    });
  }

  // Particles + popups (same feel as the UFO stage)
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

  // How-to hint until the first few jumps
  if (run.jumps < 3 && now - run.startAt < 9000) {
    const msg =
      CURRENT_LANG === 'ko' ? '누르면 점프 · 길게 누르면 더 높이' : 'Tap to jump · hold to jump higher';
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

// ============================================================================
// SCENE 1 — vehicle picker: the parked car on the right ice shelf + a marker over the chosen vehicle
// ============================================================================
const SCENE0_CAR_SPOT = { x: 860, y: 165, tilt: -0.16, scale: 0.8 };
const SCENE0_UFO_SPOT = { x: 480, y: 255 };

function drawScene0VehiclePicker(ctx, now) {
  const isCar = MOTION_STATE.vehicle === 'car';
  const spot = SCENE0_CAR_SPOT;
  ctx.save();
  if (isCar) {
    const pulse = 0.3 + 0.3 * Math.sin(now * 0.008);
    const g = ctx.createRadialGradient(spot.x, spot.y + 14, 6, spot.x, spot.y + 14, 110);
    g.addColorStop(0, `rgba(244, 114, 182, ${pulse * 0.5})`);
    g.addColorStop(1, 'rgba(244, 114, 182, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(spot.x - 120, spot.y - 90, 240, 200);
  }
  ctx.fillStyle = 'rgba(9, 13, 26, 0.3)';
  ctx.beginPath();
  ctx.ellipse(spot.x - 2, spot.y + 38 * spot.scale, 82 * spot.scale, 6, spot.tilt, 0, Math.PI * 2);
  ctx.fill();
  drawCarWithPilot(ctx, spot.x, spot.y, spot.tilt, now, {
    scale: spot.scale,
    withPilot: false,
    lightsOn: isCar,
    wheelAngle: 0,
  });

  // Bouncing pixel marker + label over the chosen vehicle
  const target = isCar ? { x: spot.x, y: spot.y - 40 * spot.scale - 14 } : { x: SCENE0_UFO_SPOT.x, y: 104 };
  const bounce = Math.floor(now / 260) % 2 === 0 ? 0 : -4;
  const label = isCar ? (CURRENT_LANG === 'ko' ? '자동차' : 'CAR') : CURRENT_LANG === 'ko' ? '우주선' : 'UFO';
  const accent = isCar ? '#f472b6' : '#67e8f9';
  ctx.font = '900 13px "Pretendard", "Malgun Gothic", sans-serif';
  const lw = Math.ceil(ctx.measureText(label).width) + 22;
  const lx = Math.round(target.x - lw / 2);
  const ly = Math.round(target.y - 40 + bounce);
  ctx.fillStyle = CAR_K;
  ctx.fillRect(lx - 2, ly - 2, lw + 4, 26);
  ctx.fillStyle = accent;
  ctx.fillRect(lx, ly, lw, 22);
  ctx.fillStyle = CAR_K;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, target.x, ly + 12);
  const ax = Math.round(target.x);
  const ay = ly + 26;
  ctx.fillStyle = CAR_K;
  ctx.fillRect(ax - 8, ay, 16, 4);
  ctx.fillRect(ax - 6, ay + 4, 12, 4);
  ctx.fillRect(ax - 4, ay + 8, 8, 4);
  ctx.fillStyle = accent;
  ctx.fillRect(ax - 6, ay, 12, 2);
  ctx.fillRect(ax - 4, ay + 4, 8, 2);
  ctx.fillRect(ax - 2, ay + 8, 4, 2);
  ctx.restore();
}

// Which vehicle a click on the scene 1 picture picks (null = neither)
function scene0VehicleAt(mx, my) {
  const s = SCENE0_CAR_SPOT;
  if (mx >= s.x - 100 * s.scale && mx <= s.x + 100 * s.scale && my >= s.y - 80 && my <= s.y + 50 * s.scale) return 'car';
  const dx = (mx - SCENE0_UFO_SPOT.x) / 270;
  const dy = (my - SCENE0_UFO_SPOT.y) / 130;
  if (dx * dx + dy * dy <= 1) return 'ufo';
  return null;
}

// ============================================================================
// SCENE 2 — car take-off: floors it across the cracking ice and launches off the edge
// ============================================================================
function drawCarScene1Liftoff(ctx, now, p, spId) {
  const S = 1.22;
  const launch = p > 0.6 ? (p - 0.6) / 0.4 : 0;
  const carX = 150 + p * 400;
  const groundY = 470;
  const hop = Math.abs(Math.sin(now * 0.022)) * 5 * (1 - launch);
  const carY = groundY - 47 * S - hop - launch * launch * 190;
  const tilt = -0.04 - launch * 0.24 + Math.sin(now * 0.05) * 0.01;

  // Horizontal anime speed lines
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  for (let i = 0; i < 22; i++) {
    const ly = 70 + ((i * 53) % 420);
    const len = 90 + ((i * 37) % 160);
    const lx = 960 - ((now * (0.9 + (i % 4) * 0.25) + i * 211) % 1260);
    ctx.lineWidth = i % 3 === 0 ? 3 : 1.6;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + len, ly);
    ctx.stroke();
  }
  ctx.restore();

  // Snow spray off the rear tyre
  ctx.save();
  for (let t = 0; t < 12; t++) {
    const tp = (now * 0.004 + t * 0.083) % 1;
    const tx = carX - 70 * S - tp * 150 + Math.sin(t * 2.1) * 10;
    const ty = groundY - 6 - hop - launch * 120 * tp - Math.sin(tp * Math.PI) * 40;
    const sz = Math.max(4, Math.round((1 - tp) * 11));
    ctx.fillStyle = CAR_K;
    ctx.fillRect(tx - 1, ty - 1, sz + 2, sz + 2);
    ctx.fillStyle = t % 3 === 0 ? '#bae6fd' : '#f8fafc';
    ctx.fillRect(tx, ty, sz, sz);
  }
  ctx.restore();

  if (launch < 0.6) {
    ctx.fillStyle = 'rgba(9, 13, 26, 0.3)';
    ctx.beginPath();
    ctx.ellipse(carX, groundY + 2, 100 * (1 - launch), 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCarWithPilot(ctx, carX, carY, tilt, now, {
    scale: S,
    spId,
    wheelAngle: now * 0.06,
    boost: 1.8,
  });

  drawRetroSpeechBubble(
    ctx,
    Math.min(520, carX + 10),
    Math.max(64, carY - 112),
    CURRENT_LANG === 'ko' ? '야야 남극 깨진다!! 풀악셀 밟는다 꽉 잡아!!' : 'Antarctica is cracking!! Floor it, hold on!!',
    '#f472b6',
    now
  );
}
