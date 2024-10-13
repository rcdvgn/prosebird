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
          primary: "#0C090F",
        },
        text: {
          primary: "#ffffff",
          secondary: "#B1A9BC",
          danger: "#b51b1d",
        },
        foreground: {
          primary: "#17111F",
          secondary: "#17111D",
          hover: "#19151E",
        },
        stroke: "#251D30",
        brand: "#6508E7",
        border: "#251A30",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

export default config;
