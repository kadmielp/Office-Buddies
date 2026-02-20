# Animation Studio (Tool)

This is a standalone Win98-style GUI tool for editing assistant animations.

## Location

- `tools/animation-studio/server.js`
- `tools/animation-studio/public/index.html`
- `tools/animation-studio/public/app.js`
- `tools/animation-studio/public/app.css`

## Run

From repo root:

```powershell
node tools/animation-studio/server.js
```

Then open:

- `http://127.0.0.1:4177`

You can override the port with:

```powershell
$env:ANIM_STUDIO_PORT=4300
node tools/animation-studio/server.js
```

## What it does

- Lists available assistants from `assets/agents/*`
- Loads `agent.js`, `map.png`, and `sounds-mp3.js`
- Shows a frame grid on top of `map.png` with zoom controls
- Lets you edit animations and frames:
  - add/remove/duplicate/reorder frames
  - multi-select frames and invert selected order
  - edit `duration`, `sound`, `exitBranch`, and `images`
  - pick sprite cells directly from the map
- Includes a dedicated assistant-specific `Sound Library` tab with per-sound play buttons
- Includes a looping animation preview that follows `exitBranch`
- Saves back to `assets/agents/<Agent>/agent.js`

## Quick usage

1. Start the server and open the app URL.
2. Choose an assistant and click `Load`.
3. Pick an animation from the left panel.
4. Select a frame in the frame list.
5. Click a cell in `Map Frame Picker`, then use:
   - `Replace Selected Image` to replace the first image in that frame, or
   - `Append Frame` / `Add` to create new frames.
6. Edit `Duration (ms)`, `Sound`, `Exit Branch`, and `Images`.
7. Click `Apply` to apply frame edits.
8. Click `Save agent.js` to persist to disk.

## Sound workflow

- `Frames` tab:
  - Use `Sound` dropdown on a frame.
  - Click `Play` next to the dropdown to test the frame sound.
- `Sound Library` tab:
  - Click a sound tile to play it.
  - Click `Use In Frame` to assign the selected sound to the current frame.
  - Click `Stop` to stop audio.
- `Animation Preview`:
  - Use Play/Stop toggle.
  - Use `Sound: Off/On` to include or mute frame sounds in preview playback.

## Undo

Undo is handled in the editor session (client-side history stack).

## Notes

- The tool rewrites `agent.js` from parsed data (formatted object output).
- Existing custom comments/formatting in `agent.js` are not preserved.
