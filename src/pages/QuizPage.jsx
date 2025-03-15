import React from "react";
import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";
import quizStore from "../stores/quizStore";
import AuthDialog from "../components/AuthDialog";
import QuizCompleted from "../components/QuizCompleted";
import QuestionDisplay from "../components/QuestionDisplay";
import useQuizLogic from "../stores/useQuizLogic";


const QuizPage = observer(() => {
  const {
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
  } = useQuizLogic();

  const currentQuestion = quizStore.currentQuiz?.questions[quizStore.currentQuestionIndex];

  if (quizStore.quizCompleted) {
    return (
      <QuizCompleted
        score={quizStore.score}
        totalQuestions={quizStore.currentQuiz?.questions.length}
        elapsedTime={elapsedTime}
        sendingResult={sendingResult}
        onReturnHome={() => navigate("/")}
        t={t}
      />
    );
  }

  return (
    <>
      {quizStore.currentQuiz?.authCode && (
        <AuthDialog
          open={authDialogOpen}
          authCode={authCode}
          authError={authError}
          onAuthCodeChange={setAuthCode}
          onValidate={validateAuthCode}
          t={t}
        />
      )}
      {!authDialogOpen && (
        <QuestionDisplay
          currentQuestion={currentQuestion}
          questionIndex={quizStore.currentQuestionIndex}
          totalQuestions={quizStore.currentQuiz?.questions.length}
          theoryAnswer={theoryAnswer}
          onTheoryAnswerChange={setTheoryAnswer}
          onAnswer={handleAnswer}
          t={t}
        />
      )}
    </>
  );
});

export default QuizPage;