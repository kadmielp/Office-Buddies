import os from "os";
import path from "path";

import {
  AgentHost,
  AgentPermission,
  AgentQuestion,
  AgentQueueItem,
} from "../../shared/agent-events";
import { permissionDecision } from "./claude-code";
import {
  asString,
  buildRelayScript,
  finishedMessage,
  getRelayScriptPath,
  parsePermission,
  parseQuestions,
  permissionMessage,
  toForwardSlashes,
  truncate,
} from "./shared";
import type { AgentAdapter } from "./types";

const LABEL = "Codex";
const QUESTION_TOOL = "request_user_input";
const SESSION_ID_PATTERN = /^[A-Za-z0-9-]{1,128}$/;

export const codexAdapter: AgentAdapter = {
  id: "codex",
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

    if (eventName === "PreToolUse" && toolName === QUESTION_TOOL) {
      questions = parseQuestions(payload.tool_input?.questions);

      if (!questions) {
        return null;
      }

      kind = "question";
      message = questions[0].question;
    } else if (eventName === "PermissionRequest") {
      kind = "permission";
      permission = parsePermission(toolName || "a tool", payload.tool_input);
      message = permissionMessage(LABEL, permission);
    } else if (eventName === "Stop") {
      kind = "finished";
      message = finishedMessage(LABEL);
    } else {
      return null;
    }

    const item: AgentQueueItem = {
      id: `codex:${sessionId}`,
      source: "codex",
      agentLabel: LABEL,
      kind,
      sessionId,
      host: toHost(asString(headers["x-agent-host"])),
      canOpen: false,
      cwd: asString(payload.cwd) || undefined,
      message: truncate(message),
      questions: questions ?? undefined,
      permission,
      receivedAt: Date.now(),
    };

    return { ...item, canOpen: codexAdapter.sessionUrl(item) !== null };
  },

  // Codex's question tool has no answers field. Denying the call with the
  // answers as the reason hands them to the model, which carries on with them.
  answerQuestion(item, _toolInput, answers) {
    const summary = (item.questions ?? [])
      .filter(({ question }) => answers[question] !== undefined)
      .map(({ question }) => `"${question}": ${answers[question]}`)
      .join("; ");

    return {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `The user already answered this in Office Buddies. Their answers: ${summary}. Continue with these answers; do not ask again.`,
      },
    };
  },

  decidePermission: (_item, allow) => permissionDecision(allow),

  sessionUrl(item) {
    // Codex's hook session id is the Codex app's thread id.
    return item.host === "codex-desktop" &&
      SESSION_ID_PATTERN.test(item.sessionId)
      ? `codex://threads/${encodeURIComponent(item.sessionId)}`
      : null;
  },

  hooks: {
    configPath: () => path.join(os.homedir(), ".codex", "hooks.json"),
    events: [
      // Questions and permissions wait in the balloon; see REQUEST_WAIT_MS.
      { event: "PreToolUse", matcher: QUESTION_TOOL, timeout: 120 },
      { event: "PermissionRequest", timeout: 120 },
      { event: "Stop" },
    ],
    // Codex only runs commands, so its hooks run a relay script. The command
    // never changes, so Codex keeps trusting it; the port and token live in
    // the script.
    buildHook: (timeout = 10) => ({
      type: "command",
      command: `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${toForwardSlashes(
        getRelayScriptPath("codex"),
      )}"`,
      timeout,
    }),
    isOwnHook: (hook) =>
      typeof hook?.command === "string" &&
      hook.command.includes(path.basename(getRelayScriptPath("codex"))),
    sideFiles: () => [
      {
        path: getRelayScriptPath("codex"),
        // The Codex desktop app's executable is ChatGPT.exe.
        content: buildRelayScript("codex", "chatgpt.exe"),
      },
    ],
  },
};

function toHost(host: string): AgentHost {
  return host === "codex-desktop" || host === "vscode" || host === "terminal"
    ? host
    : "unknown";
}
