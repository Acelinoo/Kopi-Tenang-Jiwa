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
        bone: "#FDFBF7",
        latte: "#E6DFD3",
        sage: "#8F9E8B",
        charcoal: "#2C2C2C",
        stone: "#A8A39D",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        "soft-glow": "0 10px 40px -10px rgba(143, 158, 139, 0.15)",
        "elegant": "0 4px 20px -2px rgba(44, 44, 44, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
