import { randomUUID } from "crypto";

import { safeStorage } from "electron";
import Store from "electron-store";

import {
  IntegrationConfig,
  IntegrationType,
  KnowledgeSource,
  KnowledgeSourceStatus,
  McpTransportType,
  SettingsState,
} from "../shared/shared-state";
import { getLogger } from "./logger";
import { getStateManager } from "./state";

const ENCRYPTED_PREFIX = "ob_mcp_enc_v1:";

function isEncryptedValue(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(ENCRYPTED_PREFIX);
}

type IntegrationSecretsState = {
  integrationCredentials: Record<string, string | undefined>;
  serverCredentials?: Record<string, string | undefined>;
};

type SaveIntegrationInput = {
  id?: string;
  name: string;
  type: IntegrationType;
  transport?: McpTransportType;
  endpoint?: string;
  command?: string;
  baseUrl?: string;
  accountEmail?: string;
  credential?: string;
};

class IntegrationManager {
  private secretsStore = new Store<IntegrationSecretsState>({
    name: "mcp-secrets",
    defaults: {
      integrationCredentials: {},
      serverCredentials: {},
    },
  });

  public saveIntegration(input: SaveIntegrationInput): IntegrationConfig {
    const settings = getStateManager().getSettings();
    const existingIntegrations = settings.integrations || [];
    const integrationId = input.id || `integration-${randomUUID()}`;
    const previous = existingIntegrations.find(
      (integration) => integration.id === integrationId,
    );
    const nextIntegration = this.buildIntegrationConfig(
      input,
      previous,
      integrationId,
    );
    const nextIntegrations = [
      ...existingIntegrations.filter(
        (integration) => integration.id !== integrationId,
      ),
      nextIntegration,
    ].sort((left, right) => left.name.localeCompare(right.name));

    this.setCredential(
      integrationId,
      input.credential,
      previous?.hasCredential,
    );
    this.saveSettings({
      ...settings,
      integrations: nextIntegrations,
    });

    return nextIntegration;
  }

  public deleteIntegration(integrationId: string) {
    const settings = getStateManager().getSettings();
    const nextIntegrations = (settings.integrations || []).filter(
      (integration) => integration.id !== integrationId,
    );
    const nextKnowledgeSources = (settings.knowledgeSources || []).filter(
      (source) => source.integrationId !== integrationId,
    );

    this.deleteCredential(integrationId);
    this.saveSettings({
      ...settings,
      integrations: nextIntegrations,
      knowledgeSources: nextKnowledgeSources,
    });
  }

  public getAvailableKnowledgeSources(): KnowledgeSource[] {
    const settings = getStateManager().getSettings();

    return (settings.integrations || []).map((integration) =>
      toKnowledgeSource(integration),
    );
  }

  public getIntegrationById(
    integrationId: string,
  ): IntegrationConfig | undefined {
    const settings = getStateManager().getSettings();

    return (settings.integrations || []).find(
      (integration) => integration.id === integrationId,
    );
  }

  public getCredential(integrationId: string): string | undefined {
    const value = this.getAllCredentials()[integrationId];
    const decrypted = decryptSecret(value);

    return typeof decrypted === "string" ? decrypted : undefined;
  }

  public setIntegrationStatus(
    integrationId: string,
    status: KnowledgeSourceStatus,
  ) {
    const settings = getStateManager().getSettings();
    const nextIntegrations = (settings.integrations || []).map((integration) =>
      integration.id === integrationId
        ? { ...integration, status }
        : integration,
    );
    const nextKnowledgeSources = (settings.knowledgeSources || []).map(
      (source) =>
        source.integrationId === integrationId ? { ...source, status } : source,
    );

    this.saveSettings({
      ...settings,
      integrations: nextIntegrations,
      knowledgeSources: nextKnowledgeSources,
    });
  }

