// ============================================================================
// EASTER VILLAGE — the hidden Christmas village of the town Easter egg (town-easter.js). The still picture is
// pixel art made for it after the owner's reference (easter_village.png, 480x270, from
// scratch/easter_v5/gen_village.py: timber houses with market stalls, the big tree, terraced cliffs with igloos and
// a two-step waterfall, a stone bridge over the river, lamps, fences, holly, an ice floe). Every frame is composed
// on a 480x270 canvas and scaled up 2x with smoothing off, so everything that moves sits on the same pixel grid:
// twinkling stars, the tree's lights chasing on the beat, fairy lights, flickering windows and igloo fires, lamp
// halos, falling water and spray, the river's shimmer and reflections, chimney smoke, snow sparkles, falling snow,
// and the villagers (their own small sprites, easter_villagers.png), each busy with something.
// ============================================================================
const EV_W = 480;
const EV_H = 270;
const EV_BG_SRC = '/assets/motion_sprites/easter_village.png?v=1';
const EV_SHEET_SRC = '/assets/motion_sprites/easter_villagers.png?v=1';
// @@EV_DATA (written by scratch/easter_v5/build_easter.py from the art generators; do not edit by hand)
const EV_A = {"lamps":[[305,82,4,5],[397,81,4,5],[305,112,4,5],[363,112,4,5],[469,111,4,5],[391,161,4,5],[230,150,4,5],[371,150,4,5],[95,133,4,5],[29,171,4,5],[112,173,4,5],[145,173,4,5],[475,221,4,5]],"windows":[[359,95,2,3],[364,95,2,3],[369,95,2,3],[409,87,2,3],[414,87,2,3],[10,86,12,12],[70,86,12,12],[43,60,7,7],[0,121,94,23],[106,109,11,9],[155,109,11,9],[125,89,7,7],[101,137,70,7]],"doors":[[441,95,7,5],[276,128,7,5],[406,126,11,8]],"bulbs":[[373,92,1],[376,92,0],[379,92,2],[382,92,0],[385,91,3],[388,90,0],[391,89,0],[394,89,1],[397,89,0],[400,88,2],[403,87,0],[-1,87,0],[2,85,3],[5,83,0],[8,81,0],[11,78,1],[14,76,0],[17,73,2],[20,70,0],[23,67,3],[25,65,0],[28,63,0],[31,61,1],[34,59,0],[37,56,2],[40,53,0],[43,50,3],[49,50,3],[52,53,0],[55,56,0],[58,59,1],[61,61,0],[64,63,2],[67,65,0],[69,67,3],[72,70,0],[75,73,0],[78,76,1],[81,78,0],[84,81,2],[87,83,0],[90,85,3],[93,87,0],[-1,122,0],[2,123,1],[5,123,0],[8,124,2],[11,124,0],[14,125,3],[17,125,0],[20,125,0],[23,125,1],[26,125,0],[29,125,2],[32,124,0],[35,124,3],[38,123,0],[41,123,0],[44,122,1],[47,122,0],[50,123,2],[53,123,0],[56,124,3],[59,124,0],[62,125,0],[65,125,1],[68,125,0],[71,125,2],[74,125,0],[77,125,3],[80,125,0],[83,124,0],[86,124,1],[89,123,0],[92,123,2],[95,122,0],[95,110,1],[98,111,0],[101,111,2],[104,112,0],[107,112,3],[110,112,0],[113,112,0],[116,111,1],[119,111,0],[122,110,2],[125,110,0],[128,111,3],[131,112,0],[134,112,0],[137,112,1],[140,112,0],[143,111,2],[146,111,0],[149,110,3],[152,111,0],[155,111,0],[158,112,1],[161,112,0],[164,112,2],[167,112,0],[170,111,3],[173,111,0],[176,110,0],[99,138,2],[102,139,0],[105,140,3],[108,140,0],[111,141,0],[114,141,1],[117,141,0],[120,141,2],[123,141,0],[126,140,3],[129,140,0],[132,139,0],[135,138,1],[137,138,0],[140,139,2],[143,140,0],[146,140,3],[149,141,0],[152,141,0],[155,141,1],[158,141,0],[161,141,2],[164,140,0],[167,140,3],[170,139,0],[173,138,0],[32,172,0],[35,173,0],[38,174,1],[41,175,0],[44,175,2],[47,176,0],[50,176,3],[53,176,0],[56,176,0],[59,175,1],[62,175,0],[65,174,2],[68,173,0],[71,172,3],[73,172,0],[76,173,0],[79,174,1],[82,175,0],[85,176,2],[88,177,0],[91,177,3],[94,177,0],[97,177,0],[100,177,1],[103,176,0],[106,176,2],[109,175,0],[112,174,3]],"treeLights":[[212,67,0],[203,68,1],[206,69,2],[213,73,3],[208,73,4],[205,76,1],[207,79,3],[213,80,4],[216,82,0],[201,84,2],[212,85,3],[218,88,0],[204,89,1],[205,92,2],[211,94,3],[199,95,4],[221,96,0],[194,96,1],[214,99,3],[199,102,4],[206,104,1],[189,105,2],[206,108,3],[193,109,4],[206,111,0],[211,112,1],[188,113,2],[201,115,3],[193,115,4],[191,119,1],[198,120,3],[222,123,4],[218,124,0],[213,126,1],[206,129,2],[221,128,3],[208,130,0],[206,134,1],[215,134,2],[211,136,3],[196,137,4],[189,138,0],[214,141,1],[186,142,2],[237,143,3],[198,146,4],[182,146,0],[216,147,1],[195,148,2],[178,152,3],[193,152,4],[188,154,1],[201,155,2],[234,158,3]],"chimneys":[[368,81],[416,73],[75,45],[155,65]],"stars":[[140,0,1],[58,18,1],[117,0,1],[255,26,1],[319,2,1],[150,74,1],[478,32,1],[357,20,1],[69,0,1],[202,30,1],[306,14,1],[286,13,1],[90,40,2],[311,27,1],[58,7,1],[316,41,1],[130,22,2],[106,64,1],[109,12,1],[359,1,1],[127,7,1],[38,16,1],[118,3,2],[26,25,1],[308,14,1],[317,40,1],[261,27,1],[218,37,1],[153,62,1],[460,5,1],[279,59,1],[320,62,1],[284,41,1]],"sparkles":[[152,155],[95,216],[223,173],[352,256],[121,240],[204,178],[389,259],[242,152],[88,217],[273,234],[11,235],[437,197],[30,164],[143,162],[386,201],[192,192],[394,248],[342,253],[336,257],[55,182],[303,259],[449,201],[359,252],[101,156],[23,234],[7,186],[401,265],[305,167],[11,195],[52,251],[249,259],[102,165],[163,180],[330,253],[389,247],[323,267],[225,187],[394,244],[393,255],[80,269],[192,215],[476,176],[213,170],[139,158],[326,268],[93,169],[363,167],[453,200],[405,258],[91,180],[17,263],[124,237],[2,198],[64,166],[161,235],[111,244],[104,181],[22,267],[376,253],[165,157],[251,167],[210,234],[380,261],[291,167],[314,235],[45,267],[104,155],[20,262],[477,192],[444,190]],"star":[207,52],"reflections":[[231,215,236],[372,215,236],[393,205,232],[404,206,238],[476,232,252]],"water":[[162,248,371],[162,374,378],[163,248,371],[163,374,378],[164,247,253],[164,255,261],[164,263,269],[164,271,277],[164,279,285],[164,287,293],[164,295,301],[164,303,309],[164,311,317],[164,319,325],[164,327,333],[164,335,341],[164,343,349],[164,351,357],[164,359,365],[164,367,371],[164,375,378],[165,248,253],[165,256,261],[165,264,269],[165,272,277],[165,280,285],[165,288,293],[165,296,301],[165,304,309],[165,312,317],[165,320,325],[165,328,333],[165,336,341],[165,344,349],[165,352,357],[165,360,365],[165,368,371],[165,376,379],[166,248,253],[166,256,261],[166,264,269],[166,272,277],[166,280,285],[166,288,293],[166,296,301],[166,304,309],[166,312,317],[166,320,325],[166,328,333],[166,336,341],[166,344,349],[166,352,357],[166,360,365],[166,368,371],[170,248,253],[170,256,261],[170,264,269],[170,272,277],[170,280,285],[170,288,293],[170,296,301],[170,304,309],[170,312,317],[170,320,325],[170,328,333],[170,336,341],[170,344,349],[170,352,357],[170,360,365],[170,368,371],[173,240,245],[173,248,253],[173,256,261],[173,264,269],[173,272,277],[173,280,285],[173,288,293],[173,296,301],[173,304,309],[173,312,317],[173,320,325],[173,328,333],[173,336,341],[173,344,349],[173,352,357],[173,360,365],[183,376,379],[184,376,379],[185,376,379],[186,377,380],[187,377,380],[188,377,381],[189,292,312],[189,377,381],[190,288,316],[190,377,382],[191,285,319],[191,377,382],[192,283,321],[192,378,383],[193,281,323],[193,378,383],[194,279,325],[194,378,383],[195,278,326],[195,378,384],[196,276,328],[196,378,384],[197,275,329],[197,378,385],[198,274,330],[198,378,385],[199,273,331],[199,379,386],[200,272,332],[200,379,385],[201,271,333],[201,379,385],[202,271,333],[202,379,385],[203,270,334],[203,379,385],[204,270,334],[204,379,389],[204,401,406],[204,412,416],[204,471,477],[205,269,335],[205,380,397],[205,401,406],[205,411,418],[205,471,477],[206,269,335],[206,380,398],[206,401,409],[206,411,418],[206,430,438],[206,460,477],[207,269,335],[207,380,398],[207,401,409],[207,411,418],[207,420,423],[207,430,440],[207,447,450],[207,456,479],[208,269,335],[208,380,398],[208,400,428],[208,430,440],[208,446,454],[208,456,479],[209,269,335],[209,380,479],[210,268,336],[210,380,479],[211,269,335],[211,381,479],[212,269,335],[212,381,479],[213,218,221],[213,269,335],[213,381,451],[213,453,479],[214,218,221],[214,269,335],[214,381,447],[214,457,479],[215,218,451],[215,453,479],[216,218,479],[217,218,474],[218,218,473],[219,218,474],[220,218,473],[221,217,349],[221,351,473],[222,217,346],[222,354,473],[223,217,258],[223,266,349],[223,351,473],[224,217,256],[224,268,473],[225,217,258],[225,266,473],[226,217,473],[227,217,479],[228,217,475],[229,217,380],[229,388,475],[230,217,379],[230,389,475],[231,217,299],[231,301,380],[231,388,474],[232,217,239],[232,241,296],[232,304,475],[233,286,299],[233,301,391],[233,393,475],[234,395,475],[235,396,475],[236,398,475],[237,400,459],[237,461,475],[238,402,429],[239,403,426],[240,405,424],[241,405,421],[242,405,418],[243,406,416],[244,406,413],[245,406,413],[246,406,413],[247,406,412],[248,407,412],[248,449,455],[249,407,412],[249,447,457],[250,407,412],[250,446,458],[251,407,412],[251,447,457],[252,407,411],[252,449,455],[253,408,411],[254,408,411],[255,408,411],[256,408,411],[260,409,412],[261,409,412],[262,409,413],[263,410,414],[264,410,415],[265,410,415],[266,410,416],[267,410,417],[268,411,428],[268,472,479],[269,411,440],[269,462,479]],"falls":[[325,103,20,31],[321,139,28,27]],"foam":[[318,160,34,8],[323,132,24,5]]};
const EV_ATLAS = {"species":["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22"],"big":{"w":16,"h":19,"frames":["stand","blink","walkA","walkB","waveA","waveB","cheer"]},"small":{"w":11,"h":12,"x0":112,"frames":["stand","walkA","walkB","waveA","waveB"]}};
// @@EV_DATA_END
const EV_BULB = ['#ffe27a', '#ff6b6b', '#7ee0ff', '#9dff8a', '#ffb3e6'];
const EV_BULB_DIM = ['#6e5a2c', '#6a2a36', '#2a5468', '#3a6034', '#64385c'];
const EV_STATE = { bg: null, sheet: null, low: null, g: null };

