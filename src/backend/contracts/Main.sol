// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MainContract is Ownable {
  address internal contractLandNFT;
  address internal contractZombieNFT;
  address internal contractMonsterNFT;
  address internal contractTokenFT;
  address internal contractCollection;

  function updateContractAddress(
    address _landNFT,
    address _zombieNFT,
    address _monsterNFT,
    address _tokenFT,
    address _collection
  ) public onlyOwner {
    contractLandNFT = _landNFT;
    contractZombieNFT = _zombieNFT;
    contractMonsterNFT = _monsterNFT;
    contractTokenFT = _tokenFT;
    contractCollection = _collection;
  }

  function getContractLandNFT() external view returns (address) {
    return contractLandNFT;
  }

  function getContractZombieNFT() external view returns (address) {
    return contractZombieNFT;
  }

  function getContractMonsterNFT() external view returns (address) {
    return contractMonsterNFT;
  }

  function getContractTokenFT() external view returns (address) {
    return contractTokenFT;
  }

  function getContractCollection() external view returns (address) {
    return contractCollection;
  }
}