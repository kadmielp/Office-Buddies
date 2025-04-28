import { useEffect, useState } from "react";

import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { useSettings } from "../contexts/SettingsContext";
import { ANIMATION_KEYS_BRACKETS } from "../clippy-animation-helpers";
import { useChat } from "../contexts/ChatContext";
import { electronAi } from "../clippyApi";

export type ChatProps = {
  style?: React.CSSProperties;
}

export function Chat({ style }: ChatProps) {
  const { setAnimationKey, setStatus, status } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessageContent, setStreamingMessageContent] = useState<string>("");
  const { settings } = useSettings();
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (settings.model) {
      electronAi.create({
        modelAlias: settings.model.alias,
        systemPrompt: settings.systemPrompt,
      }).then(() => {
        setIsModelLoaded(true);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [settings.model]);

  const handleSendMessage = async (message: string) => {
    if (status !== 'idle') {
      return;
    }

    const userMessage: Message = { id: crypto.randomUUID(), content: message, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    setStreamingMessageContent("");
    setStatus('thinking');

    try {
      const response = await window.electronAi.promptStreaming(message);

      let fullContent = '';
      let hasSetAnimationKey = false;

      for await (const chunk of response) {
        if (fullContent === '') {
          setStatus('responding');
        }

        if (!hasSetAnimationKey) {
          const { text, animationKey } = filterMessageContent(fullContent + chunk);
          fullContent = text;

          if (animationKey) {
            setAnimationKey(animationKey);
            hasSetAnimationKey = true;
          }
        } else {
          fullContent += chunk;
        }

        setStreamingMessageContent(fullContent);
      }

      // Once streaming is complete, add the full message to the messages array
      // and clear the streaming message
      const assistantMessage: Message = { id: crypto.randomUUID(), content: fullContent, sender: 'clippy' };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setStreamingMessageContent("");
      setStatus('idle');
    } catch (error) {
      console.error(error);

      setStreamingMessageContent("");
      setStatus('idle');
    }
  }

  return (
    <div style={style} className="simple-scrollbar">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {status === 'responding' && <Message message={{ id: "streaming", content: streamingMessageContent, sender: 'clippy' }} />}
      {(messages.length > 0 || status === 'responding') && <hr />}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}

/**
 * Filter the message content to get the text and animation key
 *
 * @param content - The content of the message
 * @returns The text and animation key
 */
function filterMessageContent(content: string): { text: string, animationKey: string } {
  let text = content;
  let animationKey = '';

  for (const key of ANIMATION_KEYS_BRACKETS) {
    if (content.startsWith(key)) {
      animationKey = key.slice(1, -1);
      text = content.slice(key.length).trim();
      break;
    }
  }

  return { text, animationKey };
}
