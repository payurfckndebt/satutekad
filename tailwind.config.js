/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#101A33',
          soft: '#2A3655',
        },
        paper: '#FAFAF8',
        tekad: {
          gold: '#E8A33D',
          goldDark: '#C7842A',
        },
        ok: '#2F9E64',
        bad: '#E15554',
      },
      boxShadow: {
        card: '0 2px 0 0 rgba(16,26,51,0.08)',
        press: '0 4px 0 0 #C7842A',
      },
    },
  },
  plugins: [],
}
