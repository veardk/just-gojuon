module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fad9c1',
          300: '#f6be97',
          400: '#f19a6b',
          500: '#ed7d47',
          600: '#de6332',
          700: '#b84d28',
          800: '#934027',
          900: '#773623',
        },
        japanese: {
          hiragana: '#FF8FA3',
          katakana: '#87CEEB',
          romaji: '#98D8C8',
          accent: '#FFD700',
        },
        semantic: {
          success: '#4ADE80',
          error: '#F87171',
          warning: '#FBBF24',
          info: '#60A5FA',
        },
        background: {
          primary: '#FEFCFB',
          secondary: '#F8F6F3',
          accent: '#FFF5F0',
        },
        text: {
          primary: '#2D3748',
          secondary: '#4A5568',
          muted: '#718096',
        }
      },
      fontFamily: {
        japanese: [
          'Noto Sans JP',
          'Hiragino Sans',
          'Yu Gothic',
          'Meiryo',
          'sans-serif'
        ],
        sans: [
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        display: [
          'Comfortaa',
          'Nunito',
          'sans-serif'
        ]
      },
      fontSize: {
        'kana-xs': ['1.5rem', { lineHeight: '2rem' }],
        'kana-sm': ['2rem', { lineHeight: '2.5rem' }],
        'kana-md': ['3rem', { lineHeight: '3.5rem' }],
        'kana-lg': ['4rem', { lineHeight: '4.5rem' }],
        'kana-xl': ['6rem', { lineHeight: '6.5rem' }]
      },
      spacing: {
        'card-sm': '0.75rem',
        'card-md': '1rem',
        'card-lg': '1.5rem',
        'container-sm': '1rem',
        'container-md': '2rem',
        'container-lg': '3rem'
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
        'pill': '2rem'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'float': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'bounce-soft': 'bounce 1s ease-in-out infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      gridTemplateColumns: {
        '10': 'repeat(10, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
