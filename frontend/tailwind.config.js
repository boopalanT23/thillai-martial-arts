/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Exact Color Hunt Palette: #F9F7F7 | #DBE2EF | #3F72AF | #112D4E
        tma: {
          light:     '#F9F7F7', // Primary page background, light sections, cards, forms
          soft:      '#DBE2EF', // Secondary background, soft panels, borders, dividers, hover states
          primary:   '#3F72AF', // Primary brand accent, buttons, links, icons, active states, CTAs
          navy:      '#112D4E', // Primary dark color, headings, navigation text, footer, strong typography
          hover:     '#2D5B94', // Slightly darker primary for crisp hover states
        },
        // Direct color aliases for seamless utility usage
        brand: {
          50:  '#F4F7FB',
          100: '#DBE2EF',
          200: '#BFCEE4',
          300: '#94B2D7',
          400: '#6792C7',
          500: '#3F72AF', // Primary Accent
          600: '#2D5B94',
          700: '#1F4473',
          800: '#163255',
          900: '#112D4E', // Dark Navy
          950: '#0B1D33',
        },
        // Backward-compatible tokens mapped strictly to the Color Hunt palette
        martial: {
          black:  '#F9F7F7',
          dark:   '#DBE2EF',
          card:   '#FFFFFF',
          border: '#DBE2EF',
          muted:  '#5A7184',
          light:  '#F9F7F7',
          navy:   '#112D4E',
        },
        gold: {
          50:  '#F4F7FB',
          100: '#DBE2EF',
          200: '#BFCEE4',
          300: '#6792C7',
          400: '#3F72AF',
          500: '#3F72AF',
          600: '#2D5B94',
          700: '#1F4473',
          800: '#163255',
          900: '#112D4E',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        // Aliases to ensure complete transition safety
        oswald:  ['"Barlow Condensed"', 'sans-serif'],
        cinzel:  ['"Barlow Condensed"', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(17, 45, 78, 0.05), 0 1px 2px -1px rgba(17, 45, 78, 0.05)',
        'card': '0 4px 12px -2px rgba(17, 45, 78, 0.05)',
        'card-hover': '0 12px 28px -4px rgba(17, 45, 78, 0.1), 0 4px 10px -2px rgba(17, 45, 78, 0.04)',
        'btn': '0 4px 14px -2px rgba(63, 114, 175, 0.3)',
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
      },
    },
  },
  plugins: [],
}
