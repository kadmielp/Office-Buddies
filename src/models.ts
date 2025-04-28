export interface Model {
  name: string;
  company: string;
  size: number;
  url: string;
}

export const MODELS: Model[] = [
  { name: 'Gemma 3 (1B)', company: 'Google', size: 806, url: 'https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf' },
  { name: 'Gemma 3 (4B)', company: 'Google', size: 2490, url: 'https://huggingface.co/unsloth/gemma-3-4b-it-GGUF/resolve/main/gemma-3-4b-it-Q3_K_M.gguf' },
  { name: 'Gemma 3 (12B)', company: 'Google', size: 5600, url: 'https://huggingface.co/unsloth/gemma-3-12b-it-GGUF/resolve/main/gemma-3-12b-it-Q3_K_M.gguf' },
  { name: 'Gemma 3 (27B)', company: 'Google', size: 12500, url: 'https://huggingface.co/unsloth/gemma-3-27b-it-GGUF/resolve/main/gemma-3-27b-it-Q3_K_M.gguf' }
];
