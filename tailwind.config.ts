import defaultTheme from 'tailwindcss/defaultTheme'
import { colors, fontFamily } from './app/styles/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/components/**/*.{vue,ts}',
    './app/pages/**/*.vue',
    './app/layouts/**/*.vue',
    './app/styles/**/*.ts',
    './app/app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [...fontFamily.sans, ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand:   colors.brand,
        surface: colors.surface,
        accent:  colors.accent,
      },
    },
  },
  plugins: [],
}
