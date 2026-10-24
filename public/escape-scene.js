// ============================================================================
// SCENE 1 — "남극이 무너진다, 뭐 타고 도망가?" — the escape picker (plane / icebreaker / car)
//
// Layout follows the reference the owner gave: the plane on the igloo plateau (left), the icebreaker in an
// open lead in the middle, the car on the right floe, the vortex beam top right, the default 2D penguin (before
// it gets pixelated) in front, panicking. The longer the player waits, the worse it gets (an "Evil Egg": the
// cost of doing nothing grows in visible stages instead of a win/lose timer — Yu-kai Chou, Octalysis #115):
// quakes come closer together and harder, cracks spread and stay (permanence, Vlambeer's "Art of Screenshake"),
// ice drops off the cliffs, the red alarm pulses brighter, and the penguin yells at you to pick. Each quake is a
// short burst, not a constant wobble, so the picture stays readable between them.
// ============================================================================
const SCENE0_UFO_SPOT = { x: 300, y: 296 - 66 * 0.74, tilt: 0, scale: 0.74 }; // plane ('ufo' key kept for saved picks + the board)
const SCENE0_BOAT_SPOT = { x: 565, y: 352 - 34 * 0.44, tilt: 0, scale: 0.44 }; // waterline in the lead at y = 352
const SCENE0_CAR_SPOT = { x: 880, y: 366 - 57 * 0.64, tilt: 0, scale: 0.64 };
const SCENE0_FISH_SPOT = { x: 856, y: 476, holeX: 770, holeY: 500, scale: 0.46 }; // planted ice-fishing rod & hole in the bottom-right snow
// The penguin stands front and centre on a floe in the glowing crevasse; the start card sits bottom-left over the cliff
const SCENE0_HERO = { x: 590, feet: 496, size: 140 };
const SCENE0_K = '#0b1020';

const SCENE0_ACCENT = { ufo: '#fb923c', boat: '#38bdf8', car: '#f472b6', fish: '#34d399' };

// 0 at the start, 1 after ~24 s of waiting
function scene0Escalation(now) {
  return Math.min(1, Math.max(0, (now - MOTION_STATE.sceneStartTime) / 24000));
}

// Quakes: a 480ms burst every 3.4 s at first, every 1.7 s when it is at its worst. Returns 0..1 strength.
function scene0Quake(now) {
  const t = now - MOTION_STATE.sceneStartTime;
  if (t < 900) return 0;
  const esc = scene0Escalation(now);
  const period = 3400 - esc * 1700;
  const ph = (t - 900) % period;
  return ph < 480 ? Math.sin((ph / 480) * Math.PI) * (0.55 + esc * 0.45) : 0;
}

function scene0Hash(n) {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
}

// Zigzag crack from (x, y) heading at angle a; grows with esc and never closes again
function drawScene0Crack(ctx, x, y, a, len, seed, grow) {
  const n = 7;
  const shown = Math.max(0, Math.min(1, grow)) * len;
  if (shown < 4) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  let px = x;
  let py = y;
  for (let i = 1; i <= n; i++) {
    const d = (shown * i) / n;
    const off = (scene0Hash(seed + i) - 0.5) * 16;
    px = x + Math.cos(a) * d - Math.sin(a) * off;
    py = y + Math.sin(a) * d * 0.45 + Math.cos(a) * off * 0.45;
    ctx.lineTo(px, py);
  }
  ctx.strokeStyle = SCENE0_K;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

// Open lead the icebreaker sits in, with floes knocking about
function drawScene0Lead(ctx, now, quake) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(445, 341);
  ctx.lineTo(535, 336);
  ctx.lineTo(675, 339);
  ctx.lineTo(703, 352);
  ctx.lineTo(687, 368);
  ctx.lineTo(575, 374);
  ctx.lineTo(455, 370);
  ctx.lineTo(433, 356);
  ctx.closePath();
  ctx.fillStyle = '#0e4f6e';
  ctx.fill();
  ctx.strokeStyle = '#e8f4fb';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
  for (let i = 0; i < 9; i++) {
    const wx = 453 + ((i * 37 + now * 0.03) % 230);
    ctx.fillRect(Math.round(wx), 346 + (i % 3) * 8, 12, 2);
  }
  // Floes bumping in the lead
  const floes = [
    [467, 358, 22],
    [640, 344, 18],
    [676, 360, 14],
  ];
  floes.forEach(([fx, fy, w], i) => {
    const bob = Math.sin(now * 0.006 + i * 2) * 1.5 + quake * Math.sin(now * 0.08 + i) * 3;
    ctx.fillStyle = SCENE0_K;
    ctx.fillRect(fx - w / 2 - 1, fy - 4 + bob - 1, w + 2, 9);
    ctx.fillStyle = '#eaf6fd';
    ctx.fillRect(fx - w / 2, fy - 4 + bob, w, 5);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(fx - w / 2, fy + 1 + bob, w, 2);
  });
  ctx.restore();
}

