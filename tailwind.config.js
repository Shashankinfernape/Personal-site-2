/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          yellow: '#FFD800',
          cyan: '#00F5D4',
          pink: '#FF2A85',
          orange: '#FF5500',
          lime: '#CCFF00',
          purple: '#A855F7',
          blue: '#38BDF8',
          green: '#22C55E',
          dark: '#05060A'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
