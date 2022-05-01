// SPDX-License-Identifier: MIT
// pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract IdentityManagement {
    // Model a User / Wallet
    struct Wallet {
        // uint id;
        address id;
        string name;
        string email;
        string phone;
    }

    // Model a Driver License
    struct DL {
        // uint id;
        address walletId;
        string dlNumber;
        string dlDob;
        string dlAddress;
    }

    struct Institution {
        uint id;
        
    }
    struct Request {
        uint id;
        string institution_name;
        address requestedId;
        // string[] requestedPermissions;
        // string[] approvedPermissions;
        string requestedPermissionsString;
        string approvedPermissionsString;
        string status;
    }

    event WalletCreated(address indexed _from, address indexed _id);
    event DLAttached(address indexed _from, address indexed _walletId, address indexed _dlId);
    event RequestCreated(uint _id);
    event RequestApproved(uint _id);
    
    mapping(address => Wallet) public wallets;
    mapping(address => DL) public DLs;
    mapping (uint => Request) public requests;

    uint public walletsCount;
    uint public dlsCount;
    uint public requestsCount;

    // Constructor
    constructor () public {}

    function addWallet(string memory name, string memory email, string memory phone) public returns (uint) {
        walletsCount++;
        wallets[msg.sender] = Wallet(msg.sender, name, email, phone);
        emit WalletCreated(msg.sender, msg.sender);
    }
 
    function attachDl(string memory name, string memory dob, string memory dlAddress) public {
        dlsCount++;
        DLs[msg.sender] = DL(msg.sender, name, dob, dlAddress);
        emit DLAttached(msg.sender, msg.sender, msg.sender);
    }

    function createRequest(string memory name, address requestedId, string memory permissionString) public {
        requestsCount++;
        requests[requestsCount] = Request(requestsCount, name, requestedId, permissionString, "", "PENDING");
        emit RequestCreated(requestsCount);
    }

    function approveRequest(uint requestId, string memory status, string memory permissionString) public {
        requests[requestId].approvedPermissionsString = permissionString;
        requests[requestId].status = status;

        emit RequestApproved(requestId);
    }
}