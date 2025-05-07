import { app } from "electron";
import * as fs from "fs";
import { Versions } from "../../types/interfaces";
import { getLogger } from "../logger";
import path from "path";

/**
 * Get the versions of the application
 *
 * @returns {Versions} The versions of the application
 */
export async function getVersions(): Promise<Versions> {
  const versions = {
    ...process.versions,
    clippy: app.getVersion(),
    nodeLlamaCpp: await readPackageVersion("node-llama-cpp"),
  } as Versions;

  return versions;
}

async function readPackageVersion(packageName: string): Promise<string | null> {
  let result = null;

  try {
    let packagePath = path.dirname(require.resolve(packageName));
    while (path.basename(packagePath) !== packageName && packagePath !== "/") {
      packagePath = path.dirname(packagePath);
    }

    if (path.basename(packagePath) !== packageName) {
      throw new Error(`Could not find package ${packageName}`);
    }

    const packageJsonPath = path.join(packagePath, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      const packageJsonString = await fs.promises.readFile(
        packageJsonPath,
        "utf-8",
      );
      const packageJson = JSON.parse(packageJsonString);
      result = packageJson.version;
    } else {
      throw new Error(
        `Could not find package.json for ${packageName} in ${packageJsonPath}`,
      );
    }
  } catch (error) {
    getLogger().warn(
      `Failed to read package version for ${packageName}`,
      error,
    );
  }

  return result;
}
