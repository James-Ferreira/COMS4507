import React from "react";
import { useTheme } from "@material-ui/core";

const Padder = (props) => {
  const theme = useTheme();
  return (
    <div
      style={{
        height: props.height || theme.spacing(1),
        width: props.width || theme.spacing(1),
      }}
    />
  );
};

export default Padder;
