/**
 * Search result - shows pedigree tree and dog information.
 */

import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
/* Custom Hooks */
import { SEVERITY, useAlert } from "../hooks/useAlert";
/* Global State */
import Ethereum from "../state/ethereum";
/*  Utils */
import dogToTree from "../util/dogToTree";
import Queue from "../util/Queue";
import AncestryGraph from "../components/ancestryGraph";
import DogLoader from "../components/dogLoader";

function SearchResult(props) {
  const theme = useTheme();
  const styles = useStyles();
  const { contracts } = Ethereum.useContainer(); // The Ethereum interface from context.
  const [dogs, setDogs] = useState([]); // A DAG of all dogs that can be reached from the selected dog.
  const [selectedDog, setSelectedDog] = useState(null);
  const alert = useAlert(); // Snackbar alert

  useEffect(() => {
    fetchDog(props.match.params.microchipnumber);
  }, []);

  /* Method for fetching a single dog entry from the smart contract mapping */
  const fetchDog = async (microchipNumber) => {
    /* Get the dog structure from the blockchain using our custom method */
    let dog = await contracts.dogAncestry.methods
      .getDog(microchipNumber)
      .call();

    /* Basic error handling */
    if (Number(dog.microchipNumber) === 0) {
      return alert.show("Dog not registered.", SEVERITY.ERROR);
    }

    /* Get dog's ancestry */
    // const ancestry = await getAncestry(dog);
    // console.log(ancestry);
    setSelectedDog(dog);

    BFS(dog);
  };

  /**
   * Recursively build the array of node links.
   * @param {Object} dog
   */
  async function getAncestry(dog) {
    if (!dog) return {};
    let damAncestors = [];
    let sireAncestors = [];

    if (Number(dog.dam) !== 0) {
      const dam = await contracts.dogAncestry.methods.getDog(dog.dam).call();
      damAncestors = await getAncestry(dam);
    }

    if (Number(dog.sire) !== 0) {
      const sire = await contracts.dogAncestry.methods.getDog(dog.sire).call();
      sireAncestors = await getAncestry(sire);
    }

    return [dog, ...damAncestors, ...sireAncestors];
  }

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
      if (t.dam != 0) neighbours.push(t.dam);
      if (t.sire != 0) neighbours.push(t.sire);

      neighbours = neighbours.filter((n) => !explored.has(n));
      await asyncForEach(neighbours, async (n) => {
        let dog = await contracts.dogAncestry.methods.getDog(n).call();
        explored.add(dog.microchipNumber);
        q.enqueue(dog);
      });
    }

    setDogs(found);
  }

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  function stripDogs() {
    return dogs.map((d) => {
      let parentIds = [];
      if (d.dam != 0) {
        parentIds.push(d.dam);
      }
      if (d.sire != 0) {
        parentIds.push(d.sire);
      }
      return {
        id: d.microchipNumber,
        parentIds,
        isRoot: d.microchipNumber == selectedDog.microchipNumber,
      };
    });
  }

  return (
    <>
      <div className={styles.pageContent}>
        {!!selectedDog || <DogLoader />}
        {selectedDog && dogs.length != 0 && (
          <AncestryGraph data={stripDogs()} />
        )}
        {/* <Padder width={theme.spacing(4)} /> */}
        {/* {genealogy && <DogCard data={genealogy} />} */}
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
