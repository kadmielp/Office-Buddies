import React, { createContext, useContext, useEffect, useState } from "react";
import { clippyApi } from "../clippyApi";
import { useChat } from "./ChatContext";

export type BubbleView =
  | "chat"
  | "chats"
  | "assistant-gallery"
  | "settings"
  | "settings-general"
  | "settings-model"
  | "settings-parameters"
  | "settings-advanced"
  | "settings-about";

type BubbleViewContextType = {
  currentView: BubbleView;
  setCurrentView: (view: BubbleView) => void;
};

const BubbleViewContext = createContext<BubbleViewContextType | undefined>(
  undefined,
);

export const BubbleViewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState<BubbleView>("chat");
  const { isChatWindowOpen, setIsChatWindowOpen } = useChat();

  useEffect(() => {
    clippyApi.offSetBubbleView();
    clippyApi.onSetBubbleView((view: BubbleView) => {
      // Menu-driven view changes should also surface the chat/settings window.
      setIsChatWindowOpen(true);
      setCurrentView(view);
    });

    return () => {
      clippyApi.offSetBubbleView();
    };
  }, [setIsChatWindowOpen]);

  useEffect(() => {
    if (!isChatWindowOpen && currentView === "assistant-gallery") {
      setCurrentView("chat");
    }
  }, [currentView, isChatWindowOpen]);

  return (
    <BubbleViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </BubbleViewContext.Provider>
  );
};

export const useBubbleView = () => {
  const context = useContext(BubbleViewContext);
  if (context === undefined) {
    throw new Error("useBubbleView must be used within a BubbleViewProvider");
  }
  return context;
};
