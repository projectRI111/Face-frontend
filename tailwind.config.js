/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Specify paths to all your components
  ],
  theme: {
    extend: {
      animation: {
        spin: "spin 1s linear infinite", // Ensures the spinning animation works
      },
},
  },
  plugins: [],
};
