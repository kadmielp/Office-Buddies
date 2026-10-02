import type { IncomingHttpHeaders } from "http";

import type {
  AgentQuestionAnswers,
  AgentQueueItem,
} from "../../shared/agent-events";

// A hook response body, or null for "no decision" (an empty 2xx).
export type AgentEventResponse = Record<string, unknown> | null;

export type HookEntry = Record<string, any>;

// How the buddy installs an agent's hooks into its config file.
export interface AgentHookSpec {
  configPath: () => string;
  // Hook events to register, with an optional matcher and timeout for each.
  events: Array<{ event: string; matcher?: string; timeout?: number }>;
  buildHook: (timeout?: number) => HookEntry;
  // Our hooks are recognised by a marker, so user hooks are never touched.
  isOwnHook: (hook: HookEntry) => boolean;
  // Extra files the hook relies on; stale files make the status "outdated".
  sideFiles?: () => Array<{ path: string; content: string }>;
  // Called after installing or removing the hooks.
  onInstall?: () => void;
  onUninstall?: () => void;
}

// Everything the buddy knows about one agent. The queue, the balloon and the
// installer only talk to agents through this interface.
export interface AgentAdapter {
  // The `?agent=` value on the listener URL.
  id: string;
  label: string;
  // Turns a hook payload into a queue item, or null to ignore it.
  normalize: (
    payload: any,
    headers: IncomingHttpHeaders,
  ) => AgentQueueItem | null;
  // The hook response that answers a question held in the balloon.
  answerQuestion: (
    item: AgentQueueItem,
    toolInput: Record<string, unknown>,
    answers: AgentQuestionAnswers,
  ) => AgentEventResponse;
  // The hook response that allows or denies a permission request.
  decidePermission: (
    item: AgentQueueItem,
    allow: boolean,
  ) => AgentEventResponse;
  // The link that opens the session in its app, if there is one.
  sessionUrl: (item: AgentQueueItem) => string | null;
  // Present for agents whose hooks the buddy installs.
  hooks?: AgentHookSpec;
}
