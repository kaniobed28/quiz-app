import { useState } from "react";
import { useTranslation } from "react-i18next";
import quizStore from "../stores/quizStore";

const useViewQuestionsLogic = (quiz) => {
  const { t } = useTranslation();
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptionText, setNewOptionText] = useState("");
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingOption, setEditingOption] = useState(null);
  const [localQuestions, setLocalQuestions] = useState([...quiz.questions]);

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
    if (!newQuestion.trim()) return;

    const questionData = {
      question: newQuestion,
      type: questionType,
      ...(questionType === "multiple-choice" && { options }),
      ...(questionType === "theory" && { correctAnswer }),
    };

    if (questionType === "multiple-choice" && options.length === 0) {
      alert(t("mcq_requires_options"));
      return;
    }
    if (questionType === "theory" && !correctAnswer.trim()) {
      alert(t("theory_requires_answer"));
      return;
    }

    try {
      if (editingQuestion !== null) {
        await quizStore.updateQuestion(quiz.id, editingQuestion, questionData);
      } else {
        await quizStore.addQuestion(quiz.id, questionData);
      }
      setNewQuestion("");
      setOptions([]);
      setCorrectAnswer("");
      setQuestionType("multiple-choice");
      setEditingQuestion(null);
      setLocalQuestions(
        editingQuestion !== null
          ? localQuestions.map((q, i) => (i === editingQuestion ? questionData : q))
          : [...localQuestions, questionData]
      );
    } catch (error) {
      console.error(t("error_saving_question"), error.message);
    }
  };

  const handleDeleteQuestion = async (index) => {
    try {
      const updatedQuestions = [...localQuestions];
      updatedQuestions.splice(index, 1);
      setLocalQuestions(updatedQuestions);
      await quizStore.deleteQuestion(quiz.id, index);
    } catch (error) {
      console.error(t("error_deleting_question"), error.message);
    }
  };

  const handleEditQuestion = (index) => {
    const question = quiz.questions[index];
    setNewQuestion(question.question);
    setQuestionType(question.type || "multiple-choice");
    setOptions(question.options || []);
    setCorrectAnswer(question.correctAnswer || "");
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

  return {
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
  };
};

export default useViewQuestionsLogic;