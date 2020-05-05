import React from "react";
import { Route } from "react-router-dom";

import Home from "./containers/home";
import Login from "./containers/login";

const Routes = (props) => {
  return (
    <>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
    </>
  );
};

export default Routes;
