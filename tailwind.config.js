/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep midnight navy scale
        navy: {
          950: '#050811', // Deepest background / canvas
          900: '#090e1a', // Base dashboard backdrop
          850: '#0d1525', // Layer 1 panel surface
          800: '#121d33', // Layer 2 elevated surface
          750: '#172540', // Hover / selected state
          700: '#1f3152', // Low-contrast borders & dividers
          600: '#2b426d', // Interactive borders & subtle outlines
          500: '#3e5b92',
          400: '#6281be',
        },
        // Electric Cyan (Primary Accent)
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00f0ff', // Primary electric cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#082f49',
        },
        // Aviation Blue (Secondary Accent)
        aviation: {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a5f',
          900: '#172554',
          950: '#0b162c',
        },
        // Restrained Amber (Warning)
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          900: '#78350f',
          950: '#451a03',
        },
        // Tactical Crimson (Critical / Emergency / Incident)
        crimson: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Nominal / Telemetry Green
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          950: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.9rem', letterSpacing: '0.04em' }],
        'tactical': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.45), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'panel-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 240, 255, 0.08)',
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.25)',
        'glow-cyan-sm': '0 0 10px -2px rgba(0, 240, 255, 0.2)',
        'glow-amber': '0 0 16px -2px rgba(245, 158, 11, 0.2)',
        'glow-crimson': '0 0 16px -2px rgba(239, 68, 68, 0.2)',
      },
      borderRadius: {
        'panel': '8px',
        'subtle': '5px',
      },
      borderWidth: {
        'subtle': '1px',
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
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
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
};
