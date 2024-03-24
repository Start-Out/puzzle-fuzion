/** @type {import('tailwindcss').Config} */
//"dev": "concurrently \"vite --host\" \"convex dev\""
export default {
  content: [
    "./src/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add custom keyframes for animations
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(360deg)' },
          '50%': { transform: 'rotate(180deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.1)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-30%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        slowSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      // Define the animation utility
      animation: {
        wiggle: 'wiggle 5s ease-in-out infinite',
        slowSpin: 'slowSpin 3s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        "pf-navbar": "#1F2937",
        "pf-dark-background": "#1A202C",
        "pf-light-background": "#F7FAFC",
        "pf-dark-text": "#2D3748",
        "pf-light-text": "#E2E8F0",
        "pf-dark-button": "#2B6CB0",
        "pf-light-button": "#68D391",
        "pf-keyboard-background" : "rgb(129,131,132)",
        "pf-absent": "#A0AEC0",
        "pf-present": "#ED8936",
        "pf-correct": "#38A169",
        "pf-connection-select": "#EFEFE6",
        "pf-setting": "rgba(164,66,66,0.80)",
        "pf-setting-h": "rgba(164,66,66,0.90)",
      }
    },
  },
  plugins: [],
}

