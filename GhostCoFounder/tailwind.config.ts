import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface + text tokens are driven by CSS variables (see globals.css)
        // so a single class like `bg-void` / `text-ink` adapts to the theme.
        void: {
          DEFAULT: "rgb(var(--void) / <alpha-value>)",
          light: "rgb(var(--void-light) / <alpha-value>)",
        },
        // Accent palette stays fixed — reads well on both light and dark.
        ghost: {
          violet: "#7C5CFC",
          blue: "#4C7CFC",
          cyan: "#4CE0F8",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        // Theme-aware small accent (cyan on dark, violet on light)
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,252,0.15), 0 8px 40px -8px rgba(76,124,252,0.35)",
        "glow-lg": "0 0 60px -10px rgba(76,224,248,0.35)",
      },
      backgroundImage: {
        "ghost-mesh":
          "radial-gradient(circle at 15% 20%, rgba(124,92,252,0.25), transparent 40%), radial-gradient(circle at 85% 15%, rgba(76,124,252,0.20), transparent 45%), radial-gradient(circle at 50% 90%, rgba(76,224,248,0.12), transparent 50%)",
        "ghost-gradient": "linear-gradient(90deg,#7C5CFC,#4C7CFC,#4CE0F8)",
        "ghost-gradient-btn": "linear-gradient(90deg,#4CE0F8,#4C7CFC)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { boxShadow: "0 0 30px 6px rgba(124,92,252,0.35)" },
          "50%": { boxShadow: "0 0 55px 14px rgba(76,224,248,0.4)" },
        },
        spin_slow: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        breathe: "breathe 3.2s ease-in-out infinite",
        "spin-slow": "spin_slow 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
