# Animation Studio Tutorial

This guide covers the Animation Studio end-to-end:

- what it is
- how to run it
- how to edit animations safely
- how branching works (`exitBranch` vs `branch frame index` + `weight`)

## What Animation Studio Is

Animation Studio is a standalone Win98-style tool for editing assistant animation data in `assets/agents/<Agent>/agent.js`.

It helps you:

- inspect and pick frames from `map.png`
- edit animation timelines (`frames[]`)
- assign sounds
- preview animation paths
- save changes directly back to disk

## Start the Tool

From repo root:

```powershell
node tools/animation-studio/server.js
```

Or on Windows:

```powershell
tools\animation-studio\run.cmd
```

Default URL:

- `http://127.0.0.1:4177`

Optional port:

```powershell
tools\animation-studio\run.cmd 4300
```

## UI Overview

- Left panel (`Animations`):
  - choose animation
  - create/rename/delete animation
  - animation preview box + path selector arrows
- Center panel (`Map Frame Picker`):
  - pick sprite cells from `map.png`
  - zoom controls
- Right panel (`Frames` tab):
  - frame list
  - edit fields (`Duration`, `Sound`, `Exit Branch`, `Branch Frame Index`, `Weight`, `Images`)
  - frame actions (`Add`, `Duplicate`, `Remove`, `Up/Down`, etc.)
- Right panel (`Sound Library` tab):
  - play assistant sounds
  - assign selected sound to frame

## Tutorial 1: Edit a Basic Animation

1. Select assistant and click `Load`.
2. Select an animation from the list.
3. Select a frame in `Frames`.
4. Change `Duration`.
5. Click `Apply` (or press Enter in numeric fields).
6. Verify status shows `Saved: assets/agents/<Agent>/agent.js`.

## Tutorial 2: Replace Frame Image from Map

1. Select a frame.
2. Click a sprite cell in `Map Frame Picker`.
3. Click `Replace Selected Image`.
4. Click `Apply` to persist.

## Tutorial 3: Add Sound to a Frame

1. Select a frame.
2. Pick a sound in `Sound` dropdown (or use `Sound Library` tab and `Use In Frame`).
3. Click `Play` to test.
4. Click `Apply`.

## Tutorial 4: Branching and Path Preview

1. Select a frame that branches.
2. Set `Branch Frame Index` and `Weight (%)`.
3. Optionally set `Exit Branch`.
4. Click `Apply`.
5. Use `<` `>` under `Animation Preview` to pick which branch path to preview.
6. Preview restarts from frame `0` when path changes.

## Branching Model: `exitBranch` vs `branch frame index`

`exitBranch` and `branching.branches[]` are different mechanisms:

### `branching.branches[].frameIndex` (+ `weight`)

- Represents weighted branch targets.
- Requires:
  - `frameIndex`: destination frame in current animation timeline
  - `weight`: probability percentage for that branch
- If a frame has multiple branches, each branch can have its own weight.

Example:

```js
branching: {
  branches: [
    { frameIndex: 19, weight: 40 },
    { frameIndex: 25, weight: 60 }
  ]
}
```

Meaning:

- 40% chance to jump to frame `19`
- 60% chance to jump to frame `25`

### `exitBranch`

- Fallback jump target when branch conditions/probabilities do not select a branch.
- Also a timeline frame index in the same animation.

Example:

```js
exitBranch: 34
```

Meaning:

- if no weighted branch is chosen, jump to frame `34`

## Practical Difference

- Use `branch frame index + weight` to define one or more probabilistic paths.
- Use `exitBranch` as a deterministic fallback/continuation target.

In Studio:

- `Branch Frame Index` + `Weight` edits a branch entry.
- `Exit Branch` edits fallback jump.
- Clearing both `Branch Frame Index` and `Weight` removes that branch entry.

## Save Behavior

- `Apply` updates the selected frame and persists to disk.
- Enter in numeric fields also applies/saves.
- `Ctrl+Enter` in `Images` applies/saves.
- Studio reloads the saved agent definition from disk after save to verify persisted state.

## Recommended Safe Workflow

1. Make a small change.
2. `Apply`.
3. Confirm frame list text reflects the change (`w:<weight>@<frameIndex>`).
4. Re-load assistant once to confirm behavior.
5. Repeat.

## Troubleshooting

### Change appears in UI but not in file

- Refresh browser (`Ctrl+F5`) once.
- Ensure you clicked `Apply` after editing.
- Confirm status shows `Saved: assets/agents/<Agent>/agent.js`.

### Branch edits not behaving as expected

- Ensure both `Branch Frame Index` and `Weight` are set.
- If you want to remove a branch, clear both fields and apply.
- Use preview arrows to test alternate path playback.