// Ice blocks breaking off the plateau cliff and the right shelf, splashing into the water below
function drawScene0FallingIce(ctx, now, esc) {
  const t = now - MOTION_STATE.sceneStartTime;
  const count = 2 + Math.round(esc * 4);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const period = 2600 - esc * 900 + i * 170;
    const ph = ((t + i * 977) % period) / period;
    const left = i % 2 === 0;
    const x0 = left ? 330 + scene0Hash(i) * 100 : 760 + scene0Hash(i + 9) * 70;
    const y0 = left ? 300 : 372;
    const y1 = left ? 460 : 500;
    if (ph < 0.72) {
      const fp = ph / 0.72;
      const y = y0 + (y1 - y0) * fp * fp;
      const sz = 8 + Math.round(scene0Hash(i + 4) * 8);
      ctx.save();
      ctx.translate(x0 + fp * (left ? 10 : -6), y);
      ctx.rotate(fp * 3 * (left ? 1 : -1));
      ctx.fillStyle = SCENE0_K;
      ctx.fillRect(-sz / 2 - 1, -sz / 2 - 1, sz + 2, sz + 2);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(-sz / 2, sz / 4, sz, sz / 4);
      ctx.restore();
    } else {
      const sp = (ph - 0.72) / 0.28;
      ctx.globalAlpha = 1 - sp;
      ctx.fillStyle = '#f0f9ff';
      for (let k = 0; k < 5; k++) {
        const dx = (k - 2) * (6 + sp * 10);
        const dy = -Math.sin(sp * Math.PI) * (10 + (k % 3) * 6);
        ctx.fillRect(Math.round(x0 + dx), Math.round(y1 + dy), 4, 4);
      }
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}

// The ledge the penguin stands on, cracking under its feet
function drawScene0HeroLedge(ctx, now, esc, quake) {
  const { x } = SCENE0_HERO;
  const feet = SCENE0_HERO.feet;
  ctx.save();
  // Ripples round the floe
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.7)';
  ctx.lineWidth = 2;
  for (let r = 0; r < 2; r++) {
    const rp = ((now * 0.0012 + r * 0.5) % 1);
    ctx.globalAlpha = 1 - rp;
    ctx.beginPath();
    ctx.ellipse(x, feet + 16, 96 + rp * 40, 10 + rp * 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // A thick floe: top face, then its blue side, outlined
  const top = [
    [x - 104, feet + 2],
    [x - 70, feet - 12],
    [x + 58, feet - 14],
    [x + 106, feet],
    [x + 76, feet + 14],
    [x - 80, feet + 16],
  ];
  const path = (dy) => {
    ctx.beginPath();
    top.forEach(([px, py], i) => (i ? ctx.lineTo(px, py + dy) : ctx.moveTo(px, py + dy)));
    ctx.closePath();
  };
  path(18);
  ctx.fillStyle = '#5fb3d9';
  ctx.fill();
  ctx.fillRect(x - 104, feet + 2, 210, 18);
  ctx.fillStyle = '#9bd1ea';
  ctx.fillRect(x - 100, feet + 4, 202, 8);
  path(0);
  ctx.fillStyle = '#f1f8fc';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = SCENE0_K;
  ctx.stroke();
  ctx.strokeRect(x - 104, feet + 2, 0, 18);
  ctx.beginPath();
  ctx.moveTo(x - 104, feet + 2);
  ctx.lineTo(x - 104, feet + 20);
  ctx.lineTo(x - 80, feet + 34);
  ctx.lineTo(x + 76, feet + 32);
  ctx.lineTo(x + 106, feet + 18);
  ctx.lineTo(x + 106, feet);
  ctx.stroke();
  // Shadow under the feet
  ctx.fillStyle = 'rgba(11, 16, 32, 0.22)';
  ctx.beginPath();
  ctx.ellipse(x, feet + 1, 40, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawScene0Crack(ctx, x + 6, feet + 2, -0.2, 70, 11, 0.25 + esc * 0.9);
  drawScene0Crack(ctx, x - 4, feet + 3, Math.PI + 0.25, 64, 23, esc * 1.2 - 0.1);
  if (quake > 0.3) {
    // Chips knocked off the ledge edge
    ctx.fillStyle = '#e0f2fe';
    for (let k = 0; k < 4; k++) {
      const cx = x - 70 + k * 46 + Math.sin(now * 0.05 + k) * 3;
      const cy = feet + 26 + ((now * 0.12 + k * 13) % 26);
      ctx.fillRect(Math.round(cx), Math.round(cy), 4, 4);
    }
  }
}

// The default 2D penguin, before it gets pixelated: sweating, ! and ? popping over its head
function drawScene0Hero(ctx, now, esc, quake) {
  const { x, size } = SCENE0_HERO;
  const feet = SCENE0_HERO.feet;
  ensureHero2DSprite();
  const sheet = MOTION_STATE.hero2DSheetLoaded ? MOTION_STATE.hero2DSheet : null;
  // The penguin and its floe only move with the scene's own shake: no extra jitter, hops or bobbing
  const frame = 6; // shocked with a sweat drop
  const top = feet - size + 6;
  ctx.save();
  if (sheet) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(sheet, frame * 256, 0, 256, 256, x - size / 2, top, size, size);
  } else if (MOTION_STATE.hero2DLoaded && MOTION_STATE.hero2DImg) {
    ctx.drawImage(MOTION_STATE.hero2DImg, x - size / 2, top, size, size);
  }
  // Sweat drops flying off
  for (let s = 0; s < 3; s++) {
    const sp = ((now * 0.0022 + s * 0.33) % 1);
    const side = s % 2 ? 1 : -1;
    const sx = x + side * (30 + sp * 26);
    const sy = top + 30 - Math.sin(sp * Math.PI) * 18 + sp * 14;
    ctx.globalAlpha = 1 - sp;
    ctx.fillStyle = SCENE0_K;
    ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 7, 9);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(Math.round(sx), Math.round(sy), 5, 7);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.round(sx) + 1, Math.round(sy) + 1, 2, 2);
  }
  ctx.globalAlpha = 1;
  // ! and ? marks popping in turn
  const markBeat = Math.floor(now / 420) % 2;
  drawScene0Mark(ctx, x - 34, top + 2 - (markBeat ? 6 : 0), '!', '#fb7185');
  drawScene0Mark(ctx, x + 36, top + 8 - (markBeat ? 0 : 6), '?', '#fde047');
  ctx.restore();
}

function drawScene0Mark(ctx, x, y, ch, col) {
  ctx.save();
  ctx.font = '900 26px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 6;
  ctx.strokeStyle = SCENE0_K;
  ctx.strokeText(ch, x, y);
  ctx.fillStyle = col;
  ctx.fillText(ch, x, y);
  ctx.restore();
}

// Hazard banner at the top: "남극 붕괴 경보" with stripes and a stage counter that climbs while you wait
function drawScene0Alarm(ctx, now, esc, finalStage = false) {
  const ak = 1 + (stageUiK() - 1) * 0.4; // 1.24x on phones, from the top centre
  if (ak > 1) {
    ctx.save();
    ctx.translate(480, 9);
    ctx.scale(ak, ak);
    ctx.translate(-480, -9);
  }
  drawScene0AlarmBody(ctx, now, esc, finalStage);
  if (ak > 1) ctx.restore();
}

