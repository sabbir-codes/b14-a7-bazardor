import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bn: ['"Hind Siliguri"', '"Noto Sans Bengali"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#1d271f",
        brand: { DEFAULT: "#1a9951", dark: "#05893e", soft: "#f3fbf4" },
        danger: "#d03739",
        surface: "#fafcfa",
        line: "#e1e8e1",
        canvas: "#f0f5f0",
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 45s linear infinite" },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        bazar: {
          primary: "#1a9951",
          "primary-content": "#ffffff",
          secondary: "#05893e",
          accent: "#d03739",
          neutral: "#1d271f",
          "base-100": "#ffffff",
          "base-200": "#f0f5f0",
          "base-300": "#e1e8e1",
          "base-content": "#1d271f",
          success: "#1a9951",
          error: "#d03739",
        },
      },
    ],
  },
};
export default config;
