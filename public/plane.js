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
    layer = 'all', // 'back' = everything behind the pilot, 'front' = everything over it (for the pixel plane)
  } = options;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tiltRad);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (layer !== 'front') {

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
  }
  if (layer === 'back') {
    ctx.restore();
    return;
  }
  if (withPilot && layer === 'all') {
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

// 16-bit pixel plane (scenes 4–5): the very same drawing as the in-game plane (drawPlaneWithPilot), rendered at
// 1/PIXEL_PLANE_CELL size, snapped to the plane's own palette with hard alpha, then blown up without smoothing,
// so the pixel version can never drift from the plane the player flew. The pixel pilot goes on top.
const PIXEL_PLANE_CELL = 3; // stage px per art pixel (the town penguins are ~2.6)
const PIXEL_PLANE_BOX = { x: -120, y: -57, w: 243, h: 126 }; // tail fin top to skis, tail to spinner
const PIXEL_PLANE_PALETTE = [
  '#0b1020', '#1e293b', '#1f2937', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f8fafc',
  '#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#a7f3e8',
  '#be185d', '#f472b6', '#f9a8d4', '#f97316', '#ef4444', '#facc15', '#fde047', '#22c55e', '#14532d', '#7dd3fc', '#bae6fd',
];
// Shared by the plane and the ship: draw `drawFn` (local vehicle units) into a 1/cell-size buffer, snap every
// pixel to `palette` with hard alpha, add a 1-px dark outline round the silhouette, return the buffer (draw it
// at box.x, box.y, size * cell). key keeps one buffer per vehicle layer.
const PIXEL_ART_BUFFERS = {};
const PIXEL_ART_PALETTES = new Map();

function pixelArtPalette(hexes) {
  let p = PIXEL_ART_PALETTES.get(hexes);
  if (!p) {
    p = hexes.map((hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]);
    PIXEL_ART_PALETTES.set(hexes, p);
  }
  return p;
}

function renderPixelArtLayer(key, box, cell, paletteHex, drawFn) {
  const w = Math.ceil(box.w / cell);
  const h = Math.ceil(box.h / cell);
  let buf = PIXEL_ART_BUFFERS[key];
  if (!buf) {
    buf = document.createElement('canvas');
    buf.width = w;
    buf.height = h;
    PIXEL_ART_BUFFERS[key] = buf;
  }
  const palette = pixelArtPalette(paletteHex);
  const b = buf.getContext('2d', { willReadFrequently: true });
  b.setTransform(1, 0, 0, 1, 0, 0);
  b.clearRect(0, 0, w, h);
  b.imageSmoothingEnabled = true;
  b.setTransform(1 / cell, 0, 0, 1 / cell, -box.x / cell, -box.y / cell);
  drawFn(b);
  b.setTransform(1, 0, 0, 1, 0, 0);
  const img = b.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 80) {
      d[i + 3] = 0;
      continue;
    }
    // un-premultiply partly covered edge pixels before matching
    const al = d[i + 3] / 255;
    const r = d[i] / al;
    const g = d[i + 1] / al;
    const bl = d[i + 2] / al;
    let best = 0;
    let bestD = Infinity;
    for (let k = 0; k < palette.length; k++) {
      const p = palette[k];
      const dist = (p[0] - r) * (p[0] - r) * 0.3 + (p[1] - g) * (p[1] - g) * 0.59 + (p[2] - bl) * (p[2] - bl) * 0.11;
      if (dist < bestD) {
        bestD = dist;
        best = k;
      }
    }
    const p = palette[best];
    d[i] = p[0];
    d[i + 1] = p[1];
    d[i + 2] = p[2];
    d[i + 3] = 255;
  }
  // 1-pixel dark outline round the silhouette (the thin 2D strokes vanish at this size)
  const solid = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) solid[i] = d[i * 4 + 3] ? 1 : 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (solid[i]) continue;
      if ((x > 0 && solid[i - 1]) || (x < w - 1 && solid[i + 1]) || (y > 0 && solid[i - w]) || (y < h - 1 && solid[i + w])) {
        d[i * 4] = 11;
        d[i * 4 + 1] = 16;
        d[i * 4 + 2] = 32;
        d[i * 4 + 3] = 255;
      }
    }
  }
  b.putImageData(img, 0, 0);
  return buf;
}

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

  // Same stacking as the 2D plane: tail + seat, the pixel pilot, then cargo + body + wing + propeller
  const B = PIXEL_PLANE_BOX;
  const C = PIXEL_PLANE_CELL;
  const blit = (layer) => {
    if (typeof document === 'undefined') return;
    const buf = renderPixelArtLayer('plane-' + layer, B, C, PIXEL_PLANE_PALETTE, (b) =>
      drawPlaneWithPilot(b, 0, 0, 0, now, { scale: 1, withPilot: false, propSpin, layer })
    );
    ctx.drawImage(buf, B.x, B.y, buf.width * C, buf.height * C);
  };
  blit('back');
  drawCarPilot(ctx, true, now, {
    spId,
    isShocked,
    isImpactBlink: forceBlink,
    lift: pilotLift,
    rect: PLANE_PILOT_RECT,
    clip: (c) => c.rect(-70, -140, 140, 142),
  });
  blit('front');
  ctx.restore();
}

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
