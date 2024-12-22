import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import { observer } from "mobx-react-lite";
import userStore from "./stores/userStore";
import Footer from "./components/Footer"; // Import the Footer component

const App = observer(() => {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
          </Routes>
        </div>
        <Footer /> {/* Add Footer here */}
      </div>
    </Router>
  );
});

export default App;
