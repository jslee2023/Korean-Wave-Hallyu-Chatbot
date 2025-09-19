/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ✅ 기본 색상들은 extend에 추가하지 않음
        // 기존 purple만 유지
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
        // 한류 테마만 추가
        hallyu: {
          50: '#fdf2f8',
          500: '#ec4899',
          600: '#db2777',
        }
      },
      animation: {
        'slideIn': 'slideIn 0.3s ease-out',
        'typing': 'typing 1.4s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
