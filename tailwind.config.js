/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Editorial Light-First Palette
        sand: {
          25: '#FAF9F6',  // Crisp paper card surface
          50: '#F3F1EB',  // Primary light background
          100: '#E7E5DE', // Muted surface
          200: '#D6D3C9', // Subtle divider / hover
          300: '#C0BCB0',
        },
        obsidian: {
          950: '#17191B', // Primary dark background & primary light-mode text
          900: '#1C1F22',
          850: '#222529', // Secondary dark surface
          800: '#2B2F34',
          700: '#3D4248',
        },
        stone: {
          400: '#9A9B95',
          500: '#747570', // Secondary text
          600: '#5A5B56',
          700: '#42433F',
        },
        lime: {
          300: '#D9F68A',
          400: '#C8F169', // Primary electric-lime accent
          500: '#A6D94A', // Dark accent
          600: '#85B832',
          950: '#1C260B',
        },
        // Restrained Semantic Colors
        amber: {
          100: '#FEF3C7',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        crimson: {
          100: '#FEE2E2',
          400: '#F87171',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        emerald: {
          100: '#DCFCE7',
          400: '#34D399',
          500: '#16A34A',
          600: '#15803D',
          700: '#166534',
          950: '#052E16',
        },
        // Transitional neutral aliases for unmigrated modules (removed progressively in Phases C-F)
        navy: {
          950: '#17191B',
          900: '#1C1F22',
          850: '#222529',
          800: '#2B2F34',
          750: '#34393F',
          700: '#3D4248',
          600: '#5A5B56',
          500: '#747570',
          400: '#9A9B95',
        },
        cyan: {
          300: '#D9F68A',
          400: '#C8F169',
          500: '#A6D94A',
          600: '#85B832',
          700: '#658F22',
          800: '#496818',
          900: '#2F4310',
          950: '#1C260B',
        },
        aviation: {
          300: '#9A9B95',
          400: '#747570',
          500: '#5A5B56',
          600: '#42433F',
          700: '#2B2F34',
          800: '#222529',
          900: '#1C1F22',
          950: '#17191B',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.95rem', letterSpacing: '0.04em' }],
        'tactical': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      },
      boxShadow: {
        'editorial': '0 1px 2px rgba(23, 25, 27, 0.04), 0 4px 16px -4px rgba(23, 25, 27, 0.06)',
        'editorial-hover': '0 12px 32px -8px rgba(23, 25, 27, 0.12), 0 2px 6px -1px rgba(23, 25, 27, 0.06)',
        'editorial-dark': '0 16px 40px -10px rgba(0, 0, 0, 0.45)',
        'lime-glow': '0 0 0 1px rgba(166, 217, 74, 0.4), 0 8px 20px -6px rgba(200, 241, 105, 0.35)',
        'panel': '0 1px 3px rgba(23, 25, 27, 0.05), 0 6px 20px -4px rgba(23, 25, 27, 0.07)',
        'panel-hover': '0 12px 28px -6px rgba(23, 25, 27, 0.12)',
        'glow-cyan': '0 0 0 1px rgba(200, 241, 105, 0.45)',
        'glow-cyan-sm': '0 2px 10px -2px rgba(200, 241, 105, 0.25)',
        'glow-amber': '0 2px 12px -2px rgba(217, 119, 6, 0.18)',
        'glow-crimson': '0 2px 12px -2px rgba(220, 38, 38, 0.18)',
      },
      borderRadius: {
        'card': '14px',
        'panel': '10px',
        'subtle': '6px',
      },
      borderWidth: {
        'subtle': '1px',
      },
      animation: {
        'radar-sweep': 'radarSweep 6s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
    },
  },
  plugins: [],
};
