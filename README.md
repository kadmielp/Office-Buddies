# Office Buddies

This project brings classic Office-style assistants into a modern LLM chat app with a 90s desktop vibe.

Clippy is still here (and yes, still iconic), but Office Buddies treats the app as a home for the broader assistant cast too: Bonzi, F1, Genie, Genius, Links, Merlin, Peedy, Rocky, Rover, and others added over time.

Under the hood, it supports local GGUF models and optional remote providers, while keeping the UI intentionally nostalgic.
It is also a tribute to the nostalgic assistants that marked generations.

## What This Fork Is

This repository is a personal fork of [felixrieseberg/clippy](https://github.com/felixrieseberg/clippy), expanded to support multiple assistants, richer animation behavior, and multi-provider AI backends.

This fork is maintained for self-taught and educational purposes, mainly to explore AI capabilities, study implementation patterns, and learn from the open-source community.

It is made with respect for:

- The original Clippy project and its author
- Microsoft and the Office Assistant legacy
- The creators and preservers of these assistant assets

This app is not affiliated with, endorsed by, or sponsored by Microsoft.

## Core Features

- Multiple classic assistants, each with their own animation set and sounds.
- Local-first chat with GGUF models through llama.cpp / `node-llama-cpp`.
- Optional remote providers: OpenAI, Google, and Maritaca.
- Provider-aware model selection from API-backed model lists.
- Configurable prompt and generation parameters.
- Native-feeling context menu for choosing and previewing assistant animations.
- Windows-98-inspired UI and interaction patterns.

## Providers

Configure providers in `Settings > Model`.

- `Local (GGUF)`: runs on your machine via `@electron/llm`.
- `OpenAI`: API key + model selection.
- `Google`: API key + model selection.
- `Maritaca`: API key + model selection.

Remote provider requests are executed in the Electron main process via IPC.

## Downloading Local Models

For local mode, GGUF models are supported. Good sources include quantizations from:

- [TheBloke](https://huggingface.co/thebloke)
- [Unsloth](https://huggingface.co/unsloth)

## Editing Agent Animations (Frame Arrays)

Animation files live at `assets/agents/<Agent>/agent.js`.

### 1) Understand frame targets

- `frames: [...]` is the animation timeline array.
- `branching.branches[].frameIndex` points to a frame index in that timeline array.
- `exitBranch` is a fallback jump target in the same timeline array.
- `weight` is branch probability percentage (remaining percentage falls back to `exitBranch`, or next frame when no `exitBranch`).

To make timeline editing easier, this fork uses inline frame comments (for example `// #23`) before each frame object.

### 2) Generate sprite-map references

Use the map reference script to generate both coordinate and frame-number overlays:

```powershell
powershell -ExecutionPolicy Bypass -File tools/generate-map-reference.ps1 -Agent F1
```

Outputs in `assets/agents/F1/`:

- `map-reference-overlay.png` (pixel coordinates)
- `map-reference-frame-overlay.png` (sprite frame numbers)

### 3) Visualize animation flow paths

Use the flow overlay script to inspect reachable paths, branch probabilities, and unused timeline frames:

```powershell
powershell -ExecutionPolicy Bypass -File tools/generate-animation-flow-overlay.ps1 -Agent F1 -Animation Congratulate
```

Outputs:

- `*-flow-overlay-frame.png` (labels as sprite `#frame`)
- `*-flow-overlay-coordinates.png` (labels as `x,y`)

Optional mode:

```powershell
powershell -ExecutionPolicy Bypass -File tools/generate-animation-flow-overlay.ps1 -Agent F1 -Animation Congratulate -LabelMode FrameIndex
powershell -ExecutionPolicy Bypass -File tools/generate-animation-flow-overlay.ps1 -Agent F1 -Animation Congratulate -LabelMode Coordinates
```

### 4) Iterate safely

- Edit `agent.js`
- Regenerate overlays
- Reload app and test
- Verify that intended frames are reachable in flow overlays (and that unexpected frames are not)

## Scope and Intent

This project is not trying to beat every chat client in features.

The goal is simpler: combine capable modern AI with a playful, classic assistant experience that feels personal and a little weird in a good way.

## Acknowledgements

Special thanks to:

- [Felix Rieseberg](https://github.com/felixrieseberg) for creating and open-sourcing the original Clippy app.
- Microsoft, for the Office Assistant legacy and for Electron.
- [Kevan Atteberry](https://www.kevanatteberry.com/) for designing Clippy.
- [Jordan Scales (@jdan)](https://github.com/jdan) for the Windows 98 visual language.
- [Pooya Parsa (@pi0)](https://github.com/pi0) and contributors who helped preserve/extract assistant animation data.
- [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) for making local inference practical in Node/Electron.
