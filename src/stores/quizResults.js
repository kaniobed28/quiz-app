import { collection, getDocs, addDoc } from "firebase/firestore";

export const quizResultMethods = {
  async saveResult(resultData) {
    try {
      await addDoc(collection(this.db, "quizResults"), resultData);
      console.log("Result saved successfully:", resultData);
    } catch (error) {
      console.error("Error saving result:", error.message);
    }
  },

  async fetchScores(quizId) {
    try {
      const scoresSnapshot = await getDocs(collection(this.db, "quizResults"));
      return scoresSnapshot.docs
        .map((doc) => doc.data())
        .filter((result) => result.quizId === quizId);
    } catch (error) {
      console.error("Error fetching scores:", error.message);
      return [];
    }
  },
};