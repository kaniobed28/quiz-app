import React from "react";
import { Card, CardContent, Typography, Box, Tooltip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useTranslation } from "react-i18next";

const getScoreColor = (score) => {
  if (score >= 75) return "green";
  if (score >= 50) return "orange";
  return "red";
};

const getScoreIcon = (score) => {
  if (score >= 75) return <EmojiEventsIcon style={{ color: "gold", fontSize: 40 }} />;
  if (score >= 50) return <ThumbUpAltIcon style={{ color: "orange", fontSize: 40 }} />;
  return <SentimentDissatisfiedIcon style={{ color: "red", fontSize: 40 }} />;
};

const AverageScoreCard = ({ averageScore }) => {
  const { t } = useTranslation();

  return (
    <Box mt={2} display="flex" justifyContent="center">
      <Card
        sx={{
          minWidth: 275,
          backgroundColor: "#f9f9f9",
          boxShadow: 3,
          textAlign: "center",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Tooltip title={t("tooltip_message")}>
            <Typography
              variant="h6"
              aria-label={t("average_score")}
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              {t("average_score")}
            </Typography>
          </Tooltip>
          <Box mt={2} display="flex" justifyContent="center" alignItems="center">
            {getScoreIcon(averageScore)}
          </Box>
          <Box mt={2} display="flex" justifyContent="center" alignItems="center">
            <Typography
              variant="h4"
              color={getScoreColor(averageScore)}
              aria-label={`${averageScore} percent`}
              sx={{ fontWeight: "bold" }}
            >
              {averageScore}%
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: "gray", fontStyle: "italic" }}
          >
            {t("subtitle_message")}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AverageScoreCard;
