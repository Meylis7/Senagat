/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Gilroy: ['Gilroy', 'sans-serif'],
        Kinetika: ['Kinetika', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
