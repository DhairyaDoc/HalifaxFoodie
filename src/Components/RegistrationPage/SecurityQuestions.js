import React from "react";

import { TextField, Typography } from "@mui/material";
import {
  SECURITY_QUESTION_ONE,
  SECURITY_QUESTION_TWO,
} from "../../Constants/constant";

const SecurityQuestions = ({
  questionOneAnswer,
  questionTwoAnswer,
  handleQuestionOneChange,
  handleQuestionTwoChange,
}) => {
  return (
    <div className="security-question-box">
      <Typography variant="h4" mb={5}>
        Security Questions
      </Typography>
      <Typography variant="h6">
        {"Question 1: " + SECURITY_QUESTION_ONE}
      </Typography>
      {/* <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        disabled
        value={"Question 1: " + SECURITY_QUESTION_ONE}
        color = "primary"
      /> */}
      <TextField
        sx={{ width: "70%", marginBottom: 5 }}
        placeholder="Please enter your answer!"
        value={questionOneAnswer}
        onChange={handleQuestionOneChange}
      />

      <Typography variant="h6">
        {"Question 2: " + SECURITY_QUESTION_TWO}
      </Typography> 
      {/* <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        disabled
        value={"Question 2: " + SECURITY_QUESTION_TWO}
      /> */}
      <TextField
        sx={{ width: "70%", color: "red" }}
        placeholder="Please enter your answer!"
        value={questionTwoAnswer}
        onChange={handleQuestionTwoChange}
      />
    </div>
  );
};

export default SecurityQuestions;
