// @ts-check
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        // Palette Panda - Noirs doux et chaleureux
        panda: {
          950: "#0f0f0f",
          900: "#171717",
          800: "#1f1f1f",
          700: "#2a2a2a",
          600: "#404040",
          500: "#525252",
          400: "#737373",
          300: "#a3a3a3",
          200: "#d4d4d4",
          100: "#f5f5f5",
          50: "#fafafa",
        },
        // Palette Bambou - Verts naturels et apaisants
        bamboo: {
          950: "#052e16",
          900: "#14532d",
          800: "#166534",
          700: "#15803d",
          600: "#16a34a",
          500: "#22c55e",
          400: "#4ade80",
          300: "#86efac",
          200: "#bbf7d0",
          100: "#dcfce7",
          50: "#f0fdf4",
        },
      },
      borderRadius: { "2xl": "1rem" },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,.15)",
        glow: "0 0 20px rgba(34, 197, 94, 0.15)",
      },
    },
  },
  plugins: [typography],
};
