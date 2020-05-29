import React from "react";
import { makeStyles, useTheme, Typography } from "@material-ui/core";

const AboutSection = (props) => {
  const styles = useStyles();
  const theme = useTheme();

  const imageSide = (
    <div className={styles.aboutSectionSide} style={{ textAlign: "center" }}>
      <props.IconComponent color={theme.palette.secondary.dark} style={{flex:1}} />
    </div>
  );

  const infoSide = (
    <div className={styles.aboutSectionSide}>
      <Typography style={{ color: theme.palette.secondary.dark }} variant="h4">
        {props.title}
      </Typography>
      <Typography variant="body">{props.children}</Typography>
    </div>
  );

  let first;
  let second;
  if (props.variant === "left") {
    first = imageSide;
    second = infoSide;
  } else {
    first = infoSide;
    second = imageSide;
  }

  return (
    <div className={styles.aboutSection}>
      {first}
      {second}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
  },
}));

export default AboutSection;
