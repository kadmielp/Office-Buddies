import { useChat } from "../contexts/ChatContext";
import { TableView } from "./TableView";
import { formatDistance } from "date-fns";

export type SettingsTab = "general" | "model" | "advanced" | "about";

export type SettingsProps = {
  onClose: () => void;
};

export const Chats: React.FC<SettingsProps> = ({ onClose }) => {
  const { chatRecords, currentChatRecord, selectChat } = useChat();
  const chatsWithPreview = Object.values(chatRecords).map((chat) => ({
    id: chat.id,
    lastUpdated: formatDistance(chat.updatedAt, new Date(), {
      addSuffix: true,
    }),
    createdAt: formatDistance(chat.createdAt, new Date(), { addSuffix: true }),
    preview: chat.preview,
  }));

  const handleSelectChat = async (
    row: Record<string, React.ReactNode>,
    index: number,
  ) => {
    selectChat(chatsWithPreview[index].id);
    onClose();
  };

  const columns = [
    { key: "preview", header: "Preview" },
    { key: "lastUpdated", header: "Last Updated", width: 150 },
    { key: "createdAt", header: "Created", width: 150 },
  ];

  return (
    <div
      className="chats-container"
      style={{
        padding: "16px",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Chats</h1>
      </div>

      {chatsWithPreview.length > 0 ? (
        <TableView
          columns={columns}
          data={chatsWithPreview}
          onRowSelect={handleSelectChat}
          style={{ height: "calc(80vh - 100px)", overflow: "auto" }}
          initialSelectedIndex={Object.values(chatRecords).findIndex(
            (chat) => chat.id === currentChatRecord.id,
          )}
        />
      ) : (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p>No chats yet. Start a new conversation!</p>
        </div>
      )}
    </div>
  );
};
