# Office Buddies brand film (62 s, 1080p, 30 fps)

Render: `npx remotion render src/index.ts Film out/film-silent.mp4 --concurrency=2 --crf=16`, then mux `audio/mix.wav` with `-c:v copy`.
Preview: `npx remotion studio`.

Change everything in `src/theme.ts` (palette, fonts, scene timings, flash-word frames). One component per scene in `src/scenes/`; entry transitions are in `src/Film.tsx`.
Sprites play straight from the app's own animation data (`src/data/*.json`, `public/agents/*.png`). Screens are in `public/screens/`.

Scene timings (s): 0-6 open | 6-14 promise | 14-18 flash words | 18-26 models | 26-34 shortcuts (illustrative) | 34-46 coding agents | 46-54 themes | 54-62 close.
Audio: `audio/voz/s1..s8.wav` (VoiceStudio demo voice, 32 steps), `audio/music.wav` (Pixel Breeze, 120.25 BPM slowed 0.2% to 120), `audio/mix.wav` (-16 LUFS, -1.5 dBTP).
Scripts: `script/s1..s8.txt`.
Fonts are system fonts (Segoe UI); bundle a font file in `public/` for rendering on other machines.

Setup: `npm install`, then `npm run prepare` (copies sprite sheets from `../assets/agents`). The voice-over and music files are not stored in the repo; `public/mix.wav` is the final mix. Voice-over text is in `script/`.
