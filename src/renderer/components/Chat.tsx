import { useState } from "react";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";

export type ChatProps = {
  style?: React.CSSProperties;
}

export function Chat({ style }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { id: crypto.randomUUID(), content: message, sender: 'user' }]);
  }

  return (
    <div style={style} className="simple-scrollbar">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {messages.length > 0 && <hr />}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
