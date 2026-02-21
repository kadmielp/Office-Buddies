import { app, clipboard, globalShortcut } from "electron";
import { execFile } from "child_process";
import { IpcMessages } from "../ipc-messages";
import { BuddyAction, BuddySpeechPayload } from "../types/interfaces";
import { getLogger } from "./logger";
import { getMainWindow } from "./windows";
import { runBuddyAction } from "./buddy-actions";

const SHORTCUTS: Array<{
  accelerator: string;
  action: BuddyAction;
  label: string;
}> = [
  { accelerator: "Super+F2", action: "define", label: "Define" },
  { accelerator: "Super+F3", action: "summarize", label: "Summarize" },
  { accelerator: "Super+F5", action: "rewrite-friendly", label: "Rewrite" },
];

export function registerGlobalShortcuts() {
  if (process.platform !== "win32") {
    return;
  }

  for (const shortcut of SHORTCUTS) {
    const registered = globalShortcut.register(shortcut.accelerator, () => {
      void triggerBuddyAction(shortcut.action);
    });

    if (!registered) {
      getLogger().warn(
        `Failed to register global shortcut ${shortcut.accelerator} (${shortcut.label})`,
      );
      continue;
    }

    getLogger().info(
      `Registered global shortcut ${shortcut.accelerator} (${shortcut.label})`,
    );
  }
}

export function unregisterGlobalShortcuts() {
  globalShortcut.unregisterAll();
}

async function triggerBuddyAction(action: BuddyAction) {
  if (!app.isReady()) {
    return;
  }

  const text =
    process.platform === "win32"
      ? await captureForegroundSelectionText()
      : clipboard.readText().trim();

  if (!text) {
    sendBuddySpeech({
      action,
      selectedText: "",
      speech:
        "I couldn't read selected text. Select text and try again.",
      isLoading: false,
    });
    return;
  }

  await runBuddyAction(action, text);
}

function sendBuddySpeech(payload: BuddySpeechPayload) {
  const mainWindow = getMainWindow();

  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send(IpcMessages.CONTEXT_MENU_BUDDY_SPEECH, payload);
}

async function captureForegroundSelectionText(): Promise<string> {
  const originalClipboardText = clipboard.readText();
  const marker = `__OFFICE_BUDDIES_SELECTION_MARKER_${Date.now()}__`;

  try {
    // Let Windows/global shortcut modifiers settle before sending Ctrl+C.
    await wait(220);
    clipboard.writeText(marker, "clipboard");
    await trySendCopyShortcut();

    const copiedText = await waitForClipboardCapture(marker, 1200);
    if (copiedText) {
      return copiedText;
    }
  } catch (error) {
    getLogger().warn("Failed to auto-copy selected text", error);
  } finally {
    clipboard.writeText(originalClipboardText, "clipboard");
  }

  return "";
}

async function trySendCopyShortcut(): Promise<void> {
  // Primary method
  try {
    await runPowerShell(
      "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^c')",
    );
    return;
  } catch {
    // fallback below
  }

  // Fallback method
  await runPowerShell(
    "$ws = New-Object -ComObject WScript.Shell; $ws.SendKeys('^c')",
  );
}

async function waitForClipboardCapture(
  marker: string,
  timeoutMs: number,
): Promise<string> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    await wait(80);
    const value = clipboard.readText().trim();

    if (value && value !== marker) {
      return value;
    }
  }

  return "";
}

function runPowerShell(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", command],
      { windowsHide: true },
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      },
    );
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
