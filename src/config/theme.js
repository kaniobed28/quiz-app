import { createTheme } from "@mui/material";

const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: darkMode ? "#181818" : "#f5f5f5", // Lighter black for dark mode
        paper: darkMode ? "#242424" : "#ffffff",   // Slightly lighter black for Paper components
      },
      text: {
        primary: darkMode ? "#e0e0e0" : "#000000", // Softer white for dark mode text
        secondary: darkMode ? "#b0b0b0" : "#666666", // Softer gray for secondary text
      },
    },
    typography: {
      fontFamily: "'Roboto', 'Arial', sans-serif",
    },
  });

export default getTheme;
