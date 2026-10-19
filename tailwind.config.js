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
        brand: {
          // Bubbly, neutral-to-slight-dark tones (soft slate, charcoal, stone, zinc)
          darkest: '#121418',       // Soft neutral charcoal instead of pitch-black navy
          dark: '#181B21',          // Warm neutral surface
          card: '#20242C',          // Soft rounded elevated neutral card
          surface: '#282D37',       // Interactive pill/bubble neutral
          border: '#333945',        // Subtle soft border
          navy: '#252B36',
          primary: '#3B82F6',       // Vibrant blue accent
          accent: '#38BDF8',        // Friendly sky blue
          emerald: '#10B981',       // Mint / teal
          amber: '#F59E0B',         // Warm amber
          rose: '#F43F5E',          // Soft rose red
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'bubble': '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'bubble-hover': '0 20px 35px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 20px -3px rgba(244, 63, 94, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(56, 189, 248, 0.35)',
      }
    },
  },
  plugins: [],
}
