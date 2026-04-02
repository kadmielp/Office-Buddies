# OpenClaw + Office Buddies: Tailscale Integration Guide

This guide walks through a secure way to connect your **OpenClaw** agent server with the **Office Buddies** desktop assistant over **Tailscale** for both chat and proactive desktop notifications.

---

## 1. Prerequisites

- **Tailscale** installed and active on both the server and the desktop.
- Both devices signed into the same Tailnet.
- Node.js and npm installed if you are building from source.
- Use placeholders only in documentation, configs, and examples:
  - `<TAILSCALE_IP_DESKTOP>`
  - `<OPENCLAW_SERVER_IP>`
  - `<TAILNET_DOMAIN>`
  - `<TOKEN>`

---

## 2. Quick Start

Use this checklist to get proactive delivery working in under 10 steps.

1. Connect both the OpenClaw server and the desktop to the same Tailnet.
2. Start Office Buddies and enable **Proactive Messages (Listener)** on port `5050`.
3. On the desktop, run `tailscale ip -4` and record `<TAILSCALE_IP_DESKTOP>`.
4. On the desktop, run `netstat -ano | findstr :5050`.
5. Confirm the listener shows `0.0.0.0:5050` or `<TAILSCALE_IP_DESKTOP>:5050`.
6. If it shows only `127.0.0.1:5050`, restart or re-enable the listener. If needed, add the Windows `portproxy` fallback described below.
7. Allow inbound TCP `5050` only from `100.64.0.0/10` or, preferably, only from `<OPENCLAW_SERVER_IP>`.
8. From the OpenClaw server, run `nc -vz <TAILSCALE_IP_DESKTOP> 5050`.
9. From the OpenClaw server, send a test `POST` to `http://<TAILSCALE_IP_DESKTOP>:5050/notify`.
10. Treat the setup as successful only when `POST /notify` returns `{"status":"ok"}` and the message appears on the desktop.

Common mistake to avoid: the proactive endpoint must target the desktop listener at `http://<TAILSCALE_IP_DESKTOP>:5050/notify`, not the OpenClaw server URL.

---

## 3. Part I: Outbound Connection

This path allows Office Buddies to send chat traffic to OpenClaw.

### A. Server Setup (OpenClaw)

1. Generate a secure access token:

```bash
NEW_TOKEN=$(openssl rand -hex 32)
openclaw config set gateway.auth.token "$NEW_TOKEN"
echo "$NEW_TOKEN"
```

Store the generated token securely and refer to it as `<TOKEN>` in documentation.

2. Enable the OpenAI-compatible endpoint:

```bash
openclaw config set gateway.http.endpoints.chatCompletions.enabled true
```

3. Start the gateway with Tailscale support:

```bash
openclaw gateway run --bind loopback --tailscale serve --force
```

4. Copy your Tailnet URL, for example `https://<TAILNET_DOMAIN>`.

### B. App Setup (Office Buddies)

1. Go to **Settings > Model**.
2. Select **OpenClaw** as the provider.
3. Paste `https://<TAILNET_DOMAIN>` into **Endpoint URL**.
4. Paste `<TOKEN>` into **API Key**.
5. Click **Refresh Models** and select your preferred model or agent.

---

## 4. Part II: Inbound Connection (Proactive Messages)

This path allows OpenClaw to send proactive notifications to the desktop with animations and action buttons.

### A. Enable the Listener in Office Buddies

1. Stay in **Settings > Model** with **OpenClaw** selected.
2. Locate the **Proactive Messages** section.
3. Enable **Proactive Messages (Listener)**.
4. Set the port to `5050` unless you intentionally use a different one.

The desktop should be reachable on the Tailnet, not only on localhost.

### B. Preflight Connectivity Checks

Run these checks before concluding that the desktop delivery path is broken.

**On the desktop, get the Tailscale IPv4:**

```bash
tailscale ip -4
```

Use the result as `<TAILSCALE_IP_DESKTOP>`.

**On Windows, validate the listener:**

```powershell
netstat -ano | findstr :5050
```

Expected output includes one of:

- `0.0.0.0:5050`
- `<TAILSCALE_IP_DESKTOP>:5050`

If the listener appears only as `127.0.0.1:5050`, the app is bound to loopback only. In that state, OpenClaw cannot reach it over Tailscale even though the local app may seem healthy.

Also confirm that the proactive destination is the desktop listener, not the OpenClaw server:

```text
Correct:  http://<TAILSCALE_IP_DESKTOP>:5050/notify
Incorrect: https://<TAILNET_DOMAIN>/notify
```

**From the OpenClaw server, test raw TCP connectivity:**

```bash
nc -vz <TAILSCALE_IP_DESKTOP> 5050
```

**Then test the notification endpoint:**

```bash
curl -m 5 -X POST http://<TAILSCALE_IP_DESKTOP>:5050/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Connectivity test from OpenClaw","animation":"GetAttention"}'
```

Some builds may not expose `/health`, or may return `404` there. Prioritize `POST /notify` as the real delivery test.

### C. Fixing a Loopback-Only Listener

If the desktop is listening only on `127.0.0.1:5050`:

1. Restart Office Buddies.
2. Disable and re-enable **Proactive Messages (Listener)**.
3. Re-run `netstat -ano | findstr :5050`.

If the app still binds to loopback on Windows, use `portproxy` as a safe fallback:

