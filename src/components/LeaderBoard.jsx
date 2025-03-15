import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Leaderboard = ({ topPerformers }) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" align="center" gutterBottom>
        {t("leaderboard.title")}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("leaderboard.rank_column")}</TableCell>
            <TableCell>{t("leaderboard.name_column")}</TableCell>
            <TableCell>{t("leaderboard.score_column")}</TableCell>
            <TableCell>{t("leaderboard.time_column")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topPerformers.map((performer, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{performer.name}</TableCell>
              <TableCell>{performer.score}</TableCell>
              <TableCell>{performer.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Leaderboard;
