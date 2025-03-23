/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,

  content: ["./src/**/*.{html,ts,scss}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f6f6f6", // Primary color
          light: "#F9F6EE", // Lighter shade
          dark: "#1B1B1B", // Darker shade
        },
        localeColors: {
          DEFAULT: "#9333EA",
          darkteal: "#1c959d",
          lightteal: "#47c2ca",
          cyan: "#40bfc8",
          lightestteal: "#1beaf7",
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
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out forwards",
        fadeOut: "fadeOut 0.3s ease-in-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        fadeOut: {
          "0%": { opacity: 1, transform: "scale(1)" },
          "100%": { opacity: 0, transform: "scale(0.95)" },
        },
      },
    },

    plugins: [require("flowbite/plugin")],
  },
};
