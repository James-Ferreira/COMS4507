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
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FaUser, FaUserAltSlash } from "react-icons/fa";

import RoutedButton from "../components/routedButton";
import RoutedMenuItem from "../components/routedMenuItem";
import Ethereum from "../state/ethereum";
import PointerLogo from "../images/pointer.svg";
import DogSearchBar from "./dogSearchBar";

const NavBar = (props) => {
  const theme = useTheme();
  const styles = useStyles();
  const history = useHistory();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { account, isApproved } = Ethereum.useContainer(); // The Ethereum interface from context.

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar position="static">
      <Toolbar className={styles.toolbar}>
        <div className={styles.logo} onClick={() => history.push("/") }>
          {/*<img style={{ paddingRight: theme.spacing(1) }}
          src={PointerLogo} width={"96"}/> */}
          <img src= {PointerLogo} alt="BarkChain Logo" style={{ paddingRight: theme.spacing(1) }} width="60em"/>
        </div>

        <DogSearchBar />

        { isApproved ? 
        <RoutedButton
          asModal={isNotMobile}
          variant="text"
          color="secondary"
          to="/register"

        >
          Register Dog
        </RoutedButton>
        : null
        }

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
    cursor: "pointer"
  },

  account: {
    // maxWidth: "30%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export default NavBar;
