import React from "react";
import { Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import translation hook
import { observer } from "mobx-react-lite";
import quizStore from "../stores/quizStore";

const ResultPage = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation

  const restartQuiz = () => {
    quizStore.resetQuiz();
    navigate("/"); // Redirect to homepage
  };

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        {t("quiz_results")}
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        {t("score_message", {
          score: quizStore.score,
          total: quizStore.currentQuiz?.questions.length || 0,
        })}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={restartQuiz}
        fullWidth
      >
        {t("restart_quiz")}
      </Button>
    </Container>
  );
});

export default ResultPage;
