import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import quizStore from "../stores/quizStore";
import AverageScoreCard from "./AverageScoreCard";
import TimeAnalyticsCard from "./TimeAnalyticsCard";
import ScoreDistributionChart from "./ScoreDistributionChart";
import Leaderboard from "./LeaderBoard";
import UserActivityChart from "./UserActivityChart";
import LoadingSpinner from "../components/LoadingSpinner"; // Assumed to exist

const QuizAnalyticsDashboard = ({ quizId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    scoreDistribution: [],
    averageScore: 0,
    averageTimeTaken: 0,
    longestTimeTaken: 0,
    shortestTimeTaken: 0,
    topPerformers: [],
    userActivity: [],
    passFailData: [],
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const scores = await quizStore.fetchScores(quizId);

      if (!scores || scores.length === 0) {
        setData({
          ...data,
          scoreDistribution: [],
          averageScore: 0,
          averageTimeTaken: 0,
          longestTimeTaken: 0,
          shortestTimeTaken: 0,
          topPerformers: [],
          userActivity: [],
          passFailData: [],
        });
        setLoading(false);
        return;
      }

      // Process data with validation
      const distribution = scores.reduce((acc, score) => {
        const percentage = Math.round(
          (score.score / (score.totalQuestions || 1)) * 100 // Avoid division by zero
        );
        acc[percentage] = (acc[percentage] || 0) + 1;
        return acc;
      }, {});

      const totalScore = scores.reduce((sum, score) => sum + (score.score || 0), 0);
      const totalQuestions = scores.reduce(
        (sum, score) => sum + (score.totalQuestions || 1),
        0
      );
      const times = scores.map((score) => score.elapsedTime || 0); // Default to 0 if missing
      const activity = scores.reduce((acc, score) => {
        const date = score.completedAt
          ? new Date(score.completedAt).toLocaleDateString()
          : t("unknown_date"); // Fallback for missing date
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const passCount = scores.filter((s) => (s.score / (s.totalQuestions || 1)) >= 0.5).length;
      const failCount = scores.length - passCount;

      setData({
        scoreDistribution: Object.entries(distribution).map(([score, count]) => ({
          score: `${score}%`,
          count,
        })),
        averageScore: ((totalScore / totalQuestions) * 100).toFixed(2),
        averageTimeTaken: times.length
          ? (times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(2)
          : 0,
        longestTimeTaken: times.length ? Math.max(...times) : 0,
        shortestTimeTaken: times.length ? Math.min(...times) : 0,
        topPerformers: scores
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 5)
          .map((s) => ({
            name: s.user?.name || t("anonymous"),
            score: `${s.score || 0}/${s.totalQuestions || 1}`,
            time: `${s.elapsedTime || 0}s`,
          })),
        userActivity: Object.entries(activity).map(([date, users]) => ({ date, users })),
        passFailData: [
          { name: t("pass"), value: passCount },
          { name: t("fail"), value: failCount },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
      setError(t("error_fetching_analytics"));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  if (loading) {
    return <LoadingSpinner t={t} />;
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="outlined" color="primary" onClick={fetchAnalytics}>
          {t("retry")}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        {t("quiz_analytics")}
      </Typography>
      {data.scoreDistribution.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          {t("no_data_available")}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <AverageScoreCard averageScore={data.averageScore} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <TimeAnalyticsCard
                averageTime={data.averageTimeTaken}
                longestTime={data.longestTimeTaken}
                shortestTime={data.shortestTimeTaken}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <ScoreDistributionChart data={data.scoreDistribution} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Leaderboard topPerformers={data.topPerformers} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <UserActivityChart userActivity={data.userActivity} />
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default QuizAnalyticsDashboard;