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

import RoutedButton from "../components/routedButton";
import VetCard from "../components/vetCard";

import Padder from "../components/padder";

function Vets() {

  const { contracts, isOwner } = Ethereum.useContainer();

  const [size, setSize] = useState();
  // Array of Vet objects retrieved from contract
  const [vets, setVets] = useState();
  // Array of indices into 'vets' of approved vets
  const [approved, setApproved] = useState();
  // Array of indices into 'vets' of pending vets
  const [pending, setPending] = useState();

  // Method to retrieve size of application list from contract
  const fetchSize = async () => {
    let result = await contracts.vetRegistry.methods.getApplicationCount().call();
    console.log("Size: ", size);
    setSize(result);
  };
 
  // Method to retrieve vet corresponding to given application index from contract
  const fetchVets = async (size) => {
    let vetsResult = [];
    let approvedResult = []
    for (let i = 0; i < size; i++) {
      let vet = await contracts.vetRegistry.methods.getVet(i).call();
      vetsResult.push(vet);
      if (vet.approved) {
        approvedResult.push(i);
      }
    }
    console.log("Vets: ", vetsResult);
    setVets(vetsResult);
    setApproved(approvedResult);
  }
 
  // Method to retrieve vet corresponding to given application index from contract
  const fetchPending = async (size) => {
    let result = [];
    for (let i = 0; i < size; i++) {
      let isPending = await contracts.vetRegistry.methods.isPending(i).call();
      if (isPending) {
        result.push(i);
      }
    }
    console.log("Pending: ", result);
    setPending(result);
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
  }, [size, fetchVets]);
  
  useEffect(() => {
    if (size && !pending) {
      fetchPending(size)
    }
  }, [size, fetchPending]);
  
  return (
    <>
      {
        isOwner &&
        <div>
          <h2>Pending</h2>
          { 
            vets && pending && pending.length > 0 ?
            <List>
              {pending.map((index) => 
                <ListItem>
                  <VetCard data={vets[index]} pending={true} index={index} />
                </ListItem>
              )}
            </List>
            : "No pending vets"
          }
        </div>
      }
      <div>
        <h2>Approved</h2>

        {
          vets && approved && approved.length > 0 ?
          <List>
            {approved.map((index) => 
              <ListItem>
                <VetCard data={vets[index]} pending={false} index={index} />
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