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
          id="clippyAlwaysOnTop"
          label="Keep Clippy always on top of all other windows"
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
          label="Always open chat when Clippy starts"
          checked={settings.alwaysOpenChat}
          onChange={(checked) => {
            clippyApi.setState("settings.alwaysOpenChat", checked);
          }}
        />
      </fieldset>
    </div>
  );
};
