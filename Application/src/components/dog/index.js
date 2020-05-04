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
  console.log(props);
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <FaDog />
          </Avatar>
        }
        title={`${props.name} (${props.microchipNumber})`}
        subheader={props.breed}
      />
      {/* <CardContent>
        <Typography variant="body2" color="textSecondary" component="div">
          <p>Offspring: {props.offspring}</p>
        </Typography>
      </CardContent> */}
    </Card>
  );
};

export default Dog;
