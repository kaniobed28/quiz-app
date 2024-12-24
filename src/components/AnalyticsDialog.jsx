import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import QuizAnalyticsDashboard from "./QuizAnalyticsDashboard";

const AnalyticsDialog = ({ open, onClose, quizId }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
    <DialogTitle>Quiz Analytics</DialogTitle>
    <DialogContent>
      <QuizAnalyticsDashboard quizId={quizId} />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default AnalyticsDialog;
