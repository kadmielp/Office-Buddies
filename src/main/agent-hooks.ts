import { app } from "electron";
import fs from "fs";
import os from "os";
import path from "path";

import {
  AGENT_EVENT_PATH,
  AgentHookInfo,
  AgentHookPreview,
  AgentSource,
} from "../shared/agent-events";
import { getLogger } from "./logger";
import { getStateManager } from "./state";

type HookEntry = Record<string, any>;
type HookGroup = { matcher?: string; hooks?: HookEntry[] };
type HookConfig = Record<string, any> & {
  hooks?: Record<string, HookGroup[]>;
};

interface AgentHookSpec {
  configPath: () => string;
  // Hook events to register, with an optional matcher and timeout for each.
  events: Array<{ event: string; matcher?: string; timeout?: number }>;
  buildHook: (timeout?: number) => HookEntry;
  // Our hooks are recognised by a marker, so user hooks are never touched.
  isOwnHook: (hook: HookEntry) => boolean;
  // Extra files the hook relies on; stale files make the status "outdated".
  sideFiles?: () => Array<{ path: string; content: string }>;
}

const CODEX_SCRIPT_NAME = "officebuddies-codex-hook.ps1";

const SPECS: Record<AgentSource, AgentHookSpec> = {
  "claude-code": {
    configPath: () => path.join(os.homedir(), ".claude", "settings.json"),
    events: [
      // Claude Code notification types the buddy cares about.
      {
        event: "Notification",
        matcher: "permission_prompt|elicitation_dialog|agent_needs_input",
      },
      { event: "Stop" },
      // Multiple-choice questions wait in the balloon. Keep this above
      // REQUEST_WAIT_MS so the buddy always answers before the hook times out.
      { event: "PreToolUse", matcher: "AskUserQuestion", timeout: 120 },
      // Allow or deny from the balloon.
      { event: "PermissionRequest", timeout: 120 },
    ],
    // Claude Code posts the hook payload itself, so no relay is needed.
    buildHook: (timeout = 5) => ({
      type: "http",
      url: getAgentEventUrl("claude-code"),
      timeout,
      headers: {
        Authorization: `Bearer ${getAgentHookToken()}`,
        "X-Agent-Entrypoint": "$CLAUDE_CODE_ENTRYPOINT",
        "X-Agent-Host-Session": "$CLAUDE_CODE_HOST_SESSION_ID",
      },
      allowedEnvVars: ["CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_HOST_SESSION_ID"],
    }),
    isOwnHook: (hook) =>
      typeof hook?.url === "string" &&
      /^http:\/\/127\.0\.0\.1:\d+\//.test(hook.url) &&
      hook.url.includes(`${AGENT_EVENT_PATH}?agent=claude-code`),
  },
  codex: {
    configPath: () => path.join(os.homedir(), ".codex", "hooks.json"),
    events: [
      // Waits for Allow or Deny from the balloon; see REQUEST_WAIT_MS.
      { event: "PermissionRequest", timeout: 120 },
      { event: "Stop" },
    ],
    // Codex only runs commands. The command rarely changes, so Codex keeps
    // trusting it; the port and token live in the script it runs.
    buildHook: (timeout = 10) => ({
      type: "command",
      command: `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${toForwardSlashes(
        getCodexScriptPath(),
      )}"`,
      timeout,
    }),
    isOwnHook: (hook) =>
      typeof hook?.command === "string" &&
      hook.command.includes(CODEX_SCRIPT_NAME),
    sideFiles: () => [
      { path: getCodexScriptPath(), content: buildCodexScript() },
    ],
  },
};

export function getAgentHookInfo(source: AgentSource): AgentHookInfo {
  const spec = SPECS[source];
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
  const configPath = SPECS[source].configPath();
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
  const spec = SPECS[source];
  const configPath = spec.configPath();

  for (const file of spec.sideFiles?.() ?? []) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.content, "utf8");
  }

  writeConfig(configPath, withOwnHooks(readConfig(configPath), source));

  return getAgentHookInfo(source);
}

