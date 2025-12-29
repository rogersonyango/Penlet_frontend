// src/types/chatbot.ts

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

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotError {
  message: string;
  status?: number;
  timestamp: Date;
}

