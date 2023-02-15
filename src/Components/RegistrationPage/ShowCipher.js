import React from "react";
import { TextField } from "@mui/material";

const ShowCipherPage = ({ cipherText }) => {
  return (
    <div>
      <h1>Cipher Window</h1>
      <h3>
        Please securely store the below cipher text; it will be used later for
        login.
      </h3>

      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        disabled
        value={cipherText}
      />
    </div>
  );
};

export default ShowCipherPage;
