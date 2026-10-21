// ============================================================================
// LIGHT PLANE (경비행기) — replaces the UFO. A super-deformed ("egg plane") open-cockpit trainer:
// real low-wing open-cockpit layout (Ryan ST) squeezed to toy proportions like Hasegawa's Egg Plane
// kits, so it sits next to the car at the same size (about 1.6:1 with the pilot). Same mint / hot-pink
// paint as the car; polar orange only on the fin and wing tip; skis for the ice. Nothing above the
// pilot: the NFT penguin rides in the cockpit at the car driver's size.
// Origin = cockpit rim under the pilot, facing right; skis touch y = +66.
// ============================================================================
const PLANE_CFG = {
  SKI_BOTTOM: 66,
};
const PLANE_K = '#0b1020';
const PLANE_PILOT_RECT = { x: -40, y: -74, size: 79 }; // same size as the car's driver

function tracePlaneBody(ctx) {
  ctx.beginPath();
  ctx.moveTo(-98, 14);
  ctx.quadraticCurveTo(-72, -8, -34, -1);
  ctx.lineTo(34, 0);
  ctx.quadraticCurveTo(74, -2, 94, 14);
  ctx.quadraticCurveTo(108, 27, 94, 40);
  ctx.quadraticCurveTo(44, 52, -18, 45);
  ctx.quadraticCurveTo(-72, 38, -98, 14);
  ctx.closePath();
}

function traceTailFin(ctx) {
  ctx.beginPath();
  ctx.moveTo(-58, 2);
  ctx.lineTo(-80, -38);
  ctx.quadraticCurveTo(-90, -52, -102, -42);
  ctx.lineTo(-100, 12);
  ctx.closePath();
}

function drawPlaneCargo(ctx, pixelMode) {
  // Behind the pilot on the tail deck, like the car's rear deck
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  if (INTRO_TOWN.id === 'xmas') {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-66, -18, 20, 15);
    if (!pixelMode) ctx.strokeRect(-66, -18, 20, 15);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-58, -18, 4, 15);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-62, -28, 13, 10);
    if (!pixelMode) ctx.strokeRect(-62, -28, 13, 10);
  } else {
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-68, -18, 24, 14);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-65, -15, 7, 7);
    ctx.fillRect(-54, -15, 7, 7);
  }
}

function drawPlanePropeller(ctx, now, spinning, pixelMode) {
  const px = 110;
  const py = 27;
  if (spinning) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.32)';
    if (pixelMode) {
      ctx.fillRect(px - 2, py - 38, 4, 76);
    } else {
      ctx.beginPath();
      ctx.ellipse(px, py, 3.5, 38, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const L = Math.abs(Math.cos(now * 0.09)) * 37;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
    ctx.fillRect(px - 1.5, py - L, 3, L * 2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px - 1.5, py - L, 3, 4);
    ctx.fillRect(px - 1.5, py + L - 4, 3, 4);
  } else {
    ctx.fillStyle = '#334155';
    ctx.fillRect(px - 2, py - 32, 4, 32);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-0.5);
    ctx.fillRect(-2, 0, 4, 28);
    ctx.restore();
  }
  // Pink spinner, like the car's wheel caps
  ctx.fillStyle = '#f472b6';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(101, py - 9);
  ctx.quadraticCurveTo(117, py - 2, 116, py);
  ctx.quadraticCurveTo(117, py + 2, 101, py + 9);
  ctx.closePath();
  ctx.fill();
  if (!pixelMode) ctx.stroke();
}

