import { clippyApi } from "../clippyApi";
import { useSharedState } from "../contexts/SharedStateContext";
import { useChat } from "../contexts/ChatContext";
import { Checkbox } from "./Checkbox";
import recycleBinEmptyIcon from "../images/icons/recycle_bin_empty.png";
import recycleBinFullIcon from "../images/icons/recycle_bin_full.png";
import automaticUpdatesOffIcon from "../images/icons/satellite_updates_off.png";
import automaticUpdatesOnIcon from "../images/icons/satellite_updates_on.png";
import speakerOffIcon from "../images/icons/speaker_off.png";
import speakerOnIcon from "../images/icons/speaker_on.png";

export const SettingsAdvanced: React.FC = () => {
  const { settings, models } = useSharedState();
  const { setAnimationKey } = useChat();
  const soundEnabled = !settings.disableSound;
  const downloadedLocalModelCount = Object.values(models).filter(
    (model) => model.downloaded,
  ).length;
  const hasDownloadedLocalModels = downloadedLocalModelCount > 0;

  const handleDeleteAllModels = async () => {
    if (!hasDownloadedLocalModels) {
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete all downloaded local models? This cannot be undone.",
      )
    ) {
      return;
    }

    await clippyApi.deleteAllModels();
    setAnimationKey("");
    window.setTimeout(() => {
      setAnimationKey("EmptyTrash");
    }, 0);
  };

  return (
    <div>
      <fieldset>
        <legend>Automatic Updates</legend>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <Checkbox
              id="autoUpdates"
              label="Automatically keep Office Buddies up to date"
              checked={!settings.disableAutoUpdate}
              onChange={(checked) => {
                clippyApi.setState("settings.disableAutoUpdate", !checked);
              }}
            />

            <button
              style={{ marginTop: "10px" }}
              onClick={() => clippyApi.checkForUpdates()}
            >
              Check for Updates
            </button>
          </div>
          <img
            src={
              settings.disableAutoUpdate
                ? automaticUpdatesOffIcon
                : automaticUpdatesOnIcon
            }
            alt=""
            aria-hidden="true"
            style={{ width: "32px", height: "32px", flexShrink: 0 }}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>Sound</legend>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ marginTop: 0 }}>
              Mute or unmute assistant sounds throughout the app.
            </p>
            <button
              onClick={() => {
                clippyApi.setState("settings.disableSound", soundEnabled);
              }}
            >
              {soundEnabled ? "Mute Sound" : "Unmute Sound"}
            </button>
          </div>
          <img
            src={soundEnabled ? speakerOnIcon : speakerOffIcon}
            alt=""
            aria-hidden="true"
            style={{ width: "32px", height: "32px", flexShrink: 0 }}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>Configuration</legend>
        <p>
          Office Buddies keeps its configuration in JSON files.
          Click these buttons to open them in your default JSON editor.
          Restart Office Buddies to apply the changes.
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p>
              This will delete all models. This action is not reversible.
            </p>
            <button
              onClick={() => void handleDeleteAllModels()}
              disabled={!hasDownloadedLocalModels}
            >
              Delete All Models
            </button>
          </div>
          <img
            src={
              hasDownloadedLocalModels ? recycleBinFullIcon : recycleBinEmptyIcon
            }
            alt=""
            aria-hidden="true"
            style={{ width: "32px", height: "32px", flexShrink: 0 }}
          />
        </div>
      </fieldset>
    </div>
  );
};
