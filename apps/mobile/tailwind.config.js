/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f6ff",
          100: "#e9edff",
          500: "#4f46e5",
          600: "#4338ca",
          950: "#1e1b4b",
        },
      },
    },
  },
  plugins: [],
};
