// ============================================================================
// EASTER VILLAGE — the hidden Christmas village of the town Easter egg (town-easter.js), drawn in code after the
// owner's reference picture (not the picture itself): a night sky and moon, snowy mountains and pines, timber
// houses with a market stall, the big tree with gifts, igloos on the cliff, a waterfall into the river, a stone
// bridge, lamps, a fence and snowy bushes. The still parts are drawn once into a 2x canvas; on top, every frame,
// the moving parts: twinkling stars and tree lights, flickering windows, lamp glows, the falling water, the river's
// shimmer and lamp reflections, chimney smoke, snow, and a crowd of penguins each busy with something (keeping the
// market stall, carrying a gift, dancing round the tree, crossing the bridge, skating, fishing through the ice,
// waving from an igloo, a snowball fight, a stroll along the cliff).
// ============================================================================
const EV_K = '#0b1020';
const EV_LAMPS = [[156, 318], [402, 392], [532, 460], [590, 282], [770, 282], [906, 236]];
const EV_WINDOWS = [[22, 196, 20, 18], [64, 196, 20, 18], [106, 196, 20, 18], [176, 214, 18, 16], [214, 214, 18, 16], [252, 214, 18, 16], [882, 150, 8, 8], [906, 150, 8, 8], [930, 130, 8, 8]];
const EV_CHIMNEYS = [[118, 70], [258, 128]];
const EV_TREE = { x: 335, top: 92, base: 300 };
const EV_STATE = { still: null, treeLights: null };

function evHash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function evPoly(ctx, pts, fill, outline) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
function evRect(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

// ---------------------------------------------------------------------------------------------------------------
// Still layer
// ---------------------------------------------------------------------------------------------------------------
function evMountains(ctx, pts, base, body, snow) {
  evPoly(ctx, [...pts, [960, base], [0, base]], body);
  // Snow caps: the top third of every peak
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [lx, ly] = pts[i - 1];
    const [rx, ry] = pts[i + 1];
    if (y > ly || y > ry) continue;
    const f = 0.38;
    const a = [x + (lx - x) * f, y + (ly - y) * f];
    const b = [x + (rx - x) * f, y + (ry - y) * f];
    evPoly(ctx, [[x, y], b, [b[0] - 6, b[1] - 4], [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) - 2], [a[0] + 6, a[1] - 4], a], snow);
  }
}

function evPine(ctx, x, base, h, body, snow) {
  const w = h * 0.55;
  for (let k = 0; k < 3; k++) {
    const ty = base - h + k * h * 0.28;
    const tw = w * (0.55 + k * 0.22);
    evPoly(ctx, [[x, ty], [x + tw / 2, ty + h * 0.42], [x - tw / 2, ty + h * 0.42]], body);
    evPoly(ctx, [[x, ty], [x + tw * 0.18, ty + h * 0.12], [x - tw * 0.22, ty + h * 0.12]], snow);
  }
  evRect(ctx, x - 2, base - 4, 4, 6, '#3b2a20');
}

function evHouse(ctx, x, y, w, h, roofH) {
  // Plaster wall with timber framing, a snowy roof with icicles
  evRect(ctx, x, y, w, h, '#f1e3c8');
  evRect(ctx, x, y, w, 6, '#6b4027');
  evRect(ctx, x, y + h - 6, w, 6, '#6b4027');
  for (let bx = x; bx <= x + w; bx += Math.round(w / 3)) evRect(ctx, Math.min(bx, x + w - 6), y, 6, h, '#6b4027');
  evRect(ctx, x, y + Math.round(h * 0.45), w, 5, '#6b4027');
  ctx.strokeStyle = EV_K;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  const peak = [x + w / 2, y - roofH];
  evPoly(ctx, [[x - 12, y + 4], peak, [x + w + 12, y + 4]], '#5a3424', EV_K);
  evPoly(ctx, [[x - 14, y], [peak[0], peak[1] - 6], [x + w + 14, y], [x + w + 6, y + 6], [peak[0], peak[1] + 4], [x - 6, y + 6]], '#f8fbff', EV_K);
  ctx.fillStyle = '#dbe8fb';
  for (let ix = x - 8; ix < x + w + 8; ix += 9) ctx.fillRect(ix, y + 4, 3, 5 + Math.round(evHash(ix) * 6));
}

