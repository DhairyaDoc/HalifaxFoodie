import { TextField, Typography } from "@mui/material";
import React from "react";

const UserCipherText = ({ cipherText, handleCipherTextChange }) => {
  return (
    <div className="cipher-text-box">
      <Typography variant="h4" mb={5}>
        Cipher Text Validation
      </Typography>
      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        placeholder="Enter your cipher text"
        value={cipherText}
        onChange={handleCipherTextChange}
      />
    </div>
  );
};

export default UserCipherText;
