// src/pages/ChatPage.tsx

import React, { useRef, useState } from 'react';
// import { useChat } from '../hooks/useChat';
// import MessageBubble from '../components/ChatUI/MessageBubble';
// import TypingIndicator from '../components/ChatUI/TypingIndicator';
// import HistorySidebar from '../components/ChatUI/HistorySidebar';
import './ChatPage.css';
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
    <div className="flex h-screen bg-gradient-primary">
      {/* Sidebar */}
      <HistorySidebar
        conversations={history}
        activeId={activeConversationId}
        onSelect={loadConversation}
        onNewChat={startNewChat}
      />

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow-sm">
          <h1 className="text-text-dark-blue font-display font-bold text-xl">
            Student Assistant
          </h1>
        </header>

        <div className="flex-1 p-4 overflow-y-auto bg-gradient-primary">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-text-secondary mt-12">
              <div className="text-4xl mb-4">💬</div>
              <p className="max-w-md mx-auto">
                Ask me about data science, programming, or your studies!
              </p>
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
              <span className="text-red-600">⚠️ {error}</span>
            </MessageBubble>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-full border border-purple-light focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 rounded-full font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;