import { useEffect, useState } from "react";
import { clippyApi } from "../clippyApi";
import { useSharedState } from "../contexts/SharedStateContext";
import { buildSystemPrompt } from "../prompt-helpers";

export const SettingsParameters: React.FC = () => {
  const { settings } = useSharedState();
  const [tempTopK, setTempTopK] = useState(settings.topK);
  const [tempTemperature, setTempTemperature] = useState(settings.temperature);
  const [tempRemoteMaxTokens, setTempRemoteMaxTokens] = useState(
    settings.remoteMaxTokens ?? 512,
  );
  const resolvedSystemPrompt = buildSystemPrompt(
    settings.systemPrompt,
    settings.selectedAgent || "Clippy",
  );

  // Update settings on unmount so that the user editing preferences
  // doesn't rapidly reload the model
  useEffect(() => {
    return () => {
      const isNewSettings =
        tempTopK !== settings.topK ||
        tempTemperature !== settings.temperature ||
        tempRemoteMaxTokens !== (settings.remoteMaxTokens ?? 512);

      if (isNewSettings) {
        clippyApi.setState("settings", {
          ...settings,
          topK: tempTopK,
          temperature: tempTemperature,
          remoteMaxTokens: tempRemoteMaxTokens,
        });
      }
    };
  }, [tempTopK, tempTemperature, tempRemoteMaxTokens]);

  return (
    <>
      <fieldset>
        <legend>Prompts</legend>
        <div className="field-row-stacked">
          <label htmlFor="systemPrompt">
            Resolved System Prompt for "{settings.selectedAgent || "Clippy"}"
            (read-only).
          </label>
          <textarea
            id="systemPrompt"
            rows={25}
            style={{ resize: "vertical" }}
            value={resolvedSystemPrompt}
            readOnly
          />
        </div>
      </fieldset>
      <fieldset style={{ marginTop: "20px" }}>
        <legend>Parameters</legend>
        <div className="field-row">
          <label htmlFor="topK">Top K</label>
          <input
            id="topK"
            type="number"
            value={tempTopK}
            step="0.1"
            onChange={(e) => setTempTopK(parseFloat(e.target.value))}
          />
        </div>
        <div className="field-row">
          <label htmlFor="temperature">Temperature</label>
          <input
            id="temperature"
            type="number"
            value={tempTemperature}
            step="0.1"
            onChange={(e) => setTempTemperature(parseFloat(e.target.value))}
          />
        </div>
        <div className="field-row">
          <label htmlFor="remoteMaxTokens">Remote Max Tokens</label>
          <input
            id="remoteMaxTokens"
            type="number"
            value={tempRemoteMaxTokens}
            min={64}
            max={8192}
            step={1}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (Number.isFinite(parsed)) {
                setTempRemoteMaxTokens(parsed);
              }
            }}
          />
        </div>
      </fieldset>
    </>
  );
};
