import React, { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import { Grid, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

import UserInformation from "./UserInformation";
import SecurityQuestions from "./SecurityQuestions";
import {
  USER_CIPHER_INFORMATION,
  USER_INFORMATION,
  USER_SECURITY_QUESTION,
  SECURITY_QUESTION_ONE,
  SECURITY_QUESTION_TWO,
} from "../../Constants/constant";
import "./Registration.css";
import CipherInformation from "./CipherInformation";
import Navbar from "../Navbar/Navbar";
import UserPoolRestaurant from "./UserPoolRestaurant";
import UserPoolCustomer from "./UserPoolCustomer";
import ShowCipherPage from "./ShowCipher";

const RegistrationPage = () => {
  const [page, setPage] = useState(USER_INFORMATION);

  const [questionOneAnswer, setQuestionOneAnswer] = useState("");
  const [questionTwoAnswer, setQuestionTwoAnswer] = useState("");
  const [cipherText, setCipherText] = useState("Please try registering again");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userKey, setUserKey] = useState("");
  const [plainText, setPlainText] = useState("");

  const [userType, setUserType] = useState("customer");

  const saveBasicInformation = () => {
    axios.post(
      `https://h4ns73y5l3ru5rxmsti5fakoy40azbig.lambda-url.us-east-1.on.aws/`,
      {
        name: username,
        email: email,
        userType: userType,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      }
    );
  };

  const setUpNewUser = () => {
    if (userType === "restaurant") {
      UserPoolRestaurant.signUp(email, password, [], null, (err, data) => {
        if (err) {
          if (err.code === "UsernameExistsException") {
            alert("A user with this email already exists!");
          } else {
            alert(err);
            console.error(err);
          }
        } else {
          localStorage.setItem("currentUser", email);
          localStorage.setItem("restaurantName", username);
          saveBasicInformation();
          setPage(USER_SECURITY_QUESTION);
        }
      });
    } else {
      UserPoolCustomer.signUp(email, password, [], null, (err, data) => {
        if (err) {
          if (err.code === "UsernameExistsException") {
            alert("A user with this email already exists!");
          } else {
            alert(err);
            console.error(err);
          }
        } else {
          localStorage.setItem("currentUser", email);
          saveBasicInformation();
          setPage(USER_SECURITY_QUESTION);
        }
      });
    }
  };

  const addQuestionAnswerToDatabase = () => {
    axios
      .post(
        `https://us-central1-serverless-project-369304.cloudfunctions.net/halifaxFoodie-saveQuestionAnswer`,
        {
          userType: userType,
          email: email,
          questionOne: SECURITY_QUESTION_ONE,
          answerOne: questionOneAnswer,
          questionTwo: SECURITY_QUESTION_TWO,
          answerTwo: questionTwoAnswer,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      )
      .then((res) => {});
  };

  const clickNext = () => {
    if (page === USER_INFORMATION) {
      setUpNewUser();
      // setPage(USER_SECURITY_QUESTION);
    } else if (page === USER_SECURITY_QUESTION) {
      addQuestionAnswerToDatabase();
      setPage(USER_CIPHER_INFORMATION);
    }
  };

  const clickBack = () => {
    if (page === USER_SECURITY_QUESTION) {
      setPage(USER_INFORMATION);
    } else if (page === USER_CIPHER_INFORMATION) {
      setPage(USER_SECURITY_QUESTION);
    }
  };

  const handleQuestionOneChange = (event) => {
    setQuestionOneAnswer(event.target.value);
  };
  const handleQuestionTwoChange = (event) => {
    setQuestionTwoAnswer(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleKeyChange = (event) => {
    setUserKey(event.target.value);
  };

  const handlePlainTextChange = (event) => {
    setPlainText(event.target.value);
  };

  const handleCustomerButton = () => {
    setUserType("customer");
  };

  const handleRestaurantButton = () => {
    setUserType("restaurant");
  };

  const register = (event) => {
    event.preventDefault();

    axios
      .post(
        `https://edizoilkwi2pesit7fkoa6lvja0vhkza.lambda-url.us-east-1.on.aws/`,
        {
          email: email,
          message: plainText,
          key: userKey,
          encryption: "encryption",
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
        // cipherText = res.data;
        setCipherText(res.data);
        setPage("showCipherPage");
      });
    /** After registration user will be navigated to next page
     * where he will recieve the result of the Ciphered Text
     * returned from the cloud or lambda function. */
  };

  return (
    <div>
      <Navbar />
      <Grid align="center" mt={6}>
        <Typography mb={5} variant="h2">
          REGISTRATION
        </Typography>
        <Paper elevation={24} sx={{ width: "60%" }}>
          <Grid align="center" style={{ padding: "30px 20px" }}>
            {page === USER_INFORMATION && (
              <UserInformation
                username={username}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                userType={userType}
                handleUsernameChange={handleUsernameChange}
                handleEmailChange={handleEmailChange}
                handlePasswordChange={handlePasswordChange}
                handleConfirmPasswordChange={handleConfirmPasswordChange}
                handleRestaurantButton={handleRestaurantButton}
                handleCustomerButton={handleCustomerButton}
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
              <CipherInformation
                userKey={userKey}
                plainText={plainText}
                handleKeyChange={handleKeyChange}
                handlePlainTextChange={handlePlainTextChange}
              />
            )}
            {page === "showCipherPage" && (
              <ShowCipherPage cipherText={cipherText} />
            )}

            {page === USER_INFORMATION && (
              <>
                <Button
                  size="large"
                  variant="contained"
                  disabled={
                    username === "" ||
                    email === "" ||
                    password === "" ||
                    confirmPassword === "" ||
                    password !== confirmPassword
                  }
                  onClick={clickNext}
                >
                  NEXT
                </Button>
                <Link to="/login">
                  <h3 style={{ color: "#0277bd", textDecoration: "underline" }}>
                    Already have an account?
                  </h3>
                </Link>
              </>
            )}

            {page === USER_SECURITY_QUESTION && (
              <>
                <Button
                  size="large"
                  variant="contained"
                  color="error"
                  onClick={clickBack}
                >
                  BACK
                </Button>
                <Button
                  size="large"
                  style={{ marginLeft: "10px" }}
                  variant="contained"
                  onClick={clickNext}
                  disabled={
                    questionOneAnswer === "" || questionTwoAnswer === ""
                  }
                >
                  NEXT
                </Button>
              </>
            )}

            {page === USER_CIPHER_INFORMATION && (
              <>
                <Button
                  size="large"
                  variant="contained"
                  color="error"
                  onClick={clickBack}
                >
                  BACK
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  style={{ marginLeft: "10px" }}
                  disabled={
                    userKey === "" || plainText === "" || userKey.length !== 4
                  }
                  onClick={(event) => register(event)}
                >
                  REGISTER
                </Button>
              </>
            )}
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
};

export default RegistrationPage;
