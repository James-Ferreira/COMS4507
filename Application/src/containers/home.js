/**
 * Main application page.
 */

import React from "react";
import Search from "../containers/search";


import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

/* Images and Icons */
import { 
  FaSitemap, 
  FaFileMedicalAlt,
  FaDna, 
  FaUserMd,
} from "react-icons/fa";

import PointerLogo from "../images/pointer.svg";
import { FlexibleHeightXYPlot } from "react-vis/dist/make-vis-flexible";

function Home() {
  const theme = useTheme();
  const styles = useStyles();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));

  if (isNotMobile) {
    return (
      <div className={styles.landingWrapper}>

        <div className={styles.titleWrapper}>
          <div className={styles.titleTextWrapper}>
            <Typography variant="h1" style={{color: theme.palette.secondary.light}}> 
              BarkChain 
            </Typography>

            <Typography variant="body1" style={{color: theme.palette.secondary.light}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Aliquam volutpat metus a est molestie, ac varius mauris accumsan. 
              Phasellus vel finibus ipsum, et sagittis lectus. Suspendisse non 
              neque vulputate dolor dignissim egestas. Cras lobortis odio at 
              dolor rutrum ornare. Nunc dictum ut nisi ut luctus. Fusce aliquet 
              dignissim eros quis hendrerit.
            </Typography>
          </div>

        </div>

        <div className={styles.cardsWrapper}>
          <Card className={styles.infoCard}>

            <CardContent>
              <FaSitemap color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} 
              variant="h6">
                PEDIGREE
              </Typography>

              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Aliquam volutpat metus a est molestie, ac varius mauris accumsan. 
                Phasellus vel finibus ipsum, et sagittis lectus. Suspendisse non 
                neque vulputate dolor dignissim egestas. Cras lobortis odio at 
                dolor rutrum ornare. Nunc dictum ut nisi ut luctus. Fusce aliquet 
                dignissim eros quis hendrerit.
              </Typography>
            </CardContent>

          </Card>

          <Card className={styles.infoCard}>
            <CardContent>
              <FaFileMedicalAlt color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} 
              variant="h6">
                MEDICAL HISTORY
              </Typography>

              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Aliquam volutpat metus a est molestie, ac varius mauris accumsan. 
                Phasellus vel finibus ipsum, et sagittis lectus. Suspendisse non 
                neque vulputate dolor dignissim egestas. Cras lobortis odio at 
                dolor rutrum ornare. Nunc dictum ut nisi ut luctus. Fusce aliquet 
                dignissim eros quis hendrerit.
              </Typography>
            </CardContent>
          </Card>

          <Card className={styles.infoCard}>
            <CardContent>
              <FaDna color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} 
              variant="h6">
                GENETIC DATA
              </Typography>

              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Aliquam volutpat metus a est molestie, ac varius mauris accumsan. 
                Phasellus vel finibus ipsum, et sagittis lectus. Suspendisse non 
                neque vulputate dolor dignissim egestas. Cras lobortis odio at 
                dolor rutrum ornare. Nunc dictum ut nisi ut luctus. Fusce aliquet 
                dignissim eros quis hendrerit.
              </Typography>
            </CardContent>

            
          </Card>

          <Card className={styles.infoCard}>
            <CardContent>
              <FaUserMd color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} 
              variant="h6">
                VETERINARIAN CONTROL
              </Typography>

              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Aliquam volutpat metus a est molestie, ac varius mauris accumsan. 
                Phasellus vel finibus ipsum, et sagittis lectus. Suspendisse non 
                neque vulputate dolor dignissim egestas. Cras lobortis odio at 
                dolor rutrum ornare. Nunc dictum ut nisi ut luctus. Fusce aliquet 
                dignissim eros quis hendrerit.
              </Typography>
            </CardContent>
          </Card>

        </div>
      </div>

    );
  } else {
    return <Search />;
  }
};

const useStyles = makeStyles((theme) => ({

  landingWrapper: {
  },

  titleWrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "5em",
    backgroundColor: theme.palette.primary.main,
    textAlign: "center",
  },

  titleTextWrapper: {
    width: "35%",
  },

  dogLogo:{
    width: "15em",
  },
  
  cardsWrapper: {
    padding: "2em",
    display: "flex",
    justifyContent: "space-evenly",
  },

  cardImg: {
    color: theme.palette.secondary.dark,
    size: "5em",
  },

  infoCard : {
    border: "none",
    width: "20em",
    textAlign: "center",
  },

}));

export default Home;
