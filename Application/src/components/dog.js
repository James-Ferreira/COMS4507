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
} from "@material-ui/core";

import clsx from 'clsx';
import { FaDog, FaChevronDown } from "react-icons/fa";

import {
  RadialChart,
  GradientDefs,
  XYPlot,
  HorizontalBarSeries,
} from 'react-vis';



const useStyles = makeStyles((theme) => ({
  root: {
    width: 450,
    padding: 0,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  logo: {
    display: "flex",
    justifyContent: "flex-start",
  },
  info: {
    marginBottom: 0,
  },

}));

const DogCard = (props) => {
  const classes = useStyles();
  const myData = [{angle: 1}, {angle: 5}, {angle: 2}]

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root} variant={"outlined"}>

      <CardHeader
        avatar= { <Avatar> <FaDog/> </Avatar> }
        title= {`${props.name}`}
        titleTypographyProps= {{variant:"h6"}}
        subheader= {`ID: (${props.microchipNumber})`}
      />

      <CardContent>
      <Typography variant="caption" className={classes.info}>
            <strong>DOB: </strong> {`${props.dob}`} <br />
          </Typography>

          <Typography variant="caption" className={classes.info}>
            <strong>SIRE: </strong>
            {`${props.sire.name} (${props.sire.microchipNumber})`} <br /> 

          </Typography>

          <Typography variant="caption" className={classes.info}>
            <strong>DAM: </strong> 
              {`${props.dam.name} (${props.dam.microchipNumber})`} <br />
          </Typography>
      </CardContent>

      {/*-- COLLAPSIBLE BREED DISPLAY -- */}
      <CardActions>
        <Typography variant="h6">BREED</Typography>
        <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <FaChevronDown size={15}/>
          </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>

        <RadialChart
          colorType={'literal'}
          colorDomain={[0, 100]}
          colorRange={[0, 10]}
          margin={{top: 100}}
          getColor={d => `url(#${d.gradientLabel})`}
          data={[
            {angle: 1, gradientLabel: 'grad1', label: "1"},
            {angle: 1, gradientLabel: 'grad2', label: "2"},
            {angle: 1, gradientLabel: 'grad3', label: "3"}
          ]}
          labelsRadiusMultiplier={1.1}
          labelsStyle={{fontSize: 16, fill: '#222'}}
          style={{stroke: '#fff', strokeWidth: 2}}
          width={175}
          height={175}>
          <GradientDefs>
            <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="red" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="blue" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="blue" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="green" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="grad3" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="yellow" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="green" stopOpacity={0.3} />
            </linearGradient>
          </GradientDefs>
      </RadialChart>

        </CardContent>
    </Collapse>

      {/*-- COLLAPSIBLE INBREEDING DISPLAY -- */}
      <CardActions>
        <Typography variant="h6">COEFFICIENT-OF-INBREEDING</Typography>
        <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <FaChevronDown size={15}/>
          </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>

          <XYPlot height={175} width={175} colour="#c7e9c0">
            <HorizontalBarSeries 
              data={[
              {x: 33, y: 1, label: "curr"},
              {x: 50, y: 2, label: "dam"},
              {x: 100, y: 3, label: "sire"},
            ]} 
            
            />
          </XYPlot>


        </CardContent>
    </Collapse>


      {/*-- BOTTOM BUTTONS -- */}
    <CardActions>
        <Button size="small" color="primary">
          RECORDS
        </Button>
      </CardActions>
  </Card>
  );
};


export default DogCard;