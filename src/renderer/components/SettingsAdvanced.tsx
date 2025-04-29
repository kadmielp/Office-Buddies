import { clippyApi } from "../clippyApi";

export const SettingsAdvanced: React.FC = () => {
  return (
    <div>
      <button onClick={clippyApi.openStateInEditor}>Open State File</button>
    </div>
  );
}
