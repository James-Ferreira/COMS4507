import {
  useMediaQuery,
  useTheme,
  AppBar,
  makeStyles,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem
} from "@material-ui/core";
import React, { useState } from "react";
import { FaPaw, FaUser } from "react-icons/fa";
import Search from "../containers/search";
import RoutedButton from "../components/routedButton";
import RoutedMenuItem from "../components/routedMenuItem";
import PointerLogo from "../images/pointer.png";
import Ethereum from "../state/ethereum";


const NavBar = (props) => {
  const theme = useTheme();
  const styles = useStyles();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { account } = Ethereum.useContainer(); // The Ethereum interface from context.
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
        <div className={styles.logo}>
          {/*<img style={{ paddingRight: theme.spacing(1) }} 
          src={PointerLogo} width={"96"}/> */}

          <FaPaw style={{ paddingRight: theme.spacing(1) }} size="2em" />
          <Typography style={{justifyContent: "center"}}variant="h6">BarkChain: Pupper Tracker</Typography>
        </div>

        <Button className={styles.account} color="inherit" onClick={handleClick}>
          <FaUser style={{ paddingRight: theme.spacing(1) }} size="1.5em" />
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
      <Toolbar className={styles.navbar} variant="dense">
        <RoutedButton
          asModal={isNotMobile}
          variant="text"
          color="link"
          to="/dogs"
        >
          Search
        </RoutedButton>
        <RoutedButton
          asModal={isNotMobile}
          variant="text"
          color="link"
          to="/register"
        >
          Register Dog
        </RoutedButton>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: "space-between",
  },

  navbar: {
    justifyContent: "space-evenly",
    backgroundColor: theme.palette.secondary.main,
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