function drawScene0AlarmBody(ctx, now, esc, finalStage) {
  const ko = CURRENT_LANG === 'ko';
  const on = Math.floor(now / (520 - esc * 260)) % 2 === 0;
  const text = ko ? '남극 붕괴 경보' : i18n('ANTARCTIC COLLAPSE ALERT');
  // Seconds until the pillar takes the penguin (stage 5) instead of an abstract LV: a deadline you can read
  const left = finalStage ? 0 : scene0SecondsLeft(now);
  const sub = ko ? `${left}초` : i18n('{0}s', left);
  const urgent = left <= 10;
  ctx.save();
  ctx.font = '900 26px "Pretendard", "Malgun Gothic", sans-serif';
  const tw = Math.ceil(ctx.measureText(text).width);
  ctx.font = '900 22px "Pretendard", "Malgun Gothic", sans-serif';
  const sw = Math.max(ctx.measureText(ko ? '30초' : i18n('{0}s', 30)).width, ctx.measureText(sub).width) + 18;
  const w = tw + sw + 92;
  const h = 46;
  const bx = Math.round(480 - w / 2);
  const by = 12;
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(bx - 3, by - 3, w + 6, h + 6);
  // Stripes on both ends
  ctx.save();
  ctx.beginPath();
  ctx.rect(bx, by, w, h);
  ctx.clip();
  ctx.fillStyle = on ? '#dc2626' : '#991b1b';
  ctx.fillRect(bx, by, w, h);
  const shift = Math.floor(now / 60) % 20;
  for (const ex of [bx, bx + w - 34]) {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(ex, by, 34, h);
    ctx.fillStyle = SCENE0_K;
    for (let k = -2; k < 5; k++) {
      ctx.beginPath();
      const sx = ex + k * 20 + shift;
      ctx.moveTo(sx, by + h);
      ctx.lineTo(sx + 10, by + h);
      ctx.lineTo(sx + 10 + h * 0.6, by);
      ctx.lineTo(sx + h * 0.6, by);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = '900 26px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.fillStyle = SCENE0_K;
  ctx.fillText(text, bx + 46 + 2, by + h / 2 + 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, bx + 46, by + h / 2 + 1);
  const px = bx + 46 + tw + 10;
  // The last 10 s the box flashes white and the number pops on each second
  const tick = 1 - ((now / 1000) % 1);
  const flash = urgent && Math.floor(now / 250) % 2 === 0;
  ctx.fillStyle = flash ? '#ffffff' : '#facc15';
  ctx.fillRect(px, by + 6, sw, h - 12);
  ctx.fillStyle = SCENE0_K;
  ctx.font = `900 ${urgent ? 22 + Math.round(tick * 4) : 22}px "Pretendard", "Malgun Gothic", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(sub, px + sw / 2, by + h / 2 + 2);
  ctx.restore();
}

// Red alarm vignette, brighter with every stage and on each quake
function drawScene0Vignette(ctx, now, esc, quake) {
  const pulse = 0.5 + 0.5 * Math.sin(now * (0.006 + esc * 0.006));
  const a = (0.1 + esc * 0.16) * (0.55 + 0.45 * pulse) + quake * 0.14;
  const g = ctx.createRadialGradient(480, 270, 200, 480, 270, 600);
  g.addColorStop(0, 'rgba(220, 38, 38, 0)');
  g.addColorStop(1, `rgba(220, 38, 38, ${a.toFixed(3)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 960, 540);
}

// Snow driven sideways, faster as it gets worse
function drawScene0Blizzard(ctx, now, esc) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  const n = 26 + Math.round(esc * 22);
  const speed = 0.12 + esc * 0.2;
  for (let s = 0; s < n; s++) {
    const sx = 960 - ((s * 71 + now * speed * (1 + (s % 3) * 0.4)) % 1000);
    const sy = (s * 43 + now * 0.06 * (1 + (s % 2))) % 540;
    const len = 2 + (s % 3) + esc * 8;
    ctx.fillRect(Math.round(sx), Math.round(sy), Math.round(len), 2);
  }
  ctx.restore();
}

// Bouncing label + arrow over the chosen vehicle
function drawScene0Marker(ctx, now, target, label, accent) {
  const bounce = Math.floor(now / 260) % 2 === 0 ? 0 : -4;
  ctx.save();
  ctx.font = '900 19px "Pretendard", "Malgun Gothic", sans-serif';
  const lw = Math.ceil(ctx.measureText(label).width) + 24;
  const lx = Math.round(target.x - lw / 2);
  const ly = Math.round(target.y - 44 + bounce);
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(lx - 2, ly - 2, lw + 4, 32);
  ctx.fillStyle = accent;
  ctx.fillRect(lx, ly, lw, 28);
  ctx.fillStyle = SCENE0_K;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, target.x, ly + 15);
  const ax = Math.round(target.x);
  const ay = ly + 32;
  ctx.fillRect(ax - 8, ay, 16, 4);
  ctx.fillRect(ax - 6, ay + 4, 12, 4);
  ctx.fillRect(ax - 4, ay + 8, 8, 4);
  ctx.fillStyle = accent;
  ctx.fillRect(ax - 6, ay, 12, 2);
  ctx.fillRect(ax - 4, ay + 4, 8, 2);
  ctx.fillRect(ax - 2, ay + 8, 4, 2);
  ctx.restore();
}

// 4th game in the bottom-right snow corner: a high-detail ice-fishing rod planted firmly in a snow mound
// beside a chiseled glacier fishing hole (no extra penguin—the hero penguin in the middle picks it!)
function drawScene0CornerFisher(ctx, now, isSelected) {
  const f = SCENE0_FISH_SPOT;
  const hx = 762;
  const hy = 500;
  const baseX = 838;
  const baseY = 498;

  // Periodic double-tug bite animation so the bobber dips and the planted rod tip bends down in sync
  const cycle = (now % 2400) / 2400;
  const biteTug =
    cycle > 0.72 && cycle < 0.80
      ? Math.sin(((cycle - 0.72) / 0.08) * Math.PI) * 3.8
      : cycle > 0.84 && cycle < 0.92
      ? Math.sin(((cycle - 0.84) / 0.08) * Math.PI) * 4.5
      : 0;
  const bobDip = Math.sin(now * 0.006) * 1.4 + biteTug + (isSelected ? Math.sin(now * 0.028) * 2.2 : 0);
  const rodFlex = Math.max(0, bobDip) * 1.5 + Math.sin(now * 0.005) * 1.2;

  ctx.save();

  // 1. Chiseled Glacier Ice-Fishing Hole at (hx, hy)
  ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
  ctx.beginPath();
  ctx.ellipse(hx, hy + 2, 37, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(hx, hy, 35, 12.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = SCENE0_K;
  ctx.beginPath();
  ctx.ellipse(hx, hy, 31, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D glacier ice shelf wall thickness
  ctx.fillStyle = '#bae6fd';
  ctx.beginPath();
  ctx.ellipse(hx, hy - 0.5, 28.5, 9.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(hx, hy + 0.8, 27.5, 8.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Deep polar water inside the hole
  ctx.fillStyle = '#082f49';
  ctx.beginPath();
  ctx.ellipse(hx, hy + 1.8, 25.5, 7.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0c4a6e';
  ctx.beginPath();
  ctx.ellipse(hx, hy + 2.1, 21, 5.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.ellipse(hx - 3, hy + 2.3, 13, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chiseled 3D ice chunks around the hole rim
  const iceChunks = [
    [-30, -2, 8, 5],
    [-20, 8, 9, 5],
    [21, 8, 9, 5],
    [29, -1, 7, 5],
  ];
  for (const [cx, cy, cw, ch] of iceChunks) {
    const ix = hx + cx - cw / 2;
    const iy = hy + cy - ch / 2;
    ctx.fillStyle = SCENE0_K;
    ctx.fillRect(ix - 1.5, iy - 1.5, cw + 3, ch + 3);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(ix, iy, cw, ch);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(ix, iy, cw, Math.ceil(ch * 0.55));
  }

  // Concentric expanding water ripples around the bobber
  for (let rIdx = 0; rIdx < 2; rIdx++) {
    const rp = ((now * 0.0014) + rIdx * 0.5) % 1;
    ctx.strokeStyle = `rgba(186, 230, 253, ${(1 - rp) * 0.82})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(hx, hy + 1.5, 5 + rp * 17, 1.3 + rp * 4.2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. High-Detail Red-White-Gold Barrel Bobber in the Ice Hole
  const bx = hx;
  const by = hy - 0.5 + bobDip;
  ctx.fillStyle = 'rgba(8, 47, 73, 0.75)';
  ctx.beginPath();
  ctx.ellipse(bx, by + 5.2, 4.2, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = SCENE0_K;
  ctx.beginPath();
  ctx.arc(bx, by, 6.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(bx, by, 4.6, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(bx, by, 4.6, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.fillRect(bx - 4.6, by - 0.8, 9.2, 1.6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bx - 2.6, by - 3.4, 2.0, 1.6);
  // Tall fluorescent strike antenna sticking up from the bobber
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(bx - 1.5, by - 11, 3.0, 5.8);
  ctx.fillStyle = isSelected || biteTug > 1 ? '#4ade80' : '#fde047';
  ctx.fillRect(bx - 0.75, by - 10.2, 1.5, 4.5);

  if (biteTug > 1.2 || isSelected) {
    ctx.fillStyle = '#bae6fd';
    const spLift = ((now * 0.015) % 1) * 6;
    ctx.fillRect(bx - 9 - spLift * 0.6, by - 2 - spLift, 2.4, 2.4);
    ctx.fillRect(bx + 7 + spLift * 0.6, by - 3 - spLift * 0.8, 2.4, 2.4);
  }

  // 3. Cozy Red Fisherman Tackle Box sitting in the snow beside the planted rod
  const tx = baseX + 34;
  const ty = baseY - 2;
  ctx.fillStyle = 'rgba(9, 13, 26, 0.26)';
  ctx.beginPath();
  ctx.ellipse(tx, ty + 11, 17, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(tx - 14, ty - 5, 28, 16);
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(tx - 12, ty + 1, 24, 8);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(tx - 12, ty - 3.5, 24, 5.5);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(tx - 12, ty + 1, 24, 1.6);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(tx - 6.5, ty, 2.8, 3.2);
  ctx.fillRect(tx + 3.8, ty, 2.8, 3.2);
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(tx - 4.5, ty - 8, 9, 3);
  ctx.fillStyle = '#475569';
  ctx.fillRect(tx - 3, ty - 6.8, 6, 1.5);

  // 4. Packed Snow Mound & Spiked Steel Rod-Holder Tube Planted in the Snow at (baseX, baseY)
  ctx.fillStyle = 'rgba(9, 13, 26, 0.28)';
  ctx.beginPath();
  ctx.ellipse(baseX, baseY + 7, 25, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Back half of packed snow mound
  ctx.fillStyle = SCENE0_K;
  ctx.beginPath();
  ctx.ellipse(baseX, baseY + 2, 21, 9, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.ellipse(baseX, baseY + 2.5, 18.5, 7, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Angled Steel Ice-Spike Rod Holder driven into the snow mound (-28 deg from vertical, leaning left)
  ctx.save();
  ctx.translate(baseX, baseY + 1);
  ctx.rotate(-0.46);
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(-6, -22, 12, 24);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-4.4, -20, 8.8, 20);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-2.0, -20, 2.6, 19);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-4.8, -20.5, 9.6, 3.8);
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(4.0, -14, 4.5, 4.5);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(4.6, -13.2, 3.0, 2.8);
  ctx.restore();

  // Front snow lip overlapping the planted spike base so it looks firmly buried in the snow
  ctx.fillStyle = SCENE0_K;
  ctx.beginPath();
  ctx.ellipse(baseX, baseY + 3.5, 21, 7, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.ellipse(baseX, baseY + 3, 18.5, 5.8, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(baseX - 2, baseY + 1.8, 13, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. Detailed Split-Grip Cork Handle & Gold Reel Seat emerging from the planted tube
  const h0x = baseX - 8;
  const h0y = baseY - 16;
  const h1x = baseX - 21;
  const h1y = baseY - 44;

  // Thick dark outline for the cork grip & reel seat
  ctx.lineCap = 'round';
  ctx.strokeStyle = SCENE0_K;
  ctx.lineWidth = 9.5;
  ctx.beginPath();
  ctx.moveTo(h0x, h0y);
  ctx.lineTo(h1x, h1y);
  ctx.stroke();

  // Warm natural cork base & fore-grip
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6.4;
  ctx.beginPath();
  ctx.moveTo(h0x, h0y);
  ctx.lineTo(h1x, h1y);
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(h0x - 0.8, h0y - 0.8);
  ctx.lineTo(h1x - 0.8, h1y - 0.8);
  ctx.stroke();

  // Matte graphite reel seat in the middle of the handle
  const rs0x = h0x + (h1x - h0x) * 0.30;
  const rs0y = h0y + (h1y - h0y) * 0.30;
  const rs1x = h0x + (h1x - h0x) * 0.72;
  const rs1y = h0y + (h1y - h0y) * 0.72;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6.2;
  ctx.beginPath();
  ctx.moveTo(rs0x, rs0y);
  ctx.lineTo(rs1x, rs1y);
  ctx.stroke();

  // Gold hood rings on both ends of the reel seat + winding check at top of fore-grip
  for (const tRing of [0.28, 0.74, 0.98]) {
    const rx = h0x + (h1x - h0x) * tRing;
    const ry = h0y + (h1y - h0y) * tRing;
    ctx.fillStyle = SCENE0_K;
    ctx.beginPath();
    ctx.arc(rx, ry, 4.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(rx, ry, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Precision Spinning Reel with Anodized Gold Spool & Crank Handle (hanging under the reel seat)
  const reelStemX = (rs0x + rs1x) * 0.5;
  const reelStemY = (rs0y + rs1y) * 0.5;
  const reelX = reelStemX - 10;
  const reelY = reelStemY + 9;

  ctx.strokeStyle = SCENE0_K;
  ctx.lineWidth = 5.0;
  ctx.beginPath();
  ctx.moveTo(reelStemX, reelStemY);
  ctx.lineTo(reelX + 2, reelY - 1);
  ctx.stroke();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2.4;
  ctx.stroke();

  ctx.save();
  ctx.translate(reelX, reelY);
  ctx.rotate(-0.46);
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(-9, -6, 17, 12);
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(0, -4.5, 6.5, 9);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(0.8, -3.5, 4.5, 3.5);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-7.5, -4.5, 7.5, 9);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(-5.8, -3.8, 4.2, 7.6);
  ctx.fillStyle = '#6ee7b7';
  ctx.fillRect(-5.3, -2.8, 3.2, 2.8);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(-7.5, -4.5, 1.6, 9);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(-3.5, 0, 5.5, -Math.PI * 0.75, Math.PI * 0.45);
  ctx.stroke();
  ctx.restore();

  const crankAng = (isSelected ? now * 0.012 : 0.4) + (biteTug > 0 ? Math.sin(now * 0.05) * 0.6 : 0);
  const knobX = reelX + Math.cos(crankAng) * 6.8;
  const knobY = reelY + 2 + Math.sin(crankAng) * 5.0;
  ctx.strokeStyle = SCENE0_K;
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(reelX + 1.5, reelY + 1);
  ctx.lineTo(knobX, knobY);
  ctx.stroke();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.fillStyle = SCENE0_K;
  ctx.beginPath();
  ctx.arc(knobX, knobY, 3.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(knobX, knobY, 2.1, 0, Math.PI * 2);
  ctx.fill();

  // 7. Gracefully Bowed Parabolic Carbon-Bamboo Rod Blank (rises high, then curves down toward the hole!)
  const r0x = h1x;
  const r0y = h1y;
  const rcx = hx + 32;
  const rcy = baseY - 102 + rodFlex * 0.35; // high parabolic apex so the rod visibly bows like a real fishing rod!
  const rodTipX = hx;
  const rodTipY = baseY - 64 + rodFlex;

  const qPt = (t) => {
    const u = 1 - t;
    return {
      x: u * u * r0x + 2 * u * t * rcx + t * t * rodTipX,
      y: u * u * r0y + 2 * u * t * rcy + t * t * rodTipY,
    };
  };

  // Ceramic line-guide rings hanging underneath the arched rod at t = 0.26, 0.54, 0.78, 0.97
  const guideTs = [0.26, 0.54, 0.78, 0.97];
  const guidePoints = guideTs.map((gt) => {
    const p = qPt(gt);
    const drop = gt < 0.4 ? 5.0 : gt < 0.8 ? 4.0 : 2.8;
    return { rx: p.x, ry: p.y, gx: p.x - 1.2, gy: p.y + drop, r: gt < 0.4 ? 2.6 : 2.0 };
  });

  // 8. Taut Braided Fishing Line from Reel Spool -> through all 4 Line Guides -> Rod Tip -> Bobber
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(11, 16, 32, 0.65)';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(reelX - 4, reelY - 2);
  for (const gp of guidePoints) ctx.lineTo(gp.gx, gp.gy);
  ctx.lineTo(rodTipX, rodTipY + 1);
  ctx.lineTo(bx, by - 10);
  ctx.stroke();

  ctx.strokeStyle = isSelected ? '#6ee7b7' : '#f8fafc';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(reelX - 4, reelY - 2);
  for (const gp of guidePoints) ctx.lineTo(gp.gx, gp.gy);
  ctx.lineTo(rodTipX, rodTipY + 1);
  ctx.lineTo(bx, by - 10);
  ctx.stroke();
  ctx.restore();

  // Draw the 4 ceramic line-guide rings
  for (const gp of guidePoints) {
    ctx.strokeStyle = SCENE0_K;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(gp.rx, gp.ry);
    ctx.lineTo(gp.gx, gp.gy);
    ctx.stroke();
    ctx.fillStyle = SCENE0_K;
    ctx.beginPath();
    ctx.arc(gp.gx, gp.gy, gp.r + 1.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(gp.gx, gp.gy, gp.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(gp.gx, gp.gy, Math.max(0.8, gp.r - 0.9), 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw the slender, whippy tapered carbon-bamboo rod blank in 8 segments for a smooth parabolic curve
  const segs = 8;
  for (let s = 0; s < segs; s++) {
    const t0 = s / segs;
    const t1 = (s + 1) / segs;
    const p0 = qPt(t0);
    const p1 = qPt(t1);
    const wOut = 6.8 - s * 0.48;
    const wIn = 3.8 - s * 0.28;
    ctx.lineCap = 'round';
    ctx.strokeStyle = SCENE0_K;
    ctx.lineWidth = wOut;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    // High-visibility fluorescent red-orange strike tip on the last 2 segments; golden bamboo/carbon on the rest
    ctx.strokeStyle = s >= segs - 2 ? '#ef4444' : s % 2 === 0 ? '#f59e0b' : '#fbbf24';
    ctx.lineWidth = wIn;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();

    ctx.strokeStyle = s >= segs - 2 ? '#fecaca' : '#fef08a';
    ctx.lineWidth = Math.max(1.0, wIn * 0.36);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y - 0.6);
    ctx.lineTo(p1.x, p1.y - 0.6);
    ctx.stroke();
  }

  // Decorative crimson & gold thread-wrap node bands along the rod blank
  for (const nt of [0.26, 0.54, 0.78]) {
    const np = qPt(nt);
    ctx.fillStyle = SCENE0_K;
    ctx.fillRect(np.x - 2.4, np.y - 2.4, 4.8, 4.8);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(np.x - 1.6, np.y - 1.6, 3.2, 3.2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(np.x - 0.8, np.y - 1.6, 1.2, 3.2);
  }

  // 9. Twin Brass Bite-Bell (초릿대 쌍방울 딸랑이) clipped near the rod tip
  const bellPt = qPt(0.90);
  const bellJingle = biteTug > 0.5 || isSelected ? Math.sin(now * 0.06) * 1.4 : 0;
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(bellPt.x - 2.2, bellPt.y - 4.5, 4.4, 4.5);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(bellPt.x - 1.3, bellPt.y - 3.6, 2.6, 3.0);
  for (const dx of [-2.8, 2.8]) {
    const bxBell = bellPt.x + dx + bellJingle * 0.5;
    const byBell = bellPt.y - 6.0 - Math.abs(bellJingle) * 0.4;
    ctx.fillStyle = SCENE0_K;
    ctx.beginPath();
    ctx.arc(bxBell, byBell, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(bxBell, byBell, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(bxBell - 1.0, byBell - 1.2, 1.2, 1.2);
  }
  if (biteTug > 0.8 || isSelected) {
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(bellPt.x - 5.5, bellPt.y - 7.5, 3.6, Math.PI * 0.8, Math.PI * 1.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(bellPt.x + 5.5, bellPt.y - 7.5, 3.6, -Math.PI * 0.4, Math.PI * 0.2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawScene0Escape(ctx, now) {
  // First visit: the opening story plays first (opening-scene.js)
  if (drawOpening(ctx, now)) return;
  // Stage 5: left alone too long, the pillar takes the penguin (drawScene0IdleSuck)
  const idle = scene0IdleProgress(now);
  if (idle >= 0.6) {
    drawScene0IdleSuck(ctx, now, idle);
    if (idle >= 1) finishScene0Idle();
    return;
  }
  const esc = scene0Escalation(now);
  const quake = scene0Quake(now);
  const vehicle = MOTION_STATE.vehicle;
  const ko = CURRENT_LANG === 'ko';

  ctx.save();
  // Background drifts gently; each quake is a short hard shake on top
  const mag = 1.2 + quake * (6 + esc * 6);
  ctx.translate(Math.sin(now * 0.045) * 1.2 + (quake ? (Math.random() - 0.5) * mag : 0), Math.cos(now * 0.04) * 0.9 + (quake ? (Math.random() - 0.5) * mag * 0.7 : 0));
  drawRefScene1ChoiceBackground(ctx, now);

  // Cracks across the plateau under the plane and the floe under the car: they only ever grow
  drawScene0Crack(ctx, 250, 302, 0.05, 150, 3, 0.2 + esc);
  drawScene0Crack(ctx, 400, 306, Math.PI - 0.4, 90, 7, esc * 1.3 - 0.2);
  drawScene0Crack(ctx, 820, 372, Math.PI + 0.1, 120, 31, 0.15 + esc);
  drawScene0Crack(ctx, 900, 376, 0.3, 70, 41, esc * 1.2 - 0.3);
  drawScene0FallingIce(ctx, now, esc);
  drawScene0Lead(ctx, now, quake);

  // Vehicles: the chosen one is warmed up (prop turning, smoke up, headlights on)
  const plane = SCENE0_UFO_SPOT;
  const boat = SCENE0_BOAT_SPOT;
  const car = SCENE0_CAR_SPOT;
  const fish = SCENE0_FISH_SPOT;
  const spot = vehicle === 'fish' ? fish : vehicle === 'car' ? car : vehicle === 'boat' ? boat : plane;
  const accent = SCENE0_ACCENT[vehicle] || SCENE0_ACCENT.ufo;
  const pulse = 0.35 + 0.3 * Math.sin(now * 0.01);
  const glowX = spot.x - (vehicle === 'ufo' ? 20 : vehicle === 'fish' ? 24 : 0);
  const g = ctx.createRadialGradient(glowX, spot.y, 6, glowX, spot.y, 130);
  g.addColorStop(0, accent + Math.round(pulse * 140).toString(16).padStart(2, '0'));
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(glowX - 160, spot.y - 110, 320, 220);

  ctx.fillStyle = 'rgba(9, 13, 26, 0.28)';
  ctx.beginPath();
  ctx.ellipse(plane.x + 20 * plane.scale, plane.y + 66 * plane.scale, 60 * plane.scale, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(car.x, car.y + 57 * car.scale, 86 * car.scale, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  const rattle = (k) => (quake ? Math.round(Math.sin(now * 0.12 + k) * 2 * quake) : 0);
  drawPlaneWithPilot(ctx, plane.x, plane.y + rattle(1), plane.tilt, now, { scale: plane.scale, withPilot: false, propSpin: vehicle === 'ufo' });
  drawBoatWithPilot(ctx, boat.x, boat.y + Math.round(Math.sin(now * 0.004) * 1.5) + rattle(2), Math.sin(now * 0.003) * 0.02 + quake * 0.03, now, {
    scale: boat.scale,
    withPilot: false,
    smokeOn: vehicle === 'boat',
  });
  drawCarWithPilot(ctx, car.x, car.y + rattle(3), car.tilt, now, { scale: car.scale, withPilot: false, lightsOn: vehicle === 'car', wheelAngle: 0 });
  drawScene0CornerFisher(ctx, now, vehicle === 'fish');

  // The penguin, front and centre, on a cracking ledge (gone into the pillar once stage 5 starts)
  drawScene0HeroLedge(ctx, now, esc, quake);
  if (idle < 0) drawScene0Hero(ctx, now, esc, quake);
  ctx.restore();

  // Overlays that do not shake with the world
  drawScene0Blizzard(ctx, now, esc);
  drawScene0Vignette(ctx, now, esc, quake);
  drawScene0Alarm(ctx, now, esc, idle >= 0);
  if (idle >= 0) {
    drawScene0IdleSuck(ctx, now, idle);
    return;
  }

  const target =
    vehicle === 'fish'
      ? { x: 874, y: 468 }
      : vehicle === 'car'
      ? { x: car.x - 10, y: car.y - 60 * car.scale - 6 }
      : vehicle === 'boat'
      ? { x: boat.x - 30, y: boat.y - 116 * boat.scale - 4 }
      : { x: plane.x - 20, y: plane.y - 46 * plane.scale - 4 };
  const label =
    vehicle === 'fish'
      ? ko
        ? '얼음낚시'
        : i18n('ICE FISHING')
      : vehicle === 'car'
      ? ko
        ? '자동차'
        : i18n('CAR')
      : vehicle === 'boat'
      ? ko
        ? '쇄빙선'
        : i18n('ICEBREAKER')
      : ko
      ? '경비행기'
      : i18n('PLANE');

  // The penguin's line gets more desperate stage by stage (or cycles through chill B-grade angler lines when 'fish' is picked!)
  const lines =
    vehicle === 'fish'
      ? ko
        ? [
            ['갈 땐 가더라도~', '고래 한 번 정도는 괜찮잖아?'],
            ['탈출은 무슨~ 낚시나 하자!!', '얼음구덩이 손맛이 최고야 ㅋㅋ'],
            ['어차피 무너지는 남극~', '대왕오징어 회나 썰고 가자 ㅋㅋ'],
          ]
        : [
            ['Even if I gotta go~', 'One whale first is fine, right?'],
            ['Forget escaping~ let us fish!!', 'Nothing beats ice fishing lol'],
            ['Antarctica is falling anyway~', 'Some squid sashimi first lol'],
          ]
      : ko
      ? [['으악 남극이 무너진다!!', '뭐 타고 도망가지?!'], ['발밑까지 갈라진다!!', '빨리 하나 골라!!'], ['진짜 끝장이야!!', '아무거나 타!! 지금!!']]
      : [['Antarctica is falling apart!!', 'What do I ride out?!'], ['It is cracking under me!!', 'Pick one, quick!!'], ['This is the end!!', 'Anything!! NOW!!']];
  const stage = Math.min(2, Math.floor(esc * 3));
  drawScene0Shout(ctx, now, lines[stage], vehicle === 'fish' ? '#34d399' : stage === 2 ? '#fb7185' : stage === 1 ? '#fde047' : '#38bdf8', quake);
  drawScene0Marker(ctx, now, target, label, accent);
}

// Big two-line shout right of the penguin's head (the shared speech bubble is too small to read on a phone);
// it never covers the icebreaker behind the penguin
function drawScene0Shout(ctx, now, lines, accent, quake) {
  lines = lines.map((l) => i18n(l)); // English lines -> current language; Korean has no rows and stays
  ctx.save();
  const phone = stageUiK() > 1;
  let sk = 1 + (stageUiK() - 1) * 0.5; // already big: 1.3x on phones is enough
  ctx.font = `900 ${21 * sk}px "Pretendard", "Malgun Gothic", sans-serif`;
  let tw = Math.max(...lines.map((l) => Math.ceil(ctx.measureText(l).width)));
  // Desktop keeps it on the right (its start card covers the bottom left): a long line is set a little smaller
  const roomRight = 960 - 12 - (SCENE0_HERO.x + 84);
  if (!phone && tw + 30 * sk > roomRight) {
    sk *= Math.max(0.8, (roomRight - 30) / tw);
    ctx.font = `900 ${21 * sk}px "Pretendard", "Malgun Gothic", sans-serif`;
    tw = Math.max(...lines.map((l) => Math.ceil(ctx.measureText(l).width)));
  }
  const bw = tw + 30 * sk;
  const bh = 66 * sk;
  const bob = Math.floor(now / 250) % 2 === 0 ? 0 : -2;
  const jx = quake ? Math.round((Math.random() - 0.5) * 6 * quake) : 0;
  // Beside the head, never over it. Phones: right of the face if it fits, otherwise left of it over the empty
  // crevasse ice (the 1.3x text, English most of all, does not fit on the right; the start card is below the
  // stage there, so the left side is free). Pushing it left to fit used to put it on the penguin's face.
  const headL = SCENE0_HERO.x - 70;
  const headR = SCENE0_HERO.x + 84;
  const onRight = !phone || headR + bw <= 960 - 12;
  const bx = (onRight ? headR : Math.max(12, headL - bw)) + jx;
  const by = SCENE0_HERO.feet - SCENE0_HERO.size - 8 + bob;
  ctx.fillStyle = 'rgba(9, 13, 26, 0.42)';
  ctx.fillRect(bx + 5, by + 5, bw, bh);
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(bx - 3, by - 3, bw + 6, bh + 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = accent;
  ctx.fillRect(bx, by, bw, 5);
  // Tail down towards the penguin's beak (left corner when on its right, right corner when on its left)
  const tx = onRight ? bx : bx + bw;
  const d = onRight ? 1 : -1;
  ctx.fillStyle = SCENE0_K;
  ctx.fillRect(tx + d * 4 - (onRight ? 0 : 18), by + bh, 18, 6);
  ctx.fillRect(tx - d * 2 - (onRight ? 0 : 12), by + bh + 6, 12, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(tx + d * 7 - (onRight ? 0 : 12), by + bh - 2, 12, 5);
  ctx.fillRect(tx + d * 1 - (onRight ? 0 : 6), by + bh + 4, 6, 5);
  ctx.fillStyle = SCENE0_K;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(lines[0], bx + 15 * sk, by + 23 * sk);
  ctx.fillText(lines[1], bx + 15 * sk, by + 49 * sk);
  ctx.restore();
}

// ============================================================================
// STAGE 5 — nobody picked anything. Like Sonic CD's idle easter egg (left alone for 3 minutes, Sonic says "I'm
// outta here!" and leaves, game over), the penguin is taken out of the player's hands: the pillar drags it in,
// pixelates it and shoots it up, exactly as it does to the vehicles (scene-pull.js), and it lands in the town as
// if 안 해요 had been pressed — where the locals ask what on earth you were doing.
// It starts SCENE0_IDLE_MS after the scene began and at least SCENE0_IDLE_QUIET_MS after the last input, and only
// while the stage is on screen.
// ============================================================================
const SCENE0_IDLE_MS = 30000;
const SCENE0_IDLE_QUIET_MS = 10000;
const SCENE0_SUCK_MS = 7000;
const SCENE0_PILLAR = { x: 742, y: 250 }; // the beam's middle in bg_ref_vortex (it spans x ~680-805)

// Any input on the page counts as "not idle"; time with the stage off screen does too
function noteScene0Input() {
  MOTION_STATE.scene0LastInput = performance.now();
}
if (typeof window !== 'undefined') {
  ['pointerdown', 'keydown', 'input', 'wheel', 'touchstart'].forEach((ev) => window.addEventListener(ev, noteScene0Input, { passive: true }));
}

function scene0StageVisible() {
  if (typeof document === 'undefined' || document.visibilityState !== 'visible') return false;
  const c = document.getElementById('pixel-stage-canvas');
  if (!c) return false;
  const r = c.getBoundingClientRect();
  return r.bottom > r.height * 0.5 && r.top < window.innerHeight - r.height * 0.5;
}

// Whole seconds left before the pillar takes the penguin: 30 from the start, never less than 10 after any input
// (the same rule scene0IdleProgress fires on), 0 once it has started
function scene0SecondsLeft(now) {
  return Math.ceil(scene0MsLeft(now) / 1000);
}
// The same in ms (audio.js times the alarm by it)
function scene0MsLeft(now) {
  if (MOTION_STATE.scene0IdleStart) return 0;
  const sinceStart = now - MOTION_STATE.sceneStartTime;
  const sinceInput = now - Math.max(MOTION_STATE.sceneStartTime, MOTION_STATE.scene0LastInput || 0);
  return Math.max(SCENE0_IDLE_MS - sinceStart, SCENE0_IDLE_QUIET_MS - sinceInput, 0);
}

// 0..1 through the suck sequence, or -1 while it has not started
function scene0IdleProgress(now) {
  if (MOTION_STATE.scene0IdleStart) return Math.min(1, (now - MOTION_STATE.scene0IdleStart) / SCENE0_SUCK_MS);
  if (!scene0StageVisible()) {
    MOTION_STATE.scene0LastInput = now;
    return -1;
  }
  const sinceStart = now - MOTION_STATE.sceneStartTime;
  const sinceInput = now - Math.max(MOTION_STATE.sceneStartTime, MOTION_STATE.scene0LastInput || 0);
  if (sinceStart >= SCENE0_IDLE_MS && sinceInput >= SCENE0_IDLE_QUIET_MS) {
    MOTION_STATE.scene0IdleStart = now;
    return 0;
  }
  return -1;
}

// The default 2D penguin pulled through the air towards the pillar, flailing and tumbling
function drawScene0FlyingHero(ctx, x, y, size, rot, now) {
  ensureHero2DSprite();
  const sheet = MOTION_STATE.hero2DSheetLoaded ? MOTION_STATE.hero2DSheet : null;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(rot);
  ctx.imageSmoothingEnabled = true;
  if (sheet) ctx.drawImage(sheet, 6 * 256, 0, 256, 256, -size / 2, -size / 2, size, size);
  else if (MOTION_STATE.hero2DLoaded && MOTION_STATE.hero2DImg) ctx.drawImage(MOTION_STATE.hero2DImg, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawScene0PixelHero(ctx, x, y, size, rot, now) {
  const entry = ensureSpeciesSprite('01');
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(rot);
  drawAnimatedPixelPenguin(ctx, entry, -size / 2, -size / 2, size, now, { seed: 0, isWalking: false, forceBlink: Math.floor(now / 300) % 3 === 0 });
  ctx.restore();
}

// r = 0..1: drag (0-0.3), pixel scan in the beam (0.3-0.6), rise up the pillar (0.6-1)
function drawScene0IdleSuck(ctx, now, r) {
  const ko = CURRENT_LANG === 'ko';
  const P = SCENE0_PILLAR;
  if (r >= 0.6) {
    drawScene3Rise(ctx, now, (r - 0.6) / 0.4, 'penguin', '01');
    return;
  }
  const home = { x: SCENE0_HERO.x, y: SCENE0_HERO.feet - SCENE0_HERO.size / 2 + 6 };
  const d = scene3Smooth(Math.min(1, r / 0.3));
  // Arc up and over to the beam, spinning faster as it goes
  const x = home.x + (P.x - home.x) * d;
  const y = home.y + (P.y - home.y) * d - Math.sin(d * Math.PI) * 60 + Math.sin(now * 0.02) * 3 * (1 - d);
  const rot = d < 1 ? Math.sin(now * 0.012) * 0.5 + d * Math.PI * 2 : Math.sin(now * 0.004) * 0.12;
  const size = 140 - d * 36;
  // From the pillar on the right (not scene 4's default, which sits on the plane here)
  drawScene3Ribbons(ctx, x, y, Math.min(1, r / 0.12), SCENE0_PILLAR, -28);
  if (r < 0.3) {
    drawScene0FlyingHero(ctx, x, y, size, rot, now);
  } else {
    // Pixel scan: the 2D penguin breaks into mosaic blocks below the line, clean pixel penguin above it
    const s = (r - 0.3) / 0.3;
    const top = y - size / 2;
    const scanY = top + s * size;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - size, top - 20, size * 2, scanY - top + 20);
    ctx.clip();
    drawScene0PixelHero(ctx, x, y, size, rot, now);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(x - size, scanY, size * 2, size);
    ctx.clip();
    drawScene3Mosaic(ctx, 1 + Math.floor(s * 7), (c) => drawScene0FlyingHero(c, x, y, size, rot, now));
    ctx.restore();
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x - size * 0.7, scanY - 4, size * 1.4, 8);
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(x - size * 0.7 + 2, scanY - 2, size * 1.4 - 4, 4);
    for (let k = 0; k < 12; k++) {
      const kx = Math.round(x - size * 0.6 + k * (size * 1.2 / 11));
      const ky = Math.round(scanY + Math.sin(now * 0.032 + k * 1.35) * 8);
      ctx.fillStyle = SCENE0_K;
      ctx.fillRect(kx - 4, ky - 4, 8, 8);
      ctx.fillStyle = k % 3 === 0 ? '#ffffff' : k % 2 ? '#f472b6' : '#67e8f9';
      ctx.fillRect(kx - 3, ky - 3, 6, 6);
    }
  }
  const line =
    r < 0.12
      ? ko
        ? ['어어?! 몸이 떠오른다?!', '아무거나 누르라고 했잖아아!!']
        : ['Huh?! I am floating?!', 'I TOLD you to press something!!']
      : r < 0.3
      ? ko
        ? ['으아아악 아무도 안 눌러?!', '나 지금 빨려간다고오오!!']
        : ['AAAAH nobody pressed anything?!', 'I am getting sucked in!!']
      : ko
      ? ['탈 것도 없이 맨몸으로 도트화...', '이게 무슨 B급 엔딩이야!!']
      : ['Pixelated with no ride at all...', 'What kind of B-movie ending is this!!'];
  drawScene0Shout(ctx, now, line, '#a78bfa', 0);
}

function finishScene0Idle() {
  MOTION_STATE.scene0IdleStart = 0;
  skipEscapeToCherryBlossomTown();
  MOTION_STATE.idleSucked = true; // after the switch to scene 5, which clears it for every other way in
}

// Which vehicle a click on the scene 1 picture picks (null = none)
function scene0VehicleAt(mx, my) {
  const f = SCENE0_FISH_SPOT;
  if (mx >= f.holeX - 42 && mx <= f.x + 60 && my >= f.y - 72 && my <= f.holeY + 26) return 'fish';
  const c = SCENE0_CAR_SPOT;
  if (mx >= c.x - 110 * c.scale && mx <= c.x + 110 * c.scale && my >= c.y - 80 * c.scale && my <= c.y + 60 * c.scale) return 'car';
  const b = SCENE0_BOAT_SPOT;
  if (mx >= b.x - 155 * b.scale && mx <= b.x + 155 * b.scale && my >= b.y - 120 * b.scale && my <= b.y + 50 * b.scale) return 'boat';
  const p = SCENE0_UFO_SPOT;
  if (mx >= p.x - 115 * p.scale && mx <= p.x + 120 * p.scale && my >= p.y - 50 * p.scale && my <= p.y + 70 * p.scale) return 'ufo';
  return null;
}
