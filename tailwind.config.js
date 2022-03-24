module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: 'Outfit',
      },
      colors: {
        'soft-blue': 'hsl(215, 51%, 70%)',
        'hard-cyan': 'hsl(178, 100%, 50%)',
        'blue-darkest': 'hsl(217, 54%, 11%)',
        'blue-darker': 'hsl(216, 50%, 16%)',
        'blue-dark': 'hsl(215, 32%, 27%)',
        'hard-white': 'hsl(0, 0%, 100%)',
      },
    },
  },
  plugins: [],
}
