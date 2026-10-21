// ============================================================================
// SCENE 4 approach — how each vehicle ends up in the pixel pillar before the pixel scan (app.js, sceneIdx 3)
//   plane: the engine dies, it spins down trailing smoke, and the beam snatches it out of the fall;
//   car:   it is driving along fine, the beam lassoes it, drags it skidding across the ice and lifts it;
//   ship:  the sea opens into a whirlpool under the pillar, the ship circles down the funnel and a waterspout
//          carries it up into the beam.
// scene3Pose() is pure (time in, position out), so trails are just earlier poses.
// ============================================================================
const SCENE3_BEAM = { x: 665, y: 262 };
const SCENE3_APPROACH = 0.34; // share of the scene spent getting into the beam; the scan follows
const SCENE3_WHIRL = { x: 670, y: 446, rx: 210, ry: 54 };
const SCENE3_BOAT_SCALE = 0.75;
const SCENE3_K = '#090d1a';

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
    const groundOriginY = 440 - 57 * 1.3; // tyres on the ice at y = 440
    if (a < 0.35) {
      const d = a / 0.35;
      return { x: 90 + d * 210, y: groundOriginY - Math.abs(Math.sin(now * 0.03)) * 3, tilt: 0, flip: false, caught: 0, phase: 'drive' };
    }
    if (a < 0.75) {
      const g = scene3Smooth((a - 0.35) / 0.4);
      const shake = Math.sin(now * 0.09) * 2;
      return { x: 300 + g * 250 + shake, y: groundOriginY + shake * 0.5, tilt: -0.07 + Math.sin(now * 0.05) * 0.03, flip: false, caught: g, phase: 'drag' };
    }
    const l = scene3Smooth((a - 0.75) / 0.25);
    return {
      x: 550 + l * (T.x - 550),
      y: groundOriginY + l * (T.y - groundOriginY) + hover * l,
      tilt: -0.07 + Math.sin(l * Math.PI) * 0.22,
      flip: false,
      caught: 1,
      phase: 'lift',
    };
  }

  if (vehicle === 'boat') {
    const W = SCENE3_WHIRL;
    const wl = 34 * SCENE3_BOAT_SCALE; // origin sits this far above the waterline
    const spiralAt = (s) => {
      const th = Math.PI + s * 2.3 * Math.PI;
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
      x: 170 + f * 260,
      y: 70 + Math.pow(f, 1.6) * 250,
      tilt: 0.35 + f * 0.25 + Math.sin(now * 0.03) * 0.12,
      flip: false,
      caught: 0,
      phase: 'fall',
    };
  }
  const c = scene3Smooth((a - 0.55) / 0.45);
  return {
    x: scene3Bezier(430, 560, T.x, c),
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
    ctx.moveTo(SCENE3_BEAM.x + 20, SCENE3_BEAM.y - 30 + yOff * 0.4);
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
  const groundY = 440;
  ctx.save();
  // Ground shadow + skid marks behind the drag
  ctx.fillStyle = 'rgba(9, 13, 26, 0.3)';
  ctx.beginPath();
  ctx.ellipse(pose.x, groundY + 2, 110, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  if (pose.phase === 'drag') {
    ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.fillRect(300 - 80, groundY - 2, pose.x - 300, 4);
  }
  const n = pose.phase === 'drag' ? 14 : 8;
  for (let t = 0; t < n; t++) {
    const tp = (now * 0.004 + t * (1 / n)) % 1;
    const wheelX = pose.x + (t % 2 ? 76 : -72);
    const dir = pose.phase === 'drag' ? 1 : -1; // dragged: snow flies ahead of the tyres
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
  else if (vehicle === 'car') drawScene3CarSpray(ctx, pose, now);
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
