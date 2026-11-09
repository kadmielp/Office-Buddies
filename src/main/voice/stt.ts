import { app, BrowserWindow } from "electron";
import { ChildProcess, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

import { IpcMessages } from "../../shared/ipc-messages";
import {
  VOICE_SAMPLE_RATE,
  VoiceModelState,
  VoiceStatus,
  VoiceTranscription,
} from "../../shared/voice";
import { getLogger } from "../logger";

// Local speech-to-text: a whisper.cpp server started on first use and kept
// running, like the llama.cpp one. Audio never leaves this computer.

const MODEL = {
  name: "Whisper base (multilingual)",
  file: "ggml-base.bin",
  url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin",
  sha256: "60ed5bc3dd14eea856493d334349b405782ddcaf0028d4b5df4088345fba2efe",
  bytes: 147_951_465,
};

const STARTUP_TIMEOUT_MS = 30_000;
const TRANSCRIBE_TIMEOUT_MS = 60_000;

let server: { process: ChildProcess; port: number } | null = null;
let starting: Promise<number> | null = null;
let modelState: VoiceModelState = { state: "missing" };
let downloading: Promise<void> | null = null;

function getRuntimeDir(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, "whisper")
    : path.join(app.getAppPath(), "resources", "whisper");
}

function getServerPath(): string {
  return path.join(getRuntimeDir(), "whisper-server.exe");
}

function getModelPath(): string {
  return path.join(app.getPath("userData"), "whisper", MODEL.file);
}

function isRuntimeAvailable(): boolean {
  return process.platform === "win32" && fs.existsSync(getServerPath());
}

function currentModelState(): VoiceModelState {
  if (modelState.state === "downloading" || modelState.state === "error") {
    return modelState;
  }
  return fs.existsSync(getModelPath())
    ? { state: "ready" }
    : { state: "missing" };
}

export function getVoiceStatus(): VoiceStatus {
  return {
    runtimeAvailable: isRuntimeAvailable(),
    model: currentModelState(),
    modelName: MODEL.name,
    modelSizeMb: Math.round(MODEL.bytes / 1_000_000),
  };
}

function broadcastStatus() {
  const status = getVoiceStatus();
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) {
      window.webContents.send(IpcMessages.VOICE_STATUS_UPDATED, status);
    }
  }
}

// Downloads the model once, checking its size and checksum before use.
export function downloadVoiceModel(): Promise<void> {
  if (downloading) return downloading;
  if (currentModelState().state === "ready") return Promise.resolve();

  downloading = (async () => {
    const target = getModelPath();
    const partial = `${target}.part`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    modelState = { state: "downloading", percent: 0 };
    broadcastStatus();

    try {
      const response = await fetchWithRetry(MODEL.url);

      const hash = createHash("sha256");
      const file = fs.createWriteStream(partial);
      const reader = response.body.getReader();
      let received = 0;
      let lastPercent = -1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        hash.update(value);
        received += value.byteLength;
        if (!file.write(value)) {
          await new Promise<void>((resolve) =>
            file.once("drain", () => resolve()),
          );
        }
        const percent = Math.floor((received / MODEL.bytes) * 100);
        if (percent !== lastPercent) {
          lastPercent = percent;
          modelState = { state: "downloading", percent: Math.min(percent, 99) };
          broadcastStatus();
        }
      }
      await new Promise<void>((resolve, reject) =>
        file.end((error?: Error | null) => (error ? reject(error) : resolve())),
      );

      if (hash.digest("hex") !== MODEL.sha256) {
        throw new Error("The downloaded model failed its checksum.");
      }
      fs.renameSync(partial, target);
      modelState = { state: "ready" };
      getLogger().info(`Voice model downloaded to ${target}`);
    } catch (error) {
      fs.rmSync(partial, { force: true });
      modelState = {
        state: "error",
        message: describeError(error),
      };
      getLogger().error("Voice model download failed", error);
    } finally {
      downloading = null;
      broadcastStatus();
    }
  })();

  return downloading;
}

// Connecting sometimes times out on one of the CDN's many addresses; a new
// attempt usually lands on a working one.
async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok && response.body) return response;
      lastError = new Error(`Download failed (HTTP ${response.status}).`);
      if (response.status < 500) break;
    } catch (error) {
      lastError = error;
      getLogger().warn(
        `Voice model download attempt ${attempt} failed: ${describeError(error)}`,
      );
    }
    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
  throw lastError;
}

