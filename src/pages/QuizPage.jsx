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
import QuizIcon from "@mui/icons-material/Quiz";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";

const QuizPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authCode, setAuthCode] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [sendingResult, setSendingResult] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentQuestion = quizStore.currentQuiz?.questions[quizStore.currentQuestionIndex];

  useEffect(() => {
    if (quizStore.currentQuiz?.authCode) {
      setAuthDialogOpen(true);
    } else {
      quizStore.setStartTime(); // Automatically start the timer
    }
  }, []);

  const handleAnswer = async (isCorrect) => {
    quizStore.answerQuestion(isCorrect);

    if (quizStore.quizCompleted) {
      const elapsed = quizStore.startTime
        ? Math.floor((new Date() - quizStore.startTime) / 1000) // Calculate elapsed time
        : 0;
      setElapsedTime(elapsed); // Update elapsed time in state
      await sendResultsToAdmin(elapsed);
    }
  };

  const validateAuthCode = () => {
    if (quizStore.currentQuiz?.authCode === authCode) {
      setAuthDialogOpen(false);
      setAuthError(false);
      quizStore.setStartTime(); // Start the timer after successful auth
    } else {
      setAuthError(true);
    }
  };

  const sendResultsToAdmin = async (elapsed) => {
    setSendingResult(true);

    const resultData = {
      user: {
        name: userStore.user?.displayName || "Anonymous",
        email: userStore.user?.email || "Unknown",
      },
      quiz: {
        id: quizStore.currentQuiz.id,
        name: quizStore.currentQuiz.name,
      },
      score: quizStore.score,
      totalQuestions: quizStore.currentQuiz.questions.length,
      elapsedTime: elapsed, // Use the elapsed time passed as a parameter
      timestamp: new Date().toISOString(),
    };

    try {
      await quizStore.saveResult(resultData);
      console.log("Results sent to admin:", resultData);
    } catch (error) {
      console.error("Error sending results:", error);
    } finally {
      setSendingResult(false);
    }
  };

  if (quizStore.quizCompleted) {
    const finalElapsedTime = elapsedTime || Math.floor((new Date() - quizStore.startTime) / 1000);

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Fade in={true} timeout={500}>
          <Card elevation={3} sx={{ padding: "30px", borderRadius: "15px", maxWidth: "500px" }}>
            <QuizIcon sx={{ fontSize: "60px", color: "#3f51b5", marginBottom: "20px" }} />
            <Typography variant="h4" gutterBottom>
              {t("quiz_completed")}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {t("your_score", {
                score: quizStore.score,
                total: quizStore.currentQuiz?.questions.length,
              })}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("time_taken", { time: `${finalElapsedTime} seconds` })}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ marginTop: "20px" }}
              onClick={() => navigate("/")}
              disabled={sendingResult}
            >
              {t("return_home")}
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
          <DialogTitle>{t("enter_auth_code")}</DialogTitle>
          <DialogContent>
            <TextField
              label={t("auth_code")}
              fullWidth
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              error={authError}
              helperText={authError && t("invalid_auth_code")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={validateAuthCode} variant="contained" color="primary">
              {t("submit")}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Quiz Content */}
      {!authDialogOpen && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          minHeight="100vh"
          sx={{ padding: "20px" }}
        >
          <Container
            maxWidth="sm"
            sx={{
              borderRadius: "15px",
            }}
          >
            {/* Quiz Progress */}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                marginBottom: "20px",
                height: "8px",
                borderRadius: "5px",
              }}
            />
            <Typography
              variant="body1"
              align="center"
              sx={{ marginBottom: "10px", fontWeight: "bold" }}
            >
              {t("question_progress", {
                current: quizStore.currentQuestionIndex + 1,
                total: quizStore.currentQuiz?.questions.length,
              })}
            </Typography>

            {/* Question Card */}
            <Fade in={true} timeout={500}>
              <Card elevation={3} sx={{ borderRadius: "15px" }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ fontWeight: "bold", marginBottom: "20px" }}
                  >
                    {currentQuestion?.question}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
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
                      sx={{
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
