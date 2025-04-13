import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF007A',
          50: '#FFF0F7',
          100: '#FFE1EF',
          200: '#FFC3DF',
          300: '#FFA6CF',
          400: '#FF88BF',
          500: '#FF007A',
          600: '#CC0062',
          700: '#99004A',
          800: '#660031',
          900: '#330019'
        },
        secondary: {
          DEFAULT: '#4FD1C5',
          50: '#F0FBFA',
          100: '#E1F7F5',
          200: '#C3EFEB',
          300: '#A6E7E1',
          400: '#88DFD7',
          500: '#4FD1C5',
          600: '#3FA79E',
          700: '#2F7D76',
          800: '#20534F',
          900: '#102A27'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            danger: {
              DEFAULT: "#f31260",
            },
          },
        },
      },
    }),
  ],
};