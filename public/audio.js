// ============================================================================
// SOUND — 8-bit sound for the intro, synthesised with Web Audio: no audio files, nothing to license.
// The town plays Jingle Bells (Pierpont, 1857, public domain) in our own chip arrangement, no lyrics.
// Browsers only allow sound after a tap or key press (Chrome autoplay policy), so nothing plays until the first
// gesture on the page. By default only the carol plays (the alarm and game SFX annoyed on a first visit); the
// 소리 button in the top bar cycles 캐럴만 -> 소리 전체 -> 소리 끔 and the choice is remembered. The intro reads
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

const PP_SOUND_MODES = ['carol', 'all', 'off'];
try {
  // v5.19.0 stored 'on' for everyone who tapped the toggle; that is the new default (carol only) now
  const saved = localStorage.getItem(PP_SOUND_STORE);
  PP_SOUND.mode = saved === 'all' || saved === 'off' ? saved : 'carol';
} catch (e) {}
PP_SOUND.on = PP_SOUND.mode !== 'off';

// Alarm, engines, game events and the pillar: only in 소리 전체
function sfxOn() {
  return PP_SOUND.mode === 'all';
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
  if (!PP_SOUND.on) return;
  soundInit();
  const c = PP_SOUND.ctx;
  if (c && c.state !== 'running' && document.visibilityState === 'visible') c.resume().catch(() => {});
}

function setSoundMode(mode) {
  const on = mode !== 'off';
  PP_SOUND.mode = mode;
  PP_SOUND.on = on;
  try {
    localStorage.setItem(PP_SOUND_STORE, mode);
  } catch (e) {}
  if (on) {
    soundUnlock();
    PP_SOUND.key = ''; // rejoin the current scene from where it is
  } else if (PP_SOUND.ctx) {
    PP_SOUND.ctx.suspend().catch(() => {});
  }
  updateSoundButton();
}

