import { randomUUID } from "crypto";

import { safeStorage } from "electron";
import Store from "electron-store";

import {
  IntegrationConfig,
  IntegrationTestResult,
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
    const nextKnowledgeSource = toKnowledgeSource(nextIntegration);
    const nextKnowledgeSources = (settings.knowledgeSources || []).map(
      (source) =>
        source.integrationId === integrationId ? nextKnowledgeSource : source,
    );

    this.setCredential(
      integrationId,
      input.credential,
      previous?.hasCredential,
    );
    this.saveSettings({
      ...settings,
      integrations: nextIntegrations,
      knowledgeSources: nextKnowledgeSources,
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

  public async testIntegration(
    input: SaveIntegrationInput,
  ): Promise<IntegrationTestResult> {
    if (input.type !== "confluence") {
      return {
        ok: false,
        message:
          "Connection testing is currently available for Confluence integrations only.",
      };
    }

    const baseUrl = normalizeConfluenceBaseUrl(input.baseUrl || "");
    const accountEmail = input.accountEmail?.trim() || "";
    const credential = this.resolveCredentialForInput(input);
    const missingFields = [
      !baseUrl ? "base URL" : null,
      !accountEmail ? "account email" : null,
      !credential ? "API token" : null,
    ].filter(Boolean);

    if (missingFields.length > 0) {
      return {
        ok: false,
        message: `Confluence needs a ${missingFields.join(", ")} before the connection can be tested.`,
      };
    }

    try {
      await fetchConfluenceJson(
        `${baseUrl}/rest/api/space?limit=1`,
        accountEmail,
        credential,
      );
      return {
        ok: true,
        statusCode: 200,
        message:
          "Connection ok. Confluence accepted the configured credentials.",
      };
    } catch (error) {
      const statusCode = getResponseStatusCode(error);
      const details = getConfluenceErrorDetails(error);

      getLogger().warn("Confluence connection test failed", {
        integrationId: input.id || null,
        baseUrl,
        accountEmail,
        statusCode: statusCode || null,
        details: details || null,
      });

      return {
        ok: false,
        statusCode,
        message: getConfluenceErrorMessage(statusCode),
        details,
      };
    }
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

  private resolveCredentialForInput(input: SaveIntegrationInput) {
    if (input.credential !== undefined) {
      const trimmedCredential = input.credential.trim();
      return trimmedCredential || undefined;
    }

    if (!input.id) {
      return undefined;
    }

    return this.getCredential(input.id)?.trim() || undefined;
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

async function fetchConfluenceJson(
  url: string,
  accountEmail: string,
  apiToken: string,
) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${accountEmail}:${apiToken}`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Request failed (${response.status}) while calling Confluence: ${body.slice(0, 300)}`,
    );
  }

  return response.json();
}

function normalizeConfluenceBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, "");
}

function getResponseStatusCode(error: unknown) {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const match = error.message.match(/Request failed \((\d+)\)/);
  return match ? Number(match[1]) : undefined;
}

function getConfluenceErrorMessage(statusCode: number | undefined) {
  if (statusCode === 401) {
    return "Confluence rejected the credentials (401). Check the base URL, account email, and API token.";
  }

  if (statusCode === 403) {
    return "Confluence accepted the request, but this user is not permitted to use Confluence (403). Check product access and space permissions.";
  }

  return "Confluence connection test failed. Review the configured base URL, account email, and API token.";
}

function getConfluenceErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const jsonMessageMatch = error.message.match(/"message":"([^"]+)"/i);

  if (jsonMessageMatch?.[1]) {
    return jsonMessageMatch[1];
  }

  const htmlTitleMatch = error.message.match(/<title>([^<]+)<\/title>/i);

  if (htmlTitleMatch?.[1]) {
    return htmlTitleMatch[1].replace(/\s+/g, " ").trim();
  }

  return error.message.replace(
    /^Request failed \(\d+\) while calling Confluence:\s*/i,
    "",
  );
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
