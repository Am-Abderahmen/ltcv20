import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: { accent: "#10B65A", dark: "#0a9248", light: "#d1fae5" },
        blue: { accent: "#1B4ED8" },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'Outfit'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
