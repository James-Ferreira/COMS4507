import React from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select
} from "@material-ui/core";
import moment from "moment";
import Padder from "../components/padder";
import Ethereum from "../state/ethereum";
import useForm from "../hooks/useForm";
import { useAlert, SEVERITY } from "../hooks/useAlert";

const CreateRecord = (props) => {
  const styles = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const { contracts, account } = Ethereum.useContainer();
  const alert = useAlert();

  const allowedRecordTypes = ["vaccination", "award", "genetic-condition", "other"];

  const form = useForm(
    {
      microchipNumber: props.match.params.microchipnumber,
      recordType: "unset",
      date: "",
      title: "",
      details: "",
    },
    function verifier(data) {
      if (data.date === "") {
        alert.show("Please enter a date", SEVERITY.ERROR);
        return false;
      }
      if (data.title === "") {
        alert.show("Please enter a title", SEVERITY.ERROR);
        return false;
      }
      if (data.details === "") {
        alert.show("Please enter some details", SEVERITY.ERROR);
        return false;
      }
      console.log(data.recordType);
      if (!allowedRecordTypes.includes(data.recordType)) {
        alert.show("Please select a record type", SEVERITY.ERROR);
        return false;
      }
      return true;
    },
    async function submitter(data) {
      const transformed = {
        ...data,
        date: moment(data.date).startOf("day").unix(),
      };
      try {
        await contracts.dogAncestry.methods
          .createRecord(...Object.values(transformed))
          .send({ from: account });
        alert.show(
          'Record created!',
          SEVERITY.SUCCESS
        );
        history.push(`/dogs/${form.microchipNumber}`, {requestDogUpdate: true});
      } catch (err) {
        console.error(err);
        alert.show("Record creation failed failed, please try again.", SEVERITY.ERROR);
      }
      return false;
    }
  );

  return (
    <div className={styles.root}>
      <Typography variant="h4">Create Record</Typography>
      <Padder height={theme.spacing(3)} />
      <Select
        margin="dense"
        align="left"
        type="text"
        value={form.recordType}
        onChange={(e) => form.set("recordType", e.target.value)}
      >
        <MenuItem value="unset">Select Record Type</MenuItem>
        <MenuItem value="vaccination">Vaccination</MenuItem>
        <MenuItem value="genetic-condition">Genetic Condition</MenuItem>
        <MenuItem value="award">Award</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </Select>
      <TextField
        margin="dense"
        label="Date Applicable"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        value={form.date}
        onChange={(e) => form.set("date", e.target.value)
        }
      />
      <TextField
        margin="dense"
        label="Title"
        type="text"
        fullWidth
        value={form.title}
        onChange={(e) => form.set("title", e.target.value)}
      />
      <TextField
        margin="dense"
        label="Details"
        type="text"
        multiline
        fullWidth
        value={form.details}
        onChange={(e) => form.set("details", e.target.value)}
      />
      <Padder height={theme.spacing(2)} />
      <Button
        variant="contained"
        color="primary"
        onClick={async () => await form.verify() && form.submit()}
      >
        Create
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


export default CreateRecord;
