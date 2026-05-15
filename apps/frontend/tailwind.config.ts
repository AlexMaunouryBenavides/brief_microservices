import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        brand: ['var(--font-brand)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
