// src/services/chatbot.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const chatbotApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * @param {unknown} error - The caught error (usually AxiosError)
 * @returns {{ message: string, status?: number }}
 */
function formatChatbotError(error) {
  if (axios.isAxiosError(error)) {
    // Network timeout
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out. Please check your connection.',
        status: error.response?.status
      };
    }

    // Server responded with an error
    if (error.response) {
      const status = error.response.status;
      let message = 'Something went wrong. Please try again.';

      switch (status) {
        case 400:
          message = 'Invalid message format.';
          break;
        case 403:
          message = 'Access denied. Student mode only.';
          break;
        case 429:
          message = 'Too many requests. Please wait a moment.';
          break;
        case 500:
          message = 'Server error. Our team is working on it.';
          break;
        case 502:
        case 503:
          message = 'Service temporarily unavailable.';
          break;
        default:
          // Try to get error message from backend
          message = error.response.data?.detail ||
                    error.response.data?.message ||
                    error.response.statusText ||
                    message;
      }

      return { message, status };
    }

    // Network error (no response received)
    return {
      message: 'Network error. Please check your internet connection.',
      status: undefined
    };
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    status: undefined
  };
}

/**
 * Send a message to the chatbot
 * @param {Object} data
 * @param {string} data.message - The user's message
 * @param {string} [data.conversation_id] - Optional conversation ID
 * @returns {Promise<Object>} Chatbot response
 * @throws {{ message: string, status?: number }}
 */
export const sendMessage = async (data) => {
  try {
    const response = await chatbotApi.post('/chatbot/message/', data);
    return response.data;
  } catch (error) {
    const formattedError = formatChatbotError(error);
    throw formattedError;
  }
};

/**
 * Fetch list of past conversations
 * @returns {Promise<Array>} List of conversation summaries
 * @throws {{ message: string, status?: number }}
 */
export const getChatHistory = async () => {
  try {
    const response = await chatbotApi.get('/chatbot/history/');
    // Support both array and { conversations: [...] } responses
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.conversations || [];
  } catch (error) {
    const formattedError = formatChatbotError(error);
    console.error('Failed to load chat history:', formattedError);
    throw formattedError;
  }
};