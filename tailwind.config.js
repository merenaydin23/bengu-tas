/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: {
          dark: '#0E1B2B',
          navy: '#15263B',
          deep: '#1F4E79',
          light: '#4A90C2',
          ice: '#D9EEF8'
        },
        crimson: {
          deep: '#781212',
          DEFAULT: '#9E1B1B',
          light: '#C0392B'
        },
        gold: {
          dark: '#A67C12',
          DEFAULT: '#D4A017',
          light: '#F5B041',
          shimmer: '#FDF2D0'
        },
        stone: {
          dark: '#2A2E35',
          medium: '#8C929D',
          light: '#E2D4B7',
          sand: '#F3E9D2'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        gokturk: ['"Noto Sans Old Turkic"', 'monospace']
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        },
        'stone-reveal': {
          '0%': { opacity: '0', filter: 'blur(4px)', transform: 'scale(0.97)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'pulse-subtle': 'pulse-subtle 2s infinite ease-in-out',
        'stone-reveal': 'stone-reveal 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
}
