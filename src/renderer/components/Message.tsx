import Markdown from "react-markdown";
import questionIcon from "../images/icons/question.png";
import defaultClippy from "../images/icons/msagent.png";
import { MessageRecord } from "../../types/interfaces";

export interface Message extends MessageRecord {
  id: string;
  content?: string;
  children?: React.ReactNode;
  createdAt: number;
  sender: "user" | "clippy";
}

export function Message({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div
      className="message"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {isUser ? (
        <>
          <div
            className="message-content"
            style={{
              minWidth: 0,
              width: "calc(100% - 72px)",
              maxWidth: "calc(100% - 72px)",
              textAlign: "justify",
              textAlignLast: "left",
            }}
          >
            {message.children ? (
              message.children
            ) : (
              <Markdown
                components={{
                  a: ({ node, ...props }) => (
                    <a target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                }}
              >
                {message.content}
              </Markdown>
            )}
          </div>
          <img
            src={questionIcon}
            alt="You"
            style={{
              width: "24px",
              height: "24px",
              marginLeft: "8px",
              marginTop: "10px",
            }}
          />
        </>
      ) : (
        <>
          <img
            src={defaultClippy}
            alt="Clippy"
            style={{
              width: "24px",
              height: "24px",
              marginRight: "8px",
              marginTop: "10px",
            }}
          />
          <div
            className="message-content"
            style={{
              minWidth: 0,
              width: "calc(100% - 72px)",
              maxWidth: "calc(100% - 72px)",
              textAlign: "justify",
              textAlignLast: "left",
            }}
          >
            {message.children ? (
              message.children
            ) : (
              <Markdown
                components={{
                  a: ({ node, ...props }) => (
                    <a target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                }}
              >
                {message.content}
              </Markdown>
            )}
          </div>
        </>
      )}
    </div>
  );
}
