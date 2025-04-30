import { clippyApi } from "../clippyApi";

export const SettingsAdvanced: React.FC = () => {
  return (
    <div>
      <fieldset>
        <legend>State</legend>
        <p>Clippy keeps its configuration in a JSON file. Click this button to open it in your default JSON editor.</p>
        <button onClick={clippyApi.openStateInEditor}>Open State File</button>
      </fieldset>
      <fieldset>
        <legend>Delete All Models</legend>
        <p>This will delete all models from Clippy. This action is not reversible.</p>
        <button onClick={clippyApi.deleteAllModels}>Delete All Models</button>
      </fieldset>
    </div>
  );
}
