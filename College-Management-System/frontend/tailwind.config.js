/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        lavishlyYours: ['"Lavishly Yours"', "cursive"],
        greatVibes: ['"Great Vibes"', "cursive"]
      }
    },
  },
  plugins: [],
};
