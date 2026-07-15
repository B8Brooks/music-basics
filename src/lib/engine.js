// Tiny Web Audio synth + sequencer for the music learning page.
// Everything is synthesized in the browser — no audio files needed.

let ctx = null;
let noiseBuffer = null;
let activePlayer = null;
let unlockInstalled = false;
let htmlAudioUnlocked = false;

export function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    // Debug/testing handle (used by verification, harmless in production).
    window.__audioState = () => ctx.state;
  }
  // iOS can also leave the context "interrupted" after calls/tab switches.
  if (ctx.state === "suspended" || ctx.state === "interrupted") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

/* ---------- Mobile audio unlock ----------

Mobile browsers keep audio muted until a user gesture, and iPhones
additionally silence Web Audio while the ring/silent switch is on —
unless a (silent) HTML5 audio element has played, which flips the iOS
audio session to "playback" mode. `initAudioUnlock()` installs cheap
permanent gesture listeners that handle both, and also recover the
context after iOS "interrupted" states (phone calls, tab switches).
*/

function silentWavUri() {
  const rate = 8000;
  const samples = 8;
  const buf = new ArrayBuffer(44 + samples * 2);
  const v = new DataView(buf);
  const wstr = (o, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  wstr(0, "RIFF");
  v.setUint32(4, 36 + samples * 2, true);
  wstr(8, "WAVE");
  wstr(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  wstr(36, "data");
  v.setUint32(40, samples * 2, true);
  let bin = "";
  new Uint8Array(buf).forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return "data:audio/wav;base64," + btoa(bin);
}

function unlockAudio() {
  const ac = getAudioContext();
  if (!ac) return;
  // Warm-up: push one silent sample through the graph (classic iOS unlock).
  try {
    const src = ac.createBufferSource();
    src.buffer = ac.createBuffer(1, 1, ac.sampleRate);
    src.connect(ac.destination);
    src.start(0);
  } catch {
    /* ignore */
  }
  // iOS ring/silent switch bypass via a silent HTML5 audio element.
  if (!htmlAudioUnlocked) {
    try {
      const el = new Audio(silentWavUri());
      el.setAttribute("playsinline", "");
      const p = el.play();
      if (p && p.then) {
        p.then(() => {
          htmlAudioUnlocked = true;
        }).catch(() => {});
      }
    } catch {
      /* ignore */
    }
  }
}

export function initAudioUnlock() {
  if (unlockInstalled || typeof window === "undefined") return;
  unlockInstalled = true;
  const events = ["touchstart", "touchend", "mousedown", "click", "keydown"];
  events.forEach((e) =>
    window.addEventListener(e, unlockAudio, { passive: true })
  );
}

const NOTE_OFFSETS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// "C4", "F#3", "Bb2" -> MIDI number (C4 = 60)
export function noteToMidi(name) {
  const m = /^([A-G])([#b]?)(-?\d+)$/.exec(name);
  if (!m) throw new Error(`Bad note name: ${name}`);
  let semitone = NOTE_OFFSETS[m[1]];
  if (m[2] === "#") semitone += 1;
  if (m[2] === "b") semitone -= 1;
  return semitone + (parseInt(m[3], 10) + 1) * 12;
}

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function getNoiseBuffer(ac) {
  if (!noiseBuffer) {
    const len = ac.sampleRate;
    noiseBuffer = ac.createBuffer(1, len, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/* ---------- Instruments ---------- */

function playLead(ac, dest, midi, t, dur, gain = 0.22) {
  const freq = midiToFreq(midi);
  const g = ac.createGain();
  g.connect(dest);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.015);
  g.gain.setTargetAtTime(gain * 0.45, t + 0.08, 0.3);
  g.gain.setTargetAtTime(0.0001, t + dur, 0.06);

  const osc = ac.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  osc.connect(g);

  const shimmer = ac.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = freq * 2;
  const sg = ac.createGain();
  sg.gain.value = 0.2;
  shimmer.connect(sg);
  sg.connect(g);

  osc.start(t);
  shimmer.start(t);
  osc.stop(t + dur + 0.5);
  shimmer.stop(t + dur + 0.5);
}

function playChord(ac, dest, midis, t, dur, gain = 0.07) {
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1100;
  filter.connect(dest);
  for (const midi of midis) {
    const g = ac.createGain();
    g.connect(filter);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.06);
    g.gain.setTargetAtTime(gain * 0.7, t + 0.3, 0.6);
    g.gain.setTargetAtTime(0.0001, t + dur, 0.12);
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = midiToFreq(midi);
    osc.connect(g);
    osc.start(t);
    osc.stop(t + dur + 0.8);
  }
}

function playBass(ac, dest, midi, t, dur, gain = 0.3) {
  const g = ac.createGain();
  g.connect(dest);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.setTargetAtTime(gain * 0.6, t + 0.1, 0.25);
  g.gain.setTargetAtTime(0.0001, t + dur, 0.05);

  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.value = midiToFreq(midi);
  osc.connect(g);

  const grit = ac.createOscillator();
  grit.type = "triangle";
  grit.frequency.value = midiToFreq(midi) * 2;
  const gg = ac.createGain();
  gg.gain.value = 0.25;
  grit.connect(gg);
  gg.connect(g);

  osc.start(t);
  grit.start(t);
  osc.stop(t + dur + 0.4);
  grit.stop(t + dur + 0.4);
}

function playKick(ac, dest, t, gain = 0.55) {
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(160, t);
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.1);
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.connect(g);
  g.connect(dest);
  osc.start(t);
  osc.stop(t + 0.35);
}

function playSnare(ac, dest, t, gain = 0.28) {
  const src = ac.createBufferSource();
  src.buffer = getNoiseBuffer(ac);
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.8;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + 0.25);

  const body = ac.createOscillator();
  body.type = "triangle";
  body.frequency.value = 200;
  const bg = ac.createGain();
  bg.gain.setValueAtTime(gain * 0.5, t);
  bg.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  body.connect(bg);
  bg.connect(dest);
  body.start(t);
  body.stop(t + 0.15);
}

function playHat(ac, dest, t, gain = 0.1) {
  const src = ac.createBufferSource();
  src.buffer = getNoiseBuffer(ac);
  const filter = ac.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 7500;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  src.start(t);
  src.stop(t + 0.08);
}

/* ---------- Sequencer ----------

Events look like:
  { beat: 0, type: "lead",  midi: 60, dur: 1, gain?, track?, id? }
  { beat: 0, type: "chord", midis: [60,64,67], dur: 4 }
  { beat: 0, type: "bass",  midi: 36, dur: 1 }
  { beat: 0, type: "kick" | "snare" | "hat", gain? }

`beat` and `dur` are in beats (quarter notes). `track` groups events so a
whole layer can be muted live. `id` makes the event fire onEvent for visuals.
*/

export class Player {
  constructor() {
    this.playing = false;
    this.timeouts = [];
    this.master = null;
    this.tracks = {};
    this.mutedTracks = new Set();
    this.onstop = null;
    this.startAt = 0;
    this.spb = 0.5;
  }

  isPlaying() {
    return this.playing;
  }

  getTrackNode(ac, track) {
    const key = track || "main";
    if (!this.tracks[key]) {
      const g = ac.createGain();
      g.gain.value = this.mutedTracks.has(key) ? 0 : 1;
      g.connect(this.master);
      this.tracks[key] = g;
    }
    return this.tracks[key];
  }

  // Mute/unmute a layer. Works live while playing and persists across plays.
  setTrackOn(track, on) {
    if (on) this.mutedTracks.delete(track);
    else this.mutedTracks.add(track);
    const node = this.tracks[track];
    if (node) {
      const ac = getAudioContext();
      node.gain.setTargetAtTime(on ? 1 : 0, ac.currentTime, 0.02);
    }
  }

  play(events, { bpm = 100, loop = false, beats, onBeat, onEvent, onEnd } = {}) {
    this.stop(true);
    const ac = getAudioContext();
    if (!ac) return null;
    if (activePlayer && activePlayer !== this) activePlayer.stop();
    activePlayer = this;

    this.playing = true;
    this.master = ac.createGain();
    this.master.gain.value = 1;
    this.master.connect(ac.destination);
    this.tracks = {};

    const spb = 60 / bpm;
    this.spb = spb;
    const totalBeats =
      beats ??
      Math.ceil(
        Math.max(...events.map((e) => e.beat + (e.dur || 0)), 1)
      );
    const scheduleIteration = (iterStart) => {
      if (!this.playing) return;
      for (const ev of events) {
        const t = iterStart + ev.beat * spb;
        const dest = this.getTrackNode(ac, ev.track);
        const dur = (ev.dur || 0.5) * spb;
        switch (ev.type) {
          case "lead":
            playLead(ac, dest, ev.midi, t, dur, ev.gain);
            break;
          case "chord":
            playChord(ac, dest, ev.midis, t, dur, ev.gain);
            break;
          case "bass":
            playBass(ac, dest, ev.midi, t, dur, ev.gain);
            break;
          case "kick":
            playKick(ac, dest, t, ev.gain);
            break;
          case "snare":
            playSnare(ac, dest, t, ev.gain);
            break;
          case "hat":
            playHat(ac, dest, t, ev.gain);
            break;
          default:
            break;
        }
        if (onEvent && ev.id !== undefined) {
          this.visualAt(ac, t, () => onEvent(ev));
        }
      }
      if (onBeat) {
        for (let b = 0; b < totalBeats; b++) {
          this.visualAt(ac, iterStart + b * spb, () => onBeat(b));
        }
      }
      const endT = iterStart + totalBeats * spb;
      if (loop) {
        // Re-schedule the next pass slightly before this one ends.
        this.visualAt(ac, endT - 0.2, () => scheduleIteration(endT));
      } else {
        this.visualAt(ac, endT, () => {
          this.playing = false;
          this.cleanup(ac);
          if (onEnd) onEnd();
          if (this.onstop) this.onstop();
        });
      }
    };

    // Anchor the timeline only once the context clock is actually running —
    // on mobile, scheduling against a suspended clock plays the visuals
    // silently (setTimeout keeps ticking while audio time is frozen).
    const timing = { startAt: null, spb, totalBeats };
    const begin = () => {
      if (!this.playing) return;
      const startAt = ac.currentTime + 0.12;
      this.startAt = startAt;
      timing.startAt = startAt;
      scheduleIteration(startAt);
    };
    if (ac.state === "running") {
      begin();
    } else {
      ac.resume().then(begin, begin);
    }
    return timing;
  }

  visualAt(ac, t, fn) {
    const ms = Math.max(0, (t - ac.currentTime) * 1000);
    this.timeouts.push(
      setTimeout(() => {
        if (this.playing) fn();
      }, ms)
    );
  }

  cleanup(ac) {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    if (this.master) {
      const m = this.master;
      m.gain.setTargetAtTime(0, ac.currentTime, 0.03);
      setTimeout(() => m.disconnect(), 400);
      this.master = null;
      this.tracks = {};
    }
  }

  stop(silent = false) {
    const wasPlaying = this.playing;
    this.playing = false;
    const ac = getAudioContext();
    if (ac) this.cleanup(ac);
    if (activePlayer === this) activePlayer = null;
    if (wasPlaying && !silent && this.onstop) this.onstop();
  }
}
