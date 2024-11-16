// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Escrow.sol";
import "@openzeppelin-contracts-5.0.1/token/ERC20/ERC20.sol";

// Mock ERC20 Token
interface IUSDC {
    function balanceOf(address account) external view returns (uint256);
    function mint(address to, uint256 amount) external;
    function configureMinter(address minter, uint256 minterAllowedAmount) external;
    function masterMinter() external view returns (address);
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
    function decimals() external view returns (uint8);
}

function stringToAddress(string memory s) pure returns (address) {
    bytes memory b = bytes(s);
    uint160 result = 0;
    for (uint i = 0; i < b.length; i++) {
        uint160 c = uint160(uint8(b[i]));
        if (c >= 48 && c <= 57) {
            result = result * 16 + (c - 48);
        } else if (c >= 65 && c <= 70) {
            result = result * 16 + (c - 55);
        } else if (c >= 97 && c <= 102) {
            result = result * 16 + (c - 87);
        }
    }
    return address(result);
}

contract MarketplaceEscrowTest is Test {
    MarketplaceEscrow public escrow;
    IUSDC public usdc;

    // Convert string to address
    address seller = stringToAddress(vm.envString("SELLER_ADDRESS"));
    address buyer = stringToAddress(vm.envString("BUYER_ADDRESS"));

    function setUp() public {
        vm.createFork(vm.envString("SEPOLIA_RPC_URL"));

        // USDC on Sepolia Network
        usdc = IUSDC(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238);

        // Deploy MarketplaceEscrow contract
        escrow = new MarketplaceEscrow(address(usdc));

        // Approve the escrow contract to spend buyer's tokens
        vm.prank(buyer);
        usdc.approve(address(escrow), 100 * 1e6);
    }

    function testList() public {
        vm.prank(seller);
        escrow.list("username1", 100 * 1e6);

        (string memory username, uint256 price, address sellerAddress, bool active) = escrow.listings("username1");

        assertEq(username, "username1");
        assertEq(price, 100 * 1e6);
        assertEq(sellerAddress, seller);
        assertTrue(active);
    }

    function testDeposit() public {
        // List an item
        vm.prank(seller);
        escrow.list("username1", 100 * 1e6);

        // Deposit USDC
        vm.prank(buyer);
        escrow.deposit("username1", 100 * 1e6);

        address buyerAddress = escrow.escrow("username1");
        (, , , bool active) = escrow.listings("username1");

        assertEq(buyerAddress, buyer);
        assertFalse(active); // Listing is no longer active
        assertEq(usdc.balanceOf(address(escrow)), 100 * 1e6);
    }

    function testWithdraw() public {
        // List an item
        vm.prank(seller);
        escrow.list("username1", 100 * 1e6);

        // Deposit USDC
        vm.prank(buyer);
        escrow.deposit("username1", 100 * 1e6);

        // Withdraw funds
        vm.prank(buyer);
        escrow.withdraw("username1");

        assertEq(usdc.balanceOf(seller), 100 * 1e6);
        assertEq(escrow.escrow("username1"), address(0)); // Escrow entry deleted
    }
}
