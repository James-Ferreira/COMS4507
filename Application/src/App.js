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
      <Routes />
    </>
  );
}

export default App;
