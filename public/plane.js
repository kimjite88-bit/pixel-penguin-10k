// ============================================================================
// LIGHT PLANE (경비행기) — replaces the UFO. An open-cockpit, low-wing, two-seat tandem trainer in the
// Ryan ST layout (open cockpits in tandem, wing under the fuselage), so nothing sits above the penguin:
// the NFT pilot rides in the rear cockpit from the waist up like the car's driver. Polar touches:
// skis instead of wheels and a high-visibility orange livery (open-cockpit Gipsy Moths and the Auster
// Antarctic flew in Antarctica). No guns: storms have to be flown around.
// Origin = rear cockpit rim under the pilot, facing right; skis touch y = +51.
// ============================================================================
const PLANE_CFG = {
  SKI_BOTTOM: 51,
  // Hit shapes (local units): ellipse around fuselage + wing, circle around the pilot's head and chest
  HIT_CX: -2,
  HIT_CY: 6,
  HIT_RX: 150,
  HIT_RY: 20,
  PILOT_CX: 0,
  PILOT_CY: -34,
  PILOT_R: 30,
};
const PLANE_K = '#0b1020';
const PLANE_PILOT_RECT = { x: -40, y: -74, size: 79 }; // same size as the car's driver

function tracePlaneFuselage(ctx) {
  ctx.beginPath();
  ctx.moveTo(138, -14);
  ctx.quadraticCurveTo(150, -12, 152, -1);
  ctx.quadraticCurveTo(150, 12, 138, 15);
  ctx.lineTo(60, 22);
  ctx.lineTo(-40, 20);
  ctx.lineTo(-150, 4);
  ctx.lineTo(-157, 0);
  ctx.lineTo(-155, -8);
  ctx.lineTo(-70, -6);
  // Headrest fairing behind the rear cockpit
  ctx.quadraticCurveTo(-60, -20, -42, -4);
  ctx.lineTo(-38, 0);
  ctx.lineTo(38, 0);
  ctx.lineTo(54, -4);
  ctx.lineTo(128, -14);
  ctx.closePath();
}

