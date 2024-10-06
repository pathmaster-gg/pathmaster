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
        highlight: "#f5c35f",
        disabled: "#666666",
        error: "#df2e2e",
        "grayscale-500": "#878787",
        "grayscale-900": "#3d3d3d",
      },
      width: {
        "68": "17rem",
        "156": "39rem",
      },
    },
  },
  plugins: [],
};
export default config;
