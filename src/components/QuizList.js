import React from "react";
import {
  Grid,
  List,
  ListItem,
  Box,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const QuizList = ({
  userQuizzes,
  selectedQuiz,
  handleQuizClick,
  handleViewQuestions,
  handleViewScores,
  handleViewAnalytics,
  handleDeleteQuiz,
  t,
}) => {
  return (
    <Grid item xs={12}>
      <List>
        {userQuizzes.map((quiz) => (
          <ListItem
            key={quiz.id}
            sx={{
              background: selectedQuiz?.id === quiz.id ? "#e0f7fa" : "transparent",
              mb: 1,
              borderRadius: 1,
              p: 2,
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="body1">{quiz.name}</Typography>
              <Box>
                <Tooltip title={t("info")}>
                  <Button
                    onClick={() => handleQuizClick(quiz)}
                    color="primary"
                    sx={{ textTransform: "none" }}
                  >
                    {t("info")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("view_questions")}>
                  <Button
                    onClick={() => handleViewQuestions(quiz)}
                    color="secondary"
                    sx={{ textTransform: "none" }}
                  >
                    {t("view_questions")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("view_scores")}>
                  <Button
                    onClick={() => handleViewScores(quiz)}
                    color="secondary"
                    sx={{ textTransform: "none" }}
                  >
                    {t("view_scores")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("view_analytics")}>
                  <Button
                    onClick={() => handleViewAnalytics(quiz)}
                    color="primary"
                    sx={{ textTransform: "none" }}
                  >
                    {t("view_analytics")}
                  </Button>
                </Tooltip>
                <Tooltip title={t("delete")}>
                  <Button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    color="error"
                    sx={{ textTransform: "none" }}
                    startIcon={<DeleteIcon />}
                  >
                    {t("delete")}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};


export default QuizList;
