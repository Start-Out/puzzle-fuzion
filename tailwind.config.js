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
      colors: {
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
        "pf-connection-select": "#EFEFE6"
      }
    },
  },
  plugins: [],
}

