/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#050508',
        surface:   '#0c0c14',
        surface2:  '#11111c',
        surface3:  '#161625',
        border:    '#1a1a2e',
        border2:   '#242438',
        primary:   '#6366f1',
        secondary: '#8b5cf6',
        accent:    '#06b6d4',
        muted:     '#94a3b8',
        faint:     '#3f3f5a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'scroll-x':    'scrollX 40s linear infinite',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2.5s ease-in-out infinite',
        'fade-in':     'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        scrollX: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        glass:   '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        glow:    '0 0 20px rgba(99,102,241,0.3)',
        'glow-cyan':   '0 0 20px rgba(6,182,212,0.3)',
        'glow-violet': '0 0 20px rgba(139,92,246,0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
