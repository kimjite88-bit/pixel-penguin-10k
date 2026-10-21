// ============================================================================
// LIGHT PLANE (경비행기) — replaces the UFO. Modelled on real polar light aircraft: a single-engine,
// high-wing, strut-braced plane on skis (the Auster Antarctic flew the 1956 Commonwealth Trans-Antarctic
// Expedition on skis; Twin Otters and Baslers still fly the continent on skis) in a high-visibility
// orange livery that stands out against snow. No guns: storms and birds have to be flown around.
// Origin = pilot seat (side window), facing right; skis touch y = +45.
// ============================================================================
const PLANE_CFG = {
  SKI_BOTTOM: 45,
  HIT_CX: -28, // hit ellipse (local units) around fuselage + wing
  HIT_CY: -8,
  HIT_RX: 118,
  HIT_RY: 30,
};
const PLANE_K = '#0b1020';

function tracePlaneFuselage(ctx) {
  ctx.beginPath();
  ctx.moveTo(84, -16);
  ctx.quadraticCurveTo(95, -14, 97, -1);
  ctx.quadraticCurveTo(95, 12, 84, 14);
  ctx.lineTo(40, 18);
  ctx.lineTo(-40, 16);
  ctx.lineTo(-150, 0);
  ctx.lineTo(-157, -4);
  ctx.lineTo(-155, -12);
  ctx.lineTo(-50, -32);
  ctx.lineTo(-40, -36);
  ctx.lineTo(14, -36);
  ctx.lineTo(40, -18);
  ctx.closePath();
}

function tracePlaneWindow(ctx) {
  ctx.moveTo(-38, -32);
  ctx.lineTo(10, -32);
  ctx.lineTo(31, -18);
  ctx.lineTo(31, -6);
  ctx.lineTo(-38, -6);
  ctx.closePath();
}

const PLANE_PILOT_RECT = { x: -32, y: -44, size: 60 };

function drawPlanePropeller(ctx, now, spinning, pixelMode) {
  const px = 101;
  if (spinning) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.32)';
    if (pixelMode) {
      ctx.fillRect(px - 2, -44, 4, 88);
    } else {
      ctx.beginPath();
      ctx.ellipse(px, 0, 3.5, 45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Blade seen edge-on: its visible length follows the rotation
    const a = now * 0.09;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
    const L = Math.abs(Math.cos(a)) * 44;
    ctx.fillRect(px - 1.5, -L, 3, L * 2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px - 1.5, -L, 3, 4);
    ctx.fillRect(px - 1.5, L - 4, 3, 4);
  } else {
    // Stopped (after the crash): one blade bent back
    ctx.fillStyle = '#334155';
    ctx.fillRect(px - 2, -38, 4, 38);
    ctx.save();
    ctx.translate(px, 0);
    ctx.rotate(-0.5);
    ctx.fillRect(-2, 0, 4, 34);
    ctx.restore();
  }
  // Spinner
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(95, -8);
  ctx.quadraticCurveTo(108, -2, 107, 0);
  ctx.quadraticCurveTo(108, 2, 95, 8);
  ctx.closePath();
  ctx.fill();
  if (!pixelMode) ctx.stroke();
}

