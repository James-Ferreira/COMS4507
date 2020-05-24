/**
 * Main application page.
 */

import React, { useEffect } from "react";
import Routes from "./routes";

/* Global State */
import Ethereum from "./state/ethereum";

import "./App.css";
import NavBar from "./components/navBar";

function App() {
  const { web3, setAccount, setIsOwner, setIsApproved, contracts } = Ethereum.useContainer(); // The Ethereum interface from context.

  useEffect(() => {
    (async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const ownerStatus = await contracts.vetRegistry.methods.isOwner(accounts[0]).call();
      const approvedStatus = await contracts.vetRegistry.methods.isOwner(accounts[0]).call();
      setIsOwner(ownerStatus);
      setIsApproved(approvedStatus);
    })();
  }, [web3, setAccount, setIsOwner, setIsApproved, contracts.vetRegistry.methods]);
  
  return (
    <>
      <NavBar />
      <Routes />
    </>
  );
}

export default App;
