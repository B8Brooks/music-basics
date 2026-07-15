// Musical material for the learning app. All melodies are public-domain
// compositions (published pre-1930 or traditional), transcribed as note
// data and synthesized live — no recordings are used anywhere.

import { noteToMidi } from "./engine";

const n = noteToMidi;

/* ---------- Chords (voicings) ---------- */

export const CHORDS = {
  C: [n("C4"), n("E4"), n("G4")],
  F: [n("F3"), n("A3"), n("C4")],
  G: [n("G3"), n("B3"), n("D4")],
  Am: [n("A3"), n("C4"), n("E4")],
  Dm: [n("D4"), n("F4"), n("A4")],
  Em: [n("E4"), n("G4"), n("B4")],
  // A "7" chord adds a fourth note that makes it lean toward home (C).
  G7: [n("G3"), n("B3"), n("D4"), n("F4")],
  // C minor: same as C but the middle note drops a half step — instant mood flip.
  Cm: [n("C4"), n("Eb4"), n("G4")],
};

// Every chord name used in a song's chord list MUST have a root here too —
// backingEvents derives its bass line from this map.
const BASS_ROOTS = {
  C: n("C2"),
  G: n("G2"),
  Am: n("A2"),
  F: n("F2"),
  Dm: n("D2"),
  Em: n("E2"),
  G7: n("G2"),
  Cm: n("C2"),
};

/* ---------- Song format ----------

notes:  [name, beat, dur] — beat 0 is the first strong downbeat; PICKUP
        notes (the little lead-in, e.g. "hap-py" in Happy Birthday) use
        negative beats and land during the count-in bar.
chords: [name, beat, dur] on the same timeline.
beats:  total beats from beat 0 (excludes pickups).
beatsPerBar: 4 for marches/pop, 3 for waltzes.
*/

function song(meta, noteList, chordList) {
  return {
    ...meta,
    notes: noteList.map(([name, beat, dur], i) => ({
      id: i,
      name,
      midi: n(name),
      beat,
      dur,
    })),
    chords: chordList.map(([name, beat, dur]) => ({ name, beat, dur })),
  };
}

/* ---------- The song library (all public domain) ---------- */

export const TWINKLE = song(
  {
    title: "Twinkle, Twinkle, Little Star",
    emoji: "⭐",
    fact: "A French folk tune from the 1760s — Mozart wrote variations on it, and it's also the ABC song.",
    bpm: 100,
    beatsPerBar: 4,
    beats: 16,
  },
  [
    ["C4", 0, 1], ["C4", 1, 1], ["G4", 2, 1], ["G4", 3, 1],
    ["A4", 4, 1], ["A4", 5, 1], ["G4", 6, 2],
    ["F4", 8, 1], ["F4", 9, 1], ["E4", 10, 1], ["E4", 11, 1],
    ["D4", 12, 1], ["D4", 13, 1], ["C4", 14, 2],
  ],
  [
    ["C", 0, 2], ["C", 2, 2], ["F", 4, 2], ["C", 6, 2],
    ["F", 8, 2], ["C", 10, 2], ["G", 12, 2], ["C", 14, 2],
  ]
);

export const ODE_TO_JOY = song(
  {
    title: "Ode to Joy (Beethoven)",
    emoji: "🎻",
    fact: "From Beethoven's 9th Symphony (1824) — he was almost completely deaf when he wrote it.",
    bpm: 110,
    beatsPerBar: 4,
    beats: 16,
  },
  [
    ["E4", 0, 1], ["E4", 1, 1], ["F4", 2, 1], ["G4", 3, 1],
    ["G4", 4, 1], ["F4", 5, 1], ["E4", 6, 1], ["D4", 7, 1],
    ["C4", 8, 1], ["C4", 9, 1], ["D4", 10, 1], ["E4", 11, 1],
    ["E4", 12, 1.5], ["D4", 13.5, 0.5], ["D4", 14, 2],
  ],
  [
    ["C", 0, 4],
    ["C", 4, 2], ["G", 6, 2],
    ["C", 8, 2], ["F", 10, 2],
    ["G", 12, 2], ["G", 14, 2],
  ]
);

