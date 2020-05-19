pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;


contract DogAncestry {
    struct Record {
        address recorder; // the vet responsible for creating the record
        uint256 date; // the date that this record applies from
        string title; // a short description e.g. "Vaccination"
        string details; // any extra details
        string recordType; // Vaccination, Genetic-Condition, Award, Custom
    }

    struct Dog {
        /* REGISTRY INFORMATION */
        address registerer; //the vet responsible for registering this dog
        uint256 microchipNumber; // this dog's microchip number
        string breederId; // optional


        /* ANCESTRY INFORMATION */
        uint256 dam; // mother's microchip number
        uint256 sire; // father's microchip number
        uint256[] offspring; // offspring's microchip numbers

        /* DOG INFORMATION */
        string name;
        bool isBitch; // the dog's sex TRUE = FEMALE, FALSE = MALE
        string breed; // the dog's primary breed
        uint256 dob;
        string[] colors; // in order of precedence
        //bool isDobApproximated;


        /* RECORD INFORMATION */
        Record[] medicals; // list of relevant medical records, e.g. vaccinations
    }

    mapping(uint256 => Dog) public dogs;

    event DogRegistered(uint256 dogId);
    event NewRecord(uint256 dogId, uint256 recordNum);

    // A special function only run during the creation of the contract
    constructor() public {

        //register format = ID, name, isFemale, Breed, DOB, DAM ID, SIRE ID

        //[OUTBRED ANCESTOR SUBTREE]
        registerDog(100, "Jannet", true, "Poodle", 111111111, 0, 0);
        registerDog(101, "Steve", false, "Husky", 111111111, 0, 0);
        registerDog(102, "Lindsay", true, "Labrador", 111111111, 0, 0);
        registerDog(103, "Jim", false,"Labrador", 111111111, 0, 0);

        registerDog(104, "Stevette", true, "Poodle", 222222222, 100, 101);
        registerDog(105, "Jindsay", false, "Labrador", 222222222, 102, 103);

        registerDog(106, "Jindette", false, "Labradoodle", 333333333, 104, 105);

        //[FULL SIBLING INBRED SUBTREE]
        registerDog(200, "Sarah", true, "Beagle", 111111111, 0, 0);
        registerDog(201, "Stevay", false, "Husky", 333333333, 104, 105);
        registerDog(202, "Adele", true, "Labrador", 111111111, 0, 0);

        registerDog(203, "Sandette", false, "Labrador", 444444444, 200, 201);
        registerDog(204, "Whitney", true, "Poodle", 444444444, 202, 201);
        
        //[DOG WITH RECORDS]
        // registerDog(205, "Naveah", true, "Labrador", 555555555, 204, 203);
        // createRecord(205, 123456789, "Record 1", "This is the first record ever!");
        // createRecord(205, 123456789, "Vaccination", "Doggy went to vet for some vaccinations bruh.");
        // createRecord(205, 123456789, "Broken Bone", "Poor dag broke a bone :(");

    }

    // Register a new dog on the Blockchain.
    function registerDog(
        uint256 microchipNumber,
        string memory name,
        bool isBitch, //1 = female, 0 = male
        string memory breed,
        uint256 dob,
        uint256 dam,
        uint256 sire
    ) public {
        require(microchipNumber != 0, "Microchip number cannot be zero");
        require(
            dogs[microchipNumber].microchipNumber == 0,
            "Dog already registered"
        );

        require(bytes(name).length != 0, "Name is required");
        require(bytes(breed).length != 0, "Breed is required"); // we could possible make this a bit more rigorous

        // could check if dam and sire are in the system
        // however, that would imply that they would need to be added to the system first
        // which is probably not desired behaviour.

        // if the dam exists...
        if (dam != 0 && dogs[dam].microchipNumber != 0) {
            // check she is of the correct gender
            require(dogs[dam].isBitch, "Dam is not a bitch");
            // check that her DOB predates this dog's (this should prevent cycles from forming)
            require(dogs[dam].dob < dob, "Date of birth cannot predate dam's date of birth.");
        }
        // if the sire exists...
        if (sire != 0 && dogs[sire].microchipNumber != 0) {
            // check he is of the correct gender
            require(!dogs[sire].isBitch, "Sire cannot be a bitch");
            // check that his DOB predates this dog's (this should prevent cycles from forming)
            require(dogs[sire].dob < dob, "Date of birth cannot predate sire's date of birth.");
        }

        // we also need to any claims offspring have implied
        for (uint i = 0; i < dogs[microchipNumber].offspring.length; i++) {
            Dog memory offspring = dogs[dogs[microchipNumber].offspring[i]];

            // check that the offspring's DOB is after this dog's
            require(dob < offspring.dob, "Date of birth cannot postdate offspring's date of birth.");

            if (isBitch) { // if we are registering this dog as a bitch, then its offspring must say that this dog is their dam
                require(microchipNumber == offspring.dam, "Dog must be a bitch");
            } else { // vise-versa
                require(microchipNumber == offspring.sire, "Dog cannot be a bitch");
            }
        }

        // create our dog!
        dogs[microchipNumber].registerer = msg.sender;
        dogs[microchipNumber].microchipNumber = microchipNumber;
        dogs[microchipNumber].name = name;
        dogs[microchipNumber].isBitch = isBitch;
        dogs[microchipNumber].breed = breed;
        dogs[microchipNumber].dob = dob;
        dogs[microchipNumber].dam = dam;
        dogs[microchipNumber].sire = sire;

        // let's also update the parents
        if (dam != 0) {
            dogs[dam].offspring.push(microchipNumber);
        }
        if (sire != 0) {
            dogs[sire].offspring.push(microchipNumber);
        }

        emit DogRegistered(microchipNumber);
    }

    // Create a medical record for a dog.
    function createRecord(
        uint256 microchipNumber,
        uint256 date,
        string memory title,
        string memory details
    ) public {
        // we need to add some kind of access control here to limit who can actually create records for the dog

        require(
            dogs[microchipNumber].microchipNumber != 0,
            "Dog is not registered"
        );

        require(bytes(title).length != 0, "Title is required");

        // create our record and get its index
        dogs[microchipNumber].medicals.push(
            Record({
                recorder: msg.sender,
                date: date,
                title: title,
                details: details,
                recordType: "custom"
            })
        );

        // emit NewRecord(microchipNumber, recordNumber);
    }

    ///////////////////////////////////////////////////////////////////////////
    //// GETTERS
    ///////////////////////////////////////////////////////////////////////////
    function getDog(uint microchipNumber) public view returns(Dog memory) {
        return dogs[microchipNumber];
    }

    // function getRecord(uint microchipNumber, uint recordNumber) public view returns(string memory) {
    //     return dogs[microchipNumber].medicals[recordNumber].title;
    // }
}
