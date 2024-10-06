import type { Config } from 'tailwindcss'

module.exports = {
  darkMode: 'class',
  content: [
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      colors: {
        brand: {
          50: "#E0F0FF",
          100: "#B6DDF4",
          200: "#92C7E6",
          300: "#72B8DF",
          400: "#50A6D6",
          500: "#2C90C8",
          600: "#2A81B3",
          700: "#23729E",
          800: "#1E6389",
          900: "#154560",
          950: "#063752",
          DEFAULT: "#2A81B3"
        },
        seabrand: {
          50: "#edf8f9",
          100: "#cfedef",
          200: "#b3e1e5",
          300: "#A3DCE1",
          400: "#94D6DD",
          500: "#77CBD2",
          600: "#59BFC8",
          700: "#3EB2BC",
          800: "#34969E",
          900: "#2B7A81",
          950: "#145C62",
          DEFAULT: "#59BFC8",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
          DEFAULT: "#525252",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
          DEFAULT: "#475569",
        }
      }
    },
  },
  plugins: [],
};

// const config: Config = {
//   darkMode: 'class',
//   content: [
//     "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
//     './src/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   plugins: [

//   ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           50: "#ecfeff",
//           100: "#cffafe",
//           200: "#a5f3fc",
//           300: "#67e8f9",
//           400: "#22d3ee",
//           500: "#06b6d4",
//           600: "#0891b2",
//           700: "#0e7490",
//           800: "#155e75",
//           900: "#164e63",
//           950: "#083344",
//           DEFAULT: "#0891b2"
//         },
//         seabrand: {
//           50: "#ecfeff",
//           100: "#cffafe",
//           200: "#a5f3fc",
//           300: "#67e8f9",
//           400: "#22d3ee",
//           500: "#06b6d4",
//           600: "#0891b2",
//           700: "#0e7490",
//           800: "#155e75",
//           900: "#164e63",
//           950: "#083344",
//           DEFAULT: "#0891b2",
//         },
//         neutral: {
//           50: "#fafafa",
//           100: "#f5f5f5",
//           200: "#e5e5e5",
//           300: "#d4d4d4",
//           400: "#a3a3a3",
//           500: "#737373",
//           600: "#525252",
//           700: "#404040",
//           800: "#262626",
//           900: "#171717",
//           950: "#0a0a0a",
//           DEFAULT: "#525252",
//         }
//       }
//     }

//   }
// }
// export default config
