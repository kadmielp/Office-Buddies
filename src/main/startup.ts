import path from "path";

import { app } from "electron";

import { getLogger } from "./logger";

type LoginItemSettings = Parameters<typeof app.setLoginItemSettings>[0];
type LoginItemQuery = Pick<LoginItemSettings, "path" | "args">;
type LaunchItem = NonNullable<
  ReturnType<typeof app.getLoginItemSettings>["launchItems"]
>[number];

function getWindowsStartupQuery(): LoginItemQuery {
  if (!isWindowsStartupSupported()) {
    return {};
  }

  const appFolder = path.dirname(process.execPath);
  const exeName = path.basename(process.execPath);
  const stubLauncher = path.resolve(appFolder, "..", exeName);

  return {
    path: stubLauncher,
    args: [],
  };
}

function getWindowsStartupSettings(openAtLogin: boolean): LoginItemSettings {
  const query = getWindowsStartupQuery();

  return {
    ...query,
    openAtLogin,
    ...(openAtLogin ? { enabled: true } : {}),
  };
}

function normalizePath(value: string | undefined): string {
  return (value || "").trim().toLowerCase();
}

function normalizeArgs(value: string[] | undefined): string[] {
  return (value || []).map((arg) => arg.trim());
}

function argsMatch(left: string[] | undefined, right: string[] | undefined) {
  const normalizedLeft = normalizeArgs(left);
  const normalizedRight = normalizeArgs(right);

  if (normalizedLeft.length !== normalizedRight.length) {
    return false;
  }

  return normalizedLeft.every((arg, index) => arg === normalizedRight[index]);
}

function getMatchingLaunchItem(
  launchItems: LaunchItem[] | undefined,
  query: LoginItemQuery,
): LaunchItem | undefined {
  if (!launchItems?.length || !query.path) {
    return undefined;
  }

  const normalizedPath = normalizePath(query.path);

  return launchItems.find(
    (launchItem) =>
      normalizePath(launchItem.path) === normalizedPath &&
      argsMatch(launchItem.args, query.args),
  );
}

export function getWindowsStartupEnabled(): boolean {
  if (!isWindowsStartupSupported()) {
    return false;
  }

  try {
    const query = getWindowsStartupQuery();
    const loginItemSettings = app.getLoginItemSettings(query);
    const matchingLaunchItem = getMatchingLaunchItem(
      loginItemSettings.launchItems,
      query,
    );

    if (!loginItemSettings.openAtLogin) {
      return false;
    }

    if (matchingLaunchItem) {
      return matchingLaunchItem.enabled;
    }

    if (typeof loginItemSettings.executableWillLaunchAtLogin === "boolean") {
      return loginItemSettings.executableWillLaunchAtLogin;
    }

    return loginItemSettings.openAtLogin;
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
    app.setLoginItemSettings(getWindowsStartupSettings(openAtLogin));
  } catch (error) {
    getLogger().error("Failed to update Windows startup setting", error);
    return false;
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
