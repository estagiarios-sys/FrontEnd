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
        'custom-azul-claro': ' rgba(0, 105, 115, 0.2)',
        'custom-azul-escuro': '#0A7F8E',
        'cor-footer': '#0E8F98'
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],  // Isso define Montserrat como fonte padrão para "font-sans"
      },
      fontSize: {
        'tiny': '12px', // Define uma classe customizada chamada `text-tiny`
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