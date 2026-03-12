import "../styles/App.css";
import "../../../node_modules/98.css/dist/98.css";
import "../styles/98.extended.css";
import "../styles/Theme.css";

import { Clippy } from "../features/assistant/Clippy";
import { ChatProvider } from "../contexts/ChatContext";
import { WindowPortal } from "../ui/WindowPortal";
import { Bubble } from "../features/assistant/BubbleWindow";
import { SharedStateProvider } from "../contexts/SharedStateContext";
import { BubbleViewProvider } from "../contexts/BubbleViewContext";
import { DebugProvider } from "../contexts/DebugContext";

export function App() {
  return (
    <DebugProvider>
      <SharedStateProvider>
        <ChatProvider>
          <BubbleViewProvider>
            <div
              className="clippy"
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
          </BubbleViewProvider>
        </ChatProvider>
      </SharedStateProvider>
    </DebugProvider>
  );
}

