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
        button: "#5e0000",
        error: "#df2e2e",
        hp: "#aa0000",
        "grayscale-200": "#dfdfdf",
        "grayscale-500": "#878787",
        "grayscale-600": "#6d6d6d",
        "grayscale-700": "#5f5f5f",
        "grayscale-900": "#3d3d3d",
        "grayscale-999": "#161616",
        "mask-background": "rgba(32, 32, 32, 0.80)",
      },
      spacing: {
        "5.4": "1.35rem",
        "26": "6.5rem",
        "68": "17rem",
        "120": "30rem",
        "156": "39rem",
        "200": "50rem",
      },
    },
  },
  plugins: [],
};
export default config;
