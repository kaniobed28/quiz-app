export const filterUserQuizzes = (quizzes, user) => {
    return quizzes.filter((quiz) => quiz.admin?.uid === user?.uid);
  };
  