import React from 'react'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({

  palette: {
    primary:{
      light: '#6f605c',
      main: '#443633',
      dark: '#1d100c',
    },
        
    secondary:{
      light: '#B39671',
      main: '#836946',
      dark: '#543e1d',
    },

    error:{
      light: '#e57373',
      main: "rgba(222, 15, 0, 1)",
      dark:"rgba(119, 0, 0, 1)",
    },

    contrastText:'#fff',

    text:{
      primary: '#000000',
      secondary: '#383838',
      disabled : '#8c8b8b',
    },
  },
});

const Theme = (props) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
