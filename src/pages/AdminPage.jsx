import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Avatar,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";
import adminStore from "../stores/adminStore";
import ViewQuestions from "../components/ViewQuestion";
import ViewScores from "../components/ViewScores";
import QuizAnalyticsDashboard from "../components/QuizAnalyticsDashboard";
import QuizList from "../components/QuizList";
import CreateQuizSection from "../components/CreateQuizSection";
import RegisterAsAdminDialog from "../components/RegisterAsAdminDialog";

const GoHomeButton = () => {
  const navigate = useNavigate();
  return (
    <Button variant="outlined" color="primary" onClick={() => navigate("/")}>
      Go Home
    </Button>
  );
};

const AdminPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAuthCodeDialog, setShowAuthCodeDialog] = useState(false);
  const [newAuthCode, setNewAuthCode] = useState("");
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    const initializeAdminStatus = async () => {
      if (userStore.isLoggedIn()) {
        await adminStore.checkAdminStatus(userStore.user?.uid);
        if (!adminStore.isAdmin) {
          setOpenRegisterDialog(true);
        }
      } else {
        navigate("/auth");
      }
    };

    initializeAdminStatus();
  }, [navigate]);

  const handleRegisterAsAdmin = async () => {
    const user = {
      uid: userStore.user?.uid,
      email: userStore.user?.email,
      displayName: userStore.user?.displayName,
      photoURL: userStore.user?.photoURL,
    };
    await adminStore.registerAsAdmin(user);
    setOpenRegisterDialog(false);
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

  const handleAuthCodeSave = async () => {
    if (newAuthCode.trim()) {
      await quizStore.updateQuizAuthCode(selectedQuiz.id, newAuthCode);
      setSelectedQuiz({ ...selectedQuiz, authCode: newAuthCode });
      setShowAuthCodeDialog(false);
      setNewAuthCode("");
    }
  };

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowAuthCodeDialog(true);
  };

  const handleViewQuestions = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestions(true);
  };

  const handleViewScores = (quiz) => {
    setSelectedQuiz(quiz);
    setShowScores(true);
  };

  const handleViewAnalytics = (quiz) => {
    setSelectedQuiz(quiz);
    setShowAnalytics(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm(t("confirm_delete_quiz"))) {
      await quizStore.deleteQuiz(quizId);
    }
  };

  const userQuizzes = quizStore.quizzes.filter(
    (quiz) => quiz.admin?.uid === userStore.user?.uid
  );

  if (!adminStore.isAdmin) {
    return (
      <RegisterAsAdminDialog
        open={openRegisterDialog}
        onClose={() => navigate("/")}
        onRegister={handleRegisterAsAdmin}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <GoHomeButton />
      </Box>

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

      {showQuestions && (
        <ViewQuestions quiz={selectedQuiz} onClose={() => setShowQuestions(false)} />
      )}
      {showScores && (
        <ViewScores quiz={selectedQuiz} onClose={() => setShowScores(false)} />
      )}
      {showAnalytics && selectedQuiz && (
        <Dialog open={showAnalytics} onClose={() => setShowAnalytics(false)} fullWidth maxWidth="lg">
          <DialogTitle>{t("quiz_analytics")}</DialogTitle>
          <DialogContent>
            <QuizAnalyticsDashboard quizId={selectedQuiz.id} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAnalytics(false)} color="primary">
              {t("close")}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ borderBottom: "1px solid #ddd", pb: 2 }}>
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
          <CreateQuizSection
            quizName={quizName}
            quizDescription={quizDescription}
            onQuizNameChange={setQuizName}
            onQuizDescriptionChange={setQuizDescription}
            onCreate={createQuiz}
            t={t}
          />
        </Grid>

        <Grid item xs={12}>
          <QuizList
            userQuizzes={userQuizzes}
            selectedQuiz={selectedQuiz}
            handleQuizClick={handleQuizClick}
            handleViewQuestions={handleViewQuestions}
            handleViewScores={handleViewScores}
            handleViewAnalytics={handleViewAnalytics}
            handleDeleteQuiz={handleDeleteQuiz}
            t={t}
          />
        </Grid>
      </Grid>
    </Container>
  );
});

export default AdminPage;
