import { Walker, DepType, type Module } from 'flora-colossus';
import { readdirSync, rmdirSync, statSync } from 'node:fs';
import path from 'path';

import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

let nativeModuleDependenciesToPackage: string[] = [];

export const EXTERNAL_DEPENDENCIES = [
  '@electron/llm',
  'node-llama-cpp',
];

const config: ForgeConfig = {
  hooks: {
    prePackage: async () => {
      const projectRoot = path.normalize(__dirname);
      const getExternalNestedDependencies = async (
        nodeModuleNames: string[],
        includeNestedDeps = true
      ) => {
        const foundModules = new Set(nodeModuleNames);
        if (includeNestedDeps) {
          for (const external of nodeModuleNames) {
            type MyPublicClass<T> = {
              [P in keyof T]: T[P];
            };
            type MyPublicWalker = MyPublicClass<Walker> & {
              modules: Module[];
              walkDependenciesForModule: (
                moduleRoot: string,
                depType: DepType
              ) => Promise<void>;
            };
            const moduleRoot = path.join(projectRoot, 'node_modules', external);
            const walker = new Walker(moduleRoot) as unknown as MyPublicWalker;
            walker.modules = [];
            await walker.walkDependenciesForModule(moduleRoot, DepType.PROD);
            walker.modules
              .filter((dep) => (dep.depType as number) === DepType.PROD)
              .map((dep) => dep.name.split('/')[0])
              .forEach((name) => foundModules.add(name));
          }
        }
        return foundModules;
      };
      const nativeModuleDependencies =
        await getExternalNestedDependencies(EXTERNAL_DEPENDENCIES);
      nativeModuleDependenciesToPackage = Array.from(nativeModuleDependencies);
    },
    packageAfterPrune: async (_forgeConfig, buildPath) => {
      function getItemsFromFolder(
        filePath: string,
        totalCollection: {
          path: string;
          type: 'directory' | 'file';
          empty: boolean;
        }[] = []
      ) {
        try {
          const normalizedPath = path.normalize(filePath);
          const childItems = readdirSync(normalizedPath);
          const getItemStats = statSync(normalizedPath);
          if (getItemStats.isDirectory()) {
            totalCollection.push({
              path: normalizedPath,
              type: 'directory',
              empty: childItems.length === 0,
            });
          }
          childItems.forEach((childItem) => {
            const childItemNormalizedPath = path.join(normalizedPath, childItem);
            const childItemStats = statSync(childItemNormalizedPath);
            if (childItemStats.isDirectory()) {
              getItemsFromFolder(childItemNormalizedPath, totalCollection);
            } else {
              totalCollection.push({
                path: childItemNormalizedPath,
                type: 'file',
                empty: false,
              });
            }
          });
        } catch {
          return;
        }
        return totalCollection;
      }

      const getItems = getItemsFromFolder(buildPath) ?? [];
      for (const item of getItems) {
        const DELETE_EMPTY_DIRECTORIES = true;
        if (item.empty === true) {
          if (DELETE_EMPTY_DIRECTORIES) {
            const pathToDelete = path.normalize(item.path);
            // one last check to make sure it is a directory and is empty
            const stats = statSync(pathToDelete);
            if (!stats.isDirectory()) {
              // SKIPPING DELETION: pathToDelete is not a directory
              return;
            }
            const childItems = readdirSync(pathToDelete);
            if (childItems.length !== 0) {
              // SKIPPING DELETION: pathToDelete is not empty
              return;
            }
            rmdirSync(pathToDelete);
          }
        }
      }
    },
  },
  packagerConfig: {
    asar: {
      unpack: "**/node_modules/*node-llama-cpp*",
    },
    ignore: (file) => {
      const filePath = file.toLowerCase();
      const result = {
        keep: false,
        log: true,
      };

      const foldersToIgnore = [
        '/test/',
        '/.github/',
        '/.git/'
      ]

      const extensionsToIgnore = [
        '.DS_Store',
        '.gitignore',
        '.gitmodules',
        '.target.mk',
        '.config.gypi',
        '.o',
        '.obj',
        '.ts',
        '.tsbuildinfo',
        '.map',
        '.d',
        '.ts',
        '.ts.snap',
        '.cmake',
        '.cpp',
        '.h',
        '.md',
        '.nycrc',
        'tsconfig.json',
        '.travis.yml',
        '.eslintrc',
        '.markdown',
        'CHANGELOG.md',
        'README.md',
        'HISTORY.md',
        'GOVERNANCE.md',
        'CONTRIBUTING.md',
        'CODE_OF_CONDUCT.md',
        'SECURITY.md'
      ]

      // NOTE: must return false for empty string or nothing will be packaged
      if (filePath === '') result.keep = true;
      if (!result.keep && filePath === '/package.json') result.keep = true;
      if (!result.keep && filePath === '/node_modules') result.keep = true;
      if (!result.keep && filePath === '/.vite') result.keep = true;
      if (!result.keep && filePath.startsWith('/.vite/')) result.keep = true;
      if (!result.keep && filePath.startsWith('/node_modules/')) {
        // check if matches any of the external dependencies
        for (const dep of nativeModuleDependenciesToPackage) {
          if (foldersToIgnore.some(folder => filePath.includes(folder))) {
            result.keep = false;
            break;
          }

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

      if (extensionsToIgnore.some(ext => filePath.endsWith(ext))) {
        result.keep = false;
      }

      if (result.keep) {
        if (result.log) console.log('Keeping:', file);
        return false;
      }

      return true;
    },
    appCategoryType: "public.app-category.productivity",
    icon: path.resolve(__dirname, "assets/icon"),
    junk: true,
    overwrite: true,
    prune: true,
    osxUniversal: {
      mergeASARs: true,
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
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
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};

export default config;
