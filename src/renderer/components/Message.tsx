import Markdown from "react-markdown";
import questionIcon from "../images/icons/question.png";
import defaultClippy from "../images/icons/msagent.png";
import { MessageRecord } from "../../types/interfaces";
import { clippyApi } from "../clippyApi";

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
            {message.actions && message.actions.length > 0 && (
              <div
                className="message-actions"
                style={{
                  marginTop: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {message.actions.map((action, idx) => (
                  <button
                    key={idx}
                    style={{
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    onClick={() => {
                      clippyApi.sendProactiveAction(message.id, action.action);
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#000080",
                        display: "inline-block",
                        boxShadow: "inset -1px -1px 1px rgba(0,0,0,0.5)",
                      }}
                    />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
