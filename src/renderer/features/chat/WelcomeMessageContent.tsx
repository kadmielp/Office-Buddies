import React from "react";
import { useBubbleView } from "../../contexts/BubbleViewContext";
import { useSharedState } from "../../contexts/SharedStateContext";
import { Progress } from "../../ui/Progress";
import { isModelDownloading, isModelReady } from "../../../shared/model-helpers";
import { prettyDownloadSpeed } from "../../helpers/convert-download-speed";

export const WelcomeMessageContent: React.FC = () => {
  const { setCurrentView } = useBubbleView();
  const { models } = useSharedState();

  // Find if any model is currently downloading
  const downloadingModel = Object.values(models || {}).find(isModelDownloading);
  // Check if any model is ready
  const readyModel = Object.values(models || {}).find(isModelReady);

  return (
    <div>
      <strong>Hi, I'm Clippy. Let's get to work.</strong>
      <p>
        You're running Office Buddies, a fan-made tribute to the Office
        Assistant from 1997. Clippy was drawn by Kevan Atteberry. This project
        has nothing to do with Microsoft, who haven't approved or endorsed it.
        Think of it as a bit of software art.
      </p>
      <p>
        I'm here to look after your coding agents. Connect Claude or Codex and
        I'll tap the glass when they finish. When they have a question or need
        your approval, I'll ask it right here in the balloon.
      </p>
      <p>
        No agent handy? I can also run a small model on your machine, offline.
        It's downloading now, and you can swap in a bigger one in the settings.
      </p>
      <p>To open or close this window, right-click my head.</p>

      {downloadingModel && (
        <div style={{ marginTop: "15px", marginBottom: "15px" }}>
          <p>
            Downloading {downloadingModel.name}... (
            {prettyDownloadSpeed(
              downloadingModel.downloadState?.currentBytesPerSecond || 0,
            )}
            /s)
          </p>
          <Progress
            progress={downloadingModel.downloadState?.percentComplete || 0}
          />
        </div>
      )}

      {!downloadingModel && readyModel && (
        <div style={{ marginTop: "15px", marginBottom: "15px" }}>
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✓ {readyModel.name} is ready! You can now start chatting.
          </p>
        </div>
      )}

      <button onClick={() => setCurrentView("settings-model")}>
        Open Model Settings
      </button>
    </div>
  );
};

