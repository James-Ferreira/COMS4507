import React, { useState } from "react";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Link,
  Typography,
} from "@material-ui/core";
import Padder from "../components/padder";
import Ethereum from "../state/ethereum";

const defaultData = {
  microchipNumber: "",
  name: "Spike",
  breed: "Husky",
  dob: 0,
  dam: 100,
  sire: 100,
};

const Login = (props) => {
  const styles = useStyles();
  const theme = useTheme();
  const [formData, setFormData] = useState(defaultData);
  const { dogAncestry } = Ethereum.useContainer().contracts;

  const setProperty = (prop, val) => {
    setFormData({ ...formData, [prop]: val });
  };

  const register = async () => {
    /* Verify the form data */
    if (!verifyData()) return false;

    // TODO: This doesn't work right now.
    const args = Object.values(formData);
    const result = await dogAncestry.methods.registerDog(...args).call();
    console.log(result);
  };

  const verifyData = () => {
    return true;
  };

  return (
    <div className={styles.root}>
      <Typography variant="h4">Register Dog</Typography>
      <TextField
        autoFocus
        margin="dense"
        label="Microchip Number"
        type="number"
        fullWidth
        value={formData.microchipNumber}
        onChange={(e) => setProperty("microchipNumber", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Name"
        type="text"
        fullWidth
        value={formData.name}
        onChange={(e) => setProperty("name", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Breed"
        type="text"
        fullWidth
        value={formData.breed}
        onChange={(e) => setProperty("breed", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Date of Birth"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        value={formData.dob}
        onChange={(e) => setProperty("dob", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Dam's Microchip Number"
        type="number"
        fullWidth
        value={formData.dam}
        onChange={(e) => setProperty("dam", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Sire's Microchip Number"
        type="number"
        fullWidth
        value={formData.sire}
        onChange={(e) => setProperty("sire", e.target.value)}
      />
      <Padder height={theme.spacing(2)} />
      <Button variant="contained" color="primary" onClick={register}>
        Register
      </Button>
      <Padder height={theme.spacing(2)} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    minWidth: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  header: {},
}));

export default Login;
