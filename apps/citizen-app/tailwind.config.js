/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rural: {
          50: '#f4fbf5',
          100: '#e6f7e9',
          500: '#1b8036',
          600: '#156a2c',
          700: '#105222',
          900: '#0a3516',
        },
        saffron: {
          50: '#fffaf0',
          500: '#f97316',
          600: '#ea580c',
        }
      }
    },
  },
  plugins: [],
}
