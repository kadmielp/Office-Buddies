import { useState, useEffect, useRef } from "react";
import { useChat } from "../contexts/ChatContext";
export type ChatInputProps = {
  onSend: (message: string) => void;
};

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { isModelLoaded } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModelLoaded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModelLoaded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedMessage = message.trim();

      if (trimmedMessage) {
        onSend(trimmedMessage);
        setMessage("");
      }
    }
  };

  const placeholder = isModelLoaded
    ? "Type a message, press Enter to send..."
    : "This is your chat input, we're just waiting for a model to load...";

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!isModelLoaded}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
}
