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
} from "@material-ui/core";

import Ethereum from "../state/ethereum";

import RoutedButton from "../components/routedButton";

import Padder from "../components/padder";

function Vets() {

  const { contracts, isOwner } = Ethereum.useContainer();

  const [size, setSize] = useState();

  // Method to retrieve size of application list from contract
  const fetchSize = async () => {
    let result = await contracts.vetRegistry.methods.getApplicationCount().call();
    setSize(result);
  };
 
  // Method to retrieve vet corresponding to given application index from contract
  const fetchVet = async (index) => {
    return await contracts.vetRegistry.methods.getVet(index).call();
  };
 
  // Method to check if application with given index is pending
  const fetchIsPending = async (index) => {
    return await contracts.vetRegistry.methods.isPending(index).call();
  };
  
  useEffect(() => {
    if (!size) {
      fetchSize();
    }
  }, [ fetchSize, size ]);
 
  let pendingVets = []
  let approvedVets = []

  for (let i = 0; i < size; i++) {
    let vet = null;
    fetchVet(i).then(result => {
      console.log("Vet: ", result);
      vet = result;
    }).catch(e => {
      console.log(e);
    });
    if (!vet) {
      console.log("No vet");
      continue;
    }
    
    if (vet.approved) {
      approvedVets.push(vet);
      continue;
    }
    
    let isPending = false;
    fetchIsPending(i).then(result => {
      console.log("Is Pending: ", result);
      isPending = result;
    }).catch(e => {
      console.log(e);
    });
    if (isPending) {
      pendingVets.push(vet);
    }
  }
  console.log("All Pending: ", pendingVets);
  console.log("All Approved: ", approvedVets);

  return (
    <>
      {
        isOwner &&
        <div>
          <h2>Pending</h2>
          <ul>
            {pendingVets.map((pending) => <li>pending.name</li>)}
          </ul>
        </div>
      }
      <div>
        <h2>Approved</h2>
        <ul>
          {approvedVets.map((approved) => <li>approved.name</li>)}
        </ul>
      </div>
    </>
  );
}

export default Vets;