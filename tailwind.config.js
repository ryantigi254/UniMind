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
          50: '#fff1f6',
          100: '#ffe4f0',
          200: '#ffc9e1',
          300: '#ff9ec9',
          400: '#ff63a8',
          500: '#ff007a', // Main pink accent
          600: '#e6006e',
          700: '#cc005f',
          800: '#a3004c',
          900: '#80003a',
        },
        background: {
          light: '#fdf6f0', // Cream background for light mode
          dark: '#1a1b2e', // Navy blue background for dark mode
        },
        sidebar: {
          light: '#ffffff',
          dark: '#1a1b2e',
        },
        content: {
          light: '#ffffff',
          dark: '#1a1b2e',
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