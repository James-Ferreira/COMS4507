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
  const {
    web3,
    setAccount,
    setIsOwner,
    setIsApproved,
    contracts,
  } = Ethereum.useContainer(); // The Ethereum interface from context.

  useEffect(() => {
    (async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      let ownerStatus = false;
      let vetStatus = false;
      let approvedStatus = false;
      if (accounts[0]) {
        ownerStatus = await contracts.vetRegistry.methods
          .isOwner(accounts[0])
          .call();
        vetStatus = await contracts.vetRegistry.methods
          .isVet(accounts[0])
          .call();
        approvedStatus = await contracts.vetRegistry.methods
          .isApproved(accounts[0])
          .call();
      }
      setIsOwner(ownerStatus);
      setIsApproved(approvedStatus);
    })();
  }, [
    web3,
    setAccount,
    setIsOwner,
    setIsApproved,
    contracts.vetRegistry.methods,
  ]);

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
