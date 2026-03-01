# OpenClaw 🦞 + Office Buddies: Tailscale Integration Guide

This guide provides a step-by-step flow to connect your **OpenClaw** ([https://openclaw.ai](https://openclaw.ai)) agent server with the **Office Buddies** desktop assistant using a secure **Tailscale** private network.

---

## 1. Prerequisites
- **Tailscale** installed and active on both the server (OpenClaw) and the client (Windows/macOS/Linux).
- Both devices signed into the same Tailnet.
- Node.js and npm installed (if building from source).

---

## 2. Part I: Outbound Connection (Chatting with Zero)
Allows the App to send messages to the Server.

### A. Server Setup (OpenClaw)
1. Generate a secure access token:
   ```bash
   # Run on your server
   NEW_TOKEN=$(openssl rand -hex 32)
   openclaw config set gateway.auth.token "$NEW_TOKEN"
   echo "$NEW_TOKEN" # Save this!
   ```
2. Enable the OpenAI-compatible endpoint:
   ```bash
   # Required for Office Buddies chat functionality
   openclaw config set gateway.http.endpoints.chatCompletions.enabled true
   ```
3. Start the gateway with Tailscale support:
   ```bash
   openclaw gateway run --bind loopback --tailscale serve --force
   ```
4. Copy your Tailnet URL (e.g., `https://your-agent.ts.net`).

### B. App Setup (Office Buddies)
1. Go to **Settings > Model**.
2. Select **OpenClaw** as the Provider.
3. Paste your Tailnet URL in **Endpoint URL**.
4. Paste the token from Step A-1 in **API Key**.
5. Click **Refresh Models** and select your preferred agent (e.g., `google-antigravity/gemini-3-flash`).

---

## 3. Part II: Inbound Connection (Proactive Messages)
Allows the Agent to "call" you on the desktop with animations and buttons.

### A. Enable Listener in App
1. Stay in **Settings > Model** (with OpenClaw selected).
2. Locate the **Proactive Messages** section.
3. Check **"Enable Proactive Messages (Listener)"**.
4. Set the **Port** (default: `5050`).

The agent will automatically prioritize the desktop app if it is online and reachable.

### B. Configure Firewall
The client device must allow incoming connections on the selected port.

**For Windows (PowerShell as Administrator):**
```powershell
# Allow incoming traffic on port 5050 ONLY from your Tailscale network
New-NetFirewallRule -DisplayName "Office Buddies Proactive" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5050 -RemoteAddress 100.64.0.0/10
```

**For Linux (using ufw):**
```bash
sudo ufw allow from 100.64.0.0/10 to any port 5050 proto tcp
```

**For macOS:**
Check **System Settings > Network > Firewall > Options** and ensure Office Buddies is allowed to receive incoming connections.

### C. Sending Messages (For Developers/Agents)
The agent sends a POST request to: `http://<CLIENT_TAILSCALE_IP>:5050/notify`.

**Using the included Skill:**
We have included a ready-to-use OpenClaw Skill to make this integration seamless. You can find it at [`skills/office-buddies/SKILL.md`](skills/office-buddies/SKILL.md). 

To use it:
1. Copy the `skills/office-buddies` folder to your OpenClaw workspace.
2. Your agent will now have the `notify_desktop` tool available.

**Payload Example (Manual):**
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
*Note: `loop` defaults to `true` if an animation is provided.*

---

## 4. Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Connection Refused** | Verify the Firewall rule (Step 3-B). Run `netstat -ano | findstr :5050` to ensure the app is listening on `0.0.0.0:5050`. |
| **Timeout on Test** | Ensure the client device is active on Tailscale. Use `Test-NetConnection -ComputerName <CLIENT_IP> -Port 5050` in PowerShell to verify connectivity. |
| **Chat window opens on notification** | Ensure you are running the latest version of Office Buddies (`git pull`). Notifications are designed to appear in the classic speech balloon only. |
| **Buttons don't respond** | Feedback loop requires the **OpenClaw Provider** to be active and correctly configured in the Model tab. The response will appear as a message prefixed with `[Office Buddies Action]`. |

---

## 5. Security Note
- **No Public Exposure:** Port 5050 is never exposed to the internet. 
- **Restricted Access:** The `-RemoteAddress 100.64.0.0/10` flag ensures that only devices in your private Tailnet can send notifications to your desktop.
- **Privacy:** Your Tailscale IP is never hardcoded in the repository or public documentation.

---

## 6. Smart Reminders & Commands
Since Office Buddies is an extension of your OpenClaw agent, you can type natural language commands in the chat window to schedule tasks:
- *"Remind me to wash the dishes at 16:46"*
- *"Schedule a morning summary every day at 8:00 AM"*

The agent will use its internal `cron` tools to set these up. If you encounter issues with scheduling, ensure your OpenClaw Gateway is updated to the latest version.
