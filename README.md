# 🎵 Music Basics

An interactive web app for learning music from absolute scratch: what a beat
is, how to count it, and how to tell melody from harmony — with sound demos
your browser plays live.

**Live site:** https://b8brooks.github.io/music-basics/

## What's inside

- 🎓 **Basics** — interactive lessons on the beat & tempo, rhythm, melody, and
  harmony & chords, each with a play-along demo and "hear it in real songs"
  listening tips
- 🎼 **Tune Library** — famous public-domain songs (Happy Birthday, Jingle
  Bells, When the Saints Go Marching In, Take Me Out to the Ball Game,
  Twinkle Twinkle, Ode to Joy) with an auto-generated backing band — mute and
  unmute melody/chords/bass/drums while they play. Includes waltz-time (3/4)
  songs and count-ins.
- 🎛️ **Song Builder** — an 8-bar pop loop (the famous C–G–Am–F progression)
  with drum, bass, chord, and melody layers you can mute and unmute while it
  plays, to train your ear to pick out each part
- 🥁 **Tap the Beat** — tap along with the drums and get instant feedback on
  whether you're early, late, or right on the beat
- 🧠 **Ear Quiz** — randomized listening questions: melody or chord? which
  beats has the snare? which groove is faster?

All audio is synthesized in the browser with the Web Audio API — there are no
audio files or recordings. Melodies are public-domain tunes.

## Tech

- React 18 + Vite
- Web Audio API (a tiny synth/sequencer in `src/lib/engine.js`)
- Deployed automatically to GitHub Pages on every push to `main`

## Local development

```bash
npm install
npm run dev
```

Open the printed localhost URL. `npm run build` produces the static site in
`dist/`.
