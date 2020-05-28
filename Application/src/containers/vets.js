 /**
 * 
 */

import React, {useState, useEffect} from "react";

import {
  makeStyles,
  Typography,
  useTheme,
  List,
  ListItem,
} from "@material-ui/core";

import Ethereum from "../state/ethereum";
import { useAlert, SEVERITY } from "../hooks/useAlert";

import VetCard from "../components/vetCard";

const useStyles = makeStyles((theme) => ({
  "vetList": {
    margin: theme.spacing(2),
  }
}));

function Vets() {
  const theme = useTheme();
  const classes = useStyles();
  const alert = useAlert();

  const { contracts, isOwner, account } = Ethereum.useContainer();

  const [size, setSize] = useState();
  // Array of Vet objects retrieved from contract
  const [vets, setVets] = useState();
  // Mapping of application indices to pending and approved statuses
  const [statuses, setStatuses] = useState();

  async function processApplication (address, approved, index) {
    try {
      await contracts.vetRegistry.methods
      .processApplication(address, approved)
      .send({from: account});
      alert.show(
        `Application successfully ${approved ? "approved" : "denied"}.`,
        SEVERITY.SUCCESS
      );
      statuses[index].approved = approved;
      statuses[index].pending = false;
    } catch (err) {
      console.log(err);
      alert.show(
        `Application ${approved ? "approval" : "denial"} failed. Please try again.`,
        SEVERITY.ERROR
      );
    }
  };

  async function revokeApproval(address, index) {
    try {
      await contracts.vetRegistry.methods
      .revokeApproval(address)
      .send({from: account});
      alert.show(
        "Approval successfully revoked.",
        SEVERITY.SUCCESS
      );
      statuses[index].approved = false;
    } catch (err) {
      alert.show("Revocation failed. Please try again.") 
    }
  }

  useEffect(() => {
    // Retrieves size of application list from contract
    const fetchSize = async () => {
      let result = await contracts.vetRegistry.methods.getApplicationCount().call();
      console.log("Size: ", size);
      setSize(result);
    };
    fetchSize();
  }, [ size, contracts.vetRegistry.methods ]);
 
  useEffect(() => {
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
      setVets(vetsResult);
      setStatuses(statusesResult);
    };
    if (size) {
      fetchVets(size);
    }
  }, [ size, contracts.vetRegistry.methods, statuses ]);

  return (
    <>
      {
        isOwner &&
        <div className={classes.vetList}>
          <Typography variant="h4">Pending</Typography>
          { 
            vets && statuses &&
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
          }
        </div>
      }
      <div className={classes.vetList}>
        <Typography variant="h4">Approved</Typography>
        {
          vets && statuses &&
          <List>
            {
            Object.keys(statuses).map((index) => 
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
            )
            }
          </List>
        }
        {alert.component}
      </div>
    </>
  );
}

export default Vets;