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
  Grid,
  Tooltip,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";
import ViewQuestions from "../components/ViewQuestion";
import ViewScores from "../components/ViewScores";

const AdminPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAuthCodeDialog, setShowAuthCodeDialog] = useState(false);
  const [newAuthCode, setNewAuthCode] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showScores, setShowScores] = useState(false);

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

  const handleViewScores = (quiz) => {
    setSelectedQuiz(quiz);
    setShowScores(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm(t("confirm_delete_quiz"))) {
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Unauthorized Access Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <WarningAmberIcon sx={{ color: "#ff9800", mr: 1 }} />
          {t("access_denied")}
        </DialogTitle>
        <DialogContent>
          <Typography>{t("not_admin_contact_admins")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("return_home")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Authentication Code Dialog */}
      <Dialog open={showAuthCodeDialog} onClose={() => setShowAuthCodeDialog(false)}>
        <DialogTitle>{t("quiz_info")}</DialogTitle>
        <DialogContent>
          {selectedQuiz && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedQuiz.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedQuiz.description || t("no_description")}
              </Typography>
              <Typography gutterBottom>
                {t("current_auth_code")}:{" "}
                <strong>
                  {selectedQuiz.authCode ? selectedQuiz.authCode : t("free_access")}
                </strong>
              </Typography>
              <TextField
                label={t("set_auth_code")}
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
            {t("close")}
          </Button>
          <Button onClick={handleAuthCodeSave} color="primary" disabled={!newAuthCode.trim()}>
            {t("save_code")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Questions Dialog */}
      {showQuestions && (
        <ViewQuestions quiz={selectedQuiz} onClose={() => setShowQuestions(false)} />
      )}

      {/* Show Scores Dialog */}
      {showScores && (
        <ViewScores quiz={selectedQuiz} onClose={() => setShowScores(false)} />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ borderBottom: "1px solid #ddd", pb: 2 }}
          >
            <Typography variant="h4">{t("admin_page")}</Typography>
            {userStore.isLoggedIn() && (
              <Box display="flex" alignItems="center">
                <Avatar src={userStore.user?.photoURL} alt={userStore.user?.displayName} />
                <Typography variant="body1" ml={2}>
                  {userStore.user?.displayName}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} lg={4} sx={{ mx: "auto" }}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {t("create_new_quiz")}
              </Typography>
              <TextField
                label={t("quiz_name")}
                fullWidth
                margin="normal"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
              />
              <TextField
                label={t("quiz_description")}
                fullWidth
                margin="normal"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                multiline
                rows={3}
                placeholder={t("add_description_placeholder")}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={createQuiz}
                sx={{ textTransform: "none" }}
              >
                {t("create_quiz")}
              </Button>
            </CardActions>
          </Card>
        </Grid>

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
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button variant="outlined" color="primary" onClick={goToHome}>
          {t("back_to_home")}
        </Button>
      </Box>
    </Container>
  );
});

export default AdminPage;
