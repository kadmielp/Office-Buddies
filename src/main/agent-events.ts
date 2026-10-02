import { shell } from "electron";
import type { IncomingHttpHeaders } from "http";

import {
  AGENT_SOURCE_LABELS,
  AgentHost,
  AgentPermission,
  AgentQuestion,
  AgentQuestionAnswers,
  AgentQueueItem,
  AgentSource,
  isBlockingRequest,
  isWaitingOnUser,
  sortAgentQueue,
} from "../shared/agent-events";
import { IpcMessages } from "../shared/ipc-messages";
import { getLogger } from "./logger";
import { getStateManager } from "./state";
import { getMainWindow } from "./windows";
import { getForegroundProcessName } from "./helpers/foreground-app";

// Claude Code notification types that mean "the agent is waiting on you".
const CLAUDE_NEEDS_INPUT_TYPES = new Set([
  "permission_prompt",
  "elicitation_dialog",
  "agent_needs_input",
]);

const CLAUDE_DESKTOP_SESSION_PATTERN = /^local_[A-Za-z0-9-]{1,64}$/;
const MAX_MESSAGE_LENGTH = 280;
const MAX_PERMISSION_DETAIL_LENGTH = 600;

// How long a question or permission request waits in the balloon before the
// agent shows its own prompt instead. Must stay below the hook timeouts in
// agent-hooks.ts.
export const REQUEST_WAIT_MS = 110_000;

// After you hand a request back, the agent's own "needs input" notification
// for it is expected; skip it for this long.
const HANDOFF_QUIET_MS = 15_000;

// A hook response body, or null for "no decision" (an empty 2xx).
export type AgentEventResponse = Record<string, unknown> | null;

interface PendingRequest {
  toolInput: Record<string, unknown>;
  respond: (response: AgentEventResponse) => void;
  timer: ReturnType<typeof setTimeout>;
}

// In memory only: agent events go stale, so the queue is cleared on restart.
const queue = new Map<string, AgentQueueItem>();
// Hook requests held open until they're answered or released.
const pendingRequests = new Map<string, PendingRequest>();
// Sessions whose request you just handed back, by time of handoff.
const recentHandoffs = new Map<string, number>();

export function isAgentSource(value: unknown): value is AgentSource {
  return value === "claude-code" || value === "codex";
}

export function getAgentQueue(): AgentQueueItem[] {
  return sortAgentQueue([...queue.values()]);
}

// Resolves with the hook's response body. Questions and permission requests
// resolve only once they're answered, released or abandoned; everything else
// resolves right away.
export function handleAgentEvent(
  source: AgentSource,
  payload: any,
  headers: IncomingHttpHeaders,
  onAbort: (callback: () => void) => void,
): Promise<AgentEventResponse> {
  const item =
    source === "claude-code"
      ? normalizeClaudeEvent(payload, headers)
      : normalizeCodexEvent(payload, headers);

  if (!item) {
    return Promise.resolve(null);
  }

  if (item.kind === "needs_input" && wasJustHandedOff(item.id)) {
    return Promise.resolve(null);
  }

  // If you're already looking at the agent, it asks in its own window, you
  // can see it finish, and the buddy stays quiet.
  return isHostInFront(item.host).then((inFront) => {
    if (inFront) {
      getLogger().info(`Agent ${item.kind} left to the agent: ${item.id}`);

      // An older card from this session is stale now that you're there.
      if (item.kind === "finished" && queue.get(item.id)?.kind === "finished") {
        removeItem(item.id);
      }

      return null;
    }

    if (isBlockingRequest(item.kind)) {
      return holdRequest(item, payload.tool_input ?? {}, onAbort);
    }

    queueItem(item);
    return null;
  });
}

export function answerAgentQuestion(id: string, answers: AgentQuestionAnswers) {
  const item = queue.get(id);
  const pending = pendingRequests.get(id);

  if (item?.kind !== "question" || !item.questions || !pending) {
    return;
  }

  // Only accept answers for the questions that were actually asked.
  const validAnswers: AgentQuestionAnswers = {};

  for (const { question } of item.questions) {
    if (typeof answers?.[question] === "string") {
      validAnswers[question] = answers[question];
    }
  }

  settleRequest(id, {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: "Answered from Office Buddies",
      updatedInput: { ...pending.toolInput, answers: validAnswers },
    },
  });
  removeItem(id);
}

// Claude Code and Codex share the PermissionRequest decision format.
export function decideAgentPermission(id: string, allow: boolean) {
  const item = queue.get(id);

  if (item?.kind !== "permission" || !pendingRequests.has(id)) {
    return;
  }

  settleRequest(id, {
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      decision: allow
        ? { behavior: "allow" }
        : { behavior: "deny", message: "Denied from Office Buddies." },
    },
  });
  removeItem(id);
}

