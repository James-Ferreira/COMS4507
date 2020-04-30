/**
 * A card with some basic dog information.
 */ 

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
} from "@material-ui/core";
import { FaDog } from "react-icons/fa";

const Dog = (props) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <FaDog />
          </Avatar>
        }
        title={props.name}
        subheader={props.microchipNumber}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="div">
          <p>Dam: {props.dam}</p>
          <p>Sire: {props.sire}</p>
          <p>Offspring: {props.offspring}</p>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Dog;
