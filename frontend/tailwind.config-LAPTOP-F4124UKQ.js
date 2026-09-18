/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        martial: {
          black:   '#0B1B2F',
          dark:    '#112D4E',
          card:    '#163864',
          border:  '#244C7E',
          muted:   '#8EA6C6',
          light:   '#1C4478',
          surface: '#DBE2EF',
        },
        gold: {
          50:  '#F9F7F7',
          100: '#EEF3F8',
          200: '#DBE2EF',
          300: '#A5C0E5',
          400: '#5C8DC9',
          500: '#3F72AF',
          600: '#336096',
          700: '#254A78',
          800: '#1A375D',
          900: '#112D4E',
          950: '#0B1C33',
        },
      },
      fontFamily: {
        cinzel:   ['Cinzel', 'serif'],
        inter:    ['Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        sans:     ['Inter', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 4px 20px rgba(63, 114, 175, 0.35)',
        'card-hover': '0 10px 30px rgba(17, 45, 78, 0.6)',
        glow: '0 0 25px rgba(63, 114, 175, 0.45)',
      },
    },
  },
  plugins: [],
}
