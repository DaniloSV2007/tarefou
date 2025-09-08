/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6750A4",
        onPrimary: "#FFFFFF",
        primaryContainer: "#EADDFF",
        onPrimaryContainer: "#21005D",
        secondary: "#625B71",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#E8DEF8",
        onSecondaryContainer: "#1D192B",
        tertiary: "#7D5260",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#FFD8E4",
        onTertiaryContainer: "#31111D",
        error: "#B3261E",
        onError: "#FFFFFF",
        errorContainer: "#F9DEDC",
        onErrorContainer: "#410E0B",
        background: "#FFFBFE",
        onBackground: "#1C1B1F",
        surface: "#FFFBFE",
        onSurface: "#1C1B1F",
        surfaceVariant: "#E7E0EC",
        onSurfaceVariant: "#49454F",
        outline: "#79747E",
        inverseOnSurface: "#F4EFF4",
        inverseSurface: "#313033",
        inversePrimary: "#D0BCFF",
        shadow: "#000000",
      }
    },
  },
  plugins: [],
};