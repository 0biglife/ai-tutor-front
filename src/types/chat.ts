import { ChatMessageRole } from "./enums";

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
  timestamp?: number;
  audioUrl?: string;
};
