/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--c-paper) / <alpha-value>)',
          raised: 'rgb(var(--c-paper-raised) / <alpha-value>)',
        },
        tekad: {
          red: '#D6293D',
          redDark: '#A81F2E',
          redSoft: 'rgb(var(--c-red-soft) / <alpha-value>)',
        },
        ok: '#1C8A4B',
        okSoft: 'rgb(var(--c-ok-soft) / <alpha-value>)',
        bad: '#E5495F',
        badSoft: 'rgb(var(--c-bad-soft) / <alpha-value>)',
        gold: '#B8860B',
        goldSoft: 'rgb(var(--c-gold-soft) / <alpha-value>)',
        // Fixed (non-themed) dark chip background — unlike `ink` (which is a
        // themed text color that INVERTS to near-white in dark mode), this
        // stays the same dark maroon-black in both themes. Use it for solid
        // dark badges/chips paired with text-white; never use `bg-ink` for
        // that purpose or the text becomes invisible in dark mode.
        inkSolid: '#26141A',
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
