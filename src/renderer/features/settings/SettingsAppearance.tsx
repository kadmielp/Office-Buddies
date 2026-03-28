import { useEffect, useState } from "react";

import { DEFAULT_SETTINGS, SettingsState } from "../../../shared/shared-state";
import { clippyApi } from "../../clippyApi";
import { useSharedState } from "../../contexts/SharedStateContext";
import { Checkbox } from "../../ui/Checkbox";
import { AssistantGallery } from "../assistant/AssistantGallery";

export const SettingsAppearance: React.FC = () => {
  const { settings } = useSharedState();
  const [pendingUiDesign, setPendingUiDesign] = useState(settings.uiDesign);

  useEffect(() => {
    setPendingUiDesign(settings.uiDesign);
  }, [settings.uiDesign]);

  const onChangeFontSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);

    if (!isNaN(newSize)) {
      clippyApi.setState("settings.defaultFontSize", newSize);
    }
  };

  const onApplyUiDesign = async () => {
    if (pendingUiDesign === settings.uiDesign) {
      return;
    }

    await clippyApi.setState("settings.uiDesign", pendingUiDesign);
    await clippyApi.restartApp();
  };

  const onReset = () => {
    const defaultAppareanceSettings: Partial<SettingsState> = {
      defaultFont: DEFAULT_SETTINGS.defaultFont,
      defaultFontSize: DEFAULT_SETTINGS.defaultFontSize,
      clippyAlwaysOnTop: DEFAULT_SETTINGS.clippyAlwaysOnTop,
      chatAlwaysOnTop: DEFAULT_SETTINGS.chatAlwaysOnTop,
      alwaysOpenChat: DEFAULT_SETTINGS.alwaysOpenChat,
      selectedAgent: DEFAULT_SETTINGS.selectedAgent,
    };

    for (const key in defaultAppareanceSettings) {
      clippyApi.setState(
        `settings.${key}`,
        defaultAppareanceSettings[key as keyof typeof defaultAppareanceSettings],
      );
    }

    setPendingUiDesign(DEFAULT_SETTINGS.uiDesign);
  };

  const hasPendingUiDesignChange = pendingUiDesign !== settings.uiDesign;

  return (
    <div>
      <fieldset>
        <legend>UI Design</legend>
        <div className="field-row" style={{ width: 300 }}>
          <label htmlFor="uiDesign" style={{ width: 58 }}>
            Style:
          </label>
          <select
            id="uiDesign"
            value={pendingUiDesign}
            onChange={(event) => {
              setPendingUiDesign(event.target.value as typeof settings.uiDesign);
            }}
          >
            <option value="Win98">Win98</option>
            <option value="WinXP">WinXP</option>
          </select>
        </div>
        <div className="field-row" style={{ marginTop: 8 }}>
          <button onClick={() => void onApplyUiDesign()} disabled={!hasPendingUiDesignChange}>
            Apply and Restart
          </button>
          <span style={{ color: "#555" }}>Theme changes require a restart.</span>
        </div>
      </fieldset>
      <fieldset>
        <legend>Window Options</legend>
        <Checkbox
          id="clippyAlwaysOnTop"
          label="Keep Office Buddies always on top of all other windows"
          checked={settings.clippyAlwaysOnTop}
          onChange={(checked) => {
            clippyApi.setState("settings.clippyAlwaysOnTop", checked);
          }}
        />
        <Checkbox
          id="chatAlwaysOnTop"
          label="Keep chat always on top of all other windows"
          checked={settings.chatAlwaysOnTop}
          onChange={(checked) => {
            clippyApi.setState("settings.chatAlwaysOnTop", checked);
          }}
        />
        <Checkbox
          id="alwaysOpenChat"
          label="Always open chat when Office Buddies starts"
          checked={settings.alwaysOpenChat}
          onChange={(checked) => {
            clippyApi.setState("settings.alwaysOpenChat", checked);
          }}
        />
      </fieldset>
      <fieldset>
        <legend>Font Options</legend>
        <div className="field-row" style={{ width: 300 }}>
          <label style={{ width: 100 }}>Font size:</label>
          <label>8px</label>
          <input
            type="range"
            min="8"
            max="20"
            step={1}
            value={settings.defaultFontSize}
            onChange={onChangeFontSize}
          />
          <label>20px</label>
        </div>
        <div className="field-row" style={{ width: 300 }}>
          <label htmlFor="defaultFont" style={{ width: 58 }}>
            Font:
          </label>
          <select
            id="defaultFont"
            value={settings.defaultFont}
            onChange={(event) => {
              clippyApi.setState("settings.defaultFont", event.target.value);
            }}
          >
            <option value="Pixelated MS Sans Serif">
              Pixelated MS Sans Serif
            </option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Tahoma">Tahoma</option>
            <option value="System Default">System Default</option>
          </select>
        </div>
      </fieldset>
      <button style={{ marginTop: 10 }} onClick={onReset}>
        Reset
      </button>
      <div className="settings-appearance-gallery-section">
        <AssistantGallery embedded />
      </div>
    </div>
  );
};

