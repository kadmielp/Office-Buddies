import { useState } from "react";

import { Checkbox } from "./Checkbox";

const sessionPersonas = ["Meeting Assistant", "Interview Coach"] as const;
const whisperModels = [
  "Whisper Tiny",
  "Whisper Base",
  "Whisper Small",
] as const;
const microphoneDevices = [
  "Default Microphone",
  "USB Podcast Mic",
] as const;
const speakerSources = [
  "System Loopback",
  "BlackHole 2ch",
  "PulseAudio Monitor",
] as const;
const chunkDurations = ["2000 ms", "3000 ms", "5000 ms"] as const;

export const SettingsSession: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<
    (typeof sessionPersonas)[number]
  >("Meeting Assistant");
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);
  const [selectedWhisperModel, setSelectedWhisperModel] = useState<
    (typeof whisperModels)[number]
  >("Whisper Base");
  const [selectedMicDevice, setSelectedMicDevice] = useState<
    (typeof microphoneDevices)[number]
  >("Default Microphone");
  const [selectedSpeakerSource, setSelectedSpeakerSource] = useState<
    (typeof speakerSources)[number]
  >("System Loopback");
  const [selectedChunkDuration, setSelectedChunkDuration] = useState<
    (typeof chunkDurations)[number]
  >("3000 ms");

  return (
    <div>
      <fieldset>
        <legend>Session Persona</legend>
        <div className="field-row" style={{ alignItems: "center" }}>
          <label htmlFor="sessionPersona" style={{ minWidth: "104px" }}>
            Persona:
          </label>
          <select
            id="sessionPersona"
            value={selectedPersona}
            onChange={(event) =>
              setSelectedPersona(
                event.target.value as (typeof sessionPersonas)[number],
              )
            }
          >
            {sessionPersonas.map((persona) => (
              <option key={persona} value={persona}>
                {persona}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend>Live Transcription</legend>
        <Checkbox
          id="audioTranscriptionEnabled"
          label="Capture microphone and speaker audio for this session"
          checked={transcriptionEnabled}
          onChange={setTranscriptionEnabled}
        />

        <div
          className="sunken-panel"
          style={{
            marginTop: "10px",
            padding: "10px 12px",
            display: "grid",
            gap: "8px",
          }}
        >
          <strong>Session Feed Preview</strong>
          <span>[You] Can we move the launch review to Friday?</span>
          <span>[Them] Friday works, but we should confirm with design.</span>
          <span>[You] Add that as a follow-up item.</span>
        </div>
      </fieldset>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        <fieldset style={{ marginTop: 0 }}>
          <legend>Audio Sources</legend>
          <div style={{ display: "grid", gap: "10px" }}>
            <div className="field-row">
              <label htmlFor="selectedMicDevice" style={{ minWidth: "96px" }}>
                Microphone:
              </label>
              <select
                id="selectedMicDevice"
                value={selectedMicDevice}
                onChange={(event) =>
                  setSelectedMicDevice(
                    event.target.value as (typeof microphoneDevices)[number],
                  )
                }
                disabled={!transcriptionEnabled}
              >
                {microphoneDevices.map((device) => (
                  <option key={device} value={device}>
                    {device}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <label
                htmlFor="selectedSpeakerSource"
                style={{ minWidth: "96px" }}
              >
                Speaker:
              </label>
              <select
                id="selectedSpeakerSource"
                value={selectedSpeakerSource}
                onChange={(event) =>
                  setSelectedSpeakerSource(
                    event.target.value as (typeof speakerSources)[number],
                  )
                }
                disabled={!transcriptionEnabled}
              >
                {speakerSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <p style={{ margin: 0 }}>
              Loopback source availability can vary by platform. If the current
              system does not expose one, this area can later show install or
              setup guidance.
            </p>
          </div>
        </fieldset>

        <fieldset style={{ marginTop: 0 }}>
          <legend>Whisper</legend>
          <div style={{ display: "grid", gap: "10px" }}>
            <div className="field-row">
              <label htmlFor="whisperModel" style={{ minWidth: "96px" }}>
                Model:
              </label>
              <select
                id="whisperModel"
                value={selectedWhisperModel}
                onChange={(event) =>
                  setSelectedWhisperModel(
                    event.target.value as (typeof whisperModels)[number],
                  )
                }
                disabled={!transcriptionEnabled}
              >
                {whisperModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <label htmlFor="chunkDuration" style={{ minWidth: "96px" }}>
                Chunk size:
              </label>
              <select
                id="chunkDuration"
                value={selectedChunkDuration}
                onChange={(event) =>
                  setSelectedChunkDuration(
                    event.target.value as (typeof chunkDurations)[number],
                  )
                }
                disabled={!transcriptionEnabled}
              >
                {chunkDurations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <button type="button" disabled={!transcriptionEnabled}>
                Test Devices
              </button>
              <button type="button" disabled={!transcriptionEnabled}>
                Preview Transcript
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};
