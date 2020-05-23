pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;


contract VetRegistry {
    struct Vet {
        address account;
        string id;
        string name;
        string location;
        bool approved;
        bool exists;
    }

    address public owner = msg.sender;
    mapping(address => Vet) public vets;
    address[] public pending;


    event ApplicationLodged(string _id);
    event ApplicationApproved(string _id);

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

    // Adds unapproved vet with given details.
    function makeApplication(
        string memory _id,
        string memory _name,
        string memory _location
    ) public {
        require(vets[msg.sender].exists != true, "Vet already registered with this address");
        require(bytes(_id).length != 0, "ID is required");
        require(bytes(_name).length != 0, "Name is required");
        require(bytes(_location).length != 0, "Location is required");

        vets[msg.sender].name = _name;
        vets[msg.sender].id = _id;
        vets[msg.sender].location = _location;
        vets[msg.sender].approved = false;
        vets[msg.sender].exists = true;

        pending.push(msg.sender);

        emit ApplicationLodged(_id);
    }

    // Sets the vet with the given address to approved, if they exist. Restricted to
    // contract owner.
    function approveApplication(
        address _account
    ) public onlyBy(owner) {
        require(vets[_account].exists == true, "Vet does not exist");

        vets[_account].approved = true;

        // Remove address from pending
        for (uint i = 0; i < pending.length; i++) {
            if (pending[i] == msg.sender) {
                pending[i] = pending[pending.length - 1];
                break;
            }
        }
        emit ApplicationApproved(vets[_account].id);
    }

    // Returns true if sender is an approved vet, otherwise false.
    function isApprovedVet(address _sender) public view returns (bool){
        return vets[_sender].approved == true;
    }

    // Returns true if sender is owner, otherwise false.
    function isOwner(address _sender) public view returns (bool){
        return _sender == owner;
    }
}