function drawPlaneSkis(ctx, pixelMode) {
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-4, 16);
  ctx.lineTo(4, 40);
  ctx.moveTo(14, 17);
  ctx.lineTo(20, 40);
  ctx.moveTo(-146, -2);
  ctx.lineTo(-148, 8);
  ctx.stroke();
  // Main skis with upturned tips, tail ski
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-18, 40);
  ctx.lineTo(42, 40);
  ctx.quadraticCurveTo(52, 39, 54, 32);
  ctx.lineTo(56, 33);
  ctx.quadraticCurveTo(54, 45, 42, 45);
  ctx.lineTo(-18, 45);
  ctx.closePath();
  ctx.fill();
  if (!pixelMode) ctx.stroke();
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-14, 41.5, 52, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-160, 8, 24, 3);
  ctx.fillRect(-138, 6, 4, 3);
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
    skis = true,
  } = options;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';

  if (skis) drawPlaneSkis(ctx, false);

  // Horizontal stabiliser (far side) + wing strut
  ctx.fillStyle = '#c2410c';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-168, -13, 48, 7, 3);
  ctx.fill();
  ctx.stroke();

  // Fuselage: orange top, white belly, navy cheat line
  tracePlaneFuselage(ctx);
  const paint = ctx.createLinearGradient(0, -36, 0, 18);
  paint.addColorStop(0, '#fb923c');
  paint.addColorStop(0.55, '#ea580c');
  paint.addColorStop(1, '#c2410c');
  ctx.fillStyle = paint;
  ctx.fill();
  ctx.save();
  tracePlaneFuselage(ctx);
  ctx.clip();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-170, 3, 280, 20);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-170, -1, 280, 4);
  // Engine cowling panel line + exhaust
  ctx.strokeStyle = 'rgba(11, 16, 32, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(56, -18);
  ctx.lineTo(56, 18);
  ctx.moveTo(-6, -32);
  ctx.lineTo(-6, 14);
  ctx.stroke();
  ctx.restore();
  tracePlaneFuselage(ctx);
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.fillStyle = '#334155';
  ctx.fillRect(66, 12, 10, 4);
  // Registration-style letters on the tail boom
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 11px "Pretendard", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PPENG', -92, -8);

  // Pilot behind the side window
  if (withPilot) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    tracePlaneWindow(ctx);
    ctx.fill();
    drawCarPilot(ctx, false, now, { spId, isShocked, isImpactBlink, lift: pilotLift, rect: PLANE_PILOT_RECT, clip: tracePlaneWindow });
  }
  ctx.fillStyle = withPilot ? 'rgba(186, 230, 253, 0.28)' : 'rgba(125, 211, 252, 0.75)';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2;
  ctx.beginPath();
  tracePlaneWindow(ctx);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(14, -29);
  ctx.lineTo(26, -20);
  ctx.stroke();
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-8, -32, 3, 26);

  // Tail fin with rudder line
  ctx.fillStyle = '#ea580c';
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-118, -20);
  ctx.lineTo(-146, -60);
  ctx.lineTo(-162, -60);
  ctx.lineTo(-157, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-160, -54, 14, 6);
  ctx.strokeStyle = 'rgba(11, 16, 32, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-150, -58);
  ctx.lineTo(-146, -14);
  ctx.stroke();

  // High wing on the cabin roof, V strut down to the fuselage
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(18, -40);
  ctx.lineTo(-6, 15);
  ctx.lineTo(-30, -40);
  ctx.stroke();
  const wing = ctx.createLinearGradient(0, -48, 0, -36);
  wing.addColorStop(0, '#ffffff');
  wing.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = wing;
  ctx.strokeStyle = PLANE_K;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-50, -38);
  ctx.lineTo(-48, -46);
  ctx.lineTo(30, -48);
  ctx.quadraticCurveTo(44, -46, 44, -42);
  ctx.quadraticCurveTo(42, -37, 30, -37);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-46, -45, 16, 6);
  // Wing light
  ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? '#ef4444' : '#7f1d1d';
  ctx.fillRect(40, -44, 3, 3);

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
      const sx = Math.round((70 + sp * 16) / 4) * 4;
      const sy = Math.round((-20 - sp * 34) / 4) * 4;
      const sz = s % 2 === 0 ? 8 : 6;
      ctx.fillStyle = s % 2 === 0 ? 'rgba(100, 116, 139, 0.75)' : 'rgba(250, 204, 21, 0.72)';
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  // Skis + legs
  ctx.fillStyle = '#334155';
  ctx.fillRect(-4, 16, 4, 24);
  ctx.fillRect(14, 16, 4, 24);
  ctx.fillRect(-148, -2, 3, 10);
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-20, 38, 66, 8);
  ctx.fillRect(46, 32, 8, 8);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-18, 40, 62, 4);
  ctx.fillRect(46, 34, 6, 6);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-14, 42, 52, 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-160, 8, 24, 4);

  // Stabiliser, fuselage blocks (stepped taper), livery
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-170, -14, 52, 10);
  ctx.fillStyle = '#c2410c';
  ctx.fillRect(-168, -12, 48, 6);
  const body = [
    [-40, -36, 82, 52],
    [42, -18, 46, 34],
    [88, -12, 8, 24],
    [-80, -28, 40, 40],
    [-120, -20, 40, 26],
    [-156, -12, 36, 12],
  ];
  ctx.fillStyle = PLANE_K;
  body.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#ea580c';
  body.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#fb923c';
  body.slice(0, 5).forEach(([x, y, w]) => ctx.fillRect(x, y, w, 4));
  ctx.fillStyle = '#f8fafc';
  [
    [-40, 4, 82, 12],
    [42, 4, 46, 12],
    [-80, 4, 40, 8],
    [-120, 2, 40, 4],
  ].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(-150, 0, 238, 4);

  // Window + pilot
  const win = (c) => c.rect(-38, -32, 68, 26);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-38, -32, 68, 26);
  drawCarPilot(ctx, true, now, { spId, isShocked, isImpactBlink: forceBlink, lift: pilotLift, rect: PLANE_PILOT_RECT, clip: win });
  ctx.fillStyle = 'rgba(186, 230, 253, 0.3)';
  ctx.fillRect(-38, -32, 68, 26);
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-40, -34, 72, 2);
  ctx.fillRect(-40, -6, 72, 2);
  ctx.fillRect(-40, -34, 2, 30);
  ctx.fillRect(30, -34, 2, 30);
  ctx.fillRect(-8, -32, 2, 26);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(16, -28, 8, 2);

  // Tail fin (stepped)
  const fin = [
    [-160, -60, 16, 8],
    [-158, -52, 22, 10],
    [-157, -42, 28, 12],
    [-156, -30, 36, 12],
  ];
  ctx.fillStyle = PLANE_K;
  fin.forEach(([x, y, w, h]) => ctx.fillRect(x - 2, y - 2, w + 4, h + 4));
  ctx.fillStyle = '#ea580c';
  fin.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-158, -56, 12, 4);

  // Wing + strut
  ctx.fillStyle = '#475569';
  for (let k = 0; k < 7; k++) {
    ctx.fillRect(16 - k * 3, -38 + k * 8, 3, 8);
    ctx.fillRect(-30 + k * 3, -38 + k * 8, 3, 8);
  }
  ctx.fillStyle = PLANE_K;
  ctx.fillRect(-52, -50, 98, 14);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-50, -48, 94, 10);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-50, -40, 94, 2);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(-50, -48, 16, 10);
  ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? '#ef4444' : '#7f1d1d';
  ctx.fillRect(40, -46, 4, 4);

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

// Hit test: entity circle against the plane's ellipse (screen coords; plane at x,y, scale s, tilt ignored)
function planeHits(px, py, s, ex, ey, er) {
  const cx = px + PLANE_CFG.HIT_CX * s;
  const cy = py + PLANE_CFG.HIT_CY * s;
  const dx = (ex - cx) / (PLANE_CFG.HIT_RX * s + er);
  const dy = (ey - cy) / (PLANE_CFG.HIT_RY * s + er);
  return dx * dx + dy * dy <= 1;
}

// SCENE 2 — take-off run on skis across the cracking ice, then climb out
function drawPlaneScene1Takeoff(ctx, now, p, spId) {
  const S = 1.05;
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
