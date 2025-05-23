// components/ChatMessageBubble.tsx
import React from 'react';
import { Message } from '../types';
import ChatBotAvatar from './ChatBotAvatar';

interface ChatMessageBubbleProps {
  message: Message;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'systemError';

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(timestamp));
  };

  if (isUser) {
    return (
      <div className="flex gap-4 mb-6 justify-end">
        <div className="flex-1 flex justify-end">
          <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm max-w-2xl">
            <p className="whitespace-pre-wrap">{message.content}</p>
            <div className="text-xs text-blue-100 mt-1 opacity-80">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 mb-6">
      <ChatBotAvatar size={32} />
      <div className="flex-1">
        <div className={`
          rounded-2xl p-4 shadow-sm inline-block max-w-2xl
          ${isError 
            ? 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700' 
            : 'bg-white dark:bg-gray-800'
          }
        `}>
          <p className={`
            whitespace-pre-wrap
            ${isError 
              ? 'text-red-800 dark:text-red-200' 
              : 'text-gray-900 dark:text-white'
            }
          `}>
            {message.content}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <div className={`
              text-xs opacity-80
              ${isError 
                ? 'text-red-600 dark:text-red-300' 
                : 'text-gray-500 dark:text-gray-400'
              }
            `}>
              {formatTime(message.timestamp)}
            </div>
            
            {/* Show metadata for therapy messages */}
            {message.metadata && !isError && (
              <div className="text-xs text-gray-400 dark:text-gray-500 flex gap-2">
                {message.metadata.stage && (
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {message.metadata.stage}
                  </span>
                )}
                {message.metadata.apiSource && (
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {message.metadata.apiSource}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Show interaction count for debugging */}
          {message.metadata?.interactionCount && (
            <div className="text-xs text-gray-400 mt-1">
              Interaction #{message.metadata.interactionCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;