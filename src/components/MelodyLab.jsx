
import { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "../lib/engine";
import { MELODIES, melodyEvents } from "../lib/songs";
import ConceptCard from "./ConceptCard";

export default function MelodyLab() {
  const playerRef = useRef(null);
  const [songIdx, setSongIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeNote, setActiveNote] = useState(-1);

  const song = MELODIES[songIdx];

  // Lowest note of the current song — bubble heights are drawn relative
  // to this so every song fits, whatever its range.
  const minMidi = useMemo(
    () => Math.min(...song.notes.map((nt) => nt.midi)),
    [song]
  );

  useEffect(() => {
    playerRef.current = new Player();
    playerRef.current.onstop = () => {
      setPlaying(false);
      setActiveNote(-1);
    };
    return () => playerRef.current.stop();
  }, []);

  const toggle = () => {
    if (playing) {
      playerRef.current.stop();
    } else {
      // Pickup notes sit at negative beats — shift everything forward so
      // they play (they can't be scheduled before time zero).
      const pickup = Math.max(0, -Math.min(...song.notes.map((nt) => nt.beat)));
      playerRef.current.play(melodyEvents(song, { offset: pickup }), {
        bpm: song.bpm,
        beats: song.beats + pickup,
        onEvent: (ev) => setActiveNote(ev.id),
        onEnd: () => setActiveNote(-1),
      });
      setPlaying(true);
    }
  };

  const pickSong = (idx) => {
    playerRef.current.stop();
    setSongIdx(idx);
    setActiveNote(-1);
  };

  return (
    <ConceptCard
      emoji="🎤"
      title="Melody"
      tagline="The tune — the part you hum or sing. One note at a time."
      realSongs={[
        {
          song: "Almost any pop song",
          tip: "the singer's voice carries the melody — it's the part stuck in your head",
        },
        {
          song: "Seven Nation Army — The White Stripes",
          tip: "that famous riff everyone chants at stadiums? A seven-note melody",
        },
        {
          song: "Let It Go — Frozen",
          tip: "hum it right now — the notes you're humming are the melody",
        },
      ]}
    >
      <p>
        The <strong>melody</strong> is the tune: a sequence of single notes,
        one after another, that rises and falls. It&apos;s the part of the song
        you hum, whistle, or can&apos;t get out of your head. In most songs the{" "}
        <strong>singer carries the melody</strong>, and everything else
        (drums, bass, chords) supports it.
      </p>
      <p>
        Melodies move in two ways: <strong>steps</strong> (to the very next
        note — smooth, like Twinkle Twinkle) and <strong>leaps</strong> (a
        jump over several notes — dramatic, like the start of Take Me Out to
        the Ball Game). Most great tunes mix both. Try a few below and see if
        you can spot the steps and the leaps!
      </p>

      <div className="song-picker">
        {MELODIES.map((s, i) => (
          <button
            key={s.title}
            className={`pill-tab ${i === songIdx ? "active" : ""}`}
            onClick={() => pickSong(i)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="note-bubbles">
        {song.notes.map((note) => (
          <div
            key={note.id}
            className={`note-bubble ${activeNote === note.id ? "note-bubble-active" : ""}`}
            style={{ "--note-h": `${(note.midi - minMidi) * 5}px` }}
          >
            {note.name.replace(/\d/, "")}
          </div>
        ))}
      </div>

      <div className="demo-controls">
        <button className={`btn ${playing ? "btn-ghost" : "btn-primary"}`} onClick={toggle}>
          {playing ? "⏹ Stop" : "▶ Play the melody"}
        </button>
      </div>
      <p className="demo-hint">
        Watch the notes light up — higher bubbles are higher notes. Notice
        it&apos;s always <strong>one note at a time</strong>. That&apos;s what makes it a
        melody. More famous tunes — with a full backing band — are in the{" "}
        <strong>🎼 Tune Library</strong> tab.
      </p>
    </ConceptCard>
  );
}
