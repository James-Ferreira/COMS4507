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
import AboutSection from "../components/aboutSection";
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

      <div ref={refAbout} className={styles.about}>
        <AboutSection variant="left" title="PEDIGREE" IconComponent={FaSitemap}>
          The system allows a user to visually traverse a dog's pedigree, and
          view the stored information of ancestors
        </AboutSection>
        <AboutSection
          variant="right"
          title="GENETIC TRANSPARENCY"
          IconComponent={FaDna}
        >
          The application helps mitigate intentional misinformation regarding a
          dog's breed, the prevalence of inbreeding and the existence of harmful
          genetic predispositions
        </AboutSection>
        <AboutSection variant="left" title="TRUST" IconComponent={FaUserMd}>
          The system utilises veterinarians as the trusted entities responsible
          for registering a dog's information
        </AboutSection>
        <AboutSection
          variant="right"
          title="MEDICAL HISTORY"
          IconComponent={FaFileMedicalAlt}
        >
          Storing medical information on the public Barkchain prevents breeders
          witholding pertinent medical information
        </AboutSection>
        <AboutSection
          variant="left"
          title="COMPETITION AWARDS"
          IconComponent={FaTrophy}
        >
          To promote adoption of the BarkChain for breeders, the system can
          store records of competitive victories - increasing the value of a
          pedigree line
        </AboutSection>
      </div>

      <div className={styles.dogCardsContainer}>
        <div className={styles.dogCardsWrapper}>
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

  about: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    margin: "0 10%",
  },
  aboutSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  aboutSectionSide: {
    flex: 1,
  },

  dogLogo: {
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
    width: "100vw",
  },

  dogCardsWrapper: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-evenly",
    boxShadow: "inset 0px 0px 8px #00000055",
    backgroundColor: "#00000022",
    width: "max-content",
    padding: "0 1em",
    minWidth: "calc(100vw - 2em)",
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
    "&:hover": {
      transform: "scale(1.1)",
    },
  },

  infoCard: {
    border: "none",
    width: "20em",
    textAlign: "center",
  },
}));

export default Home;
