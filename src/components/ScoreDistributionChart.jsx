import React from "react";
import { Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useTranslation } from "react-i18next";

const ScoreDistributionChart = ({ data }) => {
  const { t } = useTranslation();

  return (
    <Box mt={2} p={2} style={{ height: 400 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {t("score_distribution")}
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="score"
              label={{ value: t("score_label"), position: "insideBottom", dy: 10 }}
            />
            <YAxis
              label={{ value: t("count_label"), angle: -90, position: "insideLeft", dx: -10 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(200, 200, 200, 0.5)" }}
              content={({ payload, label }) =>
                payload.length ? (
                  <Box
                    sx={{
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      p: 1,
                    }}
                  >
                    <Typography variant="subtitle2">{`${t("tooltip_score")}: ${label}%`}</Typography>
                    <Typography variant="body2">{`${t("tooltip_count")}: ${payload[0].value}`}</Typography>
                  </Box>
                ) : null
              }
            />
            <Bar dataKey="count" fill="url(#colorGradient)">
              <LabelList dataKey="count" position="top" style={{ fill: "#000" }} />
            </Bar>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4caf50" />
                <stop offset="50%" stopColor="#ff9800" />
                <stop offset="100%" stopColor="#f44336" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1" color="textSecondary">
            {t("no_data")}
          </Typography>
          <Typography variant="body2" color="primary" mt={2}>
            {t("check_back_later")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ScoreDistributionChart;