export const HAPPY_BIRTHDAY = song(
  {
    title: "Happy Birthday to You",
    emoji: "🎂",
    fact: "Written in 1893 as “Good Morning to All.” A 2016 court settlement confirmed it belongs to everyone.",
    bpm: 108,
    beatsPerBar: 3,
    beats: 24,
  },
  [
    // "hap-py" (pickup)
    ["G4", -1, 0.5], ["G4", -0.5, 0.5],
    // "birth-day to you"
    ["A4", 0, 1], ["G4", 1, 1], ["C5", 2, 1],
    ["B4", 3, 2],
    // "hap-py birth-day to you"
    ["G4", 5, 0.5], ["G4", 5.5, 0.5],
    ["A4", 6, 1], ["G4", 7, 1], ["D5", 8, 1],
    ["C5", 9, 2],
    // "hap-py birth-day dear friend"
    ["G4", 11, 0.5], ["G4", 11.5, 0.5],
    ["G5", 12, 1], ["E5", 13, 1], ["C5", 14, 1],
    ["A4", 15, 2],
    // "hap-py birth-day to you"
    ["F5", 17, 0.5], ["F5", 17.5, 0.5],
    ["E5", 18, 1], ["C5", 19, 1], ["D5", 20, 1],
    ["C5", 21, 2.5],
  ],
  [
    ["C", 0, 3], ["G", 3, 3],
    ["G", 6, 3], ["C", 9, 3],
    ["C", 12, 3], ["F", 15, 3],
    ["C", 18, 1], ["G", 19, 2], ["C", 21, 3],
  ]
);

export const JINGLE_BELLS = song(
  {
    title: "Jingle Bells",
    emoji: "🔔",
    fact: "Written in 1857 — and in 1965 it became the first song performed in space, on a smuggled harmonica.",
    bpm: 120,
    beatsPerBar: 4,
    beats: 32,
  },
  [
    // "jin-gle bells, jin-gle bells"
    ["E4", 0, 1], ["E4", 1, 1], ["E4", 2, 2],
    ["E4", 4, 1], ["E4", 5, 1], ["E4", 6, 2],
    // "jin-gle all the way"
    ["E4", 8, 1], ["G4", 9, 1], ["C4", 10, 1.5], ["D4", 11.5, 0.5],
    ["E4", 12, 4],
    // "oh what fun it is to ride"
    ["F4", 16, 1], ["F4", 17, 1], ["F4", 18, 1.5], ["F4", 19.5, 0.5],
    ["F4", 20, 1], ["E4", 21, 1], ["E4", 22, 1], ["E4", 23, 1],
    // "in a one-horse o-pen sleigh, hey!"
    ["E4", 24, 1], ["D4", 25, 1], ["D4", 26, 1], ["E4", 27, 1],
    ["D4", 28, 2], ["G4", 30, 2],
  ],
  [
    ["C", 0, 4], ["C", 4, 4], ["C", 8, 4], ["C", 12, 4],
    ["F", 16, 4], ["C", 20, 4], ["G", 24, 4], ["G", 28, 2], ["C", 30, 2],
  ]
);

export const SAINTS = song(
  {
    title: "When the Saints Go Marching In",
    emoji: "🎺",
    fact: "A traditional gospel song that became the anthem of New Orleans jazz — Louis Armstrong made it world-famous.",
    bpm: 116,
    beatsPerBar: 4,
    beats: 32,
  },
  [
    // "oh when the saints" (pickup)
    ["C4", -3, 1], ["E4", -2, 1], ["F4", -1, 1],
    ["G4", 0, 4],
    // "oh when the saints"
    ["C4", 5, 1], ["E4", 6, 1], ["F4", 7, 1],
    ["G4", 8, 4],
    // "oh when the saints go march-ing in"
    ["C4", 13, 1], ["E4", 14, 1], ["F4", 15, 1],
    ["G4", 16, 2], ["E4", 18, 2],
    ["C4", 20, 2], ["E4", 22, 2],
    ["D4", 24, 6],
  ],
  [
    ["C", 0, 4], ["C", 4, 4], ["C", 8, 4], ["C", 12, 4],
    ["C", 16, 4], ["C", 20, 4], ["G", 24, 4], ["G", 28, 4],
  ]
);

