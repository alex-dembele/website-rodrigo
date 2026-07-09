import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif']
      },
      colors: {
        // Palette issue du logo Rodrigo : rouge + noir sur fond clair
        brand: {
          red: '#D12630',
          redDark: '#A5131C',
          redLite: '#EF4A54',
          ink: '#151517',
          black: '#0C0C0D',
          gray: '#5B6069',
          line: '#E7E7EA',
          soft: '#F5F5F7',
          cream: '#FBFBFC'
        }
      },
      boxShadow: {
        card: '0 12px 40px -12px rgba(21, 21, 23, 0.14)',
        soft: '0 4px 20px -6px rgba(21, 21, 23, 0.10)',
        red: '0 16px 40px -12px rgba(209, 38, 48, 0.35)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'blob-drift': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(20px,-16px) scale(1.08)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.8s ease both',
        float: 'float 6s ease-in-out infinite',
        'blob-drift': 'blob-drift 14s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
