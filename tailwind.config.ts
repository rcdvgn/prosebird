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
        background: {
          primary: "#0C0C0C",
        },
        text: {
          primary: "#ffffff",
          secondary: "#A9AEBC",
          danger: "#b51b1d",
        },
        foreground: {
          primary: "#141414",
          secondary: "#17111D",
          hover: "#19151E",
        },
        stroke: "#251D30",
        brand: "#1044EE",
        border: "#292929",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

export default config;
