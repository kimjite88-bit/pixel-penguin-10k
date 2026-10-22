// ============================================================================
// TOWN EASTER EGG — "the dev's hidden village". Only for players who skipped the game (안 해요 / left alone at the
// picker) and then just stayed in the town: once the welcome talk is over and the town has been open 30 s, the
// locals stop, say "follow me", and all walk off to the left; the town carol stops, and with a thud (the screen
// shakes) and a carol of its own (audio.js easterCues) a pixel-block dissolve opens a hidden Christmas
// village (easter-village.js: pixel art made after the owner's reference, every villager in it busy) where the
// whole cast walks in next to a snowman that turns out to be the dev. B-grade story (TOWN_EASTER_TALK): the egg
// gives nothing, the guest wants to go home to bed, but it's Christmas - everyone pairs off, even the dev, and the
// guest is left alone under its own rain cloud.
// The town menu stays where it is (same box, same clicks), so 10,000 CODEX / PLAY AGAIN still work; PLAY AGAIN
// leaves the village for good (the next town starts from scratch).
// ============================================================================
const TOWN_EASTER = { leaveAt: 30000, cutAt: 33400, dissolveMs: 380, walkInMs: 2600 };
const TOWN_EASTER_CAST = [
  // species, x, feet y, size: the guest first, then the six locals, a group-photo row along the front (larger than
  // the villagers, on the shaded snow bank, so the cast reads as the cast)
  { sp: '01', x: 226, feet: 534, size: 88 },
  { sp: '05', x: 316, feet: 530, size: 84 },
  { sp: '22', x: 406, feet: 534, size: 86 },
  { sp: '04', x: 496, feet: 530, size: 84, gift: true },
  { sp: '09', x: 586, feet: 534, size: 86, dance: true },
  { sp: '10', x: 676, feet: 530, size: 84 },
  { sp: '06', x: 766, feet: 534, size: 86 },
];
const TOWN_EASTER_SNOWMAN = { x: 104, feet: 534 };
// The story, turn by turn (who = cast index, or 'snow' for the snowman). Three acts, built the stand-up way:
// 1) the reward that isn't - "none", then the dev's "consistent" (the site's own "no perks" line), then the green
//    one's "told you" (its line in the town: "absolutely nothing over there"); 2) Christmas: the three couples form
//    one after another, casual, sweet, then the gift (a penguin NFT, again); 3) the guest's last hope, the dev, has a
//    date too, and it breaks. Afterwards it keeps mumbling "take me too" (what it shouted following them here),
//    while the carol stays merry. stamp = the "reward: none" tag, pair = that couple forms, give = the gift changes
//    hands, faceDev = the guest turns to the snowman, snowDate = the snowman's date slides in, otl = the guest
//    slumps.
const TOWN_EASTER_TALK = [
  { who: 0, col: '#38bdf8', ko: '이스터에그 찾았다!! 보상 뭐임? 뭐 줌? 뭐 줌??', en: 'Found the Easter egg!! So what do I get? Huh? Huh??' },
  { who: 'snow', col: '#e2e8f0', ko: '...나 눈사람 아니고 제작자임. 보상? 그런 거 없음', en: "...I'm not a snowman, I'm the dev. Reward? There isn't one", stamp: true },
  { who: 1, col: '#ff4d6d', ko: '에이~ 숨겨둔 마을인데 뭐 하나쯤은 있겠지?', en: 'Come on~ a secret village has to have SOMETHING?' },
  { who: 'snow', col: '#e2e8f0', ko: 'NFT도 혜택 없음, 이스터에그도 없음. 일관성 오짐', en: 'No perks on the NFT, none in the egg. Consistent, right?' },
  { who: 4, col: '#4ade80', ko: '거봐, 아까 내가 진짜 아무것도 없다 했잖아 ㅋㅋ', en: 'Told you back in town. Absolutely nothing lol' },
  { who: 0, col: '#38bdf8', ko: '허무하네... 집 가서 잠이나 자야지. 다들 가자~', en: "What a letdown... home to sleep then. Let's go, guys~" },
  { who: 5, col: '#fb7185', ko: '응? 난 약속 있는데? 오늘 크리스마스잖아 ㅋ', en: "Huh? I've got plans. It's Christmas lol", pair: 0 },
  { who: 1, col: '#ff4d6d', ko: '나도~ 자기야, 우리 트리 보러 가자 ♥', en: "Me too~ babe, let's go see the tree ♥", pair: 1 },
  { who: 3, col: '#fbbf24', ko: '이 선물... 사실 너 주려고 산 거야', en: 'This gift... I actually got it for you', pair: 2, give: true },
  { who: 4, col: '#4ade80', ko: '열어보니 또 펭귄 NFT네... 근데 좋아 ♥', en: 'Another penguin NFT... but I love it ♥' },
  { who: 0, col: '#38bdf8', ko: '...어? 다들?? 제작자님은 솔로죠? 우리 치킨 ㄱ?', en: "...Wait, all of you?? Dev, you're single, right? Pizza night?", faceDev: true },
  { who: 'snow', col: '#e2e8f0', ko: '미안. 나 오늘 눈사람이랑 약속 있음', en: 'Sorry. I have a date with a snowwoman tonight', snowDate: true },
  { who: 0, col: '#38bdf8', ko: '...크리스마스 취소해 주세요', en: '...Please cancel Christmas', otl: true },
];
// After the story: the guest mumbles now and then (null = a quiet turn)
const TOWN_EASTER_END = [
  { who: 0, col: '#38bdf8', ko: '나도... 데려가......', en: 'Take me too......' },
  null,
  { who: 0, col: '#38bdf8', ko: '내년엔... 꼭......', en: 'Next year... for sure......' },
  null,
];
// The couples, as cast indices (left one, right one), in the order they form
const TOWN_EASTER_PAIRS = [
  [5, 6],
  [1, 2],
  [3, 4],
];
const TOWN_EASTER_TURN_MS = 3400;
// When (ms after the cut) each story event happens: the stamp, each couple, the gift, the turn, the date, the slump
function townEasterEvents() {
  if (!TOWN_EASTER_STATE.events) {
    const ev = { pairs: [], stamp: Infinity, give: Infinity, faceDev: Infinity, snowDate: Infinity, otl: Infinity };
    TOWN_EASTER_TALK.forEach((l, i) => {
      const at = TOWN_EASTER.walkInMs + i * TOWN_EASTER_TURN_MS;
      if (l.pair !== undefined) ev.pairs[l.pair] = at;
      if (l.give) ev.give = at + 1400;
      ['stamp', 'faceDev', 'snowDate', 'otl'].forEach((k) => {
        if (l[k]) ev[k] = at;
      });
    });
    TOWN_EASTER_STATE.events = ev;
  }
  return TOWN_EASTER_STATE.events;
}
const TOWN_EASTER_STATE = { events: null };
// The village has its own carol (audio.js easterCues): a thud on the cut, four beats of lead-in, then Joy to the
// World at 150 BPM. The tree lights and the hops follow its beat.
const TOWN_EASTER_BEAT_MS = 400;
const TOWN_EASTER_LEADIN = 4;
// Beats since the carol's first note (negative during the lead-in)
function easterBeat(now) {
  return (now - MOTION_STATE.sceneStartTime - TOWN_EASTER.cutAt) / TOWN_EASTER_BEAT_MS - TOWN_EASTER_LEADIN;
}

