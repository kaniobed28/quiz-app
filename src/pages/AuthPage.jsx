import React, { useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import translation hook
import userStore from "../stores/userStore";

const AuthPage = observer(() => {
  const { t } = useTranslation(); // Initialize translation
  const navigate = useNavigate();

  const handleLogin = async () => {
    await userStore.loginWithGoogle();
    if (userStore.isLoggedIn()) {
      navigate("/"); // Redirect to homepage after login
    }
  };

  const handleLogout = async () => {
    await userStore.logout();
  };

  // Redirect to homepage if already logged in
  useEffect(() => {
    if (userStore.isLoggedIn()) {
      navigate("/"); // Redirect immediately if already logged in
    }
  }, [userStore.user, navigate]);

  return (
    <Container maxWidth="sm" style={{ marginTop: "100px" }}>
      <Paper elevation={4} style={{ padding: "30px", borderRadius: "15px" }}>
        <Box textAlign="center">
          <Avatar
            alt={t("app_logo_alt")}
            src="/quiz-logo.png" // Replace with your logo's path
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto",
              marginBottom: "20px",
            }}
          />
          <Typography variant="h4" gutterBottom>
            {t("welcome_quiz_app")}
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="textSecondary">
            {t("explore_quizzes")}
          </Typography>

          {userStore.isLoggedIn() ? (
            <CircularProgress style={{ marginTop: "20px" }} />
          ) : (
            <>
              <Typography variant="body1" gutterBottom>
                {t("please_log_in")}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleLogin}
                style={{
                  textTransform: "none",
                  marginTop: "20px",
                  padding: "10px 20px",
                }}
              >
                {t("login_google")}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
});

export default AuthPage;
