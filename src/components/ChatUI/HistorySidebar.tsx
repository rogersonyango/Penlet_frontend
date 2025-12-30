// src/components/ChatUI/HistorySidebar.tsx

import React from 'react';

interface HistorySidebarProps {
  conversations: { id: string; title: string; updated_at: string }[];
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
    <div className="w-64 bg-white border-r border-purple-light h-full flex flex-col">
      <div className="p-4 border-b border-purple-light">
        <button 
          onClick={onNewChat}
          className="w-full py-2 bg-gradient-primary text-white rounded-button font-semibold shadow-button"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-text-secondary text-sm p-2">No history yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left p-3 rounded-badge mb-2 transition-colors ${
                activeId === conv.id 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'hover:bg-purple-light'
              }`}
            >
              <div className="font-medium truncate">{conv.title || 'Untitled'}</div>
              <div className="text-xs text-text-secondary">
                {new Date(conv.updated_at).toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;