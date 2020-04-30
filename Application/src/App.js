/**
 * Main application page.
 */

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Snackbar
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { FaPaw, FaSearch } from "react-icons/fa";
import Dog from "./components/dog"; // Basic component for rendering a dog
import Tree from "./components/tree"; // Render a tree structure using CSS

import Web3 from "web3"; // Web3 for interaction with Ethereum
/* Truffle contracts */
import DogAncestry from "./contracts/DogAncestry.json";
import { TRUFFLE_NETWORK_ID } from "./truffle";

/* Utility functions*/
import dogToTree from "./util/dogToTree";

import "./App.css";

function App() {
  const [account, setAccount] = useState(0); // The ethereum account public key.
  const [dogAncestry, setDogAncestry] = useState(null); // The Web3 DogAncestry contract interface.
  const [selectedDog, setSelectedDog] = useState(null); // The selected dog for generating the ancestry tree.
  const [search, setSearch] = useState(""); // Microchip search string.
  const [showSearchError, setShowSearchError] = useState(false); // Whether the snackbar error should show.

  /* Run this when the component first loads */
  useEffect(() => {
    (async () => {
      /* Setup new Web3 instance */
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

      /* Get account data */
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      /* Create the DogAncestry contract interface */
      setDogAncestry(
        new web3.eth.Contract(
          DogAncestry.abi,
          DogAncestry.networks[TRUFFLE_NETWORK_ID].address
        )
      );
    })();
  }, []);

  /* Method for fetching a single dog entry from the smart contract mapping */
  const fetchDog = async () => {
    /* Get the dog structure from the blockchain using our custom method */
    let dog = await dogAncestry.methods.getDog(search).call();

    /* Basic error handling */
    if (dog.microchipNumber == 0) {
      return setShowSearchError(true);
    }

    /* Get dog's ancestry */
    dog = await getAncestry(dog);
    setSelectedDog(dog);
  };

  /* Recursively get ancestry of a dog. We will want to implement pagination on this later. */
  const getAncestry = async (dog) => {
    let dam = 0;
    if (dog.dam != 0) {
      dam = await dogAncestry.methods.getDog(dog.dam).call();
    }

    let sire = 0;
    if (dog.sire != 0) {
      sire = await dogAncestry.methods.getDog(dog.sire).call();
    }

    return {
      ...dog,
      dam,
      sire,
    };
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className="navbar">
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <FaPaw style={{ paddingRight: 8 }} size="2em" />
              <Typography variant="h6" style={{ paddingRight: 8 }}>
                Pupper Tracker
              </Typography>
            </div>
          </div>
          <Button color="inherit">{account}</Button>
        </Toolbar>
      </AppBar>
      <div className="main">
        <div style={{ display: "flex", alignContent: "center", marginTop: 16 }}>
          <TextField
            fullWidth
            placeholder="Search Microchip Number"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              styles: { color: "white" },
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button color="primary" onClick={fetchDog}>
                    GO
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="tree">
          {selectedDog ? <Tree data={dogToTree(selectedDog)} /> : null}
        </div>
      </div>

      {/* Alerts */}
      <Snackbar
        open={showSearchError}
        autoHideDuration={3000}
        onClose={() => setShowSearchError(false)}
      >
        <Alert onClose={() => setShowSearchError(false)} severity="error">
          Dog not registered.
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
