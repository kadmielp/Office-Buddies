---
name: office-buddies
description: Send proactive notifications, animations, and interactive buttons to the user's desktop via the Office Buddies app.
homepage: https://github.com/kadmielp/Office-Buddies
metadata: { "openclaw": { "emoji": "📎", "requires": { "bins": ["curl"] } } }
---

# Office Buddies Skill

Use this skill to interact with the user directly on their desktop. It triggers a classic Office Assistant balloon with optional animations and multiple-choice buttons.

## Setup Requirements

1. **Office Buddies App:** Must be running on the user's computer with the "Enable Proactive Messages" option active in **Settings > Model**.
2. **Network:** The server must be able to reach the client over a private network such as Tailscale.
3. **Default Port:** `5050`.

## Intelligent Routing (Automatic Handoff)

This skill follows a desktop-first delivery protocol for scheduled or proactive messages.

1. **Run connectivity triage before declaring the desktop offline.**
   - Ask for the desktop Tailscale IPv4 with `tailscale ip -4`.
   - Validate the listener on Windows with `netstat -ano | findstr :5050`.
   - Expected result: `0.0.0.0:5050` or `<TAILSCALE_IP_DESKTOP>:5050`.
   - If the listener appears only on `127.0.0.1:5050`, classify it as `loopback-only`. The app is alive locally, but unreachable from the Tailnet.
   - From the OpenClaw server, validate TCP reachability with `nc -vz <TAILSCALE_IP_DESKTOP> 5050`.
   - Then test the endpoint with `curl -m 5 http://<TAILSCALE_IP_DESKTOP>:5050/notify` or a POST JSON payload.
2. **Classify the likely failure mode.**
   - `loopback-only`: listener bound only to `127.0.0.1:5050`.
   - `refused`: listener absent, wrong target, or wrong port.
   - `timeout`: firewall block, missing route, or loopback-only binding.
3. **Try desktop delivery first.**
   - If the app responds with `status: ok`, treat the message as delivered and do not duplicate it on mobile.
4. **Repair before fallback when possible.**
   - If the listener is `loopback-only`, tell the user to restart or re-enable the listener in the app.
   - If the app still binds to loopback on Windows, recommend this fallback:
     `netsh interface portproxy add v4tov4 listenaddress=<TAILSCALE_IP_DESKTOP> listenport=5050 connectaddress=127.0.0.1 connectport=5050`
5. **Fallback cleanly when desktop remains unavailable.**
   - If delivery still fails after reasonable connectivity checks, send the message via the fallback channel such as WhatsApp.
   - Make it explicit that desktop delivery is temporarily unavailable and that the mobile fallback is intentional.
6. **Preserve surface continuity on replies.**
   - If the user interacts with the desktop balloon, the resulting agent response must be delivered back through `notify_desktop`.
   - The app includes `{ "metadata": { "reply_to": "bubble" } }` so the agent or OpenClaw Gateway can keep the conversation on the desktop surface.

## Tools

### `notify_desktop`

Sends a message to the assistant's speech balloon on the desktop.

#### Parameters

- `message` (string, required): The text to display in the balloon.
- `animation` (string, optional): The animation for the assistant to play, such as `Wave`, `Thinking`, `GetAttention`, or `CheckingSomething`.
- `loop` (boolean, optional): Defaults to `true`. Set to `false` if you want the animation to play only once.
- `actions` (array, optional): A list of up to 3 interactive buttons.
  - `label` (string): The text visible on the button.
  - `action` (string): A unique ID string. When clicked, the agent will receive an inbound message with `[Office Buddies Action]: <action_id>`.
  - An "Open in chat" button is automatically appended to every message.

#### Usage Example

```json
{
  "message": "Process complete. Should I archive the logs?",
  "animation": "Thinking",
  "actions": [
    { "label": "Yes, archive", "action": "logs_archive" },
    { "label": "No, keep them", "action": "logs_keep" }
  ]
}
```

## Implementation Note

The agent performs a POST request to `http://<TAILSCALE_IP_DESKTOP>:5050/notify`.
User responses to buttons are delivered back to the agent as standard user messages with the prefix `[Office Buddies Action]:`.

## Troubleshooting Heuristics

- `connection refused`: most likely no listener, wrong destination IP, or wrong port.
- `timeout`: most likely firewall blocking, missing Tailnet route, or `127.0.0.1`-only binding.
- `404` on `/health`: can be normal depending on the app version or implementation. Prioritize testing `POST /notify`.
- Final success condition: `POST /notify` returns `{"status":"ok"}` and the message appears on the desktop.

## Security

Only use this tool over secure private networks like Tailscale. Never expose listener port `5050` to the public internet.

- Prefer firewall rules restricted to `100.64.0.0/10` or, ideally, to `<OPENCLAW_SERVER_IP>` only.
- Never place real IPs, domains, tokens, phone numbers, account IDs, or screenshots with sensitive details into prompts, docs, or commits.
