import { TextField, Typography } from "@mui/material";
import React from "react";

const UserLoginCredentials = ({
  email,
  password,
  userType,
  restaurantName,
  handleUserEmailChange,
  handleUserPasswordChange,
  handleCustomerButton,
  handleRestaurantButton,
  handleRestaurantName,
}) => {
  return (
    <div className="user-login-credentials-box">
      <Typography variant="h4" mb={5}>
        User Crendentials
      </Typography>
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
      <br></br>
      <br></br>
      {userType === "restaurant" && (
        <TextField
          sx={{ width: "70%", marginBottom: 2 }}
          placeholder="Please enter your restaurant name"
          value={restaurantName}
          onChange={handleRestaurantName}
          required
        />
      )}
      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        placeholder="Please enter your email"
        value={email}
        onChange={handleUserEmailChange}
        required
      />
      <TextField
        sx={{ width: "70%", marginBottom: 2 }}
        placeholder="Please enter your password"
        type="password"
        value={password}
        onChange={handleUserPasswordChange}
        required
      />
    </div>
  );
};

export default UserLoginCredentials;
