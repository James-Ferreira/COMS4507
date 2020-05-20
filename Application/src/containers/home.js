/**
 * Main application page.
 */

import React from "react";
import Search from "../containers/search";


import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import Padder from "../components/padder";

/* Images and Icons */
import { 
  FaSitemap, 
  FaFileMedicalAlt,
  FaDna, 
  FaUserMd,
  FaTrophy,
} from "react-icons/fa";



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
              <strong>BarkChain</strong> is an Ethereum-based dog pedigree
              system designed to  increase the transparency of a dog’s lineage
              and medical history through Blockchain technology.
              <br/><br/>
            </Typography>

            <Search />

          </div>

        </div>

        <div className={styles.cardsWrapper}>

          <Card className={styles.infoCard}>
            <CardContent>
              <FaSitemap color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} variant="h6">
                PEDIGREE
              </Typography>
              <Padder height={theme.spacing(2)} />
              <Typography variant="body2">
                The system allows a user to visually traverse a dog's pedigree,
                and view the stored information of ancestors
              </Typography>
            </CardContent>
          </Card>

          <Card className={styles.infoCard}>
            <CardContent>
              <FaDna color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} variant="h6">
                GENETIC TRANSPARENCY
              </Typography>
              <Padder height={theme.spacing(2)} />
              <Typography variant="body2">
                The application helps mitigate intentional
                misinformation regarding a dog's breed, the prevalence of
                inbreeding and the existence of harmful genetic predispositions
              </Typography>
            </CardContent>           
          </Card>

        <Card className={styles.infoCard}>
            <CardContent>
              <FaUserMd color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} variant="h6">
                TRUST
              </Typography>
              <Padder height={theme.spacing(2)} />
              <Typography variant="body2">
                The system utilises veterinarians as the trusted entities
                responsible for registering a dog's information

              </Typography>
            </CardContent>
          </Card>

          <Card className={styles.infoCard}>
            <CardContent>
              <FaFileMedicalAlt color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} variant="h6">
                MEDICAL HISTORY
              </Typography>
              <Padder height={theme.spacing(2)} />
              <Typography variant="body2">
                Storing medical information on the public Barkchain prevents
                breeders witholding pertinent medical information from a 
                potential buyer and may expediate the process of medical 
                diagnosis
              </Typography>
            </CardContent>
          </Card>

          <Card className={styles.infoCard}>
            <CardContent>
              <FaTrophy color= {theme.palette.secondary.dark} size="5em"/>
              <Typography 
              style={{color: theme.palette.secondary.dark}} variant="h6">
                COMPETITION AWARDS
              </Typography>
              <Padder height={theme.spacing(2)} />
              <Typography variant="body2">
                To promote adoption of the BarkChain for breeders, the system
                can store records of competitive victories - increasing the
                value of a pedigree line
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
