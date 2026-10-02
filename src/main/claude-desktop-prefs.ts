import fs from "fs";
import path from "path";
import { app } from "electron";

import { getLogger } from "./logger";
import { getStateManager } from "./state";

// The Claude desktop app's notification setting: each kind is "banner" (a
// Windows pop-up), "badge" (taskbar badge only) or "off".
type NotificationLevel = "off" | "badge" | "banner";
type NotificationLevels = Partial<
  Record<"permission" | "idle" | "question", NotificationLevel>
>;

const QUIET_LEVELS: Required<NotificationLevels> = {
  permission: "badge",
  idle: "badge",
  question: "badge",
};

export function getClaudeDesktopConfigPath(): string {
  return path.join(
    app.getPath("appData"),
    "Claude",
    "claude_desktop_config.json",
  );
}

export function isClaudeDesktopInstalled(): boolean {
  return fs.existsSync(getClaudeDesktopConfigPath());
}

// Whether Claude's own pop-ups are off for everything the buddy shows.
export function areClaudePopupsHidden(): boolean {
  const levels = readLevels();

  return (Object.keys(QUIET_LEVELS) as Array<keyof NotificationLevels>).every(
    (kind) => levels?.[kind] !== undefined && levels[kind] !== "banner",
  );
}

// Switches Claude's pop-ups to taskbar badges, remembering the previous
// values, or puts the previous values back. Claude reads this file when it
// starts, so the change applies after Claude restarts.
export function setClaudePopupsHidden(hidden: boolean) {
  const configPath = getClaudeDesktopConfigPath();

  if (!fs.existsSync(configPath)) {
    return;
  }

  const config = JSON.parse(
    fs.readFileSync(configPath, "utf8").replace(/^\uFEFF/, ""),
  );
  const preferences = config.preferences ?? {};
  const stateManager = getStateManager();

  if (hidden) {
    if (!areClaudePopupsHidden()) {
      stateManager.setStateValue(
        "settings.claudeNotificationLevelsBackup",
        preferences.notificationLevels ?? {},
      );
    }

    preferences.notificationLevels = {
      ...(preferences.notificationLevels ?? {}),
      ...QUIET_LEVELS,
    };
  } else {
    preferences.notificationLevels =
      stateManager.getSettings().claudeNotificationLevelsBackup ?? {};
  }

  config.preferences = preferences;

  fs.copyFileSync(configPath, `${configPath}.officebuddies.bak`);
  const tempPath = `${configPath}.officebuddies.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  fs.renameSync(tempPath, configPath);
  getLogger().info(`Claude pop-ups ${hidden ? "hidden" : "restored"}`);
}

function readLevels(): NotificationLevels | undefined {
  try {
    const config = JSON.parse(
      fs
        .readFileSync(getClaudeDesktopConfigPath(), "utf8")
        .replace(/^\uFEFF/, ""),
    );

    return config.preferences?.notificationLevels;
  } catch {
    return undefined;
  }
}