function drawPlaneFrontCargo(ctx, pixelMode) {
  // Front cockpit carries the season's load (gifts in winter, a duffel otherwise)
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  if (INTRO_TOWN.id === 'xmas') {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(72, -22, 20, 18);
    if (!pixelMode) ctx.strokeRect(72, -22, 20, 18);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(80, -22, 4, 18);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(76, -34, 13, 12);
    if (!pixelMode) ctx.strokeRect(76, -34, 13, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(81, -34, 3, 12);
  } else {
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(70, -20, 26, 16);
    if (!pixelMode) ctx.strokeRect(70, -20, 26, 16);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(70, -14, 26, 3);
  }
}

function drawPlanePropeller(ctx, now, spinning, pixelMode) {
  const px = 157;
  if (spinning) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.32)';
    if (pixelMode) {
      ctx.fillRect(px - 2, -46, 4, 92);
    } else {
      ctx.beginPath();
      ctx.ellipse(px, 0, 3.5, 47, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Blade seen edge-on: its visible length follows the rotation
    const L = Math.abs(Math.cos(now * 0.09)) * 46;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
    ctx.fillRect(px - 1.5, -L, 3, L * 2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px - 1.5, -L, 3, 4);
    ctx.fillRect(px - 1.5, L - 4, 3, 4);
  } else {
    // Stopped after the crash landing: one blade bent back
    ctx.fillStyle = '#334155';
    ctx.fillRect(px - 2, -40, 4, 40);
    ctx.save();
    ctx.translate(px, 0);
    ctx.rotate(-0.5);
    ctx.fillRect(-2, 0, 4, 36);
    ctx.restore();
  }
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(151, -9);
  ctx.quadraticCurveTo(165, -2, 164, 0);
  ctx.quadraticCurveTo(165, 2, 151, 9);
  ctx.closePath();
  ctx.fill();
  if (!pixelMode) ctx.stroke();
}

function drawPlaneSkis(ctx) {
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(30, 22);
  ctx.lineTo(40, 46);
  ctx.moveTo(56, 22);
  ctx.lineTo(50, 46);
  ctx.moveTo(-146, 2);
  ctx.lineTo(-148, 12);
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(8, 46);
  ctx.lineTo(80, 46);
  ctx.quadraticCurveTo(90, 45, 92, 38);
  ctx.lineTo(94, 39);
  ctx.quadraticCurveTo(92, 51, 80, 51);
  ctx.lineTo(8, 51);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(12, 47.5, 64, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-160, 12, 24, 3);
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

  drawPlaneSkis(ctx);

  // Far-side stabiliser
  ctx.fillStyle = '#c2410c';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-170, -3, 50, 7, 3);
  ctx.fill();
  ctx.stroke();

  // Seat back, pilot (waist hidden by the cockpit rim) and the front-cockpit load
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(-34, -30, 12, 32, 4);
  ctx.fill();
  if (withPilot) {
    drawCarPilot(ctx, false, now, {
      spId,
      isShocked,
      isImpactBlink,
      lift: pilotLift,
      rect: PLANE_PILOT_RECT,
      clip: (c) => c.rect(-70, -140, 140, 143),
    });
  }
  drawPlaneFrontCargo(ctx, false);

  // Fuselage: orange top, white belly, navy cheat line, polished cowling
  tracePlaneFuselage(ctx);
  const paint = ctx.createLinearGradient(0, -20, 0, 22);
  paint.addColorStop(0, '#fb923c');
  paint.addColorStop(0.6, '#ea580c');
  paint.addColorStop(1, '#c2410c');
  ctx.fillStyle = paint;
  ctx.fill();
  ctx.save();
  tracePlaneFuselage(ctx);
  ctx.clip();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-170, 9, 330, 16);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-170, 5, 330, 4);
  const cowl = ctx.createLinearGradient(0, -16, 0, 16);
  cowl.addColorStop(0, '#f1f5f9');
  cowl.addColorStop(0.5, '#94a3b8');
  cowl.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = cowl;
  ctx.fillRect(110, -20, 50, 40);
  ctx.strokeStyle = 'rgba(11, 16, 32, 0.4)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(110, -20);
  ctx.lineTo(110, 20);
  ctx.moveTo(126, -18);
  ctx.lineTo(126, 18);
  ctx.stroke();
  ctx.restore();
  tracePlaneFuselage(ctx);
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.4;
  ctx.stroke();
  // Cockpit rims, exhaust stubs, letters
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.roundRect(-40, -2, 80, 5, 2.5);
  ctx.roundRect(64, -10, 36, 5, 2.5);
  ctx.fill();
  ctx.fillStyle = '#334155';
  [116, 124, 132].forEach((x) => ctx.fillRect(x, 8, 5, 3));
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 11px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PPENG', -102, 0);
  drawPixelHeart(ctx, -66, 12, 1.5, '#f472b6');

  // Small windscreens in front of each cockpit
  ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 1.8;
  [
    [36, 0, 50, -3, 44, -22, 38, -22],
    [100, -11, 110, -13, 106, -28, 100, -28],
  ].forEach(([x1, y1, x2, y2, x3, y3, x4, y4]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Tail fin with rudder line
  ctx.fillStyle = '#ea580c';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-116, -4);
  ctx.lineTo(-142, -52);
  ctx.lineTo(-158, -52);
  ctx.lineTo(-157, -4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-156, -46, 14, 6);
  ctx.strokeStyle = 'rgba(11, 16, 32, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-148, -50);
  ctx.lineTo(-144, -6);
  ctx.stroke();

  // Low wing under the fuselage (near side), orange tip band, nav light
  const wing = ctx.createLinearGradient(0, 14, 0, 28);
  wing.addColorStop(0, '#ffffff');
  wing.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = wing;
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-20, 16);
  ctx.lineTo(84, 14);
  ctx.quadraticCurveTo(98, 16, 98, 21);
  ctx.quadraticCurveTo(96, 27, 84, 27);
  ctx.lineTo(-16, 26);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-14, 18, 14, 7);
  ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? '#22c55e' : '#14532d';
  ctx.fillRect(92, 19, 3, 3);

  drawPlanePropeller(ctx, now, propSpin, false);
  ctx.restore();
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
      const sx = Math.round((126 + sp * 16) / 4) * 4;
      const sy = Math.round((-20 - sp * 34) / 4) * 4;
      const sz = s % 2 === 0 ? 8 : 6;
      ctx.fillStyle = s % 2 === 0 ? 'rgba(100, 116, 139, 0.75)' : 'rgba(250, 204, 21, 0.72)';
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  // Skis + legs
  ctx.fillStyle = '#334155';
  ctx.fillRect(34, 22, 4, 24);
  ctx.fillRect(52, 22, 4, 24);
  ctx.fillRect(-148, 2, 3, 10);
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(6, 44, 78, 8);
  ctx.fillRect(84, 38, 8, 8);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(8, 46, 74, 4);
  ctx.fillRect(84, 40, 6, 6);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(12, 48, 64, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-160, 12, 24, 4);

  // Stabiliser
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-172, -4, 54, 10);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-170, -2, 50, 6);

  // Seat, pilot, front load
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-36, -32, 16, 34);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-34, -30, 12, 30);
  drawCarPilot(ctx, true, now, {
    spId,
    isShocked,
    isImpactBlink: forceBlink,
    lift: pilotLift,
    rect: PLANE_PILOT_RECT,
    clip: (c) => c.rect(-70, -140, 140, 143),
  });
  drawPlaneFrontCargo(ctx, true);

  // Fuselage blocks (stepped taper)
  const body = [
    [-38, 0, 92, 22],
    [54, -6, 56, 28],
    [110, -14, 42, 30],
    [-80, -4, 42, 22],
    [-120, -2, 40, 18],
    [-156, -6, 36, 12],
    [-66, -14, 22, 10],
  ];
  ctx.fillStyle = PLANE_K;
  body.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#ea580c';
  body.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#fb923c';
  body.forEach(([x, y, w]) => ctx.fillRect(x, y, w, 3));
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(110, -14, 42, 30);
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(110, -14, 42, 6);
  ctx.fillStyle = '#f8fafc';
  [
    [-38, 10, 92, 12],
    [54, 10, 56, 12],
    [-80, 10, 42, 8],
    [-120, 8, 40, 4],
  ].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-150, 6, 260, 4);
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(-40, -2, 80, 4);
  ctx.fillRect(64, -10, 36, 4);
  drawPixelHeart(ctx, -66, 12, 2, '#f472b6');

  // Windscreens
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(36, -22, 12, 22);
  ctx.fillRect(100, -28, 10, 18);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(38, -20, 8, 18);
  ctx.fillRect(102, -26, 6, 14);

  // Tail fin (stepped)
  const fin = [
    [-158, -52, 16, 10],
    [-157, -42, 24, 12],
    [-157, -30, 32, 14],
    [-156, -16, 40, 12],
  ];
  ctx.fillStyle = PLANE_K;
  fin.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#ea580c';
  fin.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-156, -48, 12, 4);

  // Low wing
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-22, 14, 122, 14);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-20, 16, 118, 10);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-20, 24, 118, 2);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-20, 16, 16, 10);
  ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? '#22c55e' : '#14532d';
  ctx.fillRect(92, 18, 4, 4);

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

// Hit test: entity circle against the fuselage/wing ellipse or the pilot's circle (tilt ignored)
function planeHits(px, py, s, ex, ey, er) {
  const dx = (ex - (px + PLANE_CFG.HIT_CX * s)) / (PLANE_CFG.HIT_RX * s + er);
  const dy = (ey - (py + PLANE_CFG.HIT_CY * s)) / (PLANE_CFG.HIT_RY * s + er);
  if (dx * dx + dy * dy <= 1) return true;
  return Math.hypot(ex - (px + PLANE_CFG.PILOT_CX * s), ey - (py + PLANE_CFG.PILOT_CY * s)) <= PLANE_CFG.PILOT_R * s + er;
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
