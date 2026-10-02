# Coding Agent Notifications (Claude Code and Codex)

Office Buddies can keep an eye on your coding agents and tell you when one needs you. Instead of checking terminal tabs, your buddy pops up a speech balloon when an agent:

- is waiting for your input or a permission decision,
- asks a multiple-choice question (you can answer it right in the balloon), or
- has finished its work.

Supported agents: **Claude Code** and **Codex**.

---

## 1. How It Works

Each agent supports *hooks*: small actions it runs at certain moments. Office Buddies installs a hook into the agent's config file that sends the event to a listener inside Office Buddies.

| Agent | Config file | Events used |
|---|---|---|
| Claude Code | `~/.claude/settings.json` | Notifications that need input, `Stop` (finished), `AskUserQuestion` (multiple-choice questions), and `PermissionRequest` (Allow / Deny) |
| Codex | `~/.codex/hooks.json` | `PermissionRequest` (Allow / Deny) and `Stop` (finished) |

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

**Two buddies are running.**

Only one Office Buddies can listen on the port. If a second one starts, it can't receive agent events. Close all Office Buddies windows and start it once.

**I changed the port and notifications stopped.**

The port is written into the installed hooks. After changing it, click **Update…** for each agent.

**I want to restore my original config.**

Click **Uninstall…**, or copy the `<file>.officebuddies.bak` backup back over the config file.

---

## 5. Related

- [OpenClaw + Office Buddies (Tailscale) Guide](./openclaw-officebuddies-tailscale.md): OpenClaw uses the same listener for its proactive notifications.
