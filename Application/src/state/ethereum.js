import { useState } from "react";
import { createContainer } from "unstated-next";
import Web3 from "web3"; // Web3 for interaction with Ethereum

/* Truffle */
import DogAncestry from "../contracts/DogAncestry.json";
import VetRegistry from "../contracts/VetRegistry.json";
import { TRUFFLE_NETWORK_ID } from "../truffle";

const useEthereum = () => {
  /* Setup a Web3 instance to interface with the blockchain */
  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

  /* Setup contracts */
  const dogAncestry = new web3.eth.Contract(
    DogAncestry.abi,
    DogAncestry.networks[TRUFFLE_NETWORK_ID].address
  );
  
  const vetRegistry = new web3.eth.Contract(
    VetRegistry.abi,
    VetRegistry.networks[TRUFFLE_NETWORK_ID].address
  );

  /* Store the current account information */
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState();
  const [isApproved, setIsApproved] = useState();

  return { 
    web3, 
    account, 
    setAccount, 
    isOwner, 
    setIsOwner,
    isApproved,
    setIsApproved, 
    contracts: { dogAncestry, vetRegistry } };
};

const Ethereum = createContainer(useEthereum);
export default Ethereum;
