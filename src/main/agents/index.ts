import type { AgentSource } from "../../shared/agent-events";
import { claudeCodeAdapter } from "./claude-code";
import { codexAdapter } from "./codex";
import { customAdapter } from "./custom";
import type { AgentAdapter } from "./types";

export type { AgentAdapter, AgentEventResponse } from "./types";

// Adding an agent means adding its adapter here; the queue, the balloon and
// the installer pick it up from this list.
const ADAPTERS: AgentAdapter[] = [
  claudeCodeAdapter,
  codexAdapter,
  customAdapter,
];

export function getAgentAdapter(id: unknown): AgentAdapter | undefined {
  return ADAPTERS.find((adapter) => adapter.id === id);
}

// Agents whose hooks the buddy installs.
export function getInstallableAdapter(source: AgentSource): AgentAdapter & {
  hooks: NonNullable<AgentAdapter["hooks"]>;
} {
  const adapter = getAgentAdapter(source);

  if (!adapter?.hooks) {
    throw new Error(`Hooks for ${source} can't be installed.`);
  }

  return adapter as AgentAdapter & {
    hooks: NonNullable<AgentAdapter["hooks"]>;
  };
}

export function isInstallableAgent(value: unknown): value is AgentSource {
  return Boolean(getAgentAdapter(value)?.hooks);
}
