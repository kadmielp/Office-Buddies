import { clippyApi } from "../clippyApi";

export const SettingsAdvanced: React.FC = () => {
  return (
    <div>
      <fieldset>
        <legend>Configuration</legend>
        <p>
          Clippy keeps its configuration in JSON files. Click these buttons to
          open them in your default JSON editor. After editing, restart Clippy
          to apply the changes.
        </p>
        <button onClick={clippyApi.openStateInEditor}>
          Open Configuration File
        </button>
        <button onClick={clippyApi.openDebugStateInEditor}>
          Open Debug File
        </button>
      </fieldset>
      <fieldset>
        <legend>Delete All Models</legend>
        <p>
          This will delete all models from Clippy. This action is not
          reversible.
        </p>
        <button onClick={clippyApi.deleteAllModels}>Delete All Models</button>
      </fieldset>
    </div>
  );
};
