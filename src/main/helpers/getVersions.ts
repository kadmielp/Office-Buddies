import { app } from "electron";
import { Versions } from "../../types/interfaces";
import { LLAMA_CPP_RELEASE } from "../../shared/local-llm";

/**
 * Get the versions of the application
 *
 * @returns {Versions} The versions of the application
 */
export async function getVersions(): Promise<Versions> {
  const versions = {
    ...process.versions,
    clippy: app.getVersion(),
    llamaCpp: LLAMA_CPP_RELEASE,
  } as Versions;

  return versions;
}
