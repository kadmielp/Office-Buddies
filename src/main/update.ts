import { app, autoUpdater, dialog, shell } from "electron";
import { updateElectronApp, UpdateSourceType } from "update-electron-app";
import { getLogger } from "./logger";
import { getStateManager } from "./state";
import fs from "fs";
import path from "path";

const DEFAULT_UPDATE_REPO = "felixrieseberg/clippy";

/**
 * Setup the auto updater
 */
export function setupAutoUpdater() {
  let disableAutoUpdate = false;

  try {
    disableAutoUpdate =
      getStateManager().store.get("settings")?.disableAutoUpdate;
  } catch (error) {
    getLogger().warn("Failed to get settings from state manager", error);
  }

  if (!disableAutoUpdate) {
    const repo = getUpdateRepo();
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo,
      },
      updateInterval: "1 hour",
      logger: require("electron-log"),
    });
  }
}

/**
 * Check if a new update is available
 *
 * @returns {Promise<boolean>} True if a new update is available, false otherwise
 */
export function getIsNewUpdateAvailable() {
  return new Promise((resolve, reject) => {
    if (!autoUpdater.getFeedURL()) {
      return reject(`The auto updater did not initialize with a feed URL`);
    }

    autoUpdater.once("update-available", () => {
      resolve(true);
    });

    autoUpdater.once("update-not-available", () => {
      resolve(false);
    });

    autoUpdater.checkForUpdates();
  });
}

/**
 * Check for updates
 *
 * @returns {Promise<void>}
 */
export async function checkForUpdates() {
  if (!app.isPackaged) {
    return dialog.showMessageBox({
      type: "info",
      title: "Update Check",
      message:
        "You are running a development version of Office Buddies, so the auto updater is disabled.",
    });
  }

  try {
    const [comparisonString, isUpdateAvailable] = await Promise.all([
      getVersionComparisonString(),
      getIsNewUpdateAvailable(),
    ]);

    if (isUpdateAvailable) {
      await dialog.showMessageBox({
        type: "info",
        title: "Update Available",
        message: `${comparisonString} The auto updater is already downloading the update in the background.`,
      });
    } else {
      await dialog.showMessageBox({
        type: "info",
        title: "You're Up-to-Date",
        message: `${comparisonString} You are already using the latest version of Office Buddies.`,
      });
    }
  } catch (error) {
    const result = await dialog.showMessageBox({
      type: "error",
      title: "Update Check Failed",
      message: `An error occurred while running the auto updater: ${error}. Would you like to visit the homepage to check for updates manually?`,
      buttons: ["Open Homepage", "Cancel"],
    });

    if (result.response === 0) {
      shell.openExternal("https://felixrieseberg.github.io/clippy/");
    }
  }
}

/**
 * Get the version comparison string
 *
 * @returns {Promise<string>} The version comparison string
 */
export async function getVersionComparisonString() {
  const latestVersionTagName = await getLatestVersionFromGitHub(getUpdateRepo());
  const latestVersionString = latestVersionTagName
    ? `  The latest published version is ${latestVersionTagName}.`
    : "";

  return `You are on version ${app.getVersion()}.${latestVersionString}`;
}

/**
 * Get's the latest version's tag_name from GitHub. Returns null if it fails.
 *
 * @returns {Promise<string>} The latest version from GitHub
 */
export async function getLatestVersionFromGitHub(
  repo: string,
): Promise<string | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    const data = await response.json();
    return data.tag_name;
  } catch (error) {
    getLogger().warn("Failed to fetch latest version from GitHub", error);

    return null;
  }
}

function getUpdateRepo(): string {
  try {
    const packageJsonPath = path.join(app.getAppPath(), "package.json");
    const packageJsonString = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonString) as {
      repository?: string | { url?: string };
    };
    const repository = packageJson.repository;
    const repositoryUrl =
      typeof repository === "string" ? repository : repository?.url;
    const parsedRepo = parseGithubRepo(repositoryUrl);

    if (parsedRepo) {
      return parsedRepo;
    }
  } catch (error) {
    getLogger().warn("Failed to determine update repository from package.json", error);
  }

  return DEFAULT_UPDATE_REPO;
}

function parseGithubRepo(repositoryUrl?: string): string | null {
  if (!repositoryUrl) {
    return null;
  }

  const trimmed = repositoryUrl.trim();
  const withoutGitSuffix = trimmed.replace(/\.git$/i, "");
  const normalized = withoutGitSuffix.replace(/^git\+/, "");

  const httpsMatch = normalized.match(/github\.com[/:]([^/]+\/[^/]+)$/i);
  if (httpsMatch?.[1]) {
    return httpsMatch[1];
  }

  const shortMatch = normalized.match(/^([^/]+\/[^/]+)$/);
  if (shortMatch?.[1]) {
    return shortMatch[1];
  }

  return null;
}
