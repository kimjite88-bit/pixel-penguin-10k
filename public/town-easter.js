// ============================================================================
// TOWN EASTER EGG — "the dev's hidden village". Only for players who skipped the game (안 해요 / left alone at the
// picker) and then just stayed in the town: once the welcome talk is over and the town has been open 30 s, the
// locals stop, say "follow me", and all walk off to the left; a pixel-block dissolve opens a hidden Christmas
// village (bg_easter_village.jpg, the owner's reference picture) where the whole cast walks in, lines up for a
// group photo with a snowman that turns out to be the dev, and trades B-grade lines, round and round.
// The town menu stays where it is (same box, same clicks), so 10,000 CODEX / PLAY AGAIN still work; PLAY AGAIN
// leaves the village for good (the next town starts from scratch).
// ============================================================================
const TOWN_EASTER = { leaveAt: 30000, cutAt: 33400, dissolveMs: 380, walkInMs: 2600 };
const TOWN_EASTER_CAST = [
  // species, x, feet y, size: the guest first, then the six locals, a group-photo row along the front (larger than
  // the penguins painted into the picture, on a dark band, so the cast reads as the cast)
  { sp: '01', x: 248, feet: 534, size: 92 },
  { sp: '05', x: 348, feet: 530, size: 88 },
  { sp: '22', x: 448, feet: 534, size: 90 },
  { sp: '04', x: 548, feet: 530, size: 88, gift: true },
  { sp: '09', x: 648, feet: 534, size: 90, dance: true },
  { sp: '10', x: 748, feet: 530, size: 88 },
  { sp: '06', x: 848, feet: 534, size: 90 },
];
const TOWN_EASTER_SNOWMAN = { x: 132, feet: 534 };
// Lantern glows and chimney puffs placed on the picture (stage coordinates)
const TOWN_EASTER_LIGHTS = [
  [170, 358], [392, 412], [518, 496], [464, 210], [570, 228], [744, 290], [808, 310], [885, 328], [903, 243], [944, 158], [150, 258], [82, 250],
];
const TOWN_EASTER_CHIMNEYS = [[65, 72], [240, 140]];
const TOWN_EASTER_STAR = [340, 132];
// Who says what (cast index, or 'snow' for the snowman), turn by turn
const TOWN_EASTER_TALK = [
  { who: 1, col: '#ff4d6d', ko: '여기가 제작자가 숨겨둔 이스터에그 마을이래! 30초 버틴 펭귄만 옴 ㅋㅋ', en: "This is the dev's hidden Easter egg village! Only penguins who wait 30 s get in lol" },
  { who: 0, col: '#38bdf8', ko: '게임도 안 했는데 보상 받는 거 실화냐 ㅋㅋㅋ', en: 'Got a reward for doing literally nothing lol' },
  { who: 'snow', col: '#e2e8f0', ko: '...사실 나 눈사람 아니고 제작자임. 일 안 하고 이거 그리고 있었음', en: "...I'm not a snowman. I'm the dev. Drew this instead of working" },
  { who: 3, col: '#fbbf24', ko: '선물 까봤는데 또 펭귄 NFT임 ㅋㅋ 사신다고 뭐 안 드린다며!!', en: 'Opened my gift: another penguin NFT lol. You said zero perks!!' },
  { who: 4, col: '#4ade80', ko: '다 같이 단체사진 찍자! 하나 둘 셋, 펭~귄!', en: 'Group photo! One, two, three, say PENGUIN!', flash: true },
  { who: 5, col: '#fb7185', ko: '캡처해서 베리챗에 자랑해. 아는 펭귄만 아는 곳임 ㅋ', en: 'Screenshot this for VeryChat. Only real ones know this place' },
  { who: 6, col: '#a78bfa', ko: '근데 다시 플레이 누르면 이 마을 사라짐. 진짜임', en: 'Press PLAY AGAIN and this village is gone. For real' },
  { who: 2, col: '#2dd4bf', ko: '얼음낚시 3시간째 입질 0... 이게 크리스마스지', en: '3 hours of ice fishing, zero bites... that is Christmas' },
];
const TOWN_EASTER_TURN_MS = 3400;

const TOWN_EASTER_STATE = { img: null, loaded: false, chimedFor: 0 };

function townEasterImage() {
  if (!TOWN_EASTER_STATE.img) {
    const img = new Image();
    img.onload = () => {
      TOWN_EASTER_STATE.loaded = true;
    };
    img.src = '/assets/motion_sprites/bg_easter_village.jpg?v=1';
    TOWN_EASTER_STATE.img = img;
  }
  return TOWN_EASTER_STATE.loaded ? TOWN_EASTER_STATE.img : null;
}

