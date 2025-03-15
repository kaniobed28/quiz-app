import React from "react";
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
  TextField,
} from "@mui/material";

const QuestionDisplay = ({
  currentQuestion,
  questionIndex,
  totalQuestions,
  theoryAnswer,
  onTheoryAnswerChange,
  onAnswer,
  t,
}) => {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  // Debug: Log the current question type
  console.log("Current Question:", currentQuestion);
  console.log("Question Type:", currentQuestion?.type);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      sx={{ padding: "20px" }}
    >
      <Container maxWidth="sm" sx={{ borderRadius: "15px" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ marginBottom: "20px", height: "8px", borderRadius: "5px" }}
        />
        <Typography
          variant="body1"
          align="center"
          sx={{ marginBottom: "10px", fontWeight: "bold" }}
        >
          {t("question_progress", {
            current: questionIndex + 1,
            total: totalQuestions,
          })}
        </Typography>

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
              {currentQuestion?.type === "multiple-choice" && currentQuestion?.options ? (
                currentQuestion.options.map((option, index) => (
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
                    onClick={() => onAnswer(option.isCorrect)}
                  >
                    {option.text}
                  </Button>
                ))
              ) : currentQuestion?.type === "theory" ? (
                <>
                  <TextField
                    label={t("your_answer")}
                    fullWidth
                    multiline
                    rows={4}
                    value={theoryAnswer}
                    onChange={(e) => onTheoryAnswerChange(e.target.value)}
                    sx={{ marginBottom: "20px" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "100%", padding: "10px 20px" }}
                    onClick={() => onAnswer(theoryAnswer)}
                    disabled={!theoryAnswer.trim()}
                  >
                    {t("submit_answer")}
                  </Button>
                </>
              ) : (
                <Typography color="error">
                  {t("invalid_question_type")}
                </Typography>
              )}
            </CardActions>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default QuestionDisplay;