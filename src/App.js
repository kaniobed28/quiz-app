import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, IconButton, Box } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { observer } from "mobx-react-lite";

import getTheme from "./config/theme";
import userStore from "./stores/userStore";

// Pages
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import TermsAndConditions from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolices";

// Components
import Footer from "./components/Footer";
import AdminListPage from "./pages/AdminListPage";
import QuizHistoryPage from "./pages/QuizHistoryPage";

const App = observer(() => {
  const [darkMode, setDarkMode] = useState(false);

  // Dynamically generate theme based on darkMode state
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {/* Dark Mode Toggle */}
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

          {/* App Routes */}
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Authentication Page */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Home Page */}
              <Route
                path="/"
                element={userStore.isLoggedIn() ? <HomePage /> : <Navigate to="/auth" />}
              />

              {/* Quiz Page */}
              <Route
                path="/quiz"
                element={userStore.isLoggedIn() ? <QuizPage /> : <Navigate to="/auth" />}
              />

              {/* Admin Page */}
              <Route
                path="/admin"
                element={userStore.isLoggedIn() ? <AdminPage /> : <Navigate to="/auth" />}
              />

              {/* Terms and Privacy Pages */}
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/admins" element={<AdminListPage />} />
              <Route path="/quiz-history" element={<QuizHistoryPage />} />
            </Routes>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
});

export default App;