// Only in a skipped town; the picture is fetched 10 s ahead so the cut never waits for it
function townEasterOn() {
  return MOTION_STATE.sceneIdx === 4 && MOTION_STATE.skippedEscape;
}
function townEasterElapsed(now) {
  return now - MOTION_STATE.sceneStartTime;
}
// How far (px) a town penguin has walked off to the left; i = its order in the row, left to right
function townEasterLeaveDx(elapsed, i) {
  if (!townEasterOn()) return 0;
  if (elapsed > TOWN_EASTER.leaveAt - 10000) townEasterImage();
  const d = elapsed - TOWN_EASTER.leaveAt - i * 110;
  return d > 0 ? Math.min(1200, d * 0.36 + d * d * 0.00004) : 0;
}
function townEasterLeaving(elapsed) {
  return townEasterOn() && elapsed >= TOWN_EASTER.leaveAt && elapsed < TOWN_EASTER.cutAt;
}
// The village covers the whole stage (the town under it need not draw its background)
function townEasterCovers(elapsed) {
  return townEasterOn() && elapsed >= TOWN_EASTER.cutAt && TOWN_EASTER_STATE.loaded;
}

// Bubbles while they leave: the guest is confused, a local waves it along
function drawTownEasterLeaveTalk(ctx, now, elapsed, heroX, friendX, spriteY, spriteSize) {
  const ko = CURRENT_LANG === 'ko';
  const d = elapsed - TOWN_EASTER.leaveAt;
  if (d < 1500) {
    drawRetroSpeechBubble(ctx, friendX + spriteSize / 2, spriteY - 6, ko ? '쉿! 제작자가 숨겨둔 데 있어. 따라와~' : "Psst! The dev hid something. Follow me~", '#ff4d6d', now);
  } else {
    drawRetroSpeechBubble(ctx, Math.max(120, heroX + spriteSize / 2), spriteY - 6, ko ? '어? 다들 어디 가?? 나도 데려가!!' : 'Wait, where is everyone going?? Take me too!!', '#38bdf8', now);
  }
}

// One-colour-per-part pixel snowman (2px grid): three balls, coal eyes and buttons, carrot, red scarf, top hat,
// a stick arm that waves
function drawTownEasterSnowman(ctx, x, feet, now, talking) {
  const disc = (cx, cy, r, c) => {
    if (typeof fillPixelDisc === 'function') fillPixelDisc(ctx, cx, cy, r, c);
    else {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  const K = '#0b1020';
  const bob = talking && Math.floor(now / 200) % 2 ? -2 : 0;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(feet + bob));
  ctx.fillStyle = 'rgba(30, 41, 59, 0.3)';
  ctx.fillRect(-26, -4, 52, 6);
  disc(0, -24, 25, K);
  disc(0, -24, 23, '#f8fafc');
  disc(0, -62, 19, K);
  disc(0, -62, 17, '#f8fafc');
  disc(0, -92, 14, K);
  disc(0, -92, 12, '#ffffff');
  // Shade on the right of each ball
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(12, -36, 8, 22);
  ctx.fillRect(9, -70, 6, 16);
  ctx.fillRect(6, -98, 4, 10);
  // Stick arms: the left one waves
  const wave = Math.sin(now * 0.008) * 0.5;
  ctx.fillStyle = '#7c4a1d';
  ctx.save();
  ctx.translate(-16, -66);
  ctx.rotate(-0.6 + wave);
  ctx.fillRect(-30, -2, 30, 4);
  ctx.fillRect(-30, -8, 4, 8);
  ctx.restore();
  ctx.save();
  ctx.translate(16, -66);
  ctx.rotate(0.35);
  ctx.fillRect(0, -2, 28, 4);
  ctx.restore();
  // Face, carrot, scarf, buttons, hat
  ctx.fillStyle = K;
  ctx.fillRect(-6, -98, 4, 4);
  ctx.fillRect(3, -98, 4, 4);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, -91, 12, 4);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-14, -80, 28, 6);
  ctx.fillRect(6, -76, 6, 14);
  ctx.fillStyle = K;
  ctx.fillRect(-2, -66, 4, 4);
  ctx.fillRect(-2, -56, 4, 4);
  ctx.fillRect(-2, -36, 4, 4);
  ctx.fillRect(-2, -26, 4, 4);
  const tilt = talking ? Math.sin(now * 0.01) * 0.12 : 0;
  ctx.save();
  ctx.translate(0, -104);
  ctx.rotate(tilt);
  ctx.fillRect(-16, -2, 32, 4);
  ctx.fillRect(-10, -20, 20, 18);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-10, -6, 20, 3);
  ctx.restore();
  ctx.restore();
}

