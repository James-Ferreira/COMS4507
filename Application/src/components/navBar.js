import {
  useMediaQuery,
  useTheme,
  AppBar,
  makeStyles,
  Toolbar,
  Button,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useLocation } from "react-router-dom";
import { FaPaw } from "react-icons/fa";

import Ethereum from "../state/ethereum";

const NavBar = (props) => {
  const theme = useTheme();
  const styles = useStyles();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { account } = Ethereum.useContainer(); // The Ethereum interface from context.

  return (
    <AppBar position="static">
      <Toolbar className={styles.toolbar}>
        <div className={styles.logo}>
          <FaPaw style={{ paddingRight: theme.spacing(1) }} size="2em" />
          <Typography variant="h6">Pupper Tracker</Typography>
        </div>
        <Button className={styles.account} color="inherit">
          {(isNotMobile ? account : "Account") || ""}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
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
