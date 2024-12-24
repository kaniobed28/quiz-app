import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import QuizCard from "../components/QuizCard";
import LoadingSpinner from "../components/LoadingSpinner";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";
import adminStore from "../stores/adminStore"; // Import adminStore for subscriptions

const HomePage = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  const refs = useRef([]);
  const [visibilityStates, setVisibilityStates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch quizzes and subscriptions
      await quizStore.fetchQuizzes();
      await adminStore.fetchUserSubscriptions(userStore.user?.uid);

      // Set refs and visibility for quizzes
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

  // Filter quizzes based on subscription and search query
  const filteredQuizzes = quizStore.quizzes.filter(
    (quiz) =>
      adminStore.userSubscriptions.includes(quiz.admin?.uid) && // Only quizzes from subscribed admins
      quiz.name.toLowerCase().includes(searchQuery.toLowerCase()) // Matching search query
  );

  const selectQuiz = (quizId) => {
    quizStore.setCurrentQuiz(quizId);
    navigate("/quiz");
  };

  const goToAdminPage = () => {
    navigate("/admin");
  };

  const goToAdminListPage = () => {
    navigate("/admins");
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
    return <LoadingSpinner t={t} />;
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Header
        t={t}
        userStore={userStore}
        anchorEl={anchorEl}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
        handleLogout={handleLogout}
      />
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        {t("test_knowledge")}
      </Typography>
      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Button variant="outlined" color="secondary" onClick={goToAdminListPage}>
          {t("view_admins")}
        </Button>
        {userStore.isLoggedIn() && (
          <Button variant="outlined" color="secondary" onClick={goToAdminPage}>
            {t("go_to_admin_page")}
          </Button>
        )}
      </Box>
      <SearchBar t={t} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              t={t}
              selectQuiz={selectQuiz}
              isVisible={visibilityStates[index]}
              ref={refs.current[index]}
            />
          ))
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
