import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        brand: "0 0 6px 1px rgba(50, 94, 241, 0.1)",
      },
      colors: {
        background: "rgba(var(--background), <alpha-value>)",
        middleground: "rgba(var(--middleground), <alpha-value>)",
        foreground: "rgba(var(--foreground), <alpha-value>)",

        hover: "rgba(var(--hover), <alpha-value>)",
        selected: "rgba(var(--selected), <alpha-value>)",

        primary: "var(--primary)",
        secondary: "rgba(var(--secondary), <alpha-value>)",
        tertiary: "rgba(var(--tertiary), <alpha-value>)",
        inactive: "rgba(var(--inactive), <alpha-value>)",
        placeholder: "rgba(var(--placeholder), <alpha-value>)",
        danger: "var(--text-danger)",

        stroke: "var(--stroke)",
        brand: "rgba(var(--brand), <alpha-value>)",
        border: "rgba(var(--border), <alpha-value>)",

        "success-green": "rgba(var(--success-green), <alpha-value>)",
        "money-green": "rgba(var(--money-green), <alpha-value>)",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

export default config;
