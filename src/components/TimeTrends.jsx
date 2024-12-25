import React from "react";
import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";

import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const TimeTrends = ({ userQuizzes }) => {
  if (!userQuizzes || userQuizzes.length === 0) {
    return (
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Time Trends
        </Typography>
        <Typography variant="body1">No data available to display.</Typography>
      </Box>
    );
  }

  const labels = userQuizzes.map((quiz, index) => `${quiz.quiz.name}`);
  const data = userQuizzes.map((quiz) => quiz.elapsedTime);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Time Taken (seconds)",
        data,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Box mt={4} style={{ height: 400 }}>
      <Typography variant="h5" gutterBottom>
        Time Trends
      </Typography>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default TimeTrends;
