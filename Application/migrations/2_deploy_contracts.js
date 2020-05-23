const DogAncestry = artifacts.require("DogAncestry");
const VetRegistry = artifacts.require("VetRegistry");

module.exports = function(deployer) {
  deployer.deploy(VetRegistry).then(function() {
        return deployer.deploy(DogAncestry, VetRegistry.address);
    }).then(function() { })
};
