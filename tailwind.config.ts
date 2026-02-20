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
        // Palette AZALIS Premium - Profondeur améliorée
        'azalis-green': '#4F6758',
        'azalis-green-hover': '#3E5246',
        'azalis-beige': '#F3EFE8',
        'azalis-accent': '#C7B9A3',
        'azalis-white': '#FAF9F7',
        'azalis-text': '#5F5F5F',
        'azalis-black': '#1C1C1C',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
