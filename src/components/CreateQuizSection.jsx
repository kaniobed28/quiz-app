import React from "react";
import { Card, CardContent, Typography, TextField, CardActions, Button } from "@mui/material";

const CreateQuizSection = ({
  quizName,
  quizDescription,
  onQuizNameChange,
  onQuizDescriptionChange,
  onCreate,
  t,
}) => {
  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {t("create_new_quiz")}
        </Typography>
        <TextField
          label={t("quiz_name")}
          fullWidth
          margin="normal"
          value={quizName}
          onChange={(e) => onQuizNameChange(e.target.value)}
        />
        <TextField
          label={t("quiz_description")}
          fullWidth
          margin="normal"
          value={quizDescription}
          onChange={(e) => onQuizDescriptionChange(e.target.value)}
          multiline
          rows={3}
          placeholder={t("add_description_placeholder")}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onCreate}
          sx={{ textTransform: "none" }}
        >
          {t("create_quiz")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreateQuizSection;
