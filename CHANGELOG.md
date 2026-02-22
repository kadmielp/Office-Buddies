# Changelog

All notable changes to this project will be documented in this file.

## [0.6.1] - 2026-02-22

### Added

- Added Windows global shortcut `Win+F4` for Buddy action: "Explain in a simple way" (`explain-simple`).
- Buddy shortcut executions are now persisted as new chats automatically (user prompt + assistant reply).

### Changed

- Buddy shortcut generation now follows the selected provider configuration more consistently, including OpenClaw when configured.
- Restored Buddy speech balloon auto-dismiss behavior (requires no manual close for each response).

## [0.6.0] - 2026-02-22

### Added

- Added OpenClaw as an optional remote provider in the app model settings and provider flow.
- Added OpenClaw setup documentation at `docs/openclaw-officebuddies-tailscale.md`.
- Added project branding assets used by README (`assets/logo.png` and screenshots under `assets/screenshots/`).

### Changed

- Updated README header/badges and feature list to reflect Office Buddies branding and OpenClaw support.
- Updated repository metadata references to `kadmielp/Office-Buddies`.
- Updated license attribution to include both the original author and fork maintainer.
- Rolled Electron runtime back to `35.1.4` to avoid a Windows inactive-window title regression.

## [0.5.7] - 2026-02-21

### Added

- Added Buddy selected-text actions:
  - `Define`
  - `Summarize`
  - `Explain Like I'm 5`
  - `Rewrite Friendly`
- Added Windows global shortcut support for Buddy actions:
  - `Win+F2` for define
  - `Win+F3` for summarize
  - `Win+F5` for rewrite
- Added classic speech balloon controls:
  - close (`X`) button
  - `Try again` action (reruns current Buddy action)
  - `Open in chat` action (moves context into chat view)
- Added new main-process modules for Buddy workflow:
  - `src/main/buddy-actions.ts`
  - `src/main/shortcuts.ts`

### Changed

- Buddy summarize/rewrite now use configured remote provider generation when available, with fallback behavior when not configured.
- Improved Windows selected-text capture reliability for shortcut actions by:
  - delaying key-send to avoid modifier conflicts
  - polling clipboard for capture completion
  - adding copy-method fallback
  - restoring original clipboard content after capture
- Improved speech balloon readability and compatibility with vintage styling:
  - better multiline formatting for definition output
  - refined option row visuals and spacing
  - larger scroll-safe balloon area for longer responses
- Shortcut-driven Buddy actions now prefer `Thinking`/`Processing` animation behavior and are separated from chat response-driven animation selection.

## [0.5.6] - 2026-02-20

### Added

- Added `Advanced > Sound` mute/unmute control with state icon feedback:
  - `speaker_on.png` when sound is enabled
  - `speaker_off.png` when sound is muted
- Added persisted `settings.disableSound` state to control app-wide assistant audio behavior.

### Changed

- Assistant sound playback now respects the global sound setting in both:
  - desktop assistant animations
  - assistant gallery previews
- Auto-update repository configuration now resolves from this app's `package.json` repository field instead of a hardcoded upstream repo.
- Update comparison lookup for latest GitHub release now uses the resolved repository.
- Increased idle animation wait interval from `6s` to `60s` between idle animation runs.

## [0.5.5] - 2026-02-20

### Added

- Added `Seq Add` mode in Animation Studio map toolbar to append frames by clicking map cells in sequence order.
- Added global preview path controls so branch-path selection can be changed regardless of currently selected frame.
- Added Windows launcher at repo root: `run-animation-studio.cmd`.

### Changed

- Animation Studio save flow now reloads the saved agent definition from disk after each save to keep UI and file state in sync.
- Improved frame list branch summary rendering to include all branch targets/weights for a frame.
- Updated multi-frame duplicate behavior to keep duplicated frames selected for immediate reordering.

### Fixed

- Fixed branch edit behavior when fields are cleared: clearing both `Branch Frame Index` and `Weight` now removes the branch entry.
- Fixed persistence issues where apply/save feedback could look successful while stale state remained in editor.
- Fixed Merlin animation integrity issue with an out-of-range `frameIndex` in `Announce`.

### Removed

- Removed `DoMagic1` and `DoMagic2` from Merlin and consolidated into `DoMagic`.
- Removed old Animation Studio launchers from `tools/animation-studio` (`run.cmd`, `run.sh`).

## [0.5.4] - 2026-02-20

### Added

- Animation Studio frame editor support for branch-weight editing (`Branch Frame Index` + `Weight (%)`).
- Preview path selector (`<` / `>`) under `Animation Preview` to force which available branch path is shown when multiple next-path options exist.
- Keyboard frame deletion in Animation Studio: pressing `Delete` on the frame list removes selected frame(s).
- Expanded Enter-to-apply behavior in Animation Studio typed fields:
  - `Duration`
  - `Exit Branch`
  - `Branch Frame Index`
  - `Weight`
  - `Images` via `Ctrl+Enter` / `Cmd+Enter`