  private buildIntegrationConfig(
    input: SaveIntegrationInput,
    previous: IntegrationConfig | undefined,
    integrationId: string,
  ): IntegrationConfig {
    const name = input.name.trim();

    if (!name) {
      throw new Error("Integration name is required.");
    }

    const hasCredential =
      input.credential !== undefined
        ? input.credential.trim().length > 0
        : Boolean(previous?.hasCredential);

    if (input.type === "mcp") {
      const transport = input.transport || "http";

      if (transport === "http") {
        const endpoint = input.endpoint?.trim() || "";

        if (!endpoint) {
          throw new Error("HTTP MCP integrations need an endpoint URL.");
        }

        return {
          id: integrationId,
          name,
          type: "mcp",
          transport,
          endpoint,
          command: undefined,
          baseUrl: undefined,
          accountEmail: undefined,
          status: "Available",
          hasCredential,
        };
      }

      const command = input.command?.trim() || "";

      if (!command) {
        throw new Error("stdio MCP integrations need a command.");
      }

      return {
        id: integrationId,
        name,
        type: "mcp",
        transport,
        endpoint: undefined,
        command,
        baseUrl: undefined,
        accountEmail: undefined,
        status: "Available",
        hasCredential,
      };
    }

    if (input.type === "confluence") {
      const baseUrl = input.baseUrl?.trim() || "";
      const accountEmail = input.accountEmail?.trim() || "";

      if (!baseUrl) {
        throw new Error("Confluence integrations need a base URL.");
      }

      if (!accountEmail) {
        throw new Error("Confluence integrations need an account email.");
      }

      return {
        id: integrationId,
        name,
        type: "confluence",
        transport: undefined,
        endpoint: undefined,
        command: undefined,
        baseUrl,
        accountEmail,
        status: "Available",
        hasCredential,
      };
    }

    throw new Error(`Unsupported integration type: ${input.type}`);
  }

  private saveSettings(settings: SettingsState) {
    getStateManager().setStateValue("settings", settings);
  }

  private setCredential(
    integrationId: string,
    credential: string | undefined,
    hadCredential: boolean | undefined,
  ) {
    if (credential === undefined) {
      return;
    }

    const trimmed = credential.trim();

    if (!trimmed) {
      if (hadCredential) {
        this.deleteCredential(integrationId);
      }
      return;
    }

    const encryptedCredential = encryptSecret(trimmed);
    const credentials = {
      ...this.getAllCredentials(),
      [integrationId]: encryptedCredential,
    };
    this.secretsStore.set("integrationCredentials", credentials);
  }

  private deleteCredential(integrationId: string) {
    const credentials = {
      ...this.getAllCredentials(),
    };

    delete credentials[integrationId];
    this.secretsStore.set("integrationCredentials", credentials);
    this.secretsStore.set("serverCredentials", credentials);
  }

  private getAllCredentials() {
    return {
      ...(this.secretsStore.get("serverCredentials") || {}),
      ...(this.secretsStore.get("integrationCredentials") || {}),
    };
  }
}

function toKnowledgeSource(integration: IntegrationConfig): KnowledgeSource {
  const target =
    integration.type === "confluence"
      ? integration.baseUrl || "Base URL unavailable"
      : integration.transport === "stdio"
        ? integration.command || "Command unavailable"
        : integration.endpoint || "Endpoint unavailable";
  const meta =
    integration.type === "confluence"
      ? `CONFLUENCE | ${target}`
      : `${integration.type.toUpperCase()} via ${(integration.transport || "http").toUpperCase()} | ${target}`;

  return {
    id: `knowledge-source-${integration.id}`,
    name: integration.name,
    meta,
    status: integration.status,
    integrationId: integration.id,
    integrationType: integration.type,
    resourceId: "integration-root",
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
    getLogger().warn("Failed to encrypt integration credential", error);
    return value;
  }
}

function decryptSecret(value: unknown): unknown {
  if (!isEncryptedValue(value)) {
    return value;
  }

  if (!safeStorage.isEncryptionAvailable()) {
    return value;
  }

  try {
    const payload = value.slice(ENCRYPTED_PREFIX.length);
    return safeStorage.decryptString(Buffer.from(payload, "base64"));
  } catch (error) {
    getLogger().warn("Failed to decrypt integration credential", error);
    return value;
  }
}

let _integrationManager: IntegrationManager | null = null;

export function getIntegrationManager() {
  if (!_integrationManager) {
    _integrationManager = new IntegrationManager();
  }

  return _integrationManager;
}
