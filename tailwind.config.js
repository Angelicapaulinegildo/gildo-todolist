/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        klee: ['"Klee One"', 'cursive'],
        shippori: ['"Shippori Mincho"', 'serif'],
      },
      colors: {
        herb: {
          bg: '#e8eed9',
          moss: '#6b8b4a',
          mossDark: '#4a6933',
          sage: '#a3b899',
          sageDark: '#7a8f6a',
          jade: '#4a7c59',
          jadeDark: '#2d5a3d',
          paper: '#faf6e8',
          paperDark: '#ede4c8',
          ink: '#2a3f1f',
          inkSoft: '#5a6b45',
        },
        spice: {
          cinnamon: '#b5793e',
          cinnamonLight: '#d49456',
          cinnamonDark: '#8b5428',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e8c85a',
        },
        lavender: {
          DEFAULT: '#b8a8d4',
          dark: '#7c6fa0',
          light: '#d0c0e4',
        },
        chamomile: {
          DEFAULT: '#f0d89c',
          light: '#f8e4a8',
        },
      },
    },
  },
  plugins: [],
};