### Changed

- Animation Studio preview no longer hard-resets to frame `0` every time a different animation is selected.
- Animation Studio preview path forcing now restarts playback immediately so selected endings can be verified quickly.

### Removed

- Removed `exitBranch` properties from all agent definitions under `assets/agents/*/agent.js`.

## [0.5.3] - 2026-02-20

### Added

- Added a standalone Win98-style Animation Studio at `tools/animation-studio` for visual editing of assistant animation data.
- Added Animation Studio support for:
  - loading assistant `agent.js`, `map.png`, and `sounds-mp3.js`
  - map-based frame picking with zoom controls
  - frame CRUD and reordering
  - multi-frame selection with invert-order action
  - animation create/rename/delete
  - sound-library tab with per-sound play buttons and frame assignment
  - looping animation preview with optional sound and `exitBranch` path following
  - inline edit apply via Enter key on `Duration` and `Exit Branch`
  - session undo support
- Added Animation Studio documentation in `README.md` with setup and end-to-end usage flow.

### Changed

- Animation Studio save behavior now writes directly to `assets/agents/<Agent>/agent.js` without generating `.bak` files.
- Refined Animation Studio preview/audio controls to use:
  - a single Play/Stop toggle button
  - a text-based `Sound: Off/On` toggle for preview audio.

## [0.5.2] - 2026-02-16

### Added

- Added animation-authoring workflow documentation in `README.md`, including:
  - frame-array targeting (`frameIndex`/`exitBranch`)
  - branch weight behavior
  - map/frame reference overlay usage
  - flow overlay generation and interpretation
- Added `tools/generate-animation-flow-overlay.ps1` to generate per-animation flow diagnostics with:
  - path probabilities
  - reachable vs unreachable timeline frames
  - dual output modes (`frame#` and pixel coordinates)

### Changed

- Added or refreshed inline `// #<index>` frame-array comments in agent animation timelines to make editing and branching references easier.

## [0.5.1] - 2026-02-16

### Changed

- Local model prompt wrapper now reinforces language-following behavior by instructing replies to match the user's latest message language and avoid mixed-language answers unless explicitly requested.
- Development start script now sets `NODE_LLAMA_CPP_GPU=auto` by default to avoid invalid or stale environment values and improve backend auto-selection reliability.

## [0.5.0] - 2026-02-16

### Added

- Added `address_book-0.png` next to the `Chats` page title.
- Added `info.png` next to the `About` page title.
- Added provider-status icon to the AI Provider row:
  - Local provider shows `network_drive_off.png`
  - Remote providers show `network_drive_on.png`
- Added state-based icon for `Advanced > Automatic Updates`:
  - `satellite_updates_on.png` when updates are enabled
  - `satellite_updates_off.png` when updates are disabled
- Added `tools/generate-map-reference.ps1` to generate per-agent frame-reference overlays for `assets/agents/*/map.png`.
- Generated `map-reference-overlay.png` (pixel coordinates) and `map-reference-frame-overlay.png` (frame indices) files for all agents to support manual frame-map validation.
- Added support for numeric frame references in animation frames: `images` can now use frame indices in addition to pixel coordinates.
- Added a classic assistant right-click context menu with:
  - `Hide`
  - `Options...`
  - `Choose Assistant...`
  - `Animate!`
- Added a dedicated Win98-style `Office Assistant` gallery view for `Choose Assistant...`, including Back/Next navigation and OK/Cancel selection flow.
- Added per-assistant gallery copy (speech bubble + name/description) for Clippit, F1, Merlin, Links, Rocky, Bonzi, Genie, Genius, Peedy, and Rover.
- Added live assistant preview rendering in the gallery selector box using agent sprite animations.
- Added sound playback to assistant gallery previews by honoring frame-level sound keys from each assistant's sound pack.

### Changed

- Main assistant window now defaults to the lower-right corner of the primary display work area (with margin) instead of centered startup placement.
- Restored startup chat behavior to follow `Appearance > Window Options > Always open chat when Office Buddies starts`.
- Fixed startup setting hydration race for `alwaysOpenChat` so persisted `false` no longer auto-opens chat during initialization.
- Improved always-on-top reliability for both assistant and chat windows by reapplying settings after window lifecycle events and chat show/toggle transitions.
- Improved z-order consistency when toggling `chatAlwaysOnTop` so assistant and chat top-most policies stay independent.
- Added a blocking `Preparing new chat...` loading overlay (using `assets/loading.gif`) during `New Chat` model/session reset to prevent accidental clicks.
- Chat input focus is now restored automatically after responses complete, so you can continue typing without clicking the textarea again.
- Local model session lifecycle operations are now serialized, with recovery for transient `Unexpected message type: stopped` startup/session errors.
- Updated the Google provider label in `Settings > Model` from `Google Gemini` to `Google`.
- Google provider remote model list now only shows models whose names start with `gemini` or `gemma`.
- Assistant message avatar now uses `src/renderer/images/icons/msagent.png` instead of `src/renderer/images/animations/Default.png`.
- Shifted chat avatars down by 3px for improved message alignment.
- Prompt source behavior is now stricter:
  - `settings.systemPrompt` is seeded from `DEFAULT_SYSTEM_PROMPT` only when missing.
  - Existing `settings.systemPrompt` values in `config.json` are no longer auto-overwritten by legacy-default migration logic.
