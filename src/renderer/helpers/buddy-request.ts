import { useSyncExternalStore } from "react";

import { AgentQueueItem } from "../../shared/agent-events";

// The buddy's own pending Allow or question card (computer use). The balloon
// owns the agent queue; the chat window shows the same card because the chat,
// a child window, always sits above the balloon.
let current: AgentQueueItem | null = null;
const listeners = new Set<() => void>();

export function setBuddyRequest(item: AgentQueueItem | null) {
  if (item === current) return;
  current = item;
  listeners.forEach((listener) => listener());
}

export function useBuddyRequest(): AgentQueueItem | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
}
