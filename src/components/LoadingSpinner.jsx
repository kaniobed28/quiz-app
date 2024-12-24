import React from "react";
import { Container, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ t }) => (
  <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
    <CircularProgress />
    <Typography variant="h6" style={{ marginTop: "20px" }}>
      {t("loading_quizzes")}
    </Typography>
  </Container>
);

export default LoadingSpinner;
