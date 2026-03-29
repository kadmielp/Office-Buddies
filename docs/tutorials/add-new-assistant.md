# Add a New Assistant: Animation Pack Tutorial

This guide walks through the full process for adding a brand-new assistant animation pack to Office Buddies.

It covers:

- the files you need
- where those files go
- how to register the assistant in the app
- how to add gallery copy and profile metadata
- how to test the result

Use this when you want to add a new animated assistant such as another classic Office-style character or a custom sprite-based buddy.

## What the app expects

An assistant is made of two parts:

1. An asset pack under `assets/agents/<AssistantName>/`
2. A code registration in the renderer and shared metadata files

At runtime, the app loads:

- `agent.js`
- `map.png`
- `sounds-mp3.js`

The app then registers that pack in [`src/renderer/agent-packs.ts`](../../src/renderer/agent-packs.ts).

Optional UI copy and persona metadata live in:

- [`src/renderer/features/assistant/AssistantGallery.tsx`](../../src/renderer/features/assistant/AssistantGallery.tsx)
- [`src/shared/agent-profiles.ts`](../../src/shared/agent-profiles.ts)

## Before you start

Prepare these items first:

- An assistant name, for example `Tux` or `OfficeCat`
- A sprite sheet image named `map.png`
- An animation definition file named `agent.js`
- A sound mapping file named `sounds-mp3.js`
- Optionally `sounds-ogg.js` for editing/reference parity with existing packs

If you are building a pack from scratch, the easiest workflow is usually:

1. Copy an existing assistant folder.
2. Rename it.
3. Replace the sprite sheet and animation data.
4. Register the new assistant in TypeScript.

## Step 1: Copy an existing assistant folder

Start by duplicating a pack that is close to what you want.

Examples:

- Copy `Clippy` if you want a general-purpose assistant
- Copy `Rover` or `Rocky` if the proportions are closer to your new character
- Copy `F1` if your pack uses extra overlay/reference images for editing

From repo root, copy an existing folder under:

```text
assets/agents/
```

For example:

```text
assets/agents/Clippy
```

to:

```text
assets/agents/<AssistantName>
```

After copying, you should have something like:

```text
assets/agents/<AssistantName>/
  agent.js
  map.png
  sounds-mp3.js
  sounds-ogg.js
```

Notes:

- `sounds-ogg.js` is not currently imported by the main renderer, but some existing packs keep it alongside the MP3 mapping.
- Extra overlay/reference PNGs are optional and mainly useful for authoring or documentation.

## Step 2: Replace the sprite sheet

Put your sprite sheet in:

```text
assets/agents/<AssistantName>/map.png
```

This image contains all animation frames arranged on a grid.

Important:

- Keep frame dimensions consistent across the entire sheet.
- The frame size declared in `agent.js` must match the real frame cells in `map.png`.
- The animation system uses those dimensions to crop the correct frame from the sheet.

## Step 3: Edit `agent.js`

Open:

```text
assets/agents/<AssistantName>/agent.js
```

This file defines:

- `framesize`
- `animations`
- each animation's `frames`
- per-frame `duration`
- optional `sound`
- optional branching via `exitBranch` or `branching.branches`

The app expects the file to call:

```js
clippy.ready("<AssistantName>", { ... })
```

Inside that object, make sure these are correct:

- `framesize: [width, height]`
- `animations: { ... }`

Each animation is a named sequence, for example:

- `Default`
- `Greeting`
- `GetAttention`
- `Thinking`
- `Processing`
- `Congratulate`

You do not need to support every animation name used by other assistants, but the experience is better if you include at least a few common ones.

Recommended starter set:

- `Default`
- `Show`
- `Hide`
- `Greeting`
- `GetAttention`
- `Thinking`
- `Processing`

If your pack is missing a name that a feature tries to use, the UI may fall back awkwardly or simply have fewer animation choices.

## Step 4: Update sounds

Open:

```text
assets/agents/<AssistantName>/sounds-mp3.js
```

This file should call:

```js
clippy.soundsReady("<AssistantName>", { ... })
```

The object maps sound ids used in `agent.js` to real audio sources.

If your frames reference sounds like:

```js
sound: "1"
```

then `sounds-mp3.js` must provide a matching key.

If you do not want sounds yet, you can keep the mapping empty and remove `sound` fields from frames.

## Step 5: Validate the pack with Animation Studio

The safest way to edit and verify frame data is the built-in tool.

Start it from repo root:

```powershell
run-animation-studio.cmd
```

Or:

```powershell
node tools/animation-studio/server.js
```

Then open:

```text
http://127.0.0.1:4177
```

Use the tool to:

- load your assistant
- inspect the frame grid from `map.png`
- preview animations
- assign sounds
- edit `duration`
- edit `exitBranch`
- edit weighted branches
- save back to `agent.js`

