// ============================================================================
// SCENE 2 + SCENE 4 motion — the escape and the capture (app.js, sceneIdx 1 and 3)
// Every vehicle runs AWAY from the pixel pillar: in the departure (scene 2) and in the capture (scene 4) the
// background is mirrored so the pillar stands on the left and the vehicle faces right, fleeing.
// Scene 4 has three parts:
//   1. approach — the pillar drags the vehicle back in, each its own way:
//      plane: the engine dies, it spins down trailing smoke, and the beam snatches it out of the fall;
//      car:   it is flooring it away, the beam lassoes it and drags it backwards, then lifts it;
//      ship:  the sea opens into a whirlpool at the pillar's foot, the ship circles down the funnel and a
//             waterspout carries it up into the beam;
//   2. the shared pixel scan (app.js);
//   3. the rise — like Alice's fall down the rabbit hole turned upside down (Carroll, ch. 1: "Either the well
//      was very deep, or she fell very slowly"; the sides were "filled with cupboards and book-shelves", with
//      "maps and pictures hung upon pegs"): the pixel vehicle floats up the pillar slowly, tumbling, past
//      shelves and drifting odds and ends, then shoots out of the top into a white flash -> the town.
// scene3Pose() is pure (time in, position out), so trails are just earlier poses.
// ============================================================================
const SCENE3_BEAM = { x: 295, y: 262 }; // the pillar's middle in the mirrored background
const SCENE3_APPROACH = 0.24; // share of the scene spent getting into the beam; the scan follows
const SCENE3_SCAN_END = 0.6;
const SCENE3_RISE_START = 0.64;
const SCENE3_WHIRL = { x: 290, y: 446, rx: 210, ry: 54 };
const SCENE3_BOAT_SCALE = 0.75;
const SCENE3_K = '#090d1a';
const SCENE3_ROAD_Y = 478; // the car's snow road, same line as its departure (drawCarSnowRoad)

