import React from "react";
import { Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import quizStore from "../stores/quizStore";

const ResultPage = observer(() => {
  const navigate = useNavigate();

  const restartQuiz = () => {
    quizStore.resetQuiz();
    navigate("/");
  };

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Quiz Results
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        You scored {quizStore.score}/{quizStore.questions.length}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={restartQuiz}
        fullWidth
      >
        Restart Quiz
      </Button>
    </Container>
  );
});

export default ResultPage;
