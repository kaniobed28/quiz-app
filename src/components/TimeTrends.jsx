import React from "react";
import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const TimeTrends = ({ userQuizzes }) => {
  const { t } = useTranslation();

  if (!userQuizzes || userQuizzes.length === 0) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h5" gutterBottom>
          {t("time_trends")}
        </Typography>
        <Typography variant="body1">{t("no_data_available")}</Typography>
      </Box>
    );
  }

  const labels = userQuizzes.map((quiz) => quiz.quiz.name || t("unnamed_quiz"));
  const times = userQuizzes.map((quiz) => quiz.elapsedTime || 0);

  // Simple moving average (window of 3)
  const movingAverage = times.map((_, idx) => {
    const start = Math.max(0, idx - 1);
    const end = Math.min(times.length, idx + 2);
    const slice = times.slice(start, end);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: t("time_taken_seconds"),
        data: times,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
      {
        label: t("moving_average"),
        data: movingAverage,
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        borderDash: [5, 5],
        pointRadius: 0,
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
          text: t("time_seconds"),
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
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}s`,
        },
      },
      legend: {
        position: "top",
      },
      annotation: {
        annotations: {
          maxTime: {
            type: "line",
            yMin: Math.max(...times),
            yMax: Math.max(...times),
            borderColor: "rgba(255, 99, 132, 0.8)",
            borderWidth: 2,
            label: {
              content: `${t("max_time")}: ${Math.max(...times)}s`,
              enabled: true,
              position: "top",
            },
          },
          minTime: {
            type: "line",
            yMin: Math.min(...times),
            yMax: Math.min(...times),
            borderColor: "rgba(75, 192, 75, 0.8)",
            borderWidth: 2,
            label: {
              content: `${t("min_time")}: ${Math.min(...times)}s`,
              enabled: true,
              position: "bottom",
            },
          },
        },
      },
    },
  };

  return (
    <Box mt={4} sx={{ height: 400, position: "relative" }}>
      <Typography variant="h5" gutterBottom align="center">
        {t("time_trends")}
      </Typography>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default TimeTrends;