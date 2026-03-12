import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../../contexts/ChatContext";
export type ChatInputProps = {
  onSend: (message: string) => void;
  onAbort: () => void;
};

export function ChatInput({ onSend, onAbort }: ChatInputProps) {
  const { status } = useChat();
  const [message, setMessage] = useState("");
  const { isModelLoaded } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isModelReplying = status === "thinking" || status === "responding";

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();

    if (trimmedMessage) {
      onSend(trimmedMessage);
      setMessage("");
    }
  }, [message, onSend]);

  const handleAbort = useCallback(() => {
    setMessage("");
    onAbort();
  }, [onAbort]);

  const handleSendOrAbort = useCallback(() => {
    if (status === "responding") {
      handleAbort();
    } else {
      handleSend();
    }
  }, [status, handleSend, handleAbort]);

  useEffect(() => {
    if (isModelLoaded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isModelLoaded]);

  useEffect(() => {
    if (!isModelLoaded || isModelReplying || !textareaRef.current) {
      return;
    }

    // Restore typing focus after a response completes.
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, [isModelLoaded, isModelReplying]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const trimmedMessage = message.trim();

      if (trimmedMessage) {
        onSend(trimmedMessage);
        setMessage("");
      }

      e.preventDefault();
      e.stopPropagation();
    }
  };

  const placeholder = isModelLoaded
    ? "Type a message, press Enter to send..."
    : "This is your chat input, we're just waiting for a model to load...";

  return (
    <div className="chat-composer">
      <textarea
        className={`chat-composer-input${
          isModelReplying ? " chat-input-busy is-busy" : ""
        }`}
        rows={1}
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!isModelLoaded || isModelReplying}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <button
        disabled={!isModelLoaded}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSendOrAbort}
      >
        {status === "responding" ? "Abort" : "Send"}
      </button>
    </div>
  );
}

