import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";
import ViewQuestions from "../components/ViewQuestion";

const AdminPage = observer(() => {
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAuthCodeDialog, setShowAuthCodeDialog] = useState(false);
  const [newAuthCode, setNewAuthCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const allowedAdmins = ["kaniobed28@gmail.com", "martintawiah56@gmail.com"];

  useEffect(() => {
    if (!allowedAdmins.includes(userStore.user?.email)) {
      setOpenDialog(true);
    }
  }, []);

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/");
  };

  const createQuiz = async () => {
    if (!quizName.trim()) return;

    const adminInfo = {
      uid: userStore.user?.uid,
      displayName: userStore.user?.displayName,
      photoURL: userStore.user?.photoURL,
    };

    await quizStore.createQuiz(quizName, quizDescription, adminInfo);
    setQuizName("");
    setQuizDescription("");
  };

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowAuthCodeDialog(true);
  };

  const handleAuthCodeSave = async () => {
    if (newAuthCode.trim()) {
      await quizStore.updateQuizAuthCode(selectedQuiz.id, newAuthCode);
      setSelectedQuiz({ ...selectedQuiz, authCode: newAuthCode });
      setShowAuthCodeDialog(false);
      setNewAuthCode("");
    }
  };

  const handleViewQuestions = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestions(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await quizStore.deleteQuiz(quizId);
    }
  };

  const userQuizzes = quizStore.quizzes.filter(
    (quiz) => quiz.admin?.uid === userStore.user?.uid
  );

  const goToHome = () => {
    navigate("/");
  };

  return (
    <Container>
      {/* Unauthorized Access Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle style={{ display: "flex", alignItems: "center" }}>
          <WarningAmberIcon style={{ color: "#ff9800", marginRight: "10px" }} />
          Access Denied
        </DialogTitle>
        <DialogContent>
          <Typography>
            You are not an admin. Please contact the admins to resolve this problem.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Return to Home
          </Button>
        </DialogActions>
      </Dialog>

      {/* Authentication Code Dialog */}
      <Dialog open={showAuthCodeDialog} onClose={() => setShowAuthCodeDialog(false)}>
        <DialogTitle>Quiz Information</DialogTitle>
        <DialogContent>
          {selectedQuiz && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedQuiz.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedQuiz.description || "No description provided."}
              </Typography>
              <Typography gutterBottom>
                Current Authentication Code:{" "}
                <strong>
                  {selectedQuiz.authCode ? selectedQuiz.authCode : "None (Free Access)"}
                </strong>
              </Typography>
              <TextField
                label="Set New Authentication Code"
                fullWidth
                margin="normal"
                value={newAuthCode}
                onChange={(e) => setNewAuthCode(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAuthCodeDialog(false)} color="secondary">
            Close
          </Button>
          <Button onClick={handleAuthCodeSave} color="primary" disabled={!newAuthCode.trim()}>
            Save Code
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Questions Dialog */}
      {showQuestions && (
        <ViewQuestions
          quiz={selectedQuiz}
          onClose={() => setShowQuestions(false)}
        />
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="20px"
        padding="10px"
        borderBottom="1px solid #ddd"
      >
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

      {/* Create Quiz Section */}
      <Card elevation={3} style={{ marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create a New Quiz
          </Typography>
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
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={createQuiz}
            style={{ textTransform: "none" }}
          >
            Create Quiz
          </Button>
        </CardActions>
      </Card>

      {/* Quiz List */}
      <List>
        {userQuizzes.map((quiz) => (
          <ListItem
            key={quiz.id}
            style={{
              background: selectedQuiz?.id === quiz.id ? "#e0f7fa" : "transparent",
              marginBottom: "10px",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="body1">{quiz.name}</Typography>
              <Box>
                <Button
                  onClick={() => handleQuizClick(quiz)}
                  color="primary"
                  style={{ textTransform: "none" }}
                >
                  Info
                </Button>
                <Button
                  onClick={() => handleViewQuestions(quiz)}
                  color="secondary"
                  style={{ textTransform: "none" }}
                >
                  View Questions
                </Button>
                <Button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  color="error"
                  style={{ textTransform: "none" }}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

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
