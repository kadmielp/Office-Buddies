import "./css/App.css";
import "../../../node_modules/98.css/dist/98.css";
import "./css/98.extended.css";

import { Clippy } from "./Clippy";
import { ChatProvider } from "../contexts/ChatContext";
import { WindowPortal } from "./WindowPortal";
import { Bubble } from "./BubbleWindow";
import { SharedStateProvider } from "../contexts/SharedStateContext";
import { BubbleViewProvider } from "../contexts/BubbleViewContext";

export function App() {
  return (
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
            <WindowPortal width={450} height={600}>
              <Bubble />
            </WindowPortal>
          </div>
        </BubbleViewProvider>
      </ChatProvider>
    </SharedStateProvider>
  );
}
