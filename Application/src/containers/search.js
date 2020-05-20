/**
 * Microchip Search Component.
 */

import React, { useState } from "react";
import {
  makeStyles,
  useTheme,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { FaSearch } from "react-icons/fa";

import RoutedButton from "../components/routedButton";
import Padder from "../components/padder";

function Search() {
  const theme = useTheme();
  const styles = useStyles();

  const [search, setSearch] = useState(""); // Microchip search string.

  const doSearch = () => {
    if (search !== "") document.getElementById("searchButton").click();
  };

  return (
    <>
      <div className={styles.pageContent}>
        <Padder height={theme.spacing(2)} />
        <div>
          <TextField
            onKeyUp={(e) => String(e.key) === "Enter" && doSearch()}
            fullWidth
            placeholder="Search Microchip Number"
            type="search"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/\D/g, ""))}
            InputProps={{
              styles: { color: "white" },
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <RoutedButton
                    id="searchButton"
                    variant="text"
                    to={`/dogs/${search}`}
                    disabled={search === ""}
                  >
                    Go
                  </RoutedButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <Padder height={theme.spacing(2)} />
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

export default Search;
