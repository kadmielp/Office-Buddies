import { useEffect, useRef, useState } from "react";

import {
  IntegrationConfig,
  IntegrationType,
  KnowledgeFileSource,
  KnowledgeSource,
  McpTransportType,
} from "../../../shared/shared-state";
import { clippyApi } from "../../clippyApi";
import { useSharedState } from "../../contexts/SharedStateContext";
import { Checkbox } from "../../ui/Checkbox";
import { getThemeIcons } from "../../theme/theme";

export const SettingsKnowledge: React.FC = () => {
  const { settings } = useSharedState();
  const themeIcons = getThemeIcons(settings.uiDesign);
  const [availableKnowledgeSources, setAvailableKnowledgeSources] = useState<
    KnowledgeSource[]
  >([]);
  const [selectedKnowledgeSourceId, setSelectedKnowledgeSourceId] =
    useState("");
  const [isLoadingKnowledgeSources, setIsLoadingKnowledgeSources] =
    useState(false);
  const [isPickingFiles, setIsPickingFiles] = useState(false);
  const [showSourceBrowser, setShowSourceBrowser] = useState(false);
  const [showAddIntegrationForm, setShowAddIntegrationForm] = useState(false);
  const [isSavingIntegration, setIsSavingIntegration] = useState(false);
  const [integrationName, setIntegrationName] = useState("");
  const [integrationType, setIntegrationType] =
    useState<IntegrationType>("mcp");
  const [integrationTransport, setIntegrationTransport] =
    useState<McpTransportType>("http");
  const [integrationEndpoint, setIntegrationEndpoint] = useState("");
  const [integrationCommand, setIntegrationCommand] = useState("");
  const [integrationBaseUrl, setIntegrationBaseUrl] = useState("");
  const [integrationAccountEmail, setIntegrationAccountEmail] = useState("");
  const [integrationError, setIntegrationError] = useState("");
  const credentialInputRef = useRef<HTMLInputElement>(null);

  const knowledgeFiles = settings.knowledgeFiles || [];
  const knowledgeSources = settings.knowledgeSources || [];
  const integrations = settings.integrations || [];
  const unselectedKnowledgeSources = availableKnowledgeSources.filter(
    (source) =>
      !knowledgeSources.some(
        (selectedSource) => selectedSource.id === source.id,
      ),
  );

  useEffect(() => {
    const firstAvailableSource = unselectedKnowledgeSources[0]?.id || "";

    if (
      firstAvailableSource &&
      !unselectedKnowledgeSources.some(
        (source) => source.id === selectedKnowledgeSourceId,
      )
    ) {
      setSelectedKnowledgeSourceId(firstAvailableSource);
    }

    if (!firstAvailableSource) {
      setSelectedKnowledgeSourceId("");
    }
  }, [selectedKnowledgeSourceId, unselectedKnowledgeSources]);

  useEffect(() => {
    const filesNeedingRefresh = knowledgeFiles.filter((file) => {
      const normalizedName = file.name.toLowerCase();

      return (
        !file.previewText &&
        file.status !== "Error" &&
        (normalizedName.endsWith(".docx") || normalizedName.endsWith(".pdf"))
      );
    });

    if (filesNeedingRefresh.length === 0) {
      return;
    }

    let cancelled = false;

    const refreshFiles = async () => {
      const nextFiles = await clippyApi.refreshKnowledgeFiles(knowledgeFiles);

      if (!cancelled) {
        await clippyApi.setState("settings.knowledgeFiles", nextFiles);
      }
    };

    void refreshFiles();

    return () => {
      cancelled = true;
    };
  }, [knowledgeFiles]);

  async function loadAvailableKnowledgeSources() {
    setIsLoadingKnowledgeSources(true);

    try {
      const sources = await clippyApi.getAvailableKnowledgeSources();
      setAvailableKnowledgeSources(sources);
    } finally {
      setIsLoadingKnowledgeSources(false);
    }
  }

  async function handleAddFiles() {
    setIsPickingFiles(true);

    try {
      const nextFiles = await clippyApi.pickKnowledgeFiles(knowledgeFiles);
      await clippyApi.setState("settings.knowledgeFiles", nextFiles);
    } finally {
      setIsPickingFiles(false);
    }
  }

  async function handleRemoveFile(fileId: string) {
    await clippyApi.setState(
      "settings.knowledgeFiles",
      knowledgeFiles.filter((file) => file.id !== fileId),
    );
  }

  async function handleClearFiles() {
    await clippyApi.setState("settings.knowledgeFiles", []);
  }

  async function handleToggleKnowledge(enabled: boolean) {
    await clippyApi.setState("settings.useKnowledgeAtStart", enabled);
  }

  async function handleBrowseSources() {
    const nextShowSourceBrowser = !showSourceBrowser;
    setShowSourceBrowser(nextShowSourceBrowser);

    if (nextShowSourceBrowser) {
      await loadAvailableKnowledgeSources();
    }
  }

  async function handleAddKnowledgeSource() {
    const sourceToAdd = unselectedKnowledgeSources.find(
      (source) => source.id === selectedKnowledgeSourceId,
    );

    if (!sourceToAdd) {
      return;
    }

    await clippyApi.setState("settings.knowledgeSources", [
      ...knowledgeSources,
      sourceToAdd,
    ]);
  }

  async function handleRemoveKnowledgeSource(sourceId: string) {
    await clippyApi.setState(
      "settings.knowledgeSources",
      knowledgeSources.filter((source) => source.id !== sourceId),
    );
  }

  async function handleDeleteIntegration(integrationId: string) {
    await clippyApi.deleteIntegration(integrationId);
    await loadAvailableKnowledgeSources();
  }

  async function handleSaveIntegration() {
    setIsSavingIntegration(true);
    setIntegrationError("");

    try {
      await clippyApi.saveIntegration({
        name: integrationName,
        type: integrationType,
        transport: integrationType === "mcp" ? integrationTransport : undefined,
        endpoint:
          integrationType === "mcp" && integrationTransport === "http"
            ? integrationEndpoint
            : undefined,
        command:
          integrationType === "mcp" && integrationTransport === "stdio"
            ? integrationCommand
            : undefined,
        baseUrl:
          integrationType === "confluence" ? integrationBaseUrl : undefined,
        accountEmail:
          integrationType === "confluence"
            ? integrationAccountEmail
            : undefined,
        credential: credentialInputRef.current?.value,
      });

      setIntegrationName("");
      setIntegrationEndpoint("");
      setIntegrationCommand("");
      setIntegrationBaseUrl("");
      setIntegrationAccountEmail("");
      setShowAddIntegrationForm(false);

      if (credentialInputRef.current) {
        credentialInputRef.current.value = "";
      }

      await loadAvailableKnowledgeSources();
    } catch (error) {
      setIntegrationError(
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setIsSavingIntegration(false);
    }
  }

  return (
    <div>
      <fieldset>
        <legend>Knowledge Base</legend>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 280px" }}>
            <div style={{ marginTop: "12px" }}>
              <Checkbox
                id="useKnowledgeAtStart"
                label="Have the model use the knowledge base."
                checked={settings.useKnowledgeAtStart}
                onChange={handleToggleKnowledge}
              />
            </div>
            <p style={{ margin: "8px 0 0 0" }}>
              Files are pinned directly into the session. Connected knowledge
              sources come from integrations and stay read-only by default.
            </p>
          </div>
        </div>
      </fieldset>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        <fieldset style={{ marginTop: 0 }}>
          <legend>Files</legend>
          <div style={{ display: "grid", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={themeIcons.kbFiles}
                alt=""
                aria-hidden="true"
                style={{ width: "18px", height: "18px" }}
              />
              <strong>Drop or pin local references</strong>
            </div>
            <p style={{ margin: 0 }}>
              Good for briefs, notes, PDFs, and one-off files that should
              influence the session.
            </p>
            <div className="sunken-panel" style={{ padding: "8px" }}>
              {knowledgeFiles.length === 0 ? (
                <div className="settings-knowledge-item">
                  <div className="settings-knowledge-item-meta">
                    No local references added yet.
                  </div>
                </div>
              ) : (
                knowledgeFiles.map((source) => (
                  <KnowledgeListItem
                    key={source.id}
                    source={source}
                    onRemove={() => handleRemoveFile(source.id)}
                  />
                ))
              )}
            </div>
            <div className="field-row" style={{ marginBottom: 0 }}>
              <button
                type="button"
                onClick={handleAddFiles}
                disabled={isPickingFiles}
              >
                {isPickingFiles ? "Adding..." : "Add Files"}
              </button>
              <button
                type="button"
                onClick={handleClearFiles}
                disabled={knowledgeFiles.length === 0}
              >
                Clear Files
              </button>
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginTop: 0 }}>
          <legend>Knowledge Sources</legend>
          <div style={{ display: "grid", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={themeIcons.kbMcp}
                alt=""
                aria-hidden="true"
                style={{ width: "18px", height: "18px" }}
              />
              <strong>Attach connected read-only sources</strong>
            </div>
            <p style={{ margin: 0 }}>
              Use connected sources for systems that change over time, like docs
              workspaces, trackers, or future native knowledge connectors.
            </p>
            <div className="sunken-panel" style={{ padding: "8px" }}>
              {knowledgeSources.length === 0 ? (
                <div className="settings-knowledge-item">
                  <div className="settings-knowledge-item-meta">
                    No connected knowledge sources attached yet.
                  </div>
                </div>
              ) : (
                knowledgeSources.map((source) => (
                  <KnowledgeListItem
                    key={source.id}
                    source={source}
                    onRemove={() => handleRemoveKnowledgeSource(source.id)}
                  />
                ))
              )}
            </div>

            {showSourceBrowser && (
              <div
                className="sunken-panel"
                style={{ padding: "10px", display: "grid", gap: "8px" }}
              >
                <strong>Available Knowledge Sources</strong>
                {isLoadingKnowledgeSources ? (
                  <span>Loading available knowledge sources...</span>
                ) : integrations.length === 0 ? (
                  <span>
                    No integrations configured yet. Add an integration first,
                    then browse its available sources here.
                  </span>
                ) : unselectedKnowledgeSources.length === 0 ? (
                  <span>
                    All available knowledge sources are already attached.
                  </span>
                ) : (
                  <>
                    <div className="field-row" style={{ marginBottom: 0 }}>
                      <label
                        htmlFor="knowledgeSourceSelect"
                        style={{ minWidth: "68px" }}
                      >
                        Source:
                      </label>
                      <select
                        id="knowledgeSourceSelect"
                        value={selectedKnowledgeSourceId}
                        onChange={(event) =>
                          setSelectedKnowledgeSourceId(event.target.value)
                        }
                      >
                        {unselectedKnowledgeSources.map((source) => (
                          <option key={source.id} value={source.id}>
                            {source.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p style={{ margin: 0 }}>
                      Connected knowledge sources stay read-oriented by default
                      so the model can reference live context without mutating
                      it.
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="field-row" style={{ marginBottom: 0 }}>
              <button type="button" onClick={handleBrowseSources}>
                {showSourceBrowser ? "Hide Sources" : "Browse Sources"}
              </button>
              <button
                type="button"
                onClick={handleAddKnowledgeSource}
                disabled={
                  !showSourceBrowser ||
                  isLoadingKnowledgeSources ||
                  unselectedKnowledgeSources.length === 0 ||
                  !selectedKnowledgeSourceId
                }
              >
                Add Source
              </button>
            </div>
          </div>
        </fieldset>

        <fieldset style={{ marginTop: 0 }}>
          <legend>Integrations</legend>
          <div style={{ display: "grid", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={themeIcons.kbMcp}
                alt=""
                aria-hidden="true"
                style={{ width: "18px", height: "18px" }}
              />
              <strong>Configure how Office Buddies connects</strong>
            </div>
            <p style={{ margin: 0 }}>
              MCP and Confluence are currently supported integration types. This
              keeps knowledge sources separate from the connection method they
              come from.
            </p>
            <div
              className="sunken-panel"
              style={{ padding: "10px", display: "grid", gap: "8px" }}
            >
              <strong>Configured Integrations</strong>
              {integrations.length === 0 ? (
                <span>No integrations configured yet.</span>
              ) : (
                integrations.map((integration) => (
                  <ConfiguredIntegrationRow
                    key={integration.id}
                    integration={integration}
                    onDelete={() => handleDeleteIntegration(integration.id)}
                  />
                ))
              )}
            </div>

            {showAddIntegrationForm && (
              <div
                className="sunken-panel"
                style={{ padding: "10px", display: "grid", gap: "8px" }}
              >
                <strong>Add Integration</strong>
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <label htmlFor="integrationName" style={{ minWidth: "72px" }}>
                    Name:
                  </label>
                  <input
                    id="integrationName"
                    type="text"
                    value={integrationName}
                    onChange={(event) => setIntegrationName(event.target.value)}
                  />
                </div>
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <label htmlFor="integrationType" style={{ minWidth: "72px" }}>
                    Connector:
                  </label>
                  <select
                    id="integrationType"
                    value={integrationType}
                    onChange={(event) =>
                      setIntegrationType(event.target.value as IntegrationType)
                    }
                  >
                    <option value="mcp">MCP</option>
                    <option value="confluence">Confluence</option>
                  </select>
                </div>
                {integrationType === "mcp" && (
                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <label
                      htmlFor="integrationTransport"
                      style={{ minWidth: "72px" }}
                    >
                      Transport:
                    </label>
                    <select
                      id="integrationTransport"
                      value={integrationTransport}
                      onChange={(event) =>
                        setIntegrationTransport(
                          event.target.value as McpTransportType,
                        )
                      }
                    >
                      <option value="http">HTTP</option>
                      <option value="stdio">stdio</option>
                    </select>
                  </div>
                )}
                {integrationType === "mcp" &&
                integrationTransport === "http" ? (
                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <label
                      htmlFor="integrationEndpoint"
                      style={{ minWidth: "72px" }}
                    >
                      Endpoint:
                    </label>
                    <input
                      id="integrationEndpoint"
                      type="text"
                      value={integrationEndpoint}
                      placeholder="https://mcp.example.com"
                      onChange={(event) =>
                        setIntegrationEndpoint(event.target.value)
                      }
                    />
                  </div>
                ) : integrationType === "mcp" ? (
                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <label
                      htmlFor="integrationCommand"
                      style={{ minWidth: "72px" }}
                    >
                      Command:
                    </label>
                    <input
                      id="integrationCommand"
                      type="text"
                      value={integrationCommand}
                      placeholder="npx @modelcontextprotocol/server-memory"
                      onChange={(event) =>
                        setIntegrationCommand(event.target.value)
                      }
                    />
                  </div>
                ) : (
                  <>
                    <div className="field-row" style={{ marginBottom: 0 }}>
                      <label
                        htmlFor="integrationBaseUrl"
                        style={{ minWidth: "72px" }}
                      >
                        Base URL:
                      </label>
                      <input
                        id="integrationBaseUrl"
                        type="text"
                        value={integrationBaseUrl}
                        placeholder="https://your-site.atlassian.net/wiki"
                        onChange={(event) =>
                          setIntegrationBaseUrl(event.target.value)
                        }
                      />
                    </div>
                    <div className="field-row" style={{ marginBottom: 0 }}>
                      <label
                        htmlFor="integrationAccountEmail"
                        style={{ minWidth: "72px" }}
                      >
                        Email:
                      </label>
                      <input
                        id="integrationAccountEmail"
                        type="text"
                        value={integrationAccountEmail}
                        placeholder="you@company.com"
                        onChange={(event) =>
                          setIntegrationAccountEmail(event.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <label
                    htmlFor="integrationCredential"
                    style={{ minWidth: "72px" }}
                  >
                    {integrationType === "confluence"
                      ? "API token:"
                      : "Credential:"}
                  </label>
                  <input
                    id="integrationCredential"
                    ref={credentialInputRef}
                    type="password"
                    placeholder={
                      integrationType === "confluence"
                        ? "Atlassian API token"
                        : "Optional token or secret"
                    }
                    autoComplete="off"
                  />
                </div>
                <p style={{ margin: 0 }}>
                  {integrationType === "confluence"
                    ? "The API token is stored separately from renderer settings state. Office Buddies will try to search and fetch matching Confluence pages when you ask a question."
                    : "Credentials are sent straight to the main process and stored separately from renderer settings state."}
                </p>
                {integrationError && (
                  <p style={{ margin: 0 }}>{integrationError}</p>
                )}
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <button
                    type="button"
                    onClick={handleSaveIntegration}
                    disabled={isSavingIntegration}
                  >
                    {isSavingIntegration ? "Saving..." : "Save Integration"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddIntegrationForm(false);
                      setIntegrationError("");
                    }}
                    disabled={isSavingIntegration}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="field-row" style={{ marginBottom: 0 }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddIntegrationForm((current) => !current);
                  setIntegrationError("");
                }}
              >
                {showAddIntegrationForm
                  ? "Hide Add Integration"
                  : "+ Add Integration"}
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

const KnowledgeListItem: React.FC<{
  source: KnowledgeFileSource | KnowledgeSource;
  onRemove: () => void;
}> = ({ source, onRemove }) => {
  return (
    <div className="settings-knowledge-item">
      <div>
        <div className="settings-knowledge-item-title">{source.name}</div>
        <div className="settings-knowledge-item-meta">{source.meta}</div>
        <div style={{ marginTop: "6px" }}>
          <button type="button" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
      <span className="settings-knowledge-badge">{source.status}</span>
    </div>
  );
};

const ConfiguredIntegrationRow: React.FC<{
  integration: IntegrationConfig;
  onDelete: () => void;
}> = ({ integration, onDelete }) => {
  const target =
    integration.type === "confluence"
      ? integration.baseUrl
      : integration.transport === "stdio"
        ? integration.command
        : integration.endpoint;
  const credentialState = integration.hasCredential
    ? "Credential saved"
    : "No credential";
  const title =
    integration.type === "confluence"
      ? `${integration.name} (confluence)`
      : `${integration.name} (${integration.type} via ${integration.transport || "http"})`;

  return (
    <div className="settings-knowledge-item">
      <div>
        <div className="settings-knowledge-item-title">{title}</div>
        <div className="settings-knowledge-item-meta">{target}</div>
        {integration.type === "confluence" && integration.accountEmail && (
          <div className="settings-knowledge-item-meta">
            {integration.accountEmail}
          </div>
        )}
        <div className="settings-knowledge-item-meta">{credentialState}</div>
        <div style={{ marginTop: "6px" }}>
          <button type="button" onClick={onDelete}>
            Delete Integration
          </button>
        </div>
      </div>
      <span className="settings-knowledge-badge">{integration.status}</span>
    </div>
  );
};
