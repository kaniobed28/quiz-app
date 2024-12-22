// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Primary color
    },
    secondary: {
      main: "#dc004e", // Secondary color
    },
    error: {
      main: "#f44336", // Error color
    },
    background: {
      default: "#f5f5f5", // Background color
      paper: "#ffffff",  // Paper color
    },
    text: {
      primary: "#333333", // Primary text color
      secondary: "#666666", // Secondary text color
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", // Global font family
  },
});

export default theme;
