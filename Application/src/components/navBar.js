import {
  useMediaQuery,
  useTheme,
  AppBar,
  makeStyles,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
  TextField,
  InputAdornment
} from "@material-ui/core";
import React, { useState } from "react";
import { FaUser, FaUserAltSlash, FaSearch } from "react-icons/fa";

import RoutedButton from "../components/routedButton";
import RoutedMenuItem from "../components/routedMenuItem";
import Ethereum from "../state/ethereum";
import PointerLogo from "../images/pointer.svg";

const NavBar = (props) => {
  const theme = useTheme();
  const styles = useStyles();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { account } = Ethereum.useContainer(); // The Ethereum interface from context.
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [search, setSearch] = useState(""); // Microchip search string.

  const handleClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar position="static">
      <Toolbar className={styles.toolbar}>
        <div className={styles.logo}>
          {/*<img style={{ paddingRight: theme.spacing(1) }}
          src={PointerLogo} width={"96"}/> */}
          <img src= {PointerLogo} alt="BarkChain Logo" style={{ paddingRight: theme.spacing(1) }} width="60em"/>
        </div>

        {/* <RoutedButton
          asModal={isNotMobile}
          variant="text"
          color="secondary"
          to="/dogs"
        >
          Search
        </RoutedButton> */}

        <TextField
            onKeyUp={(e) => (String(e.key) === "Enter") && (search !== "") && document.getElementById("searchButton").click()}
            placeholder="Microchip Number"
            type="search"
            value={search}
            variant="outlined"
            size="small"
            onChange={(e) => setSearch(e.target.value.replace(/\D/g, ""))}
            InputProps={{
              style: { color: "white" },
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


        <RoutedButton
          asModal={isNotMobile}
          variant="text"
          color="secondary"
          to="/register"
        >
          Register Dog
        </RoutedButton>

        <Button className={styles.account} color="inherit" onClick={handleClick}>
          {(account ? <FaUser style={{ paddingRight: theme.spacing(1) }} size="1.5em" /> :
           <FaUserAltSlash style={{ paddingRight: theme.spacing(1) }} size="1.5em" />) }
          {/* (isNotMobile ? account : "Account") || "" */}
        </Button>

        <Menu
          id="simple-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={handleClose}
        >
          <Typography variant="caption" >
            {account}
          </Typography>

          <RoutedMenuItem asModal={isNotMobile} to={"/apply"}>Vet Application</RoutedMenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.palette.primary.main,
    justifyContent: "space-between",
  },

  logo: {
    display: "flex",
    justifyContent: "flex-start",
  },

  account: {
    // maxWidth: "30%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export default NavBar;
