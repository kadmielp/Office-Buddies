# buddy-hands

Office Buddies' native "hands" helper for Windows. It reads an app's UI Automation tree as a numbered, label-based list
and acts on controls by label: by UIA pattern first (no focus needed), and with the mouse or keyboard as a fallback.

The app runs it as `buddy-hands.exe --serve` from `src/main/computer-use/hands-client.ts`.

Build it with the C# compiler that ships with Windows (no SDK needed):

```bash
npm run build:hands
```

The build writes `resources\buddy-hands\buddy-hands.exe`, which Electron Forge packages. Shortcuts that delete, send or
confirm (`shift+delete`, `ctrl+enter`, `alt+s`, …) count as risky too.

```
buddy-hands windows
buddy-hands open Calculator                     # Start-menu names, folders, URLs, ms-settings: pages
buddy-hands show notepad                        # restore a minimized window without taking focus
buddy-hands see calculator
buddy-hands read notepad [--offset 4000]        # full text, page by page
buddy-hands click "Seven" in calculator
buddy-hands type "Search Wikipedia" "Clippy" submit in chrome
buddy-hands press "ctrl+s" in notepad
buddy-hands --serve        # JSON lines: {"id":1,"args":["see","notepad"],"allowRisky":false}
```

Risky labels (delete, send, buy, submit, …) are refused unless the caller passes `--allow-risky`. The app passes it
only after the user approves in the balloon. Password fields and secret-looking values are masked inside the helper.

The secret and risky regexes are adapted from [Atticus](https://github.com/SaarthurR/atticus-mac) (MIT). See
`docs/plans/computer-use.md` §9–10 for the test results.

To test the computer-use loop headless (real main-process code and model, no windows):

```bash
npx esbuild tools/buddy-hands/harness.ts --bundle --platform=node --external:electron --outfile=.harness.cjs
OFFICE_BUDDIES_USER_DATA=<a separate profile folder> npx electron .harness.cjs "open calculator and work out 7 times 6"
```

`HARNESS_DECIDE=deny` answers Allow cards with Deny.
