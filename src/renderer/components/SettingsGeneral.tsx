import { clippyApi } from "../clippyApi";
import { useSharedState } from "../contexts/SharedStateContext";
import { Checkbox } from "./Checkbox";

export const SettingsGeneral: React.FC = () => {
  const { settings } = useSharedState();

  return (
    <div>
      <fieldset>
        <legend>Window Options</legend>
        <Checkbox
          id="alwaysOnTop"
          label="Keep Clippy always on top of all other windows"
          checked={settings.alwaysOnTop}
          onChange={(checked) => {
            clippyApi.setState('settings.alwaysOnTop', checked);
          }}
        />
        <Checkbox
          id="alwaysOpenChat"
          label="Always open chat when Clippy starts"
          checked={settings.alwaysOpenChat}
          onChange={(checked) => {
            clippyApi.setState('settings.alwaysOpenChat', checked);
          }}
        />
      </fieldset>
    </div>
  );
};
