// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MainContract is ReentrancyGuard, Ownable {
  address public contractMain;
  address public contractLandNFT;
  address public contractZombieNFT;
  address public contractMonsterNFT;
  address public contractTokenFT;
  address public contractCollection;

  function updateContractAddress(
    address _landNFT,
    address _zombieNFT,
    address _monsterNFT,
    address _tokenFT,
    address _collection
  ) public onlyOwner {
    contractMain = address(this);
    contractLandNFT = _landNFT;
    contractZombieNFT = _zombieNFT;
    contractMonsterNFT = _monsterNFT;
    contractTokenFT = _tokenFT;
    contractCollection = _collection;
  }
}