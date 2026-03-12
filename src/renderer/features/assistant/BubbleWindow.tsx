import { useCallback, useState } from "react";

import { clippyApi } from "../../clippyApi";
import { Chat } from "../chat/Chat";
import { Settings } from "../settings/Settings";
import { useBubbleView } from "../../contexts/BubbleViewContext";
import { Chats } from "../chat/Chats";
import { AssistantGallery } from "./AssistantGallery";
import { useChat } from "../../contexts/ChatContext";
import loadingGif from "../../../../assets/loading.gif";

export function Bubble() {
  const { currentView, setCurrentView } = useBubbleView();
  const { setIsChatWindowOpen, isStartingNewChat } = useChat();
  const [isMaximized, setIsMaximized] = useState(false);

  let content = null;

  if (currentView === "chat") {
    content = <Chat />;
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
      className="bubble-container window bubble-window"
      aria-busy={isStartingNewChat}
    >
      <div className="app-drag title-bar">
        <div className="title-bar-text">
          {isAssistantHeaderMode
            ? "Office Assistant"
            : "Chat with Office Buddies"}
        </div>
        <div className="title-bar-controls app-no-drag">
          <div className="bubble-title-shortcuts">
            {isAssistantHeaderMode ? (
              <>
                <button
                  className={
                    isGallerySelected ? "header-tab-active" : undefined
                  }
                  aria-pressed={isGallerySelected}
                  onClick={() => setCurrentView("assistant-gallery")}
                >
                  Gallery
                </button>
                <button
                  className={
                    isOptionsSelected ? "header-tab-active" : undefined
                  }
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
                  aria-pressed={isChatsSelected}
                  onClick={handleChatsClick}
                >
                  Chats
                </button>
              </>
            )}
          </div>
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
        className={`window-content bubble-window-content${
          currentView === "chat" ? " is-chat" : ""
        }`}
      >
        {content}
      </div>
      {isStartingNewChat && (
        <div className="bubble-loading-overlay">
          <div className="bubble-loading-card">
            <img
              className="bubble-loading-image"
              src={loadingGif}
              alt="Loading model"
            />
            <span>Preparing new chat...</span>
          </div>
        </div>
      )}
    </div>
  );
}

