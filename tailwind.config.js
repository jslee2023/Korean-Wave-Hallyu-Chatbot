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
      colors: {
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
      },
      animation: {
        'slideIn': 'slideIn 0.3s ease-out',
        'typing': 'typing 1.4s infinite ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
