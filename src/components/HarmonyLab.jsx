
import { useEffect, useRef, useState } from "react";
import { Player, noteToMidi } from "../lib/engine";
import { TWINKLE, CHORDS, melodyEvents, chordEvents } from "../lib/songs";
import ConceptCard from "./ConceptCard";

const DEMOS = [
  {
    id: "one",
    label: "🎵 One note",
    desc: "a single note by itself",
    events: [{ beat: 0, type: "lead", midi: noteToMidi("C4"), dur: 2 }],
    beats: 2.5,
    bpm: 90,
  },
  {
    id: "chord",
    label: "🎹 A chord (3 notes at once)",
    desc: "three notes sounding together",
    events: [{ beat: 0, type: "chord", midis: CHORDS.C, dur: 3, gain: 0.12 }],
    beats: 3.5,
    bpm: 90,
  },
  {
    id: "melody",
    label: "🎤 Melody alone",
    desc: "Twinkle Twinkle, just the tune",
    events: melodyEvents(TWINKLE, { withIds: false }),
    beats: TWINKLE.beats,
    bpm: TWINKLE.bpm,
  },
  {
    id: "both",
    label: "✨ Melody + harmony",
    desc: "the same tune with chords underneath",
    events: [
      ...melodyEvents(TWINKLE, { withIds: false }),
      ...chordEvents(TWINKLE),
    ],
    beats: TWINKLE.beats,
    bpm: TWINKLE.bpm,
  },
  {
    id: "major",
    label: "😀 Major chord",
    desc: "C major — bright, sunny, happy",
    events: [
      { beat: 0, type: "chord", midis: CHORDS.C, dur: 2, gain: 0.12 },
      { beat: 2, type: "chord", midis: CHORDS.C, dur: 3, gain: 0.12 },
    ],
    beats: 5.5,
    bpm: 90,
  },
  {
    id: "minor",
    label: "🌧️ Minor chord",
    desc: "C minor — one note lower, instantly moodier",
    events: [
      { beat: 0, type: "chord", midis: CHORDS.Cm, dur: 2, gain: 0.12 },
      { beat: 2, type: "chord", midis: CHORDS.Cm, dur: 3, gain: 0.12 },
    ],
    beats: 5.5,
    bpm: 90,
  },
  {
    id: "tension",
    label: "🧲 Tension… release!",
    desc: "a G7 chord pulls like a magnet — then C feels like coming home",
    events: [
      { beat: 0, type: "chord", midis: CHORDS.G7, dur: 2, gain: 0.09 },
      { beat: 2, type: "chord", midis: CHORDS.C, dur: 3, gain: 0.12 },
    ],
    beats: 5.5,
    bpm: 90,
  },
  {
    id: "fourchords",
    label: "🎸 The famous four chords",
    desc: "C – G – Am – F, the loop behind hundreds of hit songs",
    events: ["C", "G", "Am", "F"].flatMap((name, i) => [
      { beat: i * 2, type: "chord", midis: CHORDS[name], dur: 1.9, gain: 0.12 },
      { beat: i * 2, type: "bass", midi: CHORDS[name][0] - 12, dur: 1.8 },
    ]),
    beats: 8.5,
    bpm: 100,
  },
];

/* One-tap chord palette: every chord the app knows, with its "mood". */
const PALETTE = [
  { name: "C", mood: "bright" },
  { name: "F", mood: "warm" },
  { name: "G", mood: "bold" },
  { name: "Am", mood: "wistful" },
  { name: "Dm", mood: "serious" },
  { name: "Em", mood: "mysterious" },
  { name: "G7", mood: "tense", gain: 0.09 },
  { name: "Cm", mood: "stormy" },
];

