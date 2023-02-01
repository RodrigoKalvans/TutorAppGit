/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: {
        'landing': "url('../public/images/landing-background-image.jpg')",
      },
      width: {
        '9/10': "90%",
        '3/5': "60%",
        '9/20': "45%",
        '1/3': "33%",
      },
      borderRadius: {
        '4xl': "2rem",
      },
      colors: {

      }
    },
    
  },
  plugins: [],
}
