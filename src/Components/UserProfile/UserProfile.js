import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';

import Navbar from "../Navbar/Navbar";
import UserProfileImage from "../../images/userprofile.jpeg";
import { DHAIRYA_DOCTOR_API_GATEWAY_GROUP_21 } from "../../Constants/constant";

const UserProfile = () => {
  const [similarity, setSimilarity] = useState([]);
  const [isVisible, setVisibility] = useState(false);

  useEffect(() => {
    axios.get("https://r54qhxnf6nxyhc4lg3tf2e4wwe0sbugq.lambda-url.us-east-1.on.aws/").then((response) => {
      response.data = response.data.replace(/'/g, '"')
      response.data = JSON.parse(response.data)

      setSimilarity(response.data)
    }).catch(err => {
      console.log("Error: ", err);
    })
  }, []);

  AWS.config.update({
    accessKeyId: "AKIAYQUZ7VKLDTV3ABSN",
    secretAccessKey: "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",
    region: "us-east-1",
  });

  const myBucket = new AWS.S3({
    params: { Bucket: "comprehend-21" },
  });

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get(
        DHAIRYA_DOCTOR_API_GATEWAY_GROUP_21 +
        "/getrecipe?restaurantName=" +
        localStorage.getItem("restaurantName")
      )
      .then(
        (response) => {
          setRecipes(response.data.allRecipes);
        },
        (err) => {
          console.error("Error while fetching restraunt owner recipe's ", err);
        }
      );
  }, []);

  const uploadRecipe = (event, recipe) => {
    const params = {
      Body: event.target.files[0],
      Bucket: "comprehend-21",
      Key: event.target.files[0].name,
    };

    myBucket.putObject(params, (err, response) => {
      if (err) {
        window.alert("Something went wrong, try again!");
      } else {
        window.alert("File uploaded successfully!");
      }
    });
  };

  const extractData = (recipe) => {
    setTimeout(() => {
      setVisibility(true);
    }, 10000)
    window.alert(
      "MetaData has been extracted for " +
      recipe
    );
  }

  return (
    <div>
      <Navbar />
      <Grid align="center" mt={6}>
        {
          localStorage.getItem("restaurantName") !== null && isVisible && <Paper align="left" elevation={24} sx={{ width: "90%", marginTop: "1%", marginBottom: "1%", padding: "2.5%", paddingTop: "0.5%" }}>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }} component="div">
              Similar Recipes
            </Typography>
            <ul>
              {similarity.map((element) => {
                return <li>{element}</li>
              })}
            </ul>
          </Paper>
        }
        <Paper elevation={24} sx={{ width: "95%" }}>
          <Grid container align="center" style={{ padding: "30px 20px" }}>
            <Grid xs={4}>
              <Avatar
                alt="UserProfileImage"
                src={UserProfileImage}
                sx={{ width: "90%", height: "90%" }}
              />
            </Grid>

            <Grid align="left" xs={8} mt={4}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bolder" }}
                gutterBottom
              >
                {localStorage.getItem("currentUser")}
              </Typography>
              {localStorage.getItem("restaurantName") && (
                <Typography variant="h5" gutterBottom>
                  {localStorage.getItem("restaurantName")}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
        {localStorage.getItem("restaurantName") && (
          <Paper
            elevation={24}
            sx={{ width: "95%", marginTop: "1%", marginBottom: "1%" }}
          >
            <Typography
              pt={2}
              pb={2}
              variant="h2"
              gutterBottom
              sx={{ fontWeight: "lighter" }}
            >
              Recipe List
            </Typography>
            <Grid container style={{ padding: "40px 40px" }}>
              <Grid xs={12}>
                {recipes.length > 0 ? (
                  <TableContainer sx={{ minWidth: "80%" }} component={Paper}>
                    <Table aria-label="recipe table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <b>Recipe Name</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>Price</b>
                          </TableCell>
                          <TableCell align="center">
                            <b>Extract MetaData</b>
                          </TableCell>
                          <TableCell align="right">
                            <b>Upload Recipe</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recipes.map((recipe) => {
                          return (
                            <TableRow
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell>{recipe["nameOfTheRecipe"]}</TableCell>
                              <TableCell align="center">
                                {recipe["price"]}
                              </TableCell>

                              <TableCell align="center">
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    extractData(recipe["nameOfTheRecipe"])
                                  }}
                                  component="label"
                                >
                                  Extract
                                </Button>
                              </TableCell>

                              <TableCell align="right">
                                <Button variant="contained" component="label">
                                  Upload Recipe
                                  <input
                                    type="file"
                                    onChange={(event) => {
                                      uploadRecipe(event, recipe);
                                    }}
                                    hidden
                                  />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="h3"
                    gutterBottom
                    pb={6}
                    sx={{ fontWeight: "100", color: "#e0e0e0" }}
                  >
                    No Recipes Added
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        )}
      </Grid>
    </div>
  );
};

export default UserProfile;
