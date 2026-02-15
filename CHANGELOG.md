# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- No unreleased changes yet.

## [0.4.4] - 2026-02-15

### Added

- Agent pack support from `assets/agents/*` (including sprite maps and per-agent animation definitions).
- Frame-level sound playback from agent sound packs.
- Added more agents and sounds, with assets sourced from [pi0/clippyjs](https://github.com/pi0/clippyjs).
- New Appearance setting to choose the active agent.
- Dynamic main-window resize based on selected agent frame size.
- `Fork Notice` in `README.md` to clearly credit the original project and creators.
- Explicit acknowledgement for Felix Rieseberg in `README.md`.

### Changed

- Reworked renderer animation flow to play timeline-based agent animations from `agent.js` data.
- Updated Microsoft acknowledgement text in `README.md` to reflect the fork author's own voice.

### Notes

- Packaging can be produced unsigned by setting `IS_CODESIGNING_ENABLED=false` when signing tools are not present.
