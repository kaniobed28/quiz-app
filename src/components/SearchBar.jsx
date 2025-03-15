import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ t, searchQuery, setSearchQuery }) => (
  <TextField
    label={t("search_quizzes")}
    variant="outlined"
    fullWidth
    margin="normal"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder={t("search_placeholder")}
  />
);

export default SearchBar;
