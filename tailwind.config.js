/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%': { transform: 'translateX(0)' },
          '10%': { transform: 'translateX(-5px)' },
          '20%': { transform: 'translateX(5px)' },
          '30%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '50%': { transform: 'translateX(-10px)' },
          '60%': { transform: 'translateX(10px)' },
          '70%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        shake_low: 'shake 1s ease-in-out',
        shake_high: 'shake 1.5s ease-in-out',
      },
    },
  },
  plugins: [],
}