export default function HarmonyLab() {
  const playerRef = useRef(null);
  const [activeDemo, setActiveDemo] = useState(null);
  const [activeChord, setActiveChord] = useState(null);

  useEffect(() => {
    playerRef.current = new Player();
    playerRef.current.onstop = () => {
      setActiveDemo(null);
      setActiveChord(null);
    };
    return () => playerRef.current.stop();
  }, []);

  const playDemo = (demo) => {
    if (activeDemo === demo.id) {
      playerRef.current.stop();
      return;
    }
    setActiveChord(null);
    playerRef.current.play(demo.events, {
      bpm: demo.bpm,
      beats: demo.beats,
      onEnd: () => setActiveDemo(null),
    });
    setActiveDemo(demo.id);
  };

  const playChip = (chip) => {
    setActiveDemo(null);
    playerRef.current.play(
      [{ beat: 0, type: "chord", midis: CHORDS[chip.name], dur: 2, gain: chip.gain ?? 0.12 }],
      { bpm: 90, beats: 2.5, onEnd: () => setActiveChord(null) }
    );
    setActiveChord(chip.name);
  };

  return (
    <ConceptCard
      emoji="🎹"
      title="Harmony & Chords"
      tagline="Notes played at the same time, supporting the melody."
      realSongs={[
        {
          song: "Let It Be — The Beatles",
          tip: "the piano plays chords (harmony) while Paul sings the melody over them",
        },
        {
          song: "Bohemian Rhapsody — Queen",
          tip: "when the voices stack up and sing together, that's vocal harmony",
        },
        {
          song: "Someone Like You — Adele",
          tip: "the piano cycles the same four chords for the entire song",
        },
        {
          song: "Any campfire guitar song",
          tip: "strummed guitar = chords = harmony; the singing = melody",
        },
      ]}
    >
      <p>
        <strong>Harmony</strong> is what happens when two or more notes sound{" "}
        <strong>at the same time</strong>. The most common building block is a{" "}
        <strong>chord</strong> — usually three notes played together. Chords
        are like the cushion the melody sits on: play the same melody over
        different chords and it can feel happy, sad, or tense.
      </p>
      <p>
        Quick rule of thumb: <strong>melody = one note after another</strong>,{" "}
        <strong>harmony = notes stacked on top of each other</strong>.
      </p>
      <p>
        Chords come in flavors. <strong>Major</strong> chords sound bright and
        happy; <strong>minor</strong> chords sound sad or mysterious — and the
        only difference is <em>one note moved a tiny step</em>. Chords with a{" "}
        <strong>7</strong> add an extra note that feels tense, like it&apos;s
        leaning forward, begging to move to the next chord. Songwriters mix
        these flavors to take you on an emotional ride.
      </p>

      <div className="demo-grid">
        {DEMOS.map((demo) => (
          <button
            key={demo.id}
            className={`demo-tile ${activeDemo === demo.id ? "demo-tile-active" : ""}`}
            onClick={() => playDemo(demo)}
          >
            <span className="demo-tile-label">
              {activeDemo === demo.id ? "⏹ " : ""}
              {demo.label}
            </span>
            <span className="demo-tile-desc">{demo.desc}</span>
          </button>
        ))}
      </div>
      <p className="demo-hint">
        Play them in order, top to bottom. Hear how the chords make the tune
        feel fuller? That&apos;s harmony doing its job. The last one — C, G,
        Am, F — is the exact loop you can remix in the{" "}
        <strong>🎛️ Song Builder</strong> tab.
      </p>

      <h3 className="lab-subhead">🎹 Try every chord</h3>
      <p>
        Tap a chord and listen for its mood. Which one sounds the happiest to
        you? The spookiest?
      </p>
      <div className="chord-strip chord-palette">
        {PALETTE.map((chip) => (
          <button
            key={chip.name}
            className={`chord-chip ${activeChord === chip.name ? "chord-chip-active" : ""}`}
            onClick={() => playChip(chip)}
          >
            {chip.name}
            <span className="chord-chip-mood">{chip.mood}</span>
          </button>
        ))}
      </div>
      <p className="demo-hint">
        Names ending in <strong>m</strong> are minor (the sadder ones). The{" "}
        <strong>7</strong> is the tense one — play G7 and then C right after,
        and feel the &quot;aahh&quot; of arriving home.
      </p>
    </ConceptCard>
  );
}
