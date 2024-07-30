import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'msem-div-blue': '#1570c0',
        'msem-div-grey':'#f5f5f5',
        'msem-light-hover':'#eff6ff',
        'msem-light':'#f7f9fc',
        'msem-button': '#0064C6',
        'msem-button-hover': '#083170'
      },
    },
  },
  plugins: [],
};
export default config;