function evHash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function evPx(g, x, y, c, w = 1, h = 1) {
  g.fillStyle = c;
  g.fillRect(Math.round(x), Math.round(y), w, h);
}
function evPingPong(now, period, a, b, phase = 0) {
  const q = ((now / period + phase) % 1) * 2;
  const p = q < 1 ? q : 2 - q;
  return { x: a + (b - a) * p, dir: q < 1 ? 1 : -1 };
}
function evLine(g, x0, y0, x1, y1, c) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  g.fillStyle = c;
  for (let i = 0; i <= n; i++) g.fillRect(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), 1, 1);
}
function evGlow(g, x, y, r, rgb, a) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(${rgb}, ${a.toFixed(3)})`);
  gr.addColorStop(1, `rgba(${rgb}, 0)`);
  g.fillStyle = gr;
  g.fillRect(x - r, y - r, r * 2, r * 2);
}

function evEnsure() {
  if (!EV_STATE.bg) {
    EV_STATE.bg = new Image();
    EV_STATE.bg.src = EV_BG_SRC;
    EV_STATE.sheet = new Image();
    EV_STATE.sheet.src = EV_SHEET_SRC;
    EV_STATE.low = document.createElement('canvas');
    EV_STATE.low.width = EV_W;
    EV_STATE.low.height = EV_H;
    EV_STATE.g = EV_STATE.low.getContext('2d');
  }
  return EV_STATE.g;
}
function evReady(img) {
  return img && img.complete && img.naturalWidth > 0;
}

// ---------------------------------------------------------------------------------------------------------------
// Villagers: frames from the atlas (big = near, small = far), feet on the given row, a soft shadow under them
// ---------------------------------------------------------------------------------------------------------------
function evVillager(g, sp, frame, x, feet, flip = false, small = false, shadow = true) {
  if (!evReady(EV_STATE.sheet) || !EV_ATLAS.species) return;
  const L = small ? EV_ATLAS.small : EV_ATLAS.big;
  const row = EV_ATLAS.species.indexOf(sp);
  const fi = L.frames.indexOf(frame);
  if (row < 0 || fi < 0) return;
  const sx = (L.x0 || 0) + fi * L.w;
  const sy = row * EV_ATLAS.big.h + (EV_ATLAS.big.h - L.h);
  const dx = Math.round(x - L.w / 2);
  const dy = Math.round(feet - L.h);
  if (shadow) {
    g.fillStyle = 'rgba(36, 46, 104, 0.3)';
    g.fillRect(dx + (small ? 2 : 3), Math.round(feet) - 1, L.w - (small ? 4 : 6), 2);
  }
  g.save();
  g.translate(flip ? dx + L.w : dx, dy);
  if (flip) g.scale(-1, 1);
  g.drawImage(EV_STATE.sheet, sx, sy, L.w, L.h, 0, 0, L.w, L.h);
  g.restore();
}
function evIdle(now, seed) {
  return (now + seed * 977) % 3300 < 150 ? 'blink' : 'stand';
}
function evWalk(now, seed) {
  return Math.floor(now / 170 + seed) % 2 ? 'walkA' : 'walkB';
}
function evWave(now, seed) {
  return Math.floor(now / 220 + seed) % 2 ? 'waveA' : 'waveB';
}
function evGift(g, x, y, body, ribbon) {
  evPx(g, x - 1, y - 1, '#2a1a24', 6, 6);
  evPx(g, x, y, body, 4, 4);
  evPx(g, x + 1, y, ribbon, 1, 4);
  evPx(g, x, y + 1, ribbon, 4, 1);
  evPx(g, x, y - 2, ribbon);
  evPx(g, x + 2, y - 2, ribbon);
}
function evFish(g, x, y, flip) {
  const cells = ['.cc.c', 'ccccc', '.cc.c'];
  cells.forEach((row, ry) =>
    [...row].forEach((ch, rx) => {
      if (ch === 'c') evPx(g, flip ? x + 4 - rx : x + rx, y + ry, ry === 0 ? '#bfe9ff' : '#62b6e8');
    })
  );
  evPx(g, flip ? x + 3 : x + 1, y + 1, '#16233f');
}

function drawEasterCrowd(g, now) {
  const beat = typeof townBeat === 'function' ? townBeat(now) : now / 425;
  // Far: a stroller on the top terrace, one at the small igloo, one climbing the cliff stairs
  const us = evPingPong(now, 14000, 352, 430);
  evVillager(g, '18', evWalk(now, 1), us.x, 101, us.dir < 0, true);
  const gq = (now / 4200) % 1;
  evVillager(g, '13', gq > 0.6 ? evWave(now, 2) : 'stand', 258, 133, false, true);
  const sq = (now / 9000) % 1;
  const sp = sq < 0.5 ? sq * 2 : 2 - sq * 2;
  const step = Math.min(11, Math.floor(sp * 12));
  evVillager(g, '07', evWalk(now, 3), 457 + step * 2, 166 - step * 3, sq >= 0.5, true);
  // The big igloo: one waves to everyone below
  const wq = (now / 3400) % 1;
  evVillager(g, '19', wq < 0.5 ? evWave(now, 4) : evIdle(now, 4), 449, 134, true);
  // The fishmonger by the sign shows off today's catch
  const fq2 = (now / 2600) % 1;
  const lift = fq2 < 0.5 ? 1 : 0;
  evVillager(g, '11', fq2 < 0.5 ? 'waveA' : 'stand', 408, 197, false);
  evFish(g, 414, 184 - lift * 2, false);
  // Two crossing the bridge, opposite ways
  const b1 = evPingPong(now, 9000, 240, 364);
  const b2 = evPingPong(now, 9000, 364, 240, 0.37);
  evVillager(g, '03', evWalk(now, 5), b1.x, 175, b1.dir < 0);
  evVillager(g, '20', evWalk(now, 6), b2.x, 175, b2.dir > 0);
  // Stall keepers: the baker waves the crowd in, the gift seller cheers a sale now and then
  const kq = (now / 5200) % 1;
  evVillager(g, '12', kq > 0.7 ? evWave(now, 7) : evIdle(now, 7), 46, 161, Math.floor(now / 2600) % 2 === 0);
  const sale = (now / 6100) % 1 > 0.82;
  evVillager(g, '15', sale ? 'cheer' : evIdle(now, 8), 140, 161 - (sale && Math.floor(now / 150) % 2 ? 2 : 0), true);
  // Gift carrier strolling along the path
  const gc = evPingPong(now, 11000, 22, 124);
  const gy = 178 + (gc.x - 120) * 0.04;
  evVillager(g, '21', evWalk(now, 9), gc.x, gy, gc.dir < 0);
  evGift(g, gc.x + (gc.dir < 0 ? -9 : 5), gy - 10, '#d23440', '#f6c443');
  // Two dancing round the tree, hopping on alternate beats
  [['14', 170, 0], ['16', 224, 1]].forEach(([s, x, i]) => {
    const on = Math.floor(beat) % 2 === i && beat % 1 < 0.4;
    evVillager(g, s, on ? 'cheer' : 'stand', x, 179 - (on ? 3 : 0), Math.floor(beat / 2) % 2 === i);
  });
  // On the bench with a hot cocoa (steam curls up now and then)
  evVillager(g, '02', evIdle(now, 10), 194, 183, false, false, false);
  evPx(g, 198, 174, '#7a3e22', 2, 2);
  evPx(g, 198, 174, '#a8603a');
  for (let k = 0; k < 3; k++) {
    const q = (now / 1800 + k / 3) % 1;
    g.fillStyle = `rgba(236, 240, 255, ${(0.6 * (1 - q)).toFixed(3)})`;
    g.fillRect(Math.round(198 + Math.sin(q * 6 + k) * 1.2), Math.round(172 - q * 7), 1, 1);
  }
  // Snowball fight in front of the fence; they take turns
  const sb = (now % 2600) / 2600;
  const turn = Math.floor(now / 2600) % 2;
  const xa = 50;
  const xb = 100;
  const thrower = turn ? xb : xa;
  const target = turn ? xa : xb;
  const hit = sb > 0.68 && sb < 0.9;
  [[xa, '17', 0], [xb, '18', 1]].forEach(([x, s, i]) => {
    const throwing = turn === i && sb < 0.3;
    const struck = turn !== i && hit;
    const fr = throwing ? (sb < 0.18 ? 'waveA' : 'waveB') : struck ? 'blink' : evIdle(now, 11 + i);
    evVillager(g, s, fr, x, 185 - (struck && Math.floor(now / 90) % 2 ? 2 : 0), i === 1);
  });
  if (sb > 0.22 && sb < 0.7) {
    const q = (sb - 0.22) / 0.48;
    const bx = thrower + (target - thrower) * q;
    const by = 173 - Math.sin(q * Math.PI) * 12;
    evPx(g, bx - 1, by - 1, '#56629f', 3, 3);
    evPx(g, bx - 1, by - 1, '#ffffff', 2, 2);
  } else if (hit) {
    const r = (sb - 0.68) / 0.22;
    g.fillStyle = `rgba(255, 255, 255, ${(1 - r).toFixed(3)})`;
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      g.fillRect(Math.round(target + Math.cos(a) * (2 + r * 6)), Math.round(172 + Math.sin(a) * (1 + r * 4)), 1, 1);
    }
  }
  // The fisher on the floe: sits on the crate, line in the hole; every 7 s a fish comes up into the bucket
  const fq = (now % 7000) / 7000;
  const catching = fq > 0.78;
  const fx = 427;
  evVillager(g, '08', catching ? 'cheer' : evIdle(now, 13), fx, 243 - (catching && Math.floor(now / 120) % 2 ? 2 : 0), false, false, false);
  const tip = [446, catching ? 220 : 224];
  evLine(g, fx + 6, 234, tip[0], tip[1], '#7c4a1d');
  const bob = catching ? -6 : Math.round(Math.sin(now * 0.005));
  g.globalAlpha = 0.75;
  evLine(g, tip[0], tip[1], 452, 249 + bob, '#dbe8ff');
  g.globalAlpha = 1;
  evPx(g, 451, 248 + bob, '#e02f3c', 2, 2);
  if (catching) {
    const p = (fq - 0.78) / 0.22;
    evFish(g, 452 + p * 14, 246 - Math.sin(p * Math.PI) * 16, false);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// One frame (the cast and the talk are drawn over it by town-easter.js)
// ---------------------------------------------------------------------------------------------------------------
function drawEasterVillage(ctx, now) {
  const g = evEnsure();
  const A = EV_A;
  if (evReady(EV_STATE.bg)) g.drawImage(EV_STATE.bg, 0, 0);
  else {
    g.fillStyle = '#0f1743';
    g.fillRect(0, 0, EV_W, EV_H);
  }
  const beat = typeof townBeat === 'function' ? townBeat(now) : now / 425;
  const step = Math.floor(beat);
  // Stars: some flare into a little cross now and then
  (A.stars || []).forEach(([x, y, b], i) => {
    const ph = (now / (1400 + evHash(i) * 2600) + evHash(i + 40)) % 1;
    if (ph < 0.12 || b === 2) {
      const big = b === 2 && ph < 0.5;
      evPx(g, x, y, '#ffffff');
      g.fillStyle = big ? '#c6d2ff' : 'rgba(170, 186, 240, 0.8)';
      g.fillRect(x - 1, y, 1, 1);
      g.fillRect(x + 1, y, 1, 1);
      g.fillRect(x, y - 1, 1, 1);
      g.fillRect(x, y + 1, 1, 1);
      if (big) {
        g.fillStyle = 'rgba(140, 160, 230, 0.6)';
        g.fillRect(x - 2, y, 1, 1);
        g.fillRect(x + 2, y, 1, 1);
        g.fillRect(x, y - 2, 1, 1);
        g.fillRect(x, y + 2, 1, 1);
      }
    }
  });
  // Waterfall: bright threads running down each drop, spray rising at the foot of each
  (A.falls || []).forEach(([x0, y0, w, h], fi) => {
    for (let c = 1; c < w - 1; c++) {
      const v = 0.045 + evHash(c + fi * 31) * 0.035;
      for (let k = 0; k < 2; k++) {
        const len = 3 + ((c * 3 + k) % 5);
        const y = y0 + ((now * v + evHash(c * 7 + k * 13 + fi) * 400) % (h + len)) - len;
        const top = Math.max(y0 + 2, Math.round(y));
        const bot = Math.min(y0 + h, Math.round(y + len));
        if (bot > top) evPx(g, x0 + c, top, (c + k) % 3 ? '#cfe9ff' : '#f6fbff', 1, bot - top);
      }
    }
  });
  (A.foam || []).forEach(([x0, y0, w, h], fi) => {
    for (let k = 0; k < 16; k++) {
      const q = (now / (650 + (k % 4) * 120) + evHash(k + fi * 17)) % 1;
      const x = x0 + evHash(k * 3 + fi) * w + Math.sin(q * 5 + k) * 1.5;
      const y = y0 + h - 1 - q * h * 1.4;
      g.fillStyle = `rgba(255, 255, 255, ${(0.9 * (1 - q)).toFixed(3)})`;
      g.fillRect(Math.round(x), Math.round(y), q < 0.3 ? 2 : 1, q < 0.3 ? 2 : 1);
    }
  });
  // River: light dashes drifting downstream, the lamps' reflections trembling
  const rows = A.water || [];
  if (rows.length) {
    for (let k = 0; k < 34; k++) {
      const [y, x0, x1] = rows[Math.floor(evHash(k + 7) * rows.length)];
      const span = x1 - x0;
      if (span < 6) continue;
      const x = x0 + ((now * (0.004 + evHash(k) * 0.006) + evHash(k + 3) * 999) % span);
      const a = 0.25 + 0.35 * Math.max(0, Math.sin(now * 0.002 + k));
      g.fillStyle = `rgba(150, 196, 255, ${a.toFixed(3)})`;
      g.fillRect(Math.round(x), y, 2 + (k % 3), 1);
    }
  }
  g.globalCompositeOperation = 'lighter';
  (A.reflections || []).forEach(([x, y0, y1], i) => {
    for (let y = y0; y < y1; y += 2) {
      const f = 1 - (y - y0) / (y1 - y0);
      const ox = Math.round(Math.sin(now * 0.004 + y * 0.9 + i) * 1.4);
      g.fillStyle = `rgba(255, 196, 110, ${(0.28 * f).toFixed(3)})`;
      g.fillRect(x + ox - 1, y, 2 + (y % 3 === 0 ? 1 : 0), 1);
    }
  });
  // Warm light breathing: windows and stalls, igloo fires, lamps, the tree
  (A.windows || []).forEach(([x, y, w, h], i) => {
    const a = 0.05 + 0.05 * Math.sin(now * 0.003 + i * 2.1) + (Math.floor(now / 1700 + i) % 9 === 0 ? 0.06 : 0);
    g.fillStyle = `rgba(255, 170, 80, ${a.toFixed(3)})`;
    g.fillRect(x, y, w, h);
  });
  (A.doors || []).forEach(([x, y, w, h], i) => {
    const a = 0.08 + 0.1 * evHash(Math.floor(now / 110) + i * 13);
    g.fillStyle = `rgba(255, 150, 60, ${a.toFixed(3)})`;
    g.fillRect(x, y, w, h);
    evGlow(g, x + w / 2, y + h / 2, 8 + w, '255, 170, 80', a * 0.9);
  });
  (A.lamps || []).forEach(([x, y, w, h], i) => {
    const a = 0.16 + 0.05 * Math.sin(now * 0.0025 + i * 1.7);
    evGlow(g, x + w / 2, y + h / 2, 11, '255, 214, 140', a);
  });
  if (A.star) {
    const p = beat >= 0 ? Math.pow(1 - (beat % 1), 2) : 0.5;
    evGlow(g, A.star[0] + 0.5, A.star[1], 12 + p * 5, '255, 236, 160', 0.25 + p * 0.3);
  }
  g.globalCompositeOperation = 'source-over';
  // Tree lights on the beat: a chase, then alternating, then all on; the colours rotate every four beats
  const mode = Math.floor(step / 8) % 3;
  (A.treeLights || []).forEach(([x, y, ci], i) => {
    const on = mode === 0 ? (i + step) % 3 !== 0 : mode === 1 ? (step + i) % 2 === 0 : (now + i * 97) % 1100 > 90;
    const c = (ci + Math.floor(step / 4)) % EV_BULB.length;
    evPx(g, x, y, on ? EV_BULB[c] : EV_BULB_DIM[c]);
    if (on) {
      g.globalAlpha = 0.35;
      g.fillStyle = EV_BULB[c];
      g.fillRect(x - 1, y, 1, 1);
      g.fillRect(x + 1, y, 1, 1);
      g.fillRect(x, y - 1, 1, 1);
      g.fillRect(x, y + 1, 1, 1);
      g.globalAlpha = 1;
    }
  });
  // Fairy lights: a slow chase along each string
  (A.bulbs || []).forEach(([x, y, ci], i) => {
    const on = (i + Math.floor(now / 280)) % 4 !== 0;
    evPx(g, x, y, on ? EV_BULB[ci] : EV_BULB_DIM[ci]);
  });
  // Chimney smoke
  (A.chimneys || []).forEach(([cx, cy], i) => {
    for (let k = 0; k < 6; k++) {
      const q = (now / 3600 + k / 6 + i * 0.37) % 1;
      const s = 1 + Math.floor(q * 3);
      g.fillStyle = `rgba(206, 214, 240, ${(0.5 * (1 - q)).toFixed(3)})`;
      g.fillRect(Math.round(cx + q * 9 + Math.sin(q * 6 + i) * 2 - s / 2), Math.round(cy - q * 28 - s / 2), s, s);
    }
  });
  // Snow glints on the ground
  (A.sparkles || []).forEach(([x, y], i) => {
    if ((now / 1500 + evHash(i + 70) * 11) % 11 < 0.16) {
      evPx(g, x, y, '#ffffff');
      g.fillStyle = 'rgba(255, 255, 255, 0.55)';
      g.fillRect(x - 1, y, 1, 1);
      g.fillRect(x + 1, y, 1, 1);
      g.fillRect(x, y - 1, 1, 1);
      g.fillRect(x, y + 1, 1, 1);
    }
  });
  // Everyone busy
  drawEasterCrowd(g, now);
  // Falling snow: small far flakes and bigger near ones, swaying
  for (let k = 0; k < 90; k++) {
    const near = k % 3 === 0;
    const x = ((evHash(k) * 520 + now * (near ? 0.007 : 0.004) + Math.sin(now * 0.0011 + k) * 3) % 500) - 10;
    const y = ((evHash(k + 50) * 300 + now * (near ? 0.026 : 0.014)) % 290) - 10;
    g.fillStyle = near ? '#ffffff' : 'rgba(226, 234, 255, 0.75)';
    g.fillRect(Math.round(x), Math.round(y), near ? 2 : 1, near ? 2 : 1);
  }
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(EV_STATE.low, 0, 0, 960, 540);
  ctx.restore();
}
