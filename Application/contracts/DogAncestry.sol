pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;


contract DogAncestry {
    struct Record {
        address recorder; // the vet responsible for creating the record
        uint256 date; // the date that this record applies from
        string title; // a short description e.g. "Vaccination"
        string details; // any extra details
    }

    struct Dog {
        address registerer; //the vet responsible for registering this dog
        uint256 microchipNumber; // this dog's microchip number
        string name;
        string breed; // the dog's primary breed
        uint256 dob;
        //bool isDobApproximated;
        uint256 dam; // mother's microchip number
        uint256 sire; // father's microchip number
        uint256[] offspring; // offspring's microchip numbers
        Record[] medicals; // list of relevant medical records, e.g. vaccinations
    }

    mapping(uint256 => Dog) public dogs;

    event DogRegistered(uint256 dogId);
    event NewRecord(uint256 dogId, uint256 recordNum);

    // A special function only run during the creation of the contract
    constructor() public {
        registerDog(100, "Jannet", "Poo", 123456789, 0, 0);
        registerDog(101, "Steve", "Dle", 123456789, 0, 0);
        registerDog(102, "Lindsay", "Labra", 123456789, 0, 0);
        registerDog(103, "Jim", "Dor", 123456789, 0, 0);
        registerDog(104, "Stevette", "Poodle", 123456789, 100, 101);
        registerDog(105, "Jindsay", "Labrador", 123456789, 102, 103);
        registerDog(106, "Jindette", "Labradoodle", 123456789, 104, 105);
    }

    // Register a new dog on the Blockchain.
    function registerDog(
        uint256 microchipNumber,
        string memory name,
        string memory breed,
        uint256 dob,
        uint256 dam,
        uint256 sire
    ) public {
        require(microchipNumber != 0, "Microchip Number cannot be zero.");
        require(
            dogs[microchipNumber].microchipNumber == 0,
            "Dog already registered"
        );
        require(bytes(name).length != 0, "Name is required");
        require(bytes(breed).length != 0, "Breed is required"); // we could possible make this a bit more rigorous

        // could check if dam and sire are in the system
        // however, that would imply that they would need to be added to the system first
        // which is probably not desired behaviour.

        // create our dog!
        dogs[microchipNumber].registerer = msg.sender;
        dogs[microchipNumber].microchipNumber = microchipNumber;
        dogs[microchipNumber].name = name;
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
                details: details
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
