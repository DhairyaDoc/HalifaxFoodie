import React from "react";
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Toolbar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import PieChartIcon from "@mui/icons-material/PieChart";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltSharpIcon from "@mui/icons-material/PersonAddAltSharp";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import HomeIcon from "@mui/icons-material/Home";

import "./Navbar.css";
import { BarChart } from "@mui/icons-material";
import { Button } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HALIFAX FOODIE
          </Typography>
          <Tooltip title="Home" arrow>
            <Link to="/">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <HomeIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title="Registration" arrow>
            <Link to="/registration">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <PersonAddAltSharpIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title="Login" arrow>
            <Link to="/login">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <LoginIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title="Chat" arrow>
            <Link
              to={
                localStorage.getItem("restaurantName") !== null
                  ? "/agentchat"
                  : "/chat"
              }
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <ChatIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Visualization" arrow>
            <Link to="/visualization">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <BarChart fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title="Feedback Analyzer" arrow>
            <Link to="/feedback">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <PieChartIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>

          <Tooltip title="User Profile" arrow>
            <Link to="/profile">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <AccountCircleRoundedIcon fontSize="inherit" />
              </IconButton>
            </Link>
          </Tooltip>
          {
            localStorage.getItem("currentUser") !== null && <Button variant="contained" color="error" onClick={() => { localStorage.clear(); navigate("/"); }}>LOGOUT</Button>
          }
        </Toolbar>

      </AppBar>
    </Box>
  );
};

export default Navbar;
