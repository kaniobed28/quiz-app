import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import { observer } from "mobx-react-lite";
import userStore from "./stores/userStore";
import Footer from "./components/Footer";
import TermsAndConditions from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolices";
import { IconButton, Box } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import getTheme from "./config/theme";

const App = observer(() => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
              backgroundColor: theme.palette.background.default,
            }}
          >
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/"
                element={userStore.isLoggedIn() ? <HomePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/quiz"
                element={userStore.isLoggedIn() ? <QuizPage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/admin"
                element={userStore.isLoggedIn() ? <AdminPage /> : <Navigate to="/auth" />}
              />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
});

export default App;
