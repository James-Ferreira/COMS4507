/**
 * Vet application page.
 */
import React from "react";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Typography,
  //Snackbar,
} from "@material-ui/core";
import Padder from "../components/padder";
import useForm from "../hooks/useForm";
import { useAlert, SEVERITY } from "../hooks/useAlert";

const VetApplication = (props) => {
  const styles = useStyles();
  const theme = useTheme();
  const alert = useAlert();

  const form = useForm(
    {
      name: "",
      license: "",
    },
    async function submitter(data) {
      try {
        alert.show(
          `UH OH! Looks like you're barking up the wrong tree! THIS AIN'T IMPLEMENTED DAWG!`,
          SEVERITY.INFO
        );
        // history.push(location.state.background.pathname);
      } catch (err) {
        console.error(err);
        alert.show("Application failed, please try again.", SEVERITY.ERROR);
      }
      return false;
    },
    function verifier(data) {
      return true;
    }
  );

  return (
    <div className={styles.root}>
      <Typography variant="h4">Apply for Veterinary Status</Typography>
      <TextField
        autoFocus
        margin="dense"
        label="Practice Name"
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
