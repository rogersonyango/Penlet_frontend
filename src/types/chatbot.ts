// src/types/chatbotTypes.ts

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface SendMessageRequest {
  message: string;
  conversation_id?: string;
}

export interface SendMessageResponse {
  user_message: string;
  bot_response: string;
  conversation_id: string;
  mode: string;
}

// NEW: For history sidebar
export interface ConversationSummary {
  id: string;
  title: string; // First user message or "New chat"
  created_at: string;
  updated_at: string;
}