// Smooth 2D plane (scenes 1–3)
function drawPlaneWithPilot(ctx, cx, cy, tiltRad = 0, now = 0, options = {}) {
  const {
    scale = 1,
    withPilot = true,
    spId = UFO_GAME.pilotSpeciesId || '01',
    isShocked = false,
    isImpactBlink = false,
    propSpin = true,
    pilotLift = 0,
  } = options;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Ski legs + fat skis, tail skid
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(4, 44);
  ctx.lineTo(10, 62);
  ctx.moveTo(36, 44);
  ctx.lineTo(32, 62);
  ctx.moveTo(-86, 32);
  ctx.lineTo(-92, 42);
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-14, 60);
  ctx.lineTo(54, 60);
  ctx.quadraticCurveTo(64, 59, 66, 52);
  ctx.lineTo(68, 53);
  ctx.quadraticCurveTo(66, 66, 54, 66);
  ctx.lineTo(-14, 66);
  ctx.quadraticCurveTo(-18, 63, -14, 60);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-10, 62, 60, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-102, 41, 20, 3);

  // Far-side stabiliser
  ctx.fillStyle = '#14b8a6';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-112, 10, 34, 9, 4);
  ctx.fill();
  ctx.stroke();

  // Tail fin: mint with a polar-orange top
  traceTailFin(ctx);
  ctx.fillStyle = '#2dd4bf';
  ctx.fill();
  ctx.save();
  traceTailFin(ctx);
  ctx.clip();
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-110, -60, 50, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-110, -36, 50, 3);
  ctx.restore();
  traceTailFin(ctx);
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Seat back, pilot and cargo
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(-36, -30, 12, 32, 4);
  ctx.fill();
  if (withPilot) {
    drawCarPilot(ctx, false, now, {
      spId,
      isShocked,
      isImpactBlink,
      lift: pilotLift,
      rect: PLANE_PILOT_RECT,
      clip: (c) => c.rect(-70, -140, 140, 142),
    });
  }
  drawPlaneCargo(ctx, false);

  // Egg body: mint paint, white pinstripe, hot-pink band, silver cowling
  tracePlaneBody(ctx);
  const paint = ctx.createLinearGradient(0, -4, 0, 48);
  paint.addColorStop(0, '#a7f3e8');
  paint.addColorStop(0.4, '#2dd4bf');
  paint.addColorStop(1, '#0f766e');
  ctx.fillStyle = paint;
  ctx.fill();
  ctx.save();
  tracePlaneBody(ctx);
  ctx.clip();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(-110, 24, 230, 1.8);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-110, 27, 230, 8);
  ctx.fillStyle = '#be185d';
  ctx.fillRect(-110, 35, 230, 2);
  const cowl = ctx.createLinearGradient(0, 0, 0, 46);
  cowl.addColorStop(0, '#f8fafc');
  cowl.addColorStop(0.5, '#94a3b8');
  cowl.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = cowl;
  ctx.fillRect(70, -6, 50, 56);
  ctx.fillStyle = 'rgba(11, 16, 32, 0.35)';
  ctx.fillRect(70, -6, 2, 56);
  ctx.restore();
  tracePlaneBody(ctx);
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-60, 6);
  ctx.quadraticCurveTo(-40, 3, -30, 4);
  ctx.moveTo(40, 4);
  ctx.lineTo(64, 6);
  ctx.stroke();
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.roundRect(-38, -2, 76, 5, 2.5);
  ctx.fill();
  drawPixelHeart(ctx, -54, 16, 1.6, '#f472b6');
  ctx.fillStyle = '#334155';
  [76, 84].forEach((x) => ctx.fillRect(x, 40, 5, 3));

  // Windscreen
  ctx.fillStyle = 'rgba(186, 230, 253, 0.42)';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(36, 0);
  ctx.lineTo(50, -2);
  ctx.lineTo(45, -22);
  ctx.lineTo(39, -22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Stubby low wing (near side) with an orange tip and nav light
  const wing = ctx.createLinearGradient(0, 32, 0, 46);
  wing.addColorStop(0, '#ffffff');
  wing.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = wing;
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(-16, 33, 70, 13, 6.5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.roundRect(-16, 33, 15, 13, [6.5, 0, 0, 6.5]);
  ctx.fill();
  ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? '#22c55e' : '#14532d';
  ctx.fillRect(47, 37, 3, 3);

  drawPlanePropeller(ctx, now, propSpin, false);
  ctx.restore();
}

function fillPlanePixelEllipse(ctx, cx, cy, rx, ry, color) {
  ctx.fillStyle = color;
  for (let y = -ry; y < ry; y += 2) {
    const yy = y + 1;
    const half = Math.round((rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))) / 2) * 2;
    if (half > 0) ctx.fillRect(cx - half, cy + y, half * 2, 2);
  }
}

