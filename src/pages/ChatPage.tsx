import React, { useRef, useEffect } from 'react';
import { useStore } from '../store';
import ChatBotAvatar from '../components/ChatBotAvatar';
import MessageInput from '../components/MessageInput';
import ChatMessageBubble from '../components/ChatMessageBubble';
import { generateResponse } from '../services/llmService';
import { Message } from '../types';

const ChatPage: React.FC = () => {
  const { 
    currentChat,
    setCurrentChat,
    addMessage,
    settings,
  } = useStore();
  
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    // Create a new chat if none exists
    if (!currentChat) {
      const newChat = {
        id: crypto.randomUUID(),
        title: content.slice(0, 30) + '...',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentChat(newChat);
    }

    // Create and add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(currentChat?.id || '', userMessage);

    // Generate AI response
    setIsLoading(true);
    try {
      const response = await generateResponse([
        ...(currentChat?.messages || []),
        userMessage,
      ]);
      addMessage(currentChat?.id || '', response);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'systemError',
        content: 'Failed to generate response. Please try again.',
        timestamp: new Date(),
      };
      addMessage(currentChat?.id || '', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        {/* Background Logo */}
        {(!currentChat || currentChat.messages.length === 0) && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-[450px] pointer-events-none z-0">
            <svg
              width="200"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-full h-full text-primary-500 opacity-[0.08]"
              aria-hidden="true"
            >
              <rect width="60" height="45" x="20" y="35" rx="10" ry="10" fill="currentColor"/>
              <circle cx="38" cy="53" r="5" fill="#000" />
              <circle cx="62" cy="53" r="5" fill="#000" />
              <path d="M45 62 Q50 67 55 62" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <line x1="50" y1="25" x2="50" y2="35" stroke="currentColor" strokeWidth="3"/>
              <circle cx="50" cy="22" r="3" fill="currentColor"/>
            </svg>
          </div>
        )}

        <div className="max-w-screen-lg mx-auto relative z-1">
          {/* Welcome message */}
          {(!currentChat || currentChat.messages.length === 0) && (
            <div className="flex gap-4 mb-6">
              <ChatBotAvatar size={32} />
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm inline-block max-w-2xl">
                  <p className="text-gray-900 dark:text-white">
                    Hello! I'm here to support you. How are you feeling today?
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Display chat messages */}
          {currentChat?.messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-4 mb-6">
              <ChatBotAvatar size={32} />
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm inline-block">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area with Disclaimer */}
      <div className="w-full bg-transparent pb-4">
        <div className="max-w-screen-lg mx-auto px-4">
          {/* Message Input */}
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          
          {/* Disclaimer */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 px-4 space-y-1">
            <p>UniMind is an AI assistant and cannot provide medical advice or mental health support.</p>
            <p>Responses may be inaccurate. Please consult a qualified professional for health concerns.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;