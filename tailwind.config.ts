import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBFAF7",
        ink: "#1C2B33",
        pine: "#2E6B5E",
        "pine-dark": "#234F45",
        rust: "#C7563A",
        "rust-dark": "#A8442E",
        card: "#EFEBE0",
        sage: "#8A9A93",
        line: "#D9D3C3",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "tear-edge":
          "repeating-linear-gradient(90deg, transparent, transparent 6px, #D9D3C3 6px, #D9D3C3 8px)",
      },
    },
  },
  plugins: [],
};
export default config;