// "Answer in … instead": the agent shows its own prompt, and the buddy takes
// you to the session when it can.
export async function handOffAgentQueueItem(id: string) {
  const item = queue.get(id);

  settleRequest(id, null);
  recentHandoffs.set(id, Date.now());
  removeItem(id);

  if (item) {
    await openAgentSession(item);
  }
}

// Dismissing a waiting request also hands it back to the agent's own UI.
export function dismissAgentQueueItem(id: string) {
  settleRequest(id, null);
  removeItem(id);
}

export async function openAgentQueueItem(id: string) {
  const item = queue.get(id);

  if (item && (await openAgentSession(item))) {
    dismissAgentQueueItem(id);
  }
}

function holdRequest(
  item: AgentQueueItem,
  toolInput: Record<string, unknown>,
  onAbort: (callback: () => void) => void,
): Promise<AgentEventResponse> {
  return new Promise((resolve) => {
    // Release anything still waiting for this session before replacing it.
    settleRequest(item.id, null);

    const timer = setTimeout(() => {
      getLogger().info(`Agent ${item.kind} released after timeout: ${item.id}`);
      settleRequest(item.id, null);
      removeItem(item.id);
    }, REQUEST_WAIT_MS);

    pendingRequests.set(item.id, { toolInput, respond: resolve, timer });
    onAbort(() => {
      // The agent gave up (for example, the user interrupted the turn).
      if (pendingRequests.get(item.id)?.respond === resolve) {
        settleRequest(item.id, null);
        removeItem(item.id);
      }
    });

    queueItem({ ...item, expiresAt: Date.now() + REQUEST_WAIT_MS });
  });
}

// Process names of the apps each kind of session runs in.
const HOST_PROCESS_NAMES: Record<AgentHost, string[]> = {
  "claude-desktop": ["claude"],
  vscode: ["code", "code - insiders", "cursor", "windsurf"],
  terminal: [
    "windowsterminal",
    "cmd",
    "powershell",
    "pwsh",
    "conhost",
    "wezterm-gui",
    "alacritty",
    "mintty",
  ],
  unknown: [],
};

async function isHostInFront(host: AgentHost): Promise<boolean> {
  const names = HOST_PROCESS_NAMES[host];

  if (names.length === 0) {
    return false;
  }

  const foreground = await getForegroundProcessName();

  return foreground !== null && names.includes(foreground);
}

function wasJustHandedOff(id: string): boolean {
  const handedOffAt = recentHandoffs.get(id);

  if (handedOffAt === undefined) {
    return false;
  }

  recentHandoffs.delete(id);

  return Date.now() - handedOffAt < HANDOFF_QUIET_MS;
}

function settleRequest(id: string, response: AgentEventResponse) {
  const pending = pendingRequests.get(id);

  if (!pending) {
    return;
  }

  clearTimeout(pending.timer);
  pendingRequests.delete(id);
  pending.respond(response);
}

function removeItem(id: string) {
  if (queue.delete(id)) {
    broadcastQueue();
  }
}

function queueItem(item: AgentQueueItem) {
  const { source } = item;

  const showFinished =
    getStateManager().getSettings().agentShowFinished?.[source] !== false;

  if (item.kind === "finished" && !showFinished) {
    // A finished turn still clears a stale "needs input" card for the session.
    settleRequest(item.id, null);
    removeItem(item.id);
    return;
  }

  // One card per session: the newest event replaces the older one.
  if (!isBlockingRequest(item.kind)) {
    settleRequest(item.id, null);
  }
  queue.delete(item.id);
  queue.set(item.id, item);
  getLogger().info(`Agent event queued: ${item.id} (${item.kind})`);

  if (isWaitingOnUser(item.kind)) {
    showMainWindowWithoutFocus();
  }

  broadcastQueue(item);
}

// Returns whether the session could be opened.
async function openAgentSession(item: AgentQueueItem): Promise<boolean> {
  if (item.host !== "claude-desktop" || !item.hostSessionId) {
    return false;
  }

  // `claude://resume` imports a copy of the session; `code/needs-input`
  // navigates to the existing desktop session instead.
  const url = `claude://code/needs-input?session=${encodeURIComponent(
    item.hostSessionId,
  )}`;

  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    getLogger().error("Failed to open agent session", error);
    return false;
  }
}

function broadcastQueue(arrived?: AgentQueueItem) {
  getMainWindow()?.webContents.send(IpcMessages.AGENT_QUEUE_UPDATED, {
    items: getAgentQueue(),
    arrived,
  });
}

function showMainWindowWithoutFocus() {
  const window = getMainWindow();

  if (!window) {
    return;
  }

  if (window.isMinimized()) {
    window.restore();
  }

  if (!window.isVisible()) {
    window.showInactive();
  }
}

