import { doc, updateDoc } from "firebase/firestore";

export const questionManagementMethods = {
  async addQuestion(quizId, question) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].questions.push({
      ...question,
      type: question.type || "multiple-choice",
    });
    const quizRef = doc(this.db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { questions: this.quizzes[quizIndex].questions });
    } catch (error) {
      console.error("Error adding question:", error.message);
    }
  },

  async updateQuestion(quizId, questionIndex, updatedQuestion) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].questions[questionIndex] = {
      ...updatedQuestion,
      type: updatedQuestion.type || "multiple-choice",
    };
    const quizRef = doc(this.db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { questions: this.quizzes[quizIndex].questions });
    } catch (error) {
      console.error("Error updating question:", error.message);
    }
  },

  async deleteQuestion(quizId, questionIndex) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].questions.splice(questionIndex, 1);
    const quizRef = doc(this.db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { questions: this.quizzes[quizIndex].questions });
    } catch (error) {
      console.error("Error deleting question:", error.message);
    }
  },
};