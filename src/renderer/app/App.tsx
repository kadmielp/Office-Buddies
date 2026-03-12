import "../styles/base.css";

import { useEffect } from "react";
import { Clippy } from "../features/assistant/Clippy";
import { ChatProvider } from "../contexts/ChatContext";
import { useSharedState } from "../contexts/SharedStateContext";
import { WindowPortal } from "../ui/WindowPortal";
import { Bubble } from "../features/assistant/BubbleWindow";
import { SharedStateProvider } from "../contexts/SharedStateContext";
import { BubbleViewProvider } from "../contexts/BubbleViewContext";
import { DebugProvider } from "../contexts/DebugContext";
import { applyThemeDocument } from "../theme/theme";

function AppShell() {
  const { settings } = useSharedState();

  useEffect(() => {
    applyThemeDocument(document, settings.uiDesign);
  }, [settings.uiDesign]);

  return (
    <div
      className="clippy"
      data-font={settings.defaultFont}
      data-ui-design={settings.uiDesign}
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
      }}
    >
      <Clippy />
      <WindowPortal width={450} height={650}>
        <Bubble />
      </WindowPortal>
    </div>
  );
}

export function App() {
  return (
    <DebugProvider>
      <SharedStateProvider>
        <ChatProvider>
          <BubbleViewProvider>
            <AppShell />
          </BubbleViewProvider>
        </ChatProvider>
      </SharedStateProvider>
    </DebugProvider>
  );
}

