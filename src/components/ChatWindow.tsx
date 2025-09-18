'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageRole } from '@/types';
import MessageBubble from './MessageBubble';
import UserInput from './UserInput';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot' as MessageRole,
      content: '🎉 안녕하세요! 저는 **한류봇**입니다! 🇰🇷\n\nK-팝, 드라마, 음식, 여행 등 한국 문화에 대해 궁금한 점이 있으신가요?\n\n**BTS의 다음 컴백?** 📱\n**최고의 김치찌개 레시피?** 🍲\n**제주도 숨은 명소?** 🏝️\n\n무엇이든 물어보세요! 😊',
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    const userId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userId,
      role: 'user' as MessageRole,
      content: text,
      timestamp: Date.now(),
    };

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log('📤 전송 중:', text.substring(0, 50) + '...');

      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 서버 에러:', response.status, errorText);
        throw new Error(`서버 에러 ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.content) {
        throw new Error('서버에서 응답 내용을 받지 못했습니다.');
      }

      console.log('✅ 응답 받음:', data.content.substring(0, 100) + '...');

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot' as MessageRole,
        content: data.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('❌ 메시지 전송 오류:', error);

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'bot' as MessageRole,
        content: `😅 죄송합니다! 메시지 전송 중 오류가 발생했어요.\n\n**오류**: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }\n\n잠시 후 다시 시도해주세요! 🙏`,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl border border-white/20">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🇰🇷</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                한류봇
              </h1>
              <p className="text-sm text-gray-600">K-문화 전문 AI 어시스턴트</p>
            </div>
          </div>
        </div>

        {/* 챗 윈도우 */}
        <div className="flex flex-col w-full h-[70vh] lg:h-[80vh] bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white/50 px-4 py-2 rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">한류 정보를 찾고 있어요... ✨</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="p-6 border-t border-gray-200/50 bg-white/50">
            <UserInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          💡 팁: K-팝 아티스트, 드라마 추천, 한국 음식 레시피 등 무엇이든 물어보세요!
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;