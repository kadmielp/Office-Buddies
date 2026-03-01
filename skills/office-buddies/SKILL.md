---
name: office-buddies
description: Send proactive notifications, animations, and interactive buttons to the user's desktop via the Office Buddies app.
homepage: https://github.com/kadmielp/Office-Buddies
metadata: { "openclaw": { "emoji": "📎", "requires": { "bins": ["curl"] } } }
---

# Office Buddies Skill

Use this skill to interact with the user directly on their desktop. It triggers a classic Office Assistant balloon with optional animations and multiple-choice buttons.

## Setup Requirements

1.  **Office Buddies App:** Must be running on the user's computer with the "Enable Proactive Messages" option active in **Settings > Model**.
2.  **Network:** The server must be able to reach the client IP (Tailscale is recommended).
3.  **Default Port:** 5050.

## Intelligent Routing (Automatic Handoff)

This skill follows a "Desktop-First" delivery protocol. For any scheduled or proactive message:

1.  **Try Desktop:** Always attempt to call the `notify_desktop` tool first.
2.  **Delivery Decision:**
    - **Success:** If the app is online and responds (`status: ok`), the message is considered delivered. The agent should stop there to avoid duplicating notifications on mobile.
    - **Fallback:** If the request fails (Connection Refused, Timeout, or Port Closed), the agent must immediately send the message via the fallback channel (WhatsApp).
3.  **Response Protocol:** If the user interacts with the desktop balloon (e.g., clicks a button), the resulting agent response **MUST** be delivered back to the desktop via `notify_desktop` to maintain session continuity on the same surface.
    - **Metadata Standard:** The Office Buddies app includes `{ "metadata": { "reply_to": "bubble" } }` in the request. The agent (or OpenClaw Gateway) should use this hint to route the reply to the desktop assistant.

## Tools

### `notify_desktop`

Sends a message to the assistant's speech balloon on the desktop.

#### Parameters

- `message` (string, required): The text to display in the balloon.
- `animation` (string, optional): The animation for the assistant to play (e.g., `Wave`, `Thinking`, `GetAttention`, `CheckingSomething`). 
    - *Note:* Defaults to `GetAttention` if not provided. Animations loop by default until the user interacts with the balloon.
- `loop` (boolean, optional): Defaults to `true`. Set to `false` if you want the animation to play only once.
- `actions` (array, optional): A list of up to 3 interactive buttons.
    - `label` (string): The text visible on the button.
    - `action` (string): A unique ID string. When clicked, the agent will receive an inbound message with `[Office Buddies Action]: <action_id>`.
    - *Note:* An "Open in chat" button is automatically appended to every message.

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

The agent performs a POST request to `http://<USER_IP>:5050/notify`. 
User responses to buttons are delivered back to the agent as standard user messages with the prefix `[Office Buddies Action]:`.

## Security

Only use this tool over secure private networks like **Tailscale**. Never expose the listener port (5050) to the public internet.
