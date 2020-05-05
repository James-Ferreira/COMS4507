/**
 * Main application page.
 */

import React, { useEffect } from "react";
import { makeStyles, useTheme, Dialog, DialogContent } from "@material-ui/core";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";

import Routes from "./routes";

/* Global State */
import Ethereum from "./state/ethereum";

import "./App.css";
import NavBar from "./components/navBar";
import Login from "./containers/login";

function App() {
  const theme = useTheme();
  const styles = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { web3, setAccount } = Ethereum.useContainer(); // The Ethereum interface from context.

  useEffect(() => {
    (async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    })();
  }, []);

  const closeDialog = (e) => {
    e.stopPropagation();
    history.goBack();
  };

  const background = location.state && location.state.background;

  return (
    <>
      <NavBar />
      <Switch location={background || location}>
        <Routes />
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
}

const useStyles = makeStyles((theme) => ({}));

export default App;