function updateSoundButton() {
  const btn = typeof document !== 'undefined' && document.getElementById('btn-sound-toggle');
  if (!btn) return;
  const m = PP_SOUND.mode;
  const ko = m === 'all' ? '소리 전체' : m === 'off' ? '소리 끔' : '캐럴만';
  const en = m === 'all' ? 'All sound' : m === 'off' ? 'Sound off' : 'Carol only';
  btn.dataset.ko = ko;
  btn.dataset.en = en;
  btn.textContent = typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'en' ? en : ko;
  btn.setAttribute('aria-pressed', PP_SOUND.on ? 'true' : 'false');
  btn.classList.toggle('is-off', !PP_SOUND.on);
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
// Jingle Bells chorus, 16 bars of [beat in bar, midi, beats]; bass roots per bar. Played on the town beat
// (app.js townBeatT0 / TOWN_BEAT_MS) so the landing, the talk turns and the tree lights hit the beat.
// ---------------------------------------------------------------------------------------------------------------
const JB_A = [
  [[0, 76, 1], [1, 76, 1], [2, 76, 2]],
  [[0, 76, 1], [1, 76, 1], [2, 76, 2]],
  [[0, 76, 1], [1, 79, 1], [2, 72, 1.5], [3.5, 74, 0.5]],
  [[0, 76, 4]],
  [[0, 77, 1], [1, 77, 1], [2, 77, 1.5], [3.5, 77, 0.5]],
  [[0, 77, 1], [1, 76, 1], [2, 76, 1], [3, 76, 0.5], [3.5, 76, 0.5]],
];
const JB_BARS = [
  ...JB_A,
  [[0, 76, 1], [1, 74, 1], [2, 74, 1], [3, 76, 1]],
  [[0, 74, 2], [2, 79, 2]],
  ...JB_A,
  [[0, 79, 1], [1, 79, 1], [2, 77, 1], [3, 74, 1]],
  [[0, 72, 4]],
];
const JB_ROOTS = [48, 48, 48, 48, 53, 48, 50, 55, 48, 48, 48, 48, 53, 48, 43, 48];
const JB_PLAYS = 2; // then the town goes quiet (the lights keep the beat)

function scheduleTownMusic(fromMs, toMs, emit) {
  const beatMs = TOWN_BEAT_MS;
  const t0 = townBeatT0();
  const total = JB_BARS.length * 4;
  const end = Math.min((toMs - t0) / beatMs, total * JB_PLAYS - 0.5);
  for (let b = Math.max(0, Math.ceil(((fromMs - t0) / beatMs) * 2) / 2); b <= end; b += 0.5) {
    const at = t0 + b * beatMs;
    if (at <= fromMs) continue;
    const lb = b % total;
    const bar = Math.floor(lb / 4);
    const inBar = lb - bar * 4;
    const sec = beatMs / 1000;
    // Lead
    JB_BARS[bar].forEach(([pos, m, len]) => {
      if (Math.abs(pos - inBar) < 1e-6) emit(at, (t) => sndTone(t, midiHz(m), len * sec * 0.88, { pulse: true, vol: 0.2, bus: PP_SOUND.music }));
    });
    // Sleigh bells on every eighth, the off-beats louder
    emit(at, (t) => sndNoise(t, 0.05, { freq: 7000, vol: inBar % 1 ? 0.07 : 0.04, bus: PP_SOUND.music }));
    if (inBar % 1) continue;
    // Oom-pah bass: root on 1 and 3, fifth on 2 and 4
    const root = JB_ROOTS[bar];
    emit(at, (t) => sndTone(t, midiHz(inBar % 2 ? root + 7 : root), sec * 0.7, { type: 'triangle', vol: 0.32, bus: PP_SOUND.music }));
    if (inBar % 2 === 0) emit(at, (t) => sndTone(t, 150, 0.1, { to: 50, type: 'triangle', vol: 0.3, bus: PP_SOUND.music }));
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
    scheduleTownMusic(fromMs, toMs, emit);
    return;
  }
  if (!sfxOn()) return;
  if (s === 0) {
    if (MOTION_STATE.scene0IdleStart) return; // stage 5 runs on its own clock (soundTick)
    // Alarm: two soft beeps every 1.7 s, louder the longer the player waits
    every(fromMs, toMs, 600, Infinity, 1700, (at) => {
      const esc = Math.min(1, at / 24000);
      emit(at, (t) => {
        sndTone(t, 880, 0.16, { vol: 0.05 + esc * 0.07 });
        sndTone(t + 0.2, 660, 0.18, { vol: 0.05 + esc * 0.07 });
      });
    });
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
      } else {
        sndTone(t, 80, 2.2, { to: 320, type: 'square', vol: 0.07, attack: 0.2 });
        sndNoise(t + 0.6, 1.6, { filter: 'bandpass', freq: 400, to: 3000, q: 1.2, vol: 0.14, attack: 0.5 });
      }
    });
  } else if (s === 3) {
    suckCues(fromMs, toMs, emit, 7000, 0.24, 0.6, 0.64);
  }
}

function soundTick() {
  if (!soundReady() || typeof MOTION_STATE === 'undefined') return;
  const c = PP_SOUND.ctx;
  const nowP = performance.now();
  const idle = MOTION_STATE.sceneIdx === 0 && MOTION_STATE.scene0IdleStart;
  const start = idle ? MOTION_STATE.scene0IdleStart : MOTION_STATE.sceneStartTime;
  const key = `${MOTION_STATE.sceneIdx}:${start}:${idle ? 1 : 0}`;
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
  if (idle) {
    if (sfxOn()) suckCues(from, to, emit, SCENE0_SUCK_MS, 0.3, 0.6, 0.6);
  } else {
    sceneCues(from, to, emit);
    // Quake rumble at the start of each quake burst (escape-scene.js scene0Quake)
    if (MOTION_STATE.sceneIdx === 0 && sfxOn()) {
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
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setSoundMode(PP_SOUND_MODES[(PP_SOUND_MODES.indexOf(PP_SOUND.mode) + 1) % PP_SOUND_MODES.length]);
      });
    }
    updateSoundButton();
  });
}
