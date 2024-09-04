/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vermelho
        'custom-red': '#FF0B34',
        'custom-red-light': '#FF4D6D',
        'custom-red-lighter': '#FF8A8A',
        'custom-red-dark': '#9C152C',

        // Rosa
        'custom-pink': '#AE1495',
        'custom-pink-light': '#C94FB2',
        'custom-pink-lighter': '#E084CF',

        // Azul
        'custom-blue': '#07C6D4',
        'custom-blue-light': '#47D7E0',
        'custom-blue-lighter': '#87E6EB',
        'custom-blue-dark': '#0E8F98',
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