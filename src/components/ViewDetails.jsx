import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ViewDetails = ({ open, onClose, quiz }) => {
  if (!quiz) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{quiz.quiz.name || "Unnamed Quiz"}</DialogTitle>
      <DialogContent>
        {/* Quiz Information */}
        <Box mb={2}>
          <Typography variant="body1" gutterBottom>
            <strong>Description:</strong> {quiz.quiz.description || "No description provided"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Score:</strong> {quiz.score}/{quiz.totalQuestions}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Time Completed:</strong> {new Date(quiz.timestamp).toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Time Taken:</strong> {quiz.elapsedTime || "N/A"} seconds
          </Typography>
        </Box>

        <Divider />

        {/* Questions and Answers */}
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Questions and Answers
          </Typography>
          {quiz.quiz.questions && quiz.quiz.questions.length > 0 ? (
            <List>
              {quiz.quiz.questions.map((question, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        <strong>Q{index + 1}:</strong> {question.text}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Your Answer:</strong> {quiz.answers?.[index] || "Not answered"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Correct Answer:</strong> {question.correctAnswer || "N/A"}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No questions available for this quiz.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDetails;
