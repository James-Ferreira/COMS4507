import React from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Typography,
  //Snackbar,
} from "@material-ui/core";
import moment from "moment";
import Padder from "../components/padder";
import Ethereum from "../state/ethereum";
import useForm from "../hooks/useForm";
import { useAlert, SEVERITY } from "../hooks/useAlert";

const Register = (props) => {
  const styles = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { contracts, account } = Ethereum.useContainer();
  const alert = useAlert();

  const form = useForm(
    {
      microchipNumber: "",
      name: "",
      breed: "",
      dob: "",
      dam: "",
      sire: "",
    },
    async function submitter(data) {
      const transformed = {
        ...data,
        dob: moment(data.dob).startOf("day").unix(),
      };
      try {
        await contracts.dogAncestry.methods
          .registerDog(...Object.values(transformed))
          .send({ from: account });
        alert.show(
          `${data.name || "Your  dog"} was registered successfully!`,
          SEVERITY.SUCCESS
        );
        history.push(`/search/${form.microchipNumber}`);
      } catch (err) {
        console.error(err);
        alert.show("Registration failed, please try again.", SEVERITY.ERROR);
      }
      return false;
    },
    function verifier(data) {
      return true;
    }
  );

  return (
    <div className={styles.root}>
      <Typography variant="h4">Register Dog</Typography>
      <TextField
        autoFocus
        margin="dense"
        label="Microchip Number"
        type="number"
        fullWidth
        value={form.microchipNumber}
        onChange={(e) => form.set("microchipNumber", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Name"
        type="text"
        fullWidth
        value={form.name}
        onChange={(e) => form.set("name", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Breed"
        type="text"
        fullWidth
        value={form.breed}
        onChange={(e) => form.set("breed", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Date of Birth"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        value={form.dob}
        onChange={(e) =>
          console.log(e.target.value) || form.set("dob", e.target.value)
        }
      />
      <TextField
        margin="dense"
        label="Dam's Microchip Number"
        type="number"
        fullWidth
        value={form.dam}
        onChange={(e) => form.set("dam", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Sire's Microchip Number"
        type="number"
        fullWidth
        value={form.sire}
        onChange={(e) => form.set("sire", e.target.value)}
      />
      <Padder height={theme.spacing(2)} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => form.verify() && form.submit()}
      >
        Register
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

export default Register;
