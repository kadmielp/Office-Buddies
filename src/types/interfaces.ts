export interface MessageAction {
  label: string;
  action: string;
}

export type MessageReference =
  | {
      id: string;
      kind: "confluence";
      title: string;
      sourceName?: string;
      location?: string;
      url?: string;
      snippet?: string;
    }
  | {
      id: string;
      kind: "file";
      title: string;
      sourceName?: string;
      location?: string;
      path: string;
      snippet?: string;
    }
  | {
      id: string;
      kind: "mcp";
      title: string;
      sourceName?: string;
      location?: string;
      resourceUri: string;
      server: string;
      url?: string;
      snippet?: string;
    };

export interface DynamicKnowledgeContextResult {
  promptContext: string;
  references: MessageReference[];
}

export interface MessageRecord {
  id: string;
  content?: string;
  imageDataUrls?: string[];
  sender: "user" | "clippy";
  createdAt: number;
  actions?: MessageAction[];
  references?: MessageReference[];
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

export interface Versions extends NodeJS.ProcessVersions {
  clippy: string;
  electron: string;
  nodeLlamaCpp: string;
  chromium: string;
}

export type NestedRecord<T> = {
  [key: string]: T | NestedRecord<T>;
};

export interface ClippyDebugInfo {
  platform: string;
  arch: string;
  versions: Record<string, string>;
  llamaBinaries: Array<string>;
  llamaBinaryFiles: NestedRecord<number>;
  checks: Record<string, boolean | string>;
  gpu: unknown;
}

export type BuddyAction =
  | "define"
  | "summarize"
  | "explain-simple"
  | "rewrite-friendly";

export interface BuddySpeechPayload {
  action: BuddyAction;
  selectedText: string;
  speech: string;
  isLoading?: boolean;
}
