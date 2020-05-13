import React from 'react'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme();

const Theme = (props) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
