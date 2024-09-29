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
          primary: "#130e1b",
          secondary: "#1b1226",
        },
        text: {
          primary: "#ffffff",
          secondary: "#746B80",
          danger: "#b51b1d",
        },
        foreground: {
          primary: "#241834",
          secondary: "#392b4d",
        },
        stroke: "#251D30",
        brand: "#842bff",
        border: "rgb(255, 255, 255)",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
export default config;
