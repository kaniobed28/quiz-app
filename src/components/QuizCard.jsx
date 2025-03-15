import React from "react";
import { Grid, Card, CardContent, Typography, Box, Avatar, Button } from "@mui/material";

const QuizCard = ({ quiz, t, selectQuiz, isVisible, ref }) => (
  <Grid
    item
    xs={12}
    sm={6}
    md={4}
    key={quiz.id}
    ref={ref}
    className={isVisible ? "fade-in" : "fade-out"}
  >
    <Card
      elevation={3}
      style={{
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom="10px">
          <Avatar
            src={quiz.admin?.photoURL}
            alt={quiz.admin?.displayName}
            style={{ marginRight: "10px" }}
          />
          <Typography variant="body2" color="textSecondary">
            {quiz.admin?.displayName || t("unknown_creator")}
          </Typography>
        </Box>
        <Typography variant="h5" gutterBottom>
          {quiz.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {quiz.description || t("no_description_available")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => selectQuiz(quiz.id)}
        >
          {t("start_quiz")}
        </Button>
      </CardContent>
    </Card>
  </Grid>
);

export default QuizCard;
