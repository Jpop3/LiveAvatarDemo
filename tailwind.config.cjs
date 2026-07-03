/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cochlear brand-ish accent; adjust to exact brand hex when known
        cochlear: {
          DEFAULT: "#1a1a2e",
          accent: "#e8a33d",
        },
      },
    },
  },
  plugins: [],
};
