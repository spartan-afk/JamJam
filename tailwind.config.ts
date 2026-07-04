import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './frontend/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'jam-black':   '#0A0A0B',
        'jam-surface': '#151517',
        'jam-raised':  '#1E1E21',
        'jam-border':  '#2A2A2E',
        'jam-muted':   '#8B8B92',
        'jam-text':    '#F2F2F3',
        'jam-violet':  '#8B5CF6',
        'jam-red':     '#FF4D5E',
        'jam-success': '#3DDC84',
        'jam-warn':    '#F5A623',
        'jam-info':    '#5B9DFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 24px rgba(139, 92, 246, 0.15)',
        'glow-violet-md': '0 0 40px rgba(139, 92, 246, 0.20)',
        'glow-red':    '0 0 12px rgba(255, 77,  94,  0.20)',
        'glow-art':    '0 0 80px rgba(139, 92, 246, 0.25)',
      },
      borderColor: {
        DEFAULT: '#2A2A2E',
      },
      animation: {
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        'fade-in':    'fade-in 0.25s ease-out',
        'slide-up':   'slide-up 0.28s ease-out',
        'slide-in-right': 'slide-in-right 0.28s ease-out',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':       { opacity: '0.35', transform: 'scale(0.8)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(10px)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'jam': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};

export default config;
