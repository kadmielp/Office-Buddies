import { useEffect, useRef, useState } from "react";

import {
  KnowledgeFileSource,
  KnowledgeMcpSource,
  MpcServerConfig,
  MpcServerType,
} from "../../../shared/shared-state";
import { clippyApi } from "../../clippyApi";
import { useSharedState } from "../../contexts/SharedStateContext";
import attachmentIcon from "../../images/icons/kb_files.png";
import networkDriveOnIcon from "../../images/icons/kb_mcp.png";
import { Checkbox } from "../../ui/Checkbox";

export const SettingsKnowledge: React.FC = () => {
  const { settings } = useSharedState();
  const [availableMcpSources, setAvailableMcpSources] = useState<
    KnowledgeMcpSource[]
  >([]);
  const [selectedMcpSourceId, setSelectedMcpSourceId] = useState("");
  const [isLoadingMcpSources, setIsLoadingMcpSources] = useState(false);
  const [isPickingFiles, setIsPickingFiles] = useState(false);
  const [showMcpBrowser, setShowMcpBrowser] = useState(false);
  const [showAddServerForm, setShowAddServerForm] = useState(false);
  const [isSavingServer, setIsSavingServer] = useState(false);
  const [serverName, setServerName] = useState("");
  const [serverType, setServerType] = useState<MpcServerType>("http");
  const [serverEndpoint, setServerEndpoint] = useState("");
  const [serverCommand, setServerCommand] = useState("");
  const [serverError, setServerError] = useState("");
  const credentialInputRef = useRef<HTMLInputElement>(null);

  const knowledgeFiles = settings.knowledgeFiles || [];
  const knowledgeMcpSources = settings.knowledgeMcpSources || [];
  const mcpServers = settings.mcpServers || [];
  const unselectedMcpSources = availableMcpSources.filter(
    (source) =>
      !knowledgeMcpSources.some(
        (selectedSource) => selectedSource.id === source.id,
      ),
  );

  useEffect(() => {
    const firstAvailableSource = unselectedMcpSources[0]?.id || "";

    if (
      firstAvailableSource &&
      !unselectedMcpSources.some((source) => source.id === selectedMcpSourceId)
    ) {
      setSelectedMcpSourceId(firstAvailableSource);
    }

    if (!firstAvailableSource) {
      setSelectedMcpSourceId("");
    }
  }, [selectedMcpSourceId, unselectedMcpSources]);

  useEffect(() => {
    const filesNeedingRefresh = knowledgeFiles.filter(
      (file) => {
        const normalizedName = file.name.toLowerCase();

        return (
          !file.previewText &&
          file.status !== "Error" &&
          (normalizedName.endsWith(".docx") || normalizedName.endsWith(".pdf"))
        );
      },
    );

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

  async function loadAvailableMcpSources() {
    setIsLoadingMcpSources(true);

    try {
      const sources = await clippyApi.getAvailableMcpSources();
      setAvailableMcpSources(sources);
    } finally {
      setIsLoadingMcpSources(false);
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

  async function handleBrowseMcp() {
    const nextShowMcpBrowser = !showMcpBrowser;
    setShowMcpBrowser(nextShowMcpBrowser);

    if (nextShowMcpBrowser) {
      await loadAvailableMcpSources();
    }
  }

  async function handleAddMcpSource() {
    const sourceToAdd = unselectedMcpSources.find(
      (source) => source.id === selectedMcpSourceId,
    );

    if (!sourceToAdd) {
      return;
    }

    await clippyApi.setState("settings.knowledgeMcpSources", [
      ...knowledgeMcpSources,
      sourceToAdd,
    ]);
  }

  async function handleRemoveMcpSource(sourceId: string) {
    await clippyApi.setState(
      "settings.knowledgeMcpSources",
      knowledgeMcpSources.filter((source) => source.id !== sourceId),
    );
  }

  async function handleDeleteMcpServer(serverId: string) {
    await clippyApi.deleteMcpServer(serverId);
    await loadAvailableMcpSources();
  }

  async function handleSaveMcpServer() {
    setIsSavingServer(true);
    setServerError("");

    try {
      await clippyApi.saveMcpServer({
        name: serverName,
        type: serverType,
        endpoint: serverType === "http" ? serverEndpoint : undefined,
        command: serverType === "stdio" ? serverCommand : undefined,
        credential: credentialInputRef.current?.value,
      });

      setServerName("");
      setServerEndpoint("");
      setServerCommand("");
      setShowAddServerForm(false);

      if (credentialInputRef.current) {
        credentialInputRef.current.value = "";
      }

      await loadAvailableMcpSources();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingServer(false);
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
              Selected files are included as session references, and MCP
              sources stay read-only by default as live workspace knowledge.
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
                src={attachmentIcon}
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
          <legend>MCP</legend>
          <div style={{ display: "grid", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <img
                src={networkDriveOnIcon}
                alt=""
                aria-hidden="true"
                style={{ width: "18px", height: "18px" }}
              />
              <strong>Connect live workspace sources</strong>
            </div>
            <p style={{ margin: 0 }}>
              Use MCP for richer, structured context like issue trackers, docs,
              databases, or design systems.
            </p>
            <div className="sunken-panel" style={{ padding: "8px" }}>
              {knowledgeMcpSources.length === 0 ? (
                <div className="settings-knowledge-item">
                  <div className="settings-knowledge-item-meta">
                    No MCP knowledge sources connected yet.
                  </div>
                </div>
              ) : (
                knowledgeMcpSources.map((source) => (
                  <KnowledgeListItem
                    key={source.id}
                    source={source}
                    onRemove={() => handleRemoveMcpSource(source.id)}
                  />
                ))
              )}
            </div>

            <div
              className="sunken-panel"
              style={{ padding: "10px", display: "grid", gap: "8px" }}
            >
              <strong>Configured MCP Servers</strong>
              {mcpServers.length === 0 ? (
                <span>No custom MCP servers configured yet.</span>
              ) : (
                mcpServers.map((server) => (
                  <ConfiguredMcpServerRow
                    key={server.id}
                    server={server}
                    onDelete={() => handleDeleteMcpServer(server.id)}
                  />
                ))
              )}
            </div>

            {showAddServerForm && (
              <div
                className="sunken-panel"
                style={{ padding: "10px", display: "grid", gap: "8px" }}
              >
                <strong>Add MCP Server</strong>
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <label htmlFor="mcpServerName" style={{ minWidth: "68px" }}>
                    Name:
                  </label>
                  <input
                    id="mcpServerName"
                    type="text"
                    value={serverName}
                    onChange={(event) => setServerName(event.target.value)}
                  />
                </div>
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <label htmlFor="mcpServerType" style={{ minWidth: "68px" }}>
                    Type:
                  </label>
                  <select
                    id="mcpServerType"
                    value={serverType}
                    onChange={(event) =>
                      setServerType(event.target.value as MpcServerType)
                    }
                  >
                    <option value="http">HTTP</option>
                    <option value="stdio">stdio</option>
                  </select>
                </div>
                {serverType === "http" ? (
                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <label
                      htmlFor="mcpServerEndpoint"
                      style={{ minWidth: "68px" }}
                    >
                      Endpoint:
                    </label>
                    <input
                      id="mcpServerEndpoint"
                      type="text"
                      value={serverEndpoint}
                      placeholder="https://mcp.example.com"
                      onChange={(event) =>
                        setServerEndpoint(event.target.value)
                      }
                    />
                  </div>
                ) : (
                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <label
                      htmlFor="mcpServerCommand"
                      style={{ minWidth: "68px" }}
                    >
                      Command:
                    </label>
                    <input
                      id="mcpServerCommand"
                      type="text"
                      value={serverCommand}
                      placeholder="npx @modelcontextprotocol/server-memory"
                      onChange={(event) => setServerCommand(event.target.value)}
                    />
                  </div>
                )}
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <label
                    htmlFor="mcpServerCredential"
                    style={{ minWidth: "68px" }}
                  >
                    Credential:
                  </label>
                  <input
                    id="mcpServerCredential"
                    ref={credentialInputRef}
                    type="password"
                    placeholder="Optional token or secret"
                    autoComplete="off"
                  />
                </div>
                <p style={{ margin: 0 }}>
                  Credentials are sent straight to the main process and stored
                  separately from renderer settings state.
                </p>
                {serverError && <p style={{ margin: 0 }}>{serverError}</p>}
                <div className="field-row" style={{ marginBottom: 0 }}>
                  <button
                    type="button"
                    onClick={handleSaveMcpServer}
                    disabled={isSavingServer}
                  >
                    {isSavingServer ? "Saving..." : "Save Server"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddServerForm(false);
                      setServerError("");
                    }}
                    disabled={isSavingServer}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showMcpBrowser && (
              <div
                className="sunken-panel"
                style={{ padding: "10px", display: "grid", gap: "8px" }}
              >
                <strong>Available MCP Sources</strong>
                {isLoadingMcpSources ? (
                  <span>Loading available MCP sources...</span>
                ) : unselectedMcpSources.length === 0 ? (
                  <span>All available MCP sources are already attached.</span>
                ) : (
                  <>
                    <div className="field-row" style={{ marginBottom: 0 }}>
                      <label
                        htmlFor="knowledgeMcpSelect"
                        style={{ minWidth: "68px" }}
                      >
                        Source:
                      </label>
                      <select
                        id="knowledgeMcpSelect"
                        value={selectedMcpSourceId}
                        onChange={(event) =>
                          setSelectedMcpSourceId(event.target.value)
                        }
                      >
                        {unselectedMcpSources.map((source) => (
                          <option key={source.id} value={source.id}>
                            {source.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p style={{ margin: 0 }}>
                      MCP knowledge stays read-oriented by default so the model
                      can reference live workspace context without mutating it.
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="field-row" style={{ marginBottom: 0 }}>
              <button type="button" onClick={handleBrowseMcp}>
                {showMcpBrowser ? "Hide MCP Browser" : "Browse MCP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddServerForm((current) => !current);
                  setServerError("");
                }}
              >
                {showAddServerForm ? "Hide Add Server" : "+ Add MCP Server"}
              </button>
              <button
                type="button"
                onClick={handleAddMcpSource}
                disabled={
                  !showMcpBrowser ||
                  isLoadingMcpSources ||
                  unselectedMcpSources.length === 0 ||
                  !selectedMcpSourceId
                }
              >
                Add Resource
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

const KnowledgeListItem: React.FC<{
  source: KnowledgeFileSource | KnowledgeMcpSource;
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

const ConfiguredMcpServerRow: React.FC<{
  server: MpcServerConfig;
  onDelete: () => void;
}> = ({ server, onDelete }) => {
  const target = server.type === "http" ? server.endpoint : server.command;
  const credentialState = server.hasCredential ? "Credential saved" : "No credential";

  return (
    <div className="settings-knowledge-item">
      <div>
        <div className="settings-knowledge-item-title">
          {server.name} ({server.type})
        </div>
        <div className="settings-knowledge-item-meta">{target}</div>
        <div className="settings-knowledge-item-meta">{credentialState}</div>
        <div style={{ marginTop: "6px" }}>
          <button type="button" onClick={onDelete}>
            Delete Server
          </button>
        </div>
      </div>
      <span className="settings-knowledge-badge">{server.status}</span>
    </div>
  );
};

