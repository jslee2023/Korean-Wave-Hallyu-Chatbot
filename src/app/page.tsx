'use client';

import React, { useState, useRef, useEffect } from 'react';
import UserInput from '@/components/UserInput';

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`서버 에러 ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: data.timestamp,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('채팅 오류:', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `😅 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n잠시 후 다시 시도해주세요!`,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 간단한 헤더 */}
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">한류 챗봇</h1>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-red-500 hover:text-red-700"
          >
            초기화
          </button>
        )}
      </header>

      {/* 메시지 컨테이너 */}
      <main className="max-w-2xl mx-auto space-y-4 mb-8">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">한류 챗봇에 오신 걸 환영합니다!</h2>
            <p className="text-gray-600">K-팝, K-드라마에 대해 물어보세요!</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white border shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString('ko-KR')}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span className="text-sm">생각중...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 입력 영역 */}
      <div className="max-w-2xl mx-auto">
        <UserInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
