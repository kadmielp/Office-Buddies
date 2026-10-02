import os from "os";
import path from "path";

import {
  AGENT_EVENT_PATH,
  AgentHost,
  AgentPermission,
  AgentQuestion,
  AgentQueueItem,
} from "../../shared/agent-events";
import { getLogger } from "../logger";
import { getStateManager } from "../state";
import {
  areClaudePopupsHidden,
  setClaudePopupsHidden,
} from "../claude-desktop-prefs";
import {
  asString,
  finishedMessage,
  getAgentEventUrl,
  getAgentHookToken,
  parsePermission,
  parseQuestions,
  permissionMessage,
  truncate,
} from "./shared";
import type { AgentAdapter } from "./types";

const LABEL = "Claude Code";

// Notification types that mean "the agent is waiting on you".
const NEEDS_INPUT_TYPES = new Set([
  "permission_prompt",
  "elicitation_dialog",
  "agent_needs_input",
]);

const DESKTOP_SESSION_PATTERN = /^local_[A-Za-z0-9-]{1,64}$/;

export const claudeCodeAdapter: AgentAdapter = {
  id: "claude-code",
  label: LABEL,

  normalize(payload, headers) {
    const sessionId = asString(payload?.session_id);

    if (!sessionId) {
      return null;
    }

    const eventName = asString(payload.hook_event_name);
    const toolName = asString(payload.tool_name);
    let kind: AgentQueueItem["kind"];
    let message: string;
    let questions: AgentQuestion[] | null = null;
    let permission: AgentPermission | undefined;

    if (
      eventName === "Notification" &&
      NEEDS_INPUT_TYPES.has(asString(payload.notification_type))
    ) {
      kind = "needs_input";
      message = asString(payload.message) || `${LABEL} needs your input.`;
    } else if (eventName === "Stop") {
      kind = "finished";
      message = finishedMessage(LABEL);
    } else if (eventName === "PreToolUse" && toolName === "AskUserQuestion") {
      questions = parseQuestions(payload.tool_input?.questions);

      if (!questions) {
        return null;
      }

      kind = "question";
      message = questions[0].question;
    } else if (
      eventName === "PermissionRequest" &&
      toolName &&
      // Questions are handled by the PreToolUse hook above.
      toolName !== "AskUserQuestion"
    ) {
      kind = "permission";
      permission = parsePermission(toolName, payload.tool_input);
      message = permissionMessage(LABEL, permission);
    } else {
      return null;
    }

    const rawHostSessionId = asString(headers["x-agent-host-session"]);
    const item: AgentQueueItem = {
      id: `claude-code:${sessionId}`,
      source: "claude-code",
      agentLabel: LABEL,
      kind,
      sessionId,
      hostSessionId: DESKTOP_SESSION_PATTERN.test(rawHostSessionId)
        ? rawHostSessionId
        : undefined,
      host: toHost(asString(headers["x-agent-entrypoint"])),
      canOpen: false,
      cwd: asString(payload.cwd) || undefined,
      message: truncate(message),
      questions: questions ?? undefined,
      permission,
      receivedAt: Date.now(),
    };

    return { ...item, canOpen: claudeCodeAdapter.sessionUrl(item) !== null };
  },

  // AskUserQuestion takes the answers as part of its input.
  answerQuestion: (_item, toolInput, answers) => ({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: "Answered from Office Buddies",
      updatedInput: { ...toolInput, answers },
    },
  }),

  decidePermission: (_item, allow) => permissionDecision(allow),

  sessionUrl(item) {
    if (item.host !== "claude-desktop" || !item.hostSessionId) {
      return null;
    }

    // `claude://resume` imports a copy of the session, and `code/needs-input`
    // only finds sessions that are waiting on you; `code/continue` opens any
    // existing desktop session.
    return `claude://code/continue?session=${encodeURIComponent(
      item.hostSessionId,
    )}`;
  },

  hooks: {
    configPath: () => path.join(os.homedir(), ".claude", "settings.json"),
    events: [
      {
        event: "Notification",
        matcher: [...NEEDS_INPUT_TYPES].join("|"),
      },
      { event: "Stop" },
      // Questions and permissions wait in the balloon. Keep these above
      // REQUEST_WAIT_MS so the buddy always answers before the hook times out.
      { event: "PreToolUse", matcher: "AskUserQuestion", timeout: 120 },
      { event: "PermissionRequest", timeout: 120 },
    ],
    // Claude Code posts the hook payload itself, so no relay is needed.
    buildHook: (timeout = 5) => ({
      type: "http",
      url: getAgentEventUrl("claude-code"),
      timeout,
      headers: {
        Authorization: `Bearer ${getAgentHookToken()}`,
        "X-Agent-Entrypoint": "$CLAUDE_CODE_ENTRYPOINT",
        "X-Agent-Host-Session": "$CLAUDE_CODE_HOST_SESSION_ID",
      },
      allowedEnvVars: ["CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_HOST_SESSION_ID"],
    }),
    isOwnHook: (hook) =>
      typeof hook?.url === "string" &&
      /^http:\/\/127\.0\.0\.1:\d+\//.test(hook.url) &&
      hook.url.includes(`${AGENT_EVENT_PATH}?agent=claude-code`),
    // The Claude desktop app's own pop-ups duplicate the balloon.
    onInstall: () => {
      if (getStateManager().getSettings().agentHideClaudePopups !== false) {
        updateClaudePopups(true);
      }
    },
    onUninstall: () => {
      if (areClaudePopupsHidden()) {
        updateClaudePopups(false);
      }
    },
  },
};

// Claude Code and Codex share the PermissionRequest decision format.
export function permissionDecision(allow: boolean) {
  return {
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      decision: allow
        ? { behavior: "allow" }
        : { behavior: "deny", message: "Denied from Office Buddies." },
    },
  };
}

function toHost(entrypoint: string): AgentHost {
  switch (entrypoint) {
    case "claude-desktop":
      return "claude-desktop";
    case "claude-vscode":
      return "vscode";
    case "cli":
      return "terminal";
    default:
      return "unknown";
  }
}

// Claude's own pop-ups are a convenience; failing to change them never blocks
// installing or removing the hooks.
function updateClaudePopups(hidden: boolean) {
  try {
    setClaudePopupsHidden(hidden);
  } catch (error) {
    getLogger().error("Failed to update Claude notification settings", error);
  }
}
