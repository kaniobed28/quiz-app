import React from "react";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

const PerformanceChart = ({ userQuizzes }) => {
  const { t } = useTranslation();

  if (!userQuizzes || userQuizzes.length === 0) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h5" gutterBottom>
          {t("performance_chart")}
        </Typography>
        <Typography variant="body1">{t("no_data_available")}</Typography>
      </Box>
    );
  }

  const labels = userQuizzes.map((quiz) => quiz.quiz.name || t("unnamed_quiz"));
  const scores = userQuizzes.map((quiz) => quiz.score);
  const maxScores = userQuizzes.map((quiz) => quiz.totalQuestions);

  const chartData = {
    labels,
    datasets: [
      {
        label: t("score"),
        data: scores,
        backgroundColor: scores.map((score, idx) =>
          score / maxScores[idx] >= 0.8
            ? "rgba(75, 192, 75, 0.6)" // Green for high scores
            : score / maxScores[idx] >= 0.5
            ? "rgba(255, 206, 86, 0.6)" // Yellow for medium
            : "rgba(255, 99, 132, 0.6)" // Red for low
        ),
        borderColor: scores.map((score, idx) =>
          score / maxScores[idx] >= 0.8
            ? "rgba(75, 192, 75, 1)"
            : score / maxScores[idx] >= 0.5
            ? "rgba(255, 206, 86, 1)"
            : "rgba(255, 99, 132, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...maxScores) + 1, // Ensure scale fits max possible score
        title: {
          display: true,
          text: t("score"),
        },
      },
      x: {
        title: {
          display: true,
          text: t("quiz_name"),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${t("score")}: ${context.raw}/${maxScores[context.dataIndex]}`,
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Box mt={4} sx={{ height: 400, position: "relative" }}>
      <Typography variant="h5" gutterBottom align="center">
        {t("performance_chart")}
      </Typography>
      {scores.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Typography variant="body1" color="error" align="center">
          {t("error_rendering_chart")}
        </Typography>
      )}
    </Box>
  );
};

export default PerformanceChart;