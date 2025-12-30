// src/components/ChatUI/HistorySidebar.tsx
"use client";

import React from 'react';

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface HistorySidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  conversations, 
  activeId, 
  onSelect, 
  onNewChat 
}) => {
  return (
    <div className="w-64 bg-white border-r-4 border-vibrant-purple-200 h-full flex flex-col">
      <div className="p-4 border-b-4 border-vibrant-purple-100">
        <button 
          onClick={onNewChat}
          className="w-full py-3 bg-gradient-to-r from-vibrant-purple-500 via-vibrant-pink-500 to-vibrant-cyan-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="text-xl">✨</span>
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-500 text-sm font-medium">No history yet</p>
            <p className="text-gray-400 text-xs mt-1">Start a new chat!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                  activeId === conv.id 
                    ? 'bg-gradient-to-r from-vibrant-purple-500 to-vibrant-pink-500 text-white shadow-lg transform scale-105' 
                    : 'bg-gray-50 hover:bg-purple-50 border-2 border-transparent hover:border-purple-200'
                }`}
              >
                <div className="font-bold truncate flex items-center gap-2">
                  <span>{activeId === conv.id ? '💬' : '📝'}</span>
                  {conv.title || 'Untitled Chat'}
                </div>
                <div className={`text-xs mt-1 ${
                  activeId === conv.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {new Date(conv.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t-4 border-vibrant-purple-100">
        <p className="text-xs text-gray-400 text-center font-medium">
          🤖 Student Assistant
        </p>
      </div>
    </div>
  );
};

export default HistorySidebar;

