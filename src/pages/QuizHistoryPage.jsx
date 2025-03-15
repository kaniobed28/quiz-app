import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";
import AnalyticsOverview from "../components/AnalyticsOverview";
import PerformanceChart from "../components/PerformanceChart";
import TimeTrends from "../components/TimeTrends";
import ViewDetails from "../components/ViewDetails";

const ITEMS_PER_PAGE = 6;

const QuizHistoryPage = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [filterOption, setFilterOption] = useState(
    localStorage.getItem("quizFilter") || "all"
  );
  const [page, setPage] = useState(1);

  const fetchQuizHistory = async () => {
    setLoading(true);
    setError(null);
    if (userStore.user) {
      try {
        const allResults = await quizStore.fetchScores();
        const currentUserResults = allResults.filter(
          (result) => result.user?.email === userStore.user.email
        );
        setUserQuizzes(applyFilter(filterOption, currentUserResults));
      } catch (error) {
        console.error("Error fetching quiz history:", error.message);
        setError(t("error_fetching_history"));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const applyFilter = (filterType, quizzes = userQuizzes) => {
    localStorage.setItem("quizFilter", filterType);
    switch (filterType) {
      case "date":
        return [...quizzes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case "score":
        return [...quizzes].sort((a, b) => b.score - a.score);
      default:
        return quizzes;
    }
  };

  const handleFilter = (filterType) => {
    setFilterOption(filterType);
    setUserQuizzes(applyFilter(filterType));
    setPage(1); // Reset to first page on filter change
  };

  const handleViewDetails = (quiz) => {
    setSelectedQuiz(quiz);
    setViewDetailsOpen(true);
  };

  const handleBack = () => {
    navigate("/");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return <LoadingSpinner t={t} />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Header t={t} userStore={userStore} />
        <Typography variant="h4" gutterBottom>
          {t("your_quiz_history")}
        </Typography>
        <Typography variant="body1" color="error" textAlign="center">
          {error}
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" color="primary" onClick={fetchQuizHistory}>
            {t("retry")}
          </Button>
        </Box>
      </Container>
    );
  }

  const paginatedQuizzes = userQuizzes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Header t={t} userStore={userStore} />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          {t("your_quiz_history")}
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          {t("back_to_home")}
        </Button>
      </Box>

      {/* Filters Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" gap={2}>
          <Button
            variant={filterOption === "date" ? "contained" : "outlined"}
            onClick={() => handleFilter("date")}
          >
            {t("filter_by_date")}
          </Button>
          <Button
            variant={filterOption === "score" ? "contained" : "outlined"}
            onClick={() => handleFilter("score")}
          >
            {t("filter_by_score")}
          </Button>
          <Button
            variant={filterOption === "all" ? "contained" : "outlined"}
            onClick={() => handleFilter("all")}
          >
            {t("clear_filters")}
          </Button>
        </Box>
      </Box>

      {userQuizzes.length === 0 ? (
        <Typography variant="body1" textAlign="center">
          {t("no_quizzes_taken")}
        </Typography>
      ) : (
        <>
          <AnalyticsOverview userQuizzes={userQuizzes} />
          <PerformanceChart userQuizzes={userQuizzes} />
          <TimeTrends userQuizzes={userQuizzes} />

          {/* Quiz History Cards */}
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              {t("detailed_quiz_history")}
            </Typography>
            <Grid container spacing={3}>
              {paginatedQuizzes.map((quiz, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {quiz.quiz.name || t("unnamed_quiz")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {`${t("score")}: ${quiz.score}/${quiz.totalQuestions}`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {`${t("time")}: ${new Date(quiz.timestamp).toLocaleString()}`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {`${t("time_taken")}: ${quiz.elapsedTime || t("not_available")}s`}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => handleViewDetails(quiz)}
                      >
                        {t("view_details")}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(userQuizzes.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Box>
        </>
      )}

      <ViewDetails
        open={viewDetailsOpen}
        onClose={() => setViewDetailsOpen(false)}
        quiz={selectedQuiz}
      />
    </Container>
  );
});

export default QuizHistoryPage;