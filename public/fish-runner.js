// ============================================================================
// ICE FISHING (얼음낚시 — "탈출은 무슨 낚시나 하자~")
//
// Fourth mini-game, the anti-escape option: while the other three modes flee collapsing Antarctica by plane,
// icebreaker or car, this penguin sits by a giant glacier ice hole (bg_ref_fishing.jpg) with only its chubby
// flipper/hand holding a fishing rod in the bottom-right corner and plays a Stardew Valley-style vertical catch-bar
// tension game with one button (Space / Click / Touch).
//
// Physics follow ConcernedApe's Stardew Valley BobberBar & MIT-licensed ctbot000/fishing-game:
//   - Holding the button applies upward buoyancy acceleration (LIFT) to the green catch bar; releasing applies
//     gravity (GRAVITY), with velocity damping and a soft bounce off the floor of the track;
//   - Five fish AI movement archetypes (smooth, floater, sinker, dart, boss) move the fish icon along the track;
//   - Keeping the green catch bar over the fish fills the catch progress gauge (with 110ms reel-click ticks);
//     letting the fish slip outside drains the gauge and frays line tension (energy);
//   - A Treasure Chest spawns on 45% of casts: hovering the green bar over the chest fills its golden ring for a
//     bonus jackpot and line repair when the fish is landed.
// ============================================================================
const FISH_CFG = {
  STAGE_W: 960,
  STAGE_H: 540,
  HOLE_CX: 432,
  HOLE_CY: 356,
  HOLE_RX: 204,
  HOLE_RY: 60,
  TRACK_H: 300,
  BAR_H_BASE: 86,
  BAR_H_MIN: 68,
  LIFT: 0.44,
  GRAVITY: 0.35,
  REVERSE_ASSIST: 0.28,
  DAMPING: 0.94,
  MAX_VY: 6.8,
  BOUNCE_FLOOR: 0.34,
  BOUNCE_CEIL: 0.22,
  LURE_MIN_FRAMES: 38, // ~0.63 s
  LURE_MAX_FRAMES: 68, // ~1.13 s (fast arcade pacing: no boring wait)
  BITE_WINDOW_FRAMES: 48, // 0.8 s to hit a PERFECT STRIKE
  LAND_ANIM_FRAMES: 52, // ~0.86 s celebration arc into the tackle box
  SLIP_ANIM_FRAMES: 32,
  ENERGY_MAX: 100,
  COLD_DRAIN_PER_SEC: 1.65, // ambient freeze on the line (ramps up with level)
  FRAY_DRAIN_PER_SEC: 11.5, // tension drain while the fish is outside the green bar
  ESCAPE_PENALTY: 24, // line shock if the catch gauge empties completely
  CATCH_HEAL: 4,
  CHEST_HEAL: 8,
  CHEST_CHANCE: 0.42,
  CHEST_FILL_RATE: 0.022, // ~0.75 s over the chest fills it
  CHEST_BONUS: 180,
  PERFECT_HOOK_BONUS: 80,
  START_PROGRESS_NORMAL: 0.22,
  START_PROGRESS_PERFECT: 0.34,
  SECONDS_PER_LEVEL: 6,
  MAX_LEVEL: 10,
  MAX_COMBO: 6,
  PASSIVE_SCORE_PER_SEC: 10,
};

const FISH_K = '#0b1020';

const FISH_SPECIES = [
  {
    id: 'smelt',
    ko: '남극 빙어',
    en: 'Antarctic Smelt',
    tier: 'common',
    pattern: 'smooth',
    minLv: 1,
    pts: 120,
    fillRate: 0.012,
    drainRate: 0.0068,
    dodge: 0.28,
    speed: 0.085,
    col: '#38bdf8',
    belly: '#e0f2fe',
    accent: '#0284c7',
    size: 1.0,
    quoteKo: '입질 맛집이네~ 초장 가져와라!!',
    quoteEn: 'Fresh Antarctic smelt~ pass the sauce!!',
  },
  {
    id: 'boot',
    ko: '누가 버린 탈출 부츠',
    en: "Escapee's Boot",
    tier: 'common',
    pattern: 'sinker',
    minLv: 1,
    pts: 150,
    fillRate: 0.0115,
    drainRate: 0.0072,
    dodge: 0.34,
    speed: 0.095,
    col: '#b45309',
    belly: '#fde68a',
    accent: '#ef4444',
    size: 1.08,
    quoteKo: '누가 도망가다 벗어던진 부츠냐 ㅋㅋ 안에 꽃게 들었음!',
    quoteEn: 'Someone lost a boot fleeing lol—there is a crab inside!',
  },
  {
    id: 'puffer',
    ko: '풍선 복어',
    en: 'Balloon Puffer',
    tier: 'uncommon',
    pattern: 'floater',
    minLv: 1,
    pts: 210,
    fillRate: 0.0106,
    drainRate: 0.0078,
    dodge: 0.46,
    speed: 0.11,
    col: '#facc15',
    belly: '#fef9c3',
    accent: '#ea580c',
    size: 1.15,
    quoteKo: '빵빵하게 부풀었네 ㅋㅋ 터지기 전에 건져!!',
    quoteEn: 'Puffed up like a balloon lol—land it before it pops!!',
  },
  {
    id: 'angler',
    ko: '심해 초롱아귀',
    en: 'Deep-Sea Angler',
    tier: 'rare',
    pattern: 'sinker',
    minLv: 2,
    pts: 290,
    fillRate: 0.0098,
    drainRate: 0.0085,
    dodge: 0.58,
    speed: 0.125,
    col: '#6366f1',
    belly: '#c7d2fe',
    accent: '#fde047',
    size: 1.24,
    quoteKo: '얼음구덩이 밑에 왜 심해어가 살아?!!',
    quoteEn: 'Why is a deep-sea angler living under this ice hole?!!',
  },
  {
    id: 'pumpkin',
    ko: '할로윈 호박 물고기',
    en: "Jack-o'-Fish",
    tier: 'rare',
    pattern: 'smooth',
    minLv: 2,
    pts: 350,
    fillRate: 0.0094,
    drainRate: 0.0088,
    dodge: 0.62,
    speed: 0.13,
    col: '#f97316',
    belly: '#ffedd5',
    accent: '#4ade80',
    size: 1.26,
    quoteKo: '물고기가 왜 호박 마스크를 쓰고 있냐 ㅋㅋㅋ',
    quoteEn: 'Why is this fish wearing a pumpkin mask lol?!!',
  },
  {
    id: 'krill',
    ko: '황금 대왕크릴',
    en: 'Golden Krill King',
    tier: 'epic',
    pattern: 'dart',
    minLv: 3,
    pts: 460,
    heal: 8,
    fillRate: 0.0090,
    drainRate: 0.0092,
    dodge: 0.72,
    speed: 0.14,
    col: '#fbbf24',
    belly: '#fef08a',
    accent: '#f43f5e',
    size: 1.30,
    quoteKo: '황금 크릴이다!! 낚싯줄 텐션까지 회복됨 ㅋㅋ',
    quoteEn: 'Golden Krill!! Restored line tension too lol',
  },
  {
    id: 'squid',
    ko: '남극 대왕오징어',
    en: 'Colossal Squid',
    tier: 'epic',
    pattern: 'dart',
    minLv: 4,
    pts: 640,
    fillRate: 0.0085,
    drainRate: 0.0096,
    dodge: 0.80,
    speed: 0.15,
    col: '#ec4899',
    belly: '#fbcfe8',
    accent: '#a855f7',
    size: 1.42,
    quoteKo: '다리만 열 개야!! 타코야끼 해먹자아악!!',
    quoteEn: 'Ten tentacles!! Think of all the takoyaki!!',
  },
  {
    id: 'whale',
    ko: '전설의 황금고래',
    en: 'Legendary Golden Whale',
    tier: 'legend',
    pattern: 'boss',
    minLv: 5,
    pts: 950,
    heal: 10,
    fillRate: 0.0080,
    drainRate: 0.0102,
    dodge: 0.88,
    speed: 0.165,
    col: '#f59e0b',
    belly: '#ffffff',
    accent: '#38bdf8',
    size: 1.60,
    quoteKo: '미쳤다 얼음구덩이에서 고래가 왜 나와?!!',
    quoteEn: 'Wait, how did a whole WHALE fit through this ice hole?!!',
  },
];

function fishLevelFor(seconds) {
  return Math.min(FISH_CFG.MAX_LEVEL, 1 + Math.floor(seconds / FISH_CFG.SECONDS_PER_LEVEL));
}

function fishBarHeightFor(level) {
  const t = (level - 1) / (FISH_CFG.MAX_LEVEL - 1);
  return Math.round(FISH_CFG.BAR_H_BASE + (FISH_CFG.BAR_H_MIN - FISH_CFG.BAR_H_BASE) * t);
}

