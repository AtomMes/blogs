/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {},
    screens: {
      'xs': '530px',
      'md': '700px'
    },
  },
  plugins: [],
};

