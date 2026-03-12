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

## Frame Editor Reference

This is the right-side editor in the `Frames` tab.

### Frame list (left box under `Frames`)

Each line is a compact summary of one frame:

`000 | 100ms | #40 w:60@19|40@25 sound:Greet`

Meaning:

- `000`: frame index in the current animation timeline
- `100ms`: frame duration
- `#40`: primary sprite cell index from `map.png`
- `w:60@19|40@25`: weighted branch targets (`weight@frameIndex`)
- `sound:Greet`: sound id assigned to this frame
- `->34` (when present): `exitBranch` fallback target

### `Duration (ms)`

- What it is: how long this frame stays on screen before advancing.
- Valid values: number `>= 0`.
- Typical range: `50` to `300` for normal motion, larger for holds/pauses.
- Effect: updates `frame.duration`.

### `Sound` + `Play`

- What it is: optional sound id to trigger when this frame plays.
- `Play` lets you preview the selected sound immediately.
- Empty/`(none)` removes sound from the frame.
- Effect: sets or removes `frame.sound`.

### `Exit Branch`

- What it is: fallback frame index to jump to.
- Valid values: whole number `>= 0`.
- Use it when you want a deterministic fallback/continuation path.
- Effect: sets or removes `frame.exitBranch`.

### `Branch Frame Index`

- What it is: branch target frame index for the active editable branch slot.
- Valid values: whole number `>= 0`.
- Must be set together with `Weight (%)`.
- Effect: updates `frame.branching.branches[i].frameIndex`.

### `Weight (%)`

- What it is: relative weight for that branch target.
- Valid values: whole number from `0` to `100`.
- Must be set together with `Branch Frame Index`.
- Effect: updates `frame.branching.branches[i].weight`.
- Note: branch playback uses positive weights (`> 0`). A saved `0` weight is effectively ignored at runtime.

### `Images (x,y pairs, one per line)`

- What it is: list of sprite-map coordinates used by this frame.
- Format: one pair per line, like:

```text
0,0
1,0
2,0
```

- Spaces are tolerated.
- Invalid pairs fail apply with `Invalid image coordinate`.
- Effect: replaces `frame.images` with parsed coordinate pairs.

### Apply behavior for this panel

- `Apply` writes edits to the selected frame and saves to disk.
- In numeric fields, pressing `Enter` also applies.
- `Branch Frame Index` and `Weight` rules:
  - set both to create/update a branch
  - clear both to remove the branch entry

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

## Weight Semantics (Important)

Think of branch weights as **relative shares**, not strict percentages that must sum to 100.

- A branch is considered valid for weighted playback when:
  - `frameIndex` is a valid frame in the current animation
  - `weight` is a number greater than `0`
- Studio input validation allows `weight` between `0` and `100` (whole numbers).
- During playback, the tool computes a total of all positive branch weights and rolls within that total.

Examples:

- `20` and `80` behaves like a classic 20/80 split.
- `10` and `10` behaves exactly like `50/50`.
- `100` and `100` also behaves like `50/50`.
- `5`, `15`, `30` behaves like `10%`, `30%`, `60%` (same ratio).

### If weights do not sum to 100

That is fine. The tool normalizes by total weight automatically.

### Weight `0` behavior

- A `0` weight can still be saved in data.
- But it is ignored by weighted playback and path options (because only `weight > 0` is considered).
- In practice, use `0` only temporarily while editing; prefer removing branch entries you do not want.

### Out-of-range branch targets

- `Branch Frame Index` only validates as `>= 0` at edit time.
- If target frame is outside current animation length, it is ignored during preview playback.

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
    { frameIndex: 25, weight: 60 },
  ];
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
exitBranch: 34;
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

## Preview Path Selector vs Weighted Playback

There are two different behaviors to know:

- Path selector (`<` `>`):
  - chooses a specific available path for preview
  - useful for deterministic visual inspection of a branch path
- Weighted playback:
  - only happens when no explicit path choice is forcing a specific option
  - uses positive weights to pick a branch probabilistically

Practical tip:

- Use path selector to validate where each path goes.
- Then run repeated previews/reloads to validate your intended overall branch frequency.

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
