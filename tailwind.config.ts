import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Clash Display', 'sans-serif'],
      },
      colors: {
        brand: {
          base: '#050505',
          dark: '#111112',
          gold: '#D4AF37',
          goldLite: '#E5C665',
          emerald: '#0E6B43',
        }
      },
      boxShadow: {
        premium: '0 40px 120px rgba(0, 0, 0, 0.7)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    }
  },
  plugins: []
};

export default config;
