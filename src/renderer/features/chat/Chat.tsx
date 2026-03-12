import { useState } from "react";

import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { useChat } from "../../contexts/ChatContext";
import { useSharedState } from "../../contexts/SharedStateContext";
import { abortProviderRequest } from "../../ai-provider-client";
import { streamAssistantReply } from "../../helpers/stream-assistant-reply";

export type ChatProps = {
  style?: React.CSSProperties;
};

export function Chat({ style }: ChatProps) {
  const { settings } = useSharedState();
  const { setAnimationKey, setStatus, status, messages, addMessage } =
    useChat();
  const [streamingMessageContent, setStreamingMessageContent] =
    useState<string>("");
  const [lastRequestUUID, setLastRequestUUID] = useState<string>(
    crypto.randomUUID(),
  );

  const handleAbortMessage = () => {
    abortProviderRequest(settings, lastRequestUUID);
  };

  const handleSendMessage = async (message: string) => {
    if (status !== "idle") {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      sender: "user",
      createdAt: Date.now(),
    };

    await addMessage(userMessage);
    setStreamingMessageContent("");
    setStatus("thinking");

    try {
      const requestUUID = crypto.randomUUID();
      setLastRequestUUID(requestUUID);
      const history = [...messages, userMessage];
      const filteredContent = await streamAssistantReply({
        settings,
        selectedAgent: settings.selectedAgent || "Clippy",
        history,
        input: message,
        requestUUID,
        onResponding: () => setStatus("responding"),
        onChunk: (content) => setStreamingMessageContent(content),
        onAnimationKey: (animationKey) => setAnimationKey(animationKey),
      });

      // Once streaming is complete, add the full message to the messages array
      // and clear the streaming message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: filteredContent,
        sender: "clippy",
        createdAt: Date.now(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error while contacting remote provider.";

      await addMessage({
        id: crypto.randomUUID(),
        content: `⚠️ Falha ao obter resposta: ${errorMessage}`,
        sender: "clippy",
        createdAt: Date.now(),
      });
    } finally {
      setStreamingMessageContent("");
      setStatus("idle");
    }
  };

  return (
    <div style={style} className="chat-container">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {status === "responding" && (
        <Message
          message={{
            id: "streaming",
            content: streamingMessageContent,
            sender: "clippy",
            createdAt: Date.now(),
          }}
        />
      )}
      <ChatInput onSend={handleSendMessage} onAbort={handleAbortMessage} />
    </div>
  );
}

