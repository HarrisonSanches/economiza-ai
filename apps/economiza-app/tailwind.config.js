module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16", // Primary
          600: "#65a30d",
          700: "#4d7c0f", // Secondary
          800: "#3f6212",
          900: "#365314", // Danger
          950: "#1a2e05"
        }
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"]
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px" }],
        h2: ["24px", { lineHeight: "32px" }],
        h3: ["20px", { lineHeight: "28px" }],
        body: ["16px", { lineHeight: "24px" }],
        small: ["14px", { lineHeight: "20px" }]
      },
      borderRadius: {
        DEFAULT: "8px"
      },
      boxShadow: {
        light: "0 1px 3px rgba(0,0,0,0.12)",
        medium: "0 4px 6px rgba(0,0,0,0.10)"
      },
      spacing: {
        base: "4px"
      },
      maxWidth: {
        container: "1200px"
      }
    }
  },
  plugins: []
}