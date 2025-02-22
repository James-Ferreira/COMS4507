import React, { useState } from "react";
import { TextField, InputAdornment } from "@material-ui/core";
import { FaSearch } from "react-icons/fa";
import RoutedButton from "../components/routedButton";

const DogSearchBar = (props) => {
  const [search, setSearch] = useState(""); // Microchip search string.

  return (
    <TextField
      onKeyUp={(e) =>
        String(e.key) === "Enter" &&
        search !== "" &&
        document.getElementById("searchButton").click()
      }
      placeholder="Microchip Number"
      type="search"
      value={search}
      variant="outlined"
      fullWidth
      size="small"
      onChange={(e) => setSearch(e.target.value)}
      InputProps={{
        style: { color: "inherit", ...props.style },
        startAdornment: (
          <InputAdornment position="start">
            <FaSearch />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <RoutedButton
              id="searchButton"
              to={`/dogs/${search}`}
              disabled={search === ""}
              color="secondary"
              variant="contained"
              size="small"
            >
              Go
            </RoutedButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default DogSearchBar;
