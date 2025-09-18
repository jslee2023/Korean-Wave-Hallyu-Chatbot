'use client';

import React from 'react';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-lg ${
          isUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white text-gray-800'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-purple-100' : 'text-gray-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;