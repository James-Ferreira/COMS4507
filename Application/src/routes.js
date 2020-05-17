import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";

import Home from "./containers/home";
import Register from "./containers/register";
import CreateRecord from "./containers/createrecord";
import Search from "./containers/search";
import SearchResult from "./containers/searchresult";

const Routes = (props) => {
  const location = useLocation();
  const history = useHistory();

  const closeDialog = (e) => {
    // e.stopPropagation();
    // history.goBack();
  };

  const background = location.state && location.state.background;

  const getResult = (loc) => {
    return (
      <Switch location={loc}>
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/search/:microchipnumber" component={SearchResult} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/createrecord/:microchipnumber" component={CreateRecord} />
      </Switch>
    );
  }
  
  if (background) {
    return (
      <>
      {getResult(background)}
      <Dialog open onClose={closeDialog}>
          <DialogContent>
            {getResult(location)}
          </DialogContent>
        </Dialog>
      </>
    )
  } else {
    return getResult(location);
  }

};

export default Routes;
