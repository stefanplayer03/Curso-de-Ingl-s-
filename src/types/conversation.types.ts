import type { AiCorrection } from "@/ai/ai.types";

export interface ConversationMessage {
  id: string;
  role: "student" | "tutor";
  content: string;
  corrections?: AiCorrection[];
  createdAt: string; // ISO date
}

export interface ConversationSession {
  id: string;
  uid: string;
  topic: string;
  level: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}
