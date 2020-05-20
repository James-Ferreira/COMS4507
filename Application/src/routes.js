import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";

import Home from "./containers/home";
import Apply from "./containers/vetApplication";
import Register from "./containers/register";
import CreateRecord from "./containers/createRecord";
import Search from "./containers/search";
import SearchResult from "./containers/searchResult";
import ViewRecord from "./containers/viewRecord";

const Routes = (props) => {
  const location = useLocation();
  const history = useHistory();

  const closeDialog = (e) => {
    e.stopPropagation();
    history.goBack();
  };

  const background = location.state && location.state.background;

  const getResult = (loc) => {
    return (
      <Switch location={loc}>
        <Route exact path="/" component={Home} />
        <Route exact path="/apply" component={Apply} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dogs" component={Search} />
        <Route exact path="/dogs/:microchipnumber" component={SearchResult} />
        <Route
          exact
          path="/dogs/:microchipnumber/records/create"
          component={CreateRecord}
        />
        <Route
          exact
          path="/dogs/:microchipnumber/records/:recordnumber"
          component={ViewRecord}
        />
      </Switch>
    );
  };

  if (background) {
    return (
      <>
        {getResult(background)}
        <Dialog open onClose={closeDialog}>
          <DialogContent>{getResult(location)}</DialogContent>
        </Dialog>
      </>
    );
  } else {
    return getResult(location);
  }
};

export default Routes;
