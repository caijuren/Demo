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
          bg: "var(--color-bg)",
          card: "var(--color-card)",
          modal: "var(--color-modal)",
          border: "var(--color-border)",
          "border-glow": "#00b4d8",
          critical: "#ff4d6d",
          warning: "#f9a826",
          info: "#00b4d8",
          success: "#52b788",
          text: "var(--color-text)",
          "text-muted": "var(--color-text-muted)",
          "text-dim": "var(--color-text-dim)",
          hover: "var(--color-hover)",
          "hover-light": "var(--color-hover-light)",
          overlay: "var(--color-overlay)",
          "tag-bg": "var(--color-tag-bg)",
          "thinking-bar": "var(--color-thinking-bar)",
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