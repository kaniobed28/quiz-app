import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const Header = ({
  t,
  userStore,
  anchorEl,
  handleMenuOpen,
  handleMenuClose,
  handleLogout,
}) => {
  // State to control Dialog open/close
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {/* Title Section */}
      <Typography variant="h3" gutterBottom>
        {t("welcome_quiz_app")}
      </Typography>

      {/* Info Icon Section */}
      <IconButton onClick={handleClickOpen}>
        <InfoIcon />
      </IconButton>

      {/* Dialog that shows on click */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("reason_title")}</DialogTitle>
        <DialogContent dividers>
          <Typography>{t("reason_message")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Menu Section */}
      {userStore.isLoggedIn() && (
        <Box display="flex" alignItems="center">
          <Avatar
            src={userStore.user.photoURL}
            alt={userStore.user.displayName}
            onClick={handleMenuOpen}
            style={{ cursor: "pointer" }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body1">{userStore.user.displayName}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default Header;
