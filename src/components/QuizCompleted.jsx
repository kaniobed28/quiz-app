import React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Fade,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";

const QuizCompleted = ({
  score,
  totalQuestions,
  elapsedTime,
  sendingResult,
  onReturnHome,
  t,
}) => {
  const finalElapsedTime = elapsedTime || 0; // Fallback if not calculated yet

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ textAlign: "center", padding: "20px" }}
    >
      <Fade in={true} timeout={500}>
        <Card elevation={3} sx={{ padding: "30px", borderRadius: "15px", maxWidth: "500px" }}>
          <QuizIcon sx={{ fontSize: "60px", color: "#3f51b5", marginBottom: "20px" }} />
          <Typography variant="h4" gutterBottom>
            {t("quiz_completed")}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {t("your_score", { score, total: totalQuestions })}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("time_taken", { time: `${finalElapsedTime} seconds` })}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: "20px" }}
            onClick={onReturnHome}
            disabled={sendingResult}
          >
            {t("return_home")}
          </Button>
        </Card>
      </Fade>
    </Box>
  );
};

export default QuizCompleted;