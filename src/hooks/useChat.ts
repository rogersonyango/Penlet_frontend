// src/hooks/useChat.ts

import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ConversationSummary } from '../types/chatbot';
import { getChatHistory, sendMessage } from '../services/chatbot';
// import { ChatMessage, ConversationSummary } from '../types/chatbotTypes';
// import { sendMessage, getChatHistory } from '../services/chatbotService';

const LOCAL_STORAGE_KEY = 'chatbot_session';

interface ChatSession {
  messages: ChatMessage[];
  conversationId: string | null;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load session from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: ChatSession = JSON.parse(saved);
        setMessages(parsed.messages);
        setConversationId(parsed.conversationId);
        setActiveConversationId(parsed.conversationId);
      } catch (e) {
        console.warn('Failed to parse chat session');
      }
    }

    // Load history
    loadHistory();
  }, []);

  const saveSession = useCallback((msgs: ChatMessage[], convId: string | null) => {
    const session: ChatSession = { messages: msgs, conversationId: convId };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getChatHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history');
    }
  };

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage({
        message: userMessage,
        conversation_id: conversationId || undefined
      });

      if (!conversationId) {
        setConversationId(response.conversation_id);
        setActiveConversationId(response.conversation_id);
      }

      const botMsg: ChatMessage = {
        id: Date.now().toString() + '-bot',
        text: response.bot_response,
        sender: 'bot',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      saveSession(finalMessages, response.conversation_id);
      await loadHistory(); // Refresh history
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get response');
      const errorMsg: ChatMessage = {
        id: Date.now().toString() + '-err',
        text: "Sorry, I'm having trouble.",
        sender: 'bot',
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      saveSession(finalMessages, conversationId);
    } finally {
      setIsLoading(false);
    }
  }, [messages, conversationId, isLoading, saveSession]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setActiveConversationId(null);
    saveSession([], null);
  }, [saveSession]);

  const loadConversation = useCallback((id: string) => {
    // In real app: fetch full conversation from backend
    // For now: just switch active ID (you can extend later)
    setActiveConversationId(id);
    // Clear current messages (or load from backend)
    setMessages([]);
    setConversationId(id);
    saveSession([], id);
  }, [saveSession]);

  return {
    messages,
    isLoading,
    error,
    handleSendMessage,
    startNewChat,
    history,
    activeConversationId,
    loadConversation
  };
};