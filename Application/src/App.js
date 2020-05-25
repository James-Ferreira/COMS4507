/**
 * Main application page.
 */

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Routes from "./routes";

/* Global State */
import Ethereum from "./state/ethereum";

import "./App.css";
import NavBar from "./components/navBar";
import { isHome } from "./util/navigation";
import { useLocation } from "react-router-dom";

function App() {
  const styles = useStyles();
  const location = useLocation();
  const { web3, setAccount } = Ethereum.useContainer(); // The Ethereum interface from context.

  useEffect(() => {
    (async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    })();
  }, [web3, setAccount]);

  return (
    <>
      <NavBar />
      {!isHome(location) && <div className={styles.toolbar} />}
      <Routes />
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
}));

export default App;
