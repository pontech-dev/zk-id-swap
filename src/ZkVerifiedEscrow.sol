// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {WebProofProver} from "./vlayer/WebProofProver.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {IERC20} from "@openzeppelin-contracts-5.0.1/token/ERC20/IERC20.sol";

contract ZkVerifiedEscrow is Verifier {

	enum ListingStatus { LISTING, PROCESSING, DONE }

    struct Listing {
        string username;
        uint256 price;
        address seller;
        ListingStatus status;
    }

    address public prover;
    address public usdcToken;
    mapping(string => Listing) public listings; // username => Listing
    mapping(string => address) public escrow; // username => buyer
	string[] private _listUsernames;

    event Listed(string indexed username, uint256 price, address indexed seller);
    event Deposited(string indexed username, uint256 amount, address indexed buyer);
    event Withdrawn(string indexed username, uint256 amount, address indexed seller);

    constructor(address _prover, address _usdcToken) {
        prover = _prover;
        usdcToken = _usdcToken;
    }

    function listUsernames() external view returns (string[] memory) {
        return _listUsernames;
    }

    function list(Proof calldata, string memory username, address account, uint256 price)
        external
        onlyVerified(prover, WebProofProver.main.selector)
    {
        require(listings[username].seller == address(0), "Username already listed");

        listings[username] = Listing({
            username: username,
            price: price,
            seller: msg.sender,
            status: ListingStatus.LISTING
        });

		_listUsernames.push(username);

        emit Listed(username, price, msg.sender);
    }

    function deposit(string memory username, uint256 price) external {
        Listing storage listing = listings[username];
        require(listing.status == ListingStatus.LISTING, "Listing not active");
        require(listing.price == price, "Price mismatch");
        require(listing.seller != address(0), "Invalid listing");

        IERC20(usdcToken).transferFrom(msg.sender, address(this), price);
        escrow[username] = msg.sender;
        listing.status = ListingStatus.PROCESSING;

        emit Deposited(username, price, msg.sender);
    }

    function withdraw(Proof calldata, string memory username, address account, uint256 price)
        external
        onlyVerified(prover, WebProofProver.main.selector)
    {
        address buyer = escrow[username];
        require(buyer != address(0), "No escrow for this username");
        require(msg.sender == buyer, "Only buyer can withdraw");
		require(price == listings[username].price, "Price mismatch");

        uint256 amount = listings[username].price;
        listings[username].status = ListingStatus.DONE;
        delete escrow[username];

        IERC20(usdcToken).transfer(listings[username].seller, amount);

        emit Withdrawn(username, amount, listings[username].seller);
    }
}
