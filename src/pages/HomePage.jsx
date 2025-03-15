import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Box,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import QuizCard from "../components/QuizCard";
import LoadingSpinner from "../components/LoadingSpinner";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";
import adminStore from "../stores/adminStore";

const HomePage = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  const refs = useRef([]);
  const [visibilityStates, setVisibilityStates] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)"); // Media query for mobile view

  useEffect(() => {
    const fetchData = async () => {
      await quizStore.fetchQuizzes();
      await adminStore.fetchUserSubscriptions(userStore.user?.uid);
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

  const filteredQuizzes = quizStore.quizzes.filter(
    (quiz) =>
      adminStore.userSubscriptions.includes(quiz.admin?.uid) &&
      quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const goToQuizHistory = () => {
    navigate("/quiz-history");
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
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "stretch" : "center"}
        marginBottom="20px"
        gap={isMobile ? "10px" : "0"}
      >
        <Button
          variant="outlined"
          color="secondary"
          fullWidth={isMobile}
          onClick={goToAdminListPage}
        >
          {t("view_admins")}
        </Button>
        {userStore.isLoggedIn() && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth={isMobile}
              onClick={goToAdminPage}
            >
              {t("go_to_admin_page")}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth={isMobile}
              onClick={goToQuizHistory}
            >
              {t("view_quiz_history")}
            </Button>
          </>
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
