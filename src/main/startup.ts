import { execFileSync } from "child_process";
import path from "path";

import { app } from "electron";

import { getLogger } from "./logger";

const RUN_KEY = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run";
const APPROVED_KEY =
  "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\StartupApproved\\Run";
const VALUE_NAME = "OfficeBuddies";

// With Squirrel installs the running exe lives in a versioned `app-x.y.z`
// folder that changes on every update. The stub one level up always launches
// the latest version, so that is what the startup entry must point at.
function getStartupExePath(): string {
  const appFolder = path.dirname(process.execPath);
  const exeName = path.basename(process.execPath);

  return path.resolve(appFolder, "..", exeName);
}

function reg(args: string[]): string {
  return execFileSync("reg", args, {
    encoding: "utf8",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function readRegistryValue(key: string, name: string): string | null {
  try {
    const output = reg(["query", key, "/v", name]);
    const line = output
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(name));

    if (!line) {
      return null;
    }

    const match = line.trim().match(/^\S+\s+REG_\w+\s+(.*)$/);
    return match ? match[1].trim() : null;
  } catch {
    // `reg query` exits non-zero when the value does not exist.
    return null;
  }
}

// Task Manager's Startup tab records "disabled" as a binary value that
// starts with an odd byte (e.g. 03 00 00 00 ...).
function isDisabledInTaskManager(): boolean {
  const data = readRegistryValue(APPROVED_KEY, VALUE_NAME);

  if (!data) {
    return false;
  }

  return /^0*[13579bdf]/i.test(data.replace(/^0x/i, "").slice(0, 2));
}

export function getWindowsStartupEnabled(): boolean {
  if (!isWindowsStartupSupported()) {
    return false;
  }

  try {
    const command = readRegistryValue(RUN_KEY, VALUE_NAME);

    if (!command) {
      return false;
    }

    const registered = command.replace(/^"|"$/g, "").toLowerCase();

    return (
      registered === getStartupExePath().toLowerCase() &&
      !isDisabledInTaskManager()
    );
  } catch (error) {
    getLogger().error("Failed to read Windows startup setting", error);
    return false;
  }
}

export function syncWindowsStartupSetting(
  enabled: boolean | undefined,
): boolean {
  const openAtLogin = Boolean(enabled);

  if (!isWindowsStartupSupported()) {
    return false;
  }

  try {
    if (openAtLogin) {
      reg([
        "add",
        RUN_KEY,
        "/v",
        VALUE_NAME,
        "/t",
        "REG_SZ",
        "/d",
        `"${getStartupExePath()}"`,
        "/f",
      ]);

      // Clear a leftover "disabled" flag from Task Manager's Startup tab.
      try {
        reg(["delete", APPROVED_KEY, "/v", VALUE_NAME, "/f"]);
      } catch {
        // Nothing to clear.
      }
    } else {
      try {
        reg(["delete", RUN_KEY, "/v", VALUE_NAME, "/f"]);
      } catch {
        // Already removed.
      }
    }
  } catch (error) {
    getLogger().error("Failed to update Windows startup setting", error);
    return getWindowsStartupEnabled();
  }

  const actualValue = getWindowsStartupEnabled();

  if (actualValue !== openAtLogin) {
    getLogger().warn("Windows startup setting did not match requested value", {
      requested: openAtLogin,
      actual: actualValue,
    });
  }

  return actualValue;
}

function isWindowsStartupSupported(): boolean {
  return process.platform === "win32" && app.isPackaged;
}
