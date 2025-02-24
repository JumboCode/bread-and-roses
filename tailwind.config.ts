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
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkrose: "#9A0F28",
        rose: "#FFF0F1",
        "gray/500": "#667085",
        "icon-color": "#667085",
      },
    },
    fontFamily: {
      sofiaPro: ["var(--Sofia Pro)", "sans-serif"],
    },
  },
  plugins: [],
};
export default config;
