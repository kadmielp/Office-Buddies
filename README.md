# Clippy + Classic Assistants

This project brings classic Office-style assistants into a modern LLM chat app with a 90s desktop vibe.

Clippy is still here (and yes, still iconic), but this fork treats the app as a home for the broader assistant cast too: Bonzi, F1, Genie, Genius, Links, Merlin, Peedy, Rocky, Rover, and others added over time.

Under the hood, it supports local GGUF models and optional remote providers, while keeping the UI intentionally nostalgic.

## What This Fork Is

This repository is a personal fork of [felixrieseberg/clippy](https://github.com/felixrieseberg/clippy), expanded to support multiple assistants, richer animation behavior, and multi-provider AI backends.

It is made with respect for:

- The original Clippy project and its author
- Microsoft and the Office Assistant legacy
- The creators and preservers of these assistant assets

This app is not affiliated with, endorsed by, or sponsored by Microsoft.

## Core Features

- Multiple classic assistants, each with their own animation set and sounds.
- Local-first chat with GGUF models through llama.cpp / `node-llama-cpp`.
- Optional remote providers: OpenAI, Google Gemini, and Maritaca.
- Provider-aware model selection from API-backed model lists.
- Configurable prompt and generation parameters.
- Native-feeling context menu for choosing and previewing assistant animations.
- Windows-98-inspired UI and interaction patterns.

## Providers

Configure providers in `Settings > Model`.

- `Local (GGUF)`: runs on your machine via `@electron/llm`.
- `OpenAI`: API key + model selection.
- `Google Gemini`: API key + model selection.
- `Maritaca`: API key + model selection.

Remote provider requests are executed in the Electron main process via IPC.

## Downloading Local Models

For local mode, GGUF models are supported. Good sources include quantizations from:

- [TheBloke](https://huggingface.co/thebloke)
- [Unsloth](https://huggingface.co/unsloth)

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
