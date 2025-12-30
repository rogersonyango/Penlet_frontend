// src/pages/Chatbot/ChatPage.tsx
"use client";

import React, { useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import HistorySidebar from '../../components/ChatUI/HistorySidebar';
import MessageBubble from '../../components/ChatUI/MessageBubble';
import TypingIndicator from '../../components/ChatUI/TypingIndicator';

const ChatPage: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    handleSendMessage, 
    startNewChat,
    history,
    activeConversationId,
    loadConversation
  } = useChat();
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleSendMessage(inputText);
      setInputText('');
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <HistorySidebar
        conversations={history}
        activeId={activeConversationId}
        onSelect={loadConversation}
        onNewChat={startNewChat}
      />

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 sm:p-6 shadow-lg border-b-4 border-vibrant-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-vibrant-purple-500 to-vibrant-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
              🤖
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-vibrant-purple-600 to-vibrant-pink-600 text-transparent bg-clip-text">
                Student Assistant
              </h1>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online • Ready to help!
              </p>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
          {messages.length === 0 && !isLoading && (
            <div className="text-center mt-8 sm:mt-16 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-vibrant-purple-400 to-vibrant-pink-400 rounded-3xl shadow-2xl mb-6 transform hover:rotate-12 hover:scale-110 transition-all duration-300 animate-float">
                <span className="text-5xl">💬</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
                👋 Hello! I'm your AI study assistant!
              </p>
              <p className="text-gray-600 max-w-md mx-auto font-medium">
                Ask me about data science, programming, or any subject you're studying!
              </p>
              
              {/* Quick Suggestions */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  'Explain quantum computing',
                  'Help me study for exams',
                  'What is machine learning?',
                  'Give me coding tips'
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-4 py-2 bg-white border-2 border-vibrant-purple-300 text-vibrant-purple-700 rounded-full font-bold text-sm hover:bg-vibrant-purple-50 hover:border-vibrant-purple-400 transform hover:scale-105 transition-all duration-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              sender={msg.sender}
              timestamp={msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            >
              {msg.text}
            </MessageBubble>
          ))}

          {isLoading && <TypingIndicator />}
          
          {error && (
            <MessageBubble sender="bot">
              <span className="text-red-600 flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </span>
            </MessageBubble>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-white border-t-4 border-vibrant-cyan-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 font-medium text-base placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className={`px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading || !inputText.trim()
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-vibrant-purple-500 via-vibrant-pink-500 to-vibrant-cyan-500 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </span>
              ) : (
                <>
                  <span>📤</span>
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;

