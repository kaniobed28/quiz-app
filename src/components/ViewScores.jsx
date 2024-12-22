import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import quizStore from "../stores/quizStore";

const ViewScores = ({ quiz, onClose }) => {
  const { t } = useTranslation();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const quizScores = await quizStore.fetchScores(quiz.id);
        setScores(quizScores);
      } catch (error) {
        console.error("Error fetching scores:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [quiz.id]);

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{`${t("scores_for")} ${quiz.name}`}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : scores.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("user")}</TableCell>
                  <TableCell>{t("email")}</TableCell>
                  <TableCell align="center">{t("score")}</TableCell>
                  <TableCell align="center">{t("submitted_at")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scores.map((score, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar alt={score.user.name} src={score.user.avatar || ""} />
                        <Typography variant="body1">
                          {score.user.name || t("anonymous")}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{score.user.email || t("unknown_email")}</TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        style={{
                          color: score.score > score.totalQuestions * 0.7 ? "green" : "red",
                        }}
                      >
                        {score.score}/{score.totalQuestions}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {new Date(score.completedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography align="center" color="textSecondary">
              {t("no_scores_found")}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewScores;
