import React from "react";
import { Box, Typography, Avatar, Menu, MenuItem } from "@mui/material";

const Header = ({ t, userStore, anchorEl, handleMenuOpen, handleMenuClose, handleLogout }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Typography variant="h3" gutterBottom>
      {t("welcome_quiz_app")}
    </Typography>
    {userStore.isLoggedIn() && (
      <Box display="flex" alignItems="center">
        <Avatar
          src={userStore.user.photoURL}
          alt={userStore.user.displayName}
          onClick={handleMenuOpen}
          style={{ cursor: "pointer" }}
        />
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem disabled>
            <Typography variant="body1">{userStore.user.displayName}</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
        </Menu>
      </Box>
    )}
  </Box>
);

export default Header;
