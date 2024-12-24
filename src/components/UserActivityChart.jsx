import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";

// Register required components globally
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const UserActivityChart = ({ userActivity }) => {
  const { t } = useTranslation();

  const chartData = {
    labels: userActivity.map((entry) => entry.date),
    datasets: [
      {
        label: t("user_activity.chart_title"),
        data: userActivity.map((entry) => entry.users),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t("user_activity.y_axis_label"),
        },
      },
      x: {
        title: {
          display: true,
          text: t("user_activity.x_axis_label"),
        },
      },
    },
  };

  return (
    <div>
      <h3>{t("user_activity.chart_title")}</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default UserActivityChart;
