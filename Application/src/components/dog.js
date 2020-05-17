/**
 * A card with dog information.
 * 
 * //TODO: add labels of % in pie chart
 */

import React, { Fragment } from "react";
import {
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Button,
  Typography,
  Divider,
  useMediaQuery,
  useTheme
} from "@material-ui/core";

import clsx from "clsx";
import { FaDog, FaChevronDown } from "react-icons/fa";

import {
  RadialChart,
  GradientDefs,
  XYPlot,
  HorizontalBarSeries,
  XAxis,
  DiscreteColorLegend,
} from "react-vis";

import RoutedButton from "../components/routedButton";

const moment = require('moment');

const useStyles = makeStyles((theme) => ({
  root: {
    width: 450,
    padding: 0,
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
  }

  let targetDog = props.contents;

  return (
    <Card className={classes.root} variant={"outlined"}>

      <CardHeader
        avatar={ <Avatar>{" "} <FaDog />{" "} </Avatar> }
        title={`${targetDog.name}`}
        titleTypographyProps={{ variant: "h6" }}
        subheader={`ID: (${targetDog.microchipNumber})`}
      />

      {/*-- BASIC INFO -- */}  
      <CardContent>
        <Typography variant="caption" className={classes.info}>
          <strong>PRIMARY BREED: </strong> {`${targetDog.breed}`} <br />
          <strong>DOB: </strong> {`${targetDog.dob}`} <br />
          <strong>SIRE: </strong>
          {`${targetDog.sire.name} (${targetDog.sire.microchipNumber})`} <br />
          <strong>DAM: </strong>
          {`${targetDog.dam.name} (${targetDog.dam.microchipNumber})`} <br />
        </Typography>
      </CardContent>
      
      <Divider />

      {/*-- COLLAPSIBLE INFORMATION-- */}
      <div title={expanded ? "Hide Statistics" : "Show Statistics"} className="collapseLabel" onClick={handleExpandClick}>
        <h3>Statistics</h3>

        <IconButton
          className={clsx(classes.expand, {[classes.expandOpen]: expanded,})}
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
                colorType={'literal'}
                style={{ stroke: "#fff", strokeWidth: 3 }}
                width={200}
                height={200}
                animation
                margin={{ top: 100 }}
                data={props.breedData}/>
            </div>

            <div id="legend-wrapper">
              <div id ="test">
                <DiscreteColorLegend 
                  items={props.breedData.map(x => x.label)}
                  colors={props.breedData.map(x =>x.color)}/>
              </div>
            </div>
          </div>
          <Divider />

          {/*-- INBREEDING COEFFICIENT DISPLAY -- */}
          <XYPlot
            width={350}
            height={75}
            xDomain={[0, 1]}>
            
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
              data={[{ x: props.coi, y: 1, 
                gradientLabel: "grad1", label: "curr" }]}/>
          </XYPlot>

          <Typography variant="caption" className={classes.info}>
            <strong>COI: </strong> {`${props.coi}`} <br /> <br />
            Calculated using  <strong> {`${props.generation}`} </strong>
            generations and <strong> {`${props.ancestors.size}`} </strong>
            ancestors
          </Typography>
        </CardContent>
      </Collapse>
    
      
      <Divider />
      
      {/*-- COLLAPSIBLE BREED DISPLAY -- */}
      <div title={recordsExpanded ? "Hide Medical Records" : "Show Medical Records"} className="collapseLabel" onClick={handleExpandRecordsClick} >
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

      <Collapse in={recordsExpanded} timeout="auto" unmountOnExit >
        <CardContent>
          {targetDog.medicals && targetDog.medicals.map(record => (
            <Fragment>
              <article>
                <h4 style={{textAlign: "center"}}>{record.title}</h4>
                <p style={{textAlign: "right"}}>{moment.unix(record.date).format("DD/MM/YYYY")}</p>
                <p style={{marginBottom: "2em"}}>{record.details}</p>
              </article>
              <Divider />
            </Fragment>
            ))
          }

            {/*-- BOTTOM BUTTONS -- */}
          <CardActions>
            <RoutedButton
              asModal={isNotMobile}
              to="/createrecord"
              variant="contained"
              color="secondary"
            >
              Add Record
            </RoutedButton>
          </CardActions>
        </CardContent>
      </Collapse>
    
    </Card>
  );
};

export default DogCard;
