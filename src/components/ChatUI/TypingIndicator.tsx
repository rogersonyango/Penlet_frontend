// src/components/ChatUI/TypingIndicator.tsx

import React from 'react';
import Avatar from './Avatar';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-2 mb-4">
      <Avatar variant="bot" />
      <div className="bg-purple-light px-4 py-3 rounded-2xl">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;