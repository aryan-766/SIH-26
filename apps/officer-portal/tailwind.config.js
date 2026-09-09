/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#15803d',
          600: '#166534',
          700: '#14532d',
          800: '#164223',
          900: '#0d2815',
        },
        navy: {
          800: '#0f172a',
          900: '#020617',
        }
      }
    },
  },
  plugins: [],
}
