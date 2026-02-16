import { useCallback, useState } from "react";

import { clippyApi } from "../clippyApi";
import { Chat } from "./Chat";
import { Settings } from "./Settings";
import { useBubbleView } from "../contexts/BubbleViewContext";
import { Chats } from "./Chats";
import { AssistantGallery } from "./AssistantGallery";
import { useChat } from "../contexts/ChatContext";
import loadingGif from "../../../assets/loading.gif";

export function Bubble() {
  const { currentView, setCurrentView } = useBubbleView();
  const { setIsChatWindowOpen, isStartingNewChat } = useChat();
  const [isMaximized, setIsMaximized] = useState(false);

  const containerStyle = {
    width: "calc(100% - 6px)",
    height: "calc(100% - 6px)",
    margin: 0,
    overflow: "hidden",
    position: "relative" as const,
  };

  const chatStyle = {
    padding: "15px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-end",
    minHeight: "calc(100% - 35px)",
    overflowAnchor: "none" as const,
  };

  const scrollAnchoredAtBottomStyle = {
    display: "flex",
    flexDirection: "column-reverse" as const,
  };

  let content = null;

  if (currentView === "chat") {
    content = <Chat style={chatStyle} />;
  } else if (currentView.startsWith("settings")) {
    content = <Settings onClose={() => setCurrentView("chat")} />;
  } else if (currentView === "chats") {
    content = <Chats onClose={() => setCurrentView("chat")} />;
  } else if (currentView === "assistant-gallery") {
    content = <AssistantGallery />;
  }

  const isAssistantGallery = currentView === "assistant-gallery";
  const isSettingsView = currentView.startsWith("settings");
  const isAssistantHeaderMode = isAssistantGallery || isSettingsView;
  const isGallerySelected = isAssistantGallery;
  const isOptionsSelected = isSettingsView;
  const isChatsSelected = currentView === "chats";

  const handleChatsClick = useCallback(() => {
    if (currentView === "chats") {
      setCurrentView("chat");
    } else {
      setCurrentView("chats");
    }
  }, [setCurrentView, currentView]);

  return (
    <div
      className="bubble-container window"
      style={containerStyle}
      aria-busy={isStartingNewChat}
    >
      <div className="app-drag title-bar">
        <div className="title-bar-text">
          {isAssistantHeaderMode
            ? "Office Assistant"
            : "Chat with Office Buddies"}
        </div>
        <div className="title-bar-controls app-no-drag">
          {isAssistantHeaderMode ? (
            <>
              <button
                className={isGallerySelected ? "header-tab-active" : undefined}
                style={{
                  marginRight: "8px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                aria-pressed={isGallerySelected}
                onClick={() => setCurrentView("assistant-gallery")}
              >
                Gallery
              </button>
              <button
                className={isOptionsSelected ? "header-tab-active" : undefined}
                style={{
                  marginRight: "8px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                aria-pressed={isOptionsSelected}
                onClick={() => setCurrentView("settings-general")}
              >
                Options
              </button>
            </>
          ) : (
            <>
              <button
                className={isChatsSelected ? "header-tab-active" : undefined}
                style={{
                  marginRight: "8px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
                aria-pressed={isChatsSelected}
                onClick={handleChatsClick}
              >
                Chats
              </button>
            </>
          )}
          <button
            aria-label="Minimize"
            onClick={() => clippyApi.minimizeChatWindow()}
          ></button>
          <button
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onClick={() => {
              clippyApi.maximizeChatWindow();
              setIsMaximized(!isMaximized);
            }}
          ></button>
          <button
            aria-label="Close"
            onClick={() => setIsChatWindowOpen(false)}
          ></button>
        </div>
      </div>
      <div
        className="window-content"
        style={currentView === "chat" ? scrollAnchoredAtBottomStyle : {}}
      >
        {content}
      </div>
      {isStartingNewChat && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(192, 192, 192, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src={loadingGif}
              alt="Loading model"
              style={{ width: "32px", height: "32px" }}
            />
            <span>Preparing new chat...</span>
          </div>
        </div>
      )}
    </div>
  );
}
