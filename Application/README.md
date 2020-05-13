# COMS4507 Blockchain Project Prototype

## Installing Required Software
### Node.js
If you don't have Node.js, install it [here](https://nodejs.org/en/) or via your package manager.
You will need to have Node >= 8.10 and npm >= 5.6
### Yarn
This project is using yarn for package management, install yarn [here](https://classic.yarnpkg.com/en/docs/install) 
### Truffle
Install truffle globally through npm.
```
npm install truffle -g
```
### Ganache
Download and install Ganache [here](https://www.trufflesuite.com/ganache). Create a new workspace with a Network ID of 5777 and a port of 7545.
### MetaMask
First, install the MetaMask chrome extension [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn).

Once installed, we need to configure it to use the Ganache network. Click the extension icon and go to the network dropdown at the top right of popout. It will probably say Main Ethereum Network. Select Custom RPC and configure a new network with Network Name 'Localhost 7545' and RPC URL 'http://localhost:7545.

Next, we need to connect an account to the extension. On the accounts page in Ganache, click the key icon on the right hand side of the first account entry and copy the private key. Back in MetaMask, click the account circle in the top right of the popout and import the account using the copied private key.
### Node Modules
Install node modules from the root directory.
```
yarn install
npm install react-tree-graph --save
```

## Running The Project
### Truffle
To recompile and deploy smart contracts, run the following:
```
truffle compile
truffle migrate --reset
```
### React App
With Ganache running, start the project from the root directory.
```
yarn start
```
View the app at [http://localhost:3000](http://localhost:3000).

## Project Structure
### Truffle
- `truffle-config.js` - contains configuration data for smart contract compilation/deployment.
- `contracts` - smart contract source code, make changes here.
- `migrations` - blockchain structure migration scripts, if new contracts are added they will need to be added to `2_deploy_contracts.js`.
- `src/contracts` - compiled smart contract data, used by `web3.js` to interface with the blockchain. Don't modify these files.
#### Truffle Commands
- `truffle compile` - compile Solidity source code into a JSON representation of the contract
- `truffle migrate` - migrate smart contract structure on the blockchain. Use the `--reset` flag to run all migrations from the beginning.
- `truffle console` - run a cli console which allows interaction with the blockchain data.
### React Source
React source code is found in the `src` directory.