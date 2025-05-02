export interface MessageRecord {
  id: string;
  content?: string;
  sender: "user" | "clippy";
  createdAt: number;
}

export interface ChatRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  preview: string;
}

export interface ChatWithMessages {
  chat: ChatRecord;
  messages: MessageRecord[];
}

export type ChatRecordsState = Record<string, ChatRecord>;
