/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      backgroundImage: {
        "landing": "url('../public/images/landing-background-image.jpg')",
      },
      width: {
        "9/10": "90%",
        "3/5": "60%",
        "9/20": "45%",
        "1/3": "33%",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        "light": "#F7F7F7",
      },
      textColor: {
        "subtitle": "#505050",
        "current": "#282828",
      },
      backgroundColor: {
        "container": "#F2F2F2",
      },
    },
    container: {
      center: true,
    },

  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "light",
  },
};
