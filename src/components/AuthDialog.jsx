import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AuthDialog = ({
  open,
  authCode,
  authError,
  onAuthCodeChange,
  onValidate,
  t,
}) => (
  <Dialog open={open} disableEscapeKeyDown>
    <DialogTitle>{t("enter_auth_code")}</DialogTitle>
    <DialogContent>
      <TextField
        label={t("auth_code")}
        fullWidth
        value={authCode}
        onChange={(e) => onAuthCodeChange(e.target.value)}
        error={authError}
        helperText={authError && t("invalid_auth_code")}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onValidate} variant="contained" color="primary">
        {t("submit")}
      </Button>
    </DialogActions>
  </Dialog>
);

export default AuthDialog;