/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4945FF',
        secondary: '#BB27FF',
        accent: '#FFD927',
        success: '#4ECD7B',
        error: '#FF5252',
        warning: '#FFA726',
        info: '#29B6F6',
      },
      fontFamily: {
        'pretendard': ['Pretendard', 'system-ui', 'sans-serif'],      },
    },
  },
  plugins: [],
}
