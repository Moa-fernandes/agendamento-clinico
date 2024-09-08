module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffcc00',  // Amarelo para destaque
        secondary: '#ff6666', // Vermelho suave
        accent: '#6699ff',    // Azul claro
        modalBackground: '#f7f7f7',  // Background claro para o modal
      },
      boxShadow: {
        'xl': '0 10px 20px rgba(0, 0, 0, 0.12)',  // Sombra suave
      },
      borderRadius: {
        'lg': '12px',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
