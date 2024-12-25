import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

const AnalyticsOverview = ({ userQuizzes }) => {
  const totalQuizzes = userQuizzes.length;
  const averageScore = totalQuizzes
    ? userQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
    : 0;
  const averageTime = totalQuizzes
    ? userQuizzes.reduce((sum, quiz) => sum + quiz.elapsedTime, 0) / totalQuizzes
    : 0;

  return (
    <Box mt={4} mb={4}>
      <Typography variant="h5" gutterBottom>
        Analytics Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Quizzes Taken</Typography>
              <Typography variant="h4">{totalQuizzes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Score</Typography>
              <Typography variant="h4">
                {totalQuizzes ? averageScore.toFixed(1) : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Time (seconds)</Typography>
              <Typography variant="h4">
                {totalQuizzes ? averageTime.toFixed(1) : "N/A"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsOverview;
