import React from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Typography,
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

  const form = useForm(
    {
      microchipNumber: props.match.params.microchipnumber,
      date: "",
      title: "",
      details: "",
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
        history.goBack();
      } catch (err) {
        console.error(err);
        alert.show("Record creation failed failed, please try again.", SEVERITY.ERROR);
      }
      return false;
    },
    function verifier(data) {
      return true;
      // TODO: implement me
    }
  );

  return (
    <div className={styles.root}>
      <Typography variant="h4">Create Record {form.microchipNumber}</Typography>
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
        onClick={() => form.verify() && form.submit()}
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
