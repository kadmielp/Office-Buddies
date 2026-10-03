import { app } from "electron";
import path from "path";
import fs from "fs";

import { ClippyDebugInfo, NestedRecord } from "../types/interfaces";
import { getLogger } from "./logger";

/**
 * Get debug information for the Llama binary
 *
 * @returns {Promise<ClippyDebugInfo>} The debug information
 */
export async function getClippyDebugInfo(): Promise<ClippyDebugInfo> {
  const debugInfo: ClippyDebugInfo = {
    platform: process.platform,
    arch: process.arch,
    versions: process.versions,
    llamaBinaries: getLlamaRuntimes(),
    llamaBinaryFiles: {},
    checks: await getDebugChecks(),
    gpu: await app.getGPUInfo("complete"),
  };

  for (const llamaBinary of debugInfo.llamaBinaries) {
    debugInfo.llamaBinaryFiles[llamaBinary] =
      await getLlamaBinaryFiles(llamaBinary);
  }

  return debugInfo;
}

/**
 * Runs a series of checks to determine the state of the environment
 * and the availability of certain packages.
 *
 * @returns {Promise<Record<string, boolean | string>>} An object containing the results of the checks.
 *          Each key is the name of the check, and the value is either a boolean
 *          indicating success or failure, or a string describing the error.
 */
async function getDebugChecks(): Promise<Record<string, boolean | string>> {
  const checks: Record<string, boolean | string> = {};
  const checksToRun: Array<{
    name: string;
    check: () => Promise<boolean> | boolean;
  }> = [
    {
      name: "can-see-llama-runtimes-folder",
      check: () => fs.existsSync(getLlamaRuntimesPath()),
    },
    {
      name: "can-see-llama-runtimes",
      check: () => getLlamaRuntimes().length > 0,
    },
    {
      name: "can-see-cpu-llama-runtime",
      check: () => getLlamaRuntimes().includes("cpu"),
    },
  ];

  for (const { name, check } of checksToRun) {
    try {
      const result = await check();
      checks[name] = !!result;
    } catch (error) {
      getLogger().log(`Error running check ${name}:`, error);
      checks[name] = `${error}`;
    }
  }

  return checks;
}

/**
 * Folder holding the bundled llama.cpp runtimes (cpu / vulkan / cuda)
 */
function getLlamaRuntimesPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, "local_gguf")
    : path.join(app.getAppPath(), "resources", "local_gguf");
}

/**
 * Returns the bundled llama.cpp runtimes that contain a llama-server binary
 */
function getLlamaRuntimes(): Array<string> {
  const root = getLlamaRuntimesPath();

  try {
    return fs
      .readdirSync(root)
      .filter((entry) =>
        fs.existsSync(path.join(root, entry, "llama-server.exe")),
      );
  } catch (error) {
    getLogger().warn("Error reading llama runtimes directory:", error);
    return [];
  }
}

/**
 * Returns the files inside a llama runtime directory
 */
async function getLlamaBinaryFiles(
  llamaBinary: string,
): Promise<NestedRecord<number>> {
  try {
    return await readDirectory(path.join(getLlamaRuntimesPath(), llamaBinary));
  } catch (error) {
    getLogger().warn("Error reading llama runtime directory:", error);

    return {
      error: -1,
    };
  }
}

/**
 * UNSAFE HELPERS
 */

/**
 * Get the path to the node_modules directory
 *
 * @returns {string} The path to the node_modules directory
 * @throws {Error} If the node_modules directory cannot be found
 */
function getNodeModulesPath(): string {
  const nodeModulesPath = path.join(app.getAppPath(), "node_modules");

  if (!fs.existsSync(nodeModulesPath)) {
    throw new Error(`node_modules directory not found at ${nodeModulesPath}`);
  }

  return nodeModulesPath;
}

/**
 * Recursively reads a directory and returns its contents as a nested object.
 *
 * @param {string} dir - The directory to read.
 * @returns {Promise<NestedRecord<number>>} A promise that resolves to an object
 *          representing the directory contents.
 */
async function readDirectory(dir: string): Promise<NestedRecord<number>> {
  const result: NestedRecord<number> = {};

  try {
    for (const entry of await fs.promises.readdir(dir)) {
      const entryPath = path.join(dir, entry);
      const stat = await fs.promises.stat(entryPath);

      if (fs.statSync(entryPath).isDirectory()) {
        result[entry] = await readDirectory(entryPath);
      } else {
        result[entry] = stat.size;
      }
    }
  } catch (error) {
    getLogger().warn("Error reading directory:", error);

    result["error"] = -1;
  }

  return result;
}
