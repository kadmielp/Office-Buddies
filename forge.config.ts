import { Walker, DepType, type Module } from "flora-colossus";
import * as fs from "node:fs";
import path from "path";
import dotenv from "dotenv";
import os from "os";
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");
dotenv.config();

let nativeModuleDependenciesToPackage: string[] = [];

const FLAGS = {
  IS_CODESIGNING_ENABLED: process.env.IS_CODESIGNING_ENABLED === "true",
  SIGNTOOL_PATH:
    process.env.SIGNTOOL_PATH ||
    path.join(
      __dirname,
      "Microsoft.Windows.SDK.BuildTools/bin/10.0.26100.0/x64/signtool.exe",
    ),
  AZURE_CODE_SIGNING_DLIB:
    process.env.AZURE_CODE_SIGNING_DLIB ||
    path.join(
      __dirname,
      "Microsoft.Trusted.Signing.Client/bin/x64/Azure.CodeSigning.Dlib.dll",
    ),
  AZURE_METADATA_JSON_PATH:
    process.env.AZURE_METADATA_JSON ||
    path.resolve(__dirname, "trusted-signing-metadata.json"),
  AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
  AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
  APPLE_ID: process.env.APPLE_ID,
  APPLE_ID_PASSWORD: process.env.APPLE_ID_PASSWORD,
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
  APPLE_SIGNING_IDENTITY: process.env.APPLE_SIGNING_IDENTITY,
};

const EXTERNAL_DEPENDENCIES = ["electron-log"];

const windowsSign: any = {
  signToolPath: FLAGS.SIGNTOOL_PATH,
  signWithParams: `/v /dlib ${FLAGS.AZURE_CODE_SIGNING_DLIB} /dmdf ${FLAGS.AZURE_METADATA_JSON_PATH}`,
  timestampServer: "http://timestamp.acs.microsoft.com",
  hashes: ["sha256"],
};

const APP_BUNDLE_ID = getAppBundleId(
  packageJson.name,
  packageJson.author?.name,
);

setup();

