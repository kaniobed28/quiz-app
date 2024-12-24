// Importing React and necessary hooks/components from MUI, React Router, and other dependencies
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
import quizStore from "../stores/quizStore"; // Store for managing quizzes
import userStore from "../stores/userStore"; // Store for user-related data
import adminStore from "../stores/adminStore"; // Store for managing admin data
import ViewQuestions from "../components/ViewQuestion"; // Component to view quiz questions
import ViewScores from "../components/ViewScores"; // Component to view quiz scores
import QuizAnalyticsDashboard from "../components/QuizAnalyticsDashboard"; // Component for analytics
import QuizList from "../components/QuizList"; // Component for listing quizzes
import CreateQuizSection from "../components/CreateQuizSection"; // Component for creating quizzes
import RegisterAsAdminDialog from "../components/RegisterAsAdminDialog"; // Dialog for registering as admin

// Reusable button to navigate to the home page
const GoHomeButton = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  return (
    <Button variant="outlined" color="primary" onClick={() => navigate("/")}>
      Go Home
    </Button>
  );
};

// Main AdminPage component
const AdminPage = observer(() => {
  const { t } = useTranslation(); // Hook for translations
  const navigate = useNavigate(); // Navigation hook

  // State variables for managing quiz creation and actions
  const [quizName, setQuizName] = useState(""); // Quiz name input state
  const [quizDescription, setQuizDescription] = useState(""); // Quiz description input state
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Currently selected quiz
  const [showAnalytics, setShowAnalytics] = useState(false); // Flag for showing analytics dialog
  const [showAuthCodeDialog, setShowAuthCodeDialog] = useState(false); // Flag for showing auth code dialog
  const [newAuthCode, setNewAuthCode] = useState(""); // Input for new auth code
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false); // Register as admin dialog flag
  const [showQuestions, setShowQuestions] = useState(false); // Flag for showing questions
  const [showScores, setShowScores] = useState(false); // Flag for showing scores

  // Effect to check if the current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userStore.isLoggedIn()) {
        await adminStore.checkAdminStatus(userStore.user?.uid);
        if (!adminStore.isAdmin) {
          setOpenRegisterDialog(true); // Show register as admin dialog if not an admin
        }
      } else {
        navigate("/auth"); // Redirect to login if not authenticated
      }
    };
    checkAdminStatus();
  }, [navigate]);

  // Handle registering the user as an admin
  const handleRegisterAsAdmin = async () => {
    const user = {
      uid: userStore.user?.uid,
      email: userStore.user?.email,
      displayName: userStore.user?.displayName,
      photoURL: userStore.user?.photoURL,
    };
    await adminStore.registerAsAdmin(user);
    setOpenRegisterDialog(false); // Close the dialog after successful registration
  };

  // Function to create a new quiz
  const createQuiz = async () => {
    if (!quizName.trim()) return; // Prevent creating a quiz without a name

    const adminInfo = {
      uid: userStore.user?.uid,
      displayName: userStore.user?.displayName,
      photoURL: userStore.user?.photoURL,
    };

    // Call the store function to create a quiz
    await quizStore.createQuiz(quizName, quizDescription, adminInfo);
    setQuizName(""); // Reset input fields
    setQuizDescription("");
  };

  // Function to save a new auth code for the selected quiz
  const handleAuthCodeSave = async () => {
    if (newAuthCode.trim()) {
      await quizStore.updateQuizAuthCode(selectedQuiz.id, newAuthCode);
      setSelectedQuiz({ ...selectedQuiz, authCode: newAuthCode });
      setShowAuthCodeDialog(false);
      setNewAuthCode("");
    }
  };

  // Filter quizzes created by the current admin
  const userQuizzes = quizStore.quizzes.filter(
    (quiz) => quiz.admin?.uid === userStore.user?.uid
  );

  if (!adminStore.isAdmin) {
    return (
      <RegisterAsAdminDialog
        open={openRegisterDialog}
        onClose={() => navigate("/")} // Redirect to home if the user cancels
        onRegister={handleRegisterAsAdmin} // Register the user as admin
      />
    );
  }

  // Main JSX rendering
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Go Home Button */}
      <Box sx={{ mb: 2 }}>
        <GoHomeButton />
      </Box>

      {/* Auth Code Dialog */}
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

      {/* Display selected quiz details */}
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

      {/* Main content: quiz list and creation section */}
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
            handleQuizClick={setSelectedQuiz}
            handleViewQuestions={() => setShowQuestions(true)}
            handleViewScores={() => setShowScores(true)}
            handleViewAnalytics={() => setShowAnalytics(true)}
            handleDeleteQuiz={quizStore.deleteQuiz}
            t={t}
          />
        </Grid>
      </Grid>
    </Container>
  );
});

export default AdminPage;
