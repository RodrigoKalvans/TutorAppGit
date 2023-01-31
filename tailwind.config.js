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
        '3/5': "60%",
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
