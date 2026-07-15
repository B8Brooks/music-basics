
import { useEffect, useRef, useState } from "react";
import { Player } from "../lib/engine";
import { RHYTHM_PATTERNS, rhythmPatternEvents } from "../lib/songs";
import ConceptCard from "./ConceptCard";

const DEFAULT_PATTERN = RHYTHM_PATTERNS.findIndex((p) => p.id === "dancer");

export default function RhythmLab() {
  const playerRef = useRef(null);
  const [patternIdx, setPatternIdx] = useState(DEFAULT_PATTERN);
  const [playing, setPlaying] = useState(false);
  const [rhythmOn, setRhythmOn] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);

  const pattern = RHYTHM_PATTERNS[patternIdx];

  useEffect(() => {
    playerRef.current = new Player();
    playerRef.current.onstop = () => {
      setPlaying(false);
      setCurrentBeat(-1);
    };
    return () => playerRef.current.stop();
  }, []);

  const toggle = () => {
    if (playing) {
      playerRef.current.stop();
    } else {
      playerRef.current.setTrackOn("rhythm", rhythmOn);
      playerRef.current.play(rhythmPatternEvents(pattern), {
        bpm: pattern.bpm,
        loop: true,
        beats: 8,
        onBeat: (b) => setCurrentBeat(b % 4),
      });
      setPlaying(true);
    }
  };

  const toggleRhythm = () => {
    const next = !rhythmOn;
    setRhythmOn(next);
    playerRef.current.setTrackOn("rhythm", next);
  };

  const pickPattern = (idx) => {
    playerRef.current.stop();
    setPatternIdx(idx);
  };

  return (
    <ConceptCard
      emoji="👏"
      title="Rhythm"
      tagline="The pattern of long and short sounds played on top of the beat."
      realSongs={[
        {
          song: "We Will Rock You — Queen",
          tip: "stomp-stomp-CLAP: one of the most famous rhythm patterns ever",
        },
        {
          song: "Shape of You — Ed Sheeran",
          tip: "the beat is steady, but the vocal rhythm dances around it",
        },
        {
          song: "Three Little Birds — Bob Marley",
          tip: "the guitar chops on the offbeats — that's the Island Bounce",
        },
        {
          song: "Happy — Pharrell Williams",
          tip: "the claps make a rhythm pattern over the steady pulse",
        },
      ]}
    >
      <p>
        People mix up <strong>beat</strong> and <strong>rhythm</strong>. The
        beat is the steady pulse underneath — it never changes. The{" "}
        <strong>rhythm</strong> is the pattern of longer and shorter sounds
        played <em>on top of</em> that pulse. Clapping along to the words of a
        song? That&apos;s rhythm. Tapping your foot? That&apos;s the beat.
      </p>
      <p>
        Rhythm patterns have personalities — and names! When claps land right
        on the beats, the rhythm feels solid and marching. When they sneak in{" "}
        <em>between</em> the beats, that&apos;s called{" "}
        <strong>syncopation</strong> — it&apos;s what makes music feel funky,
        jazzy, or danceable. Try each pattern below:
      </p>

      <div className="song-picker">
        {RHYTHM_PATTERNS.map((p, i) => (
          <button
            key={p.id}
            className={`pill-tab ${i === patternIdx ? "active" : ""}`}
            onClick={() => pickPattern(i)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="demo-hint">{pattern.desc}</p>

      <div className="beat-dots" aria-hidden="true">
        {[0, 1, 2, 3].map((b) => (
          <div
            key={b}
            className={`beat-dot ${currentBeat === b ? "beat-dot-active" : ""} ${
              b === 0 ? "beat-dot-one" : ""
            }`}
          >
            {b + 1}
          </div>
        ))}
      </div>

      <div className="demo-controls">
        <button className={`btn ${playing ? "btn-ghost" : "btn-primary"}`} onClick={toggle}>
          {playing ? "⏹ Stop" : "▶ Play the steady beat"}
        </button>
        <button
          className={`btn ${rhythmOn ? "btn-secondary" : "btn-ghost"}`}
          onClick={toggleRhythm}
        >
          {rhythmOn ? "👏 Rhythm: ON" : "👏 Add the rhythm on top"}
        </button>
      </div>
      <p className="demo-hint">
        Start the beat, then flip the rhythm on and off while it plays. The
        low pulse never changes — only the clap pattern comes and goes. Then
        switch patterns and hear how each one has its own feel.
      </p>
    </ConceptCard>
  );
}
