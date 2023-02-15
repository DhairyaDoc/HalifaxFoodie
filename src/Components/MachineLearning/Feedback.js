import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

const FeedbackAnalyze = () => {
  const [isVisible, setVisibilty] = useState(false);
  useEffect(() => {
    console.log(localStorage.getItem("currentUser"));
    axios
    .post(
      `https://5ezrntbxw4.execute-api.us-east-1.amazonaws.com/Production/feedback`,
      {
        email: localStorage.getItem("currentUser")
      }
    )
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
    setTimeout(() => {
      setVisibilty(true);
    }, 7500)
  }, []);
  return (
    <>
    {
      isVisible ? <div>
      <Navbar />
      <iframe
        width="800"
        height="600"
        src="https://datastudio.google.com/embed/reporting/a0c76121-f08c-4cec-8d51-692d234b3c6a/page/DlT9C"
      ></iframe>
    </div> : <h1>Please wait while we prepare the data for you.</h1>
    }</>
  );
};

export default FeedbackAnalyze;
