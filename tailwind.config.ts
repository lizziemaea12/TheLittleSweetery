import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f8f3ec",
        lavender: "#b57cd4",
        oliveGray: "#93a26d",
        caramel: "#b8793f",
        chocolate: "#5f3b2f",
        accentPink: "#f7a9d3",
        accentTeal: "#72c8c0",
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "dot-texture":
          "radial-gradient(circle at 1px 1px, rgba(147,162,109,0.25) 1px, transparent 0)",
      },
      backgroundSize: {
        dots: "12px 12px",
      },
    },
  },
  plugins: [],
};

export default config;
