/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette from the design
        'vibrant-purple': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#AF87CE', // Main purple from palette
          500: '#a78bfa',
          600: '#8b5cf6',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
        },
        'vibrant-pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#EA1A7F', // Main pink from palette
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        'vibrant-yellow': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#FFC603', // Main yellow from palette
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        'vibrant-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#A8F387', // Main green from palette
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'vibrant-cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#16D6FA', // Main cyan from palette
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      backgroundImage: {
        'gradient-vibrant': 'linear-gradient(135deg, #AF87CE 0%, #EA1A7F 25%, #FFC603 50%, #A8F387 75%, #16D6FA 100%)',
        'gradient-purple-pink': 'linear-gradient(135deg, #AF87CE 0%, #EA1A7F 100%)',
        'gradient-pink-cyan': 'linear-gradient(135deg, #EA1A7F 0%, #16D6FA 100%)',
        'gradient-yellow-green': 'linear-gradient(135deg, #FFC603 0%, #A8F387 100%)',
        'gradient-purple-cyan': 'linear-gradient(135deg, #AF87CE 0%, #16D6FA 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      animation: {
        'fadeIn': 'fadeIn 0.8s ease-out',
        'slideDown': 'slideDown 0.6s ease-out',
        'slideUp': 'slideUp 0.6s ease-out',
        'slideLeft': 'slideLeft 0.6s ease-out',
        'slideRight': 'slideRight 0.6s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'progressBar': 'progressBar 1.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'vibrant': '0 10px 40px -10px rgba(175, 135, 206, 0.5)',
        'vibrant-lg': '0 20px 60px -10px rgba(234, 26, 127, 0.4)',
        'vibrant-xl': '0 25px 70px -15px rgba(22, 214, 250, 0.5)',
        'glow-purple': '0 0 20px rgba(175, 135, 206, 0.6)',
        'glow-pink': '0 0 20px rgba(234, 26, 127, 0.6)',
        'glow-yellow': '0 0 20px rgba(255, 198, 3, 0.6)',
        'glow-green': '0 0 20px rgba(168, 243, 135, 0.6)',
        'glow-cyan': '0 0 20px rgba(22, 214, 250, 0.6)',
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
        '103': '1.03',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.bg-gradient-vibrant': {
          'background-image': 'linear-gradient(135deg, #AF87CE 0%, #EA1A7F 25%, #FFC603 50%, #A8F387 75%, #16D6FA 100%)',
        },
        '.border-gradient': {
          'border-image': 'linear-gradient(135deg, #AF87CE, #EA1A7F, #FFC603, #A8F387, #16D6FA) 1',
        },
        '.hover-lift': {
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-5px)',
            'box-shadow': '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}