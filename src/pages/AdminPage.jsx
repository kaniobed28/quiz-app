import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { observer } from "mobx-react-lite";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";

const AdminPage = observer(() => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const createQuiz = async () => {
    if (!quizName.trim()) return;

    const adminInfo = {
      uid: userStore.user?.uid, // Admin's unique identifier
      displayName: userStore.user?.displayName,
      photoURL: userStore.user?.photoURL,
    };

    await quizStore.createQuiz(quizName, quizDescription, adminInfo);
    setQuizName("");
    setQuizDescription("");
  };

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, { text: newOption.trim(), isCorrect }]);
      setNewOption("");
      setIsCorrect(false);
    }
  };

  const saveQuestion = async () => {
    if (question.trim() && options.length > 0) {
      await quizStore.addQuestion(selectedQuizId, { question: question.trim(), options });
      setQuestion("");
      setOptions([]);
    }
  };

  const userQuizzes = quizStore.quizzes.filter(
    (quiz) => quiz.admin?.uid === userStore.user?.uid
  );

  const goToHome = () => {
    navigate("/"); // Redirect to the homepage
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Typography variant="h4">Admin Page</Typography>
        {userStore.isLoggedIn() && (
          <Box display="flex" alignItems="center">
            <Avatar src={userStore.user?.photoURL} alt={userStore.user?.displayName} />
            <Typography variant="body1" marginLeft="10px">
              {userStore.user?.displayName}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Create Quiz */}
      <TextField
        label="Quiz Name"
        fullWidth
        margin="normal"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
      />
      <TextField
        label="Quiz Description"
        fullWidth
        margin="normal"
        value={quizDescription}
        onChange={(e) => setQuizDescription(e.target.value)}
        multiline
        rows={3}
        placeholder="Add a brief description for the quiz"
      />
      <Button variant="contained" color="primary" onClick={createQuiz}>
        Create Quiz
      </Button>

      {/* Quiz List */}
      <List>
        {userQuizzes.map((quiz) => (
          <ListItem
            key={quiz.id}
            onClick={() => setSelectedQuizId(quiz.id)}
            style={{
              cursor: "pointer",
              background: selectedQuizId === quiz.id ? "#f0f0f0" : "transparent",
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="body1">{quiz.name}</Typography>
              <Avatar
                src={quiz.admin?.photoURL}
                alt={quiz.admin?.displayName}
                style={{ marginLeft: "10px" }}
              />
            </Box>
          </ListItem>
        ))}
      </List>

      {selectedQuizId && (
        <>
          <h3>Add Questions to Quiz</h3>

          {/* Add Question */}
          <TextField
            label="Question"
            fullWidth
            margin="normal"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* Add Option */}
          <TextField
            label="Option"
            fullWidth
            margin="normal"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isCorrect}
                onChange={(e) => setIsCorrect(e.target.checked)}
              />
            }
            label="Is Correct"
          />
          <Button variant="contained" color="secondary" onClick={addOption}>
            Add Option
          </Button>

          {/* Option List */}
          <List>
            {options.map((opt, index) => (
              <ListItem key={index}>
                {opt.text} {opt.isCorrect && "(Correct)"}
              </ListItem>
            ))}
          </List>

          {/* Save Question */}
          <Button
            variant="contained"
            color="primary"
            onClick={saveQuestion}
            disabled={!question || options.length === 0}
          >
            Save Question
          </Button>
        </>
      )}

      {/* Back to Home Button */}
      <Box textAlign="center" marginTop="30px">
        <Button variant="outlined" color="primary" onClick={goToHome}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
});

export default AdminPage;
