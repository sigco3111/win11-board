/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'win11-blue': '#0078d4',
        'win11-light-blue': '#50e6ff',
        'win11-gray': '#f3f3f3',
        'win11-dark': '#202020',
        'win11-light': '#ffffff',
        'win11-border': '#e6e6e6',
        'win11-window': 'rgba(255, 255, 255, 0.7)',
        'win11-sidebar': '#fafafa',
        'win11-accent': '#0078d4',
        'win11-taskbar': 'rgba(243, 243, 243, 0.85)',
        'win11-start': 'rgba(243, 243, 243, 0.9)',
      },
      fontFamily: {
        'win11': ['Segoe UI', 'Segoe UI Variable', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'win11-window': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'win11-taskbar': '0 -2px 10px rgba(0, 0, 0, 0.05)',
        'win11-card': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'win11-button': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'win11-dropdown': '0 4px 15px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'win11': '30px',
      },
      borderRadius: {
        'win11': '8px',
        'win11-lg': '12px',
        'win11-xl': '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 