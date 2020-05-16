/**
 * Main application page.
 */

import React, { useState } from "react";
import {
  makeStyles,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { FaSearch } from "react-icons/fa";

import RoutedButton from "../components/routedButton";
import Padder from "../components/padder";

/* Tree */
import Pedigree from "../components/tree/Pedigree";

/* Custom Hooks */
import { useAlert, SEVERITY } from "../hooks/useAlert";

/* Global State */
import Ethereum from "../state/ethereum";

function Home() {
  const theme = useTheme();
  const styles = useStyles();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { contracts } = Ethereum.useContainer(); // The Ethereum interface from context.
  const [selectedDog, setSelectedDog] = useState(null); // The selected dog for generating the ancestry tree.
  const [search, setSearch] = useState(""); // Microchip search string.
  const alert = useAlert(); // Snackbar alert

  /* Method for fetching a single dog entry from the smart contract mapping */
  const fetchDog = async () => {
    /* Get the dog structure from the blockchain using our custom method */
    let dog = await contracts.dogAncestry.methods.getDog(search).call();

    /* Basic error handling */
    if (dog.microchipNumber == 0) {
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

  return (
    <>
      <div className={styles.pageContent}>
        <Padder height={theme.spacing(2)} />
        <RoutedButton
          asModal={isNotMobile}
          to="/register"
          variant="contained"
          color="secondary"
        >
          Register Dog
        </RoutedButton>
        <Padder height={theme.spacing(2)} />
        <div>
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

        {/* --- PEDIGREE TREE --- */}
        <div>{selectedDog && <Pedigree treeRoot={selectedDog} /> }</div>
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

export default Home;
