/**
 * Main application page.
 */

import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  CardHeader,
  Avatar,
  Fab,
  Paper,
  CardActions,
} from "@material-ui/core";

/* Images and Icons */
import {
  FaSitemap,
  FaFileMedicalAlt,
  FaDna,
  FaUserMd,
  FaTrophy,
  FaVenus,
  FaMars,
  FaChevronDown,
} from "react-icons/fa";

import Ethereum from "../state/ethereum";
import RoutedButton from "../components/routedButton";
import Padder from "../components/padder";
import DogSearchBar from "../components/dogSearchBar";
import AboutCard from "../components/aboutCard";
import scrollToRef from "../util/scrollToRef";

function Home() {
  const theme = useTheme();
  const styles = useStyles();
  const history = useHistory();
  const refAbout = useRef("about");
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  const { contracts } = Ethereum.useContainer();
  const [latestDogs, setLatestDogs] = useState([]);

  let collectedDogs = [];
  let initTimeout;

  const catchDogRegistration = async (event) => {
    // fetch the dog
    let newDog = await contracts.dogAncestry.methods
      .getDog(event.returnValues.dogId)
      .call();

    //console.log(newDog);
    collectedDogs.push(newDog);

    if (initTimeout) window.clearTimeout(initTimeout);
    initTimeout = window.setTimeout(() => {
      console.log("updating recent dogs");

      //first thing we want to do is truncate the collectedDogs list so it doesn't get too big
      if (collectedDogs.length > 6) {
        collectedDogs.splice(0, collectedDogs.length - 6); // this will keep the latest 6 dogs
      }

      //we now take a snapshot
      let snapshot = [...collectedDogs];

      //just in case any dogs were added in this time, we want to bring the snapshot array back down to 6
      if (snapshot.length > 6) {
        snapshot.splice(0, snapshot.length - 6);
      }

      setLatestDogs(snapshot);
    }, 500);
  };

  useEffect(() => {
    // listen for the event
    contracts.dogAncestry.events.DogRegistered(
      {
        fromBlock: 0,
      },
      function (error, event) {
        catchDogRegistration(event);
      }
    );
  }, []);

  return (
    <div className={styles.landingWrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.titleTextWrapper}>
          {/* Header and Search Bar */}
          <div className={styles.titleText}>
            <Typography
              variant="h2"
              style={{ color: theme.palette.primary.main }}
            >
              BarkChain
            </Typography>
            <Typography
              variant="body1"
              style={{ color: theme.palette.primary.main }}
            >
              <strong>BarkChain</strong> is an Ethereum-based dog pedigree
              system designed to increase the transparency of a dog’s lineage
              and medical history through Blockchain technology.
              <br />
              <br />
            </Typography>
            <div className={styles.searchBar}>
              <DogSearchBar />
            </div>
          </div>
          {/* Learn More Button */}
          <div>
            <Fab
              variant="extended"
              color="primary"
              onClick={() =>
                scrollToRef(refAbout, theme.mixins.toolbar.minHeight)
              }
            >
              Learn More
              <Padder width={theme.spacing(1)} />
              <FaChevronDown size={32} />
            </Fab>
          </div>
        </div>
      </div>

      <div ref={refAbout} className={styles.additionalInfo}>
        <div className={styles.about}>
          <AboutCard variant="left" title="PEDIGREE" IconComponent={FaSitemap}>
            The system allows a user to visually traverse a dog's pedigree, and
            view the stored information of ancestors
          </AboutCard>
          <AboutCard
            variant="right"
            title="GENETIC TRANSPARENCY"
            IconComponent={FaDna}
          >
            The application helps mitigate intentional misinformation regarding
            a dog's breed, the prevalence of inbreeding and the existence of
            harmful genetic predispositions
          </AboutCard>
          <AboutCard variant="left" title="TRUST" IconComponent={FaUserMd}>
            The system utilises veterinarians as the trusted entities
            responsible for registering a dog's information
          </AboutCard>
          <AboutCard
            variant="right"
            title="MEDICAL HISTORY"
            IconComponent={FaFileMedicalAlt}
          >
            Storing medical information on the public Barkchain prevents
            breeders witholding pertinent medical information
          </AboutCard>
          <AboutCard
            variant="left"
            title="COMPETITION AWARDS"
            IconComponent={FaTrophy}
          >
            To promote adoption of the BarkChain for breeders, the system can
            store records of competitive victories - increasing the value of a
            pedigree line
          </AboutCard>
        </div>
        <div className={styles.recentDogs}>
          <Typography variant="h4">Recent Registrations</Typography>
          <Padder height={theme.spacing(1)} />
          <div className={styles.recentDogsList}>
            {latestDogs &&
              latestDogs.map((dog) => (
                <Card className={styles.dogCard} key={dog.microchipNumber}>
                  <CardHeader
                    avatar={
                      dog.isBitch ? (
                        <Avatar
                          variant="rounded"
                          style={{ backgroundColor: "#d8b2db" }}
                        >
                          <FaVenus size="1.25em" />
                        </Avatar>
                      ) : (
                        <Avatar
                          variant="rounded"
                          style={{ backgroundColor: "#99acc9" }}
                        >
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
          </div>
        </div>
      </div>
    </div>
  );
}

const splashURL =
  "https://images.unsplash.com/photo-1504826260979-242151ee45b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=3226&q=80";

const useStyles = makeStyles((theme) => ({
  landingWrapper: {
    display: "flex",
    flexDirection: "column",
  },

  titleWrapper: {
    height: `${window.innerHeight}px`,
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    backgroundImage: `url(${splashURL})`,
    backgroundSize: "120%",
    backgroundPosition: "30% 42%",
    [theme.breakpoints.down("xs")]: {
      backgroundSize: "180%",
      backgroundPosition: "42% 20%",
    },
  },

  titleTextWrapper: {
    paddingTop: "10vh",
    paddingBottom: "5vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      margin: "0px 5%",
    },
    [theme.breakpoints.up("sm")]: {
      margin: "0px 10%",
    },
    [theme.breakpoints.up("md")]: {
      margin: "0px 25%",
    },
  },

  titleText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  searchBar: {
    alignSelf: "center",
    width: "80%",
  },

  learnMoreButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: 100,
    height: 100,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    textDecoration: "none",
    color: "white",
  },

  additionalInfo: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    height: `${window.innerHeight - theme.mixins.toolbar.minHeight}px`,
  },
  about: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
    margin: "0 10%",
  },

  dogLogo: {
    width: "15em",
  },

  recentDogs: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100vw",
    textAlign: "center",
    margin: "2vh 0",
  },

  recentDogsList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: "0% 1%",
  },

  cardImg: {
    color: theme.palette.secondary.dark,
    size: "5em",
  },

  dogCard: {
    textAlign: "left",
    transform: "scale(0.9)",
    transition: "transform 0.1s ease",
    "&:hover": {
      transform: "scale(1.0)",
    },
    flex: 1,
    margin: 5,
  },
}));

export default Home;
