var DogAncestry = artifacts.require("DogAncestry");
module.exports = function(done) {
    console.log("Getting deployed version of DogAncestry...")
    var jsonData = require('./sample-pedigree.json');
    var recordJsonData = require('./record-generation.json');
        DogAncestry.deployed().then(
            function(instance) {
                let result;

                // create some dogs
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
                console.log("This will take a minute... please be patient");
                return instance;

        }).then(function(instance) { 
            // create some records

            let result;

            var minDate = new Date(2000, 0, 0);
            var maxDate = new Date();

            for(let i = 0; i < jsonData.length; i++) {
                var microchipNumber = jsonData[i].microchipNumber;
                var numOfRecords = Math.random() * 5 + 1;
                for(let j = 0; j < numOfRecords; j++) {
                    var recordType = recordJsonData.types[Math.floor(Math.random() * recordJsonData.types.length)];
                    if (recordType == "genetic-condition" && Math.random() > 0.1) continue; // don't want too many genetic conditions coming through
                    var title = "A Title";
                    switch (recordType) {
                        case "vaccination":
                            title = recordJsonData.vaccinationTitles[Math.floor(Math.random() * recordJsonData.vaccinationTitles.length)];
                            break;
                        case "award":
                            title = recordJsonData.awardTitles[Math.floor(Math.random() * recordJsonData.awardTitles.length)];
                            break;
                        case "genetic-condition":
                            title = recordJsonData.geneticConditionTitles[Math.floor(Math.random() * recordJsonData.geneticConditionTitles.length)];
                            break;
                    }
                    var date = Math.floor((new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()))).getTime() / 1000);
                    var details = recordJsonData.descriptions[Math.floor(Math.random() * recordJsonData.descriptions.length)];
                    console.log("Creating record for dog.. " + microchipNumber);
                    result = instance.createRecord(
                        microchipNumber,
                        recordType,
                        date,
                        title,
                        details); 
                }
            }
            console.log("This will take a minute... please be patient");
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