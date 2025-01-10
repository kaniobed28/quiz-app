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
import ViewDetails from "../components/ViewDetails"; // Import ViewDetails

const QuizHistoryPage = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Track selected quiz for details modal
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false); // Control modal visibility
  const [filterOption, setFilterOption] = useState("all"); // Manage filters

  const fetchQuizHistory = async () => {
    setLoading(true);
    if (userStore.user) {
      try {
        const allResults = await quizStore.fetchScores();
        const currentUserResults = allResults.filter(
          (result) => result.user?.email === userStore.user.email
        );
        setUserQuizzes(currentUserResults);
      } catch (error) {
        console.error("Error fetching quiz history:", error.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const handleViewDetails = (quiz) => {
    setSelectedQuiz(quiz); // Set the selected quiz
    setViewDetailsOpen(true); // Open the modal
  };

  const handleBack = () => {
    navigate("/");
  };

  const applyFilter = (filterType) => {
    switch (filterType) {
      case "date":
        return [...userQuizzes].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      case "score":
        return [...userQuizzes].sort((a, b) => b.score - a.score);
      default:
        return userQuizzes;
    }
  };

  const handleFilter = (filterType) => {
    setUserQuizzes(applyFilter(filterType));
    setFilterOption(filterType);
  };

  if (loading) {
    return <LoadingSpinner t={t} />;
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Header t={t} userStore={userStore} />
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Typography variant="h4" gutterBottom>
          {t("your_quiz_history")}
        </Typography>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          {t("back_to_home")}
        </Button>
      </Box>

      {/* Filters Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="body1" gutterBottom>
            {t("filter_quizzes")}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleFilter("date")}
            disabled={filterOption === "date"}
          >
            {t("filter_by_date")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleFilter("score")}
            disabled={filterOption === "score"}
          >
            {t("filter_by_score")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => fetchQuizHistory()}
            disabled={filterOption === "all"}
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
          {/* Analytics Overview */}
          <AnalyticsOverview userQuizzes={userQuizzes} />

          {/* Performance Chart */}
          <PerformanceChart userQuizzes={userQuizzes} />

          {/* Time Trends */}
          <TimeTrends userQuizzes={userQuizzes} />

          {/* Quiz History Cards */}
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              {t("detailed_quiz_history")}
            </Typography>
            <Grid container spacing={3}>
              {userQuizzes.map((quiz, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
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
          </Box>
        </>
      )}

      {/* View Details Modal */}
      <ViewDetails
        open={viewDetailsOpen}
        onClose={() => setViewDetailsOpen(false)}
        quiz={selectedQuiz}
      />
    </Container>
  );
});
export default QuizHistoryPage;