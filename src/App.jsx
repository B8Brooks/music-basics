import { useEffect, useState } from "react";
import { initAudioUnlock } from "./lib/engine";
import BeatLab from "./components/BeatLab";
import TuneLibrary from "./components/TuneLibrary";
import RhythmLab from "./components/RhythmLab";
import MelodyLab from "./components/MelodyLab";
import HarmonyLab from "./components/HarmonyLab";
import SongBuilder from "./components/SongBuilder";
import TapGame from "./components/TapGame";
import Quiz from "./components/Quiz";

const TABS = [
  { id: "basics", label: "🎓 Basics" },
  { id: "tunes", label: "🎼 Tune Library" },
  { id: "builder", label: "🎛️ Song Builder" },
  { id: "tap", label: "🥁 Tap the Beat" },
  { id: "quiz", label: "🧠 Quiz" },
];

const IS_IOS =
  typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

export default function App() {
  const [tab, setTab] = useState("basics");
  const [showIosHint, setShowIosHint] = useState(IS_IOS);

  // Unlock mobile audio on the first tap anywhere (iOS/Android autoplay
  // rules), including the iOS silent-switch bypass.
  useEffect(() => {
    initAudioUnlock();
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-title">
            <span className="navbar-emoji">🎵</span>
            <span>Music Basics</span>
          </div>
        </div>
      </header>
      <main className="main">
        <header className="music-intro">
          <h1>Learn to hear what&apos;s inside a song</h1>
          <p>
            The beat, the melody, the harmony — explained with sounds your
            browser plays live. Turn your volume on!
          </p>
        </header>

        {showIosHint && (
          <div className="audio-hint" role="note">
            <span>
              🔇 <strong>No sound?</strong> Flip the silent switch on the side
              of your iPhone to ring mode and turn the volume up, then press
              play again.
            </span>
            <button
              className="audio-hint-close"
              onClick={() => setShowIosHint(false)}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        <nav className="music-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`pill-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "basics" && (
          <>
            <BeatLab />
            <RhythmLab />
            <MelodyLab />
            <HarmonyLab />
            <p className="music-next-step">
              Got the basics? Try the <strong>🎼 Tune Library</strong> — famous
              songs you already know, with a full band you can pull apart —
              or the <strong>🎛️ Song Builder</strong> to hear how a pop
              arrangement is stacked.
            </p>
          </>
        )}
        {tab === "tunes" && <TuneLibrary />}
        {tab === "builder" && <SongBuilder />}
        {tab === "tap" && <TapGame />}
        {tab === "quiz" && <Quiz />}

        <footer className="music-footer">
          All sound is synthesized in your browser with the Web Audio API — no
          recordings, no downloads. Melodies are public-domain tunes.
        </footer>
      </main>
    </>
  );
}
