import { VOICE_SAMPLE_RATE } from "../../shared/voice";

// One microphone recording at a time, shared by the chat window and the mini
// chat. Audio is resampled to 16 kHz mono by the AudioContext and collected as
// Float32 chunks by a tiny AudioWorklet, then handed over as 16-bit PCM.

const WORKLET = `
class Collector extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel) this.port.postMessage(channel.slice(0));
    return true;
  }
}
registerProcessor("buddy-voice-collector", Collector);
`;

const MAX_SECONDS = 60;

interface Recording {
  stream: MediaStream;
  context: AudioContext;
  node: AudioWorkletNode;
  chunks: Float32Array[];
  samples: number;
  level: number;
}

let current: Recording | null = null;
let onLimit: (() => void) | null = null;

export function isRecording(): boolean {
  return current !== null;
}

// 0..1, for a simple level meter.
export function getLevel(): number {
  return current?.level ?? 0;
}

export async function startRecording(
  deviceId: string | undefined,
  onMaxLength: () => void,
): Promise<void> {
  if (current) return;

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        channelCount: 1,
        // Raw audio: Chromium's echo cancellation and noise suppression
        // distort speech, and whisper copes with room noise on its own.
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  } catch (error) {
    const name = error instanceof DOMException ? error.name : "";
    if (name === "NotAllowedError") {
      throw new Error(
        "Microphone access is blocked. Allow desktop apps to use the microphone in Windows Settings > Privacy & security > Microphone.",
      );
    }
    if (name === "NotFoundError" || name === "OverconstrainedError") {
      throw new Error(
        "No microphone found. Plug one in, or pick another in Settings > Advanced > Voice input.",
      );
    }
    throw error;
  }

  const context = new AudioContext({ sampleRate: VOICE_SAMPLE_RATE });
  const url = URL.createObjectURL(
    new Blob([WORKLET], { type: "application/javascript" }),
  );
  try {
    await context.audioWorklet.addModule(url);
  } finally {
    URL.revokeObjectURL(url);
  }

  const source = context.createMediaStreamSource(stream);
  const node = new AudioWorkletNode(context, "buddy-voice-collector");
  const recording: Recording = {
    stream,
    context,
    node,
    chunks: [],
    samples: 0,
    level: 0,
  };

  node.port.onmessage = (event: MessageEvent<Float32Array>) => {
    const chunk = event.data;
    recording.chunks.push(chunk);
    recording.samples += chunk.length;
    let sum = 0;
    for (let i = 0; i < chunk.length; i++) sum += chunk[i] * chunk[i];
    recording.level = Math.min(1, Math.sqrt(sum / chunk.length) * 6);
    if (recording.samples >= MAX_SECONDS * VOICE_SAMPLE_RATE) onLimit?.();
  };
  source.connect(node);

  current = recording;
  onLimit = () => {
    onLimit = null;
    onMaxLength();
  };
}

function release(recording: Recording) {
  recording.node.port.onmessage = null;
  recording.node.disconnect();
  recording.stream.getTracks().forEach((track) => track.stop());
  void recording.context.close();
}

// Stops and returns 16-bit PCM at 16 kHz, or null for a silent recording.
export function stopRecording(): ArrayBuffer | null {
  const recording = current;
  current = null;
  onLimit = null;
  if (!recording) return null;
  release(recording);

  const pcm = new Int16Array(recording.samples);
  let offset = 0;
  let peak = 0;
  for (const chunk of recording.chunks) {
    for (let i = 0; i < chunk.length; i++) {
      const value = Math.max(-1, Math.min(1, chunk[i]));
      peak = Math.max(peak, Math.abs(value));
      pcm[offset++] = value < 0 ? value * 0x8000 : value * 0x7fff;
    }
  }

  // Whisper invents text for silence ("Thank you."): don't send it any.
  return peak < 0.02 ? null : pcm.buffer;
}

export function cancelRecording() {
  const recording = current;
  current = null;
  onLimit = null;
  if (recording) release(recording);
}
