// tailwind.config.js
import typography from '@tailwindcss/typography'; // Will be installed in next step

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Important: This tells Tailwind where to find your React components to scan for classes
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography, // Add the typography plugin here
  ],
}