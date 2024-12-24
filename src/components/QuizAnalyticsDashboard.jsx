import React, { Component } from "react";
import { Container, CircularProgress, Grid, Typography } from "@mui/material";
import quizStore from "../stores/quizStore";
import AverageScoreCard from "./AverageScoreCard";
import TimeAnalyticsCard from "./TimeAnalyticsCard";
import ScoreDistributionChart from "./ScoreDistributionChart";
import Leaderboard from "./LeaderBoard";
import UserActivityChart from "./UserActivityChart";

class QuizAnalyticsDashboard extends Component {
  state = {
    loading: true,
    error: null,
    data: {
      scoreDistribution: [],
      averageScore: 0,
      averageTimeTaken: 0,
      longestTimeTaken: 0,
      shortestTimeTaken: 0,
      topPerformers: [],
      userActivity: [],
      passFailData: [],
    },
  };

  async componentDidMount() {
    await this.fetchAnalytics(this.props.quizId);
  }

  async fetchAnalytics(quizId) {
    this.setState({ loading: true, error: null });
    try {
      const scores = await quizStore.fetchScores(quizId);

      if (!scores || scores.length === 0) {
        this.setState({ loading: false });
        return;
      }

      // Process data
      const distribution = scores.reduce((acc, score) => {
        const percentage = Math.round((score.score / score.totalQuestions) * 100);
        acc[percentage] = (acc[percentage] || 0) + 1;
        return acc;
      }, {});
      const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
      const totalQuestions = scores.reduce((sum, score) => sum + score.totalQuestions, 0);
      const times = scores.map((score) => score.elapsedTime || 0);
      const activity = scores.reduce((acc, score) => {
        const date = score.completedAt
          ? new Date(score.completedAt).toLocaleDateString()
          : "unknown";
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const passCount = scores.filter((s) => s.score / s.totalQuestions >= 0.5).length;
      const failCount = scores.length - passCount;

      this.setState({
        data: {
          scoreDistribution: Object.entries(distribution).map(([score, count]) => ({
            score: `${score}%`,
            count,
          })),
          averageScore: ((totalScore / totalQuestions) * 100).toFixed(2),
          averageTimeTaken: (times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(2),
          longestTimeTaken: Math.max(...times),
          shortestTimeTaken: Math.min(...times),
          topPerformers: scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((s) => ({
              name: s.user?.name || "Anonymous",
              score: `${s.score}/${s.totalQuestions}`,
              time: `${s.elapsedTime}s`,
            })),
          userActivity: Object.entries(activity).map(([date, users]) => ({ date, users })),
          passFailData: [
            { name: "Pass", value: passCount },
            { name: "Fail", value: failCount },
          ],
        },
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
      this.setState({ error: "Failed to fetch analytics. Please try again later.", loading: false });
    }
  }

  render() {
    const { loading, error, data } = this.state;

    if (loading)
      return (
        <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Container>
      );

    if (error)
      return (
        <Container style={{ textAlign: "center", padding: "20px" }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Container>
      );

    return (
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AverageScoreCard averageScore={data.averageScore} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TimeAnalyticsCard
              averageTime={data.averageTimeTaken}
              longestTime={data.longestTimeTaken}
              shortestTime={data.shortestTimeTaken}
            />
          </Grid>
          <Grid item xs={12}>
            <ScoreDistributionChart data={data.scoreDistribution} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Leaderboard topPerformers={data.topPerformers} />
          </Grid>
          <Grid item xs={12} md={6}>
            <UserActivityChart userActivity={data.userActivity} />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default QuizAnalyticsDashboard;
