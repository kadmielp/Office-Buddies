import Markdown from "react-markdown";
import { MessageRecord, MessageReference } from "../../../types/interfaces";
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
  const senderName = isUser ? "User" :settings.selectedAgent || "Clippy";

  return (
    <div className={`chat-message ${isUser ? "is-user" : "is-assistant"}`}>
      <div className="chat-message-header">
        <img
          className="chat-message-icon"
          src={isUser ? themeIcons.question : themeIcons.msagent}
          alt=""
        />
        <span className="chat-message-sender">{senderName}</span>
        <span className="chat-message-says">says:</span>
      </div>
      <div className="chat-message-body">
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
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="chat-message-actions">
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
        {!isUser && message.references && message.references.length > 0 && (
          <div className="chat-message-references">
            <div className="chat-message-references-label">
              Knowledge references:
            </div>
            {message.references.map((reference) => {
              const isOpenable = canOpenReference(reference);

              return (
                <div key={reference.id} className="chat-message-reference">
                  <div className="chat-message-reference-header">
                    <div className="chat-message-reference-title">
                      {reference.title}
                    </div>
                    {isOpenable && (
                      <button
                        type="button"
                        className="chat-message-reference-open"
                        onClick={() => void clippyApi.openReference(reference)}
                      >
                        Open
                      </button>
                    )}
                  </div>
                  <div className="chat-message-reference-meta">
                    {getReferenceMeta(reference)}
                  </div>
                  {reference.snippet && (
                    <div className="chat-message-reference-snippet">
                      {reference.snippet}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function canOpenReference(reference: MessageReference) {
  return ("url" in reference && Boolean(reference.url)) ||
    ("path" in reference && Boolean(reference.path));
}

function getReferenceMeta(reference: MessageReference) {
  const metaParts = [reference.kind.toUpperCase()];

  if (reference.sourceName) {
    metaParts.push(reference.sourceName);
  }

  if (reference.location) {
    metaParts.push(reference.location);
  }

  if ("path" in reference && reference.path) {
    metaParts.push(reference.path);
  }

  if ("server" in reference && reference.server) {
    metaParts.push(reference.server);
  }

  return metaParts.join(" | ");
}

