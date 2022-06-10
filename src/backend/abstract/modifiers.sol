// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../interfaces/interface.sol";

abstract contract Modifiers {
  address internal mainContract;

  function _onlyMarketContract() private view {
    address _marketContract = IMain(mainContract).getContractMarket();
    require(_marketContract == msg.sender, "You can't call this method");
  }

  modifier onlyMarketContract() {
    _onlyMarketContract();
    _;
  }

  function _onlyMonsterContract() private view {
    address _monsterContract = IMain(mainContract).getContractMonsterNFT();
    require(_monsterContract == msg.sender, "You can't call this method");
  }

  modifier onlyMonsterContract() {
    _onlyMonsterContract();
    _;
  }

  function _onlyZombieContract() private view {
    address zombieContract = IMain(mainContract).getContractZombieNFT();
    require(zombieContract == msg.sender, "You can't call this method");
  }

  modifier onlyZombieContract() {
    _onlyZombieContract();
    _;
  }

  function _onlyTokenContract() private view {
    address _tokenContract = IMain(mainContract).getContractTokenFT();
    require(_tokenContract == msg.sender, "You can't call this method");
  }

  modifier onlyTokenContract() {
    _onlyTokenContract();
    _;
  }

  function _onlyZombieMonsterContract() private view {
    address monsterContract = IMain(mainContract).getContractMonsterNFT();
    address zombieContract = IMain(mainContract).getContractZombieNFT();
    require(zombieContract == msg.sender || monsterContract == msg.sender, "You can't call this method");
  }


  modifier onlyZombieMonsterContract() {
    _onlyZombieMonsterContract();
    _;
  }

  function _onlyNFTContract() private view {
    address monsterContract = IMain(mainContract).getContractMonsterNFT();
    address zombieContract = IMain(mainContract).getContractZombieNFT();
    address landContract = IMain(mainContract).getContractLandNFT();
    require(zombieContract == msg.sender || monsterContract == msg.sender || landContract == msg.sender, "You can't call this method");
  }

  modifier onlyNFTContract() {
    _onlyNFTContract();
    _;
  }

}
