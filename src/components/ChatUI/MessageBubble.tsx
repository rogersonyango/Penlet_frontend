// src/components/ChatUI/MessageBubble.tsx
"use client";

import React from 'react';
import Avatar from './Avatar';

interface MessageBubbleProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
  timestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, children, timestamp }) => {
  const isUser = sender === 'user';
  
  const bubbleStyles = isUser 
    ? 'bg-gradient-to-r from-vibrant-purple-500 to-vibrant-pink-500 text-white shadow-lg' 
    : 'bg-white border-3 border-vibrant-purple-200 text-gray-800 shadow-md';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slideUp`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <Avatar variant="bot" className="w-10 h-10 text-lg" />
        </div>
      )}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3 rounded-2xl ${bubbleStyles}`}>
          {children}
        </div>
        {timestamp && (
          <span className="text-xs text-gray-400 mt-1 mx-1 font-medium">
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-2">
          <Avatar variant="user" className="w-10 h-10 text-lg" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

