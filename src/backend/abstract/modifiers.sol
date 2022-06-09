// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../interfaces/interface.sol";

abstract contract Modifiers {
  address internal mainContract;

  modifier onlyMarketContract() {
    address _marketContract = IMain(mainContract).getContractMarket();
    require(_marketContract == msg.sender, "You can't call this method");
    _;
  }

  modifier onlyMonsterContract() {
    address _monsterContract = IMain(mainContract).getContractMonsterNFT();
    require(_monsterContract == msg.sender, "You can't call this method");
    _;
  }

  modifier onlyZombieContract() {
    address zombieContract = IMain(mainContract).getContractZombieNFT();
    require(zombieContract == msg.sender, "You can't call this method");
    _;
  }

  modifier onlyTokenContract() {
    address _tokenContract = IMain(mainContract).getContractTokenFT();
    require(_tokenContract == msg.sender, "You can't call this method");
    _;
  }

  modifier onlyZombieMonsterContract() {
    address monsterContract = IMain(mainContract).getContractMonsterNFT();
    address zombieContract = IMain(mainContract).getContractZombieNFT();
    require(zombieContract == msg.sender || monsterContract == msg.sender, "You can't call this method");
    _;
  }

  modifier onlyNFTContract() {
    address monsterContract = IMain(mainContract).getContractMonsterNFT();
    address zombieContract = IMain(mainContract).getContractZombieNFT();
    address landContract = IMain(mainContract).getContractLandNFT();
    require(zombieContract == msg.sender || monsterContract == msg.sender || landContract == msg.sender, "You can't call this method");
    _;
  }

}