function scene3Smooth(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function scene3Bezier(a, c, b, t) {
  const u = 1 - t;
  return u * u * a + 2 * u * t * c + t * t * b;
}

// { x, y, tilt, flip, caught (0..1: how hard the beam has hold of it), phase }
function scene3Pose(vehicle, subP, now) {
  const a = Math.max(0, Math.min(1, subP / SCENE3_APPROACH));
  const T = SCENE3_BEAM;
  const hover = Math.sin(now * 0.012) * 4;
  if (a >= 1) return { x: T.x, y: T.y + hover, tilt: Math.sin(now * 0.02) * 0.04, flip: false, caught: 1, phase: 'beam' };

  if (vehicle === 'car') {
    const groundOriginY = SCENE3_ROAD_Y - 57 * 1.3; // tyres on the same snow road as the departure
    if (a < 0.35) {
      const d = a / 0.35;
      return { x: 560 + d * 200, y: groundOriginY - Math.abs(Math.sin(now * 0.03)) * 3, tilt: 0, flip: false, caught: 0, phase: 'drive' };
    }
    if (a < 0.75) {
      // Still flooring it forwards while the beam drags it backwards
      const g = scene3Smooth((a - 0.35) / 0.4);
      const shake = Math.sin(now * 0.09) * 2;
      return { x: 760 - g * 330 + shake, y: groundOriginY + shake * 0.5, tilt: 0.06 + Math.sin(now * 0.05) * 0.03, flip: false, caught: g, phase: 'drag' };
    }
    const l = scene3Smooth((a - 0.75) / 0.25);
    return {
      x: 430 + l * (T.x - 430),
      y: groundOriginY + l * (T.y - groundOriginY) + hover * l,
      tilt: 0.06 - Math.sin(l * Math.PI) * 0.22,
      flip: false,
      caught: 1,
      phase: 'lift',
    };
  }

  if (vehicle === 'boat') {
    const W = SCENE3_WHIRL;
    const wl = 34 * SCENE3_BOAT_SCALE; // origin sits this far above the waterline
    const spiralAt = (s) => {
      const th = s * 2.3 * Math.PI;
      const r = 1 - 0.72 * s;
      return { th, x: W.x + Math.cos(th) * W.rx * r, y: W.y + Math.sin(th) * W.ry * r - wl };
    };
    if (a < 0.7) {
      const s = scene3Smooth(a / 0.7) * 0.85 + (a / 0.7) * 0.15;
      const p = spiralAt(s);
      // Moving left on the near side of the funnel, right on the far side
      const flip = -Math.sin(p.th) > 0 ? false : true;
      return { x: p.x, y: p.y + Math.sin(now * 0.02) * 2, tilt: (flip ? -1 : 1) * 0.1 * s + Math.sin(now * 0.03) * 0.04, flip, caught: s * 0.4, phase: 'whirl' };
    }
    const end = spiralAt(1);
    const l = scene3Smooth((a - 0.7) / 0.3);
    return {
      x: end.x + l * (T.x - end.x),
      y: end.y + l * (T.y - end.y) + hover * l,
      tilt: Math.sin(now * 0.04) * 0.08 * (1 - l),
      flip: false,
      caught: 1,
      phase: 'spout',
    };
  }

  // Plane: spins down nose-first, then the beam yanks it up and in
  if (a < 0.55) {
    const f = a / 0.55;
    return {
      x: 820 - f * 280,
      y: 70 + Math.pow(f, 1.6) * 250,
      tilt: 0.35 + f * 0.25 + Math.sin(now * 0.03) * 0.12,
      flip: false,
      caught: 0,
      phase: 'fall',
    };
  }
  const c = scene3Smooth((a - 0.55) / 0.45);
  return {
    x: scene3Bezier(540, 420, T.x, c),
    y: scene3Bezier(320, 380, T.y, c) + hover * c,
    tilt: (1 - c) * 0.6 - c * 0.08,
    flip: false,
    caught: c,
    phase: 'snatch',
  };
}

function drawScene3Ribbons(ctx, x, y, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  for (let s = 0; s < 5; s++) {
    const yOff = (s - 2) * 14;
    ctx.strokeStyle = s % 2 === 0 ? 'rgba(103, 232, 249, 0.8)' : 'rgba(244, 114, 182, 0.62)';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(SCENE3_BEAM.x - 20, SCENE3_BEAM.y - 30 + yOff * 0.4);
    ctx.quadraticCurveTo((x + SCENE3_BEAM.x) / 2, Math.min(y, SCENE3_BEAM.y) - 40 + yOff, x, y + yOff * 0.6);
    ctx.stroke();
  }
  ctx.restore();
}

// Black smoke and sparks behind the falling plane: earlier poses are the trail
function drawScene3PlaneSmoke(ctx, subP, now) {
  ctx.save();
  for (let k = 9; k >= 1; k--) {
    const back = subP - k * 0.012;
    if (back < 0) continue;
    const p = scene3Pose('ufo', back, now - k * 40);
    if (p.caught > 0.7) continue;
    const r = 8 + k * 2.6;
    ctx.globalAlpha = (1 - k / 10) * 0.75 * (1 - p.caught);
    ctx.fillStyle = k % 2 ? '#334155' : '#1e293b';
    ctx.fillRect(Math.round(p.x - 40 - r / 2), Math.round(p.y - 10 - r / 2), Math.round(r), Math.round(r));
  }
  ctx.globalAlpha = 1;
  const p = scene3Pose('ufo', subP, now);
  if (p.caught < 0.6) {
    for (let s = 0; s < 6; s++) {
      const sp = ((now * 0.004 + s * 0.17) % 1);
      ctx.fillStyle = s % 2 ? '#fb923c' : '#fde047';
      ctx.fillRect(Math.round(p.x + 70 - sp * 30 + Math.sin(s * 3) * 10), Math.round(p.y - 6 - sp * 22 + s * 3), 4, 4);
    }
  }
  ctx.restore();
}

// Snow spraying off the tyres while the car is driven, then dragged sideways
function drawScene3CarSpray(ctx, pose, now) {
  if (pose.phase === 'beam' || pose.phase === 'lift') return;
  const groundY = SCENE3_ROAD_Y;
  ctx.save();
  // Ground shadow + skid marks behind the drag
  ctx.fillStyle = 'rgba(9, 13, 26, 0.3)';
  ctx.beginPath();
  ctx.ellipse(pose.x, groundY + 2, 110, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  if (pose.phase === 'drag') {
    ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.fillRect(pose.x + 60, groundY - 2, 760 - pose.x, 4);
  }
  const n = pose.phase === 'drag' ? 14 : 8;
  for (let t = 0; t < n; t++) {
    const tp = (now * 0.004 + t * (1 / n)) % 1;
    const wheelX = pose.x + (t % 2 ? 76 : -72);
    const dir = -1; // the tyres keep spinning forwards, so snow flies out behind them
    const tx = wheelX + dir * tp * 70;
    const ty = groundY - 4 - Math.sin(tp * Math.PI) * (pose.phase === 'drag' ? 40 : 22);
    const sz = Math.max(3, Math.round((1 - tp) * 10));
    ctx.fillStyle = SCENE3_K;
    ctx.fillRect(tx - 1, ty - 1, sz + 2, sz + 2);
    ctx.fillStyle = t % 3 ? '#f8fafc' : '#bae6fd';
    ctx.fillRect(tx, ty, sz, sz);
  }
  ctx.restore();
}

// Open sea under the pillar with a whirlpool, and the waterspout once the ship is lifted
function drawScene3Whirlpool(ctx, subP, now, pose) {
  const W = SCENE3_WHIRL;
  ctx.save();
  // The ice tore open round the pillar's foot: a ragged hole of sea, deepest at the eye
  ctx.beginPath();
  for (let k = 0; k <= 28; k++) {
    const th = (k / 28) * Math.PI * 2;
    const jag = 1 + (((k * 53) % 11) - 5) * 0.025;
    const x = W.x + Math.cos(th) * (W.rx + 70) * jag;
    const y = W.y + Math.sin(th) * (W.ry + 34) * jag;
    if (k === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  const sea = ctx.createRadialGradient(W.x, W.y, 6, W.x, W.y, W.rx + 70);
  sea.addColorStop(0, '#020617');
  sea.addColorStop(0.25, '#082f49');
  sea.addColorStop(0.7, '#0e5a7e');
  sea.addColorStop(1, '#1b7aa3');
  ctx.fillStyle = sea;
  ctx.fill();
  ctx.strokeStyle = SCENE3_K;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.strokeStyle = '#e8f4fb';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Spinning foam arms
  const spin = now * 0.004;
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
  ctx.lineWidth = 3;
  for (let arm = 0; arm < 4; arm++) {
    ctx.beginPath();
    for (let k = 0; k <= 24; k++) {
      const s = k / 24;
      const th = spin + arm * (Math.PI / 2) + s * 3.2;
      const rr = 1 - s * 0.9;
      const x = W.x + Math.cos(th) * W.rx * rr;
      const y = W.y + Math.sin(th) * W.ry * rr;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Floes riding the funnel
  for (let f = 0; f < 5; f++) {
    const th = spin * 1.3 + f * 1.26;
    const rr = 0.55 + (f % 3) * 0.15;
    const fx = W.x + Math.cos(th) * W.rx * rr;
    const fy = W.y + Math.sin(th) * W.ry * rr;
    ctx.fillStyle = SCENE3_K;
    ctx.fillRect(Math.round(fx - 13), Math.round(fy - 5), 26, 10);
    ctx.fillStyle = '#eaf6fd';
    ctx.fillRect(Math.round(fx - 11), Math.round(fy - 3), 22, 5);
  }
  // Waterspout from the eye up to the ship once it is lifted
  if (pose.phase === 'spout' || pose.phase === 'beam') {
    const topY = Math.min(pose.y + 20, W.y - 30);
    const g = ctx.createLinearGradient(0, topY, 0, W.y);
    g.addColorStop(0, 'rgba(165, 243, 252, 0.55)');
    g.addColorStop(1, 'rgba(224, 242, 254, 0.9)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(W.x - 40, W.y);
    ctx.quadraticCurveTo(W.x - 8, (W.y + topY) / 2, pose.x - 55, topY);
    ctx.lineTo(pose.x + 55, topY);
    ctx.quadraticCurveTo(W.x + 8, (W.y + topY) / 2, W.x + 40, W.y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let k = 0; k < 10; k++) {
      const kp = ((now * 0.0018 + k * 0.1) % 1);
      const ky = W.y - kp * (W.y - topY);
      const kx = W.x + Math.sin(now * 0.01 + k * 2) * (12 + kp * 40) + (pose.x - W.x) * kp;
      ctx.fillRect(Math.round(kx), Math.round(ky), 5, 5);
    }
  } else {
    // Spray off the ship's bow as it is dragged round
    for (let t = 0; t < 8; t++) {
      const tp = (now * 0.004 + t * 0.125) % 1;
      const tx = pose.x + (pose.flip ? -1 : 1) * (100 + tp * 30);
      const ty = pose.y + 20 - Math.sin(tp * Math.PI) * 30;
      ctx.fillStyle = t % 2 ? '#f8fafc' : '#bae6fd';
      ctx.fillRect(Math.round(tx), Math.round(ty), 4, 4);
    }
  }
  ctx.restore();
}

function drawScene3Approach(ctx, vehicle, subP, now, pose) {
  if (vehicle === 'boat') drawScene3Whirlpool(ctx, subP, now, pose);
  else if (vehicle === 'car') {
    // The road it was fleeing along stays under the whole capture; the crack runs up to the car
    drawCarSnowRoad(ctx, SCENE3_ROAD_Y, 0, Math.max(80, Math.min(pose.x - 140, 760)));
    drawScene3CarSpray(ctx, pose, now);
  }
  else drawScene3PlaneSmoke(ctx, subP, now);
  drawScene3Ribbons(ctx, pose.x, pose.y, vehicle === 'boat' ? (pose.phase === 'whirl' ? 0 : pose.caught) : pose.caught);
}

// What the pilot yells before the scan starts
function scene3ApproachLine(vehicle, pose, ko) {
  if (vehicle === 'car') {
    if (pose.phase === 'drive') return ko ? '좋아 이대로 쭉 밟으면 탈출이다!!' : 'Nice, just keep it floored and we are out!!';
    if (pose.phase === 'drag') return ko ? '어?! 차가 옆으로 끌려간다!! 브레이크 안 먹혀!!' : 'Huh?! The car is being dragged!! The brakes do nothing!!';
    return ko ? '바퀴가 땅에서 떨어졌다?!! 끌려 올라간다아!!' : 'The wheels left the ground?!! It is pulling us up!!';
  }
  if (vehicle === 'boat') {
    if (pose.phase === 'whirl') return ko ? '으악 바다에 소용돌이가!! 배가 빙글빙글 빨려 들어간다!!' : 'A whirlpool!! The ship is spinning down into it!!';
    return ko ? '물기둥이 배를 들어 올린다?!! 저 기둥으로 간다아!!' : 'A waterspout is lifting the ship?!! Into the pillar!!';
  }
  if (pose.phase === 'fall') return ko ? '엔진 꺼졌다!! 추락한다 추락한다아악!!' : 'Engine is dead!! Going down, going down!!';
  return ko ? '어?! 떨어지다가 기둥이 비행기를 낚아챘다?!!' : 'Huh?! The pillar snatched the plane out of the fall?!!';
}

// The vortex background mirrored: the pillar stands on the left, so whatever flees right runs away from it
function drawRefVortexBackgroundMirrored(ctx, now) {
  ctx.save();
  ctx.translate(960, 0);
  ctx.scale(-1, 1);
  drawRefVortexBackground(ctx, now);
  ctx.restore();
}

// Scene 2: snow, ice chips and light streaks being sucked back into the pillar behind the fleeing vehicle
function drawScene1Suction(ctx, now, p) {
  const T = SCENE3_BEAM;
  ctx.save();
  for (let i = 0; i < 18; i++) {
    const ph = (now * (0.0006 + (i % 4) * 0.00015) + i * 0.137) % 1;
    const sy = 90 + ((i * 67) % 400);
    const x0 = 1000;
    const x = x0 - ph * (x0 - T.x);
    const y = sy + (T.y - sy) * ph * ph;
    const len = 18 + (i % 3) * 14 + ph * 30;
    ctx.globalAlpha = 0.25 + 0.5 * ph;
    if (i % 3 === 0) {
      ctx.fillStyle = SCENE3_K;
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 9, 9);
      ctx.fillStyle = i % 2 ? '#e0f2fe' : '#67e8f9';
      ctx.fillRect(Math.round(x), Math.round(y), 7, 7);
    } else {
      ctx.strokeStyle = i % 2 ? 'rgba(103, 232, 249, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y - (T.y - sy) * 0.04);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  // Red glow at the pillar's foot, fading as the vehicle gets away
  const a = Math.max(0, 0.8 - p);
  if (a > 0) {
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
    ctx.beginPath();
    ctx.ellipse(T.x, 470, 150 + Math.sin(now * 0.01) * 10, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// Odds and ends drifting past in the pillar (pixel art from strings, 4px per pixel)
const SCENE3_RISE_SPRITES = {
  watch: ['..KKK..', '.KYYYK.', 'KYWWWYK', 'KYWKWYK', 'KYWWKYK', '.KYYYK.', '..KKK..'],
  cup: ['KKKKK..', 'KWWWKKK', 'KWPWK.K', 'KWWWKKK', '.KWK...', 'KKKKK..'],
  fish: ['..KK....', '.KBBK.KK', 'KBWBBKBK', 'KBBBBBBK', '.KBBK.KK', '..KK....'],
  heart: ['.KK.KK.', 'KPPKPPK', 'KPPPPPK', '.KPPPK.', '..KPK..', '...K...'],
  cube: ['.KKKKK', 'KCCCCK', 'KCWCCK', 'KCCCCK', 'KKKKK.'],
  snow: ['...W...', '.W.W.W.', '..WWW..', 'WWWWWWW', '..WWW..', '.W.W.W.', '...W...'],
  card: ['KKKKK', 'KWWWK', 'KWRWK', 'KRRRK', 'KWRWK', 'KWWWK', 'KKKKK'],
};
const SCENE3_RISE_COLS = { K: '#0b1020', Y: '#facc15', W: '#ffffff', P: '#f472b6', B: '#38bdf8', C: '#67e8f9', R: '#dc2626' };

function drawScene3Sprite(ctx, rows, x, y, P, rot) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(rot);
  const w = rows[0].length;
  const h = rows.length;
  rows.forEach((row, ry) => {
    [...row].forEach((ch, rx) => {
      const col = SCENE3_RISE_COLS[ch];
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(Math.round((rx - w / 2) * P), Math.round((ry - h / 2) * P), P, P);
    });
  });
  ctx.restore();
}

// Shelves, framed pictures and maps on pegs along the pillar walls
function drawScene3Shelf(ctx, x, y, kind, seed) {
  const K = SCENE3_K;
  if (kind === 0) {
    // bookshelf
    ctx.fillStyle = K;
    ctx.fillRect(x - 2, y - 2, 92, 56);
    ctx.fillStyle = '#7c4a1e';
    ctx.fillRect(x, y, 88, 52);
    ctx.fillStyle = '#4a2c11';
    ctx.fillRect(x + 4, y + 4, 80, 20);
    ctx.fillRect(x + 4, y + 28, 80, 20);
    const books = ['#dc2626', '#2563eb', '#16a34a', '#facc15', '#9333ea', '#f472b6'];
    for (let r = 0; r < 2; r++) {
      for (let b = 0; b < 9; b++) {
        const bh = 14 + ((seed + b * 3 + r) % 5);
        ctx.fillStyle = books[(seed + b + r * 2) % books.length];
        ctx.fillRect(x + 6 + b * 9, y + 4 + r * 24 + (20 - bh), 7, bh);
      }
    }
  } else if (kind === 1) {
    // a picture on a peg: a penguin portrait
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 30, y - 10, 4, 10);
    ctx.fillStyle = K;
    ctx.fillRect(x + 8, y - 2, 48, 48);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x + 10, y, 44, 44);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(x + 16, y + 6, 32, 32);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(x + 24, y + 12, 16, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 28, y + 18, 8, 14);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(x + 30, y + 17, 4, 3);
  } else {
    // a map on a peg
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 36, y - 10, 4, 10);
    ctx.fillStyle = K;
    ctx.fillRect(x + 4, y - 2, 68, 44);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(x + 6, y, 64, 40);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 10, y + 6, 22, 12);
    ctx.fillRect(x + 40, y + 22, 24, 12);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x + 18, y + 22, 14, 10);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 48, y + 8, 4, 4);
  }
}

// Part 3 of scene 4 (r = 0..1): the pixel vehicle floats up inside the pillar, then shoots out of the top
function drawScene3Rise(ctx, now, r, vehicle, spId) {
  const ko = CURRENT_LANG === 'ko';
  ctx.save();
  ctx.globalAlpha = Math.min(1, r / 0.12);
  // Inside the beam: deep violet core, glowing walls
  const g = ctx.createLinearGradient(0, 0, 960, 0);
  g.addColorStop(0, '#1e1b4b');
  g.addColorStop(0.18, '#312e81');
  g.addColorStop(0.5, '#0c1a4a');
  g.addColorStop(0.82, '#312e81');
  g.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 960, 540);
  // How far it has risen: slowly, then very fast at the end
  const out = r < 0.72 ? 0 : Math.pow((r - 0.72) / 0.28, 2);
  const climb = r < 0.72 ? r * 900 : 648 + out * 2600;
  for (const side of [0, 1]) {
    const wx = side ? 790 : 0;
    ctx.fillStyle = side ? 'rgba(244, 114, 182, 0.18)' : 'rgba(103, 232, 249, 0.18)';
    ctx.fillRect(wx, 0, 170, 540);
    ctx.fillStyle = side ? '#f472b6' : '#67e8f9';
    ctx.fillRect(side ? 788 : 168, 0, 4, 540);
    for (let k = 0; k < 14; k++) {
      const ly = ((k * 61 + climb * 1.4) % 600) - 30;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(wx + 10 + ((k * 37) % 140), Math.round(ly), 18, 2);
    }
  }
  // Shelves, pictures and maps pass by on the walls
  for (let k = 0; k < 10; k++) {
    const yy = ((k * 190 + climb) % 1900) - 120;
    if (yy < -80 || yy > 600) continue;
    const left = k % 2 === 0;
    drawScene3Shelf(ctx, left ? 40 + (k % 3) * 10 : 820 - (k % 3) * 10, yy, k % 3, k * 7);
  }
  // Odds and ends drifting past, slowly turning
  const names = Object.keys(SCENE3_RISE_SPRITES);
  for (let k = 0; k < 9; k++) {
    const yy = ((k * 137 + climb * 0.7) % 820) - 140;
    const xx = 230 + ((k * 211) % 500) + Math.sin(now * 0.001 + k) * 16;
    if (Math.abs(xx - 480) < 130 && yy > 160 && yy < 420) continue; // keep clear of the vehicle
    drawScene3Sprite(ctx, SCENE3_RISE_SPRITES[names[k % names.length]], xx, yy, 4, Math.sin(now * 0.0012 + k * 1.7) * 0.6);
  }
  // The vehicle: drifting up the middle, tumbling slowly; at the end it shoots out of the top
  const vx = 480 + Math.sin(now * 0.0016) * 40;
  const vy = 300 - r * 40 - out * 560;
  const tilt = Math.sin(now * 0.0014) * 0.45 + out * 1.4;
  const S = 1 - out * 0.5;
  if (vehicle === 'car') {
    drawPixelCarWithPilot(ctx, vx, vy, tilt, now, { scale: S, spId, isShocked: true, beam: false, wheelAngle: now * 0.02 });
  } else if (vehicle === 'boat') {
    drawBoatWithPilot(ctx, vx, vy, tilt, now, { scale: SCENE3_BOAT_SCALE * S, spId, pixelMode: true, isShocked: true });
  } else {
    drawPixelPlaneWithPilot(ctx, vx, vy, tilt, now, { scale: 0.9 * S, spId, isShocked: true });
  }
  if (out > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.5 * out).toFixed(2)})`;
    for (let k = 0; k < 20; k++) ctx.fillRect(200 + ((k * 97) % 560), (k * 53 + climb * 2) % 540, 3, 40 + out * 80);
  }
  ctx.globalAlpha = 1;
  if (r > 0.1 && r < 0.9) {
    const line =
      r < 0.68
        ? ko
          ? '위로 위로 위로... 이 기둥 끝이 있긴 한 거야?!'
          : 'Up, up, up... does this pillar ever end?!'
        : ko
        ? '어어 갑자기 빨라진다?! 저 위에 뭐가 보여어어!!'
        : 'Whoa, it is speeding up?! Something up there!!';
    drawRetroSpeechBubble(ctx, Math.min(620, vx + 40), Math.max(70, vy - 120), line, '#a78bfa', now);
  }
  // White flash into the town
  if (r > 0.86) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, (r - 0.86) / 0.14).toFixed(2)})`;
    ctx.fillRect(0, 0, 960, 540);
  }
  ctx.restore();
}

