import { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '../components/Message';

type ClippyNamedStatus = 'welcome' | 'idle' | 'responding' | 'thinking' | 'goodbye'

export type ChatContextType = {
  messages: Message[];
  addMessage: (message: Message) => void;
  animationKey: string;
  setAnimationKey: (animationKey: string) => void;
  status: ClippyNamedStatus;
  setStatus: (status: ClippyNamedStatus) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [animationKey, setAnimationKey] = useState<string>('');
  const [status, setStatus] = useState<ClippyNamedStatus>('welcome');
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

