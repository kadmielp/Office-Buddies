// Local speech-to-text (whisper.cpp). Shared by main and renderer.

export const VOICE_SAMPLE_RATE = 16000;

export type VoiceModelState =
  | { state: "missing" }
  | { state: "downloading"; percent: number }
  | { state: "ready" }
  | { state: "error"; message: string };

export interface VoiceStatus {
  // The whisper.cpp runtime ships with this build (Windows, `npm run prepare:whisper`).
  runtimeAvailable: boolean;
  model: VoiceModelState;
  modelName: string;
  modelSizeMb: number;
}

// What a recording came back as.
export interface VoiceTranscription {
  text: string;
  ms: number;
}
