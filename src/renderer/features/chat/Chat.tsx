import { useEffect, useRef, useState } from "react";

import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { useChat } from "../../contexts/ChatContext";
import { useSharedState } from "../../contexts/SharedStateContext";
import { abortProviderRequest } from "../../ai-provider-client";
import { streamAssistantReply } from "../../helpers/stream-assistant-reply";

export function Chat() {
  const { settings } = useSharedState();
  const {
    setAnimationKey,
    setStatus,
    status,
    messages,
    addMessage,
    isModelLoaded,
  } = useChat();
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [streamingMessageContent, setStreamingMessageContent] =
    useState<string>("");
  const [lastRequestUUID, setLastRequestUUID] = useState<string>(
    crypto.randomUUID(),
  );

  // Keep the newest message in view, like a messenger transcript.
  useEffect(() => {
    const transcript = transcriptRef.current;

    if (transcript) {
      transcript.scrollTop = transcript.scrollHeight;
    }
  }, [messages, streamingMessageContent, status]);

  const agentName = settings.selectedAgent || "Clippy";
  const statusText = !isModelLoaded
    ? "Waiting for a model to load..."
    : status === "thinking"
      ? `${agentName} is thinking...`
      : status === "responding"
        ? `${agentName} is typing a message...`
        : "Ready";
  const providerText =
    settings.aiProvider === "local" || !settings.aiProvider
      ? settings.selectedModel || "No model selected"
      : settings.remoteModel || settings.aiProvider;

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
      const reply = await streamAssistantReply({
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
      // and clear the streaming message.
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: reply.content,
        sender: "clippy",
        createdAt: Date.now(),
        references: reply.references,
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
        content: `[Error] Falha ao obter resposta: ${errorMessage}`,
        sender: "clippy",
        createdAt: Date.now(),
      });
    } finally {
      setStreamingMessageContent("");
      setStatus("idle");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-transcript" ref={transcriptRef}>
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
      </div>
      <ChatInput onSend={handleSendMessage} onAbort={handleAbortMessage} />
      <div className="status-bar chat-status-bar">
        <p className="status-bar-field">{statusText}</p>
        <p className="status-bar-field chat-status-bar-provider">
          {providerText}
        </p>
      </div>
    </div>
  );
}