export const BALL_GAME = song(
  {
    title: "Take Me Out to the Ball Game",
    emoji: "⚾",
    fact: "Written in 1908 — neither of its songwriters had ever been to a baseball game.",
    bpm: 112,
    beatsPerBar: 3,
    beats: 24,
  },
  [
    // "take me out to the ball game"
    ["C5", 0, 1], ["A4", 1, 1], ["G4", 2, 1],
    ["E4", 3, 1], ["G4", 4, 2],
    ["D4", 6, 3],
    // "take me out with the crowd"
    ["C5", 12, 1], ["A4", 13, 1], ["G4", 14, 1],
    ["E4", 15, 1], ["G4", 16, 2],
    ["D4", 18, 5],
  ],
  [
    ["C", 0, 3], ["C", 3, 3], ["G", 6, 3], ["G", 9, 3],
    ["C", 12, 3], ["C", 15, 3], ["G", 18, 3], ["G", 21, 3],
  ]
);

export const MARY_LAMB = song(
  {
    title: "Mary Had a Little Lamb",
    emoji: "🐑",
    fact: "The first words ever recorded — Thomas Edison recited it into his brand-new phonograph in 1877.",
    bpm: 104,
    beatsPerBar: 4,
    beats: 32,
  },
  [
    // "Ma-ry had a lit-tle lamb"
    ["E4", 0, 1], ["D4", 1, 1], ["C4", 2, 1], ["D4", 3, 1],
    ["E4", 4, 1], ["E4", 5, 1], ["E4", 6, 2],
    // "lit-tle lamb, lit-tle lamb"
    ["D4", 8, 1], ["D4", 9, 1], ["D4", 10, 2],
    ["E4", 12, 1], ["G4", 13, 1], ["G4", 14, 2],
    // "Ma-ry had a lit-tle lamb whose"
    ["E4", 16, 1], ["D4", 17, 1], ["C4", 18, 1], ["D4", 19, 1],
    ["E4", 20, 1], ["E4", 21, 1], ["E4", 22, 1], ["E4", 23, 1],
    // "fleece was white as snow"
    ["D4", 24, 1], ["D4", 25, 1], ["E4", 26, 1], ["D4", 27, 1],
    ["C4", 28, 4],
  ],
  [
    ["C", 0, 4], ["C", 4, 4], ["G", 8, 4], ["C", 12, 4],
    ["C", 16, 4], ["C", 20, 4], ["G", 24, 4], ["C", 28, 4],
  ]
);

export const LONDON_BRIDGE = song(
  {
    title: "London Bridge Is Falling Down",
    emoji: "🌉",
    fact: "This singing game is centuries old — versions of it are sung all across Europe in different languages.",
    bpm: 112,
    beatsPerBar: 4,
    beats: 32,
  },
  [
    // "Lon-don Bridge is fall-ing down"
    ["G4", 0, 1.5], ["A4", 1.5, 0.5], ["G4", 2, 1], ["F4", 3, 1],
    ["E4", 4, 1], ["F4", 5, 1], ["G4", 6, 2],
    // "fall-ing down, fall-ing down"
    ["D4", 8, 1], ["E4", 9, 1], ["F4", 10, 2],
    ["E4", 12, 1], ["F4", 13, 1], ["G4", 14, 2],
    // "Lon-don Bridge is fall-ing down"
    ["G4", 16, 1.5], ["A4", 17.5, 0.5], ["G4", 18, 1], ["F4", 19, 1],
    ["E4", 20, 1], ["F4", 21, 1], ["G4", 22, 2],
    // "my fair la-dy"
    ["D4", 24, 2], ["G4", 26, 2],
    ["E4", 28, 1], ["C4", 29, 3],
  ],
  [
    ["C", 0, 4], ["C", 4, 4], ["G7", 8, 4], ["C", 12, 4],
    ["C", 16, 4], ["C", 20, 4], ["G7", 24, 4], ["C", 28, 4],
  ]
);

