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
          DEFAULT: '#26141A',
          soft: '#7A5A61',
        },
        paper: '#FFFFFF',
        tekad: {
          red: '#D6293D',
          redDark: '#A81F2E',
          redSoft: '#FDEEF0',
        },
        ok: '#1C8A4B',
        okSoft: '#E8F6EE',
        bad: '#C81E37',
        badSoft: '#FBE7E9',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(38,20,26,0.06)',
        press: '0 4px 0 0 #A81F2E',
        soft: '0 8px 24px -8px rgba(214,41,61,0.18)',
      },
      minHeight: {
        screen: '100dvh',
      },
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
}
