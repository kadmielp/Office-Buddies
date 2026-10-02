import type { DownloadState } from "./shared-state";

export interface Model {
  name: string;
  size: number;
  company?: string;
  url?: string;
  description?: string;
  homepage?: string;
}

export interface ManagedModel extends Model {
  path: string;
  downloaded?: boolean;
  downloadState?: DownloadState;
  imported?: boolean;
}

export type ModelState = Record<string, ManagedModel>;

export const BUILT_IN_MODELS: Model[] = [
  {
    name: "Gemma 3 (1B)",
    company: "Google",
    size: 806,
    url: "https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf",
    description:
      "Gemma 3, Google's new state-of-the-art models come in 1B, 4B, 12B, and 27B sizes. Gemma 3 has a 128K context window, and multilingual support.",
  },
  {
    name: "Gemma 3 (27B)",
    company: "Google",
    size: 12500,
    url: "https://huggingface.co/unsloth/gemma-3-27b-it-GGUF/resolve/main/gemma-3-27b-it-Q3_K_M.gguf",
    description:
      "Gemma 3,Google's new state-of-the-art models come in 1B,4B,12B,and 27B sizes. Gemma 3 has a 128K context window, and multilingual support.",
  },
  {
    name: "Qwen3 (4B)",
    company: "Qwen",
    size: 2500,
    url: "https://huggingface.co/unsloth/Qwen3-4B-GGUF/resolve/main/Qwen3-4B-Q4_K_M.gguf",
    description:
      "Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense and mixture-of-experts (MoE) models. Built upon extensive training, Qwen3 delivers groundbreaking advancements in reasoning, instruction-following, agent capabilities, and multilingual support, with the following key features",
    homepage: "https://qwenlm.github.io/blog/qwen3/",
  },
];