export const FRERE_JACQUES = song(
  {
    title: "Frère Jacques",
    emoji: "🛎️",
    fact: "A French round about a monk oversleeping — groups sing it in overlapping layers called a canon.",
    bpm: 108,
    beatsPerBar: 4,
    beats: 32,
  },
  [
    // "Frè-re Jac-ques" ×2
    ["C4", 0, 1], ["D4", 1, 1], ["E4", 2, 1], ["C4", 3, 1],
    ["C4", 4, 1], ["D4", 5, 1], ["E4", 6, 1], ["C4", 7, 1],
    // "dor-mez vous?" ×2
    ["E4", 8, 1], ["F4", 9, 1], ["G4", 10, 2],
    ["E4", 12, 1], ["F4", 13, 1], ["G4", 14, 2],
    // "son-nez les ma-ti-nes" ×2 (the quick "morning bells")
    ["G4", 16, 0.5], ["A4", 16.5, 0.5], ["G4", 17, 0.5], ["F4", 17.5, 0.5],
    ["E4", 18, 1], ["C4", 19, 1],
    ["G4", 20, 0.5], ["A4", 20.5, 0.5], ["G4", 21, 0.5], ["F4", 21.5, 0.5],
    ["E4", 22, 1], ["C4", 23, 1],
    // "ding, dang, dong" ×2 (dips below the home note!)
    ["C4", 24, 1], ["G3", 25, 1], ["C4", 26, 2],
    ["C4", 28, 1], ["G3", 29, 1], ["C4", 30, 2],
  ],
  [
    ["C", 0, 4], ["C", 4, 4], ["C", 8, 4], ["C", 12, 4],
    ["C", 16, 4], ["C", 20, 4],
    ["C", 24, 1], ["G7", 25, 1], ["C", 26, 2],
    ["C", 28, 1], ["G7", 29, 1], ["C", 30, 2],
  ]
);

export const SONG_LIBRARY = [
  HAPPY_BIRTHDAY,
  JINGLE_BELLS,
  SAINTS,
  BALL_GAME,
  TWINKLE,
  ODE_TO_JOY,
  MARY_LAMB,
  LONDON_BRIDGE,
  FRERE_JACQUES,
];

// Simplest tunes first — MelodyLab walks through these.
export const MELODIES = [
  TWINKLE,
  MARY_LAMB,
  FRERE_JACQUES,
  LONDON_BRIDGE,
  ODE_TO_JOY,
  JINGLE_BELLS,
  HAPPY_BIRTHDAY,
  SAINTS,
  BALL_GAME,
];

/* ---------- Event builders ---------- */

export function melodyEvents(song, { track = "melody", withIds = true, offset = 0 } = {}) {
  return song.notes.map((note) => ({
    beat: note.beat + offset,
    type: "lead",
    midi: note.midi,
    dur: note.dur * 0.95,
    track,
    ...(withIds ? { id: note.id } : {}),
  }));
}

export function chordEvents(song, { track = "chords", offset = 0 } = {}) {
  return song.chords.map((c) => ({
    beat: c.beat + offset,
    type: "chord",
    midis: CHORDS[c.name],
    dur: c.dur * 0.95,
    track,
  }));
}

