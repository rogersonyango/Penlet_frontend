// src/components/ChatUI/Avatar.tsx
"use client";

import React from 'react';

interface AvatarProps {
  variant: 'user' | 'bot';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ variant, className = '' }) => {
  const bgColor = variant === 'user' 
    ? 'bg-gradient-to-br from-vibrant-purple-500 to-vibrant-pink-500' 
    : 'bg-gradient-to-br from-vibrant-cyan-400 to-vibrant-green-400';
  
  const icon = variant === 'user' ? '👤' : '🤖';

  return (
    <div className={`${bgColor} ${className} rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform duration-300`}>
      <span className="text-sm">{icon}</span>
    </div>
  );
};

export default Avatar;

