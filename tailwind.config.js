/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vermelho
        'custom-vermelho': '#ED1846',
        'custom-vermelho-claro': '#F03A5F',
        'custom-vermelho-escuro': '#B11236',

        // Azul
        'custom-azul': '#00AAB5',
        'custom-azul-claro': ' #00D1E0',
        'custom-azul-escuro': '#0A7F8E',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out forwards',
        scaleIn: 'scaleIn 0.3s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}