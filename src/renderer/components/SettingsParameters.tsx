import { useEffect, useState } from "react";
import { clippyApi } from "../clippyApi";
import { useSharedState } from "../contexts/SharedStateContext";
import { buildSystemPrompt } from "../prompt-helpers";

export const SettingsParameters: React.FC = () => {
  const { settings } = useSharedState();
  const [tempTopK, setTempTopK] = useState(settings.topK);
  const [tempTemperature, setTempTemperature] = useState(settings.temperature);
  const resolvedSystemPrompt = buildSystemPrompt(
    settings.systemPrompt,
    settings.selectedAgent || "Clippy",
  );

  // Update settings on unmount so that the user editing preferences
  // doesn't rapidly reload the model
  useEffect(() => {
    return () => {
      const isNewSettings =
        tempTopK !== settings.topK || tempTemperature !== settings.temperature;

      if (isNewSettings) {
        clippyApi.setState("settings", {
          ...settings,
          topK: tempTopK,
          temperature: tempTemperature,
        });
      }
    };
  }, [tempTopK, tempTemperature]);

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
            rows={8}
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
      </fieldset>
    </>
  );
};
