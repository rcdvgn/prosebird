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
        battleground: "rgba(var(--battleground), <alpha-value>)",

        hover: "var(--hover)",
        "hover-solid": "rgba(var(--hover-solid), <alpha-value>)",
        selected: "rgba(var(--selected), <alpha-value>)",

        primary: "rgba(var(--primary), <alpha-value>)",
        secondary: "rgba(var(--secondary), <alpha-value>)",
        tertiary: "rgba(var(--tertiary), <alpha-value>)",
        inactive: "rgba(var(--inactive), <alpha-value>)",
        placeholder: "rgba(var(--placeholder), <alpha-value>)",
        danger: "var(--text-danger)",

        brand: "rgba(var(--brand), <alpha-value>)",
        border: "rgba(var(--border), <alpha-value>)",
        stroke: "rgba(var(--stroke), <alpha-value>)",

        "success-green": "rgba(var(--success-green), <alpha-value>)",
        "money-green": "rgba(var(--money-green), <alpha-value>)",
        "online-green": "rgba(var(--online-green), <alpha-value>)",
        "favorite-yellow": "rgba(var(--favorite-yellow), <alpha-value>)",
        "danger-red": "rgba(var(--danger-red), <alpha-value>)",

        "progressbar-hover": "rgba(var(--progressbar-hover), <alpha-value>)",
        "progressbar-inactive":
          "rgba(var(--progressbar-inactive), <alpha-value>)",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

export default config;