// Auto-generated backing band (drums + bass) for any library song,
// derived from its chords and meter. `offset` shifts past the count-in.
export function backingEvents(song, { offset = 0 } = {}) {
  const bpb = song.beatsPerBar;
  const events = [];

  const chordAt = (beat) => {
    for (const c of song.chords) {
      if (beat >= c.beat && beat < c.beat + c.dur) return c.name;
    }
    return null;
  };

  for (let bar = 0; bar * bpb < song.beats; bar++) {
    const base = bar * bpb;
    if (bpb === 4) {
      events.push({ beat: offset + base, type: "kick", track: "drums" });
      events.push({ beat: offset + base + 2, type: "kick", track: "drums" });
      events.push({ beat: offset + base + 1, type: "snare", track: "drums" });
      events.push({ beat: offset + base + 3, type: "snare", track: "drums" });
      for (let e = 0; e < 8; e++) {
        events.push({ beat: offset + base + e * 0.5, type: "hat", track: "drums" });
      }
    } else {
      // Waltz feel: BOOM tick tick
      events.push({ beat: offset + base, type: "kick", track: "drums" });
      events.push({ beat: offset + base + 1, type: "hat", gain: 0.16, track: "drums" });
      events.push({ beat: offset + base + 2, type: "hat", gain: 0.16, track: "drums" });
    }
    // Bass: chord root on the strong beats.
    const strongBeats = bpb === 4 ? [0, 2] : [0];
    for (const b of strongBeats) {
      const chord = chordAt(base + b);
      if (chord) {
        events.push({
          beat: offset + base + b,
          type: "bass",
          midi: BASS_ROOTS[chord],
          dur: bpb === 4 ? 1.4 : 2.2,
          track: "bass",
        });
      }
    }
  }
  return events;
}

// Full arrangement for the Tune Library: one count-in bar of clicks,
// then melody + chords + auto-backing. Pickup notes (negative beats)
// land inside the count-in bar.
export function libraryEvents(songData) {
  const bpb = songData.beatsPerBar;
  const events = [];
  for (let b = 0; b < bpb; b++) {
    events.push({ beat: b, type: "hat", gain: b === 0 ? 0.28 : 0.18, track: "drums" });
  }
  events.push(...melodyEvents(songData, { offset: bpb, track: "melody" }));
  events.push(...chordEvents(songData, { offset: bpb, track: "chords" }));
  events.push(...backingEvents(songData, { offset: bpb }));
  return { events, beats: bpb + songData.beats, bpm: songData.bpm };
}

/* ---------- Drum grooves (Beat lab / Tap game / Quiz) ---------- */

// A basic pop/rock drum groove for `bars` bars of 4/4:
// kick on every beat, snare on beats 2 & 4, hi-hats on eighth notes.
export function drumGroove(bars = 1, { track = "drums", hats = true } = {}) {
  const events = [];
  for (let bar = 0; bar < bars; bar++) {
    const base = bar * 4;
    for (let b = 0; b < 4; b++) events.push({ beat: base + b, type: "kick", track });
    events.push({ beat: base + 1, type: "snare", track });
    events.push({ beat: base + 3, type: "snare", track });
    if (hats) {
      for (let e = 0; e < 8; e++) {
        events.push({ beat: base + e * 0.5, type: "hat", track });
      }
    }
  }
  return events;
}

// Just the pulse: a kick drum on every beat, beat 1 accented.
export function pulseEvents(bars = 1, { track = "pulse" } = {}) {
  const events = [];
  for (let bar = 0; bar < bars; bar++) {
    for (let b = 0; b < 4; b++) {
      events.push({
        beat: bar * 4 + b,
        type: "kick",
        gain: b === 0 ? 0.7 : 0.45,
        track,
      });
      if (b === 0) events.push({ beat: bar * 4, type: "hat", gain: 0.15, track });
    }
  }
  return events;
}

/* ---------- Rhythm patterns (Rhythm lab / Quiz) ----------

Each pattern is a set of clap/snare hits over a 2-bar (8-beat) loop,
played on top of the steady kick pulse. Fraction beats (1.5, 2/3…)
land BETWEEN the beats — that's syncopation and swing.
*/

