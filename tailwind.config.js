/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
    extend: {
      colors: {

         primary: {
          50: '#fff5f7',
          100: '#ffd4e8',
          200: '#ffb5d9',
          300: '#ff96c9',
          400: '#ff77b9',
          500: '#ff58a9', // main primary
          600: '#ff3a9a', // ← this is bg-primary-600
          700: '#ff1c8a',
          800: '#e0007a',
          900: '#b80064',
        },
        
        // Pink gradient colors
        'pink-light': '#FFB5E8',
        'pink-gradient-start': '#FF9ED5',
        'pink-gradient-end': '#FFC4E8',
        
        // Purple/Blue gradient colors
        'purple-light': '#E0BBE4',
        'purple-mid': '#C4A4E0',
        'purple-gradient': '#B8A4E8',
        'blue-purple': '#A4B0F4',
        'blue-light': '#B4C4FF',
        
        // Peach/Orange gradient colors
        'peach-light': '#FFD4B8',
        'peach': '#FFC0A8',
        'orange-light': '#FFB894',
        
        // Cyan/Teal colors (Science card)
        'cyan-light': '#A8E8E8',
        'cyan': '#80D8D8',
        'teal-dark': '#2C7A7B',
        'teal-icon': '#1E5A5C',
        
        // Blue colors (Math card)
        'blue-card': '#6B8CFF',
        'blue-dark': '#4B6CD8',
        'blue-button': '#5B7CED',
        
        // Yellow/Gold colors (Language & badges)
        'yellow-light': '#FFE194',
        'yellow': '#FFD666',
        'yellow-dark': '#FFC940',
        'gold': '#F5C842',
        
        // Badge/Icon accent colors
        'badge-blue': '#8CA4FF',
        'badge-purple': '#9B8CFF',
        'badge-orange': '#FF9E66',
        
        // Text colors
        'text-primary': '#1A1A2E',
        'text-secondary': '#2D2D44',
        'text-dark-blue': '#16213E',
        
        // UI Element colors
        'icon-pink': '#FF6B9D',
        'icon-purple': '#8B7FD6',
        'icon-cyan': '#4FD1C5',
        'icon-orange': '#FF9966',
        
        // Illustration colors
        'illustration-blue': '#3B4DE8',
        'illustration-dark-blue': '#1E2B7A',
        'illustration-skin': '#FF9E7A',
        'illustration-orange': '#FF7F50',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.2', fontWeight: '800' }],
        'heading': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        'card': '1.5rem',
        'button': '1rem',
        'badge': '0.75rem',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'float': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FFB5E8 0%, #E0BBE4 25%, #B8A4E8 50%, #A4B0F4 75%, #FFC0A8 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #FF9ED5 0%, #C4A4E0 100%)',
        'gradient-blue': 'linear-gradient(180deg, #6B8CFF 0%, #4B6CD8 100%)',
        'gradient-cyan': 'linear-gradient(180deg, #A8E8E8 0%, #80D8D8 100%)',
        'gradient-peach': 'linear-gradient(180deg, #FFD4B8 0%, #FFB894 100%)',
      },
    },
  },
  plugins: [],
}