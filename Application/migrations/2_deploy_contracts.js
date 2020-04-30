const DogAncestry = artifacts.require("DogAncestry");

module.exports = function(deployer) {
  deployer.deploy(DogAncestry);
};
