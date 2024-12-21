import React from "react";
import { Container, Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import quizStore from "../stores/quizStore";

const QuizPage = observer(() => {
  const currentQuestion = quizStore.currentQuiz?.questions[quizStore.currentQuestionIndex];

  const handleAnswer = (isCorrect) => {
    quizStore.answerQuestion(isCorrect);
  };

  if (quizStore.quizCompleted) {
    return (
      <Container>
        <Typography variant="h4">Quiz Completed!</Typography>
        <Typography variant="h6">
          Your score is {quizStore.score}/{quizStore.currentQuiz?.questions.length}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5">{currentQuestion?.question}</Typography>
      {currentQuestion?.options.map((option, index) => (
        <Button
          key={index}
          variant="outlined"
          onClick={() => handleAnswer(option.isCorrect)}
          fullWidth
        >
          {option.text}
        </Button>
      ))}
    </Container>
  );
});

export default QuizPage;

