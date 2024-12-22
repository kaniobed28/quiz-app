import { makeAutoObservable } from "mobx";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import userStore from "./userStore"; // Import the userStore to fetch user data

class QuizStore {
  quizzes = [];
  currentQuiz = null;
  currentQuestionIndex = 0;
  score = 0;
  quizCompleted = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchQuizzes();
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
      description,
      admin,
      authCode: authCode || null,
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

  async saveResult(resultData) {
    try {
      await addDoc(collection(db, "quizResults"), resultData);
      console.log("Result saved successfully:", resultData);
    } catch (error) {
      console.error("Error saving result:", error.message);
    }
  }

  async fetchScores(quizId) {
    try {
      const scoresSnapshot = await getDocs(collection(db, "quizResults"));
      return scoresSnapshot.docs
        .map((doc) => doc.data())
        .filter((result) => result.quizId === quizId);
    } catch (error) {
      console.error("Error fetching scores:", error.message);
      return [];
    }
  }

  async answerQuestion(isCorrect) {
    if (isCorrect) {
      this.score += 1;
    }
    if (this.currentQuiz && this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
      this.currentQuestionIndex += 1;
    } else {
      this.quizCompleted = true;

      const resultData = {
        quizId: this.currentQuiz.id,
        quizName: this.currentQuiz.name,
        user: {
          email: userStore.user?.email || "Unknown", // Fetch current user's email from userStore
          name: userStore.user?.displayName || "Anonymous", // Add user's name
        },
        score: this.score,
        totalQuestions: this.currentQuiz.questions.length,
        completedAt: new Date().toISOString(),
      };

      await this.saveResult(resultData);
    }
  }
}

const quizStore = new QuizStore();
export default quizStore;
