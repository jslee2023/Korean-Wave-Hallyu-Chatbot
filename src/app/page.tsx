'use client';

import React, { useState, useRef, useEffect } from 'react';
import UserInput from '@/components/UserInput';
import Message from '@/components/Message'; // ✅ 이제 이 import가 작동할 것임

// ✅ MessageType 인터페이스 제거 (Message.tsx에 정의됨)

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]); // ✅ 임시로 any 사용
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 웰컴 메시지 자동 추가
  useEffect(() => {
    if (showWelcome && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant' as const,
            content: `🎉 **한류 챗봇에 오신 것을 환영합니다!** 🌟\n\n안녕하세요! 저는 한류 전문 AI 어시스턴트 **한류봇**입니다. 🎵📺 K-팝, K-드라마, K-뷰티, 한국 여행 등 한류의 모든 것에 대해 이야기 나눌 수 있어요!\n\n**어떤 한류 주제가 궁금하시나요?**\n• 🎤 BTS, BLACKPINK 최신 소식\n• 📺 지금 볼만한 드라마 추천\n• 💄 K-뷰티 루틴 가이드\n• 🏝️ 서울 여행 코스\n\n지금 바로 물어보세요! 😊`,
            timestamp: Date.now(),
          },
        ]);
        setShowWelcome(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: message,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API 호출
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
        throw new Error(`서버 에러 ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // AI 응답 메시지 추가
      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant' as const,
        content: data.content,
        timestamp: data.timestamp,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('채팅 오류:', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant' as const,
        content: `😅 죄송합니다! 메시지 전송 중 오류가 발생했어요. **오류**: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n잠시 후 다시 시도해주세요! 🙏\n\n혹시 문제가 계속되면 새로고침 해보세요! 🔄`,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mobile-app">
      {/* 앱 헤더 */}
      <header className="app-header fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">🇰🇷</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">한류 챗봇</h1>
              <p className="text-xs opacity-90">Hallyu Assistant</p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              title="대화 초기화"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* 메시지 컨테이너 */}
      <main className="pt-20 pb-20 px-4 max-w-2xl mx-auto w-full">
        <div className="h-[calc(100vh-140px)] overflow-y-auto space-y-2">
          {messages.length === 0 && !showWelcome ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">한류 챗봇에 오신 걸 환영합니다!</h2>
              <p className="text-gray-500 dark:text-gray-400">K-팝, K-드라마, K-뷰티에 대해 물어보세요!</p>
            </div>
          ) : (
            messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )}

          {/* 타이핑 인디케이터 */}
          {isLoading && (
            <div className="typing-indicator message-bubble bot-message">
              <div className="flex items-center gap-2">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">한류봇이 생각중...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 입력 영역 */}
      <div className="input-container fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <UserInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>

      {/* 다크 모드 토글 (선택사항) */}
      <button className="fixed top-4 right-4 z-50 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all">
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
    </div>
  );
}
