import { useState } from "react";

import attachmentIcon from "../images/icons/kb_files.png";
import networkDriveOnIcon from "../images/icons/kb_mcp.png";
import { Checkbox } from "./Checkbox";

const knowledgeSources = {
  files: [
    {
      name: "Product brief.md",
      meta: "Attached to this session",
      status: "Ready",
    },
    {
      name: "Launch checklist.pdf",
      meta: "Pinned from local files",
      status: "Indexed",
    },
  ],
  mcp: [
    {
      name: "Linear workspace",
      meta: "Issues, projects, and docs",
      status: "Connected",
    },
    {
      name: "Design system server",
      meta: "Components and usage notes",
      status: "Available",
    },
  ],
};

export const SettingsKnowledge: React.FC = () => {
  const [useKnowledgeAtStart, setUseKnowledgeAtStart] = useState(true);

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
                checked={useKnowledgeAtStart}
                onChange={setUseKnowledgeAtStart}
              />
            </div>
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
              Good for briefs, notes, PDFs, and one-off files that should influence the session.
            </p>
            <div className="sunken-panel" style={{ padding: "8px" }}>
              {knowledgeSources.files.map((source) => (
                <div key={source.name} className="settings-knowledge-item">
                  <div>
                    <div className="settings-knowledge-item-title">
                      {source.name}
                    </div>
                    <div className="settings-knowledge-item-meta">
                      {source.meta}
                    </div>
                  </div>
                  <span className="settings-knowledge-badge">{source.status}</span>
                </div>
              ))}
            </div>
            <div className="field-row" style={{ marginBottom: 0 }}>
              <button type="button">Add Files</button>
              <button type="button" disabled>
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
              {knowledgeSources.mcp.map((source) => (
                <div key={source.name} className="settings-knowledge-item">
                  <div>
                    <div className="settings-knowledge-item-title">
                      {source.name}
                    </div>
                    <div className="settings-knowledge-item-meta">
                      {source.meta}
                    </div>
                  </div>
                  <span className="settings-knowledge-badge">{source.status}</span>
                </div>
              ))}
            </div>
            <div className="field-row" style={{ marginBottom: 0 }}>
              <button type="button">Browse MCP</button>
              <button type="button" disabled>
                Add Resource
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};
