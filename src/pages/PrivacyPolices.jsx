import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get the current date dynamically
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "30px", marginBottom: "30px" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          {t("privacy_policy_title")}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {t("last_updated", { date: today })}
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          {t("data_collection_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("data_collection_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("data_usage_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("data_usage_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("data_sharing_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("data_sharing_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("user_rights_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("user_rights_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("policy_changes_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("policy_changes_body")}
        </Typography>
      </Box>
      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={handleBackToHome}>
          {t("back_to_home_button")}
        </Button>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
