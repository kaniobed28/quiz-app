import { makeAutoObservable } from "mobx";
import { db } from "../firebaseConfig";
import userStore from "./userStore";
import { quizManagementMethods } from "./quizManagement";
import { questionManagementMethods } from "./questionManagement";
import { quizProgressMethods } from "./quizProgress";
import { quizResultMethods } from "./quizResults";

class QuizStore {
  quizzes = [];
  currentQuiz = null;
  currentQuestionIndex = 0;
  score = 0;
  quizCompleted = false;
  startTime = null;
  theoryAnswers = {};

  // Inject db and userStore as instance properties
  db = db;
  userStore = userStore;

  constructor() {
    makeAutoObservable(this);

    // Attach methods from separate files to this instance
    Object.assign(this, quizManagementMethods);
    Object.assign(this, questionManagementMethods);
    Object.assign(this, quizProgressMethods);
    Object.assign(this, quizResultMethods);

    this.fetchQuizzes(); // Initial fetch
  }
}

const quizStore = new QuizStore();
export default quizStore;