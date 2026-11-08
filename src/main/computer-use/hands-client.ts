import { app } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

import { getLogger } from "../logger";

// The native helper (tools/buddy-hands) runs once and answers JSON lines, so
// each action skips the 0.4 s it takes to start the CLR and UI Automation.

export interface HandsResult {
  ok: boolean;
  // Reads (see, read, windows, open, show) answer with text.
  text?: string;
  // Actions (click, type, press) answer with what they did and the new state.
  did?: string;
  changed?: boolean;
  map?: string;
  error?: string;
  ms?: number;
}

const REQUEST_TIMEOUT_MS = 30_000;

let helper: ChildProcessWithoutNullStreams | null = null;
let nextId = 1;
const pending = new Map<
  number,
  { resolve: (result: HandsResult) => void; timer: NodeJS.Timeout }
>();
// One action at a time: the helper is single-threaded and so is the screen.
let queue: Promise<unknown> = Promise.resolve();

export function getHandsHelperPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, "buddy-hands", "buddy-hands.exe")
    : path.join(
        app.getAppPath(),
        "resources",
        "buddy-hands",
        "buddy-hands.exe",
      );
}

export function isHandsAvailable(): boolean {
  return process.platform === "win32" && fs.existsSync(getHandsHelperPath());
}

function start(): ChildProcessWithoutNullStreams {
  if (helper && helper.exitCode === null && !helper.killed) {
    return helper;
  }

  const child = spawn(getHandsHelperPath(), ["--serve"], {
    windowsHide: true,
    env: { ...process.env, BUDDY_HANDS_OWNER_PID: String(process.pid) },
  });

  readline.createInterface({ input: child.stdout }).on("line", (line) => {
    let result: HandsResult & { id?: number };
    try {
      result = JSON.parse(line);
    } catch {
      getLogger().warn(`buddy-hands: unreadable line: ${line.slice(0, 200)}`);
      return;
    }
    const entry = result.id !== undefined ? pending.get(result.id) : undefined;
    if (entry) {
      clearTimeout(entry.timer);
      pending.delete(result.id!);
      entry.resolve(result);
    }
  });
  child.stderr.on("data", (data) =>
    getLogger().warn(`buddy-hands: ${String(data).trim()}`),
  );
  child.on("exit", (code) => {
    getLogger().info(`buddy-hands exited (${code})`);
    if (helper === child) helper = null;
    for (const [id, entry] of pending) {
      clearTimeout(entry.timer);
      entry.resolve({ ok: false, error: "The hands helper stopped." });
      pending.delete(id);
    }
  });

  helper = child;
  return child;
}

export function callHands(
  args: string[],
  options: { allowRisky?: boolean } = {},
): Promise<HandsResult> {
  const run = () =>
    new Promise<HandsResult>((resolve) => {
      if (!isHandsAvailable()) {
        resolve({
          ok: false,
          error:
            'The hands helper is missing. Run "npm run build:hands" and restart.',
        });
        return;
      }

      const child = start();
      const id = nextId++;
      const timer = setTimeout(() => {
        pending.delete(id);
        // A hung UI Automation call: restart the helper for the next action.
        child.kill();
        resolve({ ok: false, error: "The app did not respond in time." });
      }, REQUEST_TIMEOUT_MS);

      pending.set(id, { resolve, timer });
      child.stdin.write(
        JSON.stringify({ id, args, allowRisky: !!options.allowRisky }) + "\n",
      );
    });

  const result = queue.then(run, run);
  queue = result.catch(() => {});
  return result;
}

// Stops whatever the helper is doing (the user pressed Abort).
export function stopHands() {
  helper?.kill();
  helper = null;
}
