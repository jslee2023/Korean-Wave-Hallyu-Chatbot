/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // 다크 모드 활성화
  theme: {
    extend: {
      // ✅ gray 색상 팔레트 명시적 추가 (기본값이지만 안전을 위해)
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // 한류 테마 색상
        hallyu: {
          50: '#fdf2f8',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
        kpop: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        kdrama: {
          500: '#ef4444',
          600: '#dc2626',
        },
        kbeauty: {
          500: '#06b6d4',
          600: '#0891b2',
        },
        // 기존 purple 색상 유지
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
        },
      },
      animation: {
        'slideIn': 'slideIn 0.3s ease-out',
        'typing': 'typing 1.4s infinite ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(to right, #8b5cf6, #ec4899)',
      },
    },
  },
  plugins: [],
};
