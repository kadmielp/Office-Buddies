import {
  AgentEventKind,
  AgentPermission,
  AgentQuestion,
  AgentQueueItem,
} from "../../shared/agent-events";
import { asString, parseQuestions, truncate } from "./shared";
import type { AgentAdapter } from "./types";

// The public protocol: any tool can post to `/agent-event?agent=custom`
// without a dedicated adapter. See docs/tutorials/coding-agent-notifications.md.
//
//   { "agent": "My Tool", "session": "build-42", "kind": "question",
//     "message": "Deploy?", "questions": [{ "question": "Deploy?",
//     "options": ["Yes", "No"] }], "openUrl": "mytool://runs/42" }
//
// Questions are answered with { "answers": { "<question>": "<label>" } },
// permissions with { "decision": "allow" | "deny" }. Anything handed back,
// timed out or not waiting gets an empty 204.

const KINDS: AgentEventKind[] = [
  "needs_input",
  "question",
  "permission",
  "finished",
];
const BLOCKED_URL_PROTOCOLS = new Set([
  "javascript:",
  "data:",
  "file:",
  "vbscript:",
]);

export const customAdapter: AgentAdapter = {
  id: "custom",
  label: "Custom agent",

  normalize(payload) {
    const agentLabel = asString(payload?.agent).slice(0, 40);
    const kind = KINDS.find((value) => value === payload?.kind);

    if (!agentLabel || !kind) {
      return null;
    }

    let questions: AgentQuestion[] | null = null;
    let permission: AgentPermission | undefined;

    if (kind === "question") {
      questions = parseQuestions(payload.questions);

      if (!questions) {
        return null;
      }
    }

    if (kind === "permission") {
      permission = {
        toolName: asString(payload.permission?.tool) || "a tool",
        detail: asString(payload.permission?.detail),
        description: asString(payload.permission?.description) || undefined,
      };
    }

    const sessionId = asString(payload.session) || "default";
    const message =
      asString(payload.message) ||
      questions?.[0].question ||
      (permission
        ? `${agentLabel} wants to use ${permission.toolName}.`
        : kind === "finished"
          ? `${agentLabel} is done with this task.`
          : `${agentLabel} needs your input.`);
    const openUrl = safeOpenUrl(asString(payload.openUrl));

    return {
      id: `custom:${agentLabel.toLowerCase()}:${sessionId}`,
      source: "custom",
      agentLabel,
      kind,
      sessionId,
      // Custom tools don't say which window they live in, so the buddy never
      // stays quiet for them.
      host: "unknown",
      hostSessionId: openUrl ?? undefined,
      canOpen: openUrl !== null,
      cwd: asString(payload.cwd) || undefined,
      message: truncate(message),
      questions: questions ?? undefined,
      permission,
      receivedAt: Date.now(),
    } satisfies AgentQueueItem;
  },

  answerQuestion: (_item, _toolInput, answers) => ({ answers }),

  decidePermission: (_item, allow) => ({ decision: allow ? "allow" : "deny" }),

  // The tool supplies its own link; it travels in hostSessionId.
  sessionUrl: (item) => item.hostSessionId ?? null,
};

// Only links that open an app or a web page, never local files or scripts.
function safeOpenUrl(value: string): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    return BLOCKED_URL_PROTOCOLS.has(url.protocol) ? null : url.toString();
  } catch {
    return null;
  }
}
