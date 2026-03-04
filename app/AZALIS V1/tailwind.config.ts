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
        'azalis-green': '#3D5A47',
        'azalis-green-hover': '#2F4738',
        'azalis-beige': '#F5F0E8',
        'azalis-accent': '#C7B9A3',
        'azalis-white': '#FAF9F7',
        'azalis-text': '#5F5F5F',
        'azalis-black': '#1C1C1C',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.2em',
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
