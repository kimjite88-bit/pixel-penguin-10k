// ============================================================================
// SOUND — 8-bit sound for the intro, synthesised with Web Audio: no audio files, nothing to license.
// The town plays a public-domain carol, picked at random per visit (TOWN_SONGS), in our own chip arrangement, no
// lyrics; its hidden village (the Easter egg) switches to its own, Joy to the World (easterCues).
// Browsers only allow sound after a tap or key press (Chrome autoplay policy), so nothing plays until the first
// gesture on the page. Two icon buttons in the top bar, as games usually split them: the note = music (the
// carol, on by default) and the speaker = sound effects (alarm, engines, game events; off by default, they
// annoyed on a first visit). Both choices are remembered. The intro reads
// the same with the sound off: every cue only doubles something already on screen.
// Scene cues run on the scene clock (MOTION_STATE.sceneStartTime) and are scheduled a little ahead on the audio
// clock, so a cue joined late (sound turned on mid-scene) starts from where the scene already is.
// ============================================================================
const PP_SOUND = {
  ctx: null,
  master: null,
  sfx: null,
  music: null,
  noise: null,
  pulse: null,
  on: true,
  mode: 'carol', // 'carol' (town music only) | 'all' | 'off'
  key: '',
  cursor: 0,
  lastTick: 0,
  quakeOn: false,
  lastEvent: {},
};
const PP_SOUND_STORE = 'ppeng-sound';
const PP_SOUND_LOOKAHEAD = 120; // ms scheduled ahead of the scene clock

const PP_MUSIC_STORE = 'ppeng-music';
const PP_SFX_STORE = 'ppeng-sfx';
PP_SOUND.musicOn = true;
PP_SOUND.sfxOn = false;
try {
  // v5.19.1-5.20 kept one 3-way setting ('carol' | 'all' | 'off') in ppeng-sound
  const old = localStorage.getItem(PP_SOUND_STORE);
  const music = localStorage.getItem(PP_MUSIC_STORE);
  const sfx = localStorage.getItem(PP_SFX_STORE);
  PP_SOUND.musicOn = music ? music === 'on' : old !== 'off';
  PP_SOUND.sfxOn = sfx ? sfx === 'on' : old === 'all';
} catch (e) {}
PP_SOUND.on = PP_SOUND.musicOn || PP_SOUND.sfxOn;

// Alarm, engines, game events and the pillar
function sfxOn() {
  return PP_SOUND.sfxOn;
}

function soundReady() {
  return PP_SOUND.on && PP_SOUND.ctx && PP_SOUND.ctx.state === 'running';
}

function soundInit() {
  if (PP_SOUND.ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  // iOS 17+: mix with the player's own music and follow the silent switch, like any casual game
  try {
    if (navigator.audioSession) navigator.audioSession.type = 'ambient';
  } catch (e) {}
  const c = new AC();
  PP_SOUND.ctx = c;
  PP_SOUND.master = c.createGain();
  PP_SOUND.master.gain.value = 0.32;
  PP_SOUND.master.connect(c.destination);
  PP_SOUND.sfx = c.createGain();
  PP_SOUND.sfx.gain.value = 0.7;
  PP_SOUND.sfx.connect(PP_SOUND.master);
  PP_SOUND.music = c.createGain();
  PP_SOUND.music.gain.value = 0.42;
  PP_SOUND.music.connect(PP_SOUND.master);
  const buf = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  PP_SOUND.noise = buf;
  // 25% pulse, the NES lead sound
  const n = 24;
  const re = new Float32Array(n);
  const im = new Float32Array(n);
  for (let k = 1; k < n; k++) re[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * 0.25);
  PP_SOUND.pulse = c.createPeriodicWave(re, im);
}

// Any gesture on the page may start (or resume) the sound
function soundUnlock() {
  // When a gesture finds the sound still silent (a touch fires pointerdown then touchend: remember the first)
  if (!(PP_SOUND.ctx && PP_SOUND.ctx.state === 'running')) PP_SOUND.silentGestureAt = performance.now();
  if (!PP_SOUND.on) return;
  soundInit();
  const c = PP_SOUND.ctx;
  if (c && c.state !== 'running' && document.visibilityState === 'visible') c.resume().catch(() => {});
}

function setSoundFlags(musicOn, sfx) {
  PP_SOUND.musicOn = musicOn;
  PP_SOUND.sfxOn = sfx;
  const on = musicOn || sfx;
  PP_SOUND.on = on;
  try {
    localStorage.setItem(PP_MUSIC_STORE, musicOn ? 'on' : 'off');
    localStorage.setItem(PP_SFX_STORE, sfx ? 'on' : 'off');
  } catch (e) {}
  if (on) {
    soundUnlock();
    PP_SOUND.key = ''; // rejoin the current scene from where it is
  } else if (PP_SOUND.ctx) {
    PP_SOUND.ctx.suspend().catch(() => {});
  }
  updateSoundButton();
}

// Top-bar icons: one-colour 16 x 16 pixel glyphs in the button's own text colour (white, grey when off), no
// emoji-style colour. A glyph is filled cells minus cut-outs; "off" is a slash with a one-cell gap cut round it,
// the usual way a mono icon shows a slash over itself.
const PP_GLYPHS = {
  speaker: { fill: [[2, 6, 3, 4], [5, 5, 1, 6], [6, 4, 1, 8], [7, 3, 1, 10]] },
  waves: { fill: [[9, 6, 1, 4], [11, 4, 1, 2], [12, 6, 1, 4], [11, 10, 1, 2], [13, 3, 1, 1], [14, 4, 1, 8], [13, 12, 1, 1]] },
  cross: { fill: [[10, 5, 2, 2], [14, 5, 2, 2], [12, 7, 2, 2], [10, 9, 2, 2], [14, 9, 2, 2]] },
  note: { fill: [[9, 2, 2, 9], [11, 2, 2, 2], [13, 4, 2, 2], [13, 6, 1, 2], [6, 9, 4, 1], [5, 10, 5, 3], [6, 13, 3, 1]] },
  // Film slate: striped clapper (stripes cut out), hinge, board with a play mark cut out
  slate: {
    fill: [[2, 2, 12, 3], [2, 5, 2, 1], [2, 6, 12, 9]],
    cut: [[4, 2, 2, 1], [8, 2, 2, 1], [12, 2, 2, 1], [3, 3, 2, 1], [7, 3, 2, 1], [11, 3, 2, 1], [2, 4, 2, 1], [6, 4, 2, 1], [10, 4, 2, 1],
      [6, 8, 1, 5], [7, 9, 1, 3], [8, 10, 1, 1]],
  },
  // Restart: a clockwise ring, two cells thick, the arrowhead at the end of its top arc
  restart: {
    fill: [[5, 3, 5, 2], [3, 4, 2, 2], [2, 6, 2, 6], [3, 12, 2, 2], [5, 13, 6, 2], [11, 12, 2, 2], [12, 8, 2, 4],
      [10, 1, 1, 6], [11, 2, 1, 4], [12, 3, 1, 2]],
  },
};
function ppGlyph(names, slashed = false) {
  const g = new Uint8Array(256);
  const paint = (rects, v) => rects.forEach(([x, y, w, h]) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < 16 && j < 16) g[j * 16 + i] = v;
  });
  names.forEach((n) => paint(PP_GLYPHS[n].fill, 1));
  names.forEach((n) => paint(PP_GLYPHS[n].cut || [], 0));
  if (slashed) {
    // Top-left to bottom-right, as in the usual "off" icons (x = y from (2, 2) to (14, 14)): clear a gap round
    // it, then draw it two cells thick
    for (let j = 0; j < 16; j++) {
      for (let i = 0; i < 16; i++) {
        const d = Math.abs(i - j) / Math.SQRT2;
        if (i < 1 || i > 14) continue;
        if (d < 1.45) g[j * 16 + i] = 0;
        if (d < 0.8 && i >= 2 && i <= 13) g[j * 16 + i] = 1;
      }
    }
  }
  let body = '';
  for (let j = 0; j < 16; j++) {
    for (let i = 0; i < 16; ) {
      if (!g[j * 16 + i]) {
        i++;
        continue;
      }
      const start = i;
      while (i < 16 && g[j * 16 + i]) i++;
      body += `<rect x="${start}" y="${j}" width="${i - start}" height="1"/>`;
    }
  }
  return `<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${body}</svg>`;
}

function updateSoundButton() {
  if (typeof document === 'undefined') return;
  const ko = typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'ko';
  const set = (id, on, body, labelKo, labelEn) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.innerHTML = body;
    // Icon-only buttons still need a name for screen readers and a hover hint
    const label = ko ? labelKo : i18n(labelEn);
    btn.setAttribute('aria-label', label);
    btn.title = label;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('is-off', !on);
  };
  const m = PP_SOUND.musicOn;
  const s = PP_SOUND.sfxOn;
  set('btn-music-toggle', m, ppGlyph(['note'], !m), m ? '배경음악 켜짐 (누르면 끄기)' : '배경음악 꺼짐 (누르면 켜기)', m ? 'Music on (tap to mute)' : 'Music off (tap to play)');
  set('btn-sfx-toggle', s, ppGlyph(s ? ['speaker', 'waves'] : ['speaker', 'cross']), s ? '효과음 켜짐 (누르면 끄기)' : '효과음 꺼짐 (누르면 켜기)', s ? 'Sound effects on (tap to mute)' : 'Sound effects off (tap to play)');
}

