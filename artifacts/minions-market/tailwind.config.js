/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0b0e14',
        'bg-card': '#161b22',
        'bg-input': '#1d232a',
        'accent': '#00a3ff',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        'container': '16px',
        'button': '12px',
      },
    },
  },
  plugins: [],
}