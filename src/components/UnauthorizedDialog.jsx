import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const UnauthorizedAccessDialog = ({ open, onClose, t }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <WarningAmberIcon sx={{ color: "#ff9800", mr: 1 }} />
        {t("access_denied")}
      </DialogTitle>
      <DialogContent>
        <Typography>{t("not_admin_contact_admins")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("return_home")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnauthorizedAccessDialog;
