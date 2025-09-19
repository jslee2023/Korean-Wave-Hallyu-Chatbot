'use client';

import React from 'react';

interface MessageType {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '방금';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`message-bubble ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
        {/* 메시지 내용 */}
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br>') }}
        />
        
        {/* 타임스탬프 */}
        <div className={`mt-2 text-xs opacity-70 flex items-center gap-1 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {message.role === 'assistant' && (
            <span className="text-purple-500">🤖</span>
          )}
          {message.role === 'user' && (
            <span className="text-pink-400">👤</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
