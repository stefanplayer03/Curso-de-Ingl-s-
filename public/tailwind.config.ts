import type { Config } from "tailwindcss";

// Design tokens do English AI Master.
// Paleta "conversa ao entardecer": base clara esverdeada, teal de marca,
// âmbar como acento de energia/voz. Ver README para o racional de design.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F4F6F5",
          dark: "#101917",
        },
        ink: {
          DEFAULT: "#1C2521",
          soft: "#4A5A55",
          dark: "#E7EEEC",
        },
        brand: {
          50: "#EAF3F1",
          100: "#CFE4E0",
          300: "#7FB3AB",
          500: "#1B4B4A",
          700: "#16302E",
          900: "#0C1E1D",
        },
        amber: {
          300: "#F2C170",
          500: "#E8A33D",
          700: "#B87A22",
        },
        success: "#4C9A6A",
        danger: "#C1543F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(16, 25, 23, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
