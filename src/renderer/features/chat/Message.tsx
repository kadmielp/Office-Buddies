import Markdown from "react-markdown";
import { MessageRecord } from "../../../types/interfaces";
import { clippyApi } from "../../clippyApi";
import { useSharedState } from "../../contexts/SharedStateContext";
import { getThemeIcons } from "../../theme/theme";

export interface Message extends MessageRecord {
  id: string;
  content?: string;
  children?: React.ReactNode;
  createdAt: number;
  sender: "user" | "clippy";
}

export function Message({ message }: { message: Message }) {
  const { settings } = useSharedState();
  const themeIcons = getThemeIcons(settings.uiDesign);
  const isUser = message.sender === "user";

  return (
    <div
      className={`message chat-message ${isUser ? "is-user" : "is-assistant"}`}
    >
      {isUser ? (
        <>
          <div className="message-content chat-message-body">
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
            className="chat-message-icon"
            src={themeIcons.question}
            alt="You"
          />
        </>
      ) : (
        <>
          <img
            className="chat-message-icon"
            src={themeIcons.msagent}
            alt="Clippy"
          />
          <div className="message-content chat-message-body">
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
              <div className="message-actions chat-message-actions">
                {message.actions.map((action, idx) => (
                  <button
                    key={idx}
                    className="chat-message-action"
                    onClick={() => {
                      clippyApi.sendProactiveAction(message.id, action.action);
                    }}
                  >
                    <span className="chat-message-action-dot" />
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