function drawTownEasterGift(ctx, x, y) {
  ctx.fillStyle = '#0b1020';
  ctx.fillRect(x - 11, y - 11, 22, 20);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x - 9, y - 9, 18, 16);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(x - 2, y - 9, 4, 16);
  ctx.fillRect(x - 9, y - 3, 18, 4);
  ctx.fillRect(x - 6, y - 14, 4, 5);
  ctx.fillRect(x + 2, y - 14, 4, 5);
}

// The village itself; called at the end of the town frame (the menu is drawn again on top so it keeps working)
function drawTownEaster(ctx, now, elapsed) {
  if (!townEasterOn()) return;
  const t = elapsed - TOWN_EASTER.cutAt;
  const ko = CURRENT_LANG === 'ko';
  // Pixel-block dissolve: the town closes up (the walk-off ends under it), the village opens
  const half = TOWN_EASTER.dissolveMs;
  if (t < -half) return;
  const img = townEasterImage();
  if (t >= 0 && img) {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0, 960, 540);
    // Lantern glows breathing, each on its own beat
    ctx.globalCompositeOperation = 'lighter';
    TOWN_EASTER_LIGHTS.forEach(([lx, ly], i) => {
      const a = 0.18 + 0.14 * Math.sin(now * 0.003 + i * 1.7);
      const g = ctx.createRadialGradient(lx, ly, 1, lx, ly, 26);
      g.addColorStop(0, `rgba(253, 224, 140, ${a.toFixed(3)})`);
      g.addColorStop(1, 'rgba(253, 224, 140, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(lx - 26, ly - 26, 52, 52);
    });
    // The tree star twinkles on the town beat
    const beat = typeof townBeat === 'function' ? townBeat(now) : now / 425;
    const sp = beat >= 0 ? Math.pow(1 - (beat % 1), 2) : 0.5;
    const [sx, sy] = TOWN_EASTER_STAR;
    const sg = ctx.createRadialGradient(sx, sy, 1, sx, sy, 34);
    sg.addColorStop(0, `rgba(255, 244, 184, ${(0.25 + sp * 0.4).toFixed(3)})`);
    sg.addColorStop(1, 'rgba(255, 244, 184, 0)');
    ctx.fillStyle = sg;
    ctx.fillRect(sx - 34, sy - 34, 68, 68);
    ctx.globalCompositeOperation = 'source-over';
    // Chimney smoke
    TOWN_EASTER_CHIMNEYS.forEach(([cx, cy], i) => {
      for (let k = 0; k < 4; k++) {
        const q = ((now / 2600 + k / 4 + i * 0.3) % 1);
        ctx.globalAlpha = (1 - q) * 0.45;
        ctx.fillStyle = '#e2e8f0';
        const s = Math.round(6 + q * 12);
        ctx.fillRect(Math.round(cx + Math.sin(q * 6 + i) * 6 - s / 2), Math.round(cy - q * 46 - s / 2), s, s);
      }
    });
    ctx.globalAlpha = 1;
    // Snow
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let k = 0; k < 46; k++) {
      const far = k % 2;
      const x = (k * 97 + now * (far ? 0.012 : 0.028) + Math.sin(now * 0.001 + k) * 10) % 980 - 10;
      const y = (k * 53 + now * (far ? 0.022 : 0.05)) % 560 - 10;
      ctx.fillRect(Math.round(x), Math.round(y), far ? 2 : 3, far ? 2 : 3);
    }

    // A dark band along the front so the cast stands out from the painted crowd
    const band = ctx.createLinearGradient(0, 400, 0, 540);
    band.addColorStop(0, 'rgba(9, 13, 26, 0)');
    band.addColorStop(1, 'rgba(9, 13, 26, 0.6)');
    ctx.fillStyle = band;
    ctx.fillRect(0, 400, 960, 140);
    // The cast walks in from the right, then lines up for the photo (hopping on the beat)
    const talkT = t - TOWN_EASTER.walkInMs;
    const turn = talkT >= 0 ? Math.floor(talkT / TOWN_EASTER_TURN_MS) % TOWN_EASTER_TALK.length : -1;
    const line = turn >= 0 ? TOWN_EASTER_TALK[turn] : null;
    const spots = [];
    drawTownEasterSnowman(ctx, TOWN_EASTER_SNOWMAN.x, TOWN_EASTER_SNOWMAN.feet, now, line && line.who === 'snow');
    TOWN_EASTER_CAST.forEach((c, i) => {
      const q = Math.min(1, Math.max(0, (t - i * 140) / (TOWN_EASTER.walkInMs - 900)));
      const e = 1 - (1 - q) * (1 - q);
      const x = 1040 + i * 30 + (c.x - 1040 - i * 30) * e;
      const walking = q < 1;
      const tb = typeof townBeat === 'function' ? townBeat(now) : 0;
      const hop = !walking && (c.dance || (Math.floor(tb) + i) % 3 === 0) && tb % 1 < 0.3 ? (c.dance ? 8 : 4) : 0;
      const top = c.feet - c.size * (243 / 256) - hop;
      if (typeof drawPixelGroundShadow === 'function') drawPixelGroundShadow(ctx, x, c.feet - 2, c.size * 0.55, hop);
      drawAnimatedPixelPenguin(ctx, ensureSpeciesSprite(c.sp), x - c.size / 2, top, c.size, now, {
        seed: 20 + i,
        isWalking: walking || !!c.dance,
        flipX: walking ? true : i % 2 === 1,
        santaHat: true,
      });
      if (c.gift && !walking) drawTownEasterGift(ctx, x + c.size * 0.32, c.feet - c.size * 0.34);
      spots.push({ x, top });
    });
    // "Say PENGUIN!": a camera flash over the group photo
    if (line && line.flash) {
      const ft = (talkT % TOWN_EASTER_TURN_MS) - 1600;
      if (ft >= 0 && ft < 260) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.8 * (1 - ft / 260)).toFixed(3)})`;
        ctx.fillRect(0, 0, 960, 540);
      }
    }

    // Secret banner across the top
    const label = ko ? '제작자가 숨겨둔 이스터에그 발견!' : "SECRET FOUND · the dev's hidden Easter egg";
    ctx.save();
    const bk = Math.min(typeof stageUiK === 'function' ? stageUiK() : 1, 1.4);
    ctx.translate(480, 8);
    ctx.scale(bk, bk);
    ctx.translate(-480, -8);
    ctx.font = '900 15px "Pretendard", "Malgun Gothic", sans-serif';
    const bw = Math.ceil(ctx.measureText(label).width) + 64;
    const bx = Math.round(480 - bw / 2);
    ctx.fillStyle = 'rgba(9, 13, 26, 0.9)';
    ctx.fillRect(bx - 2, 8, bw + 4, 36);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(bx, 10, bw, 32);
    const star = (cx, cy) => {
      ctx.fillStyle = '#fde047';
      ctx.fillRect(cx - 1, cy - 6, 2, 12);
      ctx.fillRect(cx - 6, cy - 1, 12, 2);
      ctx.fillRect(cx - 3, cy - 3, 6, 6);
    };
    const tw = Math.floor(now / 300) % 2;
    star(bx + 18, 26 - tw);
    star(bx + bw - 18, 26 - (1 - tw));
    ctx.fillStyle = '#fef9c3';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 480, 27);
    ctx.restore();

    // The town menu, unchanged (same box, same clicks)
    if (typeof drawTownMenuBox === 'function') {
      const menu = drawTownMenuBox(ctx);
      MOTION_STATE.bubbleMinY = menu.y + menu.h + 14;
    }
    // Whoever's turn it is talks
    if (line) {
      const who = line.who === 'snow' ? { x: TOWN_EASTER_SNOWMAN.x, top: TOWN_EASTER_SNOWMAN.feet - 128 } : spots[line.who];
      drawRetroSpeechBubble(ctx, Math.max(110, Math.min(850, who.x)), who.top - 4, ko ? line.ko : line.en, line.col, now);
    }
    ctx.restore();
    // A little chime when it opens (music switch)
    if (TOWN_EASTER_STATE.chimedFor !== MOTION_STATE.sceneStartTime) {
      TOWN_EASTER_STATE.chimedFor = MOTION_STATE.sceneStartTime;
      if (typeof playEasterChime === 'function') playEasterChime();
    }
  }
  // Dissolve on top: blocks fill in left to right (the way they walked) before the cut, clear after it
  if (t < half) {
    const p = t < 0 ? (t + half) / half : 1 - t / half;
    const S = 48;
    for (let gy = 0; gy < 540 / S; gy++) {
      for (let gx = 0; gx < 960 / S; gx++) {
        const h = Math.sin((gx * 31 + gy * 7) * 127.1 + 311.7) * 43758.5453;
        const order = (gx / 20) * 0.6 + (h - Math.floor(h)) * 0.4;
        if (order > p) continue;
        ctx.fillStyle = p - order < 0.06 ? '#fde047' : '#0b1020';
        ctx.fillRect(gx * S, gy * S, S, S);
      }
    }
  }
}
