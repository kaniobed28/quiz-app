import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";
import '../../src/styles/Animate.css';

const HomePage = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Access translation function
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  const refs = useRef([]);
  const [visibilityStates, setVisibilityStates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await quizStore.fetchQuizzes();
      refs.current = quizStore.quizzes.map(() => React.createRef());
      setVisibilityStates(quizStore.quizzes.map(() => false));
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (!refs.current) return;
      const updatedVisibility = refs.current.map((ref) => {
        const rect = ref.current?.getBoundingClientRect();
        return rect && rect.top >= 0 && rect.top <= window.innerHeight;
      });
      setVisibilityStates(updatedVisibility);
    };

    window.addEventListener("scroll", handleVisibility);
    window.addEventListener("resize", handleVisibility);

    handleVisibility();

    return () => {
      window.removeEventListener("scroll", handleVisibility);
      window.removeEventListener("resize", handleVisibility);
    };
  }, [refs]);

  const filteredQuizzes = quizStore.quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectQuiz = (quizId) => {
    quizStore.setCurrentQuiz(quizId);
    navigate("/quiz");
  };

  const goToAdminPage = () => {
    navigate("/admin");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await userStore.logout();
    navigate("/auth");
  };

  if (loading) {
    return (
      <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          {t("loading_quizzes")}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" gutterBottom>
          {t("welcome_quiz_app")}
        </Typography>

        {userStore.isLoggedIn() && (
          <Box display="flex" alignItems="center">
            <Avatar
              src={userStore.user.photoURL}
              alt={userStore.user.displayName}
              onClick={handleMenuOpen}
              style={{ cursor: "pointer" }}
            />
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem disabled>
                <Typography variant="body1">{userStore.user.displayName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        {t("test_knowledge")}
      </Typography>

      {userStore.isLoggedIn() && (
        <Box display="flex" justifyContent="flex-end" marginBottom="20px">
          <Button variant="outlined" color="secondary" onClick={goToAdminPage}>
            {t("go_to_admin_page")}
          </Button>
        </Box>
      )}

      <TextField
        label={t("search_quizzes")}
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("search_placeholder")}
      />

      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz, index) => {
            const isVisible = visibilityStates[index];
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={quiz.id}
                ref={refs.current[index]}
                className={isVisible ? "fade-in" : "fade-out"}
              >
                <Card
                  elevation={3}
                  style={{
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" marginBottom="10px">
                      <Avatar
                        src={quiz.admin?.photoURL}
                        alt={quiz.admin?.displayName}
                        style={{ marginRight: "10px" }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {quiz.admin?.displayName || t("unknown_creator")}
                      </Typography>
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {quiz.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {quiz.description || t("no_description_available")}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => selectQuiz(quiz.id)}
                    >
                      {t("start_quiz")}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="h6" color="textSecondary" align="center">
            {t("no_quizzes_found")}
          </Typography>
        )}
      </Grid>
    </Container>
  );
});

export default HomePage;