function normalizeClaudeEvent(
  payload: any,
  headers: IncomingHttpHeaders,
): AgentQueueItem | null {
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
    CLAUDE_NEEDS_INPUT_TYPES.has(asString(payload.notification_type))
  ) {
    kind = "needs_input";
    message = asString(payload.message) || "Claude Code needs your input.";
  } else if (eventName === "Stop") {
    kind = "finished";
    message = finishedMessage("claude-code");
  } else if (eventName === "PreToolUse" && toolName === "AskUserQuestion") {
    questions = parseQuestions(payload.tool_input);

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
    message = permissionMessage("claude-code", permission);
  } else {
    return null;
  }

  const hostSessionId = asString(headers["x-agent-host-session"]);

  return {
    id: `claude-code:${sessionId}`,
    source: "claude-code",
    kind,
    sessionId,
    hostSessionId: CLAUDE_DESKTOP_SESSION_PATTERN.test(hostSessionId)
      ? hostSessionId
      : undefined,
    host: toClaudeHost(asString(headers["x-agent-entrypoint"])),
    cwd: asString(payload.cwd) || undefined,
    message: truncate(message),
    questions: questions ?? undefined,
    permission,
    receivedAt: Date.now(),
  };
}

// The agent's own reply can be long or private, so "finished" cards stay
// generic; the user opens the session to read it.
function finishedMessage(source: AgentSource): string {
  return `${AGENT_SOURCE_LABELS[source]} is done with this task.`;
}

function permissionMessage(
  source: AgentSource,
  permission: AgentPermission,
): string {
  return `${AGENT_SOURCE_LABELS[source]} wants to use ${permission.toolName}.`;
}

// Picks the part of the tool input that says what will actually happen.
function parsePermission(toolName: string, toolInput: any): AgentPermission {
  const detail =
    asString(toolInput?.command) ||
    asString(toolInput?.file_path) ||
    asString(toolInput?.path) ||
    asString(toolInput?.url) ||
    asString(toolInput?.pattern) ||
    (toolInput && typeof toolInput === "object"
      ? JSON.stringify(toolInput, null, 1)
      : "");

  return {
    toolName,
    detail:
      detail.length > MAX_PERMISSION_DETAIL_LENGTH
        ? `${detail.slice(0, MAX_PERMISSION_DETAIL_LENGTH - 1)}…`
        : detail,
    description: asString(toolInput?.description) || undefined,
  };
}

// Returns null when the input isn't something the balloon can answer.
function parseQuestions(toolInput: any): AgentQuestion[] | null {
  if (!Array.isArray(toolInput?.questions) || !toolInput.questions.length) {
    return null;
  }

  const questions: AgentQuestion[] = [];

  for (const raw of toolInput.questions) {
    const question = asString(raw?.question);
    const options = Array.isArray(raw?.options)
      ? raw.options
          .map((option: any) => ({
            label: asString(option?.label),
            description: asString(option?.description) || undefined,
          }))
          .filter((option: { label: string }) => option.label)
      : [];

    if (!question || options.length === 0) {
      return null;
    }

    questions.push({
      question,
      header: asString(raw.header) || undefined,
      multiSelect: raw.multiSelect === true,
      options,
    });
  }

  return questions;
}

function normalizeCodexEvent(
  payload: any,
  headers: IncomingHttpHeaders,
): AgentQueueItem | null {
  const sessionId = asString(payload?.session_id);

  if (!sessionId) {
    return null;
  }

  const eventName = asString(payload.hook_event_name);
  let kind: AgentQueueItem["kind"];
  let message: string;
  let permission: AgentPermission | undefined;

  if (eventName === "PermissionRequest") {
    kind = "permission";
    permission = parsePermission(
      asString(payload.tool_name) || "a tool",
      payload.tool_input,
    );
    message = permissionMessage("codex", permission);
  } else if (eventName === "Stop") {
    kind = "finished";
    message = finishedMessage("codex");
  } else {
    return null;
  }

  return {
    id: `codex:${sessionId}`,
    source: "codex",
    kind,
    sessionId,
    host: toCodexHost(asString(headers["x-agent-host"])),
    cwd: asString(payload.cwd) || undefined,
    message: truncate(message),
    permission,
    receivedAt: Date.now(),
  };
}

function toClaudeHost(entrypoint: string): AgentHost {
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

// The Codex hook script reports where Codex runs (see agent-hooks.ts).
function toCodexHost(host: string): AgentHost {
  return host === "vscode" || host === "terminal" ? host : "unknown";
}

function asString(value: unknown): string {
  if (Array.isArray(value)) {
    return asString(value[0]);
  }

  return typeof value === "string" ? value.trim() : "";
}

// Cards show plain text, so drop the most common Markdown markers.
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
}

function truncate(text: string): string {
  const singleLine = stripMarkdown(text).replace(/\s+/g, " ").trim();

  return singleLine.length > MAX_MESSAGE_LENGTH
    ? `${singleLine.slice(0, MAX_MESSAGE_LENGTH - 1)}…`
    : singleLine;
}
