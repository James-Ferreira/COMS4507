var DogAncestry = artifacts.require("DogAncestry");
module.exports = function(done) {
    console.log("Getting deployed version of DogAncestry...")
    var jsonData = require('./sample-pedigree.json');

    DogAncestry.deployed().then(function(instance) {

        for(var i = 0; i < jsonData.length - 1; i++) {
            var obj = jsonData[i];
            console.log("Adding dog.. " + obj.microchipNumber);
            instance.registerDog(
                obj.microchipNumber, 
                obj.breederId, 
                obj.name, 
                obj.isBitch, 
                "Labrador", 
                obj.dob, 
                ["blonde", "black"], 
                obj.dam, 
                obj.sire);
        }

        obj = jsonData[jsonData.length - 1];
        console.log("Adding dog.. " + obj.microchipNumber);
        return instance.registerDog(
            obj.microchipNumber, 
            obj.breederId, 
            obj.name, 
            obj.isBitch, 
            "Labrador", 
            obj.dob, 
            ["blonde", "black"], 
            obj.dam, 
            obj.sire);

    }).then(function(result) {
        console.log("Last Transaction:", result.tx);
        console.log("Finished!");
        done();
    }).catch(function(e) {
        console.log(e);
        done();
    });
};