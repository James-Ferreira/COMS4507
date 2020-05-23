/**
 * Main application page.
 */

import React, {useState, useEffect} from "react";

import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  CardHeader,
  Avatar,
} from "@material-ui/core";

import Ethereum from "../state/ethereum";

import RoutedButton from "../components/routedButton";

import Padder from "../components/padder";
import DogSearchBar from "../components/dogSearchBar";

/* Images and Icons */
import { 
  FaSitemap, 
  FaFileMedicalAlt,
  FaDna, 
  FaUserMd,
  FaTrophy,
  FaVenus,
  FaMars,
} from "react-icons/fa";

function Home() {
  const theme = useTheme();
  const styles = useStyles();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));

  const { contracts } = Ethereum.useContainer();

  const [ latestDogs, setLatestDogs ] = useState([]);
  let allDogs = [...latestDogs];
  let initTimeout;
  
  const catchDogRegistration = async (event) => {
    // fetch the dog 
    let newDog = await contracts.dogAncestry.methods.getDog(event.returnValues.dogId).call();
    
    allDogs.push(newDog);

    if (initTimeout) window.clearTimeout(initTimeout);
    
    initTimeout = window.setTimeout(() => {
      console.log("updating");
      
      let latest6 = []
      for (var i = 0; i < 6 && i < allDogs.length; i++) {
        latest6.push(allDogs[allDogs.length - 1 - i]);
      }
      setLatestDogs(latest6);
    }, 500);
  }

  useEffect(() => {
    // listen for the event
    contracts.dogAncestry.events.DogRegistered({
      fromBlock: 0
      }, function(error, event){
        catchDogRegistration(event)
      }
    )
  }, []);

  if (isNotMobile) {
    return (
      <div className={styles.landingWrapper}>

        <div className={styles.titleWrapper}>
          <div className={styles.titleTextWrapper}>
            <Typography variant="h2" style={{color: theme.palette.primary.light}}> 
              BarkChain 
            </Typography>

            <Typography variant="body1" style={{color: theme.palette.primary.light}}>
              <strong>BarkChain</strong> is an Ethereum-based dog pedigree
              system designed to  increase the transparency of a dog’s lineage
              and medical history through Blockchain technology.
              <br/><br/>
            </Typography>

            <DogSearchBar />
            
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
                breeders witholding pertinent medical information.
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

        <div className={styles.dogCardsContainer}><div className={styles.dogCardsWrapper}>
          {latestDogs && latestDogs.map(dog => (
            <Card className={styles.dogCard} key={dog.microchipNumber}>
              <CardHeader
                avatar={
                  dog.isBitch ? (
                    <Avatar variant="rounded" style={{ backgroundColor: "#d8b2db" }}>
                      <FaVenus size="1.25em" />
                    </Avatar>
                  ) : (
                    <Avatar variant="rounded" style={{ backgroundColor: "#99acc9" }}>
                      <FaMars size="1.25em" />
                    </Avatar>
                  )
                }
                title={`${dog.name}`}
                titleTypographyProps={{ variant: "h6" }}
                subheader={`ID: (${dog.microchipNumber})`}
              />

              <CardContent>
                <center>
                  <RoutedButton
                    to={`/dogs/${dog.microchipNumber}`}
                    variant="contained"
                    color="primary"
                  >
                    View
                  </RoutedButton>
                </center>
              </CardContent>
            </Card>
          ))}
        </div></div>
        

      </div>

    );
  } else {
    return <DogSearchBar />;
  }
};

const useStyles = makeStyles((theme) => ({

  landingWrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 64px)"
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
    alignItems: "center",
    flexWrap: "wrap",
    flexGrow: "1",
  },

  dogCardsContainer: {
    overflowX: "auto",
    backgroundColor: theme.palette.primary.main,
    //boxShadow: "inset 0px 0px 8px #00000055",
    padding: "2em 0",
    width: "100vw"
  },

  dogCardsWrapper: {
    display: "flex",
    justifyContent: "space-evenly",
    boxShadow: "inset 0px 0px 8px #00000055",
    backgroundColor: "#00000022",
    width: "max-content",
    padding: "0 1em",
    minWidth: "calc(100vw - 2em)"
  },

  cardImg: {
    color: theme.palette.secondary.dark,
    size: "5em",
  },

  dogCard: {
    width: "15em",
    minWidth: "15em",
    maxWidth: "15em",
    margin: "0 1em",    
    backgroundColor: theme.palette.secondary.main,
    transform: "scale(0.9)",
    transition: "transform 0.1s ease",
    '&:hover': {
      transform: "scale(1.1)"
    }
  },

  infoCard : {
    border: "none",
    width: "20em",
    textAlign: "center",
  },

}));

export default Home;