function evWindow(ctx, x, y, w, h) {
  evRect(ctx, x - 2, y - 2, w + 4, h + 4, EV_K);
  evRect(ctx, x, y, w, h, '#ffcf6e');
  evRect(ctx, x, y + h / 2 - 1, w, 2, '#8a5a2b');
  evRect(ctx, x + w / 2 - 1, y, 2, h, '#8a5a2b');
  evRect(ctx, x, y + h, w, 3, '#f8fbff');
}

function evIgloo(ctx, cx, base, r) {
  ctx.fillStyle = 'rgba(30, 50, 90, 0.25)';
  ctx.beginPath();
  ctx.ellipse(cx, base + 2, r * 1.1, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, base, r, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#eef5ff';
  ctx.fill();
  ctx.strokeStyle = EV_K;
  ctx.lineWidth = 2;
  ctx.stroke();
  // Ice blocks
  ctx.strokeStyle = '#b8c9e6';
  ctx.lineWidth = 1.5;
  for (let k = 1; k < 4; k++) {
    const ry = base - (r * k) / 4;
    const hw = Math.sqrt(r * r - (base - ry) * (base - ry));
    ctx.beginPath();
    ctx.moveTo(cx - hw, ry);
    ctx.lineTo(cx + hw, ry);
    ctx.stroke();
    for (let bx = -hw + ((k % 2) * r) / 4; bx < hw; bx += r / 2) {
      ctx.beginPath();
      ctx.moveTo(cx + bx, ry);
      ctx.lineTo(cx + bx, ry + r / 4);
      ctx.stroke();
    }
  }
  // Door with a warm glow
  const dw = r * 0.5;
  ctx.beginPath();
  ctx.arc(cx, base, dw / 2 + 4, Math.PI, 0);
  ctx.fillStyle = '#d7e4f7';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, base, dw / 2, Math.PI, 0);
  ctx.fillStyle = '#ffc25e';
  ctx.fill();
}

function evLampPost(ctx, x, y) {
  evRect(ctx, x - 2, y, 4, 34, '#1e2433');
  evRect(ctx, x - 5, y + 32, 10, 4, '#1e2433');
  evRect(ctx, x - 6, y - 12, 12, 12, '#1e2433');
  evRect(ctx, x - 4, y - 10, 8, 8, '#ffd889');
  evRect(ctx, x - 7, y - 15, 14, 4, '#f8fbff');
}

function evGift(ctx, x, y, w, h, body, ribbon) {
  evRect(ctx, x - 1, y - 1, w + 2, h + 2, EV_K);
  evRect(ctx, x, y, w, h, body);
  evRect(ctx, x + w / 2 - 2, y, 4, h, ribbon);
  evRect(ctx, x, y + h / 2 - 2, w, 4, ribbon);
}