// 16-bit pixel plane (scenes 3–5)
function drawPixelPlaneWithPilot(ctx, cx, cy, tiltRad = 0, now = 0, options = {}) {
  const {
    scale = 1,
    spId = UFO_GAME.pilotSpeciesId || '01',
    forceBlink = false,
    isShocked = false,
    showSmoke = false,
    propSpin = true,
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
      const sx = Math.round((84 + sp * 16) / 4) * 4;
      const sy = Math.round((-4 - sp * 34) / 4) * 4;
      const sz = s % 2 === 0 ? 8 : 6;
      ctx.fillStyle = s % 2 === 0 ? 'rgba(100, 116, 139, 0.75)' : 'rgba(250, 204, 21, 0.72)';
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  // Skis, legs, tail skid
  ctx.fillStyle = '#334155';
  ctx.fillRect(6, 44, 4, 18);
  ctx.fillRect(32, 44, 4, 18);
  ctx.fillRect(-90, 32, 4, 10);
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-16, 58, 72, 10);
  ctx.fillRect(56, 52, 8, 8);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-14, 60, 68, 6);
  ctx.fillRect(56, 54, 6, 6);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-10, 62, 60, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-102, 40, 20, 4);

  // Stabiliser + stepped fin
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-114, 8, 38, 13);
  ctx.fillStyle = '#14b8a6';
  ctx.fillRect(-112, 10, 34, 9);
  const fin = [
    [-100, -46, 12, 10],
    [-100, -36, 18, 12],
    [-100, -24, 26, 14],
    [-100, -10, 36, 14],
  ];
  ctx.fillStyle = PLANE_K;
  fin.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#2dd4bf';
  fin.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-100, -46, 12, 10);
  ctx.fillRect(-100, -36, 18, 4);

  // Seat, pilot, cargo
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-38, -32, 16, 34);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-36, -30, 12, 30);
  drawCarPilot(ctx, true, now, {
    spId,
    isShocked,
    isImpactBlink: forceBlink,
    lift: pilotLift,
    rect: PLANE_PILOT_RECT,
    clip: (c) => c.rect(-70, -140, 140, 142),
  });
  drawPlaneCargo(ctx, true);

  // Egg body
  fillPlanePixelEllipse(ctx, 2, 22, 102, 26, PLANE_K);
  fillPlanePixelEllipse(ctx, 2, 22, 98, 23, '#2dd4bf');
  ctx.fillStyle = '#99f6e4';
  ctx.fillRect(-60, 2, 120, 4);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-88, 24, 172, 2);
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(-90, 26, 176, 8);
  ctx.fillStyle = '#be185d';
  ctx.fillRect(-84, 34, 164, 2);
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(-70, 38, 140, 4);
  fillPlanePixelEllipse(ctx, 86, 22, 16, 22, '#cbd5e1');
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(76, 4, 14, 6);
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(-38, -2, 76, 4);
  drawPixelHeart(ctx, -54, 16, 2, '#f472b6');

  // Windscreen
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(36, -22, 12, 22);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(38, -20, 8, 18);

  // Stubby wing
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-18, 31, 74, 17);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-16, 33, 70, 13);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-16, 43, 70, 3);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(-16, 33, 14, 13);
  ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? '#22c55e' : '#14532d';
  ctx.fillRect(46, 37, 4, 4);

  drawPlanePropeller(ctx, now, propSpin, true);
  ctx.restore();
}

