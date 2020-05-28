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

    event ApplicationLodged(address _addr);
    event ApplicationProcessed(address _addr, bool approved);
    event ApprovalRevoked(address _addr);

    // From https://solidity.readthedocs.io/en/v0.4.24/common-patterns.html
    modifier onlyBy(address _addr) {
        require(
            msg.sender == _addr,
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
        require(bytes(_name).length != 0, "Name is required");
        require(bytes(_license).length != 0, "ID is required");
        require(bytes(_location).length != 0, "Location is required");

        if (vets[msg.sender].exists) {
            // Vet has applied previously with this address, "renew" application
            int appIndex = getApplicationIndex(msg.sender);
            assert(appIndex >= 0);
            applications.list[uint(appIndex)].processed = false;
        }
        else {
            Application memory application = Application(msg.sender, false);
            applications.list.push(application);
            applications.size++;
        }
        
        vets[msg.sender].addr = msg.sender;
        vets[msg.sender].name = _name;
        vets[msg.sender].license = _license;
        vets[msg.sender].location = _location;
        vets[msg.sender].approved = false;
        vets[msg.sender].exists = true;
        
        emit ApplicationLodged(msg.sender);
    }

    // Sets the approved status of the vet with the given address to the given value, if
    // the vet exists. Restricted to contract owner.
    function processApplication(
        address _addr,
        bool _approved
    ) public onlyBy(owner) {
        require(vets[_addr].exists == true, "Vet does not exist");

        vets[_addr].approved = _approved;

        // Change application status to processed
        for (uint i = 0; i < applications.size; i++) {
            if (applications.list[i].addr == _addr) {
                applications.list[i].processed = true;
                break;
            }
        }
        emit ApplicationProcessed(vets[_addr].addr, _approved);
    }


    // Sets the approved status of the vet corresponding to the give application index
    // to the given value, if index is within range. More efficient if the application
    // index is known. Restricted to contract owner.
    function processApplication(
        uint _index,
        bool _approved
    ) public onlyBy(owner) {
        require(_index >= 0 && _index < applications.size, "Application index out of range");
        address addr = applications.list[_index].addr;
        applications.list[_index].processed = true;
        vets[addr].approved = _approved;
        emit ApplicationProcessed(addr, _approved);
    }

    // Sets the status of the vet with the given address to not approved, if the vet
    // exists. Restriced to contract owner.
    function revokeApproval(address _addr) public onlyBy(owner) {
        require(vets[_addr].exists == true, "Vet does not exist");
        
        vets[_addr].approved = false;

        emit ApprovalRevoked(_addr);
    }

    // Returns true if given address is an approved vet, otherwise false.
    function isApproved(address _addr) public view returns (bool){
        return vets[_addr].approved || isOwner(_addr);
    }

    // Returns true if given address is owner, otherwise false.
    function isOwner(address _addr) public view returns (bool){
        return _addr == owner;
    }

    // Returns true if the given address is a vet (approved or non-approved), otherwise false.
    function isVet(address _addr) public view returns (bool){
        return vets[_addr].exists;
    }

    // Returns the number of applications applications
    function getApplicationCount() public view returns (uint) {
        return applications.size;
    }

    // Return true if the application corresponding to the given index is pending (i.e.
    // has yet to be processed) and the given index is not out of bounds, otherwise false.
    function isPending(uint _index) public view returns (bool) {
        if (_index >= 0 && _index < applications.size) {
            return !applications.list[_index].processed;
        } else {
            return false;
        }
    }

    // Returns the index of the application in the stored ApplicationList corresponding
    // to the given address if there exists a Vet with that address, otherwise -1.
    function getApplicationIndex(address _addr) public view returns (int) {
        for (uint i = 0; i < applications.size; i++) {
            if (applications.list[i].addr == _addr) {
                return int(i);
            }
        }
        return -1;
    }

    // Returns the Vet corresponding to the given application index. If the given index
    // is out of bounds, returns "blank" vet with default values.
    function getVet(uint _index) public view returns (Vet memory) {
        Vet memory vet;
        // Return "blank" vet if array index is out of bounds
        if (_index >= 0 && _index < applications.size) {
            address addr = applications.list[_index].addr;
            vet = vets[addr];
        }
        return vet;
    }

}
