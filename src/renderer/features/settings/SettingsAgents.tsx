import { useCallback, useEffect, useState } from "react";

import { clippyApi } from "../../clippyApi";
import { useSharedState } from "../../contexts/SharedStateContext";
import { Checkbox } from "../../ui/Checkbox";
import {
  AGENT_SOURCE_LABELS,
  AgentHookInfo,
  AgentHookPreview,
  AgentSource,
} from "../../../shared/agent-events";

type PendingChange = {
  mode: "install" | "uninstall";
  preview: AgentHookPreview;
};

export const SettingsAgents: React.FC = () => {
  const { settings } = useSharedState();
  const isListenerEnabled = !!settings.enableProactiveMessages;

  return (
    <div>
      <fieldset>
        <legend>Listener</legend>
        <Checkbox
          id="enableProactive"
          label="Listen for agent and OpenClaw notifications"
          checked={isListenerEnabled}
          onChange={(checked) => {
            clippyApi.setState("settings.enableProactiveMessages", checked);
          }}
        />
        <div className="field-row" style={{ marginTop: "6px" }}>
          <label htmlFor="proactivePort">Port:</label>
          <input
            id="proactivePort"
            type="number"
            value={settings.proactivePort || 5050}
            style={{ width: "70px" }}
            onChange={(e) => {
              clippyApi.setState(
                "settings.proactivePort",
                parseInt(e.target.value),
              );
            }}
          />
        </div>
        <p style={{ marginBottom: 0 }}>
          Office Buddies listens on 127.0.0.1 only. Installed hooks include a
          private token, so other programs can't post fake requests.
        </p>
      </fieldset>
      <AgentHookRow
        source="claude-code"
        isListenerEnabled={isListenerEnabled}
      />
      <AgentHookRow
        source="codex"
        isListenerEnabled={isListenerEnabled}
        note={
          <>
            Codex only runs hooks you have approved. After installing, run{" "}
            <code>/hooks</code> in Codex and trust the Office Buddies hook.
          </>
        }
      />
    </div>
  );
};

const AgentHookRow: React.FC<{
  source: AgentSource;
  isListenerEnabled: boolean;
  note?: React.ReactNode;
}> = ({ source, isListenerEnabled, note }) => {
  const { settings } = useSharedState();
  const [info, setInfo] = useState<AgentHookInfo | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [error, setError] = useState<string | null>(null);
  const showFinished = settings.agentShowFinished?.[source] !== false;

  const refresh = useCallback(() => {
    clippyApi
      .getAgentHookInfo(source)
      .then(setInfo)
      .catch((reason) => setError(String(reason)));
  }, [source]);

  // The hook embeds the port and token, so re-check when either changes.
  useEffect(refresh, [
    refresh,
    settings.proactivePort,
    settings.agentHookToken,
  ]);

  const requestChange = async (mode: PendingChange["mode"]) => {
    setError(null);

    try {
      setPending({
        mode,
        preview: await clippyApi.previewAgentHooks(source, mode),
      });
    } catch (reason) {
      setError(String(reason));
    }
  };

  const applyChange = async () => {
    if (!pending) {
      return;
    }

    try {
      setInfo(
        pending.mode === "install"
          ? await clippyApi.installAgentHooks(source)
          : await clippyApi.uninstallAgentHooks(source),
      );
      setPending(null);
    } catch (reason) {
      setError(String(reason));
    }
  };

  const statusLabel =
    info?.status === "installed"
      ? "Installed"
      : info?.status === "outdated"
        ? "Needs update (port or token changed)"
        : "Not installed";

  return (
    <fieldset>
      <legend>{AGENT_SOURCE_LABELS[source]}</legend>
      <p style={{ marginTop: 0 }}>
        Status: <strong>{statusLabel}</strong>
        {info?.configPath ? ` · ${info.configPath}` : ""}
      </p>
      {note && <p>{note}</p>}
      {!isListenerEnabled && info?.status !== "not_installed" && (
        <p>Turn on the listener above, or the buddy won't hear anything.</p>
      )}
      <Checkbox
        id={`agentShowFinished-${source}`}
        label='Show "Finished" notifications'
        checked={showFinished}
        onChange={(checked) => {
          clippyApi.setState("settings.agentShowFinished", {
            ...(settings.agentShowFinished ?? {}),
            [source]: checked,
          });
        }}
      />
      {!pending && (
        <div className="field-row" style={{ marginTop: "8px", gap: "6px" }}>
          <button onClick={() => requestChange("install")}>
            {info?.status === "installed"
              ? "Reinstall…"
              : info?.status === "outdated"
                ? "Update…"
                : "Install…"}
          </button>
          {info?.status !== "not_installed" && (
            <button onClick={() => requestChange("uninstall")}>
              Uninstall…
            </button>
          )}
        </div>
      )}
      {pending && (
        <div style={{ marginTop: "8px" }}>
          <p style={{ margin: "0 0 4px" }}>
            {pending.mode === "install"
              ? "Install will change"
              : "Uninstall will change"}{" "}
            <code>{pending.preview.configPath}</code>. A backup is saved next to
            it.
          </p>
          <ConfigDiff
            before={pending.preview.before}
            after={pending.preview.after}
          />
          <div className="field-row" style={{ marginTop: "8px", gap: "6px" }}>
            <button onClick={applyChange}>
              {pending.mode === "install" ? "Install" : "Uninstall"}
            </button>
            <button onClick={() => setPending(null)}>Cancel</button>
          </div>
        </div>
      )}
      {error && <p style={{ marginBottom: 0 }}>Error: {error}</p>}
    </fieldset>
  );
};

const ConfigDiff: React.FC<{ before: string; after: string }> = ({
  before,
  after,
}) => {
  const lines = diffLines(before, after);

  return (
    <pre
      style={{
        maxHeight: "220px",
        overflow: "auto",
        margin: 0,
        padding: "6px",
        fontSize: "11px",
        background: "rgba(127, 127, 127, 0.12)",
      }}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            background:
              line.type === "added"
                ? "rgba(16, 124, 16, 0.18)"
                : line.type === "removed"
                  ? "rgba(196, 43, 28, 0.18)"
                  : undefined,
          }}
        >
          {line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  "}
          {line.text}
        </div>
      ))}
    </pre>
  );
};

type DiffLine = { type: "same" | "added" | "removed"; text: string };

// Minimal LCS line diff; settings files are small enough for O(n*m).
function diffLines(before: string, after: string): DiffLine[] {
  const a = before ? before.replace(/\r\n/g, "\n").trimEnd().split("\n") : [];
  const b = after.replace(/\r\n/g, "\n").trimEnd().split("\n");
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] =
        a[i] === b[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      result.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (
      j < b.length &&
      (i >= a.length || lcs[i][j + 1] >= lcs[i + 1][j])
    ) {
      result.push({ type: "added", text: b[j] });
      j++;
    } else {
      result.push({ type: "removed", text: a[i] });
      i++;
    }
  }

  return result;
}
