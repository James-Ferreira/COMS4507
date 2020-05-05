import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";

import Home from "./containers/home";
import Login from "./containers/login";

const Routes = (props) => {
  const location = useLocation();
  const history = useHistory();

  const closeDialog = (e) => {
    e.stopPropagation();
    history.goBack();
  };

  const background = location.state && location.state.background;

  return (
    <>
      <Switch location={background || location}>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>

      {background && (
        <Route path={location.pathname}>
          <Dialog open onClose={closeDialog}>
            <DialogContent>
              <Login />
            </DialogContent>
          </Dialog>
        </Route>
      )}
    </>
  );
};

export default Routes;
