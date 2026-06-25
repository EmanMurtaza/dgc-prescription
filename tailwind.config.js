/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        clinic: {
          green: '#2d6a2d',
          gold: '#d4a017',
          dark: '#1a1a2e',
        }
      }
    },
  },
  plugins: [],
}
