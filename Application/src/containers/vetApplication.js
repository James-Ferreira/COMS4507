/**
 * Vet application page.
 */
import React, {useState} from "react";
import { Redirect } from "react-router-dom";

import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,

  //Snackbar,
} from "@material-ui/core";
import Padder from "../components/padder";
import useForm from "../hooks/useForm";
import { useAlert, SEVERITY } from "../hooks/useAlert";

import Ethereum from "../state/ethereum";
import Web3 from "web3"; // Web3 for interaction with Ethereum

const VetApplication = (props) => {
  const styles = useStyles();
  const theme = useTheme();
  const alert = useAlert();
  const { contracts, account } = Ethereum.useContainer();

  const [doRedirect, setDoRedirect] = useState(false);

  const form = useForm(
    {
      name: "",
      license: "",
      location: "",
    },
    async function submitter(data) {
      console.log(data);
      try {
        await contracts.vetRegistry.methods
          .makeApplication(...Object.values(data))
          .send({ from: account });
        alert.show(
          "Your application was successfully submitted.",
          SEVERITY.SUCCESS
        );
        // setDoRedirect(true);
      } catch (err) {
        console.error(err);
        alert.show("Application failed, please try again.", SEVERITY.ERROR);
      }
      return false;
    },
    function verifier(data) {
      if (data.name === "") {
        alert.show("Please enter a name.", SEVERITY.ERROR);
        return false;
      }
      if (data.license === "") {
        alert.show("Please enter a valid license number.", SEVERITY.ERROR);
        return false;
      }
      if (data.location === "") {
        alert.show("Please select a location.", SEVERITY.ERROR);
        return false;
      }
      return true;
    }
  );

  return (
    <div className={styles.root}>
      {
        doRedirect &&
        <Redirect to="/" />
      }
      <Typography variant="h4">Apply for Veterinary Status</Typography>
      <TextField
        autoFocus
        margin="dense"
        label="Name"
        type="text"
        fullWidth
        value={form.name}
        onChange={(e) => form.set("name", e.target.value)}
      />
      <TextField
        margin="dense"
        label="License Number"
        type="text"
        fullWidth
        value={form.license}
        onChange={(e) => form.set("license", e.target.value)}
      />
      <FormControl className={styles.formControl}>
        <InputLabel id="vet-app-location-label">Location</InputLabel>
        <Select
          margin="dense"
          label="Location"
          align="left"
          value={form.location}
          onChange={(e) => form.set("location", e.target.value)}
        >
          <MenuItem value={"Australian Capital Territory"}>Australia Capital Territory</MenuItem>
          <MenuItem value={"New South Wales"}>New South Wales</MenuItem>
          <MenuItem value={"Northern Territory"}>Northern Territory</MenuItem>
          <MenuItem value={"Queensland"}>Queensland</MenuItem>
          <MenuItem value={"South Australia"}>South Australia</MenuItem>
          <MenuItem value={"Victoria"}>Victoria</MenuItem>
          <MenuItem value={"Western Australia"}>Western Australia</MenuItem>
        </Select>
      </FormControl>
      <Padder height={theme.spacing(2)} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => form.verify() && form.submit()}
      >
        Apply
      </Button>
      <Padder height={theme.spacing(2)} />

      {/* Alerts */}
      {alert.component}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      minWidth: 500,
    },
  },
  header: {},
}));

export default VetApplication;
