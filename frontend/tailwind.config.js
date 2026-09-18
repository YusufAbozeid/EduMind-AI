/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        flame: {
          50: '#FFF4F0',
          100: '#FFE5DD',
          200: '#FFCAB9',
          300: '#FF9E85',
          400: '#FF7355',
          500: '#FF4D2D', // Primary Shaghoof Flame Logo Color (#FF4D2D / #F04E28)
          600: '#E03E1C',
          700: '#B82B0E',
          800: '#94230B',
          900: '#7A200C',
        },
        background: {
          dark: '#0B101D',
          light: '#F8FAFC'
        },
        card: {
          dark: '#161C2C',
          light: '#FFFFFF'
        },
        accent: {
          purple: '#FF4D2D',
          indigo: '#E03E1C',
          cyan: '#0284C7',
          teal: '#0D9488',
          amber: '#FF7355',
          rose: '#E11D48'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'sans-serif'],
        opendyslexic: ['OpenDyslexic', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}

