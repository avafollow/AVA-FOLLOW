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
        background: '#07090E',
        card: '#0D111A',
        cardBorder: 'rgba(255, 255, 255, 0.08)',
        neonRed: '#FF2E63',
        neonGold: '#F59E0B',
        neonCyan: '#06B6D4',
        neonPurple: '#8B5CF6',
        neonBlue: '#3B82F6',
        neonGreen: '#10B981',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Lexend', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Lexend', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(255, 46, 99, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'luxury-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15), transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
      }
    },
  },
  plugins: [],
}
