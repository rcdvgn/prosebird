import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background), <alpha-value>)",
        middleground: "rgba(var(--middleground), <alpha-value>)",
        foreground: "rgba(var(--foreground), <alpha-value>)",
        hover: "rgba(var(--hover), <alpha-value>)",

        primary: "var(--primary)",
        secondary: "rgba(var(--secondary), <alpha-value>)",
        inactive: "rgba(var(--inactive), <alpha-value>)",
        placeholder: "rgba(var(--placeholder), <alpha-value>)",
        danger: "var(--text-danger)",

        stroke: "var(--stroke)",
        brand: "rgba(var(--brand), <alpha-value>)",
        border: "rgba(var(--border), <alpha-value>)",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

export default config;
