import { shell } from "electron";
import type { IncomingHttpHeaders } from "http";

import {
  AgentHost,
  AgentQuestionAnswers,
  AgentQueueItem,
  isBlockingRequest,
  isWaitingOnUser,
  sortAgentQueue,
} from "../shared/agent-events";
import { IpcMessages } from "../shared/ipc-messages";
import { getLogger } from "./logger";
import { getStateManager } from "./state";
import { getMainWindow, raiseMainWindow } from "./windows";
import { getForegroundProcessName } from "./helpers/foreground-app";
import { AgentAdapter, AgentEventResponse, getAgentAdapter } from "./agents";

// How long a question or permission request waits in the balloon before the
// agent shows its own prompt instead. Must stay below the hook timeouts in the
// agent adapters.
export const REQUEST_WAIT_MS = 110_000;

// After you hand a request back, the agent's own "needs input" notification
// for it is expected; skip it for this long.
const HANDOFF_QUIET_MS = 15_000;

interface PendingRequest {
  adapter: AgentAdapter;
  toolInput: Record<string, unknown>;
  respond: (response: AgentEventResponse) => void;
  timer: ReturnType<typeof setTimeout>;
}

// In memory only: agent events go stale, so the queue is cleared on restart.
const queue = new Map<string, AgentQueueItem>();
// Requests held open until they're answered or released.
const pendingRequests = new Map<string, PendingRequest>();
// Sessions whose request you just handed back, by time of handoff.
const recentHandoffs = new Map<string, number>();

export function getAgentQueue(): AgentQueueItem[] {
  return sortAgentQueue([...queue.values()]);
}

// Resolves with the response body for the caller. Questions and permission
// requests resolve only once they're answered, released or abandoned;
// everything else resolves right away.
export function handleAgentEvent(
  adapter: AgentAdapter,
  payload: any,
  headers: IncomingHttpHeaders,
  onAbort: (callback: () => void) => void,
): Promise<AgentEventResponse> {
  const item = adapter.normalize(payload, headers);

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
      return holdRequest(adapter, item, payload.tool_input ?? {}, onAbort);
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

  settleRequest(
    id,
    pending.adapter.answerQuestion(item, pending.toolInput, validAnswers),
  );
  removeItem(id);
}

export function decideAgentPermission(id: string, allow: boolean) {
  const item = queue.get(id);
  const pending = pendingRequests.get(id);

  if (item?.kind !== "permission" || !pending) {
    return;
  }

  settleRequest(id, pending.adapter.decidePermission(item, allow));
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
  adapter: AgentAdapter,
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

    pendingRequests.set(item.id, {
      adapter,
      toolInput,
      respond: resolve,
      timer,
    });
    onAbort(() => {
      // The caller gave up (for example, the user interrupted the turn).
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
  // The Codex desktop app's executable is ChatGPT.exe.
  "codex-desktop": ["chatgpt"],
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
  const showFinished =
    getStateManager().getSettings().agentShowFinished?.[
      item.source as "claude-code" | "codex"
    ] !== false;

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
  const url = getAgentAdapter(item.source)?.sessionUrl(item);

  if (!url) {
    return false;
  }

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

  raiseMainWindow();
}
