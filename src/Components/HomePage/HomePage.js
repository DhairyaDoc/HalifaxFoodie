import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import "@fontsource/roboto/300.css";

import Navbar from "../Navbar/Navbar";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Box sx={{ flexGrow: 1, backgroundColor: "#e0e0e0", height: "100vh" }}>
        <Grid container spacing={2} minHeight={700}>
          <Grid xs display="flex" justifyContent="center" alignItems="center">
            <Typography className="home-page-heading" variant="h1" gutterBottom>
              <span>Welcome to Halifax Foodie</span>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default HomePage;
