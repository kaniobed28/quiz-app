import React from "react";
import {
  List,
  ListItem,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const QuestionList = ({ localQuestions, isSmallScreen, onEdit, onDelete, t }) => (
  <List>
    {localQuestions.length > 0 ? (
      localQuestions.map((question, index) => (
        <Box key={index} mb={3}>
          <ListItem
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isSmallScreen ? "flex-start" : "center",
              borderBottom: "1px solid #ddd",
              pb: 1,
            }}
          >
            <Typography variant={isSmallScreen ? "body2" : "body1"}>
              {index + 1}. {question.question} (
              {question.type === "theory" ? t("theory") : t("multiple_choice")})
            </Typography>
            <Box mt={isSmallScreen ? 1 : 0}>
              <Tooltip title={t("edit")}>
                <IconButton onClick={() => onEdit(index)}>
                  <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("delete")}>
                <IconButton onClick={() => onDelete(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>
          {question.type === "multiple-choice" ? (
            <List sx={{ ml: isSmallScreen ? 0 : 3 }}>
              {question.options.map((opt, i) => (
                <ListItem
                  key={i}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography>
                    {opt.text} {opt.isCorrect && `(${t("correct")})`}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ ml: isSmallScreen ? 0 : 3 }}>
              {t("correct_answer")}: {question.correctAnswer}
            </Typography>
          )}
        </Box>
      ))
    ) : (
      <Typography>{t("no_questions_available")}</Typography>
    )}
  </List>
);

export default QuestionList;