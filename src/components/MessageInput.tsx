import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading,
  placeholder = "Ask anything"
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

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 py-3 bg-transparent">
      <div className="max-w-screen-lg mx-auto">
        <div 
          className={`
            flex items-center gap-3 px-4 py-3
            bg-gray-100 dark:bg-gray-700 
            rounded-[24px] transition-all duration-200 ease-in-out
            shadow-[0_5px_15px_rgba(255,0,122,0.4)] dark:shadow-[0_5px_15px_rgba(255,0,122,0.25)]
          `}
        >
          <button
            type="button"
            className="
              flex items-center justify-center w-8 h-8
              hover:bg-gray-200 dark:hover:bg-gray-600
              rounded-full transition-colors
            "
            aria-label="Add attachment"
          >
            <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="
              flex-1 bg-transparent resize-none
              border-none outline-none ring-0
              min-h-[24px] max-h-[120px]
              text-base leading-6
              placeholder-gray-500 dark:placeholder-gray-400
              text-gray-900 dark:text-white
              disabled:opacity-60
            "
            rows={1}
            aria-label="Message input"
          />

          {message.trim() ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                flex items-center justify-center w-8 h-8
                bg-primary-500 hover:bg-primary-600
                disabled:bg-gray-400 dark:disabled:bg-gray-600
                rounded-full transition-colors
                shadow-sm
              `}
              aria-label="Send message"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          ) : (
            <button
              type="button"
              className="
                flex items-center justify-center w-8 h-8
                bg-white hover:bg-gray-50 dark:hover:bg-gray-100
                rounded-full transition-colors
                shadow-sm
              "
              aria-label="Voice input"
            >
              <Mic className="h-5 w-5 text-gray-900" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;