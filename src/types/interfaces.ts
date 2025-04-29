import { ModelState } from "../models";

export interface SettingsState {
  selectedModel?: string;
  systemPrompt?: string
}

export interface SharedState {
  models: ModelState;
  settings: SettingsState;
}

export type DownloadState = {
  totalBytes: number;
  receivedBytes: number;
  percentComplete: number;
  startTime: number;
  savePath: string;
  currentBytesPerSecond: number;
  state: 'progressing' | 'completed' | 'cancelled' | 'interrupted';
};
