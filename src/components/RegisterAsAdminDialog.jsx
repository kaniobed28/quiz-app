import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next"; // Import useTranslation
import adminStore from "../stores/adminStore"; // Import the AdminStore
import userStore from "../stores/userStore"; // Import the UserStore

const RegisterAsAdminDialog = observer(({ open, onClose }) => {
  const { t } = useTranslation(); // Initialize translation
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Track errors during registration

  // Handle the admin registration process
  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      const user = userStore.user; // Fetch the current user from userStore
      if (user) {
        await adminStore.registerAsAdmin(user); // Attempt to register the user as an admin
        if (adminStore.isAdmin) {
          console.log(t("register_as_admin_success"));
          onClose(); // Close the dialog after successful registration
        } else {
          setErrorMessage(t("register_as_admin_failure"));
        }
      } else {
        setErrorMessage(t("register_as_admin_login_required"));
      }
    } catch (error) {
      console.error(t("register_as_admin_error"), error);
      setErrorMessage(t("register_as_admin_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : null}>
      <DialogTitle>{t("register_as_admin_title")}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography>{t("register_as_admin_message")}</Typography>
            {errorMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={!loading ? onClose : null} color="secondary" disabled={loading}>
          {t("cancel")}
        </Button>
        <Button onClick={handleRegister} color="primary" disabled={loading}>
          {t("register")}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default RegisterAsAdminDialog;
