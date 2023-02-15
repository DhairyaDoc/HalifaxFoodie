import { TextField, Typography } from "@mui/material";
import React from "react";

const UserInformation = ({
  username,
  email,
  password,
  confirmPassword,
  handleUsernameChange,
  handleEmailChange,
  handlePasswordChange,
  handleConfirmPasswordChange,
  userType,
  handleCustomerButton,
  handleRestaurantButton
}) => {
  return (
    <div className="user-information-box">
      <Typography variant="h4" mb={5}>
        User Information
      </Typography>
      <div> User Type
      <input
            type="radio"
            name="userType"
            value="customer"
            onChange={handleCustomerButton}
            checked={userType === "customer"}
          />
          Customer
          <input
            type="radio"
            name="userType"
            value="restaurant"
            onChange={handleRestaurantButton}
            checked={userType === "restaurant"}
          />
          Restaurant
         </div>
         <br></br>
      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        placeholder="Please enter your name!"
        value={username}
        onChange={handleUsernameChange}
        required
      />

      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        placeholder="Please enter your email!"
        value={email}
        onChange={handleEmailChange}
        required
      />

      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        placeholder="Please enter your password of your choice!"
        value={password}
        type="password"
        onChange={handlePasswordChange}
        required
      />

      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        placeholder="Re-enter your password to confirm"
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        required
      />
      
      <TextField disabled
      sx={{ width: "70%", marginBottom: 2 }}
      id="standard-basic" 
      label="Please note: We will send a verification link to the above email." 
      variant="standard" 
      />
    </div>
  );
};

export default UserInformation;
