/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E40AF", // Primary color
          light: "#F9F6EE", // Lighter shade
          dark: "#373a3b", // Darker shade
        },
        localeColors: {
          DEFAULT: "#9333EA",
          darkteal: "#1c959d",
          lightteal: "#47c2ca",
          cyan: "#40bfc8",
          red: "#E22128",
        },
        accentCyan: "#b3f8fc", // Accent color
        danger: "#EF4444", // Danger (error) color
        success: "#10B981", // Success color
      },
      fontFamily: {
        WinkySans: ["winky Sans", "sans-serif"],
        Monteserrat: ["Montserrat", "sans-serif"],
      },
    },
  },

  plugins: [require("flowbite/plugin")],
};
