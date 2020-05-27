/**
 * A card with dog information.
 *
 * //TODO: add labels of % in pie chart
 */

import React from "react";
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
  List,
  ListItemText,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

import clsx from "clsx";
import { 
  FaChevronDown, 
  FaMars, 
  FaVenus,
  FaQuestionCircle
} from "react-icons/fa";

import Padder from "./padder";

import {
  RadialChart,
  GradientDefs,
  XYPlot,
  HorizontalBarSeries,
  XAxis,
  DiscreteColorLegend,
} from "react-vis";

import RoutedButton from "./routedButton";
import { calculateBreedData } from "../util/genealogy";

const moment = require("moment");

const useStyles = makeStyles((theme) => ({
  root: {
    // width: 450,
    flex: 1,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  logo: {
    display: "flex",
    justifyContent: "flex-start",
  },

  dialogButton: {
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
  },

}));

const DogCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));

  const [expanded, setExpanded] = React.useState(false);
  const [recordsExpanded, setRecordsExpanded] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [recordFilter, setRecordFilter] = React.useState("all");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandRecordsClick = () => {
    setRecordsExpanded(!recordsExpanded);
  };

  const handleDialogClick = () => {
    setDialogOpen(!dialogOpen);
  };

  let dog = props.data;
  let breedData = calculateBreedData(dog.breedMap);

  return (
    <Card className={classes.root}>
      <CardHeader
        classes={{
          action: classes.dialogButton,
        }}
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
        action={
          <Button
            variant="text" 
            onClick={handleDialogClick}
          >
            <FaQuestionCircle size="1.75em"
              style={{ color: theme.palette.secondary.dark }}
            />
          </Button>
        }
      />

      {/*-- BASIC INFO -- */}
      <CardContent>

        <List>
          <ListItemText>
            <strong>Date-of-Birth: </strong> {moment.unix(dog.dob).format("DD/MM/YYYY")}
          </ListItemText>
          <ListItemText>
            <strong>Breeder ID: </strong>{" "}
            {dog.breederId !== 0
              ? `${dog.breederId}`
              : "Unknown"}
          </ListItemText>
          <ListItemText>
            <strong>Colour{dog.colours.length > 1 && "s"}:</strong> {dog.colours.join(", ")}
          </ListItemText>
          <ListItemText>
            <strong>Dam: </strong>{" "}
            {dog.dam !== 0
              ? `${dog.dam.name} (${dog.dam.microchipNumber})`
              : "Unknown"}
          </ListItemText>
          <ListItemText>
            <strong>Sire: </strong>{" "}
            {dog.sire !== 0
              ? `${dog.sire.name} (${dog.sire.microchipNumber})`
              : "Unknown"}
          </ListItemText>
        </List>

      </CardContent>

      <Divider />

      {/*-- COLLAPSIBLE INFORMATION-- */}
      
      <div
        title={expanded ? "Hide Statistics" : "Show Statistics"}
        className="collapseLabel"
        onClick={handleExpandClick}
      >
        <h3>Statistics</h3>

        <IconButton
          className={clsx(classes.expand, { [classes.expandOpen]: expanded })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <FaChevronDown size={15} />
        </IconButton>
      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/*-- BREED INFORMATION -- */}
        <CardContent>
          <div id="radial-graph-wrapper">
            <div id="chart-wrapper">
              <RadialChart
                colorType={"literal"}
                style={{ stroke: "#fff", strokeWidth: 3 }}
                width={200}
                height={200}
                animation
                margin={{ top: 100 }}
                data={breedData}
              />
            </div>

            <div id="legend-wrapper"  style={{display: "flex"}}>
              <div style={{alignSelf: "center"}}>
                <DiscreteColorLegend
                  items={breedData.map((x) => x.label + " [" + x.angle + "%]")}
                  colors={breedData.map((x) => x.color)}
                />
              </div>
            </div>
          </div>
          <Divider />

          {/*-- INBREEDING COEFFICIENT DISPLAY -- */}
          <Typography align="center">
            <br />
            Co-efficient of Inbreeding [{`${dog.coi}`}]
          </Typography>         


          <XYPlot width={350} height={75} xDomain={[0, 1]}>
            <GradientDefs>
              <linearGradient id="grad4" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="green" stopOpacity={0.4} />
                <stop offset="100%" stopColor="red" stopOpacity={0.3} />
              </linearGradient>
            </GradientDefs>

            <XAxis tickTotal={4} style={{ fontSize: "12px", fill: "grey" }} />

            <HorizontalBarSeries
              animation
              color={"url(#grad4)"}
              style={{ rx: "5", ry: "5" }}
              data={[
                { x: dog.coi, y: 1, gradientLabel: "grad1", label: "curr" },
              ]}
            />
          </XYPlot>
          <Divider />

          <Typography align="center" variant="caption" className={classes.info}>
            <br />
            Calculated using <strong> {`${dog.generation}`} </strong>
            generations and <strong> {`${dog.ancestors.size}`} </strong>
            ancestors
          </Typography>
        </CardContent>
      </Collapse>

      <Divider />

      {/*-- COLLAPSIBLE RECORDS DISPLAY -- */}
      <div
        title={
          recordsExpanded ? "Hide Medical Records" : "Show Medical Records"
        }
        className="collapseLabel"
        onClick={handleExpandRecordsClick}
      >
        <h3>Medical Records</h3>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: recordsExpanded,
          })}
          onClick={handleExpandRecordsClick}
          aria-expanded={recordsExpanded}
          aria-label="show records"
        >
          <FaChevronDown size={15} />
        </IconButton>
      </div>

      <Collapse in={recordsExpanded} timeout="auto" unmountOnExit>
        <CardContent>
           {/* <Padder height={theme.spacing(2)} /> */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Select
            margin="dense"
            align="left"
            type="text"
            value={recordFilter}
            onChange={(e) => setRecordFilter(e.target.value)}
            >
              <MenuItem value="all">All Records</MenuItem>
              <MenuItem value="vaccination">Vaccinations</MenuItem>
              <MenuItem value="genetic-condition">Genetic Conditions</MenuItem>
              <MenuItem value="award">Awards</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <RoutedButton
              asModal={isNotMobile}
              to={`/dogs/${dog.microchipNumber}/records/create`}
              variant="contained"
              color="secondary"
            >
              Add Record
            </RoutedButton>
          </div>

          <Padder height={theme.spacing(2)} />
          {dog.medicals &&
            dog.medicals.filter(x => recordFilter == "all" || x.recordType == recordFilter).map((record, index) => (
              <>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <RoutedButton
                    asModal={isNotMobile}
                    to={`/dogs/${dog.microchipNumber}/records/${index}`}
                    variant="link"
                    color="secondary"
                  >
                    {record.title}
                  </RoutedButton>
                  <p>{moment.unix(record.date).format("DD/MM/YYYY")}</p>
                </div>
                <Divider />
              </>
            ))}
          {!dog.medicals || !dog.medicals.some(x => recordFilter == "all" || x.recordType == recordFilter) && <p>No Records Found</p>}
        </CardContent>
      </Collapse>


      
      {/*-- POPUP ADDITIONAL INFO -- */} 
      <Dialog
          open={dialogOpen}
          onClose={handleDialogClick}
          aria-labelledby="info-dialog-title"
          aria-describedby="info-dialog-description"
        >
          <DialogTitle id="info-dialog-title">{"Additional Information"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="info-dialog-description">
              <Divider />
              <Padder height={theme.spacing(2)} />
              <Typography align="left" variant="body1">
                <strong>Coefficient-of-Inbreeding [COI]: </strong>
                Ranging between 0 (no inbreeding exists in the ancestry) and 1 
                (the organism is completely inbred), the COI indicates the
                probability of an allele from a single ancestor propagating down
                either side of a pedigree and resulting in a descendant that
                will express the gene. <br/> <br/>
                
                Consequences of inbreeding include lower general health,
                physical defects and shorter lifespans. These effects generally
                manifest in individual animals at a COI > <strong>5%</strong>,
                and permanently reduce the viability of a genetic line at a 
                COI > <strong>10%</strong>.
              </Typography>
              <Divider />
              <Padder height={theme.spacing(2)} />
              <Typography align="left" variant="body1">
                <strong>Genetic Conditions: </strong>
                Genetic conditions are stored by veterinarians as a permanent
                record on the Barkchain, allowing for users to identify the
                genetic risks for existing dogs or potential mate pairings.
                <br/><br/>
                <strong>Awards: </strong>
                In the business of show dogs, competitive victories increase the
                value of descendants and can be used to breed 
                unrelated genetic lines for the fixation of physical traits as
                a sustainable alternative to inbreeding.

              </Typography>


            </DialogContentText>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleDialogClick} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

    </Card>
  );
};

export default DogCard;
