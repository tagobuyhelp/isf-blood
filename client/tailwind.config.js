/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        sans: ["Inter", "Open Sans", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#E53935",
          dark: "#C62828",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#333333",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#F5F5F5",
          white: "#FFFFFF",
        },
        text: {
          primary: "#333333",
          white: "#FFFFFF",
        },
      },
      borderRadius: {
        'isf': '12px',
        'isf-lg': '16px',
      },
      boxShadow: {
        'isf': '0 2px 10px rgba(0,0,0,0.05)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};
