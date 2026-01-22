/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // This will disable dark mode since most devices default to light mode
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './utils/**/*.{js,jsx,ts,tsx,mdx}',
    './*.{js,jsx,ts,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,mdx}',
    './src/screens/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // ---- Brand Colors ----
        primary: {
          DEFAULT: '#FD2828', // base
          50: '#ffe5e5',
          100: '#ffb8b8',
          200: '#ff8a8a',
          300: '#ff5c5c',
          400: '#ff2e2e',
          500: '#FD2828',
          600: '#e62020',
          700: '#b81919',
          800: '#8a1313',
          900: '#5c0c0c',
          950: '#2e0606',
        },
        secondary: {
          DEFAULT: '#000000',
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#000000',
          950: '#000000',
        },
        tertiary: {
          DEFAULT: '#FA57A7',
          50: '#fff0f7',
          100: '#ffd6ea',
          200: '#ffadd4',
          300: '#ff85bf',
          400: '#ff5ca9',
          500: '#FA57A7',
          600: '#e04591',
          700: '#b53773',
          800: '#892954',
          900: '#5c1b36',
          950: '#2e0e1b',
        },
        info: {
          DEFAULT: '#4A9BF3',
          50: '#ebf5ff',
          100: '#d6ebff',
          200: '#add7ff',
          300: '#85c3ff',
          400: '#5caeff',
          500: '#4A9BF3',
          600: '#2b7fe0',
          700: '#2164b3',
          800: '#174986',
          900: '#0c2d59',
          950: '#06162d',
        },
        success: {
          DEFAULT: '#0AD46F',
          50: '#e6fdf2',
          100: '#b9fadb',
          200: '#8cf7c4',
          300: '#5ff3ad',
          400: '#33f096',
          500: '#0AD46F',
          600: '#08a85a',
          700: '#067d44',
          800: '#04512f',
          900: '#022619',
          950: '#01130d',
        },
        warning: require('tailwindcss/colors').yellow,
        error: require('tailwindcss/colors').red,

        // ---- Backgrounds ----
        background: {
          DEFAULT: '#F1F1F3',
          50: '#ffffff',
          100: '#f1f1f3',
          200: '#e5e5e8',
          dark: '#181719',
        },

        // ---- Outline ----
        outline: {
          DEFAULT: '#EDF1F3',
          100: '#EDF1F3',
          input: "#EDF1F3"
        },

        // ---- Text / Typography ----
        typography: {
          DEFAULT: '#6C7278',
          bold: '#000000',
          semibold: 'rgba(0,0,0,0.75)',
          medium: 'rgba(0,0,0,0.5)',
          title: '#1A1C1E',
          subtle: '#6C7278',
          neutral: '#C8D1E1',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        extrablack: '950',
        title: '700',
      },
      fontSize: {
        '2xs': '10px',
        '3xs': '12px',
        '10px': ["10px", "100%"],
        '12px': ["12px", "100%"],
        '14px': ["14px", "140%"],
        title: ["32px", "130%"],
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
};
