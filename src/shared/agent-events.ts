// Path on the local listener (see proactive-server.ts) that receives hooks.
export const AGENT_EVENT_PATH = "/agent-event";

// Coding agents that can notify the buddy through hooks.
export type AgentSource = "claude-code" | "codex";

export const AGENT_SOURCE_LABELS: Record<AgentSource, string> = {
  "claude-code": "Claude Code",
  codex: "Codex",
};

// "question" and "permission" block the agent until they're answered from the
// balloon or handed back to the agent's own window.
export type AgentEventKind =
  | "needs_input"
  | "question"
  | "permission"
  | "finished";

export interface AgentPermission {
  toolName: string;
  // What the tool will do, such as the command line or the file it edits.
  detail: string;
  description?: string;
}

export interface AgentQuestion {
  question: string;
  header?: string;
  multiSelect: boolean;
  options: Array<{ label: string; description?: string }>;
}

// Answer per question text; multi-select answers are joined labels.
export type AgentQuestionAnswers = Record<string, string>;

// Where the agent session runs, used to decide whether "Open" is possible.
export type AgentHost =
  | "claude-desktop"
  | "codex-desktop"
  | "vscode"
  | "terminal"
  | "unknown";

export interface AgentQueueItem {
  // One entry per agent session: `${source}:${sessionId}`.
  id: string;
  source: AgentSource;
  kind: AgentEventKind;
  sessionId: string;
  // Session id understood by the host app's deep link, when available.
  hostSessionId?: string;
  // Whether the buddy can take you to this session in its app.
  canOpen: boolean;
  host: AgentHost;
  cwd?: string;
  message: string;
  questions?: AgentQuestion[];
  permission?: AgentPermission;
  // When a waiting request is released back to the agent's own UI.
  expiresAt?: number;
  receivedAt: number;
}

export interface AgentQueueUpdate {
  items: AgentQueueItem[];
  // Set when the update was caused by a newly received event.
  arrived?: AgentQueueItem;
}

export type AgentHookStatus = "installed" | "outdated" | "not_installed";

export interface AgentHookInfo {
  source: AgentSource;
  status: AgentHookStatus;
  configPath: string;
  error?: string;
}

export interface AgentHookPreview {
  source: AgentSource;
  configPath: string;
  before: string;
  after: string;
}

export function isWaitingOnUser(kind: AgentEventKind): boolean {
  return kind !== "finished";
}

// Requests the buddy can answer for the agent, holding its hook open.
export function isBlockingRequest(kind: AgentEventKind): boolean {
  return kind === "question" || kind === "permission";
}

// Requests that wait on you jump ahead of "finished"; otherwise first in,
// first out.
export function sortAgentQueue(items: AgentQueueItem[]): AgentQueueItem[] {
  return [...items].sort((a, b) => {
    const rankA = isWaitingOnUser(a.kind) ? 0 : 1;
    const rankB = isWaitingOnUser(b.kind) ? 0 : 1;

    return rankA - rankB || a.receivedAt - b.receivedAt;
  });
}