function fishPickSpecies(level, rng) {
  const pool = FISH_SPECIES.filter((s) => s.minLv <= level);
  // Higher levels weight rarer catches more heavily
  const weights = pool.map((s, idx) => {
    const base = idx === 0 ? 1.3 : idx === 1 ? 0.9 : 1.0;
    const lvBoost = 1 + Math.max(0, level - s.minLv) * 0.22 + idx * (level * 0.06);
    return base * lvBoost;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function fishBeginCast(run, rng) {
  run.phase = 'lure';
  run.phaseFrames = 0;
  run.lureDuration = Math.round(
    FISH_CFG.LURE_MIN_FRAMES + rng() * (FISH_CFG.LURE_MAX_FRAMES - FISH_CFG.LURE_MIN_FRAMES)
  );
  run.nibbleTriggered = false;
  run.targetSp = fishPickSpecies(run.level, rng);
  run.strikePressed = false;
  run.perfectStrike = false;
  run.bobberDip = 0;
}

function fishBeginFight(run, perfect, rng) {
  const sp = run.targetSp;
  const barH = fishBarHeightFor(run.level);
  run.phase = 'fight';
  run.phaseFrames = 0;
  run.perfectStrike = perfect;
  run.barH = barH;
  run.barY = Math.round((FISH_CFG.TRACK_H - barH) * 0.35);
  run.barV = 0;
  run.fishY = Math.round(FISH_CFG.TRACK_H * (0.28 + rng() * 0.44));
  run.fishV = 0;
  run.fishTarget = run.fishY;
  run.nextJumpFrames = 14;
  run.progress = perfect ? FISH_CFG.START_PROGRESS_PERFECT : FISH_CFG.START_PROGRESS_NORMAL;
  run.onTarget = true;
  run.reelTickFrames = 0;
  run.fightFrames = 0;

  if (rng() < FISH_CFG.CHEST_CHANCE) {
    run.chest = {
      y: Math.round(42 + rng() * (FISH_CFG.TRACK_H - 84)),
      progress: 0,
      caught: false,
    };
  } else {
    run.chest = null;
  }
}

function createFishRun(startAt = 0, rng = Math.random) {
  const shadows = [];
  for (let i = 0; i < 6; i++) {
    shadows.push({
      ang: (i * Math.PI * 2) / 6 + rng() * 0.5,
      dist: 0.25 + rng() * 0.58,
      speed: (i % 2 === 0 ? 1 : -1) * (0.008 + rng() * 0.008),
      size: 0.75 + (i % 3) * 0.28,
      spIdx: i % FISH_SPECIES.length,
      wobble: rng() * Math.PI * 2,
    });
  }
  const run = {
    startAt,
    frames: 0,
    score: 0,
    rawPoints: 0,
    passiveAcc: 0,
    energy: FISH_CFG.ENERGY_MAX,
    level: 1,
    combo: 1,
    caughtCount: 0,
    chestsCaught: 0,
    hold: false,
    justPressed: false,
    phase: 'lure',
    phaseFrames: 0,
    lureDuration: 48,
    nibbleTriggered: false,
    targetSp: FISH_SPECIES[0],
    perfectStrike: false,
    barH: FISH_CFG.BAR_H_BASE,
    barY: 90,
    barV: 0,
    fishY: 140,
    fishV: 0,
    fishTarget: 140,
    nextJumpFrames: 20,
    progress: 0.25,
    onTarget: false,
    reelTickFrames: 0,
    fightFrames: 0,
    chest: null,
    lastCatch: null,
    bobberDip: 0,
    rodBend: 0,
    shadows,
    caughtStack: [],
  };
  fishBeginCast(run, rng);
  return run;
}

function fishPress(run) {
  if (!run) return;
  if (!run.hold) run.justPressed = true;
  run.hold = true;
}

function fishRelease(run) {
  if (!run) return;
  run.hold = false;
}

function fishStep(run, dt, now, rng = Math.random) {
  const events = [];
  run.frames += dt;
  const seconds = run.frames / 60;
  const newLevel = fishLevelFor(seconds);
  if (newLevel > run.level) {
    run.level = newLevel;
    const lvPts = newLevel * 120;
    run.rawPoints += lvPts;
    events.push({ type: 'level', level: newLevel, points: lvPts });
  }

  // Passive survival score for chilling at the ice hole while Antarctica collapses
  run.passiveAcc += (FISH_CFG.PASSIVE_SCORE_PER_SEC / 60) * dt;
  if (run.passiveAcc >= 1) {
    const add = Math.floor(run.passiveAcc);
    run.passiveAcc -= add;
    run.rawPoints += add;
  }

  // Ambient cold drain on line durability
  const coldScale = 1 + (run.level - 1) * 0.055;
  run.energy -= (FISH_CFG.COLD_DRAIN_PER_SEC / 60) * coldScale * dt;

  // Step ambient fish shadows inside the ice hole
  for (let i = 0; i < run.shadows.length; i++) {
    const sh = run.shadows[i];
    sh.ang += sh.speed * dt;
    sh.wobble += 0.09 * dt;
  }

  const pressed = run.justPressed;
  run.justPressed = false;
  run.phaseFrames += dt;

  if (run.phase === 'lure') {
    run.rodBend += (Math.sin(run.frames * 0.08) * 0.08 - run.rodBend) * 0.15 * dt;
    run.bobberDip *= Math.pow(0.86, dt);
    if (!run.nibbleTriggered && run.phaseFrames >= run.lureDuration * 0.55) {
      run.nibbleTriggered = true;
      run.bobberDip = 6;
      events.push({ type: 'nibble', x: FISH_CFG.HOLE_CX, y: FISH_CFG.HOLE_CY });
    }
    if (run.phaseFrames >= run.lureDuration) {
      run.phase = 'bite';
      run.phaseFrames = 0;
      run.bobberDip = 18;
      events.push({ type: 'bite', x: FISH_CFG.HOLE_CX, y: FISH_CFG.HOLE_CY, sp: run.targetSp });
    }
  } else if (run.phase === 'bite') {
    run.rodBend += (0.35 - run.rodBend) * 0.22 * dt;
    if (pressed) {
      // Timed strike during the '!!' window -> Perfect Hook!
      run.rawPoints += FISH_CFG.PERFECT_HOOK_BONUS;
      events.push({
        type: 'strike',
        perfect: true,
        points: FISH_CFG.PERFECT_HOOK_BONUS,
        x: FISH_CFG.HOLE_CX,
        y: FISH_CFG.HOLE_CY - 28,
      });
      fishBeginFight(run, true, rng);
    } else if (run.phaseFrames >= FISH_CFG.BITE_WINDOW_FRAMES) {
      // Auto-hook so a player holding or slightly late still enters the Stardew fight seamlessly
      events.push({
        type: 'strike',
        perfect: false,
        points: 0,
        x: FISH_CFG.HOLE_CX,
        y: FISH_CFG.HOLE_CY - 28,
      });
      fishBeginFight(run, false, rng);
    }
  } else if (run.phase === 'fight') {
    run.fightFrames += dt;
    const sp = run.targetSp;

    // 1. Player green Catch Bar physics (Stardew Valley buoyancy + gravity + reverse assist + floor bounce)
    let accel = run.hold ? FISH_CFG.LIFT : -FISH_CFG.GRAVITY;
    if (run.hold && run.barV < 0) accel += FISH_CFG.REVERSE_ASSIST;
    else if (!run.hold && run.barV > 0) accel -= FISH_CFG.REVERSE_ASSIST;

    run.barV = (run.barV + accel * dt) * Math.pow(FISH_CFG.DAMPING, dt);
    if (run.barV > FISH_CFG.MAX_VY) run.barV = FISH_CFG.MAX_VY;
    if (run.barV < -FISH_CFG.MAX_VY) run.barV = -FISH_CFG.MAX_VY;
    run.barY += run.barV * dt;

    const maxBarY = FISH_CFG.TRACK_H - run.barH;
    if (run.barY <= 0) {
      run.barY = 0;
      run.barV = Math.abs(run.barV) > 1.1 ? -run.barV * FISH_CFG.BOUNCE_FLOOR : 0;
    } else if (run.barY >= maxBarY) {
      run.barY = maxBarY;
      run.barV = Math.abs(run.barV) > 1.1 ? -run.barV * FISH_CFG.BOUNCE_CEIL : 0;
    }

    // 2. Hooked Fish AI movement along the 0..TRACK_H gauge
    run.nextJumpFrames -= dt;
    if (run.nextJumpFrames <= 0) {
      const spread = (0.24 + sp.dodge * 0.56) * FISH_CFG.TRACK_H;
      let target = run.fishY + (rng() * 2 - 1) * spread;
      if (sp.pattern === 'floater' && rng() < 0.6) {
        target = FISH_CFG.TRACK_H * (0.58 + rng() * 0.36);
      } else if (sp.pattern === 'sinker' && rng() < 0.6) {
        target = FISH_CFG.TRACK_H * (0.06 + rng() * 0.36);
      } else if (sp.pattern === 'dart' || sp.pattern === 'boss') {
        target = rng() < 0.5 ? FISH_CFG.TRACK_H * (0.1 + rng() * 0.8) : target;
      }
      run.fishTarget = Math.max(14, Math.min(FISH_CFG.TRACK_H - 14, target));
      const minF = sp.pattern === 'dart' || sp.pattern === 'boss' ? 18 : 26;
      const maxF = sp.pattern === 'dart' || sp.pattern === 'boss' ? 46 : 68;
      run.nextJumpFrames = minF + rng() * (maxF - minF);
    }

    const pull = sp.speed * (sp.pattern === 'dart' || sp.pattern === 'boss' ? 1.35 : 1.0);
    run.fishV += (run.fishTarget - run.fishY) * pull * dt * 0.55;
    run.fishV *= Math.pow(0.84, dt);
    run.fishY = Math.max(12, Math.min(FISH_CFG.TRACK_H - 12, run.fishY + run.fishV * dt));

    // 3. Overlap check: is the fish inside the green Catch Bar? (forgiving 6px grace margin)
    const onTarget = run.fishY >= run.barY - 6 && run.fishY <= run.barY + run.barH + 6;
    run.onTarget = onTarget;

    if (onTarget) {
      run.progress += sp.fillRate * dt;
      run.reelTickFrames += dt;
      if (run.reelTickFrames >= 7) {
        run.reelTickFrames = 0;
        events.push({ type: 'reel', x: FISH_CFG.HOLE_CX, y: FISH_CFG.HOLE_CY });
      }
    } else {
      run.progress -= sp.drainRate * dt;
      run.energy -= (FISH_CFG.FRAY_DRAIN_PER_SEC / 60) * dt;
    }

    // 4. Stardew Valley Treasure Chest overlap check
    if (run.chest && !run.chest.caught) {
      const onChest = run.chest.y >= run.barY - 6 && run.chest.y <= run.barY + run.barH + 6;
      if (onChest) {
        run.chest.progress = Math.min(1, run.chest.progress + FISH_CFG.CHEST_FILL_RATE * dt);
        if (run.chest.progress >= 1) {
          run.chest.caught = true;
          events.push({ type: 'chestLock', x: 728, y: 400 - run.chest.y });
        }
      } else {
        run.chest.progress = Math.max(0, run.chest.progress - FISH_CFG.CHEST_FILL_RATE * 0.35 * dt);
      }
    }

    // Dynamic rod bend reflects tension + fish struggle
    const wantBend = (onTarget ? 0.52 : 0.88) + Math.sin(run.frames * 0.35) * 0.14;
    run.rodBend += (wantBend - run.rodBend) * 0.25 * dt;

    // 5. Check Catch Complete or Fish Escaped
    if (run.progress >= 1) {
      run.progress = 1;
      run.caughtCount += 1;
      const mult = 1 + (run.combo - 1) * 0.25;
      const fishPts = Math.round(sp.pts * mult);
      const chestGot = Boolean(run.chest && run.chest.caught);
      const chestPts = chestGot ? FISH_CFG.CHEST_BONUS * run.combo : 0;
      const totalPts = fishPts + chestPts;
      run.rawPoints += totalPts;
      if (chestGot) run.chestsCaught += 1;

      const heal = (sp.heal || FISH_CFG.CATCH_HEAL) + (chestGot ? FISH_CFG.CHEST_HEAL : 0);
      run.energy = Math.min(FISH_CFG.ENERGY_MAX, run.energy + heal);

      run.lastCatch = {
        sp,
        points: totalPts,
        fishPts,
        chestPts,
        chestGot,
        combo: run.combo,
        perfect: run.perfectStrike,
      };
      run.caughtStack.push(sp);
      if (run.caughtStack.length > 8) run.caughtStack.shift();

      events.push({
        type: 'catch',
        sp,
        points: totalPts,
        chestGot,
        combo: run.combo,
        heal,
        x: FISH_CFG.HOLE_CX,
        y: FISH_CFG.HOLE_CY,
      });

      run.combo = Math.min(FISH_CFG.MAX_COMBO, run.combo + 1);
      run.phase = 'landed';
      run.phaseFrames = 0;
    } else if (run.progress <= 0) {
      run.progress = 0;
      run.combo = 1;
      run.energy -= FISH_CFG.ESCAPE_PENALTY;
      events.push({
        type: 'slip',
        sp,
        cost: FISH_CFG.ESCAPE_PENALTY,
        x: FISH_CFG.HOLE_CX,
        y: FISH_CFG.HOLE_CY,
      });
      run.phase = 'slip';
      run.phaseFrames = 0;
    }
  } else if (run.phase === 'landed') {
    run.rodBend += (-0.18 - run.rodBend) * 0.18 * dt;
    if (run.phaseFrames >= FISH_CFG.LAND_ANIM_FRAMES) {
      fishBeginCast(run, rng);
    }
  } else if (run.phase === 'slip') {
    run.rodBend += (0 - run.rodBend) * 0.2 * dt;
    if (run.phaseFrames >= FISH_CFG.SLIP_ANIM_FRAMES) {
      fishBeginCast(run, rng);
    }
  }

  run.score = Math.max(0, Math.round(run.rawPoints));
  if (run.energy <= 0) {
    run.energy = 0;
    events.push({ type: 'crash' });
  }
  return events;
}

// ============================================================================
// BROWSER STATE & LEADERBOARD SUBMISSION
// ============================================================================
const FISH_GAME = {
  run: null,
  lastTickAt: 0,
  particles: [],
  popups: [],
  ripples: [],
  shakeUntil: 0,
  hitFlashUntil: 0,
  lastFinalScore: 0,
  lastRank: null,
  lastBestScore: 0,
  lastIsNewBest: false,
  scoreSubmitted: false,
};

function resetFishGame(now = typeof performance !== 'undefined' ? performance.now() : 0) {
  FISH_GAME.run = createFishRun(now);
  FISH_GAME.lastTickAt = now;
  FISH_GAME.particles = [];
  FISH_GAME.popups = [];
  FISH_GAME.ripples = [];
  FISH_GAME.shakeUntil = 0;
  FISH_GAME.hitFlashUntil = 0;
  FISH_GAME.scoreSubmitted = false;
}

function fishGameActive() {
  return typeof MOTION_STATE !== 'undefined' && MOTION_STATE.vehicle === 'fish' && MOTION_STATE.sceneIdx === 2 && Boolean(FISH_GAME.run);
}

function fishActionPress() {
  if (!FISH_GAME.run) return;
  fishPress(FISH_GAME.run);
}

function fishActionRelease() {
  if (!FISH_GAME.run) return;
  fishRelease(FISH_GAME.run);
}

function spawnFishBurst(x, y, cols, count = 12, speed = 3.8, size = 6) {
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const sp = speed * (0.55 + Math.random() * 0.7);
    FISH_GAME.particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 1.2,
      col: cols[i % cols.length],
      sz: Math.max(3, size - (i % 3)),
      alpha: 1,
      decay: 0.026 + Math.random() * 0.015,
    });
  }
}