- Improved `Advanced > Delete All Models` UX:
  - Shows `recycle_bin_full.png` when local models are downloaded and `recycle_bin_empty.png` otherwise.
  - Delete button is disabled when no local models are downloaded.
  - Deleting all models now always asks for confirmation.
  - Layout was adjusted for more consistent icon/text/button alignment.
- Deletion actions now trigger the `EmptyTrash` assistant animation in more places:
  - `Settings > Model > Delete Model`
  - `Settings > Advanced > Delete All Models`
  - `Chats > Delete Selected`
  - `Chats > Delete All Chats`
- Animation trigger reliability was improved by resetting the animation key after playback and before re-triggering, so repeated deletes continue to animate.
- Fixed startup auto-download behavior so deleting local models later does not unintentionally re-trigger the "download default model" startup path.
- Fixed startup failure when `config.json` is saved with a UTF-8 BOM (`EF BB BF`), which previously caused `electron-store` JSON parse errors (`Unexpected token 'ï»¿'`) during app initialization.
- `deleteAllModels` in the main process now returns a success boolean and uses `force: true` for folder removal to improve deletion robustness.
- Fixed chat-list refresh behavior so new chats appear in `Chats` immediately after sending messages, without requiring app restart.
- Frame overlay labels now show source coordinates only (for example, `0,0`) without reference-count suffixes.
- Updated renderer frame resolution to convert frame indices to source coordinates using each agent map's grid.
- `Choose Assistant...` now opens the new assistant gallery view instead of the general settings tab.
- Menu-driven view changes now force-open the chat window so `Options...` and `Choose Assistant...` reliably display their target UI.
- While the assistant gallery is open, the desktop assistant is hidden to reduce overlap with selection UI.
- Gallery preview animation now plays `GetAttention` once (with fallback to `Greeting`/`Show`/`Default`) and does not loop continuously.
- Updated assistant-gallery descriptions to remove the `Name:` prefix in the body copy.
- Moved gallery navigation buttons (`< Back`, `Next >`) inside the assistant fieldset and centered them.
- Stabilized assistant-gallery layout so navigation buttons stay in a fixed position regardless of description length (including longer text like Merlin).
- Moved `Gallery` and `Options` controls into the title bar for assistant/settings flows, matching the existing header control pattern.
- `Options` in the assistant header now opens the shared settings view (`settings-general`) instead of being disabled.
- Added persistent pressed-state visual feedback for selected header controls:
  - `Gallery` is pressed in assistant gallery view
  - `Options` is pressed in settings views
  - `Chats` is pressed in chat-history view
- Assistant left-click now toggles chat window visibility (open/close) and forces `chat` view when opening.
- Fixed chat-window visibility synchronization to avoid unintended open/close toggles and improve chooser open reliability.
- Closing the chat window while on assistant gallery now resets view state to `chat`, preventing stale hidden-assistant states.
- Assistant visibility logic now hides the desktop assistant only when assistant gallery is active and the chat window is actually open.

### Removed

- Removed the `Agent` selector section from `Settings > Appearance`; assistant selection is now handled via `Choose Assistant...` / assistant gallery.
- Removed the `Settings` button from the main chat title-bar controls.

## [0.4.7] - 2026-02-15

### Removed

- Legacy `extract-animations` workflow from `package.json`.
- Deprecated animation extraction script `tools/extract-animations.sh`.
- Legacy generated animation modules:
  - `src/renderer/clippy-animations.tsx`
  - `src/renderer/clippy-animation-helpers.tsx`
- Legacy source assets used only by the old extraction pipeline:
  - `assets/animations/clippy/animations.json`
  - `assets/animations/clippy/map.png`

## [0.4.6] - 2026-02-15

### Added

- Multi-provider chat support with selectable AI providers: Local (GGUF), OpenAI, Google Gemini, and Maritaca.
- Provider settings in `Settings > Model` for API key and remote model configuration.
- Remote model discovery based on the configured API key, with a model dropdown and manual refresh action.
- New IPC channels for remote provider operations (`AI_FETCH_MODELS`, `AI_PROMPT`).

### Changed

- Remote provider requests now run in the Electron main process (via IPC) instead of the renderer.
- Maritaca integration now follows OpenAI-compatible usage with internal base URL handling (`https://chat.maritaca.ai/api`).
- Added Maritaca model-list fallback to `sabia-3` when provider model listing is unavailable.

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
