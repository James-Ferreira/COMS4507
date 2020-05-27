/**
 * Dog registration form.
 */

import React from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem
} from "@material-ui/core";
import moment from "moment";
import Padder from "../components/padder";
import Ethereum from "../state/ethereum";
import useForm from "../hooks/useForm";
import { useAlert, SEVERITY } from "../hooks/useAlert";

import { GrClose } from "react-icons/gr";

const Register = (props) => {
  const styles = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { contracts, account } = Ethereum.useContainer();
  const alert = useAlert();

  const form = useForm(
    {
      microchipNumber: "",
      breederId: "",
      name: "",
      isBitch: -1,
      breed: "",
      dob: "",
      colours: [""],
      dam: "",
      sire: "",
    },
    function verifier(data) {
      if (!data.microchipNumber || data.microchipNumber <= 0) {
        alert.show("Microchip Number must be greater than 0", SEVERITY.ERROR);
        return false;
      }
      if (data.breederId === "") {
        // do nothing for now, as this is an optional field.
      }
      if (data.name === "") {
        alert.show("Please enter a name.", SEVERITY.ERROR);
        return false;
      }
      if (Number(data.isBitch) !== 1 && Number(data.isBitch) !== 0) {
        alert.show("Please choose a sex.", SEVERITY.ERROR);
        return false;
      }
      if (data.breed === "") {
        alert.show("Please enter a primary breed.", SEVERITY.ERROR);
        return false;
      }
      if (data.dob === "") {
        alert.show("Please enter a date of birth", SEVERITY.ERROR);
        return false;
      }
      if (data.dam && data.dam <= 0) {
        alert.show("Dam's microchip Number must be greater than 0", SEVERITY.ERROR);
        return false;
      }
      if (data.sire && data.sire <= 0) {
        alert.show("Sire's microchip Number must be greater than 0", SEVERITY.ERROR);
        return false;
      }
      if (data.colours.length === 0 || data.colours.includes("")) {
        alert.show("Please enter valid colours.", SEVERITY.ERROR);
        return false;
      }

      return true;

    },
    async function submitter(data) {
      const transformed = {
        ...data,
        dob: moment(data.dob).startOf("day").unix(),
        isBitch: Number(data.isBitch) === 1 ? true : false,
        sire: data.sire ? data.sire : 0,
        dam: data.dam ? data.dam : 0,
      };
      console.log(Object.values(transformed));
      try {
        await contracts.dogAncestry.methods
          .registerDog(...Object.values(transformed))
          .send({ from: account });
        alert.show(
          `${data.name || "Your  dog"} was registered successfully!`,
          SEVERITY.SUCCESS
        );
        history.push(`/dogs/${form.microchipNumber}`);
      } catch (err) {
        console.error(err);
        alert.show("Registration failed, please try again.", SEVERITY.ERROR);
      }
      return false;
    }
  );

  return (
    <div className={styles.root}>

      <Typography variant="h4">Register Dog</Typography>

      <Padder height={theme.spacing(4)} />
      <Typography variant="h5">Registry Information</Typography>

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
        label="Breeder ID"
        type="text"
        fullWidth
        value={form.breederId}
        onChange={(e) => form.set("breederId", e.target.value)}
      />

      <Padder height={theme.spacing(4)} />
      <Typography variant="h5">Dog Information</Typography>

      <TextField
        margin="dense"
        label="Name"
        type="text"
        fullWidth
        value={form.name}
        onChange={(e) => form.set("name", e.target.value)}
      />
      <Padder height={theme.spacing(3)} />
      <Select
        margin="dense"
        align="left"
        type="text"
        value={form.isBitch}
        onChange={(e) => form.set("isBitch", e.target.value)}
      >
        <MenuItem value={-1}>Select Gender</MenuItem>
        <MenuItem value={0}>Male</MenuItem>
        <MenuItem value={1}>Female</MenuItem>
      </Select>
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
        onChange={(e) => form.set("dob", e.target.value)
        }
      />
      {form.colours.map((colour, index) => (
        <div key={index} style={{display: "flex"}}>
          <TextField
          margin="dense"
          label={`Colour${form.colours.length === 1 ? "" : (" " + (index + 1))}`}
          type="text"
          fullWidth
          value={colour}
          onChange={(e) => {
            form.colours[index] = e.target.value;
            form.set("colours", [...form.colours])
          }}
          
        />
        {form.colours.length > 1 &&
          (<Button
            variant="text"
            color="secondary"
            style={{width: "0.5em", marginLeft: "auto"}}
            onClick={() => {
              form.colours.splice(index, 1);
              form.set("colours", [...form.colours])
            }}
          >
            <GrClose />
          </Button>)
        }
      </div>
      ))}
      {!form.colours.includes("") &&
        (<>
          <Padder height={theme.spacing(1)} />
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{width: "8em", marginLeft: "auto"}}
            onClick={() => form.set("colours", form.colours.concat(""))}
          >
            Add Colour
          </Button>
        </>)
      }


      <Padder height={theme.spacing(4)} />
      <Typography variant="h5">Ancestry Information</Typography>

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


      <Padder height={theme.spacing(5)} />
      <Button
        variant="contained"
        color="primary"
        onClick={async () => await form.verify() && form.submit()}
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
