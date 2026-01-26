/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainWhite: '#F7F8F6',
        mainBlack: '#191B19',
      },
      fontFamily: {
        Gilroy: ['Gilroy', 'sans-serif'],
        Kinetika: ['Kinetika', 'sans-serif'],
      },
      screens: {
        ss: '25rem', // 400px
        mm: '53rem', // 848px
        ll: '75rem', // 1200px
      },
    },
  },
  plugins: [],
}