// SNES-style mosaic (SNESLab, register 2106h: each size x size block takes the colour of its top-left pixel, size
// 1..16): what drawFn paints is shown in blocks of `size` stage px. Used on the not-yet-scanned 2D part of the
// vehicle so it breaks up into ever bigger blocks before the scan line turns it into clean pixel art.
let SCENE3_MOSAIC = null;
function drawScene3Mosaic(ctx, size, drawFn) {
  if (size <= 1 || typeof document === 'undefined') {
    drawFn(ctx);
    return;
  }
  if (!SCENE3_MOSAIC) {
    const full = document.createElement('canvas');
    full.width = 960;
    full.height = 540;
    SCENE3_MOSAIC = { full, small: document.createElement('canvas') };
  }
  const { full, small } = SCENE3_MOSAIC;
  const fctx = full.getContext('2d');
  fctx.setTransform(1, 0, 0, 1, 0, 0);
  fctx.clearRect(0, 0, 960, 540);
  drawFn(fctx);
  const w = Math.ceil(960 / size);
  const h = Math.ceil(540 / size);
  if (small.width !== w || small.height !== h) {
    small.width = w;
    small.height = h;
  }
  const sctx = small.getContext('2d');
  sctx.imageSmoothingEnabled = false;
  sctx.clearRect(0, 0, w, h);
  sctx.drawImage(full, 0, 0, w * size, h * size, 0, 0, w, h);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, w, h, 0, 0, w * size, h * size);
  ctx.restore();
}