export function uninstallAgentHooks(source: AgentSource): AgentHookInfo {
  const spec = SPECS[source];
  const configPath = spec.configPath();

  if (fs.existsSync(configPath)) {
    writeConfig(configPath, withoutOwnHooks(readConfig(configPath), source));
  }

  for (const file of spec.sideFiles?.() ?? []) {
    fs.rmSync(file.path, { force: true });
  }

  return getAgentHookInfo(source);
}

function getAgentHookToken(): string {
  return getStateManager().getSettings().agentHookToken || "";
}

function getAgentEventUrl(source: AgentSource): string {
  const port = getStateManager().getSettings().proactivePort || 5050;

  return `http://127.0.0.1:${port}${AGENT_EVENT_PATH}?agent=${source}`;
}

function getCodexScriptPath(): string {
  return path.join(app.getPath("userData"), "hooks", CODEX_SCRIPT_NAME);
}

// Forwards the hook payload from stdin to the buddy, along with where Codex
// runs. For permission requests the buddy may answer with a decision, which is
// printed for Codex; otherwise it prints nothing. It always exits 0, so a
// missing buddy never blocks Codex.
function buildCodexScript(): string {
  return `# Generated by Office Buddies. Forwards Codex hook events to the buddy.
try {
  # Walk up the parent processes to find the app Codex runs in.
  $hostKind = 'unknown'
  try {
    $processes = @{}
    Get-CimInstance Win32_Process -Property ProcessId, ParentProcessId, Name |
      ForEach-Object { $processes[[int]$_.ProcessId] = $_ }
    $current = $processes[[int]$PID]
    for ($depth = 0; $current -and $depth -lt 8 -and $hostKind -eq 'unknown'; $depth++) {
      switch ($current.Name.ToLowerInvariant()) {
        'chatgpt.exe' { $hostKind = 'codex-desktop' }
        { $_ -in 'code.exe', 'code - insiders.exe', 'cursor.exe', 'windsurf.exe' } { $hostKind = 'vscode' }
        { $_ -in 'windowsterminal.exe', 'wezterm-gui.exe', 'alacritty.exe', 'mintty.exe' } { $hostKind = 'terminal' }
      }
      $current = $processes[[int]$current.ParentProcessId]
    }
  } catch {
  }
  if ($hostKind -eq 'unknown') {
    if ($env:TERM_PROGRAM -eq 'vscode' -or $env:VSCODE_PID) {
      $hostKind = 'vscode'
    } elseif ($env:WT_SESSION -or $env:TERM_PROGRAM) {
      $hostKind = 'terminal'
    }
  }
  $payload = [Console]::OpenStandardInput()
  $reader = New-Object System.IO.StreamReader($payload, [System.Text.Encoding]::UTF8)
  $body = [System.Text.Encoding]::UTF8.GetBytes($reader.ReadToEnd())
  $response = Invoke-WebRequest -UseBasicParsing -Method Post -TimeoutSec 115 \`
    -Uri '${getAgentEventUrl("codex")}' \`
    -Headers @{ Authorization = 'Bearer ${getAgentHookToken()}'; 'X-Agent-Host' = $hostKind } \`
    -ContentType 'application/json; charset=utf-8' \`
    -Body $body
  if ($response.StatusCode -eq 200 -and $response.Content) {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    [Console]::Out.Write($response.Content)
  }
} catch {
}
exit 0
`;
}

function withOwnHooks(config: HookConfig, source: AgentSource): HookConfig {
  const spec = SPECS[source];
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

  const { isOwnHook } = SPECS[source];
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

function toForwardSlashes(value: string): string {
  return value.replace(/\\/g, "/");
}

function readConfig(configPath: string): HookConfig {
  if (!fs.existsSync(configPath)) {
    return {};
  }

  const raw = fs.readFileSync(configPath, "utf8").replace(/^﻿/, "");

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
