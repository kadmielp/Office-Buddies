import { app } from "electron";
import { ChildProcess, execFile, spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  LOCAL_CONTEXT_SIZES,
  LocalBackend,
  LocalLlmStatus,
} from "../shared/local-llm";
import { getLogger } from "./logger";

/**
 * Runs the bundled llama.cpp `llama-server` as a child process and exposes it
 * through its OpenAI-compatible HTTP API. GPU backends use `--fit on`, which
 * sizes layers/context to the free VRAM, and a failing GPU backend falls back
 * to the CPU runtime instead of leaving a broken session behind.
 */

type RuntimeBackend = Exclude<LocalBackend, "auto">;

const STARTUP_TIMEOUT_MS = 3 * 60 * 1000;
const HEALTH_POLL_MS = 500;
const LOG_TAIL_CHARS = 1500;

type Running = {
  child: ChildProcess;
  port: number;
  key: string;
  modelPath: string;
  backend: RuntimeBackend;
  contextSize: number;
  ready: boolean;
  fallbackReason?: string;
};

let running: Running | null = null;
let startGeneration = 0;
let pendingStart: Promise<LocalLlmStatus> | null = null;
// Set when a GPU runtime died: stay on the CPU runtime until the app restarts.
let gpuDisabledReason: string | null = null;

function getRuntimeDir(backend: RuntimeBackend): string {
  const root = app.isPackaged
    ? path.join(process.resourcesPath, "local_gguf")
    : path.join(app.getAppPath(), "resources", "local_gguf");

  return path.join(root, backend);
}

function getRuntimeExecutable(backend: RuntimeBackend): string | null {
  const executable = path.join(
    getRuntimeDir(backend),
    process.platform === "win32" ? "llama-server.exe" : "llama-server",
  );

  return fs.existsSync(executable) ? executable : null;
}

function run(command: string, args: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      { windowsHide: true, timeout: 10_000 },
      (error, stdout) => resolve(error ? null : stdout.toString()),
    );
  });
}

async function pickAutoBackend(): Promise<RuntimeBackend> {
  if (gpuDisabledReason) {
    return "cpu";
  }

  if (getRuntimeExecutable("cuda")) {
    const nvidia = await run("nvidia-smi", ["-L"]);
    if (nvidia?.trim()) {
      return "cuda";
    }
  }

  if (getRuntimeExecutable("vulkan")) {
    const adapters = await run("powershell", [
      "-NoProfile",
      "-Command",
      "(Get-CimInstance Win32_VideoController).Name",
    ]);
    const hasGpu = (adapters || "")
      .toLowerCase()
      .split(/\r?\n/)
      .some(
        (name) =>
          name.includes("nvidia") ||
          name.includes("radeon") ||
          (name.includes("intel") && !name.includes("basic")),
      );

    if (hasGpu) {
      return "vulkan";
    }
  }

  return "cpu";
}

function reservePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
  });
}

function getLogPath(): string {
  return path.join(app.getPath("logs"), "local-llm.log");
}

