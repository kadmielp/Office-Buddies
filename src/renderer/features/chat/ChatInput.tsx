import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../../contexts/ChatContext";
import { MicButton, VoiceError } from "../../voice/MicButton";
import { useVoiceInput } from "../../voice/useVoiceInput";
import { onChatVoiceToggle } from "../../voice/shortcut-bus";
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
  // Spoken words land in the box for review; the user sends them.
  const voice = useVoiceInput((text) => {
    setMessage((previous) =>
      previous.trim() ? `${previous.trimEnd()} ${text}` : text,
    );
    requestAnimationFrame(() => textareaRef.current?.focus());
  });

  // The global voice shortcut uses this microphone while the chat is open.
  const voiceToggleRef = useRef(voice.toggle);
  voiceToggleRef.current = voice.toggle;
  useEffect(() => onChatVoiceToggle(() => voiceToggleRef.current()), []);

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

  // Abort as soon as a reply starts, not only once text arrives: a computer
  // use task can work for a long time before its first line.
  const handleSendOrAbort = useCallback(() => {
    if (isModelReplying) {
      handleAbort();
    } else {
      handleSend();
    }
  }, [isModelReplying, handleSend, handleAbort]);

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
    if (voice.listening) {
      if (e.key === "Escape") {
        e.preventDefault();
        voice.cancel();
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        voice.toggle();
        return;
      }
    }

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

  const placeholder = voice.listening
    ? "Listening… Enter or the microphone button stops, Esc discards."
    : voice.state === "transcribing"
      ? "Writing down what you said…"
      : isModelLoaded
        ? "Type a message, press Enter to send..."
        : "This is your chat input, we're just waiting for a model to load...";

  return (
    <>
      <VoiceError voice={voice} className="chat-voice-error" />
      <div className="chat-composer">
        <textarea
          className={`chat-composer-input${
            isModelReplying ? " chat-input-busy is-busy" : ""
          }`}
          rows={3}
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isModelLoaded || isModelReplying}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <MicButton
          voice={voice}
          className="chat-composer-mic"
          // Speech doesn't need the chat model: talk while it is still loading.
          disabled={isModelReplying}
        />
        <button
          className="chat-composer-send default"
          disabled={!isModelLoaded}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSendOrAbort}
        >
          {isModelReplying ? "Abort" : "Send"}
        </button>
      </div>
    </>
  );
}