function spawnFishRipple(x, y, col = 'rgba(224, 242, 254, 0.85)') {
  FISH_GAME.ripples.push({ x, y, r: 8, maxR: 88, alpha: 0.95, col });
}

async function submitFishScoreToServer(tokenId, score, caughtCount) {
  if (
    typeof UFO_GAME === 'undefined' ||
    !UFO_GAME.hasNft ||
    tokenId === null ||
    tokenId === undefined ||
    !/^\d+$/.test(String(tokenId).trim()) ||
    FISH_GAME.scoreSubmitted ||
    score <= 0
  ) {
    return;
  }
  FISH_GAME.scoreSubmitted = true;
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'fish', tokenId: Number(String(tokenId).trim()), score, kills: caughtCount }),
    });
    if (res.ok) {
      const data = await res.json();
      FISH_GAME.lastRank = data.rank || null;
      FISH_GAME.lastBestScore = data.best_score || score;
      FISH_GAME.lastIsNewBest = Boolean(data.is_new_best);
      if (Array.isArray(data.items) && typeof RANKING_GAME !== 'undefined' && RANKING_GAME === 'fish') {
        RANKING_PAGE_CACHE = data.items;
        renderRankingPageList();
      }
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

function triggerFishCrash(now = performance.now()) {
  const run = FISH_GAME.run;
  FISH_GAME.shakeUntil = now + 520;
  FISH_GAME.lastFinalScore = Math.max(1, run.score);
  FISH_GAME.lastRank = null;
  FISH_GAME.lastBestScore = 0;
  if (typeof UFO_GAME !== 'undefined' && UFO_GAME.hasNft && UFO_GAME.pilotTokenId !== null) {
    submitFishScoreToServer(UFO_GAME.pilotTokenId, FISH_GAME.lastFinalScore, run.caughtCount);
  }
  setIntroScene(3, true);
}

// ============================================================================
// DRAWING HELPERS: BACKGROUND, SPECIES SPRITES, PENGUIN HAND & STARDEW BAR
// ============================================================================
function drawRefFishingBackground(ctx, now) {
  ensureIntroBackgrounds();
  if (MOTION_STATE.bgRefFishingLoaded && MOTION_STATE.bgRefFishingImg) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(MOTION_STATE.bgRefFishingImg, 0, 0, 960, 540);
  } else {
    drawRefVortexBackground(ctx, now);
  }
  // Rising voxel cubes inside the distant horizon beam (x ~ 690..820, y ~ 0..245)
  ctx.save();
  for (let i = 0; i < 8; i++) {
    const vx = 700 + ((i * 23) % 110) + Math.sin(now * 0.004 + i) * 5;
    const vy = 235 - (((now * 0.1 + i * 31) % 230) | 0);
    const sz = i % 3 === 0 ? 8 : 6;
    ctx.fillStyle = FISH_K;
    ctx.fillRect(vx - 1, vy - 1, sz + 2, sz + 2);
    ctx.fillStyle = i % 2 === 0 ? '#67e8f9' : '#f472b6';
    ctx.fillRect(vx, vy, sz, sz);
  }
  // Gentle snow drifting across the glacier
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let s = 0; s < 16; s++) {
    const sx = (s * 67 + now * 0.025) % 960;
    const sy = (s * 41 + now * 0.04) % 540;
    ctx.fillRect(Math.round(sx), Math.round(sy), 3, 3);
  }
  // Warm steam rising from the metal camping mug beside the red tackle box (x = 207, y = 260)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2;
  for (let w = 0; w < 2; w++) {
    const wp = ((now * 0.001 + w * 0.5) % 1);
    ctx.globalAlpha = (1 - wp) * 0.7;
    ctx.beginPath();
    const wx = 205 + w * 6 + Math.sin(now * 0.006 + w) * 3;
    const wy = 258 - wp * 26;
    ctx.moveTo(wx, wy + 8);
    ctx.quadraticCurveTo(wx - 4, wy + 4, wx + 2, wy);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw a caught fish or mini icon for the Stardew Catch Bar and the flying catch celebration
function drawFishCreatureSprite(ctx, sp, x, y, scale = 1, now = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const wiggle = Math.sin(now * 0.02) * 0.1;
  ctx.rotate(wiggle);

  ctx.lineWidth = 2.4;
  ctx.strokeStyle = FISH_K;

  if (sp.id === 'boot') {
    // Discarded snow boot with a cheeky red crab peeking out the top!
    ctx.fillStyle = sp.col;
    ctx.beginPath();
    ctx.roundRect(-12, -14, 16, 20, 3);
    ctx.roundRect(-12, 0, 26, 12, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-12, 9, 26, 4);
    // Crab claws peeking out
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-4, -16, 5, 0, Math.PI * 2);
    ctx.arc(6, -15, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (sp.id === 'squid') {
    // Colossal squid with mantle + waving tentacles
    ctx.fillStyle = sp.col;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(6, -13);
    ctx.lineTo(14, 0);
    ctx.lineTo(6, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    for (let t = -2; t <= 2; t++) {
      ctx.beginPath();
      ctx.moveTo(10, t * 3);
      ctx.quadraticCurveTo(18, t * 4 + Math.sin(now * 0.025 + t) * 4, 24, t * 3.5);
      ctx.strokeStyle = sp.col;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = FISH_K;
    ctx.fillRect(4, -4, 2.5, 2.5);
  } else {
    // Classic / Puffer / Angler / Pumpkin / Whale body
    const rx = sp.id === 'whale' ? 24 : sp.id === 'puffer' ? 15 : 18;
    const ry = sp.id === 'whale' ? 14 : sp.id === 'puffer' ? 14 : 10;
    // Tail fin
    ctx.fillStyle = sp.accent;
    ctx.beginPath();
    ctx.moveTo(-rx + 3, 0);
    ctx.lineTo(-rx - 10, -9);
    ctx.lineTo(-rx - 8, 0);
    ctx.lineTo(-rx - 10, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Main body
    ctx.fillStyle = sp.col;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Belly highlight
    ctx.fillStyle = sp.belly;
    ctx.beginPath();
    ctx.ellipse(2, ry * 0.35, rx * 0.68, ry * 0.42, 0, 0, Math.PI);
    ctx.fill();
    // Angler lantern
    if (sp.id === 'angler') {
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, -ry);
      ctx.quadraticCurveTo(16, -ry - 12, 20, -ry - 2);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(20, -ry - 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Jack-o'-Fish carved pumpkin grin & stem
    if (sp.id === 'pumpkin') {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-3, -ry - 5, 6, 6);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(4, -5, 4, 4);
      ctx.fillRect(2, 2, 9, 3);
    } else {
      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(rx * 0.45, -ry * 0.22, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = FISH_K;
      ctx.beginPath();
      ctx.arc(rx * 0.5, -ry * 0.22, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// Draw thegiant ice hole's animated underwater life, ripples, bobber, and splashes
function drawFishIceHoleWater(ctx, run, now) {
  const { HOLE_CX: cx, HOLE_CY: cy, HOLE_RX: rx, HOLE_RY: ry } = FISH_CFG;

  ctx.save();
  // Clip strictly inside the water surface of the giant ice hole
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();

  // Subtle pulsing underwater glow when a high-tier fish or combo is active
  if (run.combo >= 3 || run.phase === 'fight') {
    const pulse = 0.14 + 0.08 * Math.sin(now * 0.008);
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx);
    g.addColorStop(0, `rgba(56, 189, 248, ${pulse.toFixed(3)})`);
    g.addColorStop(1, 'rgba(14, 116, 144, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
  }

  // Swimming dark-teal silhouettes of fish inside the ice hole
  run.shadows.forEach((sh, idx) => {
    const isTarget = idx === 0 && (run.phase === 'lure' || run.phase === 'bite' || run.phase === 'fight');
    let sx = cx + Math.cos(sh.ang) * rx * sh.dist;
    let sy = cy + Math.sin(sh.ang) * ry * sh.dist;
    let dir = -Math.sin(sh.ang) * sh.speed >= 0 ? 1 : -1;

    if (isTarget) {
      // Target fish approaches the bobber in the center of the hole!
      const pull = run.phase === 'lure' ? Math.min(1, run.phaseFrames / Math.max(1, run.lureDuration)) : 1;
      sx = sx + (cx - 18 - sx) * pull * 0.85 + (run.phase === 'fight' ? Math.sin(now * 0.04) * 28 : 0);
      sy = sy + (cy + 4 - sy) * pull * 0.85 + (run.phase === 'fight' ? Math.cos(now * 0.035) * 10 : 0);
      dir = 1;
    }

    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(dir * sh.size, sh.size * 0.72);
    ctx.fillStyle = isTarget && run.phase === 'fight' ? 'rgba(2, 132, 199, 0.72)' : 'rgba(6, 48, 75, 0.52)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    const tailWag = Math.sin(sh.wobble) * 4;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-30, -8 + tailWag);
    ctx.lineTo(-30, 8 + tailWag);
    ctx.closePath();
    ctx.fill();
    // Golden glint if target is rare/legendary
    if (isTarget && (run.targetSp.tier === 'epic' || run.targetSp.tier === 'legend')) {
      ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.beginPath();
      ctx.ellipse(2, 0, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // Expanding water ripples
  for (let i = FISH_GAME.ripples.length - 1; i >= 0; i--) {
    const rp = FISH_GAME.ripples[i];
    rp.r += 1.4;
    rp.alpha -= 0.018;
    if (rp.alpha <= 0 || rp.r >= rp.maxR) {
      FISH_GAME.ripples.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, rp.alpha);
    ctx.strokeStyle = rp.col;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Constant gentle concentric rings around the bobber position
  const bobX = cx + (run.phase === 'fight' ? Math.sin(now * 0.032) * 32 : 0);
  const bobY = cy - 4 + (run.phase === 'fight' ? Math.cos(now * 0.026) * 10 : 0);
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.55)';
  ctx.lineWidth = 1.8;
  for (let r = 0; r < 2; r++) {
    const ph = ((now * 0.0014 + r * 0.5) % 1);
    ctx.globalAlpha = (1 - ph) * 0.7;
    ctx.beginPath();
    ctx.ellipse(bobX, bobY + 4, 14 + ph * 46, 5 + ph * 14, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================================
// THE PENGUIN'S BASIC HAND/FLIPPER + FLEXING ICE-FISHING ROD + BOBBER
// ("펭귄들 굳이 안나와도 되고 큰 얼음구덩이에 얼음 낚시하는 펭귄 기본 손만 있으면 되게끔")
// ============================================================================
function getSpeciesFeatherColors(spId = '01') {
  const key = String(spId || '01').padStart(2, '0');
  const pair = typeof SPECIES_FEATHER_RGB !== 'undefined' && SPECIES_FEATHER_RGB[key]
    ? SPECIES_FEATHER_RGB[key]
    : [[18, 82, 209], [4, 58, 164]];
  const [m, s] = pair;
  return {
    main: `rgb(${m[0]}, ${m[1]}, ${m[2]})`,
    shade: `rgb(${s[0]}, ${s[1]}, ${s[2]})`,
  };
}

function drawFishPenguinHandAndRod(ctx, run, now, spId) {
  const { HOLE_CX: cx, HOLE_CY: cy } = FISH_CFG;
  const cols = getSpeciesFeatherColors(spId);

  // Hand jitter & rod motion
  const fightShake = run.phase === 'fight' ? (run.onTarget ? 1.5 : 3.8) : 0;
  const jx = fightShake ? Math.sin(now * 0.08) * fightShake : 0;
  const jy = fightShake ? Math.cos(now * 0.07) * fightShake : Math.sin(now * 0.004) * 2.5;

  // Base of the rod gripped by the penguin flipper in the bottom-right foreground
  const gripX = 816 + jx;
  const gripY = 446 + jy;

  // Rod tip over the giant ice hole
  const bend = run.rodBend || 0;
  const tipX = 532 - bend * 24 + jx * 0.6;
  const tipY = 198 + bend * 58 + jy * 0.6;
  const ctrlX = 690;
  const ctrlY = 278 - bend * 18;

  // Bobber position in the hole
  const bobX = cx + (run.phase === 'fight' ? Math.sin(now * 0.032) * 32 : 0);
  const bobY =
    cy -
    6 +
    (run.bobberDip || 0) +
    (run.phase === 'lure' ? Math.sin(now * 0.008) * 3 : 0) +
    (run.phase === 'fight' ? 10 + Math.cos(now * 0.026) * 8 : 0);

  ctx.save();

  // 1. Fishing Line (from rod tip to bobber in the giant ice hole)
  if (run.phase !== 'landed') {
    ctx.strokeStyle = run.phase === 'fight' && !run.onTarget ? '#fda4af' : 'rgba(241, 245, 249, 0.92)';
    ctx.lineWidth = run.phase === 'fight' ? 2.2 : 1.8;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    if (run.phase === 'fight') {
      // Taut straight line under tension!
      ctx.lineTo(bobX, bobY);
    } else {
      // Relaxed catenary curve
      ctx.quadraticCurveTo((tipX + bobX) / 2, Math.max(tipY, bobY) - 18, bobX, bobY);
    }
    ctx.stroke();

    // 2. Red-and-White Bobber sitting in the ice hole
    const submerged = run.phase === 'bite' || run.phase === 'fight';
    ctx.save();
    ctx.translate(bobX, bobY);
    ctx.rotate(run.phase === 'fight' ? Math.sin(now * 0.05) * 0.35 : Math.sin(now * 0.006) * 0.08);
    // Water foam collar around bobber
    ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
    ctx.beginPath();
    ctx.ellipse(0, 5, submerged ? 14 : 10, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!submerged || Math.floor(now / 90) % 2 === 0) {
      // Bobber body (white bottom, red top, yellow tip antenna)
      ctx.fillStyle = FISH_K;
      ctx.beginPath();
      ctx.arc(0, 0, 10.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 8.5, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 8.5, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = FISH_K;
      ctx.fillRect(-2, -16, 4, 8);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-1, -15, 2, 6);
    }
    ctx.restore();

    // Big '!!' Bite Alert over the bobber
    if (run.phase === 'bite') {
      const pop = 1 + Math.sin(now * 0.04) * 0.12;
      ctx.save();
      ctx.translate(bobX, bobY - 38);
      ctx.scale(pop, pop);
      ctx.font = '900 32px "Pretendard", "Malgun Gothic", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 7;
      ctx.strokeStyle = FISH_K;
      ctx.strokeText('!!', 0, 0);
      ctx.fillStyle = '#fde047';
      ctx.fillText('!!', 0, 0);
      ctx.restore();
    }
  }

  // 3. The Ice-Fishing Rod (bamboo/carbon segmented shaft with line guides)
  ctx.lineCap = 'round';
  ctx.strokeStyle = FISH_K;
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.moveTo(gripX + 26, gripY + 18);
  ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
  ctx.stroke();

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(gripX + 26, gripY + 18);
  ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
  ctx.stroke();

  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(gripX + 24, gripY + 15);
  ctx.quadraticCurveTo(ctrlX - 2, ctrlY - 3, tipX, tipY - 1);
  ctx.stroke();

  // Cork handle & Spinning Reel under the grip
  const reelX = gripX - 24;
  const reelY = gripY - 8;
  ctx.fillStyle = FISH_K;
  ctx.beginPath();
  ctx.arc(reelX, reelY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(reelX, reelY, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(reelX, reelY, 8, 0, Math.PI * 2);
  ctx.fill();
  // Spinning reel crank handle (spins fast while player holds the button!)
  const crankAng = now * (run.hold ? 0.028 : 0.003);
  const hx = reelX + Math.cos(crankAng) * 13;
  const hy = reelY + Math.sin(crankAng) * 13;
  ctx.strokeStyle = FISH_K;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(reelX, reelY);
  ctx.lineTo(hx, hy);
  ctx.stroke();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = '#fb923c';
  ctx.beginPath();
  ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // 4. THE PENGUIN'S CHUBBY BASIC FLIPPER / HAND (extending from bottom-right corner 960,540)
  ctx.save();
  ctx.translate(gripX, gripY);
  ctx.rotate(-0.42 + bend * 0.08);

  // Drop shadow on snow under the flipper
  ctx.fillStyle = 'rgba(9, 13, 26, 0.25)';
  ctx.beginPath();
  ctx.ellipse(45, 36, 95, 28, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Flipper arm body reaching from bottom-right offscreen to grip the rod
  ctx.fillStyle = cols.main;
  ctx.strokeStyle = FISH_K;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(190, 95);
  ctx.quadraticCurveTo(95, 58, 12, 30);
  ctx.quadraticCurveTo(-36, 14, -32, -12);
  ctx.quadraticCurveTo(-24, -36, 22, -26);
  ctx.quadraticCurveTo(100, -8, 195, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Darker dorsal feather shading along top edge of flipper
  ctx.fillStyle = cols.shade;
  ctx.beginPath();
  ctx.moveTo(185, 24);
  ctx.quadraticCurveTo(95, -4, 20, -22);
  ctx.quadraticCurveTo(-18, -28, -24, -10);
  ctx.quadraticCurveTo(20, -8, 180, 42);
  ctx.closePath();
  ctx.fill();

  // Soft white inner-flipper edge along the bottom curve
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(175, 86);
  ctx.quadraticCurveTo(88, 52, 10, 25);
  ctx.quadraticCurveTo(-18, 15, -22, 2);
  ctx.quadraticCurveTo(22, 14, 175, 68);
  ctx.closePath();
  ctx.fill();

  // Cozy striped wrist band on the penguin's forearm
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = FISH_K;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(72, -14, 28, 66, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fde047';
  ctx.fillRect(82, -11, 8, 60);

  // Curled penguin flipper tip ("thumb") wrapping OVER the cork rod handle so it looks truly gripped
  ctx.fillStyle = cols.main;
  ctx.strokeStyle = FISH_K;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(-6, -6, 22, 15, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// ============================================================================
// STARDEW VALLEY VERTICAL CATCH BAR & TENSION UI
// ============================================================================
function drawFishStardewBar(ctx, run, now) {
  const ko = typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'ko';
  const trackX = 696;
  const trackY = 82;
  const trackW = 46;
  const trackH = FISH_CFG.TRACK_H;
  const progX = trackX + trackW + 8;
  const progW = 16;

  ctx.save();
  // Slight shake when fish is escaping outside the green bar
  if (run.phase === 'fight' && !run.onTarget) {
    ctx.translate((Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 3.5);
  }

  // Outer wooden/icy Stardew-style frame
  ctx.fillStyle = 'rgba(9, 13, 26, 0.88)';
  ctx.fillRect(trackX - 10, trackY - 32, trackW + progW + 28, trackH + 62);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(trackX - 10, trackY - 32, trackW + progW + 28, trackH + 62);

  // Header label ("밀당 게이지" / "REEL")
  ctx.font = '900 12.5px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  ctx.fillText(ko ? '밀당 게이지' : i18n('CATCH BAR'), trackX + (trackW + progW + 8) / 2, trackY - 15);

  // Water column track background
  const wg = ctx.createLinearGradient(0, trackY, 0, trackY + trackH);
  wg.addColorStop(0, '#0c4a6e');
  wg.addColorStop(0.5, '#075985');
  wg.addColorStop(1, '#082f49');
  ctx.fillStyle = wg;
  ctx.fillRect(trackX, trackY, trackW, trackH);
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 2;
  ctx.strokeRect(trackX, trackY, trackW, trackH);

  // Depth ticks along the water column
  ctx.fillStyle = 'rgba(186, 230, 253, 0.25)';
  for (let d = 1; d < 6; d++) {
    ctx.fillRect(trackX + 4, trackY + (trackH * d) / 6, trackW - 8, 1.5);
  }

  // Green Catch Bar (barY = 0 is at the bottom of the track)
  const barScreenY = trackY + trackH - run.barY - run.barH;
  const onTarget = run.phase !== 'fight' || run.onTarget;
  ctx.fillStyle = onTarget ? 'rgba(74, 222, 128, 0.78)' : 'rgba(251, 113, 133, 0.65)';
  ctx.fillRect(trackX + 3, barScreenY, trackW - 6, run.barH);
  ctx.strokeStyle = onTarget ? '#bbf7d0' : '#fecdd3';
  ctx.lineWidth = 2.2;
  ctx.strokeRect(trackX + 3, barScreenY, trackW - 6, run.barH);
  // Inner highlight stripes on the green bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.fillRect(trackX + 6, barScreenY + 3, 5, run.barH - 6);

  // Stardew Valley Treasure Chest icon inside the track
  if (run.chest) {
    const cy = trackY + trackH - run.chest.y;
    const cx = trackX + trackW / 2;
    ctx.save();
    ctx.translate(cx, cy);
    if (run.chest.caught) {
      ctx.scale(1.15, 1.15);
    }
    // Chest body
    ctx.fillStyle = FISH_K;
    ctx.fillRect(-10, -8, 20, 16);
    ctx.fillStyle = run.chest.caught ? '#fde047' : '#d97706';
    ctx.fillRect(-8, -6, 16, 12);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-8, -1, 16, 2);
    ctx.fillRect(-2, -3, 4, 6);
    // Progress ring around the chest
    if (!run.chest.caught && run.chest.progress > 0) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 13, -Math.PI / 2, -Math.PI / 2 + run.chest.progress * Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Hooked Fish Icon darting up and down the track
  if (run.phase === 'fight') {
    const fy = trackY + trackH - run.fishY;
    const fx = trackX + trackW / 2;
    drawFishCreatureSprite(ctx, run.targetSp, fx, fy, 0.72, now);
  } else {
    // Waiting for bite prompt inside the bar
    ctx.fillStyle = '#bae6fd';
    ctx.font = '800 11px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.fillText(run.phase === 'bite' ? 'HIT!!' : 'WAIT', trackX + trackW / 2, trackY + trackH / 2);
  }

  // Right-side Catch Progress Bar (0..100%)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(progX, trackY, progW, trackH);
  const pct = run.phase === 'fight' ? Math.max(0, Math.min(1, run.progress)) : run.phase === 'landed' ? 1 : 0.24;
  const fillH = Math.round(trackH * pct);
  const pCol = pct > 0.66 ? '#4ade80' : pct > 0.33 ? '#facc15' : '#fb7185';
  ctx.fillStyle = pCol;
  ctx.fillRect(progX, trackY + trackH - fillH, progW, fillH);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(progX + 2, trackY + trackH - fillH, 3, fillH);
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(progX, trackY, progW, trackH);

  // Bottom status pill (Hold = UP / Release = DOWN)
  ctx.fillStyle = run.hold ? '#4ade80' : '#94a3b8';
  ctx.font = '900 11.5px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.fillText(
    run.hold ? (ko ? '▲ 당기는 중' : i18n('▲ REELING')) : ko ? '▼ 놓는 중' : i18n('▼ DROPPING'),
    trackX + (trackW + progW + 8) / 2,
    trackY + trackH + 16
  );

  ctx.restore();
}

// ============================================================================
// HUD & SCENE 2 / SCENE 3 / SCENE 4 / SCENE 5 ENTRY POINTS
// ============================================================================
function drawFishHud(ctx, now, run) {
  const ko = typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'ko';
  const hx = 16;
  const hy = 12;
  const hw = 548;
  const hh = 34;

  ctx.save();
  ctx.fillStyle = 'rgba(9, 13, 26, 0.88)';
  ctx.fillRect(hx - 2, hy - 2, hw + 4, hh + 4);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(hx, hy, hw, hh);

  ctx.fillStyle = '#fde047';
  ctx.font = '900 14px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`SCORE ${run.score.toLocaleString()}`, hx + 12, hy + hh / 2 + 1);

  if (run.combo > 1) {
    ctx.fillStyle = '#34d399';
    ctx.font = '900 13px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.fillText(`x${run.combo} COMBO`, hx + 146, hy + hh / 2 + 1);
  }

  // Line Tension / Durability Bar
  const bx = hx + 244;
  const bw = 136;
  const ratio = Math.max(0, run.energy / FISH_CFG.ENERGY_MAX);
  const low = ratio < 0.28;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(bx, hy + 11, bw, 12);
  ctx.fillStyle = low && Math.floor(now / 200) % 2 === 0 ? '#fecdd3' : low ? '#fb7185' : '#34d399';
  ctx.fillRect(bx, hy + 11, Math.round(bw * ratio), 12);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(bx, hy + 11, Math.round(bw * ratio), 3);
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(bx, hy + 11, bw, 12);
  drawPixelHeart(ctx, bx - 10, hy + hh / 2, 1.8, '#34d399');

  ctx.fillStyle = run.level >= 7 ? '#fb7185' : run.level >= 4 ? '#fde047' : '#bae6fd';
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(
    ko ? `LV.${run.level} · ${run.caughtCount}마리` : i18n('LV.{0} · {1} caught', run.level, run.caughtCount),
    hx + hw - 12,
    hy + hh / 2 + 1
  );
  ctx.restore();
}

// Scene 2 (2.6s setup cutscene): Instead of fleeing the pillar, the penguin hand casts into the giant ice hole!
function drawFishScene1Departure(ctx, now, p, spId) {
  const ko = typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'ko';
  drawRefFishingBackground(ctx, now);
  const dummyRun = {
    phase: p < 0.45 ? 'lure' : 'bite',
    phaseFrames: 30,
    lureDuration: 50,
    combo: 1,
    hold: p > 0.5,
    rodBend: Math.sin(p * Math.PI) * 0.45,
    bobberDip: p > 0.45 ? Math.sin((p - 0.45) * 14) * 10 : 0,
    targetSp: FISH_SPECIES[0],
    shadows: [
      { ang: now * 0.002, dist: 0.35, speed: 0.01, size: 1.0, spIdx: 0, wobble: now * 0.02 },
      { ang: now * 0.002 + 2.1, dist: 0.5, speed: -0.01, size: 1.2, spIdx: 2, wobble: now * 0.02 },
    ],
  };
  drawFishIceHoleWater(ctx, dummyRun, now);
  drawFishPenguinHandAndRod(ctx, dummyRun, now, spId);

  const msg = ko
    ? '비행기? 쇄빙선? 오픈카? 탈출은 무슨~ 얼음구덩이 손맛이나 보자 ㅋㅋ'
    : i18n("Plane? Ship? Car? Forget escaping~ Let's just go ice fishing lol");
  drawRetroSpeechBubble(ctx, 480, 126, msg, '#34d399', now);
}

// Scene 3: Main Stardew Valley Ice-Hole Fishing Loop
function drawFishRunnerFrame(ctx, now, spId) {
  if (!FISH_GAME.run) resetFishGame(now);
  const run = FISH_GAME.run;
  const dt = Math.min(32, Math.max(8, now - (FISH_GAME.lastTickAt || now))) / 16.67;
  FISH_GAME.lastTickAt = now;
  const ko = typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'ko';

  const events = fishStep(run, dt, now, Math.random);
  let crashed = false;
  events.forEach((ev) => {
    if (ev.type === 'nibble') {
      spawnFishRipple(ev.x, ev.y);
      playIntroSfx('land', ev);
    } else if (ev.type === 'bite') {
      spawnFishRipple(ev.x, ev.y, '#fde047');
      spawnFishBurst(ev.x, ev.y, ['#e0f2fe', '#38bdf8', '#ffffff'], 10, 3.2, 5);
      playIntroSfx('near', ev);
      FISH_GAME.popups.push({
        x: ev.x,
        y: ev.y - 54,
        vy: -1.3,
        text: ko ? '입질 왔다!! 눌러서 챔질!' : i18n('BITE!! Press to strike!'),
        col: '#fde047',
        alpha: 1,
      });
    } else if (ev.type === 'strike') {
      playIntroSfx(ev.perfect ? 'rescue' : 'jump', ev);
      if (ev.perfect) {
        FISH_GAME.popups.push({
          x: ev.x,
          y: ev.y - 30,
          vy: -1.5,
          text: ko ? `챔질 완벽!! +${ev.points}` : i18n('PERFECT HOOK! +{0}', ev.points),
          col: '#4ade80',
          alpha: 1,
        });
      }
    } else if (ev.type === 'reel') {
      playIntroSfx('star', ev);
      if (Math.random() < 0.55) {
        spawnFishBurst(ev.x + (Math.random() - 0.5) * 40, ev.y, ['#e0f2fe', '#7dd3fc'], 3, 2.2, 4);
      }
    } else if (ev.type === 'chestLock') {
      playIntroSfx('fuel', ev);
      spawnFishBurst(ev.x, ev.y, ['#fde047', '#fef08a', '#ffffff'], 12, 3.5, 5);
      FISH_GAME.popups.push({
        x: ev.x - 40,
        y: ev.y,
        vy: -1.3,
        text: ko ? '보물상자 확보!!' : i18n('TREASURE LOCKED!!'),
        col: '#fde047',
        alpha: 1,
      });
    } else if (ev.type === 'catch') {
      playIntroSfx('break', { perfect: true });
      FISH_GAME.shakeUntil = now + 240;
      spawnFishBurst(ev.x, ev.y, ['#4ade80', '#fde047', '#67e8f9', '#ffffff'], 18, 4.6, 6);
      const name = ko ? ev.sp.ko : i18n(ev.sp.en);
      FISH_GAME.popups.push({
        x: ev.x,
        y: ev.y - 64,
        vy: -1.4,
        text: `${name} +${ev.points} PTS!`,
        col: '#4ade80',
        alpha: 1.15,
      });
      if (ev.chestGot) {
        FISH_GAME.popups.push({
          x: ev.x,
          y: ev.y - 92,
          vy: -1.4,
          text: ko ? `보물상자 대박! 텐션 +${ev.heal}` : i18n('TREASURE BONUS! LINE +{0}', ev.heal),
          col: '#fde047',
          alpha: 1.15,
        });
      }
    } else if (ev.type === 'slip') {
      playIntroSfx('hit', ev);
      FISH_GAME.hitFlashUntil = now + 460;
      FISH_GAME.shakeUntil = now + 300;
      FISH_GAME.popups.push({
        x: ev.x,
        y: ev.y - 44,
        vy: -1.4,
        text: ko ? `놓쳤다! 줄 데미지 -${ev.cost}` : i18n('Got away! Line -{0}', ev.cost),
        col: '#fb7185',
        alpha: 1,
      });
    } else if (ev.type === 'level') {
      playIntroSfx('level', ev);
      FISH_GAME.popups.push({
        x: 432,
        y: 96,
        vy: -1.2,
        text: ko ? `LV.${ev.level} 심해 대어 출몰! +${ev.points}` : i18n('LV.{0} Deep monsters awake! +{1}', ev.level, ev.points),
        col: '#fde047',
        alpha: 1,
      });
    } else if (ev.type === 'crash') {
      playIntroSfx('crash', ev);
      crashed = true;
    }
  });

  ctx.save();
  if (now < FISH_GAME.shakeUntil) {
    const mag = ((FISH_GAME.shakeUntil - now) / 520) * 7;
    ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
  }

  // 1. Giant Glacier Ice-Hole Background
  drawRefFishingBackground(ctx, now);

  // 2. Caught fish stacked beside the red tackle box on the left snow ledge (x ~ 148, y ~ 245)
  run.caughtStack.forEach((sp, i) => {
    const tx = 96 + (i % 4) * 24;
    const ty = 292 + Math.floor(i / 4) * 18;
    drawFishCreatureSprite(ctx, sp, tx, ty, 0.58, now + i * 200);
  });

  // 3. Underwater Silhouettes, Ripples & Splashes inside the Giant Ice Hole
  drawFishIceHoleWater(ctx, run, now);

  // 4. Caught Fish Flying Arc Celebration (when run.phase === 'landed')
  if (run.phase === 'landed' && run.lastCatch) {
    const lp = Math.min(1, run.phaseFrames / FISH_CFG.LAND_ANIM_FRAMES);
    const fx = FISH_CFG.HOLE_CX + (152 - FISH_CFG.HOLE_CX) * lp;
    const fy = FISH_CFG.HOLE_CY + (270 - FISH_CFG.HOLE_CY) * lp - Math.sin(lp * Math.PI) * 175;
    drawFishCreatureSprite(ctx, run.lastCatch.sp, fx, fy, 1.35 * run.lastCatch.sp.size, now);

    // B-grade speech bubble with the caught species' funny line
    const quote = ko ? run.lastCatch.sp.quoteKo : i18n(run.lastCatch.sp.quoteEn);
    drawRetroSpeechBubble(ctx, 432, 134, quote, '#34d399', now);
  } else if (run.phase === 'lure' && run.caughtCount === 0 && now - run.startAt < 5000) {
    const chillLine = ko
      ? '남극이 무너지든 말든~ 얼음구덩이 입질이나 보자 ㅋㅋ'
      : i18n('Antarctica can crumble all it wants~ just watch the bobber lol');
    drawRetroSpeechBubble(ctx, 432, 134, chillLine, '#38bdf8', now);
  }

  // 5. Foreground Penguin Basic Hand/Flipper + Flexing Fishing Rod + Bobber
  drawFishPenguinHandAndRod(ctx, run, now, spId);

  // 6. Stardew Valley Vertical Catch Bar & Tension UI
  drawFishStardewBar(ctx, run, now);

  // 7. Particles & Floating Score Popups
  for (let i = FISH_GAME.particles.length - 1; i >= 0; i--) {
    const pt = FISH_GAME.particles[i];
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vy += 0.12 * dt;
    pt.alpha -= pt.decay * dt;
    if (pt.alpha <= 0) {
      FISH_GAME.particles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, pt.alpha);
    ctx.fillStyle = FISH_K;
    ctx.fillRect(pt.x - pt.sz / 2 - 1, pt.y - pt.sz / 2 - 1, pt.sz + 2, pt.sz + 2);
    ctx.fillStyle = pt.col;
    ctx.fillRect(pt.x - pt.sz / 2, pt.y - pt.sz / 2, pt.sz, pt.sz);
    ctx.restore();
  }

  for (let i = FISH_GAME.popups.length - 1; i >= 0; i--) {
    const pop = FISH_GAME.popups[i];
    pop.y += pop.vy * dt;
    pop.alpha -= 0.022 * dt;
    if (pop.alpha <= 0) {
      FISH_GAME.popups.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, pop.alpha));
    ctx.font = '900 15px "Pretendard", "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = FISH_K;
    ctx.fillText(pop.text, pop.x + 2, pop.y + 2);
    ctx.fillStyle = pop.col;
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  // 8. Top-Left HUD + Bottom Controls Guide
  withStageUi(ctx, 16, 12, 564, () => drawFishHud(ctx, now, run));
  if (now - run.startAt < 7500) {
    const msg = ko
      ? '누르고 있으면 초록 바 상승 · 떼면 하강 · 물고기에 맞춰 밀당하세요!'
      : i18n('Hold to raise the green bar · release to drop · keep it on the fish!');
    ctx.save();
    ctx.font = '800 14px "Pretendard", "Malgun Gothic", sans-serif';
    const tw = Math.ceil(ctx.measureText(msg).width) + 28;
    const hk = Math.min(stageUiK(), 940 / tw);
    const hy = hk > 1 ? 516 - 15 * hk : 495;
    ctx.translate(432, hy);
    ctx.scale(hk, hk);
    ctx.translate(-432, -495);
    const bx = 432 - tw / 2;
    ctx.fillStyle = 'rgba(9, 13, 26, 0.85)';
    ctx.fillRect(bx, 480, tw, 30);
    ctx.fillStyle = '#34d399';
    ctx.fillRect(bx, 480, 4, 30);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(msg, 434, 496);
    ctx.restore();
  }

  ctx.restore();

  if (crashed) triggerFishCrash(now);
}

// 16-bit Pixel Matrices for the Blue Boot-Integrated Fisherman Waders (col 7..42, row 38..57 in the 48x48 NFT grid)
// and the Dangling Golden Catch, so every pixel matches the exact 80/48 cell size of UFO_GAME.pilotPixelSheet!
const FISH_WADER_PIXEL_ROWS = [
  // col 7..42 (36 cols; penguin torso col 11..39 is index 4..32, center col 25 is index 18)
  '......KCKSSK.............KSSK.......', // r38: rod crossing left shoulder + suspender straps
  '.......KCYSSK............KSSK.......', // r39: rod shaft over shoulder + straps
  '.....KKmmKCYYK...........KYYK.......', // r40: left flipper + rod grip + yellow wader buckles
  '....KMMMMKCHHHHHHHHHHHHHHHHHK.......', // r41: left flipper gripping rod + top waterproof bib welt
  '...KMMMMmKLCKLLLBBBBBBBBDDDDKKmmK...', // r42: cork handle across left chest + blue bib + right flipper
  '...KKKKKKLLKCLLLLKKKKKKKKDDDDKMMmK..', // r43: cork butt + front pocket flap top
  '......KRRKLLKYLLKSSSSSSSSKDDDDKMMmK.', // r44: blue spinning reel + gold rod butt cap + pocket flap
  '......KKKKLLLKLKSSSSYYSSSKDDDDKmmKK.', // r45: reel bottom + yellow pocket snap button
  '........KLLLLLLKDDDDDDDDDKDDDDKKK...', // r46: waterproof pocket body
  '........KLLLLLLBBBBBBBBBBDDDDDK.....', // r47: lower chest bib
  '........KNNNNNNNNYYYNNNNNNNNK.......', // r48: heavy-duty waterproof waist seam belt + gold buckle
  '........KNNNNNNNNOOONNNNNNNNK.......', // r49: belt lower edge
  '........KLLBBBBBBBBBBBBBBBDDK.......', // r50: wader hip / pelvis
  '........KLLBBSSSHHHHKKKBBSSDK.......', // r51: integrated wader thighs + knee guard top
  '........KLLBBSSSSSSSK.KSSSSDK.......', // r52: reinforced knee guards + leg split
  '.......KUUUHHHHHHHHHK.KUUHHUUK......', // r53: boot-integrated weld seam + glossy rubber boot upper
  '......KUUUUUHHUUUUUUK.KUUUUUUUK.....', // r54: chunky fisherman rubber boot toe boxes
  '......KYYYYYYYYYYYYYK.KYYYYYYYK.....', // r55: bright yellow non-slip fisherman boot sole welt
  '......KOOOOOOOOOOOOOK.KOOOOOOOK.....', // r56: amber lugged rubber sole tread
  '.......KKKKKKKKKKKKK...KKKKKKK......', // r57: crisp bottom outline touching y = +47
];

const FISH_DANGLING_PIXEL_ROWS = [
  'KK......KKKKKK.....',
  'KTK...KKYYYYYYKK...',
  'KTTK.KYYHHHHYYYYK..',
  '.KTTKKYYYYYYYYWKYYK',
  '..KTKOOYYYYYYYWKYYK',
  '.KTTKOOYYYYYYYYYYYK',
  'KTTK.KYYYYYYYYYYYKK',
  'KTK...KYYOOOOOOYYK.',
  'KK.....KKOOOOOOKK..',
  '.........KKKKKK....',
];

// Used in Scene 4 (vortex capture, pixel scan & pillar rise) and Scene 5 (Halloween Town sky-drop & arrival):
// Draws the player's actual NFT Penguin (UFO_GAME.pilotPixelSheet / pilot2DSheet) wearing Blue Boot-Integrated
// Fisherman Waders (파란 어부용 장화일체형 하의) with a Fishing Rod slung over its shoulder (어깨에 들쳐멘 낚싯대)!
function drawFishingPenguinWithRod(ctx, cx, cy, tiltRad = 0, now = 0, options = {}) {
  const {
    scale = 1,
    spId = (typeof UFO_GAME !== 'undefined' && UFO_GAME.pilotSpeciesId) || '01',
    pixelMode = false,
    isShocked = false,
    isImpactBlink = false,
    forceBlink = false,
  } = options;

  if (typeof ensureDefaultPilotSheets === 'function') ensureDefaultPilotSheets();
  const cols = getSpeciesFeatherColors(spId);
  const blinkNow = isImpactBlink || forceBlink;
  const stepWave = Math.sin(now * (isShocked ? 0.028 : 0.008));
  const bootL = isShocked ? Math.round(stepWave * 2) : 0;
  const bootR = isShocked ? Math.round(-stepWave * 2) : 0;
  const fishSwing = Math.sin(now * 0.011) * (isShocked ? 8 : 4);

  ctx.save();
  ctx.translate(Math.round(cx), Math.round(cy));
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);

  const bustX = -42;
  const bustY = -48;
  const bustSize = 80;
  const cell = bustSize / 48; // 1.6667 stage px per NFT pixel cell

  // Shoulder-slung rod coordinates (from left shoulder (-18, +14) up-left to rod tip (-68, -36))
  const tipX = -68;
  const tipY = -36;
  const shX = -18;
  const shY = 14;
  const buttX = -12;
  const buttY = 22;

  // ==========================================================================
  // 1. BEHIND LAYER: Upper shaft of the shoulder-slung fishing rod + dangling catch
  // ==========================================================================
  if (pixelMode) {
    const snapCell = (v) => Math.round(v / cell) * cell;
    const cSz = Math.ceil(cell + 0.35);

    // Pixel fishing line from rod tip (-68, -36) down to dangling golden fish
    const lineEndX = snapCell(tipX + fishSwing);
    const lineEndY = 6;
    for (let ly = tipY; ly <= lineEndY; ly += cell) {
      const t = (ly - tipY) / (lineEndY - tipY);
      const lx = snapCell(tipX + fishSwing * t);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(lx, snapCell(ly), cSz, cSz);
    }

    // 16-bit Pixel Red & White Bobber on the line
    const bobX = snapCell(tipX + fishSwing * 0.45);
    const bobY = snapCell(-16);
    ctx.fillStyle = FISH_K;
    ctx.fillRect(bobX - cell * 2, bobY - cell * 2, cell * 4, cell * 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(bobX - cell, bobY - cell, cell * 2, cell);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bobX - cell, bobY, cell * 2, cell);

    // 16-bit Pixel Dangling Golden Fish at the end of the line (same cell grid!)
    const fishPalette = {
      K: FISH_K,
      Y: '#facc15',
      H: '#fef08a',
      O: '#f97316',
      T: '#fb7185',
      W: '#ffffff',
    };
    const fLeft = snapCell(lineEndX - (FISH_DANGLING_PIXEL_ROWS[0].length * cell) / 2);
    const fTop = snapCell(lineEndY);
    FISH_DANGLING_PIXEL_ROWS.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) {
        const col = fishPalette[row[rx]];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(fLeft + rx * cell, fTop + ry * cell, cSz, cSz);
      }
    });

    // Stepped 16-bit pixel rod shaft from shoulder (-18, +14) to tip (-68, -36)
    const steps = 32;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const rx = snapCell(shX + (tipX - shX) * t);
      const ry = snapCell(shY + (tipY - shY) * t - Math.sin(t * Math.PI) * 3);
      ctx.fillStyle = FISH_K;
      ctx.fillRect(rx - cell, ry - cell, cell * 3, cell * 3);
    }
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const rx = snapCell(shX + (tipX - shX) * t);
      const ry = snapCell(shY + (tipY - shY) * t - Math.sin(t * Math.PI) * 3);
      ctx.fillStyle = i % 5 === 0 ? '#fef08a' : '#f59e0b';
      ctx.fillRect(rx, ry, cSz, cSz);
    }
  } else {
    // Smooth 2D fishing line + bobber + dangling golden catch (for Scene 4 pre-scan 2D bottom half)
    const lineEndX = tipX + fishSwing;
    const lineEndY = 8;
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.92)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.quadraticCurveTo(tipX + fishSwing * 0.5, (tipY + lineEndY) / 2, lineEndX, lineEndY);
    ctx.stroke();

    const bobX = tipX + fishSwing * 0.45;
    const bobY = -16;
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bobX, bobY + 1.5, 4, 0, Math.PI);
    ctx.fill();

    drawFishCreatureSprite(ctx, FISH_SPECIES[5], lineEndX, lineEndY + 8, 0.65, now);

    // Smooth 2D bamboo/carbon rod shaft from shoulder to tip
    ctx.lineCap = 'round';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(shX, shY);
    ctx.quadraticCurveTo((shX + tipX) / 2 - 3, (shY + tipY) / 2 - 4, tipX, tipY);
    ctx.stroke();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.4;
    ctx.stroke();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // ==========================================================================
  // 2. MIDDLE LAYER: The Player's Actual NFT Penguin Upper Body
  //    Uses UFO_GAME.pilotPixelSheet (48x48x3) in pixelMode and UFO_GAME.pilot2DSheet
  //    (288x288x3) in 2D mode, matching drawCarPilot (Species, Clothes, Eyes, Mouth, Eyewear, Hat).
  // ==========================================================================
  const fbSize = Math.round(bustSize * (86 / 79));
  const fbH = Math.round(fbSize * (220 / 256));
  const fbY = bustY + bustSize - fbH;

  ctx.save();
  ctx.beginPath();
  ctx.rect(bustX - 24, -120, bustSize + 48, 142); // clips cleanly inside the wader chest bib at y = +22
  ctx.clip();
  if (pixelMode) {
    ctx.imageSmoothingEnabled = false;
    const anim = getPenguinAnimState(now, 1, false, blinkNow, isShocked);
    const sheet =
      typeof UFO_GAME !== 'undefined' && UFO_GAME.hasNft
        ? UFO_GAME.pilotPixelSheet
        : (typeof UFO_GAME !== 'undefined' && UFO_GAME.pilotPixelSheet) || MOTION_STATE.defaultPilotPixelSheet;
    const f3 = isShocked ? 2 : anim.frameIdx === 1 ? 1 : 0;
    if (sheet) {
      ctx.drawImage(sheet, f3 * 48, 0, 48, 48, bustX, bustY, bustSize, bustSize);
    } else {
      const spEntry = ensureSpeciesSprite(spId);
      const src = spEntry && spEntry.sheetLoaded ? spEntry.sheet : spEntry && spEntry.loaded ? spEntry.img : null;
      if (src) {
        ctx.drawImage(src, src === spEntry.sheet ? anim.frameIdx * 256 : 0, 0, 256, 220, bustX - 2, fbY, fbSize, fbH);
      }
    }
  } else {
    ctx.imageSmoothingEnabled = true;
    const anim = getPenguinAnimState(blinkNow ? 320 : now, 0, false, blinkNow, isShocked && !blinkNow);
    const sheet =
      typeof UFO_GAME !== 'undefined' && UFO_GAME.hasNft
        ? UFO_GAME.pilot2DSheet
        : (typeof UFO_GAME !== 'undefined' && UFO_GAME.pilot2DSheet) || MOTION_STATE.defaultPilot2DSheet;
    const f3 = anim.frameIdx === 6 ? 2 : anim.frameIdx === 1 || anim.frameIdx === 4 || anim.frameIdx === 5 ? 1 : 0;
    if (sheet) {
      ctx.drawImage(sheet, f3 * 288, 0, 288, 288, bustX, bustY, bustSize, bustSize);
    } else {
      const heroSheet = getHero2DSheetForSpecies(spId);
      if (heroSheet && (MOTION_STATE.hero2DSheetLoaded || heroSheet.width)) {
        ctx.drawImage(heroSheet, anim.frameIdx * 256, 0, 256, 220, bustX - 2, fbY, fbSize, fbH);
      }
    }
  }
  ctx.restore();

  // ==========================================================================
  // 3. FRONT LAYER: Blue Boot-Integrated Fisherman Waders (파란 어부용 장화일체형 하의)
  //    + Shoulder-Slung Rod Cork Handle & Spinning Reel + Penguin Flippers
  // ==========================================================================
  if (pixelMode) {
    const waderPalette = {
      K: FISH_K,
      S: '#1e3a8a',
      Y: '#facc15',
      O: '#d97706',
      H: '#60a5fa',
      L: '#3b82f6',
      B: '#2563eb',
      D: '#1d4ed8',
      U: '#1e40af',
      N: '#0f172a',
      M: cols.main,
      m: cols.shade,
      C: '#d97706',
      R: '#38bdf8',
    };
    const cSz = Math.ceil(cell + 0.35);
    FISH_WADER_PIXEL_ROWS.forEach((row, idx) => {
      const gridRow = 38 + idx;
      for (let colOffset = 0; colOffset < row.length; colOffset++) {
        const ch = row[colOffset];
        const color = waderPalette[ch];
        if (!color) continue;
        const gridCol = 7 + colOffset;
        // Apply subtle boot kick on rows 51..57 when falling/yanked
        const legDy = gridRow >= 51 ? (gridCol < 25 ? bootL : bootR) : 0;
        const px = bustX + gridCol * cell;
        const py = bustY + gridRow * cell + legDy;
        ctx.fillStyle = color;
        ctx.fillRect(px, py, cSz, cSz);
      }
    });
  } else {
    // Smooth 2D Cel-Shaded Blue Boot-Integrated Fisherman Waders + Shoulder Rod Grip
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // A. Suspender Straps & Yellow Buckles
    [-13, 13].forEach((sx) => {
      ctx.fillStyle = '#1e3a8a';
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.roundRect(sx - 3.5, 14, 7, 9, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(sx - 2.5, 18, 5, 3);
    });

    // B. High-Waisted Waterproof Blue Chest Bib
    const bibGrad = ctx.createLinearGradient(-22, 20, 22, 35);
    bibGrad.addColorStop(0, '#3b82f6');
    bibGrad.addColorStop(0.55, '#2563eb');
    bibGrad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = bibGrad;
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.roundRect(-22, 20, 44, 15, 6);
    ctx.fill();
    ctx.stroke();

    // Front Waterproof Pouch Pocket
    ctx.fillStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-9, 23, 18, 7.5, 2.5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-8, 23.5, 16, 2.5);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, 26, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Waist Seam Belt
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-21, 31.5, 42, 3);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-3.5, 31, 7, 4);

    // C. Boot-Integrated Wader Legs & Yellow-Soled Rubber Fisherman Boots
    [
      { x: -12, dy: bootL },
      { x: 12, dy: bootR },
    ].forEach((leg) => {
      ctx.fillStyle = '#1e40af';
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.roundRect(leg.x - 10.5, 34 + leg.dy, 21, 11.5, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(leg.x - 6, 36 + leg.dy, 9, 2);
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(leg.x - 11, 42 + leg.dy, 22, 4, 2);
      ctx.fill();
      ctx.stroke();
    });

    // D. Right Flipper on hip
    ctx.fillStyle = cols.main;
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(23, 24, 4, 6.5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // E. Front Cork Grip & Spinning Reel of Shoulder-Slung Rod
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(shX, shY);
    ctx.lineTo(buttX, buttY);
    ctx.stroke();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // F. Left Flipper gripping the shoulder rod
    ctx.fillStyle = cols.main;
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(-21, 19, 6, 4.5, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FISH_CFG, FISH_SPECIES, createFishRun, fishPress, fishRelease, fishStep };
}
