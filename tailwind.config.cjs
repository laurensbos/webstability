module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e6efff',
          200: '#c3ddff',
          300: '#9fcaff',
          400: '#66aefc',
          500: '#2e93f3',
          600: '#2279d9',
          700: '#145ca0',
          800: '#0d3f67',
          900: '#071a2e'
        },
        coral: {
          50: '#fff5f3',
          500: '#ff6b6b'
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9'
        },
        /* Premium / gold tokens for the New Year theme */
        premium: {
          50: '#fffaf1',
          100: '#fff3df',
          200: '#ffe8b8',
          300: '#ffdd91',
          400: '#ffd98a',
          500: '#ffc35a',
          600: '#ffb347',
          700: '#ff8c00',
          800: '#b45a00',
          900: '#6e3000'
        },
        gold: '#ffd98a',
        'premium-dark': '#07070a'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg,#fff7e6,#ffd98a,#fff7e6)'
      },
      boxShadow: {
        card: '0 12px 40px rgba(17, 24, 39, 0.08)',
        'glow-gold': '0 20px 60px rgba(255,180,60,0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0px)' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
