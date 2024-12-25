import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Checkbox,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import quizStore from "../stores/quizStore";
import { useTranslation } from "react-i18next";

const ViewQuestions = ({ quiz, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [newQuestion, setNewQuestion] = useState("");
  const [newOptionText, setNewOptionText] = useState("");
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingOption, setEditingOption] = useState(null);

  const handleAddOption = () => {
    if (newOptionText.trim()) {
      if (isCorrect && options.some((opt) => opt.isCorrect)) {
        alert(t("only_one_correct_option"));
        return;
      }
      setOptions([...options, { text: newOptionText, isCorrect }]);
      setNewOptionText("");
      setIsCorrect(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (newQuestion.trim() && options.length > 0) {
      try {
        if (editingQuestion !== null) {
          await quizStore.updateQuestion(quiz.id, editingQuestion, {
            question: newQuestion,
            options,
          });
        } else {
          await quizStore.addQuestion(quiz.id, { question: newQuestion, options });
        }
        setNewQuestion("");
        setOptions([]);
        setEditingQuestion(null);
      } catch (error) {
        console.error(t("error_saving_question"), error.message);
      }
    }
  };

  const [localQuestions, setLocalQuestions] = useState([...quiz.questions]);

const handleDeleteQuestion = async (index) => {
  try {
    // Optimistically update localQuestions state
    const updatedQuestions = [...localQuestions];
    updatedQuestions.splice(index, 1);
    setLocalQuestions(updatedQuestions); // Trigger re-render

    // Perform Firestore deletion
    await quizStore.deleteQuestion(quiz.id, index);
  } catch (error) {
    console.error(t("error_deleting_question"), error.message);
  }
};




  const handleEditQuestion = (index) => {
    const question = quiz.questions[index];
    setNewQuestion(question.question);
    setOptions(question.options);
    setEditingQuestion(index);
  };

  const handleDeleteOption = (optionIndex) => {
    setOptions(options.filter((_, i) => i !== optionIndex));
  };

  const handleEditOption = (index) => {
    setEditingOption(index);
    setNewOptionText(options[index].text);
    setIsCorrect(options[index].isCorrect);
  };

  const handleSaveOption = () => {
    if (isCorrect && options.some((opt, i) => opt.isCorrect && i !== editingOption)) {
      alert(t("only_one_correct_option"));
      return;
    }
    const updatedOptions = options.map((opt, index) =>
      index === editingOption ? { text: newOptionText, isCorrect } : opt
    );
    setOptions(updatedOptions);
    setEditingOption(null);
    setNewOptionText("");
    setIsCorrect(false);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isSmallScreen}
    >
      <DialogTitle>{`${quiz.name} - ${t("questions")}`}</DialogTitle>
      <DialogContent sx={{ maxHeight: isSmallScreen ? "calc(100vh - 120px)" : "auto", overflowY: "auto" }}>
        <List>
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
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
                    {index + 1}. {question.question}
                  </Typography>
                  <Box mt={isSmallScreen ? 1 : 0}>
                    <Tooltip title={t("edit")}>
                      <IconButton onClick={() => handleEditQuestion(index)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("delete")}>
                      <IconButton onClick={() => handleDeleteQuestion(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
                <List sx={{ ml: isSmallScreen ? 0 : 3 }}>
                  {question.options.map((opt, i) => (
                    <ListItem
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        {opt.text} {opt.isCorrect && `(${t("correct")})`}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))
          ) : (
            <Typography>{t("no_questions_available")}</Typography>
          )}
        </List>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            {editingQuestion !== null ? t("edit_question") : t("add_question")}
          </Typography>
          <TextField
            label={t("question")}
            fullWidth
            margin="normal"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"} gap={2} mb={2} alignItems="center">
            <TextField
              label={t("option")}
              fullWidth
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
            />
            <Box display="flex" alignItems="center">
              <Typography>{t("correct")}</Typography>
              <Checkbox
                checked={isCorrect}
                onChange={(e) => setIsCorrect(e.target.checked)}
                color="primary"
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={editingOption !== null ? handleSaveOption : handleAddOption}
              sx={{ minWidth: "120px" }}
              startIcon={editingOption !== null ? <SaveIcon /> : <AddIcon />}
            >
              {editingOption !== null ? t("save_option") : t("add_option")}
            </Button>
          </Box>
          <List>
            {options.map((opt, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                  pb: 1,
                  mb: 1,
                }}
              >
                <Typography>
                  {opt.text} {opt.isCorrect && `(${t("correct")})`}
                </Typography>
                <Box mt={isSmallScreen ? 1 : 0}>
                  <Tooltip title={t("edit")}>
                    <IconButton onClick={() => handleEditOption(index)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("delete")}>
                    <IconButton onClick={() => handleDeleteOption(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveQuestion}
            disabled={!newQuestion.trim() || options.length === 0}
            sx={{ mt: 2 }}
          >
            {editingQuestion !== null ? t("update_question") : t("save_question")}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewQuestions;
