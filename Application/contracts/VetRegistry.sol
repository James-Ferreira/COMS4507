pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;


contract VetRegistry {
    struct Vet {
        address addr;
        string license;
        string name;
        string location;
        bool approved;
        bool exists;
    }

    struct Application {
        address addr;
        bool processed;
    }

    struct ApplicationList {
        Application[] list;
        uint size;
    }

    address owner;
    mapping(address => Vet) public vets;
    ApplicationList public applications;

    event ApplicationLodged(string _license);
    event ApplicationApproved(string _license);

    // From https://solidity.readthedocs.io/en/v0.4.24/common-patterns.html
    modifier onlyBy(address _account) {
        require(
            msg.sender == _account,
            "Sender not authorised."
        );
        _;
    }

    // From https://solidity.readthedocs.io/en/v0.4.24/common-patterns.html
    function changeOwner(address _newOwner)
        public
        onlyBy(owner) {
        owner = _newOwner;
    }

    constructor() public {
        owner = msg.sender;
    }

    // Adds unapproved vet with given details.
    function makeApplication(
        string memory _name,
        string memory _license,
        string memory _location
    ) public {
        require(vets[msg.sender].exists != true, "Vet already registered with this address");
        require(bytes(_license).length != 0, "ID is required");
        require(bytes(_name).length != 0, "Name is required");
        require(bytes(_location).length != 0, "Location is required");

        vets[msg.sender].addr = msg.sender;
        vets[msg.sender].name = _name;
        vets[msg.sender].license = _license;
        vets[msg.sender].location = _location;
        vets[msg.sender].approved = false;
        vets[msg.sender].exists = true;

        Application memory application = Application(msg.sender, false);
        applications.list.push(application);
        applications.size++;

        emit ApplicationLodged(_license);
    }

    // Sets the vet with the given address to approved, if they exist. Restricted to
    // contract owner.
    function approveApplication(
        address _account
    ) public onlyBy(owner) {
        require(vets[_account].exists == true, "Vet does not exist");

        vets[_account].approved = true;

        // Change application status to processed
        for (uint i = 0; i < applications.size; i++) {
            if (applications.list[i].addr == msg.sender) {
                applications.list[i].processed = true;
                break;
            }
        }
        emit ApplicationApproved(vets[_account].license);
    }

    // Returns true if sender is an approved vet, otherwise false.
    function isApprovedVet(address _sender) public view returns (bool){
        return vets[_sender].approved || isOwner(_sender);
    }

    // Returns true if sender is owner, otherwise false.
    function isOwner(address _sender) public view returns (bool){
        return _sender == owner;
    }

    // Returns the number of applications applications
    function getApplicationCount() public view returns (uint) {
        return applications.size;
    }

    // Return true if the application corresponding to the given index is pending (i.e.
    // has yet to be processed) and the given index is not out of bounds, otherwise false.
    function isPending(uint _index) public view returns (bool) {
        if (_index > 0 && _index < applications.size) {
            return !applications.list[_index].processed;
        } else {
            return false;
        }
    }

    // Returns the Vet corresposnding to the given application index. If the given index
    // is out of bounds, returns "blank" vet with default values.
    function getVetByApplicationIndex(uint _index) public view returns (Vet memory) {
        Vet memory vet;
        // Return "blank" vet if array index is out of bounds
        if (_index > 0 && _index < applications.size) {
            address addr = applications.list[_index].addr;
            vet = vets[addr];
        }
        return vet;
    }

}
