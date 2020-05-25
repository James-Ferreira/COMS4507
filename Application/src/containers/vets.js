 /**
 * 
 */

import React from "react";

import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  CardHeader,
  Avatar,
} from "@material-ui/core";

import Ethereum from "../state/ethereum";

import RoutedButton from "../components/routedButton";

import Padder from "../components/padder";

function Vets() {

  const { contracts } = Ethereum.useContainer();

  return (
    <>
      <div className="">
        Test
      </div>
    </>
  );
}

export default Vets;