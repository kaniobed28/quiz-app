import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper, // Use theme background color
        padding: "20px 0",
        borderTop: `1px solid ${theme.palette.divider}`, // Use theme divider color
        marginTop: "auto",
        color: theme.palette.text.secondary, // Use theme text color
      })}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          {/* Left Section */}
          <Box>
            <Typography variant="body2" color="textSecondary">
              {t("footer.created_by", { name: "Kani Obed" })}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("footer.email")}:{" "}
              <Link
                href="mailto:kaniobed28@gmail.com"
                color="primary" // Theme primary color
                aria-label="Send email to Kani Obed"
              >
                kaniobed28@gmail.com
              </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("footer.phone")}:{" "}
              <Link
                href="tel:+33753384184"
                color="primary" // Theme primary color
                aria-label="Call Kani Obed"
              >
                +33 7 53 38 41 84
              </Link>
            </Typography>
          </Box>

          {/* Right Section */}
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
              alt="Quiz App Logo"
              sx={{ height: "50px", marginRight: "15px" }}
            />
            <Box>
              <Link
                href="/privacy"
                color="textSecondary" // Theme text color
                underline="hover"
                sx={{ marginRight: "15px" }}
                aria-label="Privacy Policy"
              >
                {t("footer.privacy_policy")}
              </Link>
              <Link
                href="/terms"
                color="textSecondary" // Theme text color
                underline="hover"
                sx={{ marginRight: "15px" }}
                aria-label="Terms of Service"
              >
                {t("footer.terms_of_service")}
              </Link>
              <Link
                href="https://github.com/kaniobed28/quiz-app"
                color="primary" // Theme primary color
                underline="hover"
                aria-label="View GitHub repository"
              >
                GitHub
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box textAlign="center" marginTop="10px">
          <Typography variant="body2" color="textSecondary">
            &copy; {currentYear} {t("footer.rights_reserved")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
