import type { SettingsState } from "./shared-state";

// Agent harnesses the user brings as the buddy's brain. Each one serves an
// OpenAI-compatible API, so they share a single code path; adding another
// harness is a new entry here plus its settings keys.
export type HarnessProvider = "openclaw" | "hermes";

interface HarnessDefinition {
  label: string;
  endpointKey: "openclawEndpoint" | "hermesEndpoint";
  apiKeyKey: "openclawApiKey" | "hermesApiKey";
  defaultEndpoint?: string;
  defaultModel: string;
  endpointPlaceholder: string;
}

export const HARNESS_PROVIDERS: Record<HarnessProvider, HarnessDefinition> = {
  openclaw: {
    label: "OpenClaw",
    endpointKey: "openclawEndpoint",
    apiKeyKey: "openclawApiKey",
    defaultModel: "openclaw",
    endpointPlaceholder: "e.g., http://tailscale-ip:1337",
  },
  hermes: {
    label: "Hermes",
    endpointKey: "hermesEndpoint",
    apiKeyKey: "hermesApiKey",
    defaultEndpoint: "http://127.0.0.1:8642",
    defaultModel: "hermes-agent",
    endpointPlaceholder: "http://127.0.0.1:8642",
  },
};

export function isHarnessProvider(value: unknown): value is HarnessProvider {
  return value === "openclaw" || value === "hermes";
}

export function getHarnessEndpoint(
  settings: SettingsState,
  provider: HarnessProvider,
): string {
  const harness = HARNESS_PROVIDERS[provider];

  return settings[harness.endpointKey]?.trim() || harness.defaultEndpoint || "";
}

export function getHarnessApiKey(
  settings: SettingsState,
  provider: HarnessProvider,
): string {
  return settings[HARNESS_PROVIDERS[provider].apiKeyKey] || "";
}
