var DogAncestry = artifacts.require("DogAncestry");
module.exports = function(done) {
    console.log("Getting deployed version of DogAncestry...")
    var jsonData = require('./sample-pedigree.json');
        DogAncestry.deployed().then(
            function(instance) {

                let result;
                for(let i = 0; i < jsonData.length; i++) {
                    var obj = jsonData[i];
                    console.log("Adding dog.. " + obj.microchipNumber);
                    result = instance.registerDog(
                        obj.microchipNumber, 
                        obj.breederId, 
                        obj.name, 
                        obj.isBitch,
                        obj.breed, 
                        obj.dob, 
                        obj.colours,
                        obj.dam, 
                        obj.sire);
                }
                return result;

        }).then(function(result) {  
            console.log("Final Transaction:", result.tx);
            console.log("Finished!");
            done();
        }).catch(function(e) {
            console.log(e);
            done();
        });
};