import React from "react";
import RunningDog from "../images/runningDog.gif";

const DogLoader = (props) => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "5em",
      }}
    >
      <img src={RunningDog} alt="Loading Icon" />
    </div>
  );
};

export default DogLoader;
