/**
 * Search result - shows pedigree tree and dog information.
 */

import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import RunningDog from "../images/runningDog.gif";

import { useLocation } from "react-router-dom";

import Padder from "../components/padder";

import dogToTree from "../util/dogToTree";

/* Tree */
import DagAttempt from "../components/dagAttempt";

/* Custom Hooks */
import { useAlert, SEVERITY } from "../hooks/useAlert";

/* Global State */
import Ethereum from "../state/ethereum";

function SearchResult(props) {
  const theme = useTheme();
  const styles = useStyles();
  const { contracts } = Ethereum.useContainer(); // The Ethereum interface from context.
  const [selectedDog, setSelectedDog] = useState(null); // The selected dog for generating the ancestry tree.
  const alert = useAlert(); // Snackbar alert
  const location = useLocation();

  const [prevSearch, setPrevSearch] = useState(null);
  const search = props.match.params.microchipnumber;

  /* Method for fetching a single dog entry from the smart contract mapping */
  const fetchDog = async () => {
    /* Get the dog structure from the blockchain using our custom method */
    let dog = await contracts.dogAncestry.methods.getDog(search).call();

    /* Basic error handling */
    if (Number(dog.microchipNumber) === 0) {
      return alert.show("Dog not registered.", SEVERITY.ERROR);
    }

    /* Get dog's ancestry */
    dog = await getAncestry(dog);
    setSelectedDog(dog);
  };

  /* Recursively get ancestry of a dog. We will want to implement pagination on this later. */
  const getAncestry = async (dog) => {
    let dam = 0;
    if (Number(dog.dam) !== 0) {
      dam = await contracts.dogAncestry.methods.getDog(dog.dam).call();
      dam = await getAncestry(dam);
    }

    let sire = 0;
    if (Number(dog.sire) !== 0) {
      sire = await contracts.dogAncestry.methods.getDog(dog.sire).call();
      sire = await getAncestry(sire);
    }

    return {
      ...dog,
      dam,
      sire,
    };
  };

  const updateDog = async () => {
    /* Get the dog structure from the blockchain using our custom method */
    let dog = await contracts.dogAncestry.methods.getDog(search).call();

    // we don't want to get the whole ancestry again, so we'll just plug in the old one.
    let dam = selectedDog ? selectedDog.dam : 0;
    let sire = selectedDog ? selectedDog.sire : 0;
    dog = { ...dog, dam, sire };

    setSelectedDog(dog);
  };

  if (prevSearch !== search) {
    setPrevSearch(search);
    fetchDog();
  }

  if (location.state && location.state.requestDogUpdate) {
    location.state.requestDogUpdate = false;
    updateDog();
  }

  return (
    <>
      <div className={styles.pageContent}>
        <Padder height={theme.spacing(2)} />

        {/* --- PEDIGREE TREE --- */}
        <div>
          {selectedDog ? (
            <DagAttempt data={dogToTree(selectedDog)} />
          ) : (
            <div
              style={{
                textAlign: "center",
                marginTop: "5em",
              }}
            >
              <img src={RunningDog} alt="Loading Icon" />
            </div>
          )}
        </div>
      </div>

      {alert.component}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  pageContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    [theme.breakpoints.down("sm")]: {
      margin: "0 5%",
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0 100px",
    },
  },
}));

export default SearchResult;
