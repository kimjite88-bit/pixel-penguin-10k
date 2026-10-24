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
  BAR_H_BASE: 114, // 38% of track at LV.1 (forgiving Stardew green bar)
  BAR_H_MIN: 88, // ~30% of track at LV.10
  LIFT: 0.34,
  GRAVITY: 0.26,
  REVERSE_ASSIST: 0.26,
  DAMPING: 0.91,
  MAX_VY: 5.0,
  BOUNCE_FLOOR: 0.24,
  BOUNCE_CEIL: 0.16,
  LURE_MIN_FRAMES: 34, // ~0.56 s
  LURE_MAX_FRAMES: 60, // ~1.00 s (snappy arcade pacing)
  BITE_WINDOW_FRAMES: 54, // 0.90 s to hit a PERFECT STRIKE
  LAND_ANIM_FRAMES: 50, // ~0.83 s celebration arc into the tackle box
  SLIP_ANIM_FRAMES: 30,
  ENERGY_MAX: 100,
  COLD_DRAIN_PER_SEC: 1.42, // ambient freeze on the line (ramps after 42s like CAR/BOAT/UFO)
  FRAY_DRAIN_PER_SEC: 5.0, // gentle tension drain while fish is outside the green bar
  FRAY_GRACE_FRAMES: 16, // grace buffer before fray drain begins
  ESCAPE_PENALTY: 14, // line shock if the catch gauge empties completely
  CATCH_HEAL: 6.0,
  CHEST_HEAL: 10.0,
  CHEST_CHANCE: 0.38,
  CHEST_FILL_RATE: 0.022, // ~0.75 s over the chest fills it
  CHEST_BONUS: 420,
  PERFECT_HOOK_BONUS: 120,
  REEL_TICK_POINTS: 6, // continuous score ticks while keeping the green bar on the fish
  START_PROGRESS_NORMAL: 0.28,
  START_PROGRESS_PERFECT: 0.40,
  SECONDS_PER_LEVEL: 6,
  MAX_LEVEL: 10,
  MAX_COMBO: 5,
  PASSIVE_SCORE_PER_SEC: 15,
};

const FISH_K = '#0b1020';

const FISH_SPECIES = [
  {
    id: 'smelt',
    ko: '남극 빙어',
    en: 'Glacier Smelt',
    tier: 'common',
    pattern: 'smooth',
    minLv: 1,
    weight: 20,
    pts: 240,
    heal: 5.5,
    fillRate: 0.0088,
    drainRate: 0.0028,
    dodge: 0.24,
    speed: 0.055,
    col: '#38bdf8',
    belly: '#e0f2fe',
    accent: '#0284c7',
    size: 1.04,
    quoteKo: '입질 맛집이네~ 남극 빙어 초장 가져와라!!',
    quoteEn: 'Fresh Antarctic smelt~ pass the sauce!!',
  },
  {
    id: 'flounder',
    ko: '남극 대왕광어',
    en: 'Antarctic Halibut',
    tier: 'common',
    pattern: 'sinker',
    minLv: 1,
    weight: 22,
    pts: 320,
    heal: 6.0,
    fillRate: 0.0082,
    drainRate: 0.0030,
    dodge: 0.30,
    speed: 0.062,
    col: '#a16207',
    belly: '#fde68a',
    accent: '#ca8a04',
    size: 1.15,
    quoteKo: '와 넙치·광어 봐라 ㅋㅋ 눈 두 개가 한쪽으로 몰려있어!!',
    quoteEn: 'Look at this wide flatfish lol—both eyes on one side!!',
  },
  {
    id: 'squid',
    ko: '남극 대왕오징어',
    en: 'Colossal Squid',
    tier: 'rare',
    pattern: 'dart',
    minLv: 1,
    weight: 20,
    pts: 480,
    heal: 6.5,
    fillRate: 0.0074,
    drainRate: 0.0034,
    dodge: 0.42,
    speed: 0.080,
    col: '#e11d48',
    belly: '#fda4af',
    accent: '#fb7185',
    size: 1.26,
    quoteKo: '빨판 달린 다리만 열 개야!! 대왕오징어 숙회 먹자아악!!',
    quoteEn: 'Ten waving tentacles with suction cups!! Takoyaki time!!',
  },
  {
    id: 'puffer',
    ko: '가시 풍선복어',
    en: 'Balloon Puffer',
    tier: 'uncommon',
    pattern: 'floater',
    minLv: 1,
    weight: 16,
    pts: 380,
    heal: 6.0,
    fillRate: 0.0078,
    drainRate: 0.0032,
    dodge: 0.34,
    speed: 0.068,
    col: '#eab308',
    belly: '#fef9c3',
    accent: '#84cc16',
    size: 1.16,
    quoteKo: '가시 돋친 복어가 빵빵하게 부풀었네 ㅋㅋ 터지기 전에 건져!!',
    quoteEn: 'Puffed up with spikes lol—land it before it pops!!',
  },
  {
    id: 'angler',
    ko: '심해 초롱아귀',
    en: 'Abyssal Anglerfish',
    tier: 'rare',
    pattern: 'sinker',
    minLv: 2,
    weight: 14,
    pts: 600,
    heal: 7.0,
    fillRate: 0.0072,
    drainRate: 0.0035,
    dodge: 0.40,
    speed: 0.076,
    col: '#4338ca',
    belly: '#818cf8',
    accent: '#fde047',
    size: 1.24,
    quoteKo: '얼음구덩이 밑에 왜 이빨 날카로운 심해 초롱아귀가 살아?!!',
    quoteEn: 'Why is a glowing deep-sea angler under this ice hole?!!',
  },
  {
    id: 'pumpkin',
    ko: '할로윈 호박광어',
    en: 'Jack-o-Lantern Fish',
    tier: 'epic',
    pattern: 'floater',
    minLv: 2,
    weight: 13,
    pts: 760,
    heal: 7.5,
    fillRate: 0.0068,
    drainRate: 0.0036,
    dodge: 0.44,
    speed: 0.082,
    col: '#ea580c',
    belly: '#fed7aa',
    accent: '#22c55e',
    size: 1.26,
    quoteKo: '할로윈 호박 물고기다?! 눈이랑 이빨에서 불빛 나옴 ㅋㅋㅋ',
    quoteEn: 'A carved Halloween pumpkin fish?! Look at that glowing grin lol',
  },
  {
    id: 'krill',
    ko: '황금 대왕크릴',
    en: 'Golden King Krill',
    tier: 'epic',
    pattern: 'dart',
    minLv: 3,
    weight: 11,
    pts: 950,
    heal: 8.0,
    fillRate: 0.0065,
    drainRate: 0.0038,
    dodge: 0.48,
    speed: 0.088,
    col: '#f59e0b',
    belly: '#fef08a',
    accent: '#ef4444',
    size: 1.30,
    quoteKo: '황금 갑각 대왕크릴이다!! 낚싯줄 텐션까지 든든하게 회복됨 ㅋㅋ',
    quoteEn: 'Golden King Krill!! Crunchy armor and line tension restored!!',
  },
  {
    id: 'whale',
    ko: '전설의 황금고래',
    en: 'Legendary Gold Whale',
    tier: 'legend',
    pattern: 'boss',
    minLv: 4,
    weight: 8,
    pts: 1400,
    heal: 10.0,
    fillRate: 0.0060,
    drainRate: 0.0040,
    dodge: 0.54,
    speed: 0.095,
    col: '#f59e0b',
    belly: '#fef3c7',
    accent: '#38bdf8',
    size: 1.48,
    quoteKo: '미쳤다 얼음구덩이에서 물보라 뿜는 황금고래가 왜 나와?!!',
    quoteEn: 'Wait, how did a whole GOLDEN WHALE fit through this ice hole?!!',
  },
];

