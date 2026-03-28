import { useEffect, useState } from "react";

import {
  IntegrationConfig,
  IntegrationTestResult,
  IntegrationType,
  KnowledgeFileSource,
  KnowledgeSource,
  McpTransportType,
} from "../../../shared/shared-state";
import { clippyApi } from "../../clippyApi";
import { useSharedState } from "../../contexts/SharedStateContext";
import { getThemeIcons } from "../../theme/theme";

type CredentialMode = "none" | "keep" | "replace" | "remove";

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
  const [showIntegrationForm, setShowIntegrationForm] = useState(false);
  const [editingIntegrationId, setEditingIntegrationId] = useState<
    string | null
  >(null);
  const [isSavingIntegration, setIsSavingIntegration] = useState(false);
  const [isTestingIntegration, setIsTestingIntegration] = useState(false);
  const [integrationName, setIntegrationName] = useState("");
  const [integrationType, setIntegrationType] =
    useState<IntegrationType>("mcp");
  const [integrationTransport, setIntegrationTransport] =
    useState<McpTransportType>("http");
  const [integrationEndpoint, setIntegrationEndpoint] = useState("");
  const [integrationCommand, setIntegrationCommand] = useState("");
  const [integrationBaseUrl, setIntegrationBaseUrl] = useState("");
  const [integrationAccountEmail, setIntegrationAccountEmail] = useState("");
  const [integrationCredential, setIntegrationCredential] = useState("");
  const [credentialMode, setCredentialMode] = useState<CredentialMode>("none");
  const [integrationError, setIntegrationError] = useState("");
  const [integrationTestResult, setIntegrationTestResult] =
    useState<IntegrationTestResult | null>(null);

  const knowledgeFiles = settings.knowledgeFiles || [];
  const knowledgeSources = settings.knowledgeSources || [];
  const integrations = settings.integrations || [];
  const editingIntegration = integrations.find(
    (integration) => integration.id === editingIntegrationId,
  );
  const isEditingIntegration = Boolean(editingIntegration);
  const hasSavedCredential = Boolean(editingIntegration?.hasCredential);
  const unselectedKnowledgeSources = availableKnowledgeSources.filter(
    (source) =>
      !knowledgeSources.some(
        (selectedSource) => selectedSource.id === source.id,
      ),
  );
  const shouldShowCredentialMode = isEditingIntegration && hasSavedCredential;
  const shouldShowCredentialInput =
    !shouldShowCredentialMode || credentialMode === "replace";
  const credentialLabel =
    integrationType === "confluence" || integrationType === "notion"
      ? "API token:"
      : "Credential:";
  const credentialInputLabel =
    shouldShowCredentialMode && credentialMode === "replace"
      ? integrationType === "confluence" || integrationType === "notion"
        ? "New token:"
        : "New secret:"
      : credentialLabel;

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
    if (!editingIntegrationId) {
      return;
    }

    const integrationStillExists = integrations.some(
      (integration) => integration.id === editingIntegrationId,
    );

    if (!integrationStillExists) {
      resetIntegrationForm();
      setShowIntegrationForm(false);
    }
  }, [editingIntegrationId, integrations]);

  useEffect(() => {
    setIntegrationTestResult(null);
  }, [
    editingIntegrationId,
    integrationName,
    integrationType,
    integrationTransport,
    integrationEndpoint,
    integrationCommand,
    integrationBaseUrl,
    integrationAccountEmail,
    integrationCredential,
    credentialMode,
  ]);

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

  function resetIntegrationForm() {
    setEditingIntegrationId(null);
    setIntegrationName("");
    setIntegrationType("mcp");
    setIntegrationTransport("http");
    setIntegrationEndpoint("");
    setIntegrationCommand("");
    setIntegrationBaseUrl("");
    setIntegrationAccountEmail("");
    setIntegrationCredential("");
    setCredentialMode("none");
    setIntegrationError("");
    setIntegrationTestResult(null);
  }

  function handleStartAddIntegration() {
    resetIntegrationForm();
    setShowIntegrationForm(true);
  }

  function handleStartEditIntegration(integration: IntegrationConfig) {
    setEditingIntegrationId(integration.id);
    setIntegrationName(integration.name);
    setIntegrationType(integration.type);
    setIntegrationTransport(integration.transport || "http");
    setIntegrationEndpoint(integration.endpoint || "");
    setIntegrationCommand(integration.command || "");
    setIntegrationBaseUrl(integration.baseUrl || "");
    setIntegrationAccountEmail(integration.accountEmail || "");
    setIntegrationCredential("");
    setCredentialMode(integration.hasCredential ? "keep" : "none");
    setIntegrationError("");
    setShowIntegrationForm(true);
  }

  function handleCancelIntegrationForm() {
    resetIntegrationForm();
    setShowIntegrationForm(false);
  }

  function getCredentialPayload():
    | { ok: true; credential: string | undefined }
    | { ok: false; message: string } {
    const trimmedCredential = integrationCredential.trim();

    if (hasSavedCredential) {
      if (credentialMode === "keep") {
        return { ok: true, credential: undefined };
      }

      if (credentialMode === "remove") {
        return { ok: true, credential: "" };
      }

      if (!trimmedCredential) {
        return {
          ok: false,
          message:
            "Enter a new credential or choose to keep or remove the saved one.",
        };
      }

      return { ok: true, credential: trimmedCredential };
    }

    return {
      ok: true,
      credential: trimmedCredential || undefined,
    };
  }

  async function handleDeleteIntegration(integrationId: string) {
    if (editingIntegrationId === integrationId) {
      handleCancelIntegrationForm();
    }

    await clippyApi.deleteIntegration(integrationId);
    await loadAvailableKnowledgeSources();
  }

  async function handleSaveIntegration() {
    const credentialPayload = getCredentialPayload();

    if ("message" in credentialPayload) {
      setIntegrationError(credentialPayload.message);
      return;
    }

    setIsSavingIntegration(true);
    setIntegrationError("");
    setIntegrationTestResult(null);

    try {
      await clippyApi.saveIntegration({
        id: editingIntegration?.id,
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
        credential: credentialPayload.credential,
      });

      handleCancelIntegrationForm();
      await loadAvailableKnowledgeSources();
    } catch (error) {
      setIntegrationError(
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setIsSavingIntegration(false);
    }
  }

  async function handleTestIntegration() {
    const credentialPayload = getCredentialPayload();

    if ("message" in credentialPayload) {
      setIntegrationError(credentialPayload.message);
      setIntegrationTestResult(null);
      return;
    }

    setIsTestingIntegration(true);
    setIntegrationError("");
    setIntegrationTestResult(null);

    try {
      const result = await clippyApi.testIntegration({
        id: editingIntegration?.id,
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
        credential: credentialPayload.credential,
      });

      setIntegrationTestResult(result);
    } catch (error) {
      setIntegrationTestResult({
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsTestingIntegration(false);
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
            <p style={{ margin: "8px 0 0 0" }}>
              Files and connected sources are configured here. Mini chat has its
              own knowledge toggle when you want to use them for a quick lookup.
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
              MCP, Confluence, and Notion are supported integration types. This
              keeps knowledge sources separate from the connection method they come
              from.
            </p>
            <div
              className="sunken-panel"
              style={{ padding: "10px", display: "grid", gap: "8px" }}
            >
              <strong>Configured Integrations</strong>
              <span>
                Edit an integration to fix its endpoint, email, or credential
                without removing attached knowledge sources.
              </span>
              {integrations.length === 0 ? (
                <span>No integrations configured yet.</span>
              ) : (
                integrations.map((integration) => (
                  <ConfiguredIntegrationRow
                    key={integration.id}
                    integration={integration}
                    onEdit={() => handleStartEditIntegration(integration)}
                    onDelete={() => handleDeleteIntegration(integration.id)}
                  />
                ))
              )}
            </div>

            {showIntegrationForm && (
              <div
                className="sunken-panel"
                style={{ padding: "10px", display: "grid", gap: "8px" }}
              >
                <strong>
                  {isEditingIntegration
                    ? "Edit Integration"
                    : "Add Integration"}
                </strong>
                <span>
                  {isEditingIntegration
                    ? "Update the connection details here. Attached sources stay connected."
                    : "Create a reusable connection first, then attach it as a knowledge source above."}
                </span>
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
                    <option value="notion">Notion</option>
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
                ) : integrationType === "confluence" ? (
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
                ) : (
                  <p style={{ margin: 0 }}>
                    Share the relevant pages with your Notion integration, then
                    paste the integration token below.
                  </p>
                )}
                {shouldShowCredentialMode && (
                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <label
                      htmlFor="integrationCredentialMode"
                      style={{ minWidth: "72px" }}
                    >
                      {credentialLabel}
                    </label>
                    <select
                      id="integrationCredentialMode"
                      value={credentialMode}
                      onChange={(event) =>
                        setCredentialMode(event.target.value as CredentialMode)
                      }
                    >
                      <option value="keep">Keep saved credential</option>
                      <option value="replace">Replace saved credential</option>
                      <option value="remove">Remove saved credential</option>
                    </select>
                  </div>
                )}
                {shouldShowCredentialInput && (
                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <label
                      htmlFor="integrationCredential"
                      style={{ minWidth: "72px" }}
                    >
                      {credentialInputLabel}
                    </label>
                    <input
                      id="integrationCredential"
                      type="password"
                      value={integrationCredential}
                      placeholder={
                        integrationType === "confluence"
                          ? "Atlassian API token"
                          : integrationType === "notion"
                            ? "Notion integration token"
                          : "Optional token or secret"
                      }
                      autoComplete="off"
                      onChange={(event) =>
                        setIntegrationCredential(event.target.value)
                      }
                    />
                  </div>
                )}
                <p style={{ margin: 0 }}>
                  {hasSavedCredential && credentialMode === "keep"
                    ? "A credential is already stored for this integration and will be kept unless you choose another option."
                    : hasSavedCredential && credentialMode === "remove"
                      ? "Saving now will remove the stored credential for this integration."
                      : integrationType === "confluence"
                        ? "The API token is stored separately from renderer settings state. Office Buddies will try to search and fetch matching Confluence pages when you ask a question."
                        : integrationType === "notion"
                          ? "The API token is stored separately from renderer settings state. Office Buddies will try to search and fetch shared Notion pages when you ask a question."
                        : "Credentials are sent straight to the main process and stored separately from renderer settings state."}
                </p>
                {integrationError && (
                  <p style={{ margin: 0 }}>{integrationError}</p>
                )}
                {integrationTestResult && (
                  <p style={{ margin: 0 }}>
                    {integrationTestResult.message}
                    {integrationTestResult.details
                      ? ` ${integrationTestResult.details}`
                      : ""}
                  </p>
                )}
                <div className="field-row" style={{ marginBottom: 0 }}>
                  {(integrationType === "confluence" ||
                    integrationType === "notion") && (
                    <button
                      type="button"
                      onClick={handleTestIntegration}
                      disabled={isSavingIntegration || isTestingIntegration}
                    >
                      {isTestingIntegration ? "Testing..." : "Test Connection"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveIntegration}
                    disabled={isSavingIntegration || isTestingIntegration}
                  >
                    {isSavingIntegration
                      ? "Saving..."
                      : isEditingIntegration
                        ? "Save Changes"
                        : "Save Integration"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelIntegrationForm}
                    disabled={isSavingIntegration || isTestingIntegration}
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
                  if (showIntegrationForm && !isEditingIntegration) {
                    handleCancelIntegrationForm();
                    return;
                  }

                  handleStartAddIntegration();
                }}
              >
                {showIntegrationForm && !isEditingIntegration
                  ? "Hide Add Integration"
                  : showIntegrationForm
                    ? "+ Add Another Integration"
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
  onEdit: () => void;
  onDelete: () => void;
}> = ({ integration, onEdit, onDelete }) => {
  const target =
    integration.type === "confluence"
      ? integration.baseUrl
      : integration.type === "notion"
        ? "Shared Notion pages"
      : integration.transport === "stdio"
        ? integration.command
        : integration.endpoint;
  const credentialState = integration.hasCredential
    ? "Credential saved"
    : "No credential";
  const title =
    integration.type === "confluence"
      ? `${integration.name} (confluence)`
      : integration.type === "notion"
        ? `${integration.name} (notion)`
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
          <button type="button" onClick={onEdit}>
            Edit
          </button>{" "}
          <button type="button" onClick={onDelete}>
            Delete Integration
          </button>
        </div>
      </div>
      <span className="settings-knowledge-badge">{integration.status}</span>
    </div>
  );
};
