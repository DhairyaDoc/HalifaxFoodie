import { TextField, Typography } from "@mui/material";
import React from "react";

const CipherInformation = ({
  userKey,
  plainText,
  handleKeyChange,
  handlePlainTextChange,
}) => {
  return (
    <div className="user-cipher-information">
      <Typography variant="h4" mb={5}>
        Cipher Information
      </Typography>
      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        value={userKey}
        placeholder={"Please enter a secret 4 word or number unique key!"}
        onChange={handleKeyChange}
      />

      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        value={plainText}
        placeholder={"Please enter your plain text!"}
        onChange={handlePlainTextChange}
      />
    </div>
  );
};

export default CipherInformation;
