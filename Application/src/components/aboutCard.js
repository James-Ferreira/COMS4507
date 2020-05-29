import React from "react";
import {
  makeStyles,
  useTheme,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import Padder from "./padder";

const AboutCard = (props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <Card className={styles.card} elevation={0}>
      <CardContent>
        <props.IconComponent color={theme.palette.secondary.dark} size="5em" />
        <Typography
          style={{ color: theme.palette.secondary.dark }}
          variant="h6"
        >
          {props.title}
        </Typography>
        <Padder height={theme.spacing(1)} />
        <Typography variant="body2">{props.children}</Typography>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "30%",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: `${theme.spacing(4)}px ${theme.spacing(1)}px`,
    textAlign: "center"
  },
}));

export default AboutCard;
