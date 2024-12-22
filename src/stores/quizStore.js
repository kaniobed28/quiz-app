import { makeAutoObservable } from "mobx";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

class QuizStore {
  quizzes = [];
  currentQuiz = null;
  currentQuestionIndex = 0;
  score = 0;
  quizCompleted = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchQuizzes(); // Fetch quizzes on initialization
  }

  async fetchQuizzes() {
    try {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      this.quizzes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching quizzes:", error.message);
    }
  }

  async createQuiz(name, description = "", admin = {}, authCode = null) {
    const newQuiz = {
      name,
      description, // Include description
      admin, // Include admin details
      authCode: authCode || null, // Add authCode (optional)
      questions: [],
    };

    try {
      const docRef = await addDoc(collection(db, "quizzes"), newQuiz);
      this.quizzes.push({ id: docRef.id, ...newQuiz });
    } catch (error) {
      console.error("Error creating quiz:", error.message);
    }
  }

  async updateQuizAuthCode(quizId, authCode) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].authCode = authCode;
    const quizRef = doc(db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { authCode });
    } catch (error) {
      console.error("Error updating auth code:", error.message);
    }
  }

  async addQuestion(quizId, question) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].questions.push(question);
    const quizRef = doc(db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { questions: this.quizzes[quizIndex].questions });
    } catch (error) {
      console.error("Error adding question:", error.message);
    }
  }

  async updateQuestion(quizId, questionIndex, updatedQuestion) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].questions[questionIndex] = updatedQuestion;
    const quizRef = doc(db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { questions: this.quizzes[quizIndex].questions });
    } catch (error) {
      console.error("Error updating question:", error.message);
    }
  }

  async deleteQuestion(quizId, questionIndex) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].questions.splice(questionIndex, 1);
    const quizRef = doc(db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { questions: this.quizzes[quizIndex].questions });
    } catch (error) {
      console.error("Error deleting question:", error.message);
    }
  }

  async deleteQuiz(quizId) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      this.quizzes.splice(quizIndex, 1);
    } catch (error) {
      console.error("Error deleting quiz:", error.message);
    }
  }

  setCurrentQuiz(quizId) {
    this.currentQuiz = this.quizzes.find((quiz) => quiz.id === quizId);
    this.resetProgress();
  }

  resetProgress() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizCompleted = false;
  }

  answerQuestion(isCorrect) {
    if (isCorrect) {
      this.score += 1;
    }
    if (this.currentQuiz && this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
      this.currentQuestionIndex += 1;
    } else {
      this.quizCompleted = true;
    }
  }
}

const quizStore = new QuizStore();
export default quizStore;
