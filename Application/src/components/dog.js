/**
 * A card with dog information.
 */

import React from "react";
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

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  let breedData = [];
  let prevColour = ""
  for(let [key, value] of props.breedMap.entries()) {
    var randomColour = '#'+Math.floor(Math.random()*16777215).toString(16);
    breedData.push({angle: value, color: randomColour, label: key})
  }

  return (
    <Card className={classes.root} variant={"outlined"}>

      <CardHeader
        avatar={ <Avatar>{" "} <FaDog />{" "} </Avatar> }
        title={`${props.name}`}
        titleTypographyProps={{ variant: "h6" }}
        subheader={`ID: (${props.microchipNumber})`}
      />

      {/*-- BASIC INFO -- */}  
      <CardContent>
        <Typography variant="caption" className={classes.info}>
          <strong>PRIMARY BREED: </strong> {`${props.breed}`} <br />
          <strong>DOB: </strong> {`${props.dob}`} <br />
          <strong>SIRE: </strong>
          {`${props.sire.name} (${props.sire.microchipNumber})`} <br />
          <strong>DAM: </strong>
          {`${props.dam.name} (${props.dam.microchipNumber})`} <br />
        </Typography>
      </CardContent>

      {/*-- COLLAPSIBLE INFORMATION -- */}
      <CardActions>
        <IconButton
          className={clsx(classes.expand, {[classes.expandOpen]: expanded,})}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
        <FaChevronDown size={15} />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/*-- BREED INFORMATION -- */}
        <CardContent>
          <Divider />
          <div id="radial-graph-wrapper">
            <div id="chart-wrapper">
              <RadialChart
                colorType={'literal'}
                style={{ stroke: "#fff", strokeWidth: 3 }}
                width={200}
                height={200}
                animation
                margin={{ top: 100 }}
                data={breedData}/>
            </div>

            <div id="legend-wrapper">
              <div id ="test">
                <DiscreteColorLegend 
                  items={breedData.map(x => x.label)}
                  colors={breedData.map(x =>x.color)}/>
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

        {/*-- BOTTOM BUTTONS -- */}
        <CardActions>
          <Button size="small" color="primary">
            RECORDS
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  );
};

export default DogCard;
