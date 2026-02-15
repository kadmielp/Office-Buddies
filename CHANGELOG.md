# Changelog

All notable changes to this project will be documented in this file.

## [0.4.5] - 2026-02-15

### Added

- Agent personality profiles and appearance context for each selectable agent.
- Dynamic prompt token expansion support for:
  - `[AGENT_NAME]`
  - `[AGENT_PERSONALITY]`
  - `[AGENT_APPEARANCE]`
  - `[LIST OF ANIMATIONS]`
- New chat control button in `Chats` view.
- Native right-click `Animation` menu for selecting agent animations.

### Changed

- Chat prompt generation now uses the selected agent's personality/appearance and animation keys.
- Agent changes now trigger a model reload so the resolved system prompt is refreshed immediately.
- Animation-key parsing now validates against the selected agent's animation set (instead of legacy static keys).
- Animation selection from the context menu now plays once, then returns to automatic behavior.
- Animation completion now waits for actual animation end, with a watchdog fallback for branch-heavy animations.
- Agent switching now plays goodbye on the current agent, then welcome on the newly selected agent.
- Welcome animation selection now prefers `Greeting` before `Show` for better visibility on agents with very short `Show` animations.
- `Animation` context-menu entries are now sorted alphabetically.
- Starting a new chat now hard-resets the model session context.
- Selecting a chat now hard-resets the model session first, then restores that chat's saved context.
- `Chats` view action buttons moved below the table.
- Removed the `Back to Chat` button from `Settings`.
- User messages are now right-aligned with the user icon on the right.
- Parameters now show the fully resolved system prompt for the selected agent as read-only text.
- Chat input is disabled while the model is answering.

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
