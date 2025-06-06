/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
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
        "blue": {
          910: "rgb(22, 48, 92)",
          920: "rgb(26, 49, 84)",
        },
        "orange": {
          310: "rgb(255, 156, 81)",
        },
      },
      textColor: {
        "subtitle": "#505050",
        "current": "#282828",
        "light": "#F6FCFF",
      },
      backgroundColor: {
        "container": "#F2F2F2",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "12px",
      },
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