function buildEasterVillageStill() {
  const c = document.createElement('canvas');
  c.width = 1920;
  c.height = 1080;
  const g = c.getContext('2d');
  g.scale(2, 2);
  // Night sky, stars, moon
  const sky = g.createLinearGradient(0, 0, 0, 280);
  sky.addColorStop(0, '#0a1130');
  sky.addColorStop(0.6, '#1c2d63');
  sky.addColorStop(1, '#30508f');
  g.fillStyle = sky;
  g.fillRect(0, 0, 960, 300);
  for (let k = 0; k < 70; k++) evRect(g, Math.round(evHash(k) * 960), Math.round(evHash(k + 99) * 180), 2, 2, '#e8efff');
  const moon = g.createRadialGradient(722, 44, 4, 722, 44, 60);
  moon.addColorStop(0, 'rgba(255, 246, 214, 0.35)');
  moon.addColorStop(1, 'rgba(255, 246, 214, 0)');
  g.fillStyle = moon;
  g.fillRect(660, 0, 130, 110);
  g.fillStyle = '#fdf6d8';
  g.beginPath();
  g.arc(722, 44, 15, 0, Math.PI * 2);
  g.fill();
  evRect(g, 714, 38, 4, 4, '#e9dfb8');
  evRect(g, 726, 48, 5, 4, '#e9dfb8');
  // Mountains: a far pale range and a nearer one
  evMountains(g, [[0, 190], [70, 150], [150, 175], [250, 104], [340, 160], [430, 78], [520, 150], [600, 98], [680, 150], [770, 92], [850, 160], [920, 116], [960, 140]], 270, '#3a4f8e', '#dfe8ff');
  evMountains(g, [[0, 220], [110, 176], [210, 210], [330, 160], [460, 214], [560, 170], [690, 216], [820, 168], [960, 210]], 280, '#2a3d76', '#c9d8f5');
  // Pines along the foot of the mountains
  for (let k = 0; k < 56; k++) {
    const x = k * 18 + evHash(k + 7) * 8;
    evPine(g, x, 262 + evHash(k + 3) * 10, 34 + evHash(k) * 26, k % 2 ? '#15284f' : '#1b3260', '#c9d8f5');
  }
  // Right: the cliff with igloos and far cabins, the waterfall's rock
  evPoly(g, [[520, 262], [640, 236], [760, 222], [960, 196], [960, 340], [520, 340]], '#e7f0fd');
  evPoly(g, [[520, 300], [960, 280], [960, 345], [520, 345]], '#62759c');
  for (let k = 0; k < 9; k++) evRect(g, 530 + k * 48, 304 + (k % 3) * 9, 34, 3, '#4d5f86');
  evRect(g, 520, 296, 440, 6, '#f8fbff');
  // Snowy pines on the cliff top behind the igloos, and the far cabins with lit windows
  for (let k = 0; k < 14; k++) {
    const x = 530 + k * 30 + evHash(k + 70) * 10;
    if (x > 790 && x < 860) continue;
    evPine(g, x, 238 - (x - 520) * 0.05, 40 + evHash(k + 71) * 24, k % 2 ? '#1a3a5e' : '#204870', '#e7f0fd');
  }
  for (const [hx, hy] of [[872, 140], [918, 120]]) {
    evRect(g, hx, hy, 34, 28, '#6b4027');
    evPoly(g, [[hx - 6, hy], [hx + 17, hy - 16], [hx + 40, hy]], '#f8fbff', EV_K);
  }
  [[882, 150], [906, 150], [930, 130]].forEach(([x, y]) => evRect(g, x, y, 8, 8, '#ffcf6e'));
  evIgloo(g, 612, 262, 30);
  evIgloo(g, 884, 262, 42);
  // Waterfall rock (the water itself moves, see drawEasterVillage), right of the bridge
  evPoly(g, [[794, 196], [856, 190], [862, 338], [788, 338]], '#56698f');
  evRect(g, 790, 192, 70, 6, '#f8fbff');
  // River across the right half
  const river = g.createLinearGradient(0, 330, 0, 480);
  river.addColorStop(0, '#3274bf');
  river.addColorStop(1, '#1c4787');
  evPoly(g, [[430, 352], [960, 334], [960, 478], [700, 470], [520, 482], [430, 440]], river);
  evPoly(g, [[430, 352], [960, 334], [960, 342], [430, 360]], '#d7e7fb');
  // Ice floe for the fisher
  evPoly(g, [[690, 488], [760, 470], [960, 474], [960, 540], [700, 540]], '#eef5ff', EV_K);
  evRect(g, 700, 486, 260, 4, '#c3d6f0');
  g.fillStyle = '#163866';
  g.beginPath();
  g.ellipse(884, 508, 16, 6, 0, 0, Math.PI * 2);
  g.fill();
  // Stone bridge with an arch over the river
  evRect(g, 560, 300, 220, 24, '#8590ab');
  for (let bx = 562; bx < 778; bx += 22) evRect(g, bx, 310, 2, 14, '#6a7591');
  evRect(g, 560, 296, 220, 6, '#f8fbff');
  evPoly(g, [[560, 324], [780, 324], [780, 380], [560, 380]], '#7a86a3');
  g.fillStyle = '#2a64ad';
  g.beginPath();
  g.ellipse(670, 382, 66, 48, 0, Math.PI, 0);
  g.fill();
  g.strokeStyle = EV_K;
  g.lineWidth = 2;
  g.strokeRect(560, 296, 220, 84);
  for (let px = 566; px < 780; px += 26) {
    evRect(g, px, 284, 4, 14, '#5a3a26');
  }
  evRect(g, 560, 284, 220, 3, '#5a3a26');
  // Left: the plaza ground, houses with a market stall
  evPoly(g, [[0, 292], [540, 292], [560, 330], [470, 392], [430, 470], [0, 470]], '#e3ecfa');
  for (let k = 0; k < 12; k++) {
    g.fillStyle = 'rgba(160, 185, 225, 0.35)';
    g.beginPath();
    g.ellipse(40 + k * 40, 320 + (k % 3) * 40, 26, 5, 0, 0, Math.PI * 2);
    g.fill();
  }
  for (let k = 0; k < 6; k++) {
    const x = 420 + k * 22 + evHash(k + 90) * 8;
    evPine(g, x, 296, 54 + evHash(k + 91) * 22, k % 2 ? '#1b4a3a' : '#1f5a44', '#f8fbff');
  }
  evHouse(g, 4, 150, 140, 150, 80);
  evHouse(g, 156, 178, 128, 122, 56);
  EV_WINDOWS.slice(0, 6).forEach(([x, y, w, h]) => evWindow(g, x, y, w, h));
  // Chimneys
  EV_CHIMNEYS.forEach(([cx, cy]) => {
    evRect(g, cx - 9, cy, 18, 30, EV_K);
    evRect(g, cx - 7, cy + 2, 14, 28, '#8b3a2e');
    evRect(g, cx - 10, cy - 4, 20, 6, '#f8fbff');
  });
  // Wreath on the big gable, a fish sign on the small house
  g.strokeStyle = '#1e6b3a';
  g.lineWidth = 6;
  g.beginPath();
  g.arc(74, 112, 12, 0, Math.PI * 2);
  g.stroke();
  evRect(g, 70, 120, 8, 6, '#dc2626');
  evRect(g, 168, 236, 34, 22, '#5a3424');
  evRect(g, 172, 240, 26, 14, '#e7d3a8');
  evPoly(g, [[176, 247], [186, 242], [194, 247], [186, 252]], '#e46b7a');
  // Market stall with a striped awning and goods
  for (let k = 0; k < 12; k++) evRect(g, k * 12, 240, 12, 18, k % 2 ? '#f8fbff' : '#d83a3a');
  evRect(g, 0, 256, 144, 3, EV_K);
  evRect(g, 0, 272, 144, 28, '#7a4a2a');
  evRect(g, 0, 272, 144, 4, '#a0683c');
  for (let k = 0; k < 8; k++) evRect(g, 8 + k * 17, 264, 12, 8, ['#d99a4e', '#f2c14e', '#dc2626', '#2f9e6a'][k % 4]);
  // The big tree: tiers with a shaded right side and snow on the edges, trunk, ornaments
  const T = EV_TREE;
  evRect(g, T.x - 8, T.base - 18, 16, 20, '#5a3424');
  for (let k = 0; k < 4; k++) {
    const ty = T.top + k * 44;
    const hw = 30 + k * 20;
    evPoly(g, [[T.x, ty], [T.x + hw, ty + 74], [T.x - hw, ty + 74]], '#1e6b3a', EV_K);
    evPoly(g, [[T.x, ty], [T.x + hw, ty + 74], [T.x + 4, ty + 74]], '#165530');
    for (let s = -hw + 6; s < hw - 4; s += 12) evRect(g, T.x + s, ty + 70, 8, 4, '#f8fbff');
  }
  for (let k = 0; k < 18; k++) {
    const ty = T.top + 30 + evHash(k + 3) * 170;
    const span = 10 + (ty - T.top) * 0.36;
    evRect(g, Math.round(T.x + (evHash(k + 41) * 2 - 1) * span), Math.round(ty), 6, 6, ['#dc2626', '#f2c14e', '#60a5fa'][k % 3]);
  }
  // Gifts under the tree
  evGift(g, 280, 284, 22, 16, '#dc2626', '#f2c14e');
  evGift(g, 304, 288, 16, 12, '#2f9e6a', '#f8fbff');
  evGift(g, 352, 286, 20, 14, '#3b82f6', '#fde047');
  evGift(g, 374, 290, 14, 10, '#a855f7', '#f8fbff');
  // Fence along the plaza edge
  for (let fx = 160; fx < 470; fx += 26) {
    evRect(g, fx, 372 + (fx - 160) * 0.06, 6, 26, '#5a3a26');
    evRect(g, fx - 1, 370 + (fx - 160) * 0.06, 8, 4, '#f8fbff');
  }
  evPoly(g, [[160, 380], [470, 398], [470, 402], [160, 384]], '#6b4428');
  evPoly(g, [[160, 390], [470, 408], [470, 412], [160, 394]], '#6b4428');
  // Lamp posts
  EV_LAMPS.forEach(([x, y]) => evLampPost(g, x, y));
  // Front: snow bank, a bench, snowy bushes with red berries
  evPoly(g, [[0, 470], [430, 470], [470, 492], [700, 490], [700, 540], [0, 540]], '#edf4ff');
  evRect(g, 0, 470, 700, 3, '#c3d6f0');
  evRect(g, 250, 478, 70, 8, '#7a4a2a');
  evRect(g, 250, 470, 70, 4, '#f8fbff');
  evRect(g, 254, 486, 5, 12, '#5a3424');
  evRect(g, 311, 486, 5, 12, '#5a3424');
  for (let k = 0; k < 7; k++) {
    const bx = k * 30 - 6;
    const by = 488 + (k % 2) * 10;
    g.fillStyle = '#2f5e46';
    g.beginPath();
    g.arc(bx + 16, by + 14, 22, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#f8fbff';
    g.beginPath();
    g.arc(bx + 16, by + 6, 20, Math.PI, 0);
    g.fill();
    for (let r = 0; r < 4; r++) evRect(g, bx + 6 + evHash(k * 9 + r) * 22, by + 10 + evHash(k * 5 + r) * 14, 4, 4, '#dc2626');
  }
  return c;
}

// Tree light positions, spread over the tiers
function evTreeLights() {
  if (!EV_STATE.treeLights) {
    const T = EV_TREE;
    const pts = [];
    for (let k = 0; k < 34; k++) {
      const ty = T.top + 24 + (k / 34) * 186;
      const span = 8 + (ty - T.top) * 0.4;
      pts.push([Math.round(T.x + (evHash(k * 3 + 1) * 2 - 1) * span), Math.round(ty)]);
    }
    EV_STATE.treeLights = pts;
  }
  return EV_STATE.treeLights;
}

// ---------------------------------------------------------------------------------------------------------------
// The crowd: everyone doing something (pixel penguins from the species sheets, santa hats on)
// ---------------------------------------------------------------------------------------------------------------
function evPenguin(ctx, sp, x, feet, size, now, opts = {}) {
  const top = feet - size * (243 / 256) - (opts.lift || 0);
  if (typeof drawPixelGroundShadow === 'function' && !opts.noShadow) drawPixelGroundShadow(ctx, x, feet - 1, size * 0.5, opts.lift || 0);
  ctx.save();
  if (opts.tilt) {
    ctx.translate(x, feet);
    ctx.rotate(opts.tilt);
    ctx.translate(-x, -feet);
  }
  drawAnimatedPixelPenguin(ctx, ensureSpeciesSprite(sp), x - size / 2, top, size, now, {
    seed: opts.seed || 0,
    isWalking: opts.walking !== false,
    flipX: !!opts.flip,
    santaHat: true,
  });
  ctx.restore();
}

function evPingPong(now, period, a, b, phase = 0) {
  const q = ((now / period + phase) % 1) * 2;
  const p = q < 1 ? q : 2 - q;
  return { x: a + (b - a) * p, dir: q < 1 ? 1 : -1 };
}

function drawEasterCrowd(ctx, now) {
  const beat = typeof townBeat === 'function' ? townBeat(now) : now / 425;
  // Cliff stroll (far, small)
  const cs = evPingPong(now, 9000, 650, 770);
  evPenguin(ctx, '17', cs.x, 252, 26, now, { flip: cs.dir < 0, seed: 31 });
  // Waving from the big igloo door: pops out, waves, ducks back in
  const iq = (now / 3800) % 1;
  const out = iq < 0.15 ? iq / 0.15 : iq > 0.8 ? (1 - iq) / 0.2 : 1;
  ctx.save();
  ctx.beginPath();
  ctx.rect(860, 200, 50, 62);
  ctx.clip();
  evPenguin(ctx, '16', 884, 262 + (1 - out) * 26, 30, now, { flip: Math.floor(now / 300) % 2 === 0, seed: 32, noShadow: true, walking: false });
  ctx.restore();
  // Two crossing the bridge, opposite ways
  const b1 = evPingPong(now, 8000, 580, 760);
  const b2 = evPingPong(now, 8000, 760, 580, 0.35);
  evPenguin(ctx, '03', b1.x, 300, 30, now, { flip: b1.dir < 0, seed: 33 });
  evPenguin(ctx, '11', b2.x, 300, 30, now, { flip: b2.dir > 0, seed: 34 });
  // Skaters gliding on the river, leaning into the curve, a scratch line behind them
  for (const [sp, y, period, ph, seed] of [['14', 420, 5200, 0, 35], ['20', 452, 6400, 0.4, 36]]) {
    const a = (now / period + ph) * Math.PI * 2;
    const x = 680 + Math.sin(a) * 150;
    const vx = Math.cos(a);
    ctx.strokeStyle = 'rgba(226, 240, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const aa = a - k * 0.06;
      const px = 680 + Math.sin(aa) * 150;
      k ? ctx.lineTo(px, y + Math.cos(aa * 2) * 2) : ctx.moveTo(px, y);
    }
    ctx.stroke();
    evPenguin(ctx, sp, x, y + Math.cos(a * 2) * 2, 36, now, { flip: vx < 0, tilt: vx * 0.18, walking: false, seed });
  }
  // The fisher on the ice: line in the hole, bobber; every 7 s a fish comes up and it cheers
  const fq = (now % 7000) / 7000;
  const catching = fq > 0.82;
  const fisherX = 846;
  const fisherFeet = 516;
  evPenguin(ctx, '08', fisherX, fisherFeet, 46, now, { flip: false, walking: false, lift: catching ? Math.sin(((fq - 0.82) / 0.18) * Math.PI * 3) * 8 : 0, seed: 37 });
  const rodTip = [fisherX + 30, fisherFeet - 50];
  ctx.strokeStyle = '#7c4a1d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(fisherX + 10, fisherFeet - 24);
  ctx.lineTo(rodTip[0], rodTip[1] - (catching ? 6 : 0));
  ctx.stroke();
  const bob = catching ? -14 : Math.sin(now * 0.006) * 2;
  ctx.strokeStyle = 'rgba(230, 240, 255, 0.8)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rodTip[0], rodTip[1] - (catching ? 6 : 0));
  ctx.lineTo(884, 506 + bob);
  ctx.stroke();
  evRect(ctx, 881, 503 + bob, 6, 6, '#dc2626');
  if (catching) {
    const p = (fq - 0.82) / 0.18;
    const fx = 884 - p * 40;
    const fy = 500 - Math.sin(p * Math.PI) * 50;
    evPoly(ctx, [[fx - 10, fy], [fx, fy - 5], [fx + 8, fy], [fx, fy + 5]], '#7dd3fc', EV_K);
    evPoly(ctx, [[fx + 8, fy], [fx + 14, fy - 5], [fx + 14, fy + 5]], '#7dd3fc', EV_K);
    if (typeof drawScene0Mark === 'function') drawScene0Mark(ctx, fisherX - 4, fisherFeet - 62, '!', '#fde047');
  }
  // Market stall keeper bobbing and turning
  evPenguin(ctx, '12', 72, 296, 40, now, { flip: Math.floor(now / 2200) % 2 === 0, walking: false, lift: Math.floor(now / 400) % 2 ? 2 : 0, seed: 38 });
  // Gift carrier strolling across the plaza
  const gc = evPingPong(now, 7000, 120, 270);
  evPenguin(ctx, '15', gc.x, 344, 42, now, { flip: gc.dir < 0, seed: 39 });
  evGift(ctx, gc.x + (gc.dir < 0 ? -18 : 6), 322, 12, 10, '#dc2626', '#f2c14e');
  // Dancing round the tree, hopping on alternate beats and turning
  [['07', 282, 0], ['18', 392, 1]].forEach(([sp, x, i]) => {
    const on = Math.floor(beat) % 2 === i && beat % 1 < 0.35;
    evPenguin(ctx, sp, x, 330, 42, now, { flip: Math.floor(beat / 2) % 2 === i, lift: on ? 8 : 0, seed: 40 + i });
  });
  // Snowball fight in front of the fence
  const sq = (now % 2400) / 2400;
  const thrower = Math.floor(now / 2400) % 2;
  const sx0 = thrower ? 262 : 150;
  const sx1 = thrower ? 150 : 262;
  evPenguin(ctx, '19', 150, 428, 42, now, { flip: false, walking: false, lift: !thrower && sq > 0.75 ? 5 : 0, seed: 42 });
  evPenguin(ctx, '21', 262, 422, 42, now, { flip: true, walking: false, lift: thrower && sq > 0.75 ? 5 : 0, seed: 43 });
  if (sq < 0.6) {
    const q = sq / 0.6;
    const bx = sx0 + (sx1 - sx0) * q;
    const by = 396 - Math.sin(q * Math.PI) * 40;
    evRect(ctx, Math.round(bx) - 5, Math.round(by) - 5, 10, 10, EV_K);
    evRect(ctx, Math.round(bx) - 4, Math.round(by) - 4, 8, 8, '#ffffff');
  } else if (sq < 0.8) {
    const r = (sq - 0.6) / 0.2;
    ctx.fillStyle = `rgba(255, 255, 255, ${(1 - r).toFixed(3)})`;
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      ctx.fillRect(Math.round(sx1 + Math.cos(a) * (6 + r * 16)) - 2, Math.round(396 + Math.sin(a) * (4 + r * 10)) - 2, 5, 5);
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// One frame of the village (the cast and the talk are added by town-easter.js)
// ---------------------------------------------------------------------------------------------------------------
function drawEasterVillage(ctx, now) {
  if (!EV_STATE.still) EV_STATE.still = buildEasterVillageStill();
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(EV_STATE.still, 0, 0, 960, 540);
  const beat = typeof townBeat === 'function' ? townBeat(now) : now / 425;
  // Twinkling stars
  for (let k = 0; k < 14; k++) {
    if (Math.floor(now / 340 + k * 2.3) % 4) continue;
    const x = Math.round(evHash(k + 500) * 960);
    const y = Math.round(evHash(k + 600) * 170);
    evRect(ctx, x - 3, y, 7, 1, '#ffffff');
    evRect(ctx, x, y - 3, 1, 7, '#ffffff');
  }
  // Falling water: bright streaks running down, foam at the foot
  ctx.save();
  ctx.beginPath();
  ctx.rect(800, 198, 50, 140);
  ctx.clip();
  evRect(ctx, 800, 198, 50, 140, '#5aa0e6');
  for (let k = 0; k < 12; k++) {
    const x = 802 + k * 4;
    const y = ((now * (0.12 + (k % 3) * 0.03) + k * 37) % 180) + 170;
    evRect(ctx, Math.round(x), Math.round(y), 2, 28, k % 2 ? '#d6ecff' : '#9ccbf5');
  }
  ctx.restore();
  for (let k = 0; k < 7; k++) {
    const q = (now / 900 + k / 7) % 1;
    ctx.globalAlpha = 1 - q;
    evRect(ctx, Math.round(796 + k * 8 + Math.sin(k + now * 0.004) * 4), Math.round(334 - q * 16), 8, 6, '#ffffff');
  }
  ctx.globalAlpha = 1;
  // River shimmer and the lamps' reflections
  for (let k = 0; k < 18; k++) {
    const x = 450 + ((k * 61 + now * 0.02) % 500);
    const y = 362 + (k % 6) * 18;
    ctx.fillStyle = 'rgba(214, 235, 255, 0.35)';
    ctx.fillRect(Math.round(x), y, 14 + (k % 3) * 6, 2);
  }
  [[590, 330], [770, 330]].forEach(([x, y], i) => {
    for (let k = 0; k < 5; k++) {
      ctx.fillStyle = `rgba(255, 214, 120, ${(0.35 - k * 0.06).toFixed(2)})`;
      ctx.fillRect(Math.round(x - 4 + Math.sin(now * 0.004 + k + i) * 3), y + 10 + k * 9, 8, 5);
    }
  });
  // Windows flicker warmly, lamps and the tree light up the snow
  ctx.globalCompositeOperation = 'lighter';
  EV_WINDOWS.forEach(([x, y, w, h], i) => {
    const a = 0.12 + 0.1 * Math.sin(now * 0.004 + i * 2.1) + (Math.floor(now / 1700 + i) % 7 === 0 ? 0.08 : 0);
    ctx.fillStyle = `rgba(255, 200, 110, ${a.toFixed(3)})`;
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  });
  EV_LAMPS.forEach(([x, y], i) => {
    const a = 0.32 + 0.12 * Math.sin(now * 0.003 + i * 1.7);
    const g = ctx.createRadialGradient(x, y - 6, 1, x, y - 6, 34);
    g.addColorStop(0, `rgba(255, 220, 140, ${a.toFixed(3)})`);
    g.addColorStop(1, 'rgba(255, 220, 140, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 34, y - 40, 68, 68);
  });
  const sp = beat >= 0 ? Math.pow(1 - (beat % 1), 2) : 0.5;
  const sg = ctx.createRadialGradient(EV_TREE.x, EV_TREE.top, 1, EV_TREE.x, EV_TREE.top, 40);
  sg.addColorStop(0, `rgba(255, 244, 184, ${(0.3 + sp * 0.45).toFixed(3)})`);
  sg.addColorStop(1, 'rgba(255, 244, 184, 0)');
  ctx.fillStyle = sg;
  ctx.fillRect(EV_TREE.x - 40, EV_TREE.top - 40, 80, 80);
  ctx.globalCompositeOperation = 'source-over';
  // Tree star and lights, stepping with the beat
  const T = EV_TREE;
  evPoly(ctx, [[T.x, T.top - 14], [T.x + 4, T.top - 4], [T.x + 14, T.top - 4], [T.x + 6, T.top + 3], [T.x + 9, T.top + 13], [T.x, T.top + 7], [T.x - 9, T.top + 13], [T.x - 6, T.top + 3], [T.x - 14, T.top - 4], [T.x - 4, T.top - 4]], '#fde047', EV_K);
  const cols = ['#fde047', '#f472b6', '#67e8f9', '#4ade80', '#fb923c'];
  evTreeLights().forEach(([x, y], i) => {
    const on = (Math.floor(beat) + i) % 3 !== 0;
    evRect(ctx, x - 1, y - 1, 5, 5, EV_K);
    evRect(ctx, x, y, 3, 3, on ? cols[(i + Math.floor(beat / 4)) % cols.length] : '#334155');
  });
  // Chimney smoke
  EV_CHIMNEYS.forEach(([cx, cy], i) => {
    for (let k = 0; k < 5; k++) {
      const q = (now / 2800 + k / 5 + i * 0.3) % 1;
      ctx.globalAlpha = (1 - q) * 0.5;
      const s = Math.round(6 + q * 14);
      evRect(ctx, Math.round(cx + Math.sin(q * 6 + i) * 7 - s / 2), Math.round(cy - 6 - q * 56 - s / 2), s, s, '#e2e8f0');
    }
  });
  ctx.globalAlpha = 1;
  // Everyone busy
  drawEasterCrowd(ctx, now);
  // Snow over it all
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let k = 0; k < 50; k++) {
    const far = k % 2;
    const x = ((k * 97 + now * (far ? 0.012 : 0.028) + Math.sin(now * 0.001 + k) * 10) % 980) - 10;
    const y = ((k * 53 + now * (far ? 0.022 : 0.05)) % 560) - 10;
    ctx.fillRect(Math.round(x), Math.round(y), far ? 2 : 3, far ? 2 : 3);
  }
  ctx.restore();
}
