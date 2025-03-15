import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  List,
  ListItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

const QuestionForm = ({
  newQuestion,
  options,
  questionType,
  correctAnswer,
  editingQuestion,
  editingOption,
  isSmallScreen,
  onNewQuestionChange,
  onOptionsChange,
  onQuestionTypeChange,
  onCorrectAnswerChange,
  onEditingOptionChange,
  onAddOption,
  onSaveQuestion,
  onDeleteOption,
  onEditOption,
  onSaveOption,
  t,
}) => (
  <Box mt={3}>
    <Typography variant="h6" gutterBottom>
      {editingQuestion !== null ? t("edit_question") : t("add_question")}
    </Typography>
    <TextField
      label={t("question")}
      fullWidth
      margin="normal"
      value={newQuestion}
      onChange={(e) => onNewQuestionChange(e.target.value)}
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>{t("question_type")}</InputLabel>
      <Select
        value={questionType}
        onChange={(e) => onQuestionTypeChange(e.target.value)}
        label={t("question_type")}
      >
        <MenuItem value="multiple-choice">{t("multiple_choice")}</MenuItem>
        <MenuItem value="theory">{t("theory")}</MenuItem>
      </Select>
    </FormControl>

    {questionType === "multiple-choice" && (
      <>
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          gap={2}
          mb={2}
          alignItems="center"
        >
          <TextField
            label={t("option")}
            fullWidth
            value={options.newOptionText || ""}
            onChange={(e) => onOptionsChange({ ...options, newOptionText: e.target.value })}
          />
          <Box display="flex" alignItems="center">
            <Typography>{t("correct")}</Typography>
            <Checkbox
              checked={options.isCorrect || false}
              onChange={(e) => onOptionsChange({ ...options, isCorrect: e.target.checked })}
              color="primary"
            />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={editingOption !== null ? onSaveOption : onAddOption}
            sx={{ minWidth: "120px" }}
            startIcon={editingOption !== null ? <SaveIcon /> : <AddIcon />}
          >
            {editingOption !== null ? t("save_option") : t("add_option")}
          </Button>
        </Box>
        <List>
          {options.length > 0 &&
            options.map((opt, index) =>
              opt.text ? (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #ddd",
                    pb: 1,
                    mb: 1,
                  }}
                >
                  <Typography>
                    {opt.text} {opt.isCorrect && `(${t("correct")})`}
                  </Typography>
                  <Box mt={isSmallScreen ? 1 : 0}>
                    <Tooltip title={t("edit")}>
                      <IconButton onClick={() => onEditOption(index)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("delete")}>
                      <IconButton onClick={() => onDeleteOption(index)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              ) : null
            )}
        </List>
      </>
    )}

    {questionType === "theory" && (
      <TextField
        label={t("correct_answer")}
        fullWidth
        margin="normal"
        value={correctAnswer}
        onChange={(e) => onCorrectAnswerChange(e.target.value)}
      />
    )}

    <Button
      variant="contained"
      color="primary"
      onClick={onSaveQuestion}
      disabled={
        !newQuestion.trim() ||
        (questionType === "multiple-choice" && options.length === 0) ||
        (questionType === "theory" && !correctAnswer.trim())
      }
      sx={{ mt: 2 }}
    >
      {editingQuestion !== null ? t("update_question") : t("save_question")}
    </Button>
  </Box>
);

export default QuestionForm;