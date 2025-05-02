import { updateElectronApp, UpdateSourceType } from "update-electron-app";

export function setupAutoUpdater() {
  updateElectronApp({
    updateSource: {
      type: UpdateSourceType.ElectronPublicUpdateService,
      repo: "felixrieseberg/clippy",
    },
    updateInterval: "1 hour",
    logger: require("electron-log"),
  });
}
