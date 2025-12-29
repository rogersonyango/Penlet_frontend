// src/components/ChatUI/MessageBubble.tsx

import React from 'react';
import Avatar from './Avatar';

interface MessageBubbleProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
  timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, children, timestamp }) => {
  const isUser = sender === 'user';
  const bgColor = isUser ? 'bg-primary-100' : 'bg-purple-light';
  const align = isUser ? 'items-end' : 'items-start';

  return (
    <div className={`flex ${align} space-x-2 mb-4`}>
      {!isUser && <Avatar variant="bot" />}
      <div className="flex flex-col max-w-[80%]">
        <div className={`px-4 py-3 rounded-2xl ${bgColor} text-text-primary`}>
          {children}
        </div>
        {timestamp && (
          <span className="text-xs text-text-secondary mt-1 ml-1">
            {timestamp}
          </span>
        )}
      </div>
      {isUser && <Avatar variant="user" />}
    </div>
  );
};

export default MessageBubble;