// Storm cell (replaces the spiked mine): dark cloud with a lightning flicker; hit radius = ent.r
function drawStormCloud(ctx, r, now, seed = 0) {
  ctx.save();
  const puffs = [
    [-0.55, 0.15, 0.6],
    [0, -0.2, 0.75],
    [0.55, 0.12, 0.6],
    [0.1, 0.35, 0.55],
    [-0.25, 0.4, 0.5],
  ];
  ctx.fillStyle = '#0f172a';
  puffs.forEach(([px, py, pr]) => {
    ctx.beginPath();
    ctx.arc(px * r, py * r, pr * r + 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  const g = ctx.createLinearGradient(0, -r, 0, r);
  g.addColorStop(0, '#64748b');
  g.addColorStop(1, '#1e293b');
  ctx.fillStyle = g;
  puffs.forEach(([px, py, pr]) => {
    ctx.beginPath();
    ctx.arc(px * r, py * r, pr * r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.arc(-0.1 * r, -0.45 * r, 0.3 * r, 0, Math.PI * 2);
  ctx.fill();
  if (Math.floor((now + seed * 97) / 120) % 5 === 0) {
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = PLANE_K;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0.05 * r, 0.3 * r);
    ctx.lineTo(-0.2 * r, 0.85 * r);
    ctx.lineTo(0, 0.8 * r);
    ctx.lineTo(-0.15 * r, 1.3 * r);
    ctx.lineTo(0.25 * r, 0.65 * r);
    ctx.lineTo(0.05 * r, 0.68 * r);
    ctx.lineTo(0.2 * r, 0.3 * r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

// SCENE 2 — take-off run on skis across the cracking ice, then climb out
function drawPlaneScene1Takeoff(ctx, now, p, spId) {
  const S = 0.95;
  const climb = p > 0.45 ? (p - 0.45) / 0.55 : 0;
  const x = 120 + p * 420;
  const groundY = 300;
  const y = groundY - PLANE_CFG.SKI_BOTTOM * S - climb * climb * 150 - Math.abs(Math.sin(now * 0.03)) * 2 * (1 - climb);
  const tilt = -0.02 - climb * 0.22;

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  for (let i = 0; i < 20; i++) {
    const ly = 60 + ((i * 53) % 420);
    const len = 90 + ((i * 37) % 160);
    const lx = 960 - ((now * (0.8 + (i % 4) * 0.25) + i * 211) % 1260);
    ctx.lineWidth = i % 3 === 0 ? 3 : 1.6;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + len, ly);
    ctx.stroke();
  }
  // Prop wash snow spray while the skis are still on the ice
  if (climb < 0.5) {
    for (let t = 0; t < 12; t++) {
      const tp = (now * 0.004 + t * 0.083) % 1;
      const tx = x - 40 * S - tp * 170 + Math.sin(t * 2.1) * 10;
      const ty = groundY - 6 - Math.sin(tp * Math.PI) * 36;
      const sz = Math.max(4, Math.round((1 - tp) * 11));
      ctx.fillStyle = PLANE_K;
      ctx.fillRect(tx - 1, ty - 1, sz + 2, sz + 2);
      ctx.fillStyle = t % 3 === 0 ? '#bae6fd' : '#f8fafc';
      ctx.fillRect(tx, ty, sz, sz);
    }
    ctx.fillStyle = 'rgba(9, 13, 26, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x - 20, groundY + 2, 130 * (1 - climb), 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  drawPlaneWithPilot(ctx, x, y, tilt, now, { scale: S, spId });

  drawRetroSpeechBubble(
    ctx,
    Math.min(520, x + 10),
    Math.max(64, y - 96),
    CURRENT_LANG === 'ko' ? '야야 남극 깨진다!! 스로틀 끝까지, 이륙한다 꽉 잡아!!' : 'Antarctica is cracking!! Full throttle, rotate, hold on!!',
    '#fb923c',
    now
  );
}
