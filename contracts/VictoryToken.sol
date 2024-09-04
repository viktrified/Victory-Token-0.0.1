// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.5/contracts/token/ERC20/ERC20.sol";

contract VictoryToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("VictoryToken", "VYT") {
        _mint(msg.sender, initialSupply);
    }
}