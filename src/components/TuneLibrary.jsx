import { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "../lib/engine";
import { SONG_LIBRARY, libraryEvents } from "../lib/songs";

const LAYERS = [
  { id: "melody", emoji: "🎤", name: "Melody", role: "The tune — the part you'd sing" },
  { id: "chords", emoji: "🎹", name: "Chords", role: "The harmony underneath" },
  { id: "bass", emoji: "🎸", name: "Bass", role: "Low root notes on the strong beats" },
  { id: "drums", emoji: "🥁", name: "Drums", role: "The beat (plus the count-in clicks)" },
];

export default function TuneLibrary() {
  const playerRef = useRef(null);
  const [songIdx, setSongIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);
  const [activeNote, setActiveNote] = useState(-1);
  const [layers, setLayers] = useState({
    melody: true,
    chords: true,
    bass: true,
    drums: true,
  });

  const songData = SONG_LIBRARY[songIdx];
  const bpb = songData.beatsPerBar;
  const arrangement = useMemo(() => libraryEvents(songData), [songData]);
  const minMidi = useMemo(
    () => Math.min(...songData.notes.map((note) => note.midi)),
    [songData]
  );

  useEffect(() => {
    playerRef.current = new Player();
    playerRef.current.onstop = () => {
      setPlaying(false);
      setBeat(-1);
      setActiveNote(-1);
    };
    return () => playerRef.current.stop();
  }, []);

  const toggle = () => {
    if (playing) {
      playerRef.current.stop();
      return;
    }
    for (const layer of LAYERS) {
      playerRef.current.setTrackOn(layer.id, layers[layer.id]);
    }
    playerRef.current.play(arrangement.events, {
      bpm: arrangement.bpm,
      beats: arrangement.beats,
      onBeat: (b) => setBeat(b),
      onEvent: (ev) => setActiveNote(ev.id),
      onEnd: () => {
        setBeat(-1);
        setActiveNote(-1);
      },
    });
    setPlaying(true);
  };

  const pickSong = (idx) => {
    playerRef.current.stop();
    setSongIdx(idx);
    setBeat(-1);
    setActiveNote(-1);
  };

  const toggleLayer = (id) => {
    const next = { ...layers, [id]: !layers[id] };
    setLayers(next);
    playerRef.current.setTrackOn(id, next[id]);
  };

  const countingIn = playing && beat >= 0 && beat < bpb;
  const barBeat = beat >= bpb ? (beat - bpb) % bpb : countingIn ? beat : -1;

  return (
    <section className="concept-card">
      <header className="concept-card-header">
        <span className="concept-card-emoji">🎼</span>
        <div>
          <h2>Tune Library</h2>
          <p className="concept-card-tagline">
            Famous songs (all public domain), each with a full backing band.
          </p>
        </div>
      </header>

      <p>
        Pick a song you already know. You&apos;ll hear one bar of clicks (the{" "}
        <strong>count-in</strong> — how real bands start together), then the
        band comes in. Mute and unmute the layers <strong>while it plays</strong>{" "}
        to pick apart music you&apos;ve known your whole life.
      </p>

      <div className="song-picker">
        {SONG_LIBRARY.map((s, i) => (
          <button
            key={s.title}
            className={`pill-tab ${i === songIdx ? "active" : ""}`}
            onClick={() => pickSong(i)}
          >
            {s.emoji} {s.title}
          </button>
        ))}
      </div>

      <p className="song-fact">
        {songData.emoji} <em>{songData.fact}</em>{" "}
        <span className="song-meter">
          ({bpb === 3 ? "a waltz — count 1-2-3" : "count 1-2-3-4"}, {songData.bpm} BPM)
        </span>
      </p>

      <div className="builder-transport">
        <button className={`btn btn-large ${playing ? "btn-ghost" : "btn-primary"}`} onClick={toggle}>
          {playing ? "⏹ Stop" : "▶ Play the song"}
        </button>
        <div className="beat-dots beat-dots-small" aria-hidden="true">
          {Array.from({ length: bpb }, (_, b) => (
            <div
              key={b}
              className={`beat-dot ${barBeat === b ? "beat-dot-active" : ""} ${
                b === 0 ? "beat-dot-one" : ""
              } ${countingIn && barBeat === b ? "beat-dot-countin" : ""}`}
            >
              {b + 1}
            </div>
          ))}
        </div>
      </div>
      {countingIn && <p className="count-in-label">🥢 count-in…</p>}

      <div className="note-bubbles">
        {songData.notes.map((note) => (
          <div
            key={note.id}
            className={`note-bubble ${activeNote === note.id ? "note-bubble-active" : ""}`}
            style={{ "--note-h": `${(note.midi - minMidi) * 5}px` }}
          >
            {note.name.replace(/\d/, "")}
          </div>
        ))}
      </div>

      <div className="layer-list">
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            className={`layer-row ${layers[layer.id] ? "layer-row-on" : "layer-row-off"}`}
            onClick={() => toggleLayer(layer.id)}
            aria-pressed={layers[layer.id]}
          >
            <span className="layer-emoji">{layer.emoji}</span>
            <span className="layer-info">
              <span className="layer-name">{layer.name}</span>
              <span className="layer-role">{layer.role}</span>
            </span>
            <span className={`layer-switch ${layers[layer.id] ? "on" : ""}`}>
              {layers[layer.id] ? "ON" : "OFF"}
            </span>
          </button>
        ))}
      </div>

      <p className="demo-hint">
        Try this: play <strong>Happy Birthday with the melody OFF</strong> and
        sing it yourself over the backing band. Then try naming each layer you
        hear in songs on the radio.
      </p>
    </section>
  );
}
