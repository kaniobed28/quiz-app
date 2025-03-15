import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import quizStore from "../stores/quizStore";
import userStore from "../stores/userStore";

const useQuizLogic = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authCode, setAuthCode] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [sendingResult, setSendingResult] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [theoryAnswer, setTheoryAnswer] = useState("");

  useEffect(() => {
    if (quizStore.currentQuiz?.authCode) {
      setAuthDialogOpen(true);
    } else {
      quizStore.setStartTime();
    }
  }, []);

  const handleAnswer = async (response) => {
    await quizStore.answerQuestion(response);

    if (quizStore.quizCompleted) {
      const elapsed = quizStore.startTime
        ? Math.floor((new Date() - quizStore.startTime) / 1000)
        : 0;
      setElapsedTime(elapsed);
      await sendResultsToAdmin(elapsed);
    }
    setTheoryAnswer(""); // Reset after each answer
  };

  const validateAuthCode = () => {
    if (quizStore.currentQuiz?.authCode === authCode) {
      setAuthDialogOpen(false);
      setAuthError(false);
      quizStore.setStartTime();
    } else {
      setAuthError(true);
    }
  };

  const sendResultsToAdmin = async (elapsed) => {
    setSendingResult(true);

    const resultData = {
      user: {
        name: userStore.user?.displayName || "Anonymous",
        email: userStore.user?.email || "Unknown",
      },
      quiz: {
        id: quizStore.currentQuiz.id,
        name: quizStore.currentQuiz.name,
      },
      score: quizStore.score,
      totalQuestions: quizStore.currentQuiz.questions.length,
      elapsedTime: elapsed,
      timestamp: new Date().toISOString(),
    };

    try {
      await quizStore.saveResult(resultData);
      console.log("Results sent to admin:", resultData);
    } catch (error) {
      console.error("Error sending results:", error);
    } finally {
      setSendingResult(false);
    }
  };

  return {
    authDialogOpen,
    authCode,
    authError,
    theoryAnswer,
    elapsedTime,
    sendingResult,
    setAuthCode,
    setTheoryAnswer,
    handleAnswer,
    validateAuthCode,
    sendResultsToAdmin,
    navigate,
    t,
  };
};

export default useQuizLogic;