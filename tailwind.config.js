/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        rose: {
          deep: "#8b3a4f",
          DEFAULT: "#c45c7a",
          soft: "#f7d0db",
        },
      },
      fontFamily: {
        display: ["Parisienne", "cursive"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
