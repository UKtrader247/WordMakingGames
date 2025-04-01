/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'pulse-once': 'pulseOnce 1s ease-in-out',
        'progress-complete': 'progressComplete 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px) translateX(-50%)' },
          '100%': { opacity: 1, transform: 'translateY(0) translateX(-50%)' }
        },
        pulseOnce: {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.8, boxShadow: '0 0 0 5px rgba(99, 102, 241, 0.4)' },
          '100%': { opacity: 1 }
        },
        progressComplete: {
          '0%': { backgroundPosition: '0% 50%', backgroundSize: '100% 100%' },
          '100%': { backgroundPosition: '100% 50%', backgroundSize: '200% 100%' }
        }
      }
    },
  },
  plugins: [],
};
