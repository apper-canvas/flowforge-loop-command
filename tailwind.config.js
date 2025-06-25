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
          50: '#f0f0ff',
          100: '#e6e6ff',
          200: '#ccccff',
          300: '#b3b3ff',
          400: '#8080ff',
          500: '#5B3BF6',
          600: '#4d32dd',
          700: '#3d2899',
          800: '#2d1e73',
          900: '#1e1459'
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7C3AED',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1a78'
        },
        accent: '#EC4899',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1F2937',
          900: '#111827'
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Space Grotesk', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        xs: ['0.7rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.5rem' }],
        lg: ['1.09375rem', { lineHeight: '1.75rem' }],
        xl: ['1.36719rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.70898rem', { lineHeight: '2rem' }],
        '3xl': ['2.13623rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.67029rem', { lineHeight: '2.5rem' }],
        '5xl': ['3.33786rem', { lineHeight: '1' }],
        '6xl': ['4.17233rem', { lineHeight: '1' }]
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}