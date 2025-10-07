// @ts-check
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        neutral: { 950: "#0a0a0a", 900: "#111113", 800: "#27272a", 700: "#3f3f46", 600: "#52525b" },
      },
      borderRadius: { "2xl": "1rem" },
      boxShadow: { soft: "0 10px 25px rgba(0,0,0,.25)" },
    },
  },
  plugins: [typography],
};
