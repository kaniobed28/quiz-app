import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  LinearProgress,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import quizStore from "../stores/quizStore";

const QuizPage = observer(() => {
  const [authCode, setAuthCode] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false); // Only open if authCode exists
  const [authError, setAuthError] = useState(false);

  const currentQuestion = quizStore.currentQuiz?.questions[quizStore.currentQuestionIndex];

  useEffect(() => {
    // Open the dialog only if the quiz has an authCode
    if (quizStore.currentQuiz?.authCode) {
      setAuthDialogOpen(true);
    }
  }, []);

  const handleAnswer = (isCorrect) => {
    quizStore.answerQuestion(isCorrect);
  };

  const validateAuthCode = () => {
    if (quizStore.currentQuiz?.authCode === authCode) {
      setAuthDialogOpen(false);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  if (quizStore.quizCompleted) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Fade in={true} timeout={500}>
          <Card elevation={3} style={{ padding: "30px", borderRadius: "15px", maxWidth: "500px" }}>
            <Typography variant="h4" gutterBottom>
              Quiz Completed!
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Your score is {quizStore.score}/{quizStore.currentQuiz?.questions.length}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ marginTop: "20px" }}
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </Button>
          </Card>
        </Fade>
      </Box>
    );
  }

  const progress = ((quizStore.currentQuestionIndex + 1) / quizStore.currentQuiz?.questions.length) * 100;

  return (
    <>
      {/* Auth Code Dialog */}
      {quizStore.currentQuiz?.authCode && (
        <Dialog open={authDialogOpen} disableEscapeKeyDown>
          <DialogTitle>Enter Authentication Code</DialogTitle>
          <DialogContent>
            <TextField
              label="Authentication Code"
              fullWidth
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              error={authError}
              helperText={authError && "Invalid authentication code. Please try again."}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={validateAuthCode} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Quiz Content */}
      {!authDialogOpen && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          style={{ padding: "20px" }}
        >
          <Container
            maxWidth="sm"
            style={{
              borderRadius: "15px",
            }}
          >
            {/* Quiz Progress */}
            <LinearProgress
              variant="determinate"
              value={progress}
              style={{
                marginBottom: "20px",
                height: "8px",
                borderRadius: "5px",
              }}
            />
            <Typography
              variant="body1"
              align="center"
              style={{ marginBottom: "10px", fontWeight: "bold" }}
            >
              Question {quizStore.currentQuestionIndex + 1} of {quizStore.currentQuiz?.questions.length}
            </Typography>

            {/* Question Card */}
            <Fade in={true} timeout={500}>
              <Card elevation={3} style={{ borderRadius: "15px" }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    align="center"
                    style={{ fontWeight: "bold", marginBottom: "20px" }}
                  >
                    {currentQuestion?.question}
                  </Typography>
                </CardContent>
                <CardActions
                  style={{
                    flexDirection: "column",
                    gap: "15px",
                    padding: "20px",
                    alignItems: "center",
                  }}
                >
                  {currentQuestion?.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="contained"
                      color="primary"
                      style={{
                        width: "100%",
                        textTransform: "none",
                        fontSize: "16px",
                        padding: "10px 20px",
                      }}
                      onClick={() => handleAnswer(option.isCorrect)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </CardActions>
              </Card>
            </Fade>
          </Container>
        </Box>
      )}
    </>
  );
});

export default QuizPage;
