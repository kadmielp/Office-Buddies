# Animation Studio Tutorial

This guide covers the Animation Studio end-to-end. For a quick reference of the tool itself, see its [README](../../tools/animation-studio/README.md).

It covers:

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
  - edit fields (`Duration`, `Sound`, `Images`) and the `What happens after this frame` table (branches, weights, exit)
  - frame actions (`Add`, `Duplicate`, `Remove`, `Up/Down`, etc.)
- Right panel (`Scenarios` tab):
  - every way the animation can play, with its chance, duration and frame path
  - warnings for broken or never-played branches
- Right panel (`Sound Library` tab):
  - play assistant sounds
  - assign selected sound to frame

## Frame Editor Reference

This is the right-side editor in the `Frames` tab.

### Frame list (left box under `Frames`)

Each line is a compact summary of one frame:

`000 | 100ms | #40 →19 60%, 25 40% sound:Greet`

Meaning:

- `000`: frame index in the current animation timeline
- `100ms`: frame duration
- `#40`: primary sprite cell index from `map.png`
- `->19 60%, 25 40%`: where the animation goes next and with what chance (only shown when the frame branches or has an exit)
- `sound:Greet`: sound id assigned to this frame
- `✗unused`: no way to reach this frame from frame 0

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

### `What happens after this frame`

One row per possible next step. Chances are fixed: they only change when you edit this table.

| Column | Meaning |
| --- | --- |
| `Go to frame` | Frame the animation jumps to. Empty on the last row means "next frame" (or the end on the last frame). |
| `Weight` | Percent chance for that branch (whole number 0-100). |
| `Chance` | What the branch really gets after clipping at 100%. |

- Branch rows edit `frame.branching.branches[i]`; use `Add branch` / `✘` to add or remove them.
- The last row ("the rest") gets whatever the branches leave over: `100 - sum of weights`. Its frame edits `frame.exitBranch`.
- A target outside the animation ends the animation (row shown in red).
- Weights above 100% in total are ignored (row shown in yellow, summary in red).

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
- Branch table edits apply immediately and can be undone.

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

## Tutorial 4: Branching and Scenarios

1. Select a frame and look at `What happens after this frame`.
2. Click `Add branch`, pick the target frame and a weight.
3. Check the summary line: `Branches 95% + 5% for the rest = 100%`.
4. Open the `Scenarios` tab to see every way the whole animation can play.
5. Click a scenario to preview exactly that path, or `Play random` to play it like the app does.

## How branching works

The app rolls once per frame, using the same rules as the studio shows:

1. Branches are checked in order against a running total of their weights.
2. If none is hit, the frame goes to `exitBranch`; without it, to the next frame.
3. A target past the last frame (or below 0) ends the animation.

Examples:

- One branch `95 -> frame 1` on frame 1: the frame repeats (average 20 plays), then falls to the next frame (5%).
- Branches `40 -> 19` and `60 -> 25`: nothing is left over, so the exit is never used.
- Branches `20 -> 19` and `30 -> 25`: the remaining 50% goes to the exit or next frame.
- Weights `100` and `100`: only the first is used; the second is clipped.

## Reading the Scenarios tab

- `Chance` is measured from frame 0, so every scenario's chances add up to 100% and do not depend on what you have selected.
- `Frames played` lists the path. `2–35` is a run of consecutive frames, `1 ⟲×20` is a frame that jumps to itself (about 20 plays in a row), `↻ 5` means the path goes back to frame 5 and can repeat from there, and `end` means the animation finishes.
- Frames that appear in no scenario are marked `✗unused` in the frame list.
- The preview overlay shows `Reached: X%` (chance a play reaches that frame) and, while playing, `took Y%` (chance of the jump that was just taken).
- `Save` warns if a branch points outside the animation, weights exceed 100%, or a group of frames can never reach the end.

## Save Behavior

- `Apply` updates the selected frame and persists to disk.
- Enter in numeric fields also applies/saves.
- `Ctrl+Enter` in `Images` applies/saves.
- Studio reloads the saved agent definition from disk after save to verify persisted state.

## Recommended Safe Workflow

1. Make a small change.
2. `Apply`.
3. Confirm the frame list and `Scenarios` tab reflect the change.
4. Re-load assistant once to confirm behavior.
5. Repeat.

## Troubleshooting

### Change appears in UI but not in file

- Refresh browser (`Ctrl+F5`) once.
- Ensure you clicked `Apply` after editing.
- Confirm status shows `Saved: assets/agents/<Agent>/agent.js`.

### Branch edits not behaving as expected

- Check the summary under the branch table: it must read `= 100%`.
- Red rows point to a frame that does not exist; yellow rows have weight that is clipped.
- Open the `Scenarios` tab for warnings such as frames that are never played.
