export const quizProgressMethods = {
    setCurrentQuiz(quizId) {
      this.currentQuiz = this.quizzes.find((quiz) => quiz.id === quizId);
      this.resetProgress();
    },
  
    setStartTime() {
      this.startTime = new Date();
    },
  
    resetProgress() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.quizCompleted = false;
      this.startTime = null;
      this.theoryAnswers = {};
    },
  
    async answerQuestion(response) {
      const currentQuestion = this.currentQuiz?.questions[this.currentQuestionIndex];
      let isCorrect = false;
  
      if (currentQuestion.type === "multiple-choice") {
        isCorrect = response; // Boolean for MCQ
      } else if (currentQuestion.type === "theory") {
        isCorrect =
          response.trim().toLowerCase() ===
          currentQuestion.correctAnswer.trim().toLowerCase();
        this.theoryAnswers[this.currentQuestionIndex] = response; // Store theory answer
      }
  
      if (isCorrect) {
        this.score += 1;
      }
  
      if (
        this.currentQuiz &&
        this.currentQuestionIndex < this.currentQuiz.questions.length - 1
      ) {
        this.currentQuestionIndex += 1;
      } else {
        this.quizCompleted = true;
  
        const elapsedTime = this.startTime
          ? Math.floor((new Date() - this.startTime) / 1000)
          : 0;
  
        const resultData = {
          quizId: this.currentQuiz.id,
          quizName: this.currentQuiz.name,
          user: {
            email: this.userStore.user?.email || "Unknown",
            name: this.userStore.user?.displayName || "Anonymous",
          },
          score: this.score,
          totalQuestions: this.currentQuiz.questions.length,
          elapsedTime,
          completedAt: new Date().toISOString(),
          theoryAnswers: { ...this.theoryAnswers }, // Include all theory answers
        };
  
        await this.saveResult(resultData);
      }
    },
  };