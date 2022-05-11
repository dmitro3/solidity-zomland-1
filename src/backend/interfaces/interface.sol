// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMain {
  function getContractLandNFT() external view returns (address);

  function getContractZombieNFT() external view returns (address);

  function getContractMonsterNFT() external view returns (address);

  function getContractTokenFT() external view returns (address);

  function getContractCollection() external view returns (address);

  function getContractMarket() external view returns (address);
}


interface ICollection {
  function getAllCollectionsCount() external view returns (uint);

  function getCollectionAndZombie(uint8) external view returns (uint, string memory);

  function getCollectionImage(uint) external returns (string memory);
}


interface ILandNFT is IERC721 {
  function getLandMintZombiesCount(uint) external view returns (uint8);

  function landSetMintTimestamp(uint) external;

  function setLandSalePrice(uint, uint) external;
}

interface IZombieNFT is IERC721 {
  function checkAndBurnZombies(address, uint[] calldata) external returns (uint, uint, uint, uint, uint);

  function getRandomRarityByZombies(uint[] calldata) external returns (string memory);

  function setZombieSalePrice(uint, uint) external;
}

interface IMonsterNFT is IERC721 {
  function setMonsterSalePrice(uint, uint) external;
}


interface ITokenFT is IERC20 {
  function transferOnKill(address, uint) external;
}

interface IMarket {
  function getFromMarket(uint _startIndex, uint8 _count, string memory typeNFT) external view returns (uint, uint[] memory);
}