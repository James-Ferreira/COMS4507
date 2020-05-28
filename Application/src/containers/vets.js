 /**
 * 
 */

import React, {useState, useEffect} from "react";

import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
  CardHeader,
  Avatar,
  List,
  ListItem,
} from "@material-ui/core";

import Ethereum from "../state/ethereum";
import { useAlert, SEVERITY } from "../hooks/useAlert";

import RoutedButton from "../components/routedButton";
import VetCard from "../components/vetCard";
import Padder from "../components/padder";

const useStyles = makeStyles((theme) => ({
  "vetList": {
    margin: theme.spacing(2),
  }
}));

function Vets() {
  const theme = useTheme();
  const classes = useStyles();
  const alert = useAlert();

  const { contracts, isOwner, account, isApproved } = Ethereum.useContainer();

  const [size, setSize] = useState();
  // Array of Vet objects retrieved from contract
  const [vets, setVets] = useState();

  const [statuses, setStatuses] = useState();

  async function processApplication (address, approved, index) {
    try {
      await contracts.vetRegistry.methods
      .processApplication(address, approved)
      .send({from: account});
      alert.show(
        `Application successfully {approved ? "approved" : "denied"}.`,
        SEVERITY.SUCCESS
      );
      let newStatuses = statuses;
      newStatuses[index].approved = true;
      newStatuses[index].pending = false;
      setStatuses(newStatuses);
    } catch (err) {
      alert.show(
        `Application {approved ? "approval" : "denial"} failed. Please try again.`,
        SEVERITY.ERROR
      );
    }
  };

  async function revokeApproval(address) {
    try {
      await contracts.vetRegistry.methods
      .revokeApproval(address)
      .send({from: account});
    } catch (err) {
      alert.show("Revocation failed. Please try again.") 
    }
  }

  // Retrieves size of application list from contract
  const fetchSize = async () => {
    let result = await contracts.vetRegistry.methods.getApplicationCount().call();
    console.log("Size: ", size);
    setSize(result);
  };
 
  // Retrieves all vets from the contract. Sets vet, approved, and pending states.
  const fetchVets = async (size) => {
    let vetsResult = [];
    let statusesResult = {}

    for (let i = 0; i < size; i++) {
      let vet = await contracts.vetRegistry.methods.getVet(i).call();
      let isPending = await contracts.vetRegistry.methods.isPending(i).call();
      vetsResult.push(vet);
      statusesResult[i] = {
        "pending": isPending,
        "approved": vet.approved,
      };
    }
    console.log("Vets: ", vetsResult);
    console.log("Statuses: ", statusesResult); 
    setVets(vetsResult);
    setStatuses(statusesResult);
  }

  function componentDidUpdate(prev) {
    console.log("DID UPDATE");
  }
 
  useEffect(() => {
    if (!size) {
      fetchSize();
    }
  }, [ fetchSize, size ]);
 
  useEffect(() => {
    if (size && !vets) {
      fetchVets(size);
    }
  }, [size, fetchVets, vets]);
  
  return (
    <>
      {
        isOwner &&
        <div className={classes.vetList}>
          <Typography variant="h4">Pending</Typography>
          { 
            vets && statuses ?
            <List>
              {Object.keys(statuses).map((index) => 
                  statuses[index].pending &&
                  <ListItem>
                    <VetCard
                      data={vets[index]}
                      pending={true}
                      approved={false}
                      index={index}
                      process={processApplication}
                  />
                  </ListItem>
              )}
            </List>
            : "No pending vets"
          }
        </div>
      }
      <div className={classes.vetList}>
        <Typography variant="h4">Approved</Typography>
        {
          vets && statuses ?
          <List>
            {Object.keys(statuses).map((index) => 
                statuses[index].approved &&
                <ListItem >
                  <VetCard
                    data={vets[index]}
                    pending={false}
                    approved={true}
                    index={index}
                    process={revokeApproval}
                  />
                </ListItem>
            )}
          </List>
          : "No approved vets"
        }
      </div>
    </>
  );
}

export default Vets;