# Plan: computer use, voice and TTS for Office Buddies

Status: proposal · Branch: `plan/computer-use` · Reference studied: `G:\Vibing\atticus-mac` (Atticus 1.x, MIT)

Goal: let a buddy *do things on the PC* (click, type, move windows, read the screen), *hear* the user (local
speech-to-text) and *talk back* (TTS), while keeping what makes Office Buddies itself: the animated character, the
speech balloon with bullet options, the Messenger-style chat window, the themes, and local-first models.

---

## 1. How Atticus does it

Atticus is two programs plus a borrowed agent loop.

| Layer | File | Role |
|---|---|---|
| Native shell | `Atticus.swift` (~630 KB) | Hotkey, mic, speech-to-text, overlay box (WKWebView), drawing overlay, mini screen, and **`Hands`**: the native click/type/scroll engine, run as `Atticus --hands …` subcommands. |
| Brain | `atticus.py` (~530 KB) | Instant commands, learned-shortcut replay, memory, system prompt, safety gate, and helper CLIs (`--hands`, `--look`, `--window`, `--place`, `--pick`, `--show`, `--type`, …). |
| Agent loop | Claude Code CLI | Not written by Atticus. It runs `claude -p --input-format stream-json --output-format stream-json` with tools limited to `Bash,Read,WebSearch,WebFetch`. The model drives the Mac by calling the helper CLIs through Bash. Devin and Pi are alternative clients. |

### 1.1 The request pipeline

1. **Hotkey down** (`⌃⌥Space`): the mic opens and a `claude -p` process is **pre-started** so its ~1 s startup overlaps
   with the user talking (`start_claude`).
2. **Live transcript** streams into the box. Instant commands can run mid-sentence. AI reasoning may start on a pause,
   but **no tool runs until the final transcript is confirmed** (`wait_commit`).
3. **Fast path, no AI** (`fast()`): regex commands (open/close app, snap window left/right, scroll, press key,
   "click <label>") and **learned shortcuts** are replayed directly. Cost: $0, about 100 ms.
4. **AI path**: request plus context (front app, window title, selection, memory rules, about-me facts) goes to the
   model with a terse system prompt (under 10,000 characters, enforced by tests).
5. The model calls helpers. Each prints **changed state** so the model verifies instead of assuming
   ("read → check → act → verify; a click isn't success").
6. Output is a line protocol relayed to the UI: `· note`, `▸ step`, `✓ answer`, `? question`, `@ point`,
   `▣ window target`. Reply tags such as `[shortcut X]`, `[workflow …]`, `[replay …]`, `[tip …]` and `[point N X Y]`
   trigger learning and UI.

### 1.2 Hands (computer use)

- **See**: walks the macOS Accessibility (AX) tree of the target app's window into a numbered list:
  `[12] Button "Save" (at 840,512)`, plus focused element, scroll position and visible text, capped and masked. The model
  acts **by label**, not by pixel. Screenshots (`--look`) are a fallback for things the tree lacks; they are labelled per
  display and resized to 1280 px.
- **Act**: `click <label> [near <label>] [double] [right]`, `type <field> "text" [submit]`, `type-after "<anchor>"`,
  `press "cmd+t"`, `scroll`, `scroll-to "text"`, `menu "File > Export"`, `drag`, `wait`. It prefers AX actions
  (`AXPress`) and falls back to synthetic mouse and keyboard events.
- **Works behind the user**: events are posted **to the target process** (`CGEvent.postToPid`, focus without raise),
  so the user's pointer, front app and Space stay put. A per-task state file pins the window it works in.
- **Verifies**: a state signature (tree digest) and a pixel fingerprint around the click confirm that something changed.
  If nothing can be confirmed, it says "I couldn't confirm the result" and doesn't learn the shortcut.
- **Locks**: a `screen.lock` lease keeps two agents from fighting over the real pointer.

### 1.3 Safety

- A **PreToolUse hook** (`atticus.py --gate`) sees every tool call. Native hands can only go through the wrapper.
  Risky commands wait for the user.
- **Risky labels** (`buy|pay|send|delete|submit|publish|sign out|transfer|…`, plus generic "OK/Continue" inside a risky
  dialog) produce an **Allow card**: 60 s, default *no*, and "Always allow for this task".
- **Secret fields** (password, PIN, card, OTP, token, …) are masked in what the model sees. Typing into one requires the
  user's own words to ask for it.
- Hard denylist (`rm`, `sudo`, disk tools, shutdown). `trash` instead of `rm`. Background agents run in Claude Code's
  sandbox. An ask log records every exact command.
