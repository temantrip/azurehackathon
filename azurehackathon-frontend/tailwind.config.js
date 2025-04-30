/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkgreen: "#234B42",
        lightgreen: "#66FF25",
      },
    },
  },
  plugins: [],
};
