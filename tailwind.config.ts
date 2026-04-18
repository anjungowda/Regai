import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2557',
          50: '#E8EDF8',
          100: '#C5D0EE',
          600: '#1B3A7A',
          700: '#0F2557',
          800: '#0A1A3D',
          900: '#060F24',
        },
        'compliance-blue': {
          DEFAULT: '#1B4FD8',
          50: '#EEF3FD',
          100: '#D4E1FA',
          400: '#5B8AE8',
          500: '#1B4FD8',
          600: '#1540B0',
          700: '#0F3088',
        },
        teal: {
          DEFAULT: '#0EA5E9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
