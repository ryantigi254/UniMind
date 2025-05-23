// components/MessageInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading = false,
  placeholder = "Type your message..." 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    onSendMessage(trimmedMessage);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="
            flex-1 p-4 pr-12 
            bg-transparent 
            text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400
            border-none outline-none resize-none
            min-h-[56px] max-h-[120px]
            rounded-2xl
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          rows={1}
        />
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="
            absolute right-3 bottom-3
            p-2 rounded-full
            bg-blue-600 hover:bg-blue-700 
            disabled:bg-gray-300 dark:disabled:bg-gray-600
            disabled:cursor-not-allowed
            transition-colors duration-200
            flex items-center justify-center
          "
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
      
      {/* Character count or helpful text */}
      <div className="flex justify-between items-center mt-2 px-1">
        <div className="text-xs text-gray-400">
          {isLoading ? 'Sending...' : 'Press Enter to send, Shift+Enter for new line'}
        </div>
        {message.length > 0 && (
          <div className="text-xs text-gray-400">
            {message.length} characters
          </div>
        )}
      </div>
    </form>
  );
};

export default MessageInput;