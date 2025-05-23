// components/ChatBotAvatar.tsx
import React from 'react';

interface ChatBotAvatarProps {
  size?: number;
  className?: string;
}

const ChatBotAvatar: React.FC<ChatBotAvatarProps> = ({ 
  size = 40, 
  className = "" 
}) => {
  return (
    <div 
      className={`
        flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
        flex items-center justify-center shadow-md
        ${className}
      `}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="text-white"
        aria-hidden="true"
      >
        {/* Robot head */}
        <rect width="60" height="45" x="20" y="35" rx="10" ry="10" fill="currentColor"/>
        
        {/* Eyes */}
        <circle cx="35" cy="50" r="4" fill="#1f2937" />
        <circle cx="65" cy="50" r="4" fill="#1f2937" />
        
        {/* Mouth */}
        <path 
          d="M40 65 Q50 70 60 65" 
          stroke="#1f2937" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Antenna */}
        <line x1="50" y1="25" x2="50" y2="35" stroke="currentColor" strokeWidth="2"/>
        <circle cx="50" cy="22" r="2" fill="currentColor"/>
        
        {/* Small indicator dots */}
        <circle cx="30" cy="42" r="1" fill="#10b981" />
        <circle cx="70" cy="42" r="1" fill="#ef4444" />
      </svg>
    </div>
  );
};

export default ChatBotAvatar;