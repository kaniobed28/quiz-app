import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get today's date dynamically
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
          {t("terms_conditions_title")}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {t("last_updated", { date: today })}
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          {t("acceptance_of_terms_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("acceptance_of_terms_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("user_responsibilities_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("user_responsibilities_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("intellectual_property_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("intellectual_property_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("limitation_of_liability_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("limitation_of_liability_body")}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {t("changes_to_terms_title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("changes_to_terms_body")}
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

export default TermsAndConditions;
