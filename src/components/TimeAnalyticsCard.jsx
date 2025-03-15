import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

const formatTime = (timeInSeconds) => {
  if (timeInSeconds >= 60) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }
  return `${timeInSeconds}s`;
};

const getHeaderColor = (label) => {
  switch (label) {
    case "Average":
      return "primary.main";
    case "Longest":
      return "error.main";
    case "Shortest":
      return "success.main";
    default:
      return "text.primary";
  }
};

const TimeAnalyticsCard = ({ averageTime, longestTime, shortestTime }) => {
  const timeData = [
    { label: "Average", value: averageTime },
    { label: "Longest", value: longestTime },
    { label: "Shortest", value: shortestTime },
  ];

  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        {timeData.map(({ label, value }, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card elevation={4}>
              <CardContent>
                <Typography
                  variant="h6"
                  aria-label={`${label} Time`}
                  sx={{ color: getHeaderColor(label), fontWeight: "bold" }}
                >
                  {`${label} Time`}
                </Typography>
                <Typography
                  variant="h4"
                  color="textSecondary"
                  aria-label={`${value} seconds`}
                  sx={{ mt: 1 }}
                >
                  {formatTime(value)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TimeAnalyticsCard;
