import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Message } from '../components/Message';
import { electronAi } from '../clippyApi';
import { SharedStateContext, useSharedState } from './SharedStateContext';

type ClippyNamedStatus = 'welcome' | 'idle' | 'responding' | 'thinking' | 'goodbye'

export type ChatContextType = {
  messages: Message[];
  addMessage: (message: Message) => void;
  animationKey: string;
  setAnimationKey: (animationKey: string) => void;
  status: ClippyNamedStatus;
  setStatus: (status: ClippyNamedStatus) => void;
  isModelLoaded: boolean;
  isChatWindowOpen: boolean;
  setIsChatWindowOpen: (isChatWindowOpen: boolean) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [animationKey, setAnimationKey] = useState<string>('');
  const [status, setStatus] = useState<ClippyNamedStatus>('welcome');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const { settings } = useContext(SharedStateContext);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  useEffect(() => {
    if (settings.selectedModel) {
      electronAi.create({
        modelAlias: settings.selectedModel,
        systemPrompt: settings.systemPrompt,
      }).then(() => {
        setIsModelLoaded(true);
      }).catch((error) => {
        console.error(error);
      });
    }

    if (!settings.selectedModel && isModelLoaded) {
      electronAi.destroy().then(() => {
        setIsModelLoaded(false);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [settings.selectedModel, settings.systemPrompt]);

  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const value = {
    messages,
    addMessage,
    animationKey,
    setAnimationKey,
    status,
    setStatus,
    isModelLoaded,
    isChatWindowOpen,
    setIsChatWindowOpen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}