function readLogTail(): string {
  try {
    const text = fs.readFileSync(getLogPath(), "utf8");
    return text.slice(-LOG_TAIL_CHARS).trim();
  } catch {
    return "";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class RuntimeExitedError extends Error {
  constructor(
    public backend: RuntimeBackend,
    detail: string,
  ) {
    super(detail);
  }
}

async function launch(args: {
  modelPath: string;
  backend: RuntimeBackend;
  contextSize: number;
  generation: number;
}): Promise<Running> {
  const { modelPath, backend, contextSize, generation } = args;
  const executable = getRuntimeExecutable(backend);

  if (!executable) {
    throw new Error(
      `The bundled ${backend} llama.cpp runtime is missing (${getRuntimeDir(backend)}). Run "npm run prepare:llama" and rebuild.`,
    );
  }

  const port = await reservePort();
  const key = randomUUID();
  const cliArgs = [
    "--model",
    modelPath,
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--api-key",
    key,
    "--ctx-size",
    String(contextSize),
    // One chat at a time: give the whole context to a single slot.
    "--parallel",
    "1",
    "--no-webui",
  ];

  if (backend !== "cpu") {
    cliArgs.push("--n-gpu-layers", "auto", "--fit", "on");
  }

  fs.mkdirSync(path.dirname(getLogPath()), { recursive: true });
  const logFd = fs.openSync(getLogPath(), "w");
  fs.writeSync(
    logFd,
    `> ${executable} ${cliArgs.join(" ").replace(key, "***")}\n`,
  );

  const child = spawn(executable, cliArgs, {
    cwd: path.dirname(executable),
    windowsHide: true,
    stdio: ["ignore", logFd, logFd],
  });
  fs.closeSync(logFd);

  const current: Running = {
    child,
    port,
    key,
    modelPath,
    backend,
    contextSize,
    ready: false,
  };
  running = current;

  let exitDetail: string | null = null;
  child.once("error", (error) => {
    exitDetail = `could not start: ${error.message}`;
  });
  child.once("exit", (code, signal) => {
    exitDetail = `exited (${signal ?? code})`;

    if (running === current) {
      const wasReady = current.ready;
      running = null;

      if (wasReady) {
        // Crashed mid-session (typically GPU out-of-memory). Don't try the GPU again.
        getLogger().warn(
          `llama-server (${backend}) ${exitDetail} after startup:\n${readLogTail()}`,
        );
        if (backend !== "cpu") {
          gpuDisabledReason = `The ${backend} runtime stopped unexpectedly`;
        }
      }
    }
  });

  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  const healthUrl = `http://127.0.0.1:${port}/health`;

  while (Date.now() < deadline) {
    await sleep(HEALTH_POLL_MS);

    if (generation !== startGeneration) {
      child.kill();
      throw new Error("Model loading was superseded by another selection.");
    }

    if (exitDetail) {
      if (running === current) {
        running = null;
      }
      throw new RuntimeExitedError(
        backend,
        `${backend} runtime ${exitDetail}.\n${readLogTail()}`,
      );
    }

    try {
      const response = await fetch(healthUrl, {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        current.ready = true;
        return current;
      }
    } catch {
      // Still loading.
    }
  }

  child.kill();
  if (running === current) {
    running = null;
  }
  throw new Error(
    `The model did not become ready within three minutes. See ${getLogPath()} for details.`,
  );
}

function toStatus(current: Running | null): LocalLlmStatus {
  if (!current?.ready) {
    return { ready: false, loading: pendingStart !== null };
  }

  return {
    ready: true,
    loading: pendingStart !== null,
    backend: current.backend,
    model: path.basename(current.modelPath),
    contextSize: current.contextSize,
    fallbackReason: current.fallbackReason,
  };
}

async function doStart(
  modelPath: string,
  requested: LocalBackend,
  requestedContext: number,
): Promise<LocalLlmStatus> {
  const contextSize = LOCAL_CONTEXT_SIZES.includes(requestedContext)
    ? requestedContext
    : LOCAL_CONTEXT_SIZES[1];
  const wanted: RuntimeBackend =
    requested === "auto"
      ? await pickAutoBackend()
      : requested !== "cpu" && gpuDisabledReason
        ? "cpu"
        : requested;

  if (
    running?.ready &&
    running.modelPath === modelPath &&
    running.backend === wanted &&
    running.contextSize === contextSize &&
    running.child.exitCode === null
  ) {
    return toStatus(running);
  }

  const generation = ++startGeneration;
  stopLocalLlm(false);

  try {
    const current = await launch({
      modelPath,
      backend: wanted,
      contextSize,
      generation,
    });
    if (gpuDisabledReason && wanted === "cpu" && requested !== "cpu") {
      current.fallbackReason = gpuDisabledReason;
    }
    return toStatus(current);
  } catch (error) {
    if (
      error instanceof RuntimeExitedError &&
      error.backend !== "cpu" &&
      getRuntimeExecutable("cpu") &&
      generation === startGeneration
    ) {
      getLogger().warn(
        `llama-server (${error.backend}) failed, retrying on CPU:\n${error.message}`,
      );
      gpuDisabledReason = `The ${error.backend} runtime failed to start`;

      const current = await launch({
        modelPath,
        backend: "cpu",
        contextSize,
        generation,
      });
      current.fallbackReason = `${gpuDisabledReason}, so the model is running on the CPU.`;
      return toStatus(current);
    }

    throw error;
  }
}

export function startLocalLlm(
  modelPath: string,
  backend: LocalBackend,
  contextSize: number,
): Promise<LocalLlmStatus> {
  // Serialize starts so a quick model switch can't leave two servers running.
  const previous: Promise<unknown> = pendingStart ?? Promise.resolve();
  const next: Promise<LocalLlmStatus> = previous
    .catch((): null => null)
    .then(() => doStart(modelPath, backend, contextSize));
  pendingStart = next;
  next
    .catch((): null => null)
    .finally(() => {
      if (pendingStart === next) {
        pendingStart = null;
      }
    });

  return next;
}

export function stopLocalLlm(invalidatePendingStart = true) {
  if (invalidatePendingStart) {
    startGeneration++;
  }

  const current = running;
  running = null;

  if (current && current.child.exitCode === null) {
    current.child.kill();
  }
}

export function getLocalLlmStatus(): LocalLlmStatus {
  return toStatus(running);
}

export function getLocalLlmEndpoint(): { url: string; apiKey: string } | null {
  if (!running?.ready || running.child.exitCode !== null) {
    return null;
  }

  return {
    url: `http://127.0.0.1:${running.port}/v1/chat/completions`,
    apiKey: running.key,
  };
}

export function getLocalLlmLogPath(): string {
  return getLogPath();
}
