import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, Grid, Paper, Typography } from "@mui/material";

import UserLoginCredentials from "./UserLoginCredentials";
import SecurityQuestions from "../RegistrationPage/SecurityQuestions";
import UserCipherText from "./UserCipherText";
import {
  USER_CIPHER_INFORMATION,
  USER_CREDENTIALS,
  USER_SECURITY_QUESTION,
} from "../../Constants/constant";
import Navbar from "../Navbar/Navbar";
import UserPoolCustomer from "../RegistrationPage/UserPoolCustomer";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from "amazon-cognito-identity-js";
import axios from "axios";
import UserPoolRestaurant from "../RegistrationPage/UserPoolRestaurant";
import UserProfile from "../UserProfile/UserProfile";

const LoginPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(USER_CREDENTIALS);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  const [questionOneAnswer, setQuestionOne] = useState("");
  const [questionTwoAnswer, setQuestionTwo] = useState("");

  const [cipherText, setCipherText] = useState("");

  const [userType, setUserType] = useState("customer");

  const handleRestaurantName = (event) => {
    setRestaurantName(event.target.value);
  };

  const handleUserEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUserPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCustomerButton = () => {
    setUserType("customer");
  };

  const handleRestaurantButton = () => {
    setUserType("restaurant");
  };

  const checkUserCredentials = (event) => {
    event.preventDefault();

    let userToLogin = new CognitoUser({
      Username: email,
      Pool: UserPoolCustomer,
    });

    if (userType === "restaurant") {
      userToLogin = new CognitoUser({
        Username: email,
        Pool: UserPoolRestaurant,
      });
    } else {
      userToLogin = new CognitoUser({
        Username: email,
        Pool: UserPoolCustomer,
      });
    }

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    userToLogin.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log(email);
        localStorage.setItem("currentUser", email);
        if (userType === "restaurant") {
          localStorage.setItem("restaurantName", restaurantName);
        }
        setPage(USER_SECURITY_QUESTION);
      },
      onFailure: (err) => {
        if (err.code === "UserNotConfirmedException") {
          alert(
            "Please confirm the user by clicking the link sent to your email address."
          );
        } else if (err.code === "NotAuthorizedException") {
          alert("Wrong combination of user and password");
        } else {
          alert(err);
        }
      },
    });
  };

  const handleQuestionOneChange = (event) => {
    setQuestionOne(event.target.value);
  };

  const handleQuestionTwoChange = (event) => {
    setQuestionTwo(event.target.value);
  };

  const checkUserSecurityQuestions = (event) => {
    event.preventDefault();
    axios
      .post(
        `https://us-central1-serverless-project-369304.cloudfunctions.net/halifaxFoodie-validateAnswers`,
        {
          userType: userType,
          email: email,
          answerOne: questionOneAnswer,
          answerTwo: questionTwoAnswer,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      )
      .then((res) => {
        if (res.data === "True") {
          setPage(USER_CIPHER_INFORMATION);
        } else {
          alert("Invalid answers");
        }
      });
  };

  const handleCipherTextChange = (event) => {
    setCipherText(event.target.value);
  };

  const checkUserCipherText = (event) => {
    event.preventDefault();
    axios
      .post(
        `https://edizoilkwi2pesit7fkoa6lvja0vhkza.lambda-url.us-east-1.on.aws/`,
        {
          email: email,
          encodedMessage: cipherText,
          encryption: "decryption",
          userType: userType,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      )
      .then((res) => {
        if (res.data === "True") {
          navigate("/");
        } else {
          alert("Wrong cipher text");
        }
      });
  };

  return (
    <div>
      <Navbar />
      <Grid align="center" mt={6}>
        <Typography mb={5} variant="h2">
          LOGIN
        </Typography>
        <Paper elevation={24} sx={{ width: "60%" }}>
          <Grid align="center" style={{ padding: "30px 20px" }}>
            {page === USER_CREDENTIALS && (
              <UserLoginCredentials
                email={email}
                password={password}
                userType={userType}
                restaurantName={restaurantName}
                handleUserEmailChange={handleUserEmailChange}
                handleUserPasswordChange={handleUserPasswordChange}
                handleCustomerButton={handleCustomerButton}
                handleRestaurantButton={handleRestaurantButton}
                handleRestaurantName={handleRestaurantName}
              />
            )}
            {page === USER_SECURITY_QUESTION && (
              <SecurityQuestions
                questionOneAnswer={questionOneAnswer}
                questionTwoAnswer={questionTwoAnswer}
                handleQuestionOneChange={handleQuestionOneChange}
                handleQuestionTwoChange={handleQuestionTwoChange}
              />
            )}
            {page === USER_CIPHER_INFORMATION && (
              <>
                <UserCipherText
                  cipherText={cipherText}
                  handleCipherTextChange={handleCipherTextChange}
                />
                <Link to="/registration">
                  <h3 style={{ color: "#0277bd", textDecoration: "underline" }}>
                    Don't have an account?
                  </h3>
                </Link>
              </>
            )}
            {page === "UserProfile" && <UserProfile />}

            {page === USER_CREDENTIALS && (
              <Button
                size="large"
                variant="contained"
                disabled={email === "" || password === ""}
                onClick={(event) => checkUserCredentials(event)}
              >
                NEXT
              </Button>
            )}

            {page === USER_SECURITY_QUESTION && (
              <Button
                size="large"
                variant="contained"
                disabled={questionOneAnswer === "" || questionTwoAnswer === ""}
                onClick={(event) => checkUserSecurityQuestions(event)}
              >
                NEXT
              </Button>
            )}

            {page === USER_CIPHER_INFORMATION && (
              <Button
                size="large"
                variant="contained"
                disabled={cipherText === ""}
                onClick={(event) => checkUserCipherText(event)}
              >
                LOGIN
              </Button>
            )}
          </Grid>
        </Paper>
      </Grid>
      {/* <OnlineSupport /> */}
    </div>
  );
};

export default LoginPage;