```powershell
netsh interface portproxy add v4tov4 listenaddress=<TAILSCALE_IP_DESKTOP> listenport=5050 connectaddress=127.0.0.1 connectport=5050
```

To remove the proxy later:

```powershell
netsh interface portproxy delete v4tov4 listenaddress=<TAILSCALE_IP_DESKTOP> listenport=5050
```

This exposes the listener on the Tailscale interface while still forwarding to the loopback-only app locally.

### D. Configure Firewall Safely

Allow inbound TCP `5050` only from trusted private addresses.

**Windows (PowerShell as Administrator), allow the Tailnet only:**

```powershell
New-NetFirewallRule -DisplayName "Office Buddies Proactive" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5050 -RemoteAddress 100.64.0.0/10
```

**Windows, tighter rule for a single OpenClaw server:**

```powershell
New-NetFirewallRule -DisplayName "Office Buddies Proactive (OpenClaw Only)" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5050 -RemoteAddress <OPENCLAW_SERVER_IP>
```

**Linux with `ufw`:**

```bash
sudo ufw allow from 100.64.0.0/10 to any port 5050 proto tcp
```

**macOS:**

Check **System Settings > Network > Firewall > Options** and ensure Office Buddies is allowed to receive incoming connections.

Do not open port `5050` to the public internet.

### E. Sending Messages

OpenClaw sends proactive messages to:

```text
http://<TAILSCALE_IP_DESKTOP>:5050/notify
```

The included skill lives at [`skills/office-buddies/SKILL.md`](../../skills/office-buddies/SKILL.md).

Manual payload example:

```json
{
  "message": "Task complete! Should I push the changes?",
  "animation": "Thinking",
  "loop": true,
  "actions": [
    { "label": "Yes, push now", "action": "git_push" },
    { "label": "Review first", "action": "git_review" }
  ]
}
```

---

## 5. Troubleshooting by Symptom

### `connection refused`

Most likely causes:

- No listener is running.
- The destination IP is wrong.
- The destination port is wrong.

What to check:

- Re-enable the listener in Office Buddies.
- Re-run `netstat -ano | findstr :5050`.
- Confirm OpenClaw is calling `http://<TAILSCALE_IP_DESKTOP>:5050/notify`.

### `wrong-endpoint`

Most likely cause:

- The proactive request is pointed at the OpenClaw server or another non-desktop address instead of the desktop listener.

What to check:

- Confirm the proactive target is `http://<TAILSCALE_IP_DESKTOP>:5050/notify`.
- Do not reuse the server URL `https://<TAILNET_DOMAIN>` for desktop delivery.
- Verify the desktop Tailscale IP with `tailscale ip -4` before retrying.

### `timeout`

Most likely causes:

- Firewall is blocking inbound TCP `5050`.
- Tailscale routing is missing or broken.
- The app is bound only to `127.0.0.1:5050`.

What to check:

- Re-run `tailscale ip -4` on the desktop.
- Test TCP from the server with `nc -vz <TAILSCALE_IP_DESKTOP> 5050`.
- Review firewall rules and keep them limited to `100.64.0.0/10` or `<OPENCLAW_SERVER_IP>`.
- If `netstat` shows only `127.0.0.1:5050`, use the listener restart flow or `portproxy`.

### `404` on `/health`

This can be normal depending on the implementation. Do not use it as the primary success signal for proactive desktop delivery.

Use this instead:

```bash
curl -m 5 -X POST http://<TAILSCALE_IP_DESKTOP>:5050/notify \
  -H "Content-Type: application/json" \
  -d '{"message":"Final verification","animation":"GetAttention"}'
```

### Buttons do not respond

The feedback loop requires the **OpenClaw** provider to remain active in Office Buddies. Button clicks are forwarded back as messages prefixed with `[Office Buddies Action]`.

### `401 Unauthorized` or `403 missing scope`

Most likely causes:

- Office Buddies is still using an old or incorrect OpenClaw credential.
- The OpenClaw server was reinstalled or rotated auth state, invalidating the previously saved credential.
- The saved bearer token is valid for a different OpenClaw auth flow and does not include the required scope.

What to check:

- Open `Settings > Model` and re-enter the OpenClaw endpoint and API key.
- On Windows, confirm the locally saved settings in `%APPDATA%\Office Buddies\config.json`.
- Verify that `openclawEndpoint` points to the current Gateway URL.
- If needed, clear and re-enter the saved OpenClaw key before retrying.

### Final success criteria

The setup is healthy only when both conditions are true:

- `POST /notify` returns `{"status":"ok"}`
- The message appears on the desktop

---

## 6. Security Note

- Never expose port `5050` to the public internet.
- Restrict inbound access to `100.64.0.0/10` or, ideally, to `<OPENCLAW_SERVER_IP>` only.
- Never commit or publish real IPs, domains, tokens, phone numbers, user IDs, account IDs, or screenshots with sensitive values.

---

## 7. Smart Reminders and Commands

Since Office Buddies extends your OpenClaw agent, you can use natural language in chat to schedule tasks such as:

- "Remind me to wash the dishes at 16:46"
- "Schedule a morning summary every day at 8:00 AM"

If scheduling behaves unexpectedly, verify that your OpenClaw gateway is updated and healthy before troubleshooting the proactive delivery path.
