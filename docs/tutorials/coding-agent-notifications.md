# Coding Agent Notifications (Claude Code and Codex)

Office Buddies can keep an eye on your coding agents and tell you when one needs you. Instead of checking terminal tabs, your buddy pops up a speech balloon when an agent:

- is waiting for your input or a permission decision,
- asks a multiple-choice question (you can answer it right in the balloon), or
- has finished its work.

Supported agents: **Claude Code** and **Codex**. Any other tool can join through the [custom agent protocol](#5-custom-agents-any-tool).

---

## 1. How It Works

Each agent supports *hooks*: small actions it runs at certain moments. Office Buddies installs a hook into the agent's config file that sends the event to a listener inside Office Buddies.

| Agent | Config file | Events used |
|---|---|---|
| Claude Code | `~/.claude/settings.json` | Notifications that need input, `Stop` (finished), `AskUserQuestion` (multiple-choice questions), and `PermissionRequest` (Allow / Deny) |
| Codex | `~/.codex/hooks.json` | `request_user_input` (multiple-choice questions), `PermissionRequest` (Allow / Deny) and `Stop` (finished) |

Claude Code sends events straight to the listener. Codex can only run commands, so its hook runs a small PowerShell script that Office Buddies keeps in its app data folder (`%APPDATA%\Office Buddies\hooks\officebuddies-codex-hook.ps1`). The script forwards the event, tells the buddy where Codex runs (the Codex app, VS Code or a terminal), and passes your Allow / Deny back to Codex. It always exits cleanly, so if the buddy isn't running, Codex simply asks as usual.

**Security:**

- The listener only accepts connections from this computer (`127.0.0.1`).
- Every installed hook carries a private token generated on first run. Requests without it are rejected, so other programs can't post fake requests.
- Office Buddies only touches its own hook entries. Your other hooks are left alone, and a backup of the config file is saved next to it (`<file>.officebuddies.bak`) before each change.

---

## 2. Setup

1. Open **Settings > Agents** (the **Options** button in the chat window title bar, then the **Agents** tab).
2. Under **Listener**, turn on **Listen for agent and OpenClaw notifications**. The default port is `5050`.
3. In the **Claude Code** or **Codex** section, click **Install…**.
4. Review the change. Office Buddies shows a before/after view of the agent's config file. Click **Install** to apply it, or **Cancel**.
5. **Codex only:** Codex runs only hooks you have approved. Run `/hooks` in Codex (or use its hooks settings) and trust the Office Buddies hooks. Approval is remembered across chats and projects; Codex only asks again if a hook entry itself changes.
6. **Avoid double alerts (optional):**
   - **Claude:** keep **Hide Claude's own pop-ups (keep the taskbar badge)** ticked in the Claude Code section. Office Buddies switches the Claude desktop app's permission, question and idle notifications from pop-ups to taskbar badges, and puts your previous settings back when you uninstall. Restart Claude to apply.
   - **Codex:** in the Codex app, open **Settings > Notifications** and turn off permission, question and turn-completion notifications. Office Buddies can't change these for you.

The **Listener** section shows whether Office Buddies is listening, and why not if it can't (for example, when another program uses the port).

The status line in each section shows:

| Status | Meaning |
|---|---|
| **Installed** | The hook is in place and matches the current port and token. |
| **Needs update (port or token changed)** | You changed the listener port (or the token changed). Click **Update…** to rewrite the hook. |
| **Not installed** | No Office Buddies hook in that agent's config. |

To remove a hook, click **Uninstall…**, review the change, and confirm.

---

## 3. Using It

When an event arrives, your buddy shows it in the speech balloon:

- **Needs your input**: the agent is waiting on you. Click **Dismiss** to clear it, or **Open** to go straight to that conversation (see below).
- **Question**: the question is shown with its options as clickable bullets, like the classic Office Assistant. Click an option to answer. For questions that allow several answers, tick the options and click **OK**. If the agent asked more than one question, they're shown one after another (*Question 1 of 2*).
  - Codex only asks multiple-choice questions in **Plan** mode. Codex has no official way for a hook to answer them, so the buddy passes your answer back as the reason it declined to show the question; Codex carries on with that answer. If a future Codex version stops accepting this, the question simply appears in Codex as usual.
  - Choose **Answer in Claude Code instead** to close the balloon and answer in the agent's own window.
  - If you don't answer within about two minutes, the question is handed back to the agent's own window so it isn't left waiting.
- **Permission**: the agent wants to run a tool. The card shows what it will do (for example, the exact command) with **Allow** and **Deny** bullets. Choose **Answer in … instead** to decide in the agent's own window; the buddy also takes you there when it can. Unanswered requests go back to the agent after about two minutes.
- **Finished**: the agent stopped. The card only says the agent is done, never its reply, so open the session to read what it did. Turn off **Show "Finished" notifications** for an agent if you only want to hear about things that need you.

**Open** takes you to the exact conversation for sessions in the Claude desktop app and the Codex desktop app. Sessions in VS Code or a terminal show **Dismiss** only.

If the app the session runs in is already in front (the Claude desktop app, the Codex app, VS Code, or your terminal), the buddy stays quiet: the agent asks for input, questions and permissions in its own window as usual, and you can see it finish, because you're already looking at it. The buddy steps in when you're somewhere else.

Each notification shows the agent name and the project folder it's working in. There's one card per agent session: a newer event from the same session replaces the older card.

If several agents need you at once, the balloon queues them. Requests that are waiting on you come before "Finished" ones, oldest first, and the arrows at the bottom move between them. New requests never interrupt a balloon you're already using; a badge on the buddy shows how many are waiting.

---

## 4. Troubleshooting

**Nothing appears when the agent needs me.**

- Check that **Listen for agent and OpenClaw notifications** is on. The agent sections warn you when it's off.
- Check the status says **Installed**. If it says **Needs update**, click **Update…**.
- For Codex, make sure you trusted the hook with `/hooks`.
- Confirm the listener is running on Windows:

  ```powershell
  netstat -ano | findstr :5050
  ```

  You should see `127.0.0.1:5050` in the `LISTENING` state.

**Codex cards have no Open button, or appear while Codex is in front.**

The installed Codex script is older than this version. Click **Update…** in the Codex section; Codex won't ask you to approve the hook again.

**The Listener says "Not listening".**

Another program is using the port. Pick a different port, then click **Update…** for each agent. Office Buddies itself only ever runs once: starting it again brings the running buddy to the front.

**I changed the port and notifications stopped.**

The port is written into the installed hooks. After changing it, click **Update…** for each agent.

**I want to restore my original config.**

Click **Uninstall…**, or copy the `<file>.officebuddies.bak` backup back over the config file.

---

## 5. Custom Agents (Any Tool)

Any script, agent harness or CI job can use the buddy without an adapter. Send a JSON `POST` to the listener with the token from an installed hook (or from `agentHookToken` in Office Buddies' `config.json`):

```bash
curl -X POST "http://127.0.0.1:5050/agent-event?agent=custom" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
        "agent": "Deploy Bot",
        "session": "run-42",
        "kind": "question",
        "questions": [{ "question": "Deploy to production?", "options": ["Yes", "No"] }],
        "openUrl": "https://example.com/runs/42"
      }'
```

| Field | Required | Meaning |
|---|---|---|
| `agent` | yes | Name shown on the card. |
| `kind` | yes | `needs_input`, `question`, `permission` or `finished`. |
| `session` | no | One card per agent and session; a newer event replaces the older card. |
| `message` | no | Text shown on the card. |
| `questions` | for `question` | Up to a few questions, each with `question`, `options` (strings or `{ "label", "description" }`) and optional `multiSelect`. |
| `permission` | for `permission` | `{ "tool", "detail", "description" }`: what you want to run. |
| `openUrl` | no | Adds an **Open** button. `http(s)` and app links are allowed; `file:`, `data:` and script links are refused. |

For `question` and `permission`, the request stays open until the user decides (up to about two minutes):

- Answered: `200` with `{ "answers": { "<question>": "<label>" } }`. Several choices are joined with `, `.
- Allowed or denied: `200` with `{ "decision": "allow" }` or `{ "decision": "deny" }`.
- Dismissed, handed back or timed out: `204` with no body. Treat this as "ask the user yourself".

Other kinds return `204` right away.

---

## 6. Related

- [OpenClaw + Office Buddies (Tailscale) Guide](./openclaw-officebuddies-tailscale.md): OpenClaw uses the same listener for its proactive notifications.