// ---------------------------------------------------------------------------------------------------------------
// Voices
// ---------------------------------------------------------------------------------------------------------------
function midiHz(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

// One enveloped oscillator note. o: type | pulse, vol, to (glide target Hz), attack, bus
function sndTone(t, f, dur, o = {}) {
  const c = PP_SOUND.ctx;
  const osc = c.createOscillator();
  if (o.pulse) osc.setPeriodicWave(PP_SOUND.pulse);
  else osc.type = o.type || 'square';
  osc.frequency.setValueAtTime(f, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
  const g = c.createGain();
  const v = o.vol ?? 0.25;
  const a = o.attack ?? 0.004;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + a);
  g.gain.exponentialRampToValueAtTime(v * 0.6, t + Math.max(a + 0.001, dur * 0.5));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(o.bus || PP_SOUND.sfx);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// Filtered noise burst. o: filter type, freq, to (filter glide), q, vol, attack, bus
function sndNoise(t, dur, o = {}) {
  const c = PP_SOUND.ctx;
  const src = c.createBufferSource();
  src.buffer = PP_SOUND.noise;
  const f = c.createBiquadFilter();
  f.type = o.filter || 'highpass';
  f.frequency.setValueAtTime(o.freq || 1000, t);
  if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur);
  f.Q.value = o.q || 0.7;
  const g = c.createGain();
  const v = o.vol ?? 0.3;
  const a = o.attack ?? 0.003;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(o.bus || PP_SOUND.sfx);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

function sndArp(t, notes, step, o = {}) {
  notes.forEach((m, i) => sndTone(t + i * step, midiHz(m), o.len || step * 1.6, o));
}

// ---------------------------------------------------------------------------------------------------------------
// Game events (car-runner.js, boat-runner.js, sky-runner.js call this from their event loops)
// ---------------------------------------------------------------------------------------------------------------
const PP_SFX = {
  jump: (t) => sndTone(t, 330, 0.14, { to: 660, vol: 0.2 }),
  double: (t) => sndTone(t, 520, 0.16, { to: 1180, vol: 0.2, pulse: true }),
  land: (t) => sndNoise(t, 0.08, { filter: 'lowpass', freq: 600, vol: 0.25 }),
  hit: (t) => {
    sndNoise(t, 0.22, { filter: 'lowpass', freq: 1800, to: 200, vol: 0.4 });
    sndTone(t, 180, 0.22, { to: 70, vol: 0.22 });
  },
  crash: (t) => {
    sndNoise(t, 0.7, { filter: 'lowpass', freq: 2400, to: 120, vol: 0.5 });
    sndTone(t, 220, 0.6, { to: 40, vol: 0.25, type: 'sawtooth' });
  },
  coin: (t) => {
    sndTone(t, midiHz(83), 0.07, { vol: 0.16, pulse: true });
    sndTone(t + 0.06, midiHz(88), 0.18, { vol: 0.16, pulse: true });
  },
  gain: (t) => sndArp(t, [72, 76, 79, 84], 0.05, { vol: 0.14, pulse: true }),
  level: (t) => sndArp(t, [72, 76, 79, 84, 88], 0.07, { vol: 0.16, pulse: true, len: 0.2 }),
  miss: (t) => sndTone(t, 300, 0.18, { to: 200, vol: 0.12, type: 'triangle' }),
  near: (t) => sndNoise(t, 0.25, { filter: 'bandpass', freq: 600, to: 3000, q: 2, vol: 0.18 }),
  rescue: (t) => {
    sndTone(t, midiHz(84), 0.08, { vol: 0.14, type: 'triangle' });
    sndTone(t + 0.08, midiHz(91), 0.14, { vol: 0.14, type: 'triangle' });
  },
  iceBreak: (t, perfect) => {
    sndNoise(t, perfect ? 0.32 : 0.22, { freq: 2500, vol: perfect ? 0.42 : 0.32 });
    sndNoise(t, 0.12, { filter: 'lowpass', freq: 400, vol: 0.3 });
    if (perfect) sndArp(t + 0.04, [84, 88, 91], 0.04, { vol: 0.12, pulse: true });
  },
  iceThud: (t) => {
    sndNoise(t, 0.16, { filter: 'lowpass', freq: 300, vol: 0.4 });
    sndTone(t, 110, 0.16, { to: 60, vol: 0.2, type: 'triangle' });
  },
  whiff: (t) => sndNoise(t, 0.16, { filter: 'bandpass', freq: 1200, to: 400, q: 1.5, vol: 0.12 }),
};

// event type per game -> voice
const PP_SFX_MAP = {
  jump: 'jump',
  double: 'double',
  land: 'land',
  hit: 'hit',
  crash: 'crash',
  star: 'coin',
  gate: 'coin',
  jelly: 'coin',
  fuel: 'gain',
  potion: 'gain',
  level: 'level',
  gateMiss: 'miss',
  near: 'near',
  rescue: 'rescue',
  break: 'iceBreak',
  stuck: 'iceThud',
  contact: 'iceThud',
  whiff: 'whiff',
};

function playIntroSfx(type, ev = {}) {
  if (!soundReady() || !sfxOn()) return;
  const name = PP_SFX_MAP[type] || (ev.points ? 'coin' : null);
  if (!name) return;
  // The same voice at most every 40 ms (several pickups in one frame would just get louder)
  const nowP = performance.now();
  if (nowP - (PP_SOUND.lastEvent[name] || 0) < 40) return;
  PP_SOUND.lastEvent[name] = nowP;
  PP_SFX[name](PP_SOUND.ctx.currentTime + 0.005, ev.perfect);
}

// ---------------------------------------------------------------------------------------------------------------
// Town carols: public-domain melodies (no lyrics) in our own chip arrangement, one picked at random each time the
// town opens, never the same one twice in a row. Bars are [beat in bar, midi, beats]; roots = bass note per bar
// (null = rest). All play on the town beat (app.js townBeatT0 / TOWN_BEAT_MS) so the landing, the talk turns and the
// tree lights hit the beat. All are dressed up as upbeat chiptune: drums, a bouncing octave bass, 16th-note chord
// arpeggios under the lead and an octave doubling, so even the old hymn tunes party.
//   Jingle Bells (Pierpont 1857) / Deck the Halls (Welsh Nos Galan) / We Wish You a Merry Christmas (English
//   traditional; the 1935 Warrell arrangement is not what we play) / Good King Wenceslas (tune from Piae Cantiones,
//   1582; words Neale 1853)
// ---------------------------------------------------------------------------------------------------------------
const JB_A = [
  [[0, 76, 1], [1, 76, 1], [2, 76, 2]],
  [[0, 76, 1], [1, 76, 1], [2, 76, 2]],
  [[0, 76, 1], [1, 79, 1], [2, 72, 1.5], [3.5, 74, 0.5]],
  [[0, 76, 4]],
  [[0, 77, 1], [1, 77, 1], [2, 77, 1.5], [3.5, 77, 0.5]],
  [[0, 77, 1], [1, 76, 1], [2, 76, 1], [3, 76, 0.5], [3.5, 76, 0.5]],
];
const DECK_A = [
  [[0, 79, 1.5], [1.5, 77, 0.5], [2, 76, 1], [3, 74, 1]],
  [[0, 72, 1], [1, 74, 1], [2, 76, 1], [3, 72, 1]],
  [[0, 74, 0.5], [0.5, 76, 0.5], [1, 77, 0.5], [1.5, 74, 0.5], [2, 76, 1.5], [3.5, 74, 0.5]],
  [[0, 72, 1], [1, 71, 1], [2, 72, 2]],
];
const WISH_A = [
  [[0, 72, 1], [1, 72, 0.5], [1.5, 74, 0.5], [2, 72, 0.5], [2.5, 71, 0.5]],
  [[0, 69, 1], [1, 69, 1], [2, 69, 1]],
  [[0, 74, 1], [1, 74, 0.5], [1.5, 76, 0.5], [2, 74, 0.5], [2.5, 72, 0.5]],
  [[0, 71, 1], [1, 67, 1], [2, 67, 1]],
  [[0, 76, 1], [1, 76, 0.5], [1.5, 77, 0.5], [2, 76, 0.5], [2.5, 74, 0.5]],
  [[0, 72, 1], [1, 69, 1], [2, 67, 0.5], [2.5, 67, 0.5]],
  [[0, 69, 1], [1, 74, 1], [2, 71, 1]],
];
const WISH_A_ROOTS = [48, 53, 50, 55, 52, 45, 53];
const KING_A = [
  [[0, 72, 1], [1, 72, 1], [2, 72, 1], [3, 74, 1]],
  [[0, 72, 1], [1, 72, 1], [2, 67, 2]],
  [[0, 69, 1], [1, 67, 1], [2, 69, 1], [3, 71, 1]],
  [[0, 72, 2], [2, 72, 2]],
];
// Upbeat, cute, 100% public-domain melodies arranged in bouncy 8-bit chiptune:
// 1) Gossec — Gavotte in D (1786, public domain; the classic cute cartoon/toy-village melody, here in C)
// 2) Mozart — Eine kleine Nachtmusik K. 525 (1787, public domain; bright, cheerful arcade bounce)
// 3) Grieg — In the Hall of the Mountain King Op. 46 (1876, public domain; playful-spooky Halloween tiptoe bounce)
// 4) Offenbach — Galop Infernal / Can-Can (1858, public domain; B-grade arcade party energy)
const GAVOTTE_A = [
  [[0, 79, 1], [1, 76, 1], [2, 77, 1], [3, 74, 1]],
  [[0, 76, 1], [1, 72, 1], [2, 67, 1], [3, 72, 1]],
  [[0, 74, 0.5], [0.5, 76, 0.5], [1, 77, 0.5], [1.5, 74, 0.5], [2, 76, 1], [3, 79, 1]],
  [[0, 74, 2], [2, 67, 2]],
];
const NACHT_A = [
  [[0, 72, 1.5], [1.5, 67, 0.5], [2, 72, 1.5], [3.5, 67, 0.5]],
  [[0, 72, 0.5], [0.5, 67, 0.5], [1, 72, 0.5], [1.5, 76, 0.5], [2, 79, 2]],
  [[0, 77, 1.5], [1.5, 74, 0.5], [2, 77, 1.5], [3.5, 74, 0.5]],
  [[0, 77, 0.5], [0.5, 74, 0.5], [1, 71, 0.5], [1.5, 74, 0.5], [2, 67, 2]],
];
const MKING_A = [
  [[0, 69, 0.5], [0.5, 71, 0.5], [1, 72, 0.5], [1.5, 74, 0.5], [2, 76, 0.5], [2.5, 72, 0.5], [3, 76, 1]],
  [[0, 75, 0.5], [0.5, 71, 0.5], [1, 75, 1], [2, 74, 0.5], [2.5, 70, 0.5], [3, 74, 1]],
  [[0, 69, 0.5], [0.5, 71, 0.5], [1, 72, 0.5], [1.5, 74, 0.5], [2, 76, 0.5], [2.5, 72, 0.5], [3, 76, 0.5], [3.5, 81, 0.5]],
  [[0, 79, 0.5], [0.5, 76, 0.5], [1, 72, 0.5], [1.5, 76, 0.5], [2, 79, 2]],
];
const CANCAN_A = [
  [[0, 72, 2], [2, 74, 1], [3, 77, 1]],
  [[0, 76, 1], [1, 74, 1], [2, 79, 1], [3, 79, 1]],
  [[0, 79, 0.5], [0.5, 81, 0.5], [1, 74, 0.5], [1.5, 76, 0.5], [2, 77, 1], [3, 74, 1]],
  [[0, 74, 1], [1, 76, 0.5], [1.5, 74, 0.5], [2, 72, 1], [3, 71, 1]],
];

const CUTE_UPBEAT_SONGS = [
  {
    id: 'gavotte',
    bpb: 4,
    plays: 1,
    bars: [
      ...GAVOTTE_A,
      GAVOTTE_A[0],
      GAVOTTE_A[1],
      [[0, 74, 0.5], [0.5, 76, 0.5], [1, 77, 1], [2, 76, 1], [3, 74, 1]],
      [[0, 72, 3], [3, 79, 1]],
      [[0, 81, 1], [1, 77, 1], [2, 79, 1], [3, 76, 1]],
      [[0, 77, 1], [1, 74, 1], [2, 76, 1], [3, 72, 1]],
      [[0, 74, 0.5], [0.5, 76, 0.5], [1, 77, 1], [2, 76, 1], [3, 74, 1]],
      [[0, 79, 2], [2, 79, 2]],
      ...GAVOTTE_A.slice(0, 2),
      [[0, 74, 0.5], [0.5, 76, 0.5], [1, 77, 1], [2, 76, 1], [3, 74, 1]],
      [[0, 72, 4]],
    ],
    roots: [48, 48, 55, 55, 48, 48, 53, 48, 53, 50, 55, 55, 48, 48, 55, 48],
  },
  {
    id: 'mountain',
    bpb: 4,
    plays: 1,
    bars: [
      ...MKING_A,
      ...MKING_A.slice(0, 2),
      [[0, 69, 0.5], [0.5, 71, 0.5], [1, 72, 0.5], [1.5, 74, 0.5], [2, 76, 0.5], [2.5, 72, 0.5], [3, 76, 0.5], [3.5, 81, 0.5]],
      [[0, 79, 2], [2, 76, 2]],
      [[0, 83, 0.5], [0.5, 81, 0.5], [1, 79, 0.5], [1.5, 78, 0.5], [2, 76, 0.5], [2.5, 79, 0.5], [3, 83, 1]],
      [[0, 84, 0.5], [0.5, 81, 0.5], [1, 76, 1], [2, 81, 0.5], [2.5, 79, 0.5], [3, 76, 1]],
      [[0, 74, 0.5], [0.5, 76, 0.5], [1, 77, 0.5], [1.5, 74, 0.5], [2, 76, 0.5], [2.5, 72, 0.5], [3, 69, 1]],
      [[0, 71, 1], [1, 76, 1], [2, 69, 2]],
      ...MKING_A.slice(0, 2),
      [[0, 69, 0.5], [0.5, 71, 0.5], [1, 72, 0.5], [1.5, 74, 0.5], [2, 76, 0.5], [2.5, 79, 0.5], [3, 76, 0.5], [3.5, 74, 0.5]],
      [[0, 72, 2], [2, 69, 2]],
    ],
    roots: [45, 52, 45, 48, 45, 52, 45, 48, 52, 45, 50, 52, 45, 52, 55, 45],
  },
  {
    id: 'nacht',
    bpb: 4,
    plays: 1,
    bars: [
      ...NACHT_A,
      [[0, 72, 1], [1, 76, 1], [2, 79, 1], [3, 84, 1]],
      [[0, 81, 1], [1, 84, 1], [2, 79, 1], [3, 76, 1]],
      [[0, 77, 1], [1, 74, 1], [2, 79, 1], [3, 71, 1]],
      [[0, 72, 2], [2, 72, 2]],
      ...NACHT_A,
      [[0, 76, 0.5], [0.5, 77, 0.5], [1, 79, 1], [2, 81, 0.5], [2.5, 79, 0.5], [3, 77, 1]],
      [[0, 76, 1], [1, 74, 1], [2, 79, 2]],
      [[0, 84, 1], [1, 79, 1], [2, 76, 1], [3, 74, 1]],
      [[0, 72, 4]],
    ],
    roots: [48, 48, 55, 55, 48, 53, 55, 48, 48, 48, 55, 55, 48, 55, 55, 48],
  },
  {
    id: 'cancan',
    bpb: 4,
    plays: 1,
    bars: [
      ...CANCAN_A,
      [[0, 69, 1], [1, 79, 1], [2, 77, 0.5], [2.5, 76, 0.5], [3, 74, 0.5], [3.5, 72, 0.5]],
      [[0, 74, 0.5], [0.5, 72, 0.5], [1, 71, 0.5], [1.5, 69, 0.5], [2, 67, 2]],
      ...CANCAN_A.slice(0, 3),
      [[0, 74, 1], [1, 79, 1], [2, 72, 2]],
      ...CANCAN_A.slice(0, 2),
      [[0, 81, 1], [1, 79, 1], [2, 77, 1], [3, 76, 1]],
      [[0, 74, 1], [1, 79, 1], [2, 72, 2]],
      [[0, 79, 1], [1, 76, 1], [2, 74, 1], [3, 79, 1]],
      [[0, 72, 4]],
    ],
    roots: [48, 55, 50, 48, 53, 55, 48, 55, 50, 48, 48, 55, 53, 48, 55, 48],
  },
];

// Preserved Christmas Carols (automatically used when INTRO_TOWN.id === 'xmas')
const XMAS_TOWN_SONGS = [
  {
    id: 'jingle',
    bpb: 4,
    plays: 1,
    bars: [...JB_A, [[0, 76, 1], [1, 74, 1], [2, 74, 1], [3, 76, 1]], [[0, 74, 2], [2, 79, 2]], ...JB_A, [[0, 79, 1], [1, 79, 1], [2, 77, 1], [3, 74, 1]], [[0, 72, 4]]],
    roots: [48, 48, 48, 48, 53, 48, 50, 55, 48, 48, 48, 48, 53, 48, 43, 48],
  },
  {
    id: 'deck',
    bpb: 4,
    plays: 1,
    bars: [
      ...DECK_A,
      ...DECK_A,
      [[0, 74, 1.5], [1.5, 76, 0.5], [2, 77, 1], [3, 74, 1]],
      [[0, 76, 1.5], [1.5, 77, 0.5], [2, 79, 1], [3, 74, 1]],
      [[0, 76, 0.5], [0.5, 78, 0.5], [1, 79, 1], [2, 81, 0.5], [2.5, 83, 0.5], [3, 84, 1]],
      [[0, 83, 1], [1, 81, 1], [2, 79, 2]],
      DECK_A[0],
      DECK_A[1],
      [[0, 81, 0.5], [0.5, 81, 0.5], [1, 81, 0.5], [1.5, 81, 0.5], [2, 79, 1.5], [3.5, 77, 0.5]],
      [[0, 76, 1], [1, 74, 1], [2, 72, 2]],
    ],
    roots: [48, 48, 55, 48, 48, 48, 55, 48, 55, 48, 50, 55, 48, 48, 53, 48],
  },
  {
    id: 'wish',
    bpb: 3,
    plays: 1,
    bars: [[[2, 67, 1]], ...WISH_A, [[0, 72, 2], [2, 67, 1]], ...WISH_A, [[0, 72, 3]]],
    roots: [null, ...WISH_A_ROOTS, 48, ...WISH_A_ROOTS, 48],
  },
  {
    id: 'king',
    bpb: 4,
    plays: 1,
    bars: [
      ...KING_A,
      ...KING_A,
      [[0, 79, 1], [1, 77, 1], [2, 76, 1], [3, 74, 1]],
      [[0, 76, 1], [1, 74, 1], [2, 72, 2]],
      [[0, 69, 1], [1, 67, 1], [2, 69, 1], [3, 71, 1]],
      [[0, 72, 2], [2, 72, 2]],
      [[0, 67, 1], [1, 67, 1], [2, 69, 1], [3, 71, 1]],
      [[0, 72, 1], [1, 72, 1], [2, 74, 2]],
      [[0, 79, 1], [1, 77, 1], [2, 76, 1], [3, 74, 1]],
      [[0, 72, 2], [2, 77, 2]],
      [[0, 72, 4]],
    ],
    roots: [48, 48, 55, 48, 48, 48, 55, 48, 55, 48, 55, 48, 55, 48, 55, 48, 48],
  },
];
function activeTownSongs() {
  return typeof INTRO_TOWN !== 'undefined' && INTRO_TOWN.id === 'xmas' ? XMAS_TOWN_SONGS : CUTE_UPBEAT_SONGS;
}
const TOWN_SONGS = CUTE_UPBEAT_SONGS;
const PP_CAROL_STORE = 'ppeng-last-carol';

// The town's playlist: when one song ends, a bar's rest, then another one (never the same twice running), for as
// long as the town is open. Rebuilt for every visit; the last song heard is remembered across visits.
const CAROL_GAP_BEATS = 4;
function pickCarol(notId) {
  const songs = activeTownSongs();
  const pool = songs.filter((song) => song.id !== notId);
  return pool[Math.floor(Math.random() * pool.length)];
}
// The playlist entry playing at beat b (from the town's first note): { song, start, len } in beats
function townPlaylistAt(b) {
  const key = MOTION_STATE.sceneStartTime;
  if (PP_SOUND.songKey !== key) {
    let last = null;
    try {
      last = localStorage.getItem(PP_CAROL_STORE);
    } catch (e) {}
    PP_SOUND.songKey = key;
    PP_SOUND.playlist = [];
    PP_SOUND.nextCarol = pickCarol(last);
  }
  const list = PP_SOUND.playlist;
  while (!list.length || list[list.length - 1].start + list[list.length - 1].len + CAROL_GAP_BEATS <= b) {
    const prev = list[list.length - 1];
    const song = prev ? pickCarol(prev.song.id) : PP_SOUND.nextCarol;
    const start = prev ? prev.start + prev.len + CAROL_GAP_BEATS : 0;
    list.push({ song, start, len: song.bars.length * song.bpb * song.plays });
    try {
      localStorage.setItem(PP_CAROL_STORE, song.id);
    } catch (e) {}
    if (list.length > 40) break;
  }
  for (let i = list.length - 1; i >= 0; i--) if (b >= list[i].start) return list[i];
  return list[0];
}
// The carol playing right now (for the checks and the UI)
function townSong() {
  const t = typeof townBeat === 'function' ? Math.max(0, townBeat(performance.now())) : 0;
  const e = townPlaylistAt(t);
  PP_SOUND.song = e.song;
  return e.song;
}

function scheduleTownMusic(fromMs, toMs, emit) {
  const beatMs = TOWN_BEAT_MS;
  const t0 = townBeatT0();
  const end = (toMs - t0) / beatMs;
  const sec = beatMs / 1000;
  for (let b = Math.max(0, Math.ceil(((fromMs - t0) / beatMs) * 2) / 2); b <= end; b += 0.5) {
    const at = t0 + b * beatMs;
    if (at <= fromMs) continue;
    const entry = townPlaylistAt(b);
    const lb = b - entry.start;
    if (lb >= entry.len) continue; // the rest between two carols
    const song = entry.song;
    PP_SOUND.song = song;
    const bpb = song.bpb;
    const bar = Math.floor((lb % (song.bars.length * bpb)) / bpb);
    const inBar = (lb % (song.bars.length * bpb)) - bar * bpb;
    const music = PP_SOUND.music;
    const half = Math.round(inBar * 2); // eighth-note index in the bar
    // Lead: the NES pulse, doubled an octave down on a thin square for body
    song.bars[bar].forEach(([pos, m, len]) => {
      if (Math.abs(pos - inBar) > 1e-6) return;
      emit(at, (t) => sndTone(t, midiHz(m), len * sec * 0.85, { pulse: true, vol: 0.17, bus: music }));
      emit(at, (t) => sndTone(t, midiHz(m - 12), len * sec * 0.7, { type: 'square', vol: 0.035, bus: music }));
    });
    // Drums. 4/4: kick on 1 and 3, snare on 2 and 4; 3/4: kick on 1, snare on 2 and 3. Hats every eighth with
    // the sleigh bells shaking on the off-beats
    const kick = bpb === 3 ? half === 0 : half === 0 || half === 4;
    const snare = bpb === 3 ? half === 2 || half === 4 : half === 2 || half === 6;
    if (kick) {
      emit(at, (t) => {
        sndTone(t, 160, 0.12, { to: 42, type: 'triangle', vol: 0.36, bus: music });
        sndNoise(t, 0.04, { filter: 'lowpass', freq: 900, vol: 0.12, bus: music });
      });
    }
    if (snare) {
      emit(at, (t) => {
        sndNoise(t, 0.13, { filter: 'bandpass', freq: 1900, q: 0.9, vol: 0.17, bus: music });
        sndTone(t, 240, 0.06, { to: 150, type: 'square', vol: 0.04, bus: music });
      });
    }
    emit(at, (t) => sndNoise(t, 0.03, { freq: 9500, vol: half % 2 ? 0.05 : 0.03, bus: music }));
    if (half % 2) emit(at, (t) => sndNoise(t, 0.06, { freq: 6500, vol: 0.05, bus: music }));
    const root = song.roots[bar];
    if (root === null || root === undefined) continue;
    // Bass bouncing in eighths: root, octave, fifth, octave
    const step = [0, 12, 7, 12][half % 4];
    emit(at, (t) => sndTone(t, midiHz(root + step), sec * 0.42, { type: 'triangle', vol: 0.3, bus: music }));
    // Chord arpeggio in sixteenths under it all (major, minor on A)
    const chord = root % 12 === 9 ? [0, 3, 7] : [0, 4, 7];
    const base = root + 24;
    for (let k = 0; k < 2; k++) {
      const note = base + chord[(half * 2 + k) % 3];
      emit(at + k * (TOWN_BEAT_MS / 4), (t) => sndTone(t, midiHz(note), 0.07, { pulse: true, vol: 0.035, bus: music }));
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Scene cues: emit(atMs from the scene start, play(t))
// ---------------------------------------------------------------------------------------------------------------
function every(fromMs, toMs, start, end, step, fn) {
  for (let k = Math.max(0, Math.ceil((fromMs - start) / step)); start + k * step <= Math.min(toMs, end); k++) {
    const at = start + k * step;
    if (at > fromMs) fn(at, k);
  }
}

function once(fromMs, toMs, at, emit, play) {
  if (at > fromMs && at <= toMs) emit(at, play);
}

// Pull into the pillar, pixel scan, rise up it (scene 4, and stage 5 in the escape scene): shares of `dur`
function suckCues(fromMs, toMs, emit, dur, scanFrom, scanTo, riseFrom) {
  once(fromMs, toMs, 1, emit, (t) => {
    sndNoise(t, (scanFrom * dur) / 1000, { filter: 'bandpass', freq: 300, to: 2400, q: 3, vol: 0.32, attack: 0.3 });
    sndTone(t, 600, (scanFrom * dur) / 1000, { to: 140, type: 'triangle', vol: 0.12 });
  });
  const scale = [72, 74, 76, 79, 81, 84, 86, 88];
  every(fromMs, toMs, scanFrom * dur, scanTo * dur, 110, (at, k) => {
    emit(at, (t) => sndTone(t, midiHz(scale[(k * 5) % scale.length] + (k % 2 ? 12 : 0)), 0.06, { vol: 0.09 }));
  });
  // The slow float up: a rising chime every 2 beats, the opening notes of the town tune
  const rise = [60, 64, 67, 72, 76, 79, 84];
  every(fromMs, toMs, riseFrom * dur, dur - 200, ((1 - riseFrom) * dur - 200) / (rise.length - 1), (at, k) => {
    if (k < rise.length) emit(at, (t) => sndTone(t, midiHz(rise[k]), 0.5, { type: 'triangle', vol: 0.18 }));
  });
  once(fromMs, toMs, dur - 120, emit, (t) => sndArp(t, [84, 88, 91, 96], 0.03, { vol: 0.12, pulse: true, len: 0.4 }));
}

// The picker's alarm tick for a given time left: 1.5 s at the full 30 s (the slow end of what is still heard as a
// beat, London, Hearing in Time: about 100 ms - 1.5/2 s between beats), 0.16 s at zero (still countable: tapping
// along fails below ~120 ms, Repp 2003). In between it shrinks geometrically - the same ratio per second - since a
// change of tempo is heard as a ratio (Drake & Botte 1993), so the speed-up is felt as even all the way down.
const ALARM_TICK_SLOW = 1500;
const ALARM_TICK_FAST = 160;
function alarmTickMs(msLeft) {
  const r = Math.min(1, Math.max(0, msLeft / 30000));
  return ALARM_TICK_FAST * Math.pow(ALARM_TICK_SLOW / ALARM_TICK_FAST, r);
}

function sceneCues(fromMs, toMs, emit) {
  const s = MOTION_STATE.sceneIdx;
  const v = MOTION_STATE.vehicle;
  if (s === 4) {
    if (!MOTION_STATE.skippedEscape && sfxOn()) {
      // The vehicle falls (whistle), slams in at 952 ms (the song's first note) and bounces until 1632
      once(fromMs, toMs, 1, emit, (t) => sndTone(t, 1400, 0.9, { to: 300, type: 'triangle', vol: 0.12 }));
      once(fromMs, toMs, 952, emit, (t) => {
        sndNoise(t, 0.5, { filter: 'lowpass', freq: 1600, to: 150, vol: 0.5 });
        sndTone(t, 120, 0.3, { to: 45, type: 'triangle', vol: 0.35 });
      });
      once(fromMs, toMs, 1292, emit, (t) => sndNoise(t, 0.1, { filter: 'lowpass', freq: 700, vol: 0.22 }));
    }
    if (PP_SOUND.musicOn) {
      // In the Easter egg the town carol stops as the screen breaks up and the village has its own
      const easter = typeof townEasterOn === 'function' && townEasterOn();
      const stop = easter ? TOWN_EASTER.cutAt - TOWN_EASTER.dissolveMs : Infinity;
      if (fromMs < stop) scheduleTownMusic(fromMs, Math.min(toMs, stop), emit);
      if (easter && toMs >= TOWN_EASTER.cutAt) easterCues(fromMs, toMs, emit);
    }
    return;
  }
  if (!sfxOn()) return;
  if (s === 0) {
    if (MOTION_STATE.scene0IdleStart || OPENING.active) return; // stage 5 runs on its own clock (soundTick)
    // Alarm: one beep per tick, high and low in turn (beep-boop), the tick shrinking with the countdown
    let n = 0;
    if (PP_SOUND.alarmKey !== MOTION_STATE.sceneStartTime) {
      PP_SOUND.alarmKey = MOTION_STATE.sceneStartTime;
      PP_SOUND.alarmNext = 600;
      PP_SOUND.alarmN = 0;
    }
    while (PP_SOUND.alarmNext <= toMs && n++ < 400) {
      const at = PP_SOUND.alarmNext;
      const left = typeof scene0MsLeft === 'function' ? scene0MsLeft(MOTION_STATE.sceneStartTime + at) : 30000 - at;
      const tick = alarmTickMs(left);
      const k = PP_SOUND.alarmN++;
      if (at > fromMs) {
        const esc = 1 - Math.min(1, left / 30000);
        const f = midiHz((k % 2 ? 76 : 81) + Math.round(esc * 5));
        emit(at, (t) => sndTone(t, f, Math.min(0.14, (tick / 1000) * 0.5), { vol: 0.05 + esc * 0.08 }));
      }
      PP_SOUND.alarmNext = at + tick;
    }
  } else if (s === 1) {
    // Departure (2.6 s): the engine revs up and the vehicle gets away
    once(fromMs, toMs, 1, emit, (t) => {
      if (v === 'boat') {
        sndTone(t, 110, 0.5, { type: 'sawtooth', vol: 0.12 });
        sndTone(t + 0.6, 98, 0.8, { type: 'sawtooth', vol: 0.12 });
        sndNoise(t + 0.4, 2, { filter: 'lowpass', freq: 500, to: 1500, vol: 0.12, attack: 0.4 });
      } else if (v === 'car') {
        sndTone(t, 60, 2.2, { to: 240, type: 'sawtooth', vol: 0.12, attack: 0.1 });
        sndNoise(t + 0.3, 0.4, { freq: 1500, vol: 0.12 });
      } else if (v === 'fish') {
        sndNoise(t + 0.15, 0.25, { filter: 'bandpass', freq: 800, to: 3200, q: 1.5, vol: 0.14 });
        sndTone(t + 0.65, 380, 0.18, { to: 160, type: 'triangle', vol: 0.18 });
        sndTone(t + 0.82, 220, 0.22, { to: 520, type: 'sine', vol: 0.16 });
      } else {
        sndTone(t, 80, 2.2, { to: 320, type: 'square', vol: 0.07, attack: 0.2 });
        sndNoise(t + 0.6, 1.6, { filter: 'bandpass', freq: 400, to: 3000, q: 1.2, vol: 0.14, attack: 0.5 });
      }
    });
  } else if (s === 3) {
    suckCues(fromMs, toMs, emit, 7000, 0.24, 0.6, 0.64);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Opening soundtrack (opening-scene.js), on the opening's clock (OPENING.start). It is the film's score, so it sits
// on the music switch with the carols: a music box over the peaceful land, silence and a drone as the sky darkens,
// a star twinkle, a falling whistle and the hit, glitchy blips while the wave spreads, a chase bass and a boing per
// hop while the hero runs, a whoosh into the crevasse field, a chime for each vehicle found and a little fanfare.
// (The penguins' pops as they turn into pixels come from opening-scene.js, as they happen.)
// ---------------------------------------------------------------------------------------------------------------
function openingCues(fromMs, toMs, emit) {
  const bus = PP_SOUND.music;
  // One tone / noise at m ms into the opening, played once (only when m falls in this tick's window)
  const T = (m, f, len, o = {}) => once(fromMs, toMs, m, emit, (t) => sndTone(t, f, len, { bus, ...o }));
  const N = (m, len, o = {}) => once(fromMs, toMs, m, emit, (t) => sndNoise(t, len, { bus, ...o }));
  // A: music box, a slow C - Am - F - G loop in eighths, with a soft bass
  const box = [72, 76, 79, 84, 79, 76, 69, 72, 76, 81, 76, 72, 65, 69, 72, 77, 72, 69, 67, 71, 74, 79, 74, 71];
  every(fromMs, toMs, 150, 3700, 150, (at, k) => T(at, midiHz(box[k % box.length] + 12), 0.5, { type: 'triangle', vol: 0.09 }));
  every(fromMs, toMs, 150, 3700, 900, (at, k) => T(at, midiHz([48, 45, 41, 43][k % 4]), 0.8, { type: 'triangle', vol: 0.16 }));
  // Snowball fight and the belly-slide
  if (typeof OPENING_SNOWBALLS !== 'undefined') {
    OPENING_SNOWBALLS.forEach(([at]) => {
      once(fromMs, toMs, at, emit, (t) => sndNoise(t, 0.12, { filter: 'bandpass', freq: 900, to: 2400, q: 1.4, vol: 0.06, bus }));
      once(fromMs, toMs, at + 450, emit, (t) => {
        sndNoise(t, 0.1, { filter: 'lowpass', freq: 1200, vol: 0.12, bus });
        sndTone(t + 0.02, 1500, 0.09, { to: 2200, type: 'square', vol: 0.04, bus });
      });
    });
  }
  N(500, 1.3, { filter: 'bandpass', freq: 2500, to: 900, q: 0.8, vol: 0.05, attack: 0.08 });
  // B: the sky darkens (low drone swelling), a star twinkles, falls (whistle) and hits
  once(fromMs, toMs, 3800, emit, (t) => {
    sndTone(t, midiHz(33), 1.8, { type: 'sawtooth', vol: 0.07, attack: 0.9, bus });
    sndTone(t, midiHz(40), 1.8, { type: 'triangle', vol: 0.1, attack: 0.9, bus });
  });
  every(fromMs, toMs, 3950, 4650, 180, (at, k) => T(at, midiHz([96, 100, 103, 108][k % 4]), 0.12, { pulse: true, vol: 0.05 }));
  T(4700, 2600, 0.9, { to: 180, type: 'triangle', vol: 0.12 });
  once(fromMs, toMs, OPENING_IMPACT, emit, (t) => {
    sndNoise(t, 1.1, { filter: 'lowpass', freq: 1800, to: 90, vol: 0.55, bus });
    sndTone(t, 110, 0.7, { to: 35, type: 'triangle', vol: 0.45, bus });
    sndTone(t, 220, 0.25, { to: 60, type: 'square', vol: 0.12, bus });
  });
  N(OPENING_IMPACT + 200, 1.4, { filter: 'lowpass', freq: 200, vol: 0.2, attack: 0.05 });
  // Panic: a nervous minor stab pattern under the screaming
  every(fromMs, toMs, 6000, 7000, 250, (at, k) => T(at, midiHz([57, 60, 57, 63][k % 4]), 0.12, { pulse: true, vol: 0.06 }));
  // C: the pixel wave - a rising digital hum and scattered glitch blips
  once(fromMs, toMs, 7000, emit, (t) => sndTone(t, 90, 3.3, { to: 220, type: 'sawtooth', vol: 0.05, attack: 0.6, bus }));
  const glitch = [81, 84, 88, 91, 93, 96];
  every(fromMs, toMs, 7000, 10300, 110, (at, k) => {
    if (k % 3 === 2) return;
    T(at, midiHz(glitch[(k * 5) % glitch.length]), 0.05, { vol: 0.035 });
  });
  // D: the hero's "RUN!!", a chase bass in eighths and a boing on every hop (rising as it gets away)
  T(10000, 330, 0.18, { to: 660, pulse: true, vol: 0.08 });
  every(fromMs, toMs, 10300, 13000, 150, (at, k) => T(at, midiHz([40, 40, 43, 40, 45, 40, 43, 47][k % 8]), 0.12, { pulse: true, vol: 0.1 }));
  every(fromMs, toMs, 10300, 12900, 300, (at, k) => T(at + 40, 260 + k * 18, 0.22, { to: 620 + k * 30, type: 'square', vol: 0.06 }));
  // E: whoosh into the field, a chime for each vehicle (higher each time), then a little fanfare
  N(OPENING_CUT - 350, 0.7, { filter: 'bandpass', freq: 400, to: 4000, q: 1, vol: 0.12, attack: 0.2 });
  if (typeof OPENING_FOUND !== 'undefined') {
    OPENING_FOUND.forEach((f, i) => {
      once(fromMs, toMs, f.at, emit, (t) => sndArp(t, [72 + i * 2, 76 + i * 2, 79 + i * 2, 84 + i * 2], 0.07, { pulse: true, vol: 0.1, len: 0.35, bus }));
      once(fromMs, toMs, f.at, emit, (t) => sndNoise(t, 0.25, { freq: 6000, vol: 0.05, bus }));
    });
  }
  once(fromMs, toMs, 18300, emit, (t) => {
    sndArp(t, [67, 72, 76, 79], 0.1, { pulse: true, vol: 0.11, len: 0.3, bus });
    sndTone(t + 0.42, midiHz(84), 0.9, { pulse: true, vol: 0.12, bus });
    sndTone(t + 0.42, midiHz(48), 0.9, { type: 'triangle', vol: 0.2, bus });
  });
}

// ---------------------------------------------------------------------------------------------------------------
// The hidden village's own carol (town-easter.js). The town carol stops as the screen breaks up, a deep "thud"
// lands on the cut (the screen shakes with it), a sparkle and a snare roll lead in for four beats, then Joy to the
// World plays as a party: four-on-the-floor kick, claps on the backbeat, open hats and sleigh bells, an octave disco
// bass, off-beat chord stabs; the second pass a whole step higher with bells on top, a drum break, and then the
// village shuffles its carols like the town (villagePlaylistAt).
// Tune ANTIOCH as printed by Lowell Mason, The Modern Psalmist (Boston 1839), No. 144: public domain (Mason d. 1872;
// the Handel attribution is disputed and does not matter). Not the 1970 Hoyt Axton song of the same name.
// Here in C, the lead an octave up; 20 bars of 2/4 at 150 BPM (TOWN_EASTER_BEAT_MS).
// ---------------------------------------------------------------------------------------------------------------
const JOY_BARS = [
  [[0, 84, 1], [1, 83, 0.75], [1.75, 81, 0.25]],
  [[0, 79, 1.5], [1.5, 77, 0.5]],
  [[0, 76, 1], [1, 74, 1]],
  [[0, 72, 1.5], [1.5, 79, 0.5]],
  [[0, 81, 1.5], [1.5, 81, 0.5]],
  [[0, 83, 1.5], [1.5, 83, 0.5]],
  [[0, 84, 3.5]],
  [[1.5, 84, 0.5]],
  [[0, 84, 0.5], [0.5, 83, 0.5], [1, 81, 0.5], [1.5, 79, 0.5]],
  [[0, 79, 0.75], [0.75, 77, 0.25], [1, 76, 0.5], [1.5, 84, 0.5]],
  [[0, 84, 0.5], [0.5, 83, 0.5], [1, 81, 0.5], [1.5, 79, 0.5]],
  [[0, 79, 0.75], [0.75, 77, 0.25], [1, 76, 0.5], [1.5, 76, 0.5]],
  [[0, 76, 0.5], [0.5, 76, 0.5], [1, 76, 0.5], [1.5, 76, 0.25], [1.75, 77, 0.25]],
  [[0, 79, 1.5], [1.5, 77, 0.25], [1.75, 76, 0.25]],
  [[0, 74, 0.5], [0.5, 74, 0.5], [1, 74, 0.5], [1.5, 74, 0.25], [1.75, 76, 0.25]],
  [[0, 77, 1.5], [1.5, 76, 0.25], [1.75, 74, 0.25]],
  [[0, 76, 0.5], [0.5, 84, 1], [1.5, 81, 0.5]],
  [[0, 79, 0.75], [0.75, 77, 0.25], [1, 76, 0.5], [1.5, 77, 0.5]],
  [[0, 76, 1], [1, 74, 1]],
  [[0, 72, 2]],
];
// Chord on each beat: bass root and the chord's notes above it
const JOY_CHORD = {
  C: [48, [0, 4, 7]],
  Dm: [50, [0, 3, 7]],
  D: [50, [0, 4, 7]],
  Em: [52, [0, 3, 7]],
  F: [41, [0, 4, 7]],
  G: [43, [0, 4, 7]],
  G7: [43, [0, 4, 7, 10]],
  Am: [45, [0, 3, 7]],
  B: [47, [0, 4, 7]],
};
const JOY_HARMONY = [
  ['C', 'C'], ['C', 'C'], ['G', 'G'], ['C', 'C'], ['F', 'F'], ['G', 'G'], ['C', 'C'], ['C', 'C'], ['C', 'Am'], ['C', 'C'],
  ['C', 'F'], ['C', 'C'], ['C', 'C'], ['C', 'C'], ['G', 'G'], ['G7', 'G7'], ['C', 'F'], ['C', 'F'], ['C', 'G'], ['C', 'C'],
];
const JOY_PASS = JOY_BARS.length * 2; // beats in one pass
const JOY_BREAK = 4; // beats of drum break after every two passes
const JOY_CYCLE = JOY_PASS * 2 + JOY_BREAK;

// After Joy the village shuffles carols like the town does: the town's four plus two more, all public domain, in
// the same party dress (chords per beat where given, else the town's bass roots).
//   Ding Dong Merrily on High: tune Branle de l'Official from Arbeau's Orchesographie (1589), as set by Charles Wood
//   (Cambridge Carol-Book 1924; Wood d. 1926), Bb -> C. God Rest You Merry, Gentlemen: English traditional, E minor,
//   lead an octave up. Both read from the scores in their Wikipedia articles (scratch/easter_carol/lily.py).
const DING_SONG = {
  id: 'ding',
  bpb: 4,
  bars: [
    [[0, 72, 1], [1, 72, 1], [2, 74, 0.5], [2.5, 72, 0.5], [3, 71, 0.5], [3.5, 69, 0.5]],
    [[0, 67, 3], [3, 67, 1]],
    [[0, 69, 1], [1, 72, 1], [2, 72, 1], [3, 71, 1]],
    [[0, 72, 2], [2, 72, 2]],
    [[0, 72, 1], [1, 72, 1], [2, 74, 0.5], [2.5, 72, 0.5], [3, 71, 0.5], [3.5, 69, 0.5]],
    [[0, 67, 3], [3, 67, 1]],
    [[0, 69, 1], [1, 72, 1], [2, 72, 1], [3, 71, 1]],
    [[0, 72, 2], [2, 72, 2]],
    [[0, 79, 1.5], [1.5, 77, 0.5], [2, 76, 0.5], [2.5, 77, 0.5], [3, 79, 0.5], [3.5, 76, 0.5]],
    [[0, 77, 1.5], [1.5, 76, 0.5], [2, 74, 0.5], [2.5, 76, 0.5], [3, 77, 0.5], [3.5, 74, 0.5]],
    [[0, 76, 1.5], [1.5, 74, 0.5], [2, 72, 0.5], [2.5, 74, 0.5], [3, 76, 0.5], [3.5, 72, 0.5]],
    [[0, 74, 1.5], [1.5, 72, 0.5], [2, 71, 0.5], [2.5, 72, 0.5], [3, 74, 0.5], [3.5, 71, 0.5]],
    [[0, 72, 1.5], [1.5, 71, 0.5], [2, 69, 0.5], [2.5, 71, 0.5], [3, 72, 0.5], [3.5, 69, 0.5]],
    [[0, 71, 1.5], [1.5, 69, 0.5], [2, 67, 1], [3, 67, 1]],
    [[0, 69, 1], [1, 72, 1], [2, 72, 1], [3, 71, 1]],
    [[0, 72, 2], [2, 72, 2]],
  ],
  harm: [
    ['C', 'C', 'F', 'G'],
    ['G', 'G', 'G', 'G'],
    ['F', 'Am', 'G', 'G'],
    ['C', 'C', 'C', 'C'],
    ['C', 'C', 'F', 'G'],
    ['G', 'G', 'G', 'G'],
    ['F', 'Am', 'G', 'G'],
    ['C', 'C', 'C', 'C'],
    ['C', 'C', 'C', 'C'],
    ['Dm', 'Dm', 'G', 'G'],
    ['C', 'C', 'C', 'C'],
    ['G', 'G', 'G', 'G'],
    ['Am', 'Am', 'Am', 'Am'],
    ['G', 'G', 'C', 'C'],
    ['F', 'Am', 'G', 'G'],
    ['C', 'C', 'C', 'C'],
  ],
};
const GOD_SONG = {
  id: 'god',
  bpb: 4,
  bars: [
    [[3, 76, 1]],
    [[0, 76, 1], [1, 83, 1], [2, 83, 1], [3, 81, 1]],
    [[0, 79, 1], [1, 78, 1], [2, 76, 1], [3, 74, 1]],
    [[0, 76, 1], [1, 78, 1], [2, 79, 1], [3, 81, 1]],
    [[0, 83, 3], [3, 76, 1]],
    [[0, 76, 1], [1, 83, 1], [2, 83, 1], [3, 81, 1]],
    [[0, 79, 1], [1, 78, 1], [2, 76, 1], [3, 74, 1]],
    [[0, 76, 1], [1, 78, 1], [2, 79, 1], [3, 81, 1]],
    [[0, 83, 3], [3, 83, 1]],
    [[0, 84, 1], [1, 81, 1], [2, 83, 1], [3, 84, 1]],
    [[0, 86, 1], [1, 88, 1], [2, 83, 1], [3, 81, 1]],
    [[0, 79, 1], [1, 76, 1], [2, 78, 1], [3, 79, 1]],
    [[0, 81, 2], [2, 79, 1], [3, 81, 1]],
    [[0, 83, 2], [2, 84, 1], [3, 83, 1]],
    [[0, 83, 1], [1, 81, 1], [2, 79, 1], [3, 78, 1]],
    [[0, 76, 2], [2, 79, 0.5], [2.5, 78, 0.5], [3, 76, 1]],
    [[0, 81, 2], [2, 79, 1], [3, 81, 1]],
    [[0, 83, 1], [1, 84, 1], [2, 86, 1], [3, 88, 1]],
    [[0, 83, 1], [1, 81, 1], [2, 79, 1], [3, 78, 1]],
    [[0, 76, 3]],
  ],
  harm: [
    [null, null, null, 'Em'],
    ['Em', 'Em', 'Em', 'Am'],
    ['Em', 'B', 'Em', 'D'],
    ['C', 'D', 'G', 'D'],
    ['B', 'B', 'B', 'Em'],
    ['Em', 'Em', 'Em', 'Am'],
    ['Em', 'B', 'Em', 'D'],
    ['C', 'D', 'G', 'D'],
    ['B', 'B', 'B', 'B'],
    ['Am', 'Am', 'Em', 'Am'],
    ['G', 'C', 'Em', 'D'],
    ['Em', 'Em', 'B', 'Em'],
    ['D', 'D', 'G', 'D'],
    ['Em', 'Em', 'C', 'Em'],
    ['Em', 'D', 'Em', 'B'],
    ['Em', 'Em', 'Em', 'Em'],
    ['Am', 'Am', 'G', 'D'],
    ['Em', 'C', 'G', 'C'],
    ['Em', 'D', 'Em', 'B'],
    ['Em', 'Em', 'Em', null],
  ],
};
// Cute-spooky & upbeat public-domain party lead for Halloween / non-Christmas Easter Egg Village:
// Tchaikovsky — Dance of the Sugar Plum Fairy & Trepak Party Medley (The Nutcracker Op. 71, 1892 — Public Domain),
// 20 bars of 2/4 at 150 BPM, matching JOY_BARS / JOY_HARMONY beat-for-beat!
const HAL_PARTY_BARS = [
  [[0.5, 79, 0.25], [0.75, 76, 0.25], [1, 79, 0.5], [1.5, 78, 0.5]],
  [[0, 75, 0.5], [0.5, 76, 0.5], [1, 74, 0.5], [1.5, 74, 0.5]],
  [[0, 73, 0.5], [0.5, 73, 0.5], [1, 72, 1]],
  [[0.5, 76, 0.25], [0.75, 72, 0.25], [1, 76, 0.5], [1.5, 79, 0.5]],
  [[0, 84, 0.5], [0.5, 83, 0.5], [1, 81, 0.5], [1.5, 79, 0.5]],
  [[0, 78, 0.5], [0.5, 79, 0.5], [1, 81, 0.5], [1.5, 78, 0.5]],
  [[0, 79, 1.5], [1.5, 79, 0.5]],
  [[0, 84, 0.5], [0.5, 79, 0.5], [1, 76, 0.5], [1.5, 72, 0.5]],
  // Burst into upbeat Trepak / Toy Party bounce!
  [[0, 84, 0.5], [0.5, 83, 0.25], [0.75, 84, 0.25], [1, 79, 0.5], [1.5, 76, 0.5]],
  [[0, 81, 0.5], [0.5, 79, 0.25], [0.75, 81, 0.25], [1, 77, 0.5], [1.5, 74, 0.5]],
  [[0, 79, 0.5], [0.5, 77, 0.5], [1, 76, 0.5], [1.5, 74, 0.5]],
  [[0, 72, 0.5], [0.5, 76, 0.5], [1, 79, 1]],
  [[0, 84, 0.5], [0.5, 83, 0.25], [0.75, 84, 0.25], [1, 79, 0.5], [1.5, 76, 0.5]],
  [[0, 81, 0.5], [0.5, 83, 0.25], [0.75, 84, 0.25], [1, 86, 0.5], [1.5, 83, 0.5]],
  [[0, 84, 0.5], [0.5, 79, 0.5], [1, 77, 0.5], [1.5, 74, 0.5]],
  [[0, 72, 1.5], [1.5, 79, 0.5]],
  [[0, 81, 0.5], [0.5, 77, 0.5], [1, 84, 0.5], [1.5, 81, 0.5]],
  [[0, 79, 0.5], [0.5, 76, 0.5], [1, 83, 0.5], [1.5, 79, 0.5]],
  [[0, 77, 0.5], [0.5, 76, 0.5], [1, 74, 0.5], [1.5, 79, 0.5]],
  [[0, 72, 2]],
];
const HAL_PARTY_HARMONY = [
  ['Em', 'B'], ['Em', 'G'], ['Am', 'Em'], ['C', 'G'], ['C', 'D'], ['D', 'B'], ['Em', 'G'], ['C', 'G'],
  ['C', 'C'], ['F', 'Dm'], ['G', 'G7'], ['C', 'C'], ['C', 'C'], ['F', 'G'], ['C', 'G'], ['C', 'C'],
  ['F', 'F'], ['C', 'Em'], ['Dm', 'G'], ['C', 'C'],
];

// Mozart — Rondo Alla Turca K. 331 (1783, Public Domain; cute & energetic arcade classic)
const TURCA_SONG = {
  id: 'turca',
  bpb: 4,
  bars: [
    [[0, 71, 0.5], [0.5, 69, 0.5], [1, 68, 0.5], [1.5, 69, 0.5], [2, 72, 2]],
    [[0, 74, 0.5], [0.5, 72, 0.5], [1, 71, 0.5], [1.5, 72, 0.5], [2, 76, 2]],
    [[0, 77, 0.5], [0.5, 76, 0.5], [1, 75, 0.5], [1.5, 76, 0.5], [2, 83, 0.5], [2.5, 81, 0.5], [3, 80, 0.5], [3.5, 81, 0.5]],
    [[0, 83, 0.5], [0.5, 81, 0.5], [1, 80, 0.5], [1.5, 81, 0.5], [2, 84, 2]],
    [[0, 81, 1], [1, 84, 1], [2, 79, 0.5], [2.5, 81, 0.5], [3, 77, 0.5], [3.5, 79, 0.5]],
    [[0, 76, 1], [1, 79, 1], [2, 74, 1], [3, 72, 1]],
    [[0, 71, 0.5], [0.5, 72, 0.5], [1, 74, 1], [2, 72, 1], [3, 71, 1]],
    [[0, 69, 4]],
  ],
  harm: [
    ['Am', 'Am', 'Am', 'Am'],
    ['Dm', 'Dm', 'Am', 'Am'],
    ['Dm', 'Dm', 'Am', 'Am'],
    ['E', 'E', 'Am', 'Am'].map((c) => (c === 'E' ? 'B' : c)),
    ['F', 'F', 'C', 'G'],
    ['C', 'C', 'G', 'Am'],
    ['Dm', 'Dm', 'Am', 'B'],
    ['Am', 'Am', 'Am', 'Am'],
  ],
};

// Boccherini — Minuet in E (G. 275, 1771, Public Domain; ultra-cute classic cartoon/music-box melody, here in C)
const BOCCHERINI_SONG = {
  id: 'boccherini',
  bpb: 3,
  bars: [
    [[0, 76, 0.5], [0.5, 74, 0.5], [1, 76, 0.5], [1.5, 79, 0.5], [2, 72, 0.5], [2.5, 76, 0.5]],
    [[0, 74, 1.5], [1.5, 79, 0.5], [2, 74, 1]],
    [[0, 77, 0.5], [0.5, 76, 0.5], [1, 77, 0.5], [1.5, 79, 0.5], [2, 71, 0.5], [2.5, 74, 0.5]],
    [[0, 72, 1.5], [1.5, 79, 0.5], [2, 72, 1]],
    [[0, 81, 1], [1, 84, 0.5], [1.5, 81, 0.5], [2, 79, 0.5], [2.5, 76, 0.5]],
    [[0, 77, 1], [1, 81, 0.5], [1.5, 77, 0.5], [2, 74, 0.5], [2.5, 71, 0.5]],
    [[0, 72, 1], [1, 76, 1], [2, 74, 1]],
    [[0, 72, 3]],
  ],
  harm: [
    ['C', 'C', 'C'],
    ['G', 'G', 'G'],
    ['G7', 'G7', 'G'],
    ['C', 'C', 'C'],
    ['F', 'F', 'C'],
    ['Dm', 'Dm', 'G'],
    ['C', 'Am', 'G'],
    ['C', 'C', 'C'],
  ],
};

const VILLAGE_GAP = 4; // beats of rest between two songs

// The village playlist: { song (null = lead song), start, len } in beats from first note.
function villagePlaylistAt(b) {
  const isXmas = typeof INTRO_TOWN !== 'undefined' && INTRO_TOWN.id === 'xmas';
  if (PP_SOUND.villageKey !== MOTION_STATE.sceneStartTime) {
    PP_SOUND.villageKey = MOTION_STATE.sceneStartTime;
    PP_SOUND.villageList = [{ song: null, start: 0, len: JOY_CYCLE }];
    PP_SOUND.villageBag = [];
  }
  const list = PP_SOUND.villageList;
  while (list[list.length - 1].start + list[list.length - 1].len + VILLAGE_GAP <= b && list.length < 80) {
    const prev = list[list.length - 1];
    if (!PP_SOUND.villageBag.length) {
      const bag = isXmas ? [...XMAS_TOWN_SONGS, DING_SONG, GOD_SONG] : [...CUTE_UPBEAT_SONGS, TURCA_SONG, BOCCHERINI_SONG];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (prev.song && bag[bag.length - 1].id === prev.song.id) bag.unshift(bag.pop());
      PP_SOUND.villageBag = bag;
    }
    const song = PP_SOUND.villageBag.pop();
    list.push({ song, start: prev.start + prev.len + (prev.song ? VILLAGE_GAP : 0), len: song.bars.length * song.bpb });
  }
  for (let i = list.length - 1; i >= 0; i--) if (b >= list[i].start) return list[i];
  return list[0];
}

function easterCues(fromMs, toMs, emit) {
  const bus = PP_SOUND.music;
  const beatMs = TOWN_EASTER_BEAT_MS;
  const cut = TOWN_EASTER.cutAt;
  const t0 = cut + TOWN_EASTER_LEADIN * beatMs;
  const sec = beatMs / 1000;
  // Thud
  once(fromMs, toMs, cut, emit, (t) => {
    sndTone(t, 130, 0.8, { to: 36, type: 'triangle', vol: 0.62, bus });
    sndTone(t, 260, 0.18, { to: 65, type: 'square', vol: 0.13, bus });
    sndNoise(t, 0.6, { filter: 'lowpass', freq: 1400, to: 80, vol: 0.45, bus });
    sndNoise(t, 0.04, { filter: 'bandpass', freq: 2600, vol: 0.14, bus });
  });
  // Lead-in: a sparkle up as the village shows, a noise riser and a snare roll into the first note
  once(fromMs, toMs, cut + beatMs, emit, (t) => {
    sndArp(t, [72, 76, 79, 84, 88, 91, 96], 0.045, { pulse: true, vol: 0.08, len: 0.25, bus });
    sndNoise(t + 0.3, 0.7, { freq: 7000, vol: 0.05, bus });
  });
  once(fromMs, toMs, cut + 2 * beatMs, emit, (t) => sndNoise(t, 2 * sec, { filter: 'bandpass', freq: 500, to: 6000, q: 1.2, vol: 0.1, attack: 2 * sec * 0.9, bus }));
  every(fromMs, toMs, cut + 2 * beatMs, t0 - 1, beatMs / 4, (at, k) => {
    emit(at, (t) => sndNoise(t, 0.07, { filter: 'bandpass', freq: 1900, q: 0.9, vol: 0.05 + k * 0.018, bus }));
  });
  // The playlist, on sixteenths from Joy's first note
  for (let q = Math.max(0, Math.ceil(((fromMs - t0) / beatMs) * 4)); ; q++) {
    const b = q / 4;
    const at = t0 + b * beatMs;
    if (at > toMs) break;
    if (at <= fromMs) continue;
    const entry = villagePlaylistAt(b);
    const lb = b - entry.start;
    if (lb >= entry.len) continue; // the rest between two carols
    const s16 = Math.round(lb * 4);
    if (!entry.song) {
      // Joy to the World: two passes, the second a whole step up with bells, then a drum break
      if (lb >= JOY_PASS * 2) {
        const k = Math.round((lb - JOY_PASS * 2) * 4);
        if (k === 0) emit(at, (t) => sndTone(t, 160, 0.14, { to: 40, type: 'triangle', vol: 0.4, bus }));
        if (k >= 4) emit(at, (t) => sndNoise(t, 0.08, { filter: 'bandpass', freq: 1700 + k * 60, q: 0.9, vol: 0.06 + k * 0.012, bus }));
        continue;
      }
      const isXmas = typeof INTRO_TOWN !== 'undefined' && INTRO_TOWN.id === 'xmas';
      const leadBars = isXmas ? JOY_BARS : HAL_PARTY_BARS;
      const leadHarm = isXmas ? JOY_HARMONY : HAL_PARTY_HARMONY;
      const pass = lb < JOY_PASS ? 0 : 1;
      const pb = lb - pass * JOY_PASS;
      const bar = Math.floor(pb / 2);
      const inBar = pb - bar * 2;
      const chord = JOY_CHORD[leadHarm[bar][Math.floor(inBar)]];
      partyBeat(emit, at, sec, leadBars[bar], inBar, s16 % 8, 2, chord, pass * 2, s16 % 8 === 0 && (bar === 0 || bar === 8), pass === 1, q);
      continue;
    }
    // The others, shuffled, in the same dress; bells come in for the second half
    const song = entry.song;
    const bar = Math.floor(lb / song.bpb);
    const inBar = lb - bar * song.bpb;
    const name = song.harm ? song.harm[bar][Math.floor(inBar)] : null;
    const root = song.roots ? song.roots[bar] : null;
    const chord = name ? JOY_CHORD[name] : root === null || root === undefined ? null : [root, root % 12 === 9 ? [0, 3, 7] : [0, 4, 7]];
    const half = bar * 2 >= song.bars.length;
    const crash = inBar === 0 && (bar === 0 || bar * 2 === song.bars.length);
    partyBeat(emit, at, sec, song.bars[bar], inBar, s16 % (song.bpb * 4), song.bpb, chord, 0, crash, half, q);
  }
}

// One sixteenth of the village's party arrangement: the lead (pulse, an octave-down square for body), a crash where
// asked, four-on-the-floor kick, claps on the backbeat (2 and 3 in 3/4), open hats and sleigh bells, an octave disco
// bass, off-beat chord stabs, bells sparkling on top where asked
function partyBeat(emit, at, sec, notesInBar, inBar, s16, bpb, chord, key, crash, bells, q) {
  const bus = PP_SOUND.music;
  notesInBar.forEach(([pos, m, len]) => {
    if (Math.abs(pos - inBar) > 1e-6) return;
    emit(at, (t) => sndTone(t, midiHz(m + key), len * sec * 0.85, { pulse: true, vol: 0.17, bus }));
    emit(at, (t) => sndTone(t, midiHz(m + key - 12), len * sec * 0.7, { type: 'square', vol: 0.035, bus }));
  });
  if (crash) emit(at, (t) => sndNoise(t, 0.9, { freq: 5000, vol: 0.11, bus }));
  if (s16 % 4 === 0) {
    emit(at, (t) => {
      sndTone(t, 165, 0.12, { to: 42, type: 'triangle', vol: 0.38, bus });
      sndNoise(t, 0.035, { filter: 'lowpass', freq: 900, vol: 0.12, bus });
    });
  }
  const clap = bpb === 3 ? s16 === 4 || s16 === 8 : s16 % 8 === 4;
  if (clap) {
    emit(at, (t) => {
      sndNoise(t, 0.12, { filter: 'bandpass', freq: 1500, q: 0.8, vol: 0.17, bus });
      sndNoise(t + 0.012, 0.1, { filter: 'bandpass', freq: 2200, q: 0.8, vol: 0.1, bus });
    });
  }
  if (s16 % 4 === 2) emit(at, (t) => sndNoise(t, 0.11, { freq: 7500, vol: 0.06, bus }));
  else if (s16 % 2 === 0) emit(at, (t) => sndNoise(t, 0.03, { freq: 9500, vol: 0.035, bus }));
  emit(at, (t) => sndNoise(t, 0.04, { freq: 8500, vol: s16 % 2 ? 0.022 : 0.032, bus }));
  if (!chord) return;
  const [root, notes] = chord;
  if (s16 % 2 === 0) emit(at, (t) => sndTone(t, midiHz(root + key + (s16 % 4 ? 12 : 0)), sec * 0.42, { type: 'triangle', vol: 0.32, bus }));
  if (s16 % 4 === 2) notes.slice(0, 3).forEach((n) => emit(at, (t) => sndTone(t, midiHz(root + key + 24 + n), 0.09, { type: 'square', vol: 0.026, bus })));
  if (bells) {
    const n = notes[(q * 3) % notes.length];
    emit(at, (t) => sndTone(t, midiHz(root + key + 48 + n), 0.12, { type: 'triangle', vol: 0.045, bus }));
  }
}

// A penguin popping into its pixel self (opening-scene.js calls this the moment it changes)
function playOpeningPop(i = 0) {
  if (!soundReady() || !PP_SOUND.musicOn) return;
  const t = PP_SOUND.ctx.currentTime + 0.005;
  sndTone(t, midiHz(76 + (i % 4) * 3), 0.08, { pulse: true, vol: 0.08, bus: PP_SOUND.music });
  sndTone(t + 0.06, midiHz(88 + (i % 4) * 3), 0.12, { pulse: true, vol: 0.07, bus: PP_SOUND.music });
}

function soundTick() {
  if (!soundReady() || typeof MOTION_STATE === 'undefined') return;
  const c = PP_SOUND.ctx;
  const nowP = performance.now();
  const opening = MOTION_STATE.sceneIdx === 0 && typeof OPENING !== 'undefined' && OPENING.active;
  if (opening && (!OPENING.start || !PP_SOUND.musicOn)) return;
  const idle = !opening && MOTION_STATE.sceneIdx === 0 && MOTION_STATE.scene0IdleStart;
  const start = opening ? OPENING.start : idle ? MOTION_STATE.scene0IdleStart : MOTION_STATE.sceneStartTime;
  const key = `${MOTION_STATE.sceneIdx}:${start}:${opening ? 'op' : idle ? 1 : 0}`;
  const elapsed = nowP - start;
  // A new scene, or back after a pause (hidden tab, sound off): start from now instead of catching up
  if (key !== PP_SOUND.key || nowP - PP_SOUND.lastTick > 500) {
    // (a scene that began in the last 300 ms plays from its start, so its first cue is never lost)
    PP_SOUND.cursor = key !== PP_SOUND.key && elapsed < 300 ? -1 : elapsed - 30;
    PP_SOUND.key = key;
  }
  PP_SOUND.lastTick = nowP;
  const from = PP_SOUND.cursor;
  const to = elapsed + PP_SOUND_LOOKAHEAD;
  if (to <= from) return;
  const emit = (atMs, play) => play(Math.max(c.currentTime + 0.005, c.currentTime + (start + atMs - nowP) / 1000));
  if (opening) {
    openingCues(from, to, emit);
  } else if (idle) {
    if (sfxOn()) suckCues(from, to, emit, SCENE0_SUCK_MS, 0.3, 0.6, 0.6);
  } else {
    sceneCues(from, to, emit);
    // Quake rumble at the start of each quake burst (escape-scene.js scene0Quake)
    if (MOTION_STATE.sceneIdx === 0 && sfxOn() && !OPENING.active) {
      const q = scene0Quake(nowP + 40) > 0;
      if (q && !PP_SOUND.quakeOn) {
        const esc = scene0Escalation(nowP);
        sndNoise(c.currentTime + 0.04, 0.5, { filter: 'lowpass', freq: 160, vol: 0.35 + esc * 0.25, attack: 0.05 });
      }
      PP_SOUND.quakeOn = q;
    }
  }
  PP_SOUND.cursor = to;
}

if (typeof window !== 'undefined') {
  ['pointerdown', 'keydown', 'touchend'].forEach((ev) => window.addEventListener(ev, soundUnlock, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    const c = PP_SOUND.ctx;
    if (!c) return;
    if (document.visibilityState === 'hidden') c.suspend().catch(() => {});
    else if (PP_SOUND.on) c.resume().catch(() => {});
  });
  setInterval(soundTick, 30);
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-music-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      setSoundFlags(!PP_SOUND.musicOn, PP_SOUND.sfxOn);
    });
    document.getElementById('btn-sfx-toggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      setSoundFlags(PP_SOUND.musicOn, !PP_SOUND.sfxOn);
    });
    // The labels follow the language picker (applyLanguage calls updateSoundButton)
    updateSoundButton();
  });
}
