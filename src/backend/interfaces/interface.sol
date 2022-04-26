// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

  enum CardRarity {
    Common,
    Uncommon,
    Rare,
    Epic
  }

interface IMain {
  function getContractLandNFT() external view returns (address);

  function getContractZombieNFT() external view returns (address);

  function getContractMonsterNFT() external view returns (address);

  function getContractTokenFT() external view returns (address);

  function getContractCollection() external view returns (address);
}


interface ICollection {
  function getAllCollectionsCount() external view returns (uint);

  function getCollectionAndZombie(uint8) external view returns (uint, string memory);
}


interface ILandNFT is IERC721 {
  function getLandMintZombiesCount(uint) external view returns (uint8);

  function landSetMintTimestamp(uint) external;
}

interface IMonsterNFT is IERC721 {
  function checkAndBurnZombies(address, uint) external returns (uint, uint, uint, uint, uint, CardRarity);

  function getCollectionImage(uint) external returns (string);
}


interface ITokenFT is IERC20 {
  function transferOnKill(address, uint) external;
}