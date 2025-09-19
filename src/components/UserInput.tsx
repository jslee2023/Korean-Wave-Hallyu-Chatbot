// ./src/components/UserInput.tsx
'use client';

import React, { useState, KeyboardEvent } from 'react';

interface UserInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        {/* 입력 필드 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={isLoading ? "" : "한류에 대해 궁금한 점을 물어보세요! 🎵📺"}
          disabled={isLoading}
          className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 resize-none"
          maxLength={1000}
          autoComplete="off"
        />
        
        {/* 문자 수 표시 */}
        {!isLoading && (
          <span className="absolute right-3 bottom-2 text-xs text-gray-400 dark:text-gray-500">
            {input.length}/1000
          </span>
        )}
      </div>
      
      {/* 전송 버튼 */}
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          isLoading || !input.trim()
            ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 active:scale-95 shadow-purple-500/25'
        }`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default UserInput;
