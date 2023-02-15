import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Components/HomePage/HomePage";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage";
import UserProfile from "./Components/UserProfile/UserProfile";
import ChatApp from "./Components/ChatApp/ChatApp";
import RestaurantChat from "./Components/ChatApp/RestaurantChat";
import RecipeUploadVisual from "./Components/Visualization/RecipeUploadVisual";
import FeedbackAnalyze from "./Components/MachineLearning/Feedback";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/agentchat" element={<RestaurantChat />} />
        <Route path="/visualization" element={<RecipeUploadVisual />} />
        <Route path="/feedback" element={<FeedbackAnalyze />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
