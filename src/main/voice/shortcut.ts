import { globalShortcut } from "electron";

import { IpcMessages } from "../../shared/ipc-messages";
import {
  DEFAULT_VOICE_SHORTCUT,
  VoiceShortcutStatus,
} from "../../shared/voice";
import { getLogger } from "../logger";
import { getStateManager } from "../state";
import { getMainWindow, raiseMainWindow } from "../windows";

// The global "talk to the buddy" shortcut: press to start listening, press
// again to stop and transcribe. Registered only while voice input is on.

let registered: string | null = null;
let status: VoiceShortcutStatus = {
  accelerator: DEFAULT_VOICE_SHORTCUT,
  registered: false,
};

export function getVoiceShortcutStatus(): VoiceShortcutStatus {
  return status;
}

export function syncVoiceShortcut() {
  const settings = getStateManager().getSettings();
  const accelerator = (settings.voiceShortcut || DEFAULT_VOICE_SHORTCUT).trim();
  const wanted = process.platform === "win32" && settings.voiceEnabled;

  if (registered && (registered !== accelerator || !wanted)) {
    globalShortcut.unregister(registered);
    registered = null;
  }

  if (!wanted) {
    status = { accelerator, registered: false };
    return;
  }
  if (registered === accelerator) return;

  let ok = false;
  let error: string | undefined;
  try {
    ok = globalShortcut.register(accelerator, onShortcut);
    if (!ok) error = "Another app is already using this shortcut.";
  } catch {
    error = "This isn't a valid shortcut. Example: Ctrl+Alt+B";
  }

  registered = ok ? accelerator : null;
  status = { accelerator, registered: ok, error };
  getLogger().info(
    ok
      ? `Registered voice shortcut ${accelerator}`
      : `Could not register voice shortcut ${accelerator}: ${error}`,
  );
}

function onShortcut() {
  const window = getMainWindow();
  if (!window || window.isDestroyed()) return;

  if (!window.isVisible()) window.showInactive();
  raiseMainWindow();
  window.webContents.send(IpcMessages.VOICE_SHORTCUT);
}
