/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#6abf45",
          dark: "#3d7a1e",
          bright: "#7ed348",
        },
        dark: {
          DEFAULT: "#080c07",
          lighter: "#0e130c",
          lightest: "#141a12",
        },
      },
      fontFamily: {
        sans: ['Barlow', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.25em',
        ultra: '.4em',
      },
    },
  },
  plugins: [],
};