const config: ForgeConfig = {
  hooks: {
    prePackage: async () => {
      nativeModuleDependenciesToPackage = Array.from(
        await getExternalNestedDependencies(EXTERNAL_DEPENDENCIES),
      );
    },
    packageAfterPrune: async (_forgeConfig, buildPath) => {
      const getItems = getItemsFromFolder(buildPath) ?? [];

      for (const item of getItems) {
        const DELETE_EMPTY_DIRECTORIES = true;

        if (item.empty === true) {
          if (DELETE_EMPTY_DIRECTORIES) {
            const pathToDelete = path.normalize(item.path);
            // one last check to make sure it is a directory and is empty
            const stats = fs.statSync(pathToDelete);
            if (!stats.isDirectory()) {
              // SKIPPING DELETION: pathToDelete is not a directory
              return;
            }
            const childItems = fs.readdirSync(pathToDelete);
            if (childItems.length !== 0) {
              // SKIPPING DELETION: pathToDelete is not empty
              return;
            }
            fs.rmdirSync(pathToDelete);
          }
        }
      }
    },
  },
  packagerConfig: {
    asar: true,
    ignore: (file) => {
      const filePath = file.toLowerCase().replace(/\\/g, "/");
      const result = {
        keep: false,
        log: true,
      };

      const foldersToIgnore = [
        "/@types/",
        "/test/",
        "/.github/",
        "/.git/",
        "/Microsoft.Trusted.Signing.Client/",
        "/Microsoft.Windows.SDK.BuildTools/",
        "/website/",
      ];

      const extensionsToIgnore = [
        ".DS_Store",
        ".gitignore",
        ".gitmodules",
        ".target.mk",
        ".config.gypi",
        ".o",
        ".obj",
        ".ts",
        ".tsbuildinfo",
        ".map",
        ".d",
        ".ts",
        ".ts.snap",
        ".cmake",
        ".cpp",
        ".h",
        ".md",
        ".nycrc",
        "tsconfig.json",
        ".travis.yml",
        ".eslintrc",
        ".markdown",
        "CHANGELOG.md",
        "README.md",
        "HISTORY.md",
        "GOVERNANCE.md",
        "CONTRIBUTING.md",
        "CODE_OF_CONDUCT.md",
        "SECURITY.md",
      ];

      // NOTE: must return false for empty string or nothing will be packaged
      if (filePath === "") result.keep = true;
      if (!result.keep && filePath === "/package.json") result.keep = true;
      if (!result.keep && filePath === "/node_modules") result.keep = true;
      if (!result.keep && filePath === "/.vite") result.keep = true;
      if (!result.keep && filePath.startsWith("/.vite/")) result.keep = true;
      if (!result.keep && filePath.startsWith("/node_modules/")) {
        if (foldersToIgnore.some((folder) => filePath.includes(folder))) {
          result.keep = false;
        } else {
          // check if matches any of the external dependencies
          for (const dep of nativeModuleDependenciesToPackage) {
            if (
              filePath === `/node_modules/${dep}/` ||
              filePath === `/node_modules/${dep}`
            ) {
              result.keep = true;
              break;
            }
            if (filePath === `/node_modules/${dep}/package.json`) {
              result.keep = true;
              break;
            }
            if (filePath.startsWith(`/node_modules/${dep}/`)) {
              result.keep = true;
              result.log = false;
              break;
            }
          }
        }
      }

      if (extensionsToIgnore.some((ext) => filePath.endsWith(ext))) {
        result.keep = false;
      }

      if (result.keep) {
        if (result.log) console.log("Keeping:", file);
        return false;
      }

      return true;
    },
    appBundleId: APP_BUNDLE_ID,
    appCategoryType: "public.app-category.productivity",
    win32metadata: {
      CompanyName: packageJson.author?.name || packageJson.productName,
      OriginalFilename: "OfficeBuddies",
    },
    osxSign: FLAGS.IS_CODESIGNING_ENABLED
      ? FLAGS.APPLE_SIGNING_IDENTITY
        ? {
            identity: FLAGS.APPLE_SIGNING_IDENTITY,
          }
        : {}
      : undefined,
    osxNotarize: FLAGS.IS_CODESIGNING_ENABLED
      ? FLAGS.APPLE_ID && FLAGS.APPLE_ID_PASSWORD && FLAGS.APPLE_TEAM_ID
        ? {
            appleId: FLAGS.APPLE_ID,
            appleIdPassword: FLAGS.APPLE_ID_PASSWORD,
            teamId: FLAGS.APPLE_TEAM_ID,
          }
        : undefined
      : undefined,
    windowsSign: FLAGS.IS_CODESIGNING_ENABLED ? windowsSign : undefined,
    icon: path.resolve(__dirname, "assets/icon"),
    extraResource: [
      path.resolve(__dirname, "assets/icon.ico"),
      path.resolve(__dirname, "assets/icon.png"),
      // Prebuilt llama.cpp runtimes (cpu / vulkan / cuda), see `npm run prepare:llama`
      path.resolve(__dirname, "resources/local_gguf"),
    ],
    junk: true,
    overwrite: true,
    prune: true,
    osxUniversal: {
      mergeASARs: true,
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel(
      (arch) => ({
        name: "OfficeBuddies",
        authors: packageJson.author?.name || packageJson.productName,
        exe: `${packageJson.productName}.exe`,
        noMsi: true,
        remoteReleases: "",
        loadingGif: "./assets/boot.gif",
        setupExe: `OfficeBuddies-${packageJson.version}-setup-${arch}.exe`,
        setupIcon: path.resolve(__dirname, "assets", "icon.ico"),
        windowsSign: FLAGS.IS_CODESIGNING_ENABLED ? windowsSign : undefined,
      }),
      ["win32"],
    ),
    new MakerZIP({}, ["darwin", "win32"]),
    // The packaged binary is named after productName ("Office Buddies"), not
    // the npm package name the Linux makers look for by default.
    new MakerRpm({ options: { bin: packageJson.productName } }),
    new MakerDeb({ options: { bin: packageJson.productName } }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/main/main.ts",
          config: "vite.main.config.ts",
          target: "main",
        },
        {
          entry: "src/renderer/preload.ts",
          config: "vite.preload.config.ts",
          target: "preload",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.ts",
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: true,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};

export default config;

/**
 * Helper functions
 */

function getItemsFromFolder(
  filePath: string,
  totalCollection: {
    path: string;
    type: "directory" | "file";
    empty: boolean;
  }[] = [],
) {
  try {
    const normalizedPath = path.normalize(filePath);
    const childItems = fs.readdirSync(normalizedPath);
    const getItemStats = fs.statSync(normalizedPath);

    if (getItemStats.isDirectory()) {
      totalCollection.push({
        path: normalizedPath,
        type: "directory",
        empty: childItems.length === 0,
      });
    }

    childItems.forEach((childItem) => {
      const childItemNormalizedPath = path.join(normalizedPath, childItem);
      const childItemStats = fs.statSync(childItemNormalizedPath);

      if (childItemStats.isDirectory()) {
        getItemsFromFolder(childItemNormalizedPath, totalCollection);
      } else {
        totalCollection.push({
          path: childItemNormalizedPath,
          type: "file",
          empty: false,
        });
      }
    });
  } catch {
    return;
  }

  return totalCollection;
}

/**
 * Gets all the production dependencies of the given node module names.
 *
 * @param nodeModuleNames
 * @param includeNestedDeps
 * @returns
 */
async function getExternalNestedDependencies(
  nodeModuleNames: string[],
): Promise<Set<string>> {
  const projectRoot = path.normalize(__dirname);
  const foundModules = new Set(nodeModuleNames);

  for (const external of nodeModuleNames) {
    type MyPublicClass<T> = {
      [P in keyof T]: T[P];
    };

    type MyPublicWalker = MyPublicClass<Walker> & {
      modules: Module[];
      walkDependenciesForModule: (
        moduleRoot: string,
        depType: DepType,
      ) => Promise<void>;
    };

    const moduleRoot = path.join(projectRoot, "node_modules", external);
    const walker = new Walker(moduleRoot) as unknown as MyPublicWalker;

    walker.modules = [];
    await walker.walkDependenciesForModule(moduleRoot, DepType.PROD);

    walker.modules
      .filter((dep) => (dep.depType as number) === DepType.PROD)
      .map((dep) => dep.name.split("/")[0])
      .forEach((name) => foundModules.add(name));
  }

  return foundModules;
}

/**
 * Setup function to run before packaging
 */
function setup() {
  if (process.platform === "win32") {
    if (!FLAGS.IS_CODESIGNING_ENABLED) {
      return;
    }

    // Ensure windows codesigning files exist
    if (!fs.existsSync(FLAGS.SIGNTOOL_PATH)) {
      console.warn("SignTool path does not exist");
    }
    if (!fs.existsSync(FLAGS.AZURE_CODE_SIGNING_DLIB)) {
      console.warn("Azure codesigning DLib path does not exist");
    }

    // Setup TEMP
    process.env.TEMP = process.env.TMP = path.join(
      os.homedir(),
      "AppData",
      "Local",
      "Temp",
    );

    // Write Azure codesigning metadata
    fs.writeFileSync(
      FLAGS.AZURE_METADATA_JSON_PATH,
      JSON.stringify(
        {
          Endpoint:
            process.env.AZURE_CODE_SIGNING_ENDPOINT ||
            "https://wcus.codesigning.azure.net",
          CodeSigningAccountName: process.env.AZURE_CODE_SIGNING_ACCOUNT_NAME,
          CertificateProfileName:
            process.env.AZURE_CODE_SIGNING_CERTIFICATE_PROFILE_NAME,
        },
        null,
        2,
      ),
    );
  }
}

function getAppBundleId(
  packageName: string | undefined,
  authorName: string | undefined,
): string {
  const author = sanitizeIdentifierPart(authorName || "officebuddies");
  const app = sanitizeIdentifierPart(packageName || "officebuddies");
  return `com.${author}.${app}`;
}

function sanitizeIdentifierPart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
