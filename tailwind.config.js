/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-50%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'gradient-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        "pulse-line": {
          "0%":   { "stroke-dasharray": "0 150", opacity: "0.3" },
          "50%":  { "stroke-dasharray": "75 75", opacity: "1"   },
          "100%": { "stroke-dasharray": "0 150", opacity: "0.3" },
        },
      },
      animation: {
        'slide-in': 'slide-in 1s ease-out forwards',
        'gradient-move': 'gradient-move 3s ease infinite',
        "pulse-line": "pulse-line 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

