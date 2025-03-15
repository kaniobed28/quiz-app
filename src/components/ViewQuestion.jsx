import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";
import useViewQuestionsLogic from "../stores/useViewQuestionsLogic";

const ViewQuestions = ({ quiz, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    localQuestions,
    newQuestion,
    options,
    questionType,
    correctAnswer,
    editingQuestion,
    editingOption,
    setNewQuestion,
    setOptions,
    setQuestionType,
    setCorrectAnswer,
    setEditingQuestion,
    setEditingOption,
    handleAddOption,
    handleSaveQuestion,
    handleDeleteQuestion,
    handleEditQuestion,
    handleDeleteOption,
    handleEditOption,
    handleSaveOption,
  } = useViewQuestionsLogic(quiz);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isSmallScreen}
    >
      <DialogTitle>{`${quiz.name} - ${t("questions")}`}</DialogTitle>
      <QuestionList
        localQuestions={localQuestions}
        isSmallScreen={isSmallScreen}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
        t={t}
      />
      <QuestionForm
        newQuestion={newQuestion}
        options={options}
        questionType={questionType}
        correctAnswer={correctAnswer}
        editingQuestion={editingQuestion}
        editingOption={editingOption}
        isSmallScreen={isSmallScreen}
        onNewQuestionChange={setNewQuestion}
        onOptionsChange={setOptions}
        onQuestionTypeChange={setQuestionType}
        onCorrectAnswerChange={setCorrectAnswer}
        onEditingOptionChange={setEditingOption}
        onAddOption={handleAddOption}
        onSaveQuestion={handleSaveQuestion}
        onDeleteOption={handleDeleteOption}
        onEditOption={handleEditOption}
        onSaveOption={handleSaveOption}
        t={t}
      />
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewQuestions;