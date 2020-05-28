import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";

import Ethereum from "./state/ethereum";

import Home from "./containers/home";
import Apply from "./containers/vetApplication";
import Register from "./containers/register";
import CreateRecord from "./containers/createRecord";
import SearchResult from "./containers/searchResult";
import ViewRecord from "./containers/viewRecord";
import Vets from "./containers/vets";

import AccessDenied from "./components/accessDenied";

const Routes = (props) => {
  const location = useLocation();
  const history = useHistory();
  const { isApproved, isOwner } = Ethereum.useContainer(); // The Ethereum interface from context.

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
        <Route exact path="/register" component={isApproved ? Register : AccessDenied} />
        <Route exact path="/dogs/:microchipnumber" component={SearchResult} />
        <Route
          exact
          path="/dogs/:microchipnumber/records/create"
          component={isApproved ? CreateRecord : AccessDenied}
        />
        <Route
          exact
          path="/dogs/:microchipnumber/records/:recordnumber"
          component={ViewRecord}
        />
        <Route exact path="/vets" component={Vets} />
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