// Node's fetch only says "fetch failed"; the reason is in its cause.
function describeError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  return error.cause instanceof Error
    ? `${error.message}: ${error.cause.message}`
    : error.message;
}

function reservePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address() as net.AddressInfo;
      probe.close(() => resolve(port));
    });
  });
}

async function ensureServer(): Promise<number> {
  if (server && server.process.exitCode === null) return server.port;
  if (starting) return starting;

  starting = (async () => {
    if (!isRuntimeAvailable()) {
      throw new Error(
        'Voice input needs the whisper.cpp runtime. Run "npm run prepare:whisper" and restart.',
      );
    }
    if (currentModelState().state !== "ready") {
      throw new Error(
        "The voice model is not downloaded yet. Download it in Settings > Advanced > Voice input.",
      );
    }

    const port = await reservePort();
    // Physical cores, leaving room for the app and a local chat model.
    const threads = Math.max(2, Math.min(8, Math.floor(os.cpus().length / 2)));
    const child = spawn(
      getServerPath(),
      [
        "-m",
        getModelPath(),
        "--host",
        "127.0.0.1",
        "--port",
        String(port),
        "-l",
        "auto",
        "-t",
        String(threads),
        "-nt",
        "-bs",
        "1",
        "-bo",
        "1",
      ],
      { cwd: getRuntimeDir(), windowsHide: true },
    );
    let output = "";
    child.stdout?.on("data", (data) => (output = (output + data).slice(-4000)));
    child.stderr?.on("data", (data) => (output = (output + data).slice(-4000)));
    child.on("exit", (code) => {
      getLogger().info(`whisper-server exited (${code})`);
      if (server?.process === child) server = null;
    });

    const deadline = Date.now() + STARTUP_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (child.exitCode !== null) {
        throw new Error(
          `Voice input could not start: ${output.trim().split("\n").pop() || "whisper-server exited."}`,
        );
      }
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`);
        if (response.ok) {
          server = { process: child, port };
          getLogger().info(
            `whisper-server ready on ${port} (${threads} threads)`,
          );
          return port;
        }
      } catch {
        // Not listening yet.
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    child.kill();
    throw new Error("Voice input took too long to start.");
  })();

  try {
    return await starting;
  } finally {
    starting = null;
  }
}

// Starts the server ahead of the first recording, so the user waits less.
export function warmVoice() {
  if (isRuntimeAvailable() && currentModelState().state === "ready") {
    ensureServer().catch((error) =>
      getLogger().warn(`Voice warm-up failed: ${error}`),
    );
  }
}

function toWav(samples: Int16Array): Buffer {
  const data = Buffer.from(
    samples.buffer,
    samples.byteOffset,
    samples.byteLength,
  );
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(VOICE_SAMPLE_RATE, 24);
  header.writeUInt32LE(VOICE_SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

// Whisper's markers for no speech, and the subtitles it invents on silence.
const NON_SPEECH =
  /\[(blank_audio|music|silence|no speech|inaudible)\]|\((music|silence|inaudible)\)/gi;

export async function transcribe(
  pcm: ArrayBuffer,
): Promise<VoiceTranscription> {
  const started = Date.now();
  const samples = new Int16Array(pcm);

  if (samples.length < VOICE_SAMPLE_RATE * 0.3) {
    return { text: "", ms: 0 };
  }

  const port = await ensureServer();
  const wav = toWav(samples);
  // Development: keep what the microphone captured, to check audio quality.
  if (!app.isPackaged && process.env.OFFICE_BUDDIES_VOICE_DEBUG) {
    fs.writeFileSync(
      path.join(app.getPath("logs"), `voice-${Date.now()}.wav`),
      wav,
    );
  }
  const form = new FormData();
  form.append("file", new Blob([wav], { type: "audio/wav" }), "speech.wav");
  form.append("response_format", "json");
  form.append("temperature", "0");

  const response = await fetch(`http://127.0.0.1:${port}/inference`, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(TRANSCRIBE_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Transcription failed (${response.status}).`);
  }

  const payload = (await response.json()) as { text?: string };
  const text = (payload.text ?? "")
    .replace(NON_SPEECH, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    // Whisper marks speaker turns with "- "; they are not part of the words.
    .replace(/(^|\s)-\s+(?=\S)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const ms = Date.now() - started;
  getLogger().info(
    `Transcribed ${(samples.length / VOICE_SAMPLE_RATE).toFixed(1)} s of audio in ${ms} ms`,
  );
  return { text, ms };
}

export function stopVoice() {
  server?.process.kill();
  server = null;
}