// Only in a skipped town
function townEasterOn() {
  return MOTION_STATE.sceneIdx === 4 && MOTION_STATE.skippedEscape;
}
function townEasterElapsed(now) {
  return now - MOTION_STATE.sceneStartTime;
}
// How far (px) a town penguin has walked off to the left; i = its order in the row, left to right
function townEasterLeaveDx(elapsed, i) {
  if (!townEasterOn()) return 0;
  const d = elapsed - TOWN_EASTER.leaveAt - i * 110;
  return d > 0 ? Math.min(1200, d * 0.36 + d * d * 0.00004) : 0;
}
function townEasterLeaving(elapsed) {
  return townEasterOn() && elapsed >= TOWN_EASTER.leaveAt && elapsed < TOWN_EASTER.cutAt;
}
// The village covers the whole stage (the town under it need not draw its background)
function townEasterCovers(elapsed) {
  return townEasterOn() && elapsed >= TOWN_EASTER.cutAt;
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
// a stick arm that waves. opts.girl = his date (smaller, pink scarf and bow, lashes, blush); opts.flip = facing left
function drawTownEasterSnowman(ctx, x, feet, now, talking, opts = {}) {
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
  if (opts.flip) ctx.scale(-1, 1);
  if (opts.girl) ctx.scale(0.84, 0.84);
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
  ctx.fillStyle = opts.girl ? '#f472b6' : '#dc2626';
  ctx.fillRect(-14, -80, 28, 6);
  ctx.fillRect(6, -76, 6, 14);
  if (opts.girl) {
    ctx.fillStyle = K;
    ctx.fillRect(-8, -102, 2, 2);
    ctx.fillRect(7, -102, 2, 2);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(-10, -92, 4, 2);
    ctx.fillRect(7, -92, 4, 2);
  }
  ctx.fillStyle = K;
  ctx.fillRect(-2, -66, 4, 4);
  ctx.fillRect(-2, -56, 4, 4);
  ctx.fillRect(-2, -36, 4, 4);
  ctx.fillRect(-2, -26, 4, 4);
  const tilt = talking ? Math.sin(now * 0.01) * 0.12 : 0;
  ctx.save();
  ctx.translate(0, -104);
  ctx.rotate(tilt);
  if (opts.girl) {
    // A pink bow instead of the hat
    ctx.fillStyle = K;
    ctx.fillRect(-14, -8, 28, 10);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-12, -6, 10, 6);
    ctx.fillRect(2, -6, 10, 6);
    ctx.fillStyle = '#be185d';
    ctx.fillRect(-2, -6, 4, 6);
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(-10, -6, 4, 2);
    ctx.fillRect(4, -6, 4, 2);
  } else {
    ctx.fillRect(-16, -2, 32, 4);
    ctx.fillRect(-10, -20, 20, 18);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-10, -6, 20, 3);
  }
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
  // Start loading the village art as soon as a skipped town opens, so it is there at the cut
  if (typeof evEnsure === 'function') evEnsure();
  const t = elapsed - TOWN_EASTER.cutAt;
  const ko = CURRENT_LANG === 'ko';
  // Pixel-block dissolve: the town closes up (the walk-off ends under it), the village opens
  const half = TOWN_EASTER.dissolveMs;
  if (t < -half) return;
  // The thud on the cut shakes the screen for a moment
  const shake = t >= 0 && t < 450;
  if (shake) {
    ctx.save();
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, 960, 540);
    const k = Math.exp(-t / 110);
    ctx.translate(Math.round(3 * k * Math.sin(t / 19)), Math.round(9 * k * Math.cos(t / 27)));
  }
  if (t >= 0) {
    ctx.save();
    drawEasterVillage(ctx, now);
    // A light shade along the front so the cast stands out from the busy village behind
    const band = ctx.createLinearGradient(0, 440, 0, 540);
    band.addColorStop(0, 'rgba(14, 20, 52, 0)');
    band.addColorStop(1, 'rgba(14, 20, 52, 0.38)');
    ctx.fillStyle = band;
    ctx.fillRect(0, 440, 960, 100);
    // The story so far: this turn's line (after the script, the guest's mumbles) and what has happened by now
    const talkT = t - TOWN_EASTER.walkInMs;
    const turn = talkT >= 0 ? Math.floor(talkT / TOWN_EASTER_TURN_MS) : -1;
    const N = TOWN_EASTER_TALK.length;
    const line = turn < 0 ? null : turn < N ? TOWN_EASTER_TALK[turn] : TOWN_EASTER_END[(turn - N) % TOWN_EASTER_END.length];
    const ev = townEasterEvents();
    const since = (at) => Math.min(1, Math.max(0, (t - at) / 600));
    const ease = (p) => 1 - (1 - p) * (1 - p);
    const tb = easterBeat(now);
    const onBeat = tb >= 0 && tb % 1 < 0.25;
    const sm = TOWN_EASTER_SNOWMAN;
    // The snowman; his date slides in from the left and he turns to her
    const date = since(ev.snowDate);
    if (date > 0) drawTownEasterSnowman(ctx, -70 + (sm.x - 58 + 70) * ease(date), sm.feet, now, false, { girl: true });
    drawTownEasterSnowman(ctx, sm.x, sm.feet, now, line && line.who === 'snow', { flip: date > 0.5 });
    // The cast walks in from the right and lines up; the couples close in, face each other and hop together; the
    // guest turns to the snowman, then slumps
    const pairOf = [];
    TOWN_EASTER_PAIRS.forEach(([a, b], p) => {
      pairOf[a] = [p, 0];
      pairOf[b] = [p, 1];
    });
    const slump = since(ev.otl);
    const spots = [];
    TOWN_EASTER_CAST.forEach((c, i) => {
      const q = Math.min(1, Math.max(0, (t - i * 140) / (TOWN_EASTER.walkInMs - 900)));
      const e = 1 - (1 - q) * (1 - q);
      let x = 1040 + i * 30 + (c.x - 1040 - i * 30) * e;
      const walking = q < 1;
      let flip = walking ? true : i % 2 === 1;
      let hop = !walking && tb >= 0 && (c.dance || (Math.floor(tb) + i) % 3 === 0) && tb % 1 < 0.3 ? (c.dance ? 8 : 4) : 0;
      const pp = pairOf[i];
      const k = pp && !walking ? ease(since(ev.pairs[pp[0]])) : 0;
      if (k > 0) {
        const [a, b] = TOWN_EASTER_PAIRS[pp[0]];
        const mid = (TOWN_EASTER_CAST[a].x + TOWN_EASTER_CAST[b].x) / 2;
        x += (mid + (pp[1] ? 26 : -26) - x) * k;
        flip = pp[1] === 1;
        hop = tb >= 0 && (Math.floor(tb) + pp[0]) % 2 === 0 && tb % 1 < 0.3 ? 5 : 0;
      }
      const sl = i === 0 ? slump : 0;
      if (i === 0 && t >= ev.faceDev) flip = true;
      if (sl > 0) hop = 0;
      const squash = 1 - 0.2 * sl;
      const top = c.feet - c.size * (243 / 256) * squash - hop;
      if (typeof drawPixelGroundShadow === 'function') drawPixelGroundShadow(ctx, x, c.feet - 2, c.size * 0.55, hop);
      ctx.save();
      if (sl > 0) {
        ctx.translate(x, c.feet);
        ctx.scale(1, squash);
        ctx.translate(-x, -c.feet);
        // Drained of colour (where the canvas filter exists)
        if ('filter' in ctx) ctx.filter = `brightness(${(1 - 0.28 * sl).toFixed(2)}) saturate(${(1 - 0.55 * sl).toFixed(2)})`;
      }
      drawAnimatedPixelPenguin(ctx, ensureSpeciesSprite(c.sp), x - c.size / 2, c.feet - c.size * (243 / 256) - hop, c.size, now, {
        seed: 20 + i,
        isWalking: (walking || !!c.dance) && sl === 0,
        flipX: flip,
        santaHat: true,
      });
      ctx.restore();
      spots.push({ x, top, size: c.size, feet: c.feet, walking });
    });
    // The gift: by the giver, then over to its sweetheart
    const giver = spots[3];
    const taker = spots[4];
    if (!giver.walking) {
      const g = ease(since(ev.give));
      const gx = giver.x + giver.size * 0.32 + (taker.x - taker.size * 0.32 - giver.x - giver.size * 0.32) * g;
      drawTownEasterGift(ctx, gx, giver.feet - giver.size * 0.34 - Math.sin(g * Math.PI) * 26);
    }
    // Hearts over each couple (and the snowmen): one beating on the beat, small ones drifting up
    const hearts = (hx, hy, t0, seed) => {
      drawPixelHeart(ctx, hx, hy - (onBeat ? 2 : 0), onBeat ? 4 : 3, '#ff4d6d');
      for (let n = 0; n < 2; n++) {
        const f = ((t - t0) / 1700 + n * 0.5 + seed * 0.3) % 1;
        ctx.globalAlpha = 1 - f;
        drawPixelHeart(ctx, hx + Math.sin(f * 6 + n * 2 + seed) * 10, hy - 14 - f * 40, 2, '#fda4af');
        ctx.globalAlpha = 1;
      }
    };
    TOWN_EASTER_PAIRS.forEach(([a, b], p) => {
      if (since(ev.pairs[p]) >= 1) hearts((spots[a].x + spots[b].x) / 2, Math.min(spots[a].top, spots[b].top) - 14, ev.pairs[p], p);
    });
    if (date >= 1) hearts(sm.x - 29, sm.feet - 150, ev.snowDate, 3);
    // The guest's own little rain cloud, gloom lines on its face
    if (slump > 0) {
      const G = spots[0];
      const cx = Math.round(G.x);
      const cy = Math.round(G.top - 30 + Math.sin(now * 0.002) * 2);
      ctx.globalAlpha = slump;
      // Rain first, so the cloud sits on top of it
      for (let k = 0; k < 6; k++) {
        const f = (now / 480 + k * 0.41) % 1;
        const ry = Math.round(cy + 8 + f * 30);
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(cx - 20 + k * 8, ry, 2, 6);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(cx - 20 + k * 8, ry + 6, 2, 2);
      }
      const disc = (x, y, r, c) => {
        if (typeof fillPixelDisc === 'function') fillPixelDisc(ctx, x, y, r, c);
        else {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      const lobes = [[-14, 2, 12], [0, -4, 15], [14, 1, 12]];
      lobes.forEach(([dx, dy, r]) => disc(cx + dx, cy + dy, r + 2, '#0b1020'));
      ctx.fillStyle = '#0b1020';
      ctx.fillRect(cx - 28, cy, 56, 14);
      lobes.forEach(([dx, dy, r]) => disc(cx + dx, cy + dy, r, '#4b5568'));
      ctx.fillStyle = '#4b5568';
      ctx.fillRect(cx - 26, cy, 52, 12);
      ctx.fillStyle = '#353d4f';
      ctx.fillRect(cx - 26, cy + 8, 52, 4);
      ctx.fillStyle = '#6b7590';
      ctx.fillRect(cx - 6, cy - 16, 10, 4);
      ctx.fillRect(cx - 20, cy - 6, 8, 2);
      // Gloom lines down the face
      ctx.fillStyle = 'rgba(76, 29, 149, 0.55)';
      for (let k = 0; k < 4; k++) ctx.fillRect(cx - 15 + k * 9, Math.round(G.top + 26), 3, 14 + (k % 2) * 6);
      ctx.globalAlpha = 1;
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
    // "Reward: none" stamped under it once the dev says so
    if (t >= ev.stamp) {
      const st = Math.min(1, (t - ev.stamp) / 160);
      const tag = ko ? '보상: 없음' : 'REWARD: NONE';
      ctx.save();
      ctx.translate(bx + bw - 34, 60);
      ctx.rotate(-0.1);
      ctx.scale(1.7 - 0.7 * st, 1.7 - 0.7 * st);
      ctx.globalAlpha = st;
      ctx.font = '900 13px "Pretendard", "Malgun Gothic", sans-serif';
      const tw2 = Math.ceil(ctx.measureText(tag).width) + 18;
      ctx.fillStyle = 'rgba(9, 13, 26, 0.88)';
      ctx.fillRect(-tw2 / 2, -12, tw2, 24);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(-tw2 / 2, -12, tw2, 24);
      ctx.fillStyle = '#f87171';
      ctx.fillText(tag, 0, 1);
      ctx.restore();
    }
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
  if (shake) ctx.restore();
}
