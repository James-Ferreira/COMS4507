import React from 'react'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({

  palette: {
    primary:{
      light: '#B39671',
      main: '#443633',
      dark: '#1d100c',
    },
        
    secondary:{
      light: '#e4eaf2',
      main: '#858f9e',
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