See also:

- [Animation Studio Tutorial](./animation-studio.md)

## Step 6: Register the new assistant in `agent-packs.ts`

Open [`src/renderer/agent-packs.ts`](../../src/renderer/agent-packs.ts).

Add three imports near the top:

```ts
import myAgentScript from "../../assets/agents/<AssistantName>/agent.js?raw";
import mySoundScript from "../../assets/agents/<AssistantName>/sounds-mp3.js?raw";
import myMap from "../../assets/agents/<AssistantName>/map.png";
```

Then add a new entry to `RAW_AGENT_FILES`:

```ts
{
  name: "<AssistantName>",
  mapSrc: myMap,
  agentScript: myAgentScript,
  soundScript: mySoundScript,
},
```

This step is required. Without it, the app will not load the new assistant even if the files exist.

## Step 7: Add gallery copy

Open [`src/renderer/features/assistant/AssistantGallery.tsx`](../../src/renderer/features/assistant/AssistantGallery.tsx).

Add a new entry in `ASSISTANT_COPY`:

```ts
<AssistantName>: {
  displayName: "<Display Name>",
  speech: "Short intro line shown in the gallery.",
  description: "A short description of the assistant.",
},
```

This is optional, but recommended. Without it, the gallery will fall back to generic text.

If you want the assistant to appear in a specific position in the gallery, also add its name to `ASSISTANT_ORDER`.

If you skip that, it will still appear, but only after the hard-coded ordered entries.

## Step 8: Add profile metadata

Open [`src/shared/agent-profiles.ts`](../../src/shared/agent-profiles.ts).

Add a new profile entry:

```ts
<AssistantName>: {
  personality: "Helpful, curious, and concise. Keep answers practical.",
  appearance: "You appear as ...",
},
```

This is also optional, but recommended. It helps the assistant feel more consistent in prompt-driven behavior and character description.

If you do not add this, the app falls back to a generic helper profile.

## Step 9: Run the app and test the assistant

Start the app the normal way for your development setup and open the assistant gallery.

Check these things:

1. The assistant appears in the gallery.
2. The preview renders correctly.
3. The preview animation is not blank or misaligned.
4. Sounds play only when expected.
5. Applying the assistant updates the selected character.
6. Chat and buddy-action flows still animate normally.

Good test animations to verify:

- `Default`
- `Greeting`
- `GetAttention`
- `Thinking`
- `Processing`
- `Congratulate`

## Step 10: Fix common problems

### The assistant does not appear in the gallery

Check:

- the imports in `src/renderer/agent-packs.ts`
- the `RAW_AGENT_FILES` entry
- the assistant name matches exactly across `agent.js`, sounds, and registration

### The assistant appears, but the preview is blank

Check:

- `map.png` exists in the expected folder
- `framesize` matches the real sprite grid
- `agent.js` contains valid animation data
- the selected preview animation actually has frames

### Frames are cropped incorrectly

Check:

- `framesize`
- sprite sheet cell size
- frame coordinates in `images`

### Sounds do not play

Check:

- frame `sound` ids match keys in `sounds-mp3.js`
- the sound map is registered for the same assistant name
- sound is enabled in app settings

### Animations stop too early or loop strangely

Check:

- `exitBranch`
- `branching.branches`
- frame indexes are valid for the current animation
- weights are greater than `0` when using weighted branches

## Recommended minimum checklist

If you want the shortest successful path, do this:

1. Copy an existing assistant folder.
2. Replace `map.png`.
3. Update `agent.js`.
4. Update `sounds-mp3.js`.
5. Register imports and `RAW_AGENT_FILES` in `src/renderer/agent-packs.ts`.
6. Add `ASSISTANT_COPY` in `AssistantGallery.tsx`.
7. Add `AGENT_PROFILES` entry in `agent-profiles.ts`.
8. Test in Animation Studio.
9. Test in the real app.

## Suggested workflow for clean results

Use this order when building a pack from scratch:

1. Get `map.png` working with the right `framesize`.
2. Build a small `Default` animation first.
3. Add `Greeting` and `GetAttention`.
4. Add `Thinking` and `Processing`.
5. Add sounds after motion is stable.
6. Add gallery/profile metadata last.

This keeps debugging simpler because you validate rendering before sound and metadata.

## Related files

- [`assets/agents`](../../assets/agents)
- [`src/renderer/agent-packs.ts`](../../src/renderer/agent-packs.ts)
- [`src/renderer/features/assistant/AssistantGallery.tsx`](../../src/renderer/features/assistant/AssistantGallery.tsx)
- [`src/shared/agent-profiles.ts`](../../src/shared/agent-profiles.ts)
- [`docs/tutorials/animation-studio.md`](./animation-studio.md)
- [`tools/animation-studio/README.md`](../../tools/animation-studio/README.md)
