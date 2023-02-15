import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DHAIRYA_DOCTOR_API_GATEWAY_GROUP_21 } from "../../Constants/constant";

const RecipeUploadVisual = ({ }) => {
  const [isVisible, setVisibilty] = useState(false);

  useEffect(() => {
    axios.post(DHAIRYA_DOCTOR_API_GATEWAY_GROUP_21 + "/getvisualresource", {
      restaurantName: localStorage.getItem("restaurantName")
    }).then((response) => {
      console.log("Response from visualization: ", response);
    }).catch((error) => {
      console.log("Something went wrong: ", error);
    });

    setTimeout(() => {
      setVisibilty(true);
    }, 90000)
  }, [])

  return (
    <>
      {
        isVisible ? <div className="recipe-upload-visualization">
          <iframe width="1550" height="800" src="https://datastudio.google.com/embed/reporting/07b2688c-0ec4-48e2-a698-fbdcdd2b3359/page/f7R9C" frameBorder="0" allowFullScreen></iframe>
        </div> : <h1>Loading</h1>
      }</>
  );
};

export default RecipeUploadVisual;
