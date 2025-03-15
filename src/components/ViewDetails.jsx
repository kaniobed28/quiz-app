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
            <strong>Score:</strong> {quiz.score}/{quiz.totalQuestions}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Time Completed:</strong> {new Date(quiz.timestamp).toLocaleString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Time Taken:</strong> {quiz.elapsedTime || "N/A"} seconds
          </Typography>
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
