/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        dashboard: {
          bg: "#0a0e1a",
          card: "#111827",
          border: "#1e293b",
          "border-glow": "#00b4d8",
          critical: "#ff4d6d",
          warning: "#f9a826",
          info: "#00b4d8",
          success: "#52b788",
          text: "#e2e8f0",
          "text-muted": "#94a3b8",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};