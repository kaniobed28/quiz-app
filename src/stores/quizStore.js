import { makeAutoObservable } from "mobx";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
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
    const querySnapshot = await getDocs(collection(db, "quizzes"));
    this.quizzes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async createQuiz(name, description = "", admin = {}) {
    const newQuiz = {
      name,
      description, // Include description
      admin, // Include admin details
      questions: [],
    };
  
    try {
      const docRef = await addDoc(collection(db, "quizzes"), newQuiz);
      this.quizzes.push({ id: docRef.id, ...newQuiz });
    } catch (error) {
      console.error("Error creating quiz:", error.message);
    }
  }
  
  

  async addQuestion(quizId, question) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].questions.push(question);
    const quizRef = doc(db, "quizzes", quizId);
    await updateDoc(quizRef, { questions: this.quizzes[quizIndex].questions });
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
