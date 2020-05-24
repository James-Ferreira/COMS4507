import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTheme, Button, Box, Typography } from "@material-ui/core";
import moment from "moment";
import Padder from "../components/padder";
import Ethereum from "../state/ethereum";
import { useAlert, SEVERITY } from "../hooks/useAlert";

const ViewRecord = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const [record, setRecord] = useState(null);
  const alert = useAlert();
  const { contracts } = Ethereum.useContainer(); // The Ethereum interface from context.

  const microchipNumber = props.match.params.microchipnumber;
  const recordNumber = props.match.params.recordnumber;

  const getNiceRecordType = (recordType) => {
    switch(recordType) {
      case "award": return "Award";
      case "vaccination": return "Vaccination";
      case "genetic-condition": return "Genetic Condition";
      case "other": return "Other";
      default: return recordType;
    }
  }

  const fetchRecord = async () => {
    /* Get the dog structure from the blockchain using our custom method */
    let dog = await contracts.dogAncestry.methods
      .getDog(microchipNumber)
      .call();

    /* Basic error handling */
    if (dog.microchipNumber === 0) {
      return alert.show("Dog not registered.", SEVERITY.ERROR);
    }

    if (!dog.medicals) {
      return alert.show("No records were found for this dog.", SEVERITY.ERROR);
    }

    if (recordNumber >= dog.medicals.length || recordNumber < 0) {
      return alert.show(
        `Record number '${recordNumber}' does not exist.`,
        SEVERITY.ERROR
      );
    }

    setRecord(dog.medicals[recordNumber]);
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          minWidth: "250px",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Back
        </Button>
      </div>

      {record ? (
        <>
          <Typography variant="h6">{getNiceRecordType(record.recordType)}: <strong>{record.title}</strong></Typography>
          <Typography variant="subtitle" align="right">
            {moment.unix(record.date).format("DD/MM/YYYY")}
          </Typography>

          <Padder height={theme.spacing(2)} />

          <Typography variant="body1">{record.details}</Typography>

          <Padder height={theme.spacing(2)} />

          {/* Alerts */}
          {alert.component}
        </>
      ) : (
        <Typography variant="h6">No record found</Typography>
      )}
    </Box>
  );
};

export default ViewRecord;
