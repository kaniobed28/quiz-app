import React from "react";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

const PerformanceChart = ({ userQuizzes }) => {
  if (!userQuizzes || userQuizzes.length === 0) {
    return (
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Performance Chart
        </Typography>
        <Typography variant="body1">No data available to display.</Typography>
      </Box>
    );
  }

  // Use quiz names as labels, fallback to "Unnamed Quiz" if no name is available
  const labels = userQuizzes.map((quiz) => quiz.quiz.name || "Unnamed Quiz");
  const data = userQuizzes.map((quiz) => quiz.score);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Score",
        data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Score",
        },
      },
      x: {
        title: {
          display: true,
          text: "Quiz Name",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Score: ${context.raw}`,
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Box mt={4} style={{ height: 400 }}>
      <Typography variant="h5" gutterBottom>
        Performance Chart
      </Typography>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default PerformanceChart;
