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
} from "@material-ui/core";

import clsx from "clsx";
import { FaChevronDown, FaMars, FaVenus } from "react-icons/fa";

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
}));

const DogCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));

  const [expanded, setExpanded] = React.useState(false);
  const [recordsExpanded, setRecordsExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExpandRecordsClick = () => {
    setRecordsExpanded(!recordsExpanded);
  };

  let dog = props.data;
  let breedData = calculateBreedData(dog.breedMap);

  return (
    <Card className={classes.root}>
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

      {/*-- BASIC INFO -- */}
      <CardContent>
        <List>
          <ListItemText>
            <strong>DOB: </strong> {moment.unix(dog.dob).format("DD/MM/YYYY")}
          </ListItemText>
          <ListItemText>
            <strong>DAM: </strong>{" "}
            {dog.dam !== 0
              ? `${dog.dam.name} (${dog.dam.microchipNumber})`
              : "Unknown"}
          </ListItemText>
          <ListItemText>
            <strong>SIRE: </strong>{" "}
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
          {dog.medicals &&
            dog.medicals.map((record, index) => (
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

          {/*-- BOTTOM BUTTONS -- */}
          <Padder height={theme.spacing(2)} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <RoutedButton
              asModal={isNotMobile}
              to={`/dogs/${dog.microchipNumber}/records/create`}
              variant="contained"
              color="secondary"
            >
              Add Record
            </RoutedButton>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default DogCard;
