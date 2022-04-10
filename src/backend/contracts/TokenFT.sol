// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFT is ERC20 {
  address contractMain;

  constructor(address _contractMain) ERC20("Zomland", "ZML") {
    contractMain = _contractMain;
    _mint(msg.sender, 1000000000 * 10 ** decimals());
  }
}