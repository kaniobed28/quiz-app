import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const quizManagementMethods = {
  async fetchQuizzes() {
    try {
      const querySnapshot = await getDocs(collection(this.db, "quizzes"));
      this.quizzes = querySnapshot.docs.map((doc) => {
        const quizData = doc.data();
        // Ensure all questions have a type
        quizData.questions = quizData.questions.map((q) => ({
          ...q,
          type: q.type || "multiple-choice", // Default to MCQ if type is missing
        }));
        return { id: doc.id, ...quizData };
      });
      console.log("Loaded quizzes:", this.quizzes); // Debug
    } catch (error) {
      console.error("Error fetching quizzes:", error.message);
    }
  },

  async createQuiz(name, description = "", admin = {}, authCode = null) {
    const newQuiz = {
      name,
      description,
      admin,
      authCode: authCode || null,
      questions: [],
    };

    try {
      const docRef = await addDoc(collection(this.db, "quizzes"), newQuiz);
      this.quizzes.push({ id: docRef.id, ...newQuiz });
    } catch (error) {
      console.error("Error creating quiz:", error.message);
    }
  },

  async updateQuizAuthCode(quizId, authCode) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    this.quizzes[quizIndex].authCode = authCode;
    const quizRef = doc(this.db, "quizzes", quizId);

    try {
      await updateDoc(quizRef, { authCode });
    } catch (error) {
      console.error("Error updating auth code:", error.message);
    }
  },

  async deleteQuiz(quizId) {
    const quizIndex = this.quizzes.findIndex((quiz) => quiz.id === quizId);
    if (quizIndex === -1) return;

    try {
      await deleteDoc(doc(this.db, "quizzes", quizId));
      this.quizzes.splice(quizIndex, 1);
    } catch (error) {
      console.error("Error deleting quiz:", error.message);
    }
  },
};