import { useChat } from "../../contexts/ChatContext";
import { TableView } from "../../ui/TableView";
import { formatDistance } from "date-fns";
import { clippyApi } from "../../clippyApi";
import { useState } from "react";
import { useSharedState } from "../../contexts/SharedStateContext";
import { getThemeIcons } from "../../theme/theme";

export type SettingsTab = "general" | "model" | "advanced" | "about";

export type SettingsProps = {
  onClose: () => void;
};

export const Chats: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings } = useSharedState();
  const themeIcons = getThemeIcons(settings.uiDesign);
  const {
    chatRecords,
    currentChatRecord,
    selectChat,
    startNewChat,
    deleteChat,
    deleteAllChats,
    setAnimationKey,
  } = useChat();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(
    null,
  );

  const chatsWithPreview = Object.values(chatRecords).map((chat) => ({
    id: chat.id,
    lastUpdated: formatDistance(chat.updatedAt, new Date(), {
      addSuffix: true,
    }),
    preview: chat.preview,
  }));

  const handleSelectChat = async (index: number) => {
    setSelectedChatIndex(index);
  };

  const handleRestoreChat = async () => {
    if (
      selectedChatIndex === null ||
      selectedChatIndex >= chatsWithPreview.length
    ) {
      return;
    }

    selectChat(chatsWithPreview[selectedChatIndex].id);
    onClose();
  };

  const handleNewChat = async () => {
    await startNewChat();
    setSelectedChatIndex(null);
    onClose();
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteChat(chatId);
      setSelectedChatIndex(null);
      setAnimationKey("");
      window.setTimeout(() => {
        setAnimationKey("EmptyTrash");
      }, 0);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (
      selectedChatIndex === null ||
      selectedChatIndex >= chatsWithPreview.length
    ) {
      return;
    }

    const chatId = chatsWithPreview[selectedChatIndex].id;
    await handleDeleteChat(chatId);
  };

  const handleDeleteAllChats = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL chats? This cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAllChats();
      setSelectedChatIndex(null);
      setAnimationKey("");
      window.setTimeout(() => {
        setAnimationKey("EmptyTrash");
      }, 0);
    } catch (error) {
      console.error("Failed to delete all chats:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: "preview", header: "Preview" },
    { key: "lastUpdated", header: "Last Updated" },
  ];

  return (
    <div className="app-page app-page--compact chats-page">
      <div className="app-page-header">
        <img
          className="app-page-icon"
          src={themeIcons.fileQuestion}
          alt=""
          aria-hidden="true"
        />
        <h1 className="app-page-title">Chats</h1>
      </div>

      <div className="app-fill">
        <TableView
          columns={columns}
          data={chatsWithPreview}
          onRowSelect={handleSelectChat}
          style={{ height: "100%", overflow: "auto" }}
          initialSelectedIndex={Object.values(chatRecords).findIndex(
            (chat) => chat.id === currentChatRecord.id,
          )}
        />
      </div>

      <div className="app-actions">
        <button onClick={handleNewChat} disabled={isDeleting}>
          New Chat
        </button>
        <button
          onClick={handleRestoreChat}
          disabled={selectedChatIndex === null}
        >
          Restore Chat
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={isDeleting || selectedChatIndex === null}
        >
          Delete Selected
        </button>
        <button onClick={handleDeleteAllChats} disabled={isDeleting}>
          Delete All Chats
        </button>
      </div>
    </div>
  );
};

