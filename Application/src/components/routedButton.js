import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const RoutedButton = ({ to, asModal, ...props }) => {
  const location = useLocation();

  let toObj = to;

  if (typeof toObj === "string") {
    toObj = { pathname: toObj };
  }

  return (
    <Button
      component={Link}
      {...props}
      to={{ ...toObj, state: { background: asModal ? location : null } }}
    >
      {props.children}
    </Button>
  );
};

export default RoutedButton;
