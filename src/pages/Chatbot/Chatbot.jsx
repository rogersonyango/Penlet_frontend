import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI study assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'This is a mock response. In production, this would be connected to an AI service.'
      }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col card">
      <h1 className="text-2xl font-bold mb-4">AI Study Assistant</h1>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-primary-600' : 'bg-gray-200'
            }`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} />}
            </div>
            <div className={`flex-1 p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="input flex-1"
        />
        <button onClick={handleSend} className="btn btn-primary">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;