export const RHYTHM_PATTERNS = [
  {
    id: "march",
    label: "🥾 The March",
    desc: "a clap on every beat — the rhythm walks in step with the pulse",
    hits: [0, 1, 2, 3, 4, 5, 6, 7],
    bpm: 100,
  },
  {
    id: "rock",
    label: "🥁 The Rock Beat",
    desc: "claps on 2 and 4 only — the “backbeat” behind most pop and rock songs",
    hits: [1, 3, 5, 7],
    bpm: 96,
  },
  {
    id: "dancer",
    label: "✨ The Dancer",
    desc: "long-short-short — some claps sneak in between the beats (syncopation!)",
    hits: [0, 1.5, 2, 3, 3.5, 4, 5.5, 6, 7, 7.5],
    bpm: 95,
  },
  {
    id: "island",
    label: "🏝️ The Island Bounce",
    desc: "claps only on the in-between “ands” — the springy offbeat of reggae",
    hits: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5],
    bpm: 92,
  },
  {
    id: "shuffle",
    label: "🐎 The Shuffle",
    desc: "every beat splits long-short, like a horse's easy trot — that's “swing”",
    hits: [0, 2 / 3, 1, 1 + 2 / 3, 2, 2 + 2 / 3, 3, 3 + 2 / 3,
           4, 4 + 2 / 3, 5, 5 + 2 / 3, 6, 6 + 2 / 3, 7, 7 + 2 / 3],
    bpm: 84,
  },
  {
    id: "clave",
    label: "🗝️ The Secret Key",
    desc: "the famous 3–2 “clave” — a 2-bar pattern that unlocks Latin music",
    hits: [0, 1.5, 3, 5, 6],
    bpm: 100,
  },
];

// Steady kick pulse (track "pulse") + the pattern's claps (track "rhythm"),
// so the rhythm layer can be muted live while the pulse keeps going.
export function rhythmPatternEvents(pattern) {
  const events = pulseEvents(2, { track: "pulse" });
  for (const b of pattern.hits) {
    events.push({ beat: b, type: "snare", gain: 0.3, track: "rhythm" });
  }
  return events;
}

/* ---------- Song Builder: an original 8-bar pop groove ----------

Chord progression: C – G – Am – F (the famous "four chords" heard in
Let It Be, No Woman No Cry, Someone Like You, and many more).
*/

export const BUILDER_PROGRESSION = ["C", "G", "Am", "F", "C", "G", "Am", "F"];

const BUILDER_MELODY = [
  // [note, beatInSong, dur] — one simple singable phrase per bar.
  ["E4", 0, 1], ["G4", 1, 1], ["C5", 2, 2],
  ["D5", 4, 1], ["B4", 5, 1], ["G4", 6, 2],
  ["A4", 8, 1], ["C5", 9, 1], ["E5", 10, 2],
  ["A4", 12, 1], ["G4", 13, 1], ["E4", 14, 2],
  ["E4", 16, 1], ["G4", 17, 1], ["C5", 18, 2],
  ["D5", 20, 1], ["B4", 21, 1], ["G4", 22, 2],
  ["E5", 24, 1], ["C5", 25, 1], ["A4", 26, 2],
  ["G4", 28, 1.5], ["E4", 29.5, 0.5], ["C4", 30, 2],
];

export function builderSong() {
  const events = [];

  events.push(...drumGroove(8, { track: "drums" }));

  BUILDER_PROGRESSION.forEach((chord, bar) => {
    const base = bar * 4;
    // Chords: one sustained chord per bar.
    events.push({
      beat: base,
      type: "chord",
      midis: CHORDS[chord],
      dur: 3.9,
      track: "chords",
    });
    // Bass: a simple pumping root-note pattern.
    const root = BASS_ROOTS[chord];
    events.push({ beat: base, type: "bass", midi: root, dur: 1.4, track: "bass" });
    events.push({ beat: base + 1.5, type: "bass", midi: root, dur: 0.4, track: "bass" });
    events.push({ beat: base + 2, type: "bass", midi: root, dur: 1.4, track: "bass" });
    events.push({ beat: base + 3.5, type: "bass", midi: root + 12, dur: 0.4, track: "bass" });
  });

  BUILDER_MELODY.forEach(([name, beat, dur], i) => {
    events.push({
      beat,
      type: "lead",
      midi: n(name),
      dur: dur * 0.95,
      gain: 0.26,
      track: "melody",
      id: i,
    });
  });

  return { events, beats: 32, bpm: 92 };
}
