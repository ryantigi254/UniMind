import React, { memo } from 'react';

interface ChatBotAvatarProps {
  size?: number;
  className?: string;
}

const ChatBotAvatar: React.FC<ChatBotAvatarProps> = memo(({ 
  size = 32,
  className = ''
}) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-black ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="UniMind AI Assistant"
    >
      <svg
        width={size * 0.85}
        height={size * 0.85}
        viewBox="0 0 100 100"
        className="text-primary-500"
        aria-hidden="true"
      >
        <rect width="60" height="45" x="20" y="35" rx="10" ry="10" fill="currentColor"/>
        <circle cx="38" cy="53" r="5" fill="#000000" />
        <circle cx="62" cy="53" r="5" fill="#000000" />
        <path d="M45 62 Q50 67 55 62" stroke="#4A5568" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <line x1="50" y1="25" x2="50" y2="35" stroke="currentColor" strokeWidth="3"/>
        <circle cx="50" cy="22" r="3" fill="currentColor"/>
      </svg>
    </div>
  );
});

ChatBotAvatar.displayName = 'ChatBotAvatar';

export default ChatBotAvatar;