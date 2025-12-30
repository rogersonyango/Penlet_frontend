// src/components/ChatUI/TypingIndicator.tsx
"use client";

import React from 'react';
import Avatar from './Avatar';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start mb-4 animate-slideUp">
      <div className="flex-shrink-0 mr-2">
        <Avatar variant="bot" className="w-10 h-10 text-lg" />
      </div>
      <div className="bg-white border-3 border-vibrant-purple-200 px-5 py-4 rounded-2xl shadow-md">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-vibrant-purple-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-vibrant-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-vibrant-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

