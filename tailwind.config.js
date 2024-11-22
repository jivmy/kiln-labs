/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['NewYorkMedium', 'sans-serif'], // Set NewYorkMedium as the default sans-serif font
        'large': ['NewYorkExtraLarge', 'sans-serif'], // Optional: Add other variants for specific use cases
        'small': ['NewYorkSmall', 'sans-serif'], // Optional: Add NewYorkSmall for specific use cases
      },
    },
  },
  plugins: [],
};
