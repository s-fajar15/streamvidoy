import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        border: "var(--hairline)",
        input: "var(--hairline)",
        ring: "var(--brand-green)",
        background: "var(--canvas)",
        foreground: "var(--ink)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--on-primary)",
        },
        brand: {
          green: "var(--brand-green)",
          "green-deep": "var(--brand-green-deep)",
          "green-soft": "var(--brand-green-soft)",
          tag: "var(--brand-tag)",
          warn: "var(--brand-warn)",
          error: "var(--brand-error)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          soft: "var(--surface-soft)",
          code: "var(--surface-code)",
        },
        hairline: {
          DEFAULT: "var(--hairline)",
          soft: "var(--hairline-soft)",
          dark: "var(--hairline-dark)",
        },
        steel: "var(--steel)",
        slate: "var(--slate)",
        charcoal: "var(--charcoal)",
      },
      fontFamily: {
        sans: ["var(--font-figma-sans)", ...fontFamily.sans],
        mono: ["var(--font-figma-mono)", ...fontFamily.mono],
        display: ["var(--font-display)", ...fontFamily.sans],
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        xxl: "32px",
        xxxl: "40px",
        "section-sm": "48px",
        section: "64px",
        "section-lg": "96px",
        hero: "120px",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "24px",
        full: "9999px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
