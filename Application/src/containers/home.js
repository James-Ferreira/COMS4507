/**
 * Main application page.
 */

import React from "react";
import Search from "../containers/search";
import { Dialog, DialogContent, useTheme, useMediaQuery } from "@material-ui/core";

function Home() {

  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));

  if (isNotMobile) {
    return (
      <Dialog open>
        <DialogContent>
          <Search />
        </DialogContent>
      </Dialog>
    );
  } else {
    return <Search />;
  }
}

export default Home;
