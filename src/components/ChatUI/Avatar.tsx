// src/components/ChatUI/Avatar.tsx

import React from 'react';

interface AvatarProps {
  variant: 'user' | 'bot';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ variant, className = '' }) => {
  const bgColor = variant === 'user' 
    ? 'bg-primary-500' 
    : 'bg-cyan';
  
  const icon = variant === 'user' ? '👤' : '🤖';

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${bgColor} ${className}`}>
      <span className="text-xs">{icon}</span>
    </div>
  );
};

export default Avatar;