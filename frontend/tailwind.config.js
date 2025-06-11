/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      myBlue: '#1b66ff',
      myViolet: '#412a9c',
    },
    extend: {},
  },
  plugins: [],
};
