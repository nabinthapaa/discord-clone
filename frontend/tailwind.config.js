/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.{html,js,ts}"],
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#202225",
          800: "#2f3136",
          700: "#36393f",
          600: "#4f545c",
          400: "#d4d7dc",
          300: "#e3e5e8",
          200: "#ebedef",
          100: "#f2f3f5",
        },
        highlight: {
          300: "#4e5ad7",
          400: "#5865f2",
        },
        secondary: {
          300: "#313338",
        },
      },
    },
  },
  plugins: [],
};
