import { randomUUID } from "crypto";

import { safeStorage } from "electron";
import Store from "electron-store";

import {
  KnowledgeMcpSource,
  MpcServerConfig,
  MpcServerType,
  SettingsState,
} from "../shared/shared-state";
import { getLogger } from "./logger";
import { getStateManager } from "./state";

const ENCRYPTED_PREFIX = "ob_mcp_enc_v1:";

type McpSecretsState = {
  serverCredentials: Record<string, string | undefined>;
};

type SaveMcpServerInput = {
  id?: string;
  name: string;
  type: MpcServerType;
  endpoint?: string;
  command?: string;
  credential?: string;
};

class McpServerManager {
  private secretsStore = new Store<McpSecretsState>({
    name: "mcp-secrets",
    defaults: {
      serverCredentials: {},
    },
  });

  public saveServer(input: SaveMcpServerInput): MpcServerConfig {
    const settings = getStateManager().getSettings();
    const existingServers = settings.mcpServers || [];
    const serverId = input.id || `mcp-server-${randomUUID()}`;
    const previous = existingServers.find((server) => server.id === serverId);
    const nextServer = this.buildServerConfig(input, previous, serverId);
    const nextServers = [
      ...existingServers.filter((server) => server.id !== serverId),
      nextServer,
    ].sort((left, right) => left.name.localeCompare(right.name));

    const nextKnowledgeSource = toKnowledgeSource(nextServer);
    const nextKnowledgeSources = [
      ...(settings.knowledgeMcpSources || []).filter(
        (source) => source.serverId !== serverId,
      ),
      nextKnowledgeSource,
    ].sort((left, right) => left.name.localeCompare(right.name));

    this.setCredential(serverId, input.credential, previous?.hasCredential);
    this.saveSettings({
      ...settings,
      mcpServers: nextServers,
      knowledgeMcpSources: nextKnowledgeSources,
    });

    return nextServer;
  }

  public deleteServer(serverId: string) {
    const settings = getStateManager().getSettings();
    const nextServers = (settings.mcpServers || []).filter(
      (server) => server.id !== serverId,
    );
    const nextKnowledgeSources = (settings.knowledgeMcpSources || []).filter(
      (source) => source.serverId !== serverId,
    );

    this.deleteCredential(serverId);
    this.saveSettings({
      ...settings,
      mcpServers: nextServers,
      knowledgeMcpSources: nextKnowledgeSources,
    });
  }

  public getKnowledgeSources(): KnowledgeMcpSource[] {
    const settings = getStateManager().getSettings();

    return (settings.mcpServers || []).map((server) => toKnowledgeSource(server));
  }

  private buildServerConfig(
    input: SaveMcpServerInput,
    previous: MpcServerConfig | undefined,
    serverId: string,
  ): MpcServerConfig {
    const name = input.name.trim();

    if (!name) {
      throw new Error("MCP server name is required.");
    }

    if (input.type === "http") {
      const endpoint = input.endpoint?.trim() || "";

      if (!endpoint) {
        throw new Error("HTTP MCP servers need an endpoint URL.");
      }

      return {
        id: serverId,
        name,
        type: "http",
        endpoint,
        command: undefined,
        status: "Available",
        hasCredential:
          input.credential !== undefined
            ? input.credential.trim().length > 0
            : Boolean(previous?.hasCredential),
      };
    }

    const command = input.command?.trim() || "";

    if (!command) {
      throw new Error("stdio MCP servers need a command.");
    }

    return {
      id: serverId,
      name,
      type: "stdio",
      endpoint: undefined,
      command,
      status: "Available",
      hasCredential:
        input.credential !== undefined
          ? input.credential.trim().length > 0
          : Boolean(previous?.hasCredential),
    };
  }

  private saveSettings(settings: SettingsState) {
    getStateManager().setStateValue("settings", settings);
  }

  private setCredential(
    serverId: string,
    credential: string | undefined,
    hadCredential: boolean | undefined,
  ) {
    if (credential === undefined) {
      return;
    }

    const trimmed = credential.trim();

    if (!trimmed) {
      if (hadCredential) {
        this.deleteCredential(serverId);
      }
      return;
    }

    const encryptedCredential = encryptSecret(trimmed);
    const credentials = {
      ...this.secretsStore.get("serverCredentials"),
      [serverId]: encryptedCredential,
    };
    this.secretsStore.set("serverCredentials", credentials);
  }

  private deleteCredential(serverId: string) {
    const credentials = {
      ...this.secretsStore.get("serverCredentials"),
    };

    delete credentials[serverId];
    this.secretsStore.set("serverCredentials", credentials);
  }
}

function toKnowledgeSource(server: MpcServerConfig): KnowledgeMcpSource {
  const target =
    server.type === "http"
      ? server.endpoint || "Endpoint unavailable"
      : server.command || "Command unavailable";

  return {
    id: `mcp-resource-${server.id}`,
    name: server.name,
    meta: `${server.type.toUpperCase()} | ${target}`,
    status: server.status,
    serverId: server.id,
    resourceId: "server",
  };
}

function encryptSecret(value: string): string {
  if (!safeStorage.isEncryptionAvailable()) {
    return value;
  }

  try {
    const encrypted = safeStorage.encryptString(value).toString("base64");
    return `${ENCRYPTED_PREFIX}${encrypted}`;
  } catch (error) {
    getLogger().warn("Failed to encrypt MCP credential", error);
    return value;
  }
}

let _mcpServerManager: McpServerManager | null = null;

export function getMcpServerManager() {
  if (!_mcpServerManager) {
    _mcpServerManager = new McpServerManager();
  }

  return _mcpServerManager;
}

