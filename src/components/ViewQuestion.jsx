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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import quizStore from "../stores/quizStore";

const ViewQuestions = ({ quiz, onClose }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptionText, setNewOptionText] = useState("");
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingOption, setEditingOption] = useState(null);

  const handleAddOption = () => {
    if (newOptionText.trim()) {
      setOptions([...options, { text: newOptionText, isCorrect }]);
      setNewOptionText("");
      setIsCorrect(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (newQuestion.trim() && options.length > 0) {
      try {
        if (editingQuestion !== null) {
          // Update existing question
          await quizStore.updateQuestion(quiz.id, editingQuestion, {
            question: newQuestion,
            options,
          });
        } else {
          // Add new question
          await quizStore.addQuestion(quiz.id, { question: newQuestion, options });
        }
        setNewQuestion("");
        setOptions([]);
        setEditingQuestion(null);
      } catch (error) {
        console.error("Error saving question:", error.message);
      }
    }
  };

  const handleDeleteQuestion = async (index) => {
    try {
      await quizStore.deleteQuestion(quiz.id, index);
    } catch (error) {
      console.error("Error deleting question:", error.message);
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
    const updatedOptions = options.map((opt, index) =>
      index === editingOption ? { text: newOptionText, isCorrect } : opt
    );
    setOptions(updatedOptions);
    setEditingOption(null);
    setNewOptionText("");
    setIsCorrect(false);
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{quiz.name} - Questions</DialogTitle>
      <DialogContent>
        <List>
          {quiz.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => (
              <Box key={index} marginBottom="20px">
                <ListItem
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1">
                    {index + 1}. {question.question}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleEditQuestion(index)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteQuestion(index)}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </Box>
                </ListItem>
                <List style={{ marginLeft: "20px" }}>
                  {question.options.map((opt, i) => (
                    <ListItem
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>
                        {opt.text} {opt.isCorrect && "(Correct)"}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))
          ) : (
            <Typography>No questions available for this quiz.</Typography>
          )}
        </List>

        {/* Add or Edit Question */}
        <Box marginTop="20px">
          <Typography variant="h6" gutterBottom>
            {editingQuestion !== null ? "Edit Question" : "Add a New Question"}
          </Typography>
          <TextField
            label="Question"
            fullWidth
            margin="normal"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Box marginBottom="10px">
            <TextField
              label="Option"
              fullWidth
              margin="normal"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={editingOption !== null ? handleSaveOption : handleAddOption}
              style={{ marginTop: "10px" }}
            >
              {editingOption !== null ? "Save Option" : "Add Option"}
            </Button>
          </Box>
          <List>
            {options.map((opt, index) => (
              <ListItem
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>
                  {opt.text} {opt.isCorrect && "(Correct)"}
                </Typography>
                <Box>
                  <IconButton onClick={() => handleEditOption(index)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOption(index)}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveQuestion}
            disabled={!newQuestion.trim() || options.length === 0}
            style={{ marginTop: "10px" }}
          >
            {editingQuestion !== null ? "Update Question" : "Save Question"}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewQuestions;
