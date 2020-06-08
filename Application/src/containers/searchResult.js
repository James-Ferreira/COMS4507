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
import { computeGenealogy } from "../util/genealogy";
import Queue from "../util/Queue";

import { computeUnions } from "../util/processDogList";

function SearchResult(props) {
  const theme = useTheme();
  const styles = useStyles();
  const { contracts } = Ethereum.useContainer(); // The Ethereum interface from context.
  const [selectedDog, setSelectedDog] = useState(null); // The selected dog for generating the ancestry tree.
  const [dogs, setDogs] = useState([]); // A DAG of all dogs that can be reached from the selected dog.
  const [familyTreeData, setFamilyTreeData] = useState(null); // A DAG of all dogs that can be reached from the selected dog.
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

    const localDogs = await BFS(dog);
    
    /* Get dog's ancestry */
    dog = getAncestry(dog, localDogs);

    setDogs(localDogs);
    setSelectedDog(dog);
  };

  /* Recursively get ancestry of a dog. We will want to implement pagination on this later. */
  const getAncestry = (root, dogsList) => {
    /* Create a new array to store the ancestors as a list rather than a tree */
    let dam = 0;
    if (Number(root.dam) !== 0) {
      dam = dogsList.find(d => d.microchipNumber == root.dam)
      dam = getAncestry(dam, dogsList);
    }

    let sire = 0;
    if (Number(root.sire) !== 0) {
      sire = dogsList.find(d => d.microchipNumber == root.sire)
      sire = getAncestry(sire, dogsList);
    }

    return {
      ...root,
      dam,
      sire,
    };
  };

  async function BFS(root) {
    // Create a Queue and add our initial node in it
    let found = [];
    let q = new Queue();
    let explored = new Set();
    q.enqueue(root);

    // Mark the first node as explored explored.
    explored.add(root.microchipNumber);

    // We'll continue till our queue gets empty
    while (!q.isEmpty()) {
      let t = q.dequeue();

      // Push each node to the found list before processing.
      found.push(t);

      // 1. In the edges object, we search for nodes this node is directly connected to.
      // 2. We filter out the nodes that have already been explored.
      // 3. Then we mark each unexplored node as explored and add it to the queue.
      let neighbours = t.offspring;
      if (Number(t.dam) !== 0) neighbours.push(t.dam);
      if (Number(t.sire) !== 0) neighbours.push(t.sire);

      neighbours = neighbours.filter((n) => !explored.has(n));
      await asyncForEach(neighbours, async (n) => {
        let dog = await contracts.dogAncestry.methods.getDog(n).call();
        explored.add(dog.microchipNumber);
        q.enqueue(dog);
      });
    }
    return found;
  }

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

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
      setGenealogy(computedGenealogy);
    }
  }, [selectedDog]);

  useEffect(() => {
    if (!dogs || !selectedDog) {
      return;
    }

    const data = computeUnions(dogs);
    data.start = selectedDog.microchipNumber;
    setFamilyTreeData(data);
  }, [dogs, selectedDog]);

  return (
    <>
      <div className={styles.pageContent}>
        {!!selectedDog || <DogLoader />}
        {familyTreeData && <AncestryGraph data={familyTreeData} />}
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
