module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          black: "#0C0C0D",
          grey1: "#F8F8F8",
          grey2: "#ECEDED",
          grey3: "#C3C4C8",
          grey4: "#969BA5",
          grey5: "#6E717A",
          grey6: "#292A2D",
          grey7: "#131416",
        },
      },
      minWidth: {
        48: "12rem",
        56: "14rem",
      },
      maxWidth: {
        48: "12rem",
        56: "14rem",
      },
      width: {
        48: "12rem",
        56: "14rem",
      },
      minHeight: {
        101: "25rem",
      },
      maxHeight: {
        101: "25rem",
      },
      height: {
        101: "25rem",
      },
    },
  },
  plugins: [],
};
