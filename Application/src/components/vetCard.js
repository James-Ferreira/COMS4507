
import React from 'react';

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
  Grid,
  Paper,
  ButtonBase,
} from "@material-ui/core";

import Padder from "./padder";

import RoutedButton from "./routedButton";

import { FaUserMd } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: "100%",
  },
  icon: {
    paddingRight: theme.spacing(1),
  },
}));

const VetCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));
  
  let vet = props.data;
  let pending = props.pending;
  let index = props.index;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <FaUserMd className={classes.icon} size="2.5em" />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  {vet.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  License: {vet.license}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {vet.location}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <RoutedButton
                asModal={isNotMobile}
                color="primary"
                to={"/vets/" + vet.addr + "/approve"}
              >
                Approve
              </RoutedButton>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default VetCard;