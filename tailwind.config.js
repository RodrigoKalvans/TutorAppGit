/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      backgroundImage: {
        'landing': "url('../public/landing-background-image.jpg')",
      },
    },
  },
  plugins: [],
}
