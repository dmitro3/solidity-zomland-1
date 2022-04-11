// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Main is ReentrancyGuard, Ownable {
  address public contractLandNFT;
  address public contractZombieNFT;
  address public contractTokenFT;

  function updateContractAddress(address _landNFT, address _zombieNFT, address _tokenFT) public onlyOwner {
    contractLandNFT = _landNFT;
    contractZombieNFT = _zombieNFT;
    contractTokenFT = _tokenFT;
  }
}