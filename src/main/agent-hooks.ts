import fs from "fs";
import path from "path";

import {
  AgentHookInfo,
  AgentHookPreview,
  AgentSource,
} from "../shared/agent-events";
import { getLogger } from "./logger";
import { getInstallableAdapter } from "./agents";

type HookGroup = { matcher?: string; hooks?: Array<Record<string, any>> };
type HookConfig = Record<string, any> & {
  hooks?: Record<string, HookGroup[]>;
};

function getSpec(source: AgentSource) {
  return getInstallableAdapter(source).hooks;
}

export function getAgentHookInfo(source: AgentSource): AgentHookInfo {
  const spec = getSpec(source);
  const configPath = spec.configPath();

  try {
    const config = readConfig(configPath);
    let ownHooks = 0;
    let currentHooks = 0;

    for (const { event, timeout } of spec.events) {
      const expected = JSON.stringify(spec.buildHook(timeout));

      for (const group of config.hooks?.[event] ?? []) {
        for (const hook of group.hooks ?? []) {
          if (spec.isOwnHook(hook)) {
            ownHooks++;

            if (JSON.stringify(hook) === expected) {
              currentHooks++;
            }
          }
        }
      }
    }

    const sideFilesCurrent = (spec.sideFiles?.() ?? []).every(
      (file) =>
        fs.existsSync(file.path) &&
        fs.readFileSync(file.path, "utf8") === file.content,
    );
    const status =
      ownHooks === 0
        ? "not_installed"
        : ownHooks === spec.events.length &&
            currentHooks === spec.events.length &&
            sideFilesCurrent
          ? "installed"
          : "outdated";

    return { source, status, configPath };
  } catch (error) {
    return {
      source,
      status: "not_installed",
      configPath,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function previewAgentHooks(
  source: AgentSource,
  mode: "install" | "uninstall",
): AgentHookPreview {
  const configPath = getSpec(source).configPath();
  const config = readConfig(configPath);
  const next =
    mode === "install"
      ? withOwnHooks(config, source)
      : withoutOwnHooks(config, source);

  return {
    source,
    configPath,
    before: fs.existsSync(configPath)
      ? fs.readFileSync(configPath, "utf8")
      : "",
    after: serialize(next),
  };
}

export function installAgentHooks(source: AgentSource): AgentHookInfo {
  const spec = getSpec(source);
  const configPath = spec.configPath();

  for (const file of spec.sideFiles?.() ?? []) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content, "utf8");
  }

  writeConfig(configPath, withOwnHooks(readConfig(configPath), source));
  spec.onInstall?.();

  return getAgentHookInfo(source);
}

export function uninstallAgentHooks(source: AgentSource): AgentHookInfo {
  const spec = getSpec(source);
  const configPath = spec.configPath();

  if (fs.existsSync(configPath)) {
    writeConfig(configPath, withoutOwnHooks(readConfig(configPath), source));
  }

  for (const file of spec.sideFiles?.() ?? []) {
    fs.rmSync(file.path, { force: true });
  }

  spec.onUninstall?.();

  return getAgentHookInfo(source);
}

function withOwnHooks(config: HookConfig, source: AgentSource): HookConfig {
  const spec = getSpec(source);
  const next = withoutOwnHooks(config, source);
  const hooks = { ...(next.hooks ?? {}) };

  for (const { event, matcher, timeout } of spec.events) {
    const hook = spec.buildHook(timeout);
    hooks[event] = [
      ...(hooks[event] ?? []),
      matcher ? { matcher, hooks: [hook] } : { hooks: [hook] },
    ];
  }

  return { ...next, hooks };
}

function withoutOwnHooks(config: HookConfig, source: AgentSource): HookConfig {
  if (!config.hooks) {
    return config;
  }

  const { isOwnHook } = getSpec(source);
  const hooks: Record<string, HookGroup[]> = {};

  for (const [event, groups] of Object.entries(config.hooks)) {
    if (!Array.isArray(groups)) {
      hooks[event] = groups;
      continue;
    }

    const keptGroups = groups
      .map((group) => {
        if (!Array.isArray(group?.hooks)) {
          return group;
        }

        const keptHooks = group.hooks.filter((hook) => !isOwnHook(hook));

        return keptHooks.length === group.hooks.length
          ? group
          : keptHooks.length > 0
            ? { ...group, hooks: keptHooks }
            : null;
      })
      .filter((group): group is HookGroup => group !== null);

    if (keptGroups.length > 0) {
      hooks[event] = keptGroups;
    }
  }

  const next: HookConfig = { ...config, hooks };

  if (Object.keys(hooks).length === 0) {
    delete next.hooks;
  }

  return next;
}

function readConfig(configPath: string): HookConfig {
  if (!fs.existsSync(configPath)) {
    return {};
  }

  const raw = fs.readFileSync(configPath, "utf8").replace(/^\uFEFF/, "");

  if (!raw.trim()) {
    return {};
  }

  const parsed = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${configPath} is not a JSON object.`);
  }

  return parsed;
}

function serialize(config: HookConfig): string {
  return `${JSON.stringify(config, null, 2)}\n`;
}

// Keeps a backup of the previous file and replaces it atomically.
function writeConfig(configPath: string, config: HookConfig) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });

  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, `${configPath}.officebuddies.bak`);
  }

  const tempPath = `${configPath}.officebuddies.tmp`;
  fs.writeFileSync(tempPath, serialize(config), "utf8");
  fs.renameSync(tempPath, configPath);
  getLogger().info(`Updated agent hooks in ${configPath}`);
}
