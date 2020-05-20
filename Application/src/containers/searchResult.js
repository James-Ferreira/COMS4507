/**
 * Search result - shows pedigree tree and dog information.
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core";
/* Custom Components */
import DogCard from "../components/dogCard";
import DogLoader from "../components/dogLoader";
import Padder from "../components/padder";
import AncestryGraph from "../components/ancestryGraph";
/* Custom Hooks */
import { SEVERITY, useAlert } from "../hooks/useAlert";
/* Global State */
import Ethereum from "../state/ethereum";
/*  Utils */
import dogToTree from "../util/dogToTree";
import { computeGenealogy } from "../util/genealogy";

function SearchResult(props) {
  const theme = useTheme();
  const styles = useStyles();
  const { contracts } = Ethereum.useContainer(); // The Ethereum interface from context.
  const [selectedDog, setSelectedDog] = useState(null); // The selected dog for generating the ancestry tree.
  const [genealogy, setGenealogy] = useState(null); // The selected dog for generating the ancestry tree.
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

  /* When the selected dog changes we need to recompute genealogy data */
  useEffect(() => {
    if (selectedDog) {
      const computedGenealogy = computeGenealogy(selectedDog);
      console.log(computedGenealogy);
      setGenealogy(computedGenealogy);
    }
  }, [selectedDog]);

  return (
    <>
      <div className={styles.pageContent}>
        {!!selectedDog || <DogLoader />}
        {selectedDog && <AncestryGraph data={dogToTree(selectedDog)} />}
        <Padder width={theme.spacing(4)} />
        {genealogy && <DogCard data={genealogy} />}
      </div>
      {alert.component}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  pageContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      margin: "5% 5%",
    },
    [theme.breakpoints.up("sm")]: {
      margin: "20px 100px",
    },
  },
}));

export default SearchResult;
