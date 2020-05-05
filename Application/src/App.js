/**
 * Main application page.
 */

import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core";

import Routes from "./routes";

/* Global State */
import Ethereum from "./state/ethereum";

import "./App.css";
import NavBar from "./components/navBar";

function App() {
  const theme = useTheme();
  const styles = useStyles();
  const { web3, setAccount } = Ethereum.useContainer(); // The Ethereum interface from context.

  useEffect(() => {
    (async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    })();
  }, []);

  return (
    <>
      <NavBar />
      <Routes />
    </>
  );
}

const useStyles = makeStyles((theme) => ({}));

export default App;
