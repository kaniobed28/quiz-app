import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f8f8f8",
        padding: "20px 0",
        borderTop: "1px solid #ddd",
        marginTop: "auto",
      }}
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
              Created by Kani Obed
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: <Link href="mailto:kaniobed28@gmail.com">kaniobed28@gmail.com</Link>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Phone: <Link href="tel:+33753384184">+33 7 53 38 41 84</Link>
            </Typography>
          </Box>

          {/* Right Section */}
          <Box>
            <Link
              href="/privacy"
              color="inherit"
              underline="hover"
              sx={{ marginRight: "15px" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              color="inherit"
              underline="hover"
              sx={{ marginRight: "15px" }}
            >
              Terms of Service
            </Link>
            <Link
              href="https://github.com/your-repo" // Replace with your actual repo link
              color="inherit"
              underline="hover"
            >
              GitHub
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
