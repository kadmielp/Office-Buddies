import { useEffect, useState } from "react";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { useSettings } from "../contexts/SettingsContext";
import type { ElectronLlmRenderer } from "@electron/llm";

export type ChatProps = {
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    electronAi: ElectronLlmRenderer;
  }
}


export function Chat({ style }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageContent, setStreamingMessageContent] = useState<string>("");
  const { settings } = useSettings();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (settings.model) {
      window.electronAi.create({
        modelPath: settings.model.path,
        systemPrompt: settings.systemPrompt,
      }).then(() => {
        setIsModelLoaded(true);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [settings.model]);

  const handleSendMessage = async (message: string) => {
    if (isStreaming) {
      return;
    }

    const userMessage: Message = { id: crypto.randomUUID(), content: message, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    setStreamingMessageContent("");
    setIsStreaming(true);

    try {
      const response = await window.electronAi.promptStreaming(message);

      // Update the streaming message as chunks arrive
      let fullContent = '';
      for await (const chunk of response) {
        fullContent += chunk;
        setStreamingMessageContent(fullContent);
      }

      // Once streaming is complete, add the full message to the messages array
      // and clear the streaming message
      const assistantMessage: Message = { id: crypto.randomUUID(), content: fullContent, sender: 'clippy' };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setStreamingMessageContent("");
      setIsStreaming(false);
    } catch (error) {
      console.error(error);

      setStreamingMessageContent("");
      setIsStreaming(false);
    }
  }

  return (
    <div style={style} className="simple-scrollbar">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isStreaming && <Message message={{ id: "streaming", content: streamingMessageContent, sender: 'clippy' }} />}
      {(messages.length > 0 || isStreaming) && <hr />}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
