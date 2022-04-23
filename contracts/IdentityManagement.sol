// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract IdentityManagement {
    // Model a User
    struct UserID {
        uint id;
        string dl_no;
        string dl_name;
        string dl_address;
    }
    struct Insitution {
        uint id;
        string institution_name;
    }
    struct Request {
        uint id;
        string request_name;
        string request_status;
    }
    // Store user that is registered
    mapping(address => bool) public registeredUser;
    // Store User
    // Fetch User
    mapping(uint => UserID) public users;
    // Read user

    uint public usersCount;

    // Constructor
    constructor () public {
        addUserID();
    }

    function addUserID() public {
        usersCount++;
        users[usersCount] = UserID(usersCount, "Y2358364", "Vi Nguyen", "San Jose, CA");
    }

    function viewUser() private {

    }

    function sendRequest() private {

    }

    function updateRequest() private {

    }

    function viewRequest() private {

    }


}