- Screen and tool text is treated as **data, never instructions** (stated in the system prompt).

### 1.4 Learning ("learns your shortcuts")

- After a **verified** success, if every command is replayable (opens, window moves, hands by *label* or menu path, no
  coordinates, nothing risky), the commands are saved under the normalized request (`skills`). Next time they replay
  with **no AI**.
- Generalization: the same words in another order, or the same task with another app ("put Notes left" → "put Mail
  left") by swapping the app name.
- "When I say *focus mode*, close Slack and open my to-do list" saves a named shortcut. A failed replay prompts a redo
  and `[unlearn]`.
- Memory: `memory.md` (one rule per line, sent with every ask) and `me.json` (categorized facts, attached only when
  relevant). "Learn unasked" saves lasting facts the user states.

### 1.5 Voice

- **STT**: Apple `SpeechAnalyzer`/`SpeechTranscriber` on device, streaming with volatile results. **whisper.cpp** is an
  option for other languages (Turbo, Large v3 and Small models, downloaded into `~/.config/atticus/whisper`).
- **Wake word**: continuous on-device `SFSpeechRecognizer` matching "Atticus". It is off by default, and the box stays up
  for follow-ups.
- **Dictation** (hold fn): it types the transcript into any field. An optional single AI cleanup pass removes fillers and
  handles "scratch that". It borrows the clipboard only when a field needs a paste, then restores it.
- **TTS**: `/usr/bin/say` with the best installed Premium/Enhanced voice for the answer's language. The hotkey stops
  speech.

### 1.6 Background agents and extras

- Big jobs go to a **separate `claude -p --resume` per task**, in its own folder, sandboxed, with its own hands state. A
  chip shows live steps and a **mini screen** of the window it works in (ScreenCaptureKit, never sent to the AI). Talking
  to it by name steers it.
- **Show me where / Draw**: a transparent click-through overlay draws rings, arrows and labels at AX targets. The reply
  tag `[point N X Y]` puts a ring there.
- **Watch** and **Routines**: polling with no AI, and scheduled agent runs. AI is used only to set them up and to act at
  the end.

> The key design idea to copy: **the AI never touches the OS directly**. It calls a small, label-based, verified,
> gated helper. Everything that can be done without AI (instant commands, replays, watches) is.

---

## 2. What Office Buddies already has

| Need | Already in Office Buddies |
|---|---|
| A character with moods | `Clippy.tsx` + agent packs: `Hearing`, `Thinking`, `Processing`, `Searching`, `Writing`, `GestureLeft/Right/Up/Down`, `LookX`, `GetAttention`, `Congratulate` |
| Balloon with bullet choices | `AgentQueueCard` question card (bullet options) and **permission card (Allow / Deny)** |
| Gated tool approval over HTTP | `proactive-server.ts` on `127.0.0.1` with a token, `/agent-event`, and `agent-events.ts` holding the hook open until answered |
| Coding-agent integration | `agent-hooks.ts` installs Claude Code and Codex hooks. `agents/*` adapters |
| Global shortcuts and foreground info | `shortcuts.ts` (Win+F2…F5, SendKeys copy), `helpers/foreground-app.ts` (PowerShell + user32) |
| Models | `remote-ai.ts`: OpenAI-compatible streaming (OpenAI, local llama-server, Hermes/OpenClaw), Gemini, Maritaca. `model-manager.ts` downloads models. `scripts/prepare-llama-runtimes.ps1` bundles CPU/Vulkan/CUDA runtimes |
| Persistence | `chats.ts`, `state.ts` (electron-store, safeStorage for keys) |
| Knowledge and tools | `knowledge-runtime.ts`, MCP client |

**Gaps:** no tool calling in the chat path, no input injection or UI tree reading, no screen capture, no mic or STT, no
TTS.

The reuse is large: the **Allow card and the "pick one" card already exist** and look like the classic balloon (see the
memory note *classic balloon UX*). The gated-hook pattern Atticus built is the same one Office Buddies already uses for
Claude Code and Codex.

---

## 3. Mapping macOS to Windows and Electron

| Atticus (macOS) | Office Buddies (Windows first) |
|---|---|
| AX tree (`AXUIElement`) | **UI Automation** (UIA) tree: `Name`, `ControlType`, `BoundingRectangle`, `AutomationId`, `IsPassword` |
| `AXPress` / AX value set | UIA patterns: `Invoke`, `Toggle`, `SelectionItem`, `ExpandCollapse`, `Value.SetValue`, `Scroll`, `ScrollItem` (these work **without focus**, the Windows equivalent of "work behind") |
| `CGEvent.postToPid` | `SendInput`, which needs the window in front. Raise, act, then restore focus and z-order (Atticus `keepOrder`/`restoreFocus`). Last resort: `PostMessage` WM_* for classic Win32 controls |
| Menus by path | UIA `MenuBar` → `ExpandCollapse` → `Invoke`. Ribbon apps expose UIA as well |
| `--place` window snap | `SetWindowPos` + `MonitorFromWindow`/`EnumDisplayMonitors`. Win+Arrow as a fallback |
| ScreenCaptureKit `--look`, mini screen | Electron `desktopCapturer` (screens and windows) or `Windows.Graphics.Capture` / `PrintWindow` in the helper for covered windows |
| SpeechAnalyzer | **whisper.cpp** (bundled like llama.cpp). Fallback: `Windows.Media.SpeechRecognition` |
| `say` | Web Speech `speechSynthesis` (Windows OneCore/SAPI voices). Optional local neural TTS (Piper/Kokoro) |
| Claude Code `--gate` hook | The existing `/agent-event` permission flow, plus an in-process gate for the built-in loop |
| `mdfind` | Windows Search (`SystemIndex` via OLE DB/ADO in PowerShell) or a plain glob |
| AppleScript / `open` | `Start-Process`, `shell:AppsFolder`, URI schemes, `explorer.exe` |

---

## 4. Proposed architecture

```
 ┌──────────── renderer ─────────────┐        ┌───────────────── main ──────────────────────────┐
 │ Clippy.tsx  balloon / steps / mic │◀─IPC──▶│ computer-use/                                   │
 │ AgentQueueCard (Allow, Pick)      │        │   router.ts     fast → replay → loop → agent    │
 │ Chat window (full transcript)     │        │   loop.ts       tool-calling over remote-ai     │
 │ voice/capture.ts (AudioWorklet)   │        │   tools.ts      schemas + dispatch              │
 │ voice/speak.ts (speechSynthesis)  │        │   gate.ts       risky/secret/denylist → Allow   │
 │ overlay window (point / draw)     │        │   learn.ts      skills.json, memory.md          │
 └───────────────────────────────────┘        │   fast.ts       instant commands                │
                                              │ hands-client.ts ── stdio JSON-lines ──┐         │
                                              │ voice/stt.ts   ── whisper-server ──┐  │         │
                                              │ agents/background.ts (claude/codex)│  │         │
                                              └────────────────────────────────────┼──┼─────────┘
                                                        resources/whisper/ ◀───────┘  ▼
                                                                            resources/buddy-hands.exe
```

### 4.1 `buddy-hands.exe`: the native helper

A small **C#** executable in `resources/`, signed with the existing
Trusted Signing setup. The P0 spike builds it with the C# compiler that ships in Windows (.NET Framework 4.8,
`csc.exe`): 27 KB, no SDK and no runtime to install. NativeAOT (.NET 8) is only worth it if the code needs a newer C#.
It plays the role of Atticus's Swift `Hands` enum.

- **Persistent mode** (`buddy-hands.exe --serve`): JSON-lines over stdio, one request per line. This avoids the cost of
  starting a new process (and PowerShell UIA) on every call.
- **CLI mode** (`buddy-hands.exe click "Save"`): the same verbs, so background agents (Claude Code, Codex) can call it
  through Bash.
- Verbs (the same vocabulary as Atticus, so its prompts port over):
  `see [app]`, `click <label> [near <label>] [double|right]`, `type <field> "<text>" [submit|append]`,
  `type-after "<anchor>" "<text>"`, `press "ctrl+t" [times]`, `scroll up|down [pages|all] [target]`,
  `scroll-to "<text>"`, `menu "<File > Export>"`, `drag <from> <to>`, `wait [s]`, `windows` (list),
  `place <proc> left|right|full|center <monitor>`, `capture <hwnd|screen> <path>`, `focus <hwnd>`.
- Each action returns `{ok, changed, map}`, with the new numbered tree after the action. That is the "returns changed
  state" contract.
- It masks secrets (`IsPassword`, the Atticus `secretPattern` regex, card and OTP number patterns) **inside the helper**,
  so raw values never reach the model.
- It reports `risky: true` when the resolved label matches the risk regex, so the gate decides before acting
  (Atticus's two-phase `hands_action(args, authorize)`).
- Why not PowerShell UIA or a Node FFI? PowerShell takes 300–800 ms per call. Driving UIA COM through FFI from Node is
  fragile, and nut.js is no longer free. A tiny helper is fast, testable on its own and replaceable per OS later.

### 4.2 Two engines, one router

**Router order** (mirrors Atticus, cheapest first):

1. **Instant command** (`fast.ts`): open/close app, snap window, scroll, press key, "click <exact label>", play/pause,
   volume. No AI.
2. **Learned shortcut replay** (`learn.ts`): normalized words → saved tool calls → replay and verify. No AI.
3. **Buddy loop** (`loop.ts`, foreground): a tool-calling loop over the **current provider**. Small tool set (see,
   click, type, press, scroll, menu, place, open, search the web, read a page, pick, remember), at most about 12 steps,
   with each step shown in the balloon.
4. **Background agent** (`agents/background.ts`): for long or multi-app jobs. It spawns `claude -p --input-format
   stream-json --output-format stream-json` (or `codex exec --json`) with a buddy system prompt, Bash restricted to
   `buddy-hands.exe` and safe readers, and a **PreToolUse hook that posts to the existing `/agent-event`**. Permissions
   then appear in the same balloon with no new UI. It shows as an `AgentQueueItem` with a new source `buddy`.

Changes in `remote-ai.ts`: add `tools` and `tool_choice` to `streamOpenAiCompatible`/`promptOpenAiCompatible`, and parse
`tool_calls` deltas. Add Gemini `functionDeclarations`. The local llama-server needs `--jinja` for tool calls. Qwen3 4B
handles a small tool set, while Gemma 3 1B should run without computer use and show a "this model can't use hands"
message, as Atticus warns about small local models.

### 4.3 Safety gate (`gate.ts`)

These are ported from Atticus nearly verbatim.

- Risky label regex, plus generic confirm buttons inside risky dialogs → **permission balloon** (`Allow`, `Deny`,
  `Always allow for this task`). Times out to Deny after 60 s.
- Secret fields: never typed into unless the user's request explicitly asks to type that kind of secret. Values are
  masked in every map.
- Command denylist for shell-capable agents: `del /s`, `rd /s`, `Remove-Item -Recurse`, `format`, `diskpart`,
  `reg delete`, `bcdedit`, `shutdown`, `cipher /w`, `vssadmin`, and anything elevated (`runas`, `Start-Process -Verb
  RunAs`). Delete means the Recycle Bin.
- UIPI: the helper runs unelevated and cannot drive admin windows. Say so plainly instead of trying to work around it.
- **Esc or the hotkey cancels** at any moment: a stop flag in the helper, and the loop aborts.
- An action log (`%APPDATA%\Office Buddies\actions.jsonl`) records every exact action. Screenshots are kept in memory or
  temp files and deleted after the ask.
- The system prompt states that screen and tool text is data, never instructions.

### 4.4 Learning and memory (`learn.ts`)

- `skills.json`: `{ "<normalized words>": { calls: [...label-based tool calls], reply, at, asked? } }`. Saved only
  after a verified success with every call replayable (no coordinates, no risky labels, no "make new" content).
- App-swap generalization and word-order tolerance, as in Atticus `like()`.
- "When I say X, do Y" → named shortcut. A failed replay → redo with the AI → `[unlearn]`.
- `memory.md` rules and an `about-me` store, injected compactly. **Settings → Hands** lists learned shortcuts with
  delete buttons.
- The balloon announces new skills in character: *"Got it! Next time just say 'focus mode'."* with the `Congratulate`
  animation.

---

## 5. Keeping the Office Buddies essence

The buddy **is** the box. Nothing replaces the balloon or the chat window; computer use lives inside them.

| Moment | What the user sees |
|---|---|
| Hotkey or mic button pressed | Buddy plays `Hearing` (in most packs; fall back to `LookUp` for Merlin, Lifey and Rover). The live transcript fills the balloon. |
| Thinking | `Thinking` / `Processing` |
| Each step | A short `▸` line in the balloon ("Opening Settings", "Clicking *Night light*"). The animation follows the tool: `see` → `LookX` toward the target window, `type` → `Writing`, web → `Searching`, `place` → `GestureLeft/Right` |
| Show me where | **The buddy points at it**: the main window glides near the target and plays the `Gesture*` animation aimed at the element, while a ring appears on a click-through overlay window. This is the modern "It looks like you're trying to…", and nothing like it exists in Atticus. |
| Needs approval | The existing **permission balloon** with bullets: *Allow*, *Deny*, *Always allow for this task* |
| Ambiguous ("which file?") | The existing **question balloon** with bullet options (the Atticus `--pick`) |
| Done | One-line answer in the balloon. `Congratulate` on a verified task. "Open in chat" shows the full step log |
| Couldn't verify | `GetAttention` + "I did it but couldn't confirm the result." |
| Background job | A queue item with live steps. The finished card arrives through the existing agent queue |
| Speaks | If *Read answers aloud* is on, the balloon text is spoken in a **per-buddy voice preset** (pitch and rate, like the MS Agent era: Merlin low and slow, Peedy higher). The hotkey stops it |

Other ways in:

- **Chat window**: a "Let <Buddy> do it" toggle next to Send, so a chat message can use hands.
- **Right-click Buddy menu**: "Do it for me…" next to Define and Summarize.
- **Settings → new "Hands & Voice" tab**: enable computer use (off by default), safe mode (on), hotkey, push-to-talk or
  toggle, STT model, TTS voice per buddy, read aloud, learned shortcuts, action log.

---

## 6. Voice in and voice out

### 6.1 Capture
Renderer `getUserMedia` → `AudioWorklet` → 16 kHz mono Int16 → IPC chunks to main. The mic opens only while the hotkey
is held or toggled (show an indicator in the balloon). Device choice goes in Settings.

### 6.2 Speech-to-text
- **whisper.cpp `whisper-server`**, bundled by extending `scripts/prepare-llama-runtimes.ps1` (the same CPU, Vulkan and
  CUDA variants and GPU-to-CPU fallback already built for llama.cpp).
- Models are downloaded on demand through `model-manager.ts`: `base` (about 140 MB, default for speed), `small`, and
  `large-v3-turbo` (about 1.6 GB, most accurate). Automatic language detection fits the app's "reply in the user's
  language" rule.
- Streaming feel: send rolling windows every ~700 ms for **partial** text, then one **final** pass on release. Atticus
  rule: **tools wait for the final transcript**, though local model warm-up (`ensureLocalModel`) starts on key-down.
- Fallback with no download: `Windows.Media.SpeechRecognition` through a WinRT call in the helper. Lower quality, but
  instant.

### 6.3 Text-to-speech
- Tier 1: `speechSynthesis` in the renderer. No dependencies; uses installed Windows voices (including the natural
  OneCore voices). Per-buddy `pitch` and `rate` presets go in `agent-packs.ts`.
- Tier 2 (optional download): **Piper** or **Kokoro** ONNX through a small sidecar for natural local voices.
- Respect `disableSound`. Never speak while dictating. Stop on hotkey or Esc.

### 6.4 Later
- **Dictation anywhere** (hold a key → type into the focused field through `buddy-hands type`, with a clipboard
  borrow-and-restore fallback).
- **Wake word** (say the buddy's name): openWakeWord ONNX or whisper-tiny on VAD segments. Off by default.

---

## 7. Phased roadmap

| Phase | Scope | Main files | Done when |
|---|---|---|---|
| **P0 spike** (2–3 d) | `buddy-hands see/click/type` against Notepad, Settings, Explorer, Chrome, VS Code. Measure UIA latency and coverage | `tools/buddy-hands/` (C#) | `see` < 300 ms on typical windows. Click-by-label works in 4 of 5 apps |
| **P1 Hands + gate** | Persistent helper, `hands-client.ts`, `gate.ts`, tool calling in `remote-ai.ts`, `loop.ts`, balloon step lines, permission and pick balloons wired in, typed asks from the chat and balloon | `src/main/computer-use/*`, `remote-ai.ts`, `Clippy.tsx`, `AgentQueueCard.tsx` | "Turn on night light", "put Notepad on the left" and "rename this file to X" work through OpenAI and Qwen3-4B local. Risky clicks always ask |
| **P2 Fast + learning** | `fast.ts` instant commands, `learn.ts` replay, memory, Settings list | `computer-use/fast.ts`, `learn.ts`, `SettingsHands.tsx` | A second identical ask replays in < 500 ms with no model call |
| **P3 Voice** | Hotkey push-to-talk, capture, whisper-server, partial and final transcripts, TTS with buddy presets | `voice/*`, `shortcuts.ts`, `prepare-llama-runtimes.ps1`, `model-manager.ts` | Hold the hotkey, speak and release: the task runs and the answer is spoken |
| **P4 Point and look** | Overlay window, buddy glides and gestures, `capture` for vision models | `windows.ts` (overlay), `Clippy.tsx` | "Where do I change the display scale?" makes the buddy point at the right control |
| **P5 Background agents** | `claude -p` / `codex exec` runner, hook to `/agent-event`, queue chips, steering by name, mini screen through `desktopCapturer` | `agents/background.ts`, `AgentQueueCard.tsx` | "Find me three USB-C hubs under $30" runs while the user keeps working, and the result card arrives |
| **P6 Extras** | Dictation, wake word, watch (no-AI polling), routines | — | Optional |

Every phase ships behind **Settings → Hands & Voice → Enable** (off by default), on Windows only at first. macOS and
Linux builds hide the tab until a per-OS helper exists. A macOS helper could reuse Atticus's AX approach under its MIT
license, with attribution.

---

## 8. Risks and open questions

- **Small local models and tools**: tool use is unreliable below about 4B parameters. Gate hands by model capability
  and suggest a remote provider or Qwen3-4B or larger.
- **UIA coverage**: Chromium and Electron apps expose UIA, but sometimes only after an accessibility client connects.
  Games and canvas apps expose nothing, so they need screenshots and coordinates (vision model, P4).
- **Foreground stealing**: `SendInput` needs focus. Prefer patterns, and when raising is unavoidable, restore focus and
  tell the user ("I'll borrow the window for a second").
- **Elevated windows (UIPI)** can't be driven by the helper. Say so plainly.
- **Antivirus heuristics**: an unsigned exe that injects input may be flagged. Sign it with the existing Trusted
  Signing setup.
- **Hotkey collisions**: `Ctrl+Alt+Space` is the default, and it can be changed in Settings.
- **Licensing**: Atticus and Plip are MIT. Credit them in `LICENSE`/README if prompt text, regexes or algorithms are
  adapted.
- **Prior art**: [Atticus for Windows](https://github.com/FindlayHi/atticus-windows) by FindlayHi is a Windows port and
  should be reviewed before P0 to borrow its Windows hands approach.

---

## 9. P0 spike results (2026-11-08)

Code: `tools/buddy-hands/BuddyHands.cs` (about 600 lines). Build: `tools/buddy-hands/build.cmd`. Output: `bin/buddy-hands.exe`
(27 KB). Verbs implemented: `see`, `click`, `type`, `press`, `windows`, and `--serve` (JSON lines).

| App | Controls | `see` time (warm) | Act by label | Notes |
|---|---|---|---|---|
| Calculator (UWP) | 37 | 213 ms | ✅ 7 × 6 = **42** through `Invoke` while **in the background** (the front window stayed Claude) | Every button has a clean label ("Seven", "Multiply by") |
| Notepad (Win11) | 21 | ~440 ms | ✅ `type` through `ValuePattern`, **no focus needed**, Unicode (`olá, ação ✓`) exact. Opening the `File` menu works through `ExpandCollapse` | Status bar text such as "39 characters" makes a good verification signal |
| File Explorer | 154 | 488 ms | ✅ `Close` | Breadcrumbs, address bar and search are all labelled |
| Chrome page (Wikipedia) | 50–67 | ~520 ms | ✅ clicking the link "Search", then `type "Search Wikipedia" "Clippy" submit`, reached the Office Assistant page | Typing with `submit` uses keys, so Chrome **was raised** |
| Office Buddies buddy window | 0 | 209 ms | – | Transparent window with nothing to act on; exclude our own windows from targets |

Safety: `click Delete` in Notepad's Edit menu was **refused** (`RISKY: click "Delete" needs the user's Allow`), and the
action ran only with `--allow-risky`. Secret masking and password-field refusal are implemented but haven't been tested
against a real login form.

Latency: a **cold** CLI call adds 350–500 ms to start the CLR and UIA (Calculator 729 ms, Chrome 1061 ms). In
`--serve`, the second call takes the bare walk time. **The app must keep one `--serve` process alive**, and background
agents can use the CLI.

What the spike found (feeding into P1):

1. **UIA patterns really do work behind the user**: Invoke, Toggle, SelectionItem, ExpandCollapse and Value. Only key
   input (`press`, `submit`, and documents without ValuePattern) needs the window raised. Prefer patterns; when a key is
   needed, raise and then restore the previous foreground window (not done in the spike).
2. **Chromium turns on page accessibility lazily.** The first 1–3 reads of a new Chrome window returned only the browser
   frame (14 controls), and the page appeared about 2 s later. Fix: when a Chromium window shows a `Document` with no
   children, wait and retry once inside `see`.
3. **Minimized windows** report coordinates around -32000 with no page content. `see` should say "minimized" and
   offer to restore it, instead of listing controls the user can't see.
4. **Verification needs to wait for things to settle.** `After()` returns on the *first* change. For navigation, it
   saw the old page title. Port Atticus's `settled` digest (wait until two reads in a row match, up to about 2 s).
5. **Labels from Windows apps are good.** Most controls have useful names, and keyboard hints come for free ("Bold
   (Ctrl+B)"). Exact match, then automation id, then substring ranking was enough. Duplicate labels return a list with
   ids.
6. The spike reads only what's on screen (offscreen controls are skipped): 50–150 controls for typical windows, which
   keeps the map short enough for small models. Long documents still need a paged text reader (Atticus `--window`)
   in P1.
7. Unexplained once: on the very first run, Calculator closed after the first `click Seven`. It didn't happen again in
   about 10 later runs. Keep an eye out for it in P1.
8. `cua-driver` (trycua's Cua Driver) runs on this machine. Atticus credits it for background key input, so it could be
   compared as an alternative backend.

P0 verdict: **go**. `see` is under 300 ms for simple apps and about 500 ms for browsers and Explorer (warm). Acting by
label worked in 4 of 4 testable apps.

## 10. Phase 1 results (2026-11-08)

Shipped on `plan/computer-use` (uncommitted). It's off by default under **Settings → Advanced → Computer use
(preview)**, Windows only.

**How it fits together**

- `resources/buddy-hands/buddy-hands.exe` is built with `npm run build:hands` and packaged through `forge.config.ts`
  `extraResource`.
- `src/main/computer-use/hands-client.ts` keeps one `--serve` process running, sends one request at a time, restarts
  after a 30 s timeout, and tells the helper Office Buddies' own pid so its windows are never a target.
- `src/main/computer-use/tools.ts` defines nine tools: `list_windows`, `open`, `see`, `read`, `click`, `type`, `press`,
  `show_window` and `ask_user`. A risky action is refused by the helper first. The **existing permission balloon**
  (`requestInAppDecision` in `agent-events.ts`) asks the user, and the action runs again with `allowRisky` only after
  Allow. `ask_user` uses the existing **bullet question card**.
- `src/main/computer-use/loop.ts` is the tool loop: up to 15 steps, the Atticus-style prompt, skipping the rest of a
  batch after a failed step, and a warning when the same call fails twice. It streams through the **chat's existing
  protocol**. Each step is an italic `▸` line with an animation keyword (`[Searching]`, `[Writing]`, `[Processing]`,
  `[Alert]`), so the buddy animates per step. Abort stops the helper.
- `remote-ai.ts` gained `chatWithTools()` for the OpenAI-compatible providers (Local, OpenAI, Maritaca, OpenClaw,
  Hermes). For local models it sends `parallel_tool_calls: false` and `enable_thinking: false`, and llama-server now
  runs with `--jinja`.
- In the renderer, the chat window and the mini chat pass `hands: settings.handsEnabled`. The buddy's own requests
  take over the balloon even while the mini chat is open, and they also show **inside the chat window**, because the
  chat is a child window that always sits above the buddy's balloon.
- Dev-only additions: `OFFICE_BUDDIES_USER_DATA` runs a second copy next to an installed one, and
  `tools/buddy-hands/harness.ts` runs a headless loop test (real main-process code, helper and model, no windows).

**Tested with Qwen3 4B (local, Vulkan)**

| Task | Result |
|---|---|
| "Open Calculator and work out 7 times 6 using its buttons" | Opened, read and clicked by label, about 2 s per step, 28 s total. The tools all worked, but the model pressed 7 6 × 7 = and honestly reported **532**. That's a planning error from the small model |
| Type a shopping list in Notepad, then Edit → Delete (Deny) | Typed, then the **Allow card** appeared; Deny led to "not allowed", and the model stopped |
| The same task from the **real chat window** | Steps streamed into the transcript, the Allow card showed in the chat and the balloon, Deny stopped it, and the status went back to Ready |
| Select all, then delete | The model tried `ctrl+shift+delete` and **got around the menu gate**. Fixed: delete, send and confirm shortcuts are now risky too |

**Fixed during Phase 1** (each found by a real run): opening apps by Start-menu name (`Calculator`, `Paint` through
`shell:AppsFolder`), Store apps stuck on their splash screen until activated (`open`/`show` now wait for content and
bring the window forward once), an empty Calculator frame left behind and picked as the target (the helper now prefers
the window with content), a bare `7` read as the control id `[7]` (only `[7]` is an id now, and digits and symbols
fall back to words such as "Seven" and "Multiply by"), `type "Edit"` matching the Edit *menu* (typing now resolves only
to fields), and Qwen3's thinking mode making each step take 20–40 s.

**Still open**

- Model quality is the limit with 4B. Qwen3 4B runs the tools well but plans badly at times (wrong key order, opening
  a second copy instead of using the named window; `open` now lists the windows already open to help with that).
  Recommend OpenAI or a 7B+ local model for real use; this hasn't been tested with OpenAI yet.
- No step lines in the buddy **balloon** itself when the chat window is closed: the mini chat shows them, but there is
  no standalone "working…" balloon yet.
- Not implemented yet: "Always allow for this task", the action log file, Gemini function calling, and the
  instant commands and learned shortcuts (Phase 2).

## 11. Next steps (Phase 2)

1. Instant commands with no AI (`fast.ts`): open, close, snap, scroll, press, and "click <exact label>".
2. Learned shortcuts (`learn.ts`): save verified label-based runs and replay them with no model call. Add a Settings
   list.
3. An action log (`actions.jsonl`) and "Always allow for this task" on the Allow card.
4. A test pass with OpenAI (`gpt-4.1-mini` class) and a 7B+ local model, then compare success rates on 10 fixed tasks
   using `harness.ts`.

## 12. Voice input, part 1 (2026-11-09)

Shipped on `plan/computer-use`. It's off by default under **Settings → Advanced → Voice input (preview)**, Windows only.

- **Runtime:** whisper.cpp `b5454`, **CPU build only** (`npm run prepare:whisper` → `resources/whisper`, packaged
  through `extraResource`, checksum pinned). The CUDA build is a 685 MB download, so GPU support is a follow-up that
  could share llama.cpp's CUDA DLLs.
- **Model:** `ggml-base.bin` (148 MB, multilingual). The app downloads it into its data folder, checks the SHA-256, and
  retries on connection timeouts. The existing model manager couldn't be reused, because it rejects any download that
  isn't in its GGUF list.
- **Server:** `src/main/voice/stt.ts` starts `whisper-server` on first use and keeps it running (`-l auto -nt -bs 1
  -bo 1`, half the CPU threads, at most 8). It's warmed up when a mic button appears. Whisper's no-speech markers and
  "- " speaker-turn markers are removed from the text.
- **Capture:** `src/renderer/voice/recorder.ts` uses `getUserMedia`, a 16 kHz `AudioContext` and an AudioWorklet, and
  sends 16-bit PCM over IPC. Only one recording runs at a time, with a 60 s limit. Silent recordings are dropped
  (whisper invents text on silence). Chromium's echo cancellation and noise suppression are off, since they distorted
  the speech.
- **UI:** a mic button in the chat window and in the mini chat (`useVoiceInput` and `MicButton`).
  - Click to record, then click or press Enter to stop. Esc discards the recording.
  - While it listens, the buddy plays **Hearing**: Clippy puts on headphones. Packs without that animation look up
    instead.
  - The text lands in the message box for review; nothing is sent automatically.
  - Errors show in one line: model missing, microphone blocked, no microphone.
  - Settings shows the model status with a Download button, plus a microphone picker.

**Tested:** real clips were played through Chromium's fake microphone, so the whole chain ran: button, capture,
worklet, IPC, whisper, text box.

| Input | Result in the text box |
|---|---|
| English (Windows TTS) "Open the calculator and multiply seven by six." | "Open the calculator and multiply 7 by 6." (chat window and mini chat) |
| Portuguese (Lingua Libre words) "obrigado, você, informação, pão de queijo, ação" | "Obrigado. Você? Informação. Tanto caixa. Ação. Obrigado." (accents intact; "pão de queijo" is a hard isolated phrase for `base`) |

Transcription takes about 1.4–1.6 s for 2–6 s of speech on the CPU. Also checked: the first click right after launch,
Esc discard, the missing-model message, the Settings section, and the model download with checksum.

**Bugs the tests found, fixed:** the mic was disabled until the chat model loaded; a click while the mic was still
opening was read as another start (there is now a `starting` state); and the very first status load could falsely
report the runtime as missing.

**Global shortcut (added):** **Ctrl+Alt+B** works from any app (it's configurable in Settings, and Ctrl+Alt+Space was
avoided because Claude Code uses it). Press it to start listening and press it again to stop. If the chat window is open,
it uses that window's microphone; otherwise it opens the mini chat. Taken or invalid shortcuts show an error. The buddy's
sounds are muted while the microphone is open. Tested with real global key presses in both cases.

**Not yet:** true hold-to-talk (Electron can't detect the key being released), live partial text, the wake word, dictation into other apps, TTS, and the
small and large-v3-turbo models. A test with a real voice is still needed: the user's own microphone, not the fake
device.

