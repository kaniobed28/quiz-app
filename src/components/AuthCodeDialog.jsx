import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";

const AuthCodeDialog = ({ open, onClose, quiz, onSave }) => {
  const [newAuthCode, setNewAuthCode] = React.useState("");

  const handleSave = () => {
    onSave(newAuthCode);
    setNewAuthCode("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Quiz Info</DialogTitle>
      <DialogContent>
        {quiz && (
          <>
            <Typography variant="h6">{quiz.name}</Typography>
            <Typography>{quiz.description || "No description"}</Typography>
            <Typography>Current Auth Code: {quiz.authCode || "Free Access"}</Typography>
            <TextField
              label="Set Auth Code"
              fullWidth
              value={newAuthCode}
              onChange={(e) => setNewAuthCode(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave} disabled={!newAuthCode.trim()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthCodeDialog;
