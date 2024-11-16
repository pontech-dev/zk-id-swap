// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin-contracts-5.0.1/token/ERC20/IERC20.sol";

contract MarketplaceEscrow {
    struct Listing {
        string username;
        uint256 price;
        address seller;
        bool active;
    }

    address public usdcToken;
    mapping(string => Listing) public listings; // username => Listing
    mapping(string => address) public escrow; // username => buyer

    event Listed(string indexed username, uint256 price, address indexed seller);
    event Deposited(string indexed username, uint256 amount, address indexed buyer);
    event Withdrawn(string indexed username, uint256 amount, address indexed seller);

    constructor(address _usdcToken) {
        usdcToken = _usdcToken;
    }

    function list(string memory username, uint256 price) external {
        require(listings[username].seller == address(0), "Username already listed");

        listings[username] = Listing({
            username: username,
            price: price,
            seller: msg.sender,
            active: true
        });

        emit Listed(username, price, msg.sender);
    }

    function deposit(string memory username, uint256 price) external {
        Listing storage listing = listings[username];
        require(listing.active, "Listing not active");
        require(listing.price == price, "Price mismatch");
        require(listing.seller != address(0), "Invalid listing");

        IERC20(usdcToken).transferFrom(msg.sender, address(this), price);
        escrow[username] = msg.sender;
        listing.active = false;

        emit Deposited(username, price, msg.sender);
    }

    function withdraw(string memory username) external {
        address buyer = escrow[username];
        require(buyer != address(0), "No escrow for this username");
        require(msg.sender == buyer, "Only buyer can withdraw");

        uint256 amount = listings[username].price;
        listings[username].active = false;
        delete escrow[username];

        IERC20(usdcToken).transfer(listings[username].seller, amount);

        emit Withdrawn(username, amount, listings[username].seller);
    }
}
