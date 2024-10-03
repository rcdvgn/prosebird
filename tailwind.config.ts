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
          secondary: "#1b1226",
        },
        text: {
          primary: "#ffffff",
          secondary: "#746B80",
          danger: "#b51b1d",
        },
        foreground: {
          primary: "#1F152D",
          secondary: "#181221",
        },
        stroke: "#251D30",
        brand: "#6508E7",
        border: "rgb(255, 255, 255)",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
export default config;
