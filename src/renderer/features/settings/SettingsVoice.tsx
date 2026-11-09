import { useEffect, useState } from "react";

import { clippyApi } from "../../clippyApi";
import { useSharedState } from "../../contexts/SharedStateContext";
import { Checkbox } from "../../ui/Checkbox";
import { useVoiceStatus } from "../../voice/useVoiceInput";

// Settings > Advanced > Voice input: local speech-to-text with whisper.cpp.
export const SettingsVoice: React.FC = () => {
  const { settings } = useSharedState();
  const status = useVoiceStatus();
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const load = (): void =>
      void navigator.mediaDevices
        ?.enumerateDevices()
        .then((devices) =>
          setMicrophones(devices.filter((d) => d.kind === "audioinput")),
        )
        .catch(() => setMicrophones([]));
    load();
    navigator.mediaDevices?.addEventListener("devicechange", load);
    return () =>
      navigator.mediaDevices?.removeEventListener("devicechange", load);
  }, []);

  if (!status) return null;

  const model = status.model;
  const enabled = Boolean(settings.voiceEnabled);

  let modelText: string;
  switch (model.state) {
    case "ready":
      modelText = `${status.modelName}: ready.`;
      break;
    case "downloading":
      modelText = `Downloading ${status.modelName}… ${model.percent}%`;
      break;
    case "error":
      modelText = `Download failed: ${model.message}`;
      break;
    default:
      modelText = `${status.modelName} (${status.modelSizeMb} MB) is not downloaded yet.`;
  }

  return (
    <fieldset>
      <legend>Voice input (preview)</legend>
      <Checkbox
        id="voiceEnabled"
        label="Show a microphone button in the chats"
        checked={enabled}
        disabled={!status.runtimeAvailable}
        onChange={(checked) => {
          clippyApi.setState("settings.voiceEnabled", checked);
          if (checked && model.state === "missing") {
            void clippyApi.downloadVoiceModel();
          }
        }}
      />
      {!status.runtimeAvailable ? (
        <p style={{ marginBottom: 0 }}>
          Speech recognition is missing from this build. Run "npm run
          prepare:whisper" and restart.
        </p>
      ) : (
        <>
          <p>
            Click the microphone, talk, then click it again (or press Enter).
            Your words appear in the message box for you to check before
            sending. Speech is recognized on this PC with whisper.cpp and never
            leaves it. It understands Portuguese, English and many other
            languages.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span>{modelText}</span>
            {(model.state === "missing" || model.state === "error") && (
              <button onClick={() => void clippyApi.downloadVoiceModel()}>
                {model.state === "error" ? "Try again" : "Download"}
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
            }}
          >
            <label htmlFor="voiceMicrophone">Microphone</label>
            <select
              id="voiceMicrophone"
              value={settings.voiceMicrophoneId || ""}
              disabled={!enabled}
              onChange={(event) =>
                clippyApi.setState(
                  "settings.voiceMicrophoneId",
                  event.target.value,
                )
              }
            >
              <option value="">System default</option>
              {microphones
                .filter((mic) => mic.deviceId && mic.deviceId !== "default")
                .map((mic, index) => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || `Microphone ${index + 1}`}
                  </option>
                ))}
            </select>
          </div>
        </>
      )}
    </fieldset>
  );
};
