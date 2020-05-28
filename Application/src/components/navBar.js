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
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FaUser, FaUserAltSlash } from "react-icons/fa";

import RoutedButton from "../components/routedButton";
import RoutedMenuItem from "../components/routedMenuItem";
import Ethereum from "../state/ethereum";
import PointerLogo from "../images/pointer.svg";
import DogSearchBar from "./dogSearchBar";
import { hexToRGBA } from "../util/color";
import { isHome } from "../util/navigation";

const blackToWhite = (transitionAmount) => {
  return `rgba(${transitionAmount * 255},${transitionAmount * 255}, ${
    transitionAmount * 255
  }, 1)`;
};

const NavBar = (props) => {
  const theme = useTheme();
  const styles = useStyles();
  const history = useHistory();
  const location = useLocation();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { account, isApproved, isOwner, isVet } = Ethereum.useContainer(); // The Ethereum interface from context.

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [transitionAmount, setTransitionAmount] = useState(1);

  const handleClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  useEffect(() => {
    if (isHome(location)) {
      setTransitionAmount(window.scrollY < 100 ? window.scrollY / 100 : 1);
      document.addEventListener("scroll", () => {
        setTransitionAmount(window.scrollY < 100 ? window.scrollY / 100 : 1);
      });
    } else {
      setTransitionAmount(1);
    }
  }, [location]);

  return (
    <AppBar
      position="fixed"
      style={{
        background: hexToRGBA(theme.palette.primary.main, transitionAmount),
      }}
      elevation={transitionAmount === 1 ? 4 : 0}
    >
      <Toolbar className={styles.toolbar}>
        <div className={styles.leftSection}>
          <div className={styles.logo} onClick={() => history.push("/")}>
            <img
              src={PointerLogo}
              alt="BarkChain Logo"
              style={{ paddingRight: theme.spacing(1) }}
              width="60em"
            />
          </div>
          <DogSearchBar style={{ opacity: transitionAmount }} />
        </div>
        <div className={styles.rightSection}>
          {isOwner && (
            <RoutedButton
              variant="text"
              color="secondary"
              to="/vets"
            >
              View Applications
            </RoutedButton>
          )}
          {isApproved && (
            <RoutedButton
              asModal={isNotMobile}
              variant="text"
              color="secondary"
              to="/register"
            >
              Register Dog
            </RoutedButton>
          )}

          <div style={{ color: blackToWhite(transitionAmount) }}>
            <Button
              className={styles.account}
              onClick={handleClick}
              color="inherit"
            >
              {account ? (
                <FaUser
                  style={{ paddingRight: theme.spacing(1) }}
                  size="1.5em"
                />
              ) : (
                <FaUserAltSlash
                  style={{ paddingRight: theme.spacing(1) }}
                  size="1.5em"
                />
              )}
            </Button>
          </div>
        </div>

        <Menu
          id="simple-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={handleClose}
        >
          <Typography variant="caption">{account || "Not logged in"}</Typography>
          {
            isVet &&
            <Typography variant="caption">Status: {isApproved ? "Approved " : "Not Approved"}</Typography>
          }
        
          {
            !isApproved && 
            <RoutedMenuItem asModal={isNotMobile} to={"/apply"}>
              Vet Application
            </RoutedMenuItem>
          }
        </Menu>
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
    cursor: "pointer",
    paddingRight: 20,
  },
  account: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  leftSection: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  rightSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 2,
  },
}));

export default NavBar;
