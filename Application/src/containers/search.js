/**
 * Main application page.
 */

import React, { useState } from "react";
import {
  makeStyles,
  useTheme,
  Button,
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

  return (
    <>
      <div className={styles.pageContent}>
        <Padder height={theme.spacing(2)} />
        <div>
          <TextField
            fullWidth
            placeholder="Search Microchip Number"
            type="search"
            number
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/\D/g,''))}
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
                    variant="text"
                    color="primary"
                    to={`/search/${search}`}
                    disabled={search == ""}
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