function fishLevelFor(seconds) {
  return Math.min(FISH_CFG.MAX_LEVEL, 1 + Math.floor(seconds / FISH_CFG.SECONDS_PER_LEVEL));
}

function fishBarHeightFor(level) {
  const t = (level - 1) / (FISH_CFG.MAX_LEVEL - 1);
  return Math.round(FISH_CFG.BAR_H_BASE + (FISH_CFG.BAR_H_MIN - FISH_CFG.BAR_H_BASE) * t);
}

function fishPickSpecies(level, rng, lastSpId = null, castCount = 0) {
  // Showcase our signature diverse sea creatures right in the opening casts (광어 -> 오징어 -> 복어/빙어/초롱아귀)
  if (castCount === 0) return FISH_SPECIES[1]; // flounder (남극 대왕광어)
  if (castCount === 1) return FISH_SPECIES[2]; // squid (남극 대왕오징어)

  let pool = FISH_SPECIES.filter((s) => s.minLv <= level);
  if (pool.length > 1 && lastSpId) {
    pool = pool.filter((s) => s.id !== lastSpId);
  }
  const weights = pool.map((s, idx) => {
    const base = s.weight || 12;
    const lvBoost = 1 + Math.max(0, level - s.minLv) * 0.14 + idx * (level * 0.04);
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
  const prevId = run.targetSp ? run.targetSp.id : null;
  run.targetSp = fishPickSpecies(run.level, rng, prevId, run.castCount || 0);
  run.castCount = (run.castCount || 0) + 1;
  run.strikePressed = false;
  run.perfectStrike = false;
  run.bobberDip = 0;
}

function fishBeginFight(run, perfect, rng) {
  const barH = fishBarHeightFor(run.level);
  run.phase = 'fight';
  run.phaseFrames = 0;
  run.perfectStrike = perfect;
  run.barH = barH;
  run.barY = Math.round((FISH_CFG.TRACK_H - barH) * 0.32);
  run.barV = 0;
  // Spawn fish directly inside the player's green catch bar so every fight starts smoothly locked on!
  run.fishY = Math.round(run.barY + barH * 0.5 + (rng() - 0.5) * 20);
  run.fishV = 0;
  run.fishTarget = run.fishY;
  run.nextJumpFrames = 26;
  run.frayGrace = FISH_CFG.FRAY_GRACE_FRAMES;
  run.progress = perfect ? FISH_CFG.START_PROGRESS_PERFECT : FISH_CFG.START_PROGRESS_NORMAL;
  run.onTarget = true;
  run.reelTickFrames = 0;
  run.fightFrames = 0;

  if (rng() < FISH_CFG.CHEST_CHANCE) {
    run.chest = {
      y: Math.round(45 + rng() * (FISH_CFG.TRACK_H - 90)),
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
      size: 0.8 + (i % 3) * 0.22,
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
    castCount: 0,
    caughtCount: 0,
    chestsCaught: 0,
    hold: false,
    justPressed: false,
    phase: 'lure',
    phaseFrames: 0,
    lureDuration: 46,
    nibbleTriggered: false,
    targetSp: FISH_SPECIES[1],
    perfectStrike: false,
    barH: FISH_CFG.BAR_H_BASE,
    barY: 84,
    barV: 0,
    fishY: 135,
    fishV: 0,
    fishTarget: 135,
    nextJumpFrames: 26,
    frayGrace: FISH_CFG.FRAY_GRACE_FRAMES,
    progress: 0.28,
    onTarget: true,
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
    const lvPts = newLevel * 200;
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

  // Ambient cold drain on line durability (gentle early game, ramps up after 42s like CAR/BOAT/UFO)
  const blizzardRamp = 1 + Math.max(0, run.level - 1) * 0.16 + Math.max(0, seconds - 42) * 0.04;
  run.energy -= (FISH_CFG.COLD_DRAIN_PER_SEC / 60) * blizzardRamp * dt;

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
      const hookPts = FISH_CFG.PERFECT_HOOK_BONUS * run.combo;
      run.rawPoints += hookPts;
      events.push({
        type: 'strike',
        perfect: true,
        points: hookPts,
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

    // 2. Hooked Fish AI movement along the 0..TRACK_H gauge (readable pauses + smooth glides)
    run.nextJumpFrames -= dt;
    if (run.nextJumpFrames <= 0) {
      const span = FISH_CFG.TRACK_H * sp.dodge * (1 + (run.level - 1) * 0.04);
      let target = run.fishY + (rng() - 0.48) * span * 1.6;
      if (sp.pattern === 'floater' && rng() < 0.55) {
        target = FISH_CFG.TRACK_H * (0.52 + rng() * 0.38);
      } else if (sp.pattern === 'sinker' && rng() < 0.55) {
        target = FISH_CFG.TRACK_H * (0.08 + rng() * 0.38);
      } else if ((sp.pattern === 'dart' || sp.pattern === 'boss') && rng() < 0.45) {
        target = FISH_CFG.TRACK_H * (0.14 + rng() * 0.72);
      }
      run.fishTarget = Math.max(16, Math.min(FISH_CFG.TRACK_H - 16, target));
      const minF = sp.pattern === 'dart' || sp.pattern === 'boss' ? 28 : 38;
      const maxF = sp.pattern === 'dart' || sp.pattern === 'boss' ? 62 : 72;
      run.nextJumpFrames = minF + rng() * (maxF - minF);
    }

    const pull = sp.speed * (sp.pattern === 'dart' || sp.pattern === 'boss' ? 1.2 : 1.0) * (1 + (run.level - 1) * 0.03);
    run.fishV += (run.fishTarget - run.fishY) * pull * dt * 0.48;
    run.fishV *= Math.pow(0.84, dt);
    run.fishV = Math.max(-3.6, Math.min(3.6, run.fishV));
    run.fishY = Math.max(12, Math.min(FISH_CFG.TRACK_H - 12, run.fishY + run.fishV * dt));

    // 3. Overlap check: is the fish inside the green Catch Bar? (forgiving 8px grace margin)
    const onTarget = run.fishY >= run.barY - 8 && run.fishY <= run.barY + run.barH + 8;
    run.onTarget = onTarget;

    if (onTarget) {
      run.progress += sp.fillRate * dt;
      run.reelTickFrames += dt;
      if (run.reelTickFrames >= 8) {
        run.reelTickFrames = 0;
        const tickPts = FISH_CFG.REEL_TICK_POINTS * run.combo;
        run.rawPoints += tickPts;
        events.push({ type: 'reel', x: FISH_CFG.HOLE_CX, y: FISH_CFG.HOLE_CY, points: tickPts });
      }
    } else {
      if (run.fightFrames > 18) {
        run.progress -= sp.drainRate * (1 + (run.level - 1) * 0.03) * dt;
      }
      if (run.frayGrace > 0) {
        run.frayGrace -= dt;
      } else {
        run.energy -= ((FISH_CFG.FRAY_DRAIN_PER_SEC * (1 + (run.level - 1) * 0.06)) / 60) * dt;
      }
    }

    // 4. Stardew Valley Treasure Chest overlap check
    if (run.chest && !run.chest.caught) {
      const onChest = run.chest.y >= run.barY - 8 && run.chest.y <= run.barY + run.barH + 8;
      if (onChest) {
        run.chest.progress = Math.min(1, run.chest.progress + FISH_CFG.CHEST_FILL_RATE * dt);
        if (run.chest.progress >= 1) {
          run.chest.caught = true;
          events.push({ type: 'chestLock', x: 728, y: 400 - run.chest.y });
        }
      } else {
        run.chest.progress = Math.max(0, run.chest.progress - FISH_CFG.CHEST_FILL_RATE * 0.25 * dt);
      }
    }

    // Dynamic rod bend reflects tension + fish struggle
    const wantBend = (onTarget ? 0.52 : 0.88) + Math.sin(run.frames * 0.35) * 0.14;
    run.rodBend += (wantBend - run.rodBend) * 0.25 * dt;

    // 5. Check Catch Complete or Fish Escaped
    if (run.progress >= 1) {
      run.progress = 1;
      run.caughtCount += 1;
      const mult = 1 + (run.combo - 1) * 0.28;
      const fishPts = Math.round(sp.pts * mult);
      const chestGot = Boolean(run.chest && run.chest.caught);
      const chestPts = chestGot ? FISH_CFG.CHEST_BONUS + run.combo * 100 : 0;
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
        heal: Math.round(heal),
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

// Hand-crafted anatomical sprite renderer for all 8 sea creatures:
// smelt (남극 빙어), flounder (남극 대왕광어), squid (남극 대왕오징어), puffer (가시 풍선복어),
// angler (심해 초롱아귀), pumpkin (할로윈 호박광어), krill (황금 대왕크릴), whale (전설의 황금고래)
function drawFishCreatureSprite(ctx, sp, x, y, scale = 1, now = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const wiggle = Math.sin(now * 0.016) * 0.07;
  ctx.rotate(wiggle);

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = FISH_K;

  const id = sp ? sp.id : 'smelt';
  const finWag = Math.sin(now * 0.025) * 2.5;

  if (id === 'flounder') {
    // =========================================================================
    // 1. ANTARCTIC HALIBUT / FLOUNDER (남극 대왕광어 — 비대칭 마름모 몸통 + 주름 지느러미 + 몰린 두 눈)
    // =========================================================================
    // Fanned wedge tail fin on the left
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(-17, 0);
    ctx.lineTo(-29, -9 + finWag * 0.5);
    ctx.quadraticCurveTo(-32, finWag * 0.5, -29, 9 + finWag * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Continuous dorsal & anal ribbon fin frill (지느러미 주름) around the wide diamond rim
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-19, -2);
    ctx.quadraticCurveTo(-2, -24 - finWag * 0.3, 15, -7);
    ctx.lineTo(15, 7);
    ctx.quadraticCurveTo(-2, 24 + finWag * 0.3, -19, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fin-ray stripes along the top & bottom ribbon fins
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 1.4;
    for (let r = -12; r <= 8; r += 4) {
      const arcH = (1 - Math.pow(r / 16, 2)) * 11.5;
      ctx.beginPath();
      ctx.moveTo(r, -6);
      ctx.lineTo(r - 1, -arcH - 2);
      ctx.moveTo(r, 6);
      ctx.lineTo(r - 1, arcH + 2);
      ctx.stroke();
    }

    // Wide asymmetrical diamond/oval flatfish body
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.4;
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.moveTo(-19, 0);
    ctx.quadraticCurveTo(-2, -16, 17, -4);
    ctx.quadraticCurveTo(22, 0, 17, 5);
    ctx.quadraticCurveTo(-2, 16, -19, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Golden-olive inner dorsal sheen
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.ellipse(-1, 0, 14, 9.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mottled flatfish camouflage spots (광어 반점 무늬: dark umber + sandy cream)
    const darkSpots = [[-10, -4, 2.3], [-4, -6, 2.6], [2, -5, 2.0], [-7, 5, 2.5], [1, 6, 2.4], [-2, 1, 2.2]];
    ctx.fillStyle = '#422006';
    darkSpots.forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });
    const lightSpots = [[-12, 2, 1.6], [-5, -2, 1.7], [4, 2, 1.6], [-1, 7, 1.4]];
    ctx.fillStyle = '#fef08a';
    lightSpots.forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Curved S-shaped lateral line (광어 특유의 중앙 측선) & gill arch
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-17, 0);
    ctx.bezierCurveTo(-6, 1, 0, -4, 8, -2);
    ctx.stroke();
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(7, 1, 6.5, Math.PI * 0.65, Math.PI * 1.35);
    ctx.stroke();

    // Small central pectoral fin
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(2, 2.5, 4.5, 2.4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Slanted halibut jaw with tiny sharp teeth
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(19, 1);
    ctx.lineTo(13, 5);
    ctx.stroke();

    // Signature Flatfish Feature: BOTH bulging eyes perched side-by-side on the upper head!
    const eyes = [[9.5, -6.5, 3.6], [14.2, -2.2, 3.3]];
    eyes.forEach(([ex, ey, er]) => {
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(ex, ey, er, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex + 0.3, ey, er * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = FISH_K;
      ctx.beginPath();
      ctx.arc(ex + 0.8, ey - 0.2, er * 0.42, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (id === 'squid') {
    // =========================================================================
    // 2. COLOSSAL SQUID (남극 대왕오징어 — 삼각 귀 지느러미 + 점박이 몸통 + 10개 다리 & 빨판)
    // =========================================================================
    // 2 extra-long hunting tentacles with broadened clubs & white suction cups (빨판)
    for (const sgn of [-1, 1]) {
      const wave = Math.sin(now * 0.022 + sgn * 1.2) * 4;
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 5.4;
      ctx.beginPath();
      ctx.moveTo(10, sgn * 4);
      ctx.bezierCurveTo(18, sgn * 9 + wave, 24, sgn * 3 - wave, 31, sgn * 6 + wave * 0.6);
      ctx.stroke();
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 3.0;
      ctx.stroke();

      // Broadened tentacle club at the tip
      const cx = 31;
      const cy = sgn * 6 + wave * 0.6;
      ctx.fillStyle = '#e11d48';
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 4.8, 2.6, sgn * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White suction cups (빨판) along the tentacle & club
      ctx.fillStyle = '#ffffff';
      for (let c = 0; c < 3; c++) {
        ctx.beginPath();
        ctx.arc(21 + c * 4.2, sgn * (5 + (c % 2)) + wave * 0.4, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 6 inner waving arms
    for (let t = -2.5; t <= 2.5; t += 1) {
      const w = Math.sin(now * 0.028 + t * 1.1) * 3.2;
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 4.4;
      ctx.beginPath();
      ctx.moveTo(10, t * 2.1);
      ctx.quadraticCurveTo(17, t * 3.1 + w, 24, t * 2.6 - w * 0.5);
      ctx.stroke();
      ctx.strokeStyle = t % 2 === 0 ? '#f43f5e' : '#fda4af';
      ctx.lineWidth = 2.3;
      ctx.stroke();
    }

    // Muscular head & siphon funnel collar
    ctx.fillStyle = '#be123c';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(4, -7.5, 9.5, 15, 4);
    ctx.fill();
    ctx.stroke();

    // Diamond / spearhead caudal mantle fins (오징어 삼각 귀 지느러미)
    const flap = Math.sin(now * 0.024) * 1.5;
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-12, -14 - flap);
    ctx.lineTo(-4, -5);
    ctx.lineTo(-4, 5);
    ctx.lineTo(-12, 14 + flap);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tapered cylindrical squid mantle body (오징어 몸통)
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(-23, 0);
    ctx.quadraticCurveTo(-11, -10.5, 6, -8.5);
    ctx.lineTo(7, 8.5);
    ctx.quadraticCurveTo(-11, 10.5, -23, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Soft rose belly highlight & mantle collar crease
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.ellipse(-5, -2.2, 10, 3.2, -0.08, 0, Math.PI * 2);
    ctx.fill();

    // Chromatophore spots on the squid mantle
    ctx.fillStyle = '#881337';
    [[-14, -2, 1.8], [-8, 3, 2.1], [-2, -4, 1.6], [-4, 4, 1.8], [1, 1, 1.5]].forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Two expressive yellow-ringed squid eyes on the head
    for (const ey of [-4.2, 4.2]) {
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(9.5, ey, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = FISH_K;
      ctx.beginPath();
      ctx.arc(10.2, ey, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(9.2, ey - 1.4, 1.3, 1.3);
    }
  } else if (id === 'puffer') {
    // =========================================================================
    // 3. SPIKY BALLOON PUFFER (가시 풍선복어 — 360도 뾰족 가시 + 빵빵한 배 + O자 입)
    // =========================================================================
    const puffR = 14.5 + Math.sin(now * 0.02) * 1.1;

    // Stubby fluttering tail fin
    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.moveTo(-puffR + 2, 0);
    ctx.lineTo(-puffR - 8, -6 + finWag * 0.4);
    ctx.lineTo(-puffR - 8, 6 + finWag * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 12 sharp conical spines radiating around the entire 360° perimeter
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.0;
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12;
      if (Math.abs(a) < 0.28) continue; // leave space for the puckered mouth
      const bx1 = Math.cos(a - 0.16) * (puffR - 1);
      const by1 = Math.sin(a - 0.16) * (puffR - 1);
      const bx2 = Math.cos(a + 0.16) * (puffR - 1);
      const by2 = Math.sin(a + 0.16) * (puffR - 1);
      const tx = Math.cos(a) * (puffR + 5.5);
      const ty = Math.sin(a) * (puffR + 5.5);
      ctx.beginPath();
      ctx.moveTo(bx1, by1);
      ctx.lineTo(tx, ty);
      ctx.lineTo(bx2, by2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Round inflated body (golden-lime upper half, creamy-white pleated belly)
    ctx.fillStyle = '#eab308';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, puffR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Creamy white inflated belly half
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(0, 1, puffR - 1.2, 0.08, Math.PI - 0.08);
    ctx.quadraticCurveTo(0, 3, Math.cos(0.08) * (puffR - 1.2), Math.sin(0.08) * (puffR - 1.2));
    ctx.fill();

    // Green-olive back spots & inner spine pricks
    ctx.fillStyle = '#65a30d';
    [[-6, -7, 2.2], [0, -9, 2.5], [5, -6, 1.8], [-8, -2, 1.8]].forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Tummy pleat arcs on the cream belly
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.4;
    for (const bx of [-5, 1, 6]) {
      ctx.beginPath();
      ctx.arc(bx, 7, 2.4, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // Translucent pectoral fan fin
    ctx.fillStyle = '#bef264';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(-2, 2, 5.2, 3.2, -0.25 + finWag * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cute pink puckered 'O' mouth on the right
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(puffR + 0.5, 0.5, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = FISH_K;
    ctx.beginPath();
    ctx.arc(puffR + 1.2, 0.5, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Big surprised googly eye + rosy cheek
    ctx.fillStyle = 'rgba(251, 113, 133, 0.55)';
    ctx.beginPath();
    ctx.arc(6.5, 3.5, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7.5, -3.5, 4.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = FISH_K;
    ctx.beginPath();
    ctx.arc(8.5, -3.5, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7.4, -5.0, 1.5, 1.5);
  } else if (id === 'angler') {
    // =========================================================================
    // 4. ABYSSAL ANGLERFISH (심해 초롱아귀 — 발광 초롱 안테나 + 거대한 주걱턱과 날카로운 이빨)
    // =========================================================================
    // Ragged abyssal tail fin & spiny dorsal rays
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-27, -10 + finWag * 0.4);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-27, 10 + finWag * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-11, -10);
    ctx.lineTo(-14, -18);
    ctx.lineTo(-5, -12);
    ctx.lineTo(-6, -19);
    ctx.lineTo(1, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hunched bulbous deep-sea body
    ctx.fillStyle = '#3730a3';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(-8, -16, 11, -11);
    ctx.lineTo(16, -2);
    ctx.lineTo(6, 3);
    ctx.lineTo(18, 8);
    ctx.quadraticCurveTo(4, 16, -18, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bioluminescent lavender belly glow
    ctx.fillStyle = '#818cf8';
    ctx.beginPath();
    ctx.ellipse(-3, 6, 10, 4, 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Cavernous dark mouth interior + interlocking needle-sharp white fangs (날카로운 이빨)
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(15, -3);
    ctx.lineTo(5, 2);
    ctx.lineTo(17, 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 1.2;
    // Upper fangs
    for (let f = 0; f < 4; f++) {
      const fx = 7 + f * 2.5;
      const fy = 1 - f * 0.8;
      ctx.beginPath();
      ctx.moveTo(fx - 1.1, fy);
      ctx.lineTo(fx, fy + 4.2);
      ctx.lineTo(fx + 1.1, fy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // Lower jutting underbite fangs (longer & menacing!)
    for (let f = 0; f < 4; f++) {
      const fx = 8 + f * 2.6;
      const fy = 3.5 + f * 0.9;
      ctx.beginPath();
      ctx.moveTo(fx - 1.2, fy);
      ctx.lineTo(fx + 0.4, fy - 4.8);
      ctx.lineTo(fx + 1.2, fy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Sweeping forehead antenna (illicium) + blazing bioluminescent lantern (발광 초롱)
    const lx = 23;
    const ly = -9 + Math.sin(now * 0.03) * 1.5;
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.moveTo(4, -11);
    ctx.quadraticCurveTo(14, -23, lx, ly);
    ctx.stroke();
    ctx.strokeStyle = '#a5b4fc';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Outer cyan-yellow bioluminescent halo
    ctx.fillStyle = 'rgba(103, 232, 249, 0.42)';
    ctx.beginPath();
    ctx.arc(lx, ly, 8.5 + Math.sin(now * 0.04) * 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Bright yellow lantern bulb
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(lx, ly, 4.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lx - 1, ly - 1, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Glaring cyan abyssal eye
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath();
    ctx.arc(7, -6.5, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = FISH_K;
    ctx.fillRect(7.2, -8.5, 1.6, 4.0);
  } else if (id === 'pumpkin') {
    // =========================================================================
    // 5. JACK-O'-LANTERN FISH (할로윈 호박광어 — 주황 호박 골 + 초록 덩굴 꼭지 + 빛나는 잭오랜턴 얼굴)
    // =========================================================================
    // Leafy green autumn tail fin
    ctx.fillStyle = '#16a34a';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-27, -10 + finWag * 0.4);
    ctx.lineTo(-23, 0);
    ctx.lineTo(-27, 10 + finWag * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jagged green pumpkin-leaf dorsal fin + curled vine stem on top!
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(-9, -12);
    ctx.lineTo(-5, -18);
    ctx.lineTo(-1, -13);
    ctx.lineTo(4, -18);
    ctx.lineTo(7, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Twisted pumpkin stem
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.quadraticCurveTo(-2, -21, -7, -20);
    ctx.stroke();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Plump gourd body with scalloped top/bottom ribs
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18.5, 14.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bright orange inner gourd highlight
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(1, 0, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4 curved vertical pumpkin rib grooves (호박 골)
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1.8;
    for (const rx of [-9, -3, 3, 9]) {
      ctx.beginPath();
      ctx.moveTo(rx, -13.5);
      ctx.quadraticCurveTo(rx + (rx >= 0 ? 3 : -3), 0, rx, 13.5);
      ctx.stroke();
    }

    // Glowing carved Jack-o'-Lantern triangle eye & nose!
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.lineTo(8.5, -8.5);
    ctx.lineTo(12.5, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner white-hot candle sparkle inside the carved eye
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(8.5, -4, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Carved zig-zag Jack-o'-Lantern grin!
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(1, 3);
    ctx.lineTo(4, 5);
    ctx.lineTo(6.5, 3);
    ctx.lineTo(9.5, 5);
    ctx.lineTo(12, 3);
    ctx.lineTo(15, 4.5);
    ctx.lineTo(13, 8.5);
    ctx.lineTo(9.5, 7);
    ctx.lineTo(6.5, 9);
    ctx.lineTo(3.5, 7);
    ctx.lineTo(0.5, 7.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (id === 'krill') {
    // =========================================================================
    // 6. GOLDEN KING KRILL (황금 대왕크릴 — 5단 황금 갑각 마디 + 부채꼴 꼬리 + 긴 수염과 헤엄다리)
    // =========================================================================
    // 2 long sweeping curved crimson-gold antennae trailing from the front head
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(15, -4);
    ctx.quadraticCurveTo(28, -14, 6, -18 + finWag * 0.4);
    ctx.moveTo(16, -1);
    ctx.quadraticCurveTo(29, -6, 22, -14 - finWag * 0.4);
    ctx.stroke();

    // 5 paddling swimmeret pleopod legs (헤엄다리) along the belly
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.6;
    for (let l = -10; l <= 6; l += 4) {
      const kick = Math.sin(now * 0.035 + l) * 2.5;
      ctx.beginPath();
      ctx.moveTo(l, 5);
      ctx.lineTo(l - 2 + kick, 12);
      ctx.stroke();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 2.6;
    }

    // Fanned 5-blade crustacean tail (부채꼴 꼬리)
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.0;
    for (const ty of [-6, -2, 2, 6]) {
      ctx.beginPath();
      ctx.ellipse(-20, ty + finWag * 0.3, 6.5, 2.6, ty * 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // 5 overlapping articulated golden carapace segments (황금 갑각 마디)
    const segs = [
      [-13, 1, 5.5, 6.5],
      [-7, -1, 6.2, 7.8],
      [-1, -2, 6.8, 8.6],
      [6, -1.5, 7.5, 8.5],
      [12, -0.5, 7.2, 7.2],
    ];
    segs.forEach(([sx, sy, rx, ry], idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#f59e0b' : '#fbbf24';
      ctx.strokeStyle = FISH_K;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Golden dorsal highlight strip
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(sx, sy - ry * 0.48, rx * 0.65, 2.0, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Serrated golden rostrum horn & front pincer claw
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(16, -5);
    ctx.lineTo(25, -7);
    ctx.lineTo(18, -1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stalked compound eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(15.5, -4.5, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = FISH_K;
    ctx.beginPath();
    ctx.arc(16.2, -4.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'whale') {
    // =========================================================================
    // 7. LEGENDARY GOLDEN WHALE (전설의 황금고래 — 물보라 분수 + 고래 배 주름 + 초승달 꼬리와 긴 가슴지느러미)
    // =========================================================================
    // Twin water-spout fountain erupting from the blowhole on top of the head!
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2.2;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(6, -13);
      ctx.quadraticCurveTo(6 + sgn * 4, -24, 6 + sgn * 11, -21 + Math.sin(now * 0.03) * 1.5);
      ctx.stroke();
    }
    ctx.fillStyle = '#e0f2fe';
    [[-4, -22], [6, -24], [15, -22]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Broad horizontal humpback fluke tail on the left
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.quadraticCurveTo(-28, -12 + finWag * 0.5, -31, -13 + finWag * 0.5);
    ctx.quadraticCurveTo(-26, 0 + finWag * 0.5, -31, 13 + finWag * 0.5);
    ctx.quadraticCurveTo(-28, 12 + finWag * 0.5, -20, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Small dorsal hump fin toward the rear back
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(-12, -9);
    ctx.quadraticCurveTo(-9, -15, -5, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Majestic arched whale body (high rounded forehead + tapered peduncle)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-23, 0);
    ctx.bezierCurveTo(-12, -13, 12, -18, 22, -4);
    ctx.quadraticCurveTo(25, 2, 20, 7);
    ctx.bezierCurveTo(10, 15, -8, 12, -23, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Royal golden sheen along the forehead & back
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(3, -7, 13, 3.6, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Cream-gold ventral belly + 6 parallel pleated throat grooves (고래 배 주름)!
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(-10, 4);
    ctx.quadraticCurveTo(6, 1, 21, 3);
    ctx.quadraticCurveTo(16, 12, 2, 11);
    ctx.quadraticCurveTo(-6, 10, -10, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.3;
    for (let g = 0; g < 4; g++) {
      ctx.beginPath();
      ctx.moveTo(-6 + g * 2, 5 + g * 1.3);
      ctx.quadraticCurveTo(6, 5.5 + g * 1.5, 18 - g * 1.5, 4.5 + g * 1.3);
      ctx.stroke();
    }

    // Long scalloped humpback pectoral flipper sweeping downward
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(2, 4);
    ctx.quadraticCurveTo(-4, 16, -9, 17);
    ctx.quadraticCurveTo(-1, 14, 6, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gentle wise whale eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(13, -2, 3.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = FISH_K;
    ctx.beginPath();
    ctx.arc(13.6, -2, 1.6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // =========================================================================
    // 8. GLACIER SMELT (남극 빙어 — 날렵한 은빛 유선형 몸통 + 깊게 갈라진 꼬리 + 푸른 측선과 비늘)
    // =========================================================================
    // Deeply forked translucent V-tail fin
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-27, -9 + finWag * 0.4);
    ctx.lineTo(-21, 0 + finWag * 0.2);
    ctx.lineTo(-27, 9 + finWag * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pointed dorsal & anal fins
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-5, -7);
    ctx.lineTo(-1, -14);
    ctx.lineTo(5, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-8, 6);
    ctx.lineTo(-5, 12);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sleek torpedo stream body
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(-19, 0);
    ctx.quadraticCurveTo(-2, -9.5, 20, 0);
    ctx.quadraticCurveTo(-2, 9.5, -19, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Translucent silver-ice belly & iridescent cyan lateral stripe
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.moveTo(-16, 0.5);
    ctx.quadraticCurveTo(0, 8.2, 18, 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-15, -0.8);
    ctx.lineTo(13, -0.8);
    ctx.stroke();

    // Delicate scale chevrons & gill operculum arc
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 1.3;
    for (const sx of [-9, -4, 1, 6]) {
      ctx.beginPath();
      ctx.moveTo(sx, -3);
      ctx.lineTo(sx - 2, 0);
      ctx.lineTo(sx, 3);
      ctx.stroke();
    }
    ctx.strokeStyle = FISH_K;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(9, 0, 4.8, Math.PI * 0.65, Math.PI * 1.35);
    ctx.stroke();

    // Bright smelt eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(13, -1.5, 3.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = FISH_K;
    ctx.beginPath();
    ctx.arc(13.6, -1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Draw species-specific underwater silhouettes inside the giant ice hole so the player can visually
// recognize a swimming squid (tentacles), halibut/flounder (wide diamond), spiky puffer, or whale!
function drawFishUnderwaterSilhouette(ctx, spId, wobble, isTarget, phase) {
  const wag = Math.sin(wobble) * 3.5;
  ctx.fillStyle = isTarget && phase === 'fight' ? 'rgba(14, 165, 233, 0.78)' : 'rgba(6, 48, 75, 0.56)';

  if (spId === 'flounder') {
    // Wide diamond flatfish silhouette
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.quadraticCurveTo(-2, -19, 18, -4);
    ctx.quadraticCurveTo(23, 0, 18, 4);
    ctx.quadraticCurveTo(-2, 19, -22, 0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-30, -8 + wag);
    ctx.lineTo(-30, 8 + wag);
    ctx.closePath();
    ctx.fill();
  } else if (spId === 'squid') {
    // Spearhead squid mantle + waving tentacles silhouette
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(-12, -13);
    ctx.lineTo(-4, -6);
    ctx.lineTo(10, -7);
    ctx.lineTo(10, 7);
    ctx.lineTo(-4, 6);
    ctx.lineTo(-12, 13);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2.8;
    for (let t = -2; t <= 2; t++) {
      ctx.beginPath();
      ctx.moveTo(9, t * 2.5);
      ctx.quadraticCurveTo(18, t * 3.5 + wag, 27, t * 3 - wag * 0.5);
      ctx.stroke();
    }
  } else if (spId === 'puffer') {
    // Round inflated spiky puffer silhouette
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2) / 10;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 16.5, Math.sin(a) * 16.5, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spId === 'whale') {
    // Huge whale silhouette with broad horizontal flukes & long pectoral fin
    ctx.beginPath();
    ctx.ellipse(0, 0, 27, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-23, 0);
    ctx.lineTo(-36, -12 + wag);
    ctx.lineTo(-31, 0 + wag);
    ctx.lineTo(-36, 12 + wag);
    ctx.closePath();
    ctx.fill();
  } else {
    // Sleek fish / angler / krill silhouette
    ctx.beginPath();
    ctx.ellipse(0, 0, 21, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-30, -8 + wag);
    ctx.lineTo(-30, 8 + wag);
    ctx.closePath();
    ctx.fill();
    if (spId === 'angler') {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
      ctx.beginPath();
      ctx.arc(24, -6, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Draw the giant ice hole's animated underwater life, ripples, bobber, and splashes
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

  // Swimming silhouettes inside the ice hole (showing distinct squid, flounder, puffer, whale shapes!)
  run.shadows.forEach((sh, idx) => {
    const isTarget = idx === 0 && (run.phase === 'lure' || run.phase === 'bite' || run.phase === 'fight');
    const spObj = isTarget && run.targetSp ? run.targetSp : FISH_SPECIES[sh.spIdx % FISH_SPECIES.length];
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
    drawFishUnderwaterSilhouette(ctx, spObj.id, sh.wobble, isTarget, run.phase);
    // Golden glint if target is epic/legendary
    if (isTarget && (spObj.tier === 'epic' || spObj.tier === 'legend')) {
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

  // Header label ("밀당 게이지" / "CATCH BAR" or current hooked species name)
  ctx.font = '900 12px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde047';
  const barTitle =
    run.phase === 'fight' && run.targetSp
      ? ko
        ? run.targetSp.ko
        : i18n(run.targetSp.en)
      : ko
      ? '밀당 게이지'
      : i18n('CATCH BAR');
  ctx.fillText(barTitle, trackX + (trackW + progW + 8) / 2, trackY - 15);

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

  // 2. Caught fish stacked beside the red tackle box on the left snow ledge (x ~ 62..200, y ~ 296..328)
  run.caughtStack.forEach((sp, i) => {
    const tx = 64 + (i % 4) * 44;
    const ty = 296 + Math.floor(i / 4) * 30;
    drawFishCreatureSprite(ctx, sp, tx, ty, 0.70, now + i * 200);
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
