export type LocalBackend = "auto" | "cpu" | "vulkan" | "cuda";

export const LOCAL_CONTEXT_SIZES = [4096, 8192, 16384];
export const DEFAULT_LOCAL_CONTEXT_SIZE = 8192;

export type LocalLlmStatus = {
  ready: boolean;
  backend?: Exclude<LocalBackend, "auto">;
  model?: string;
  contextSize?: number;
  // Set when a GPU runtime failed and the model runs on the CPU instead.
  fallbackReason?: string;
};

// Keep in sync with scripts/prepare-llama-runtimes.ps1
export const LLAMA_CPP_RELEASE = "b11163";
