// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IMain {
  function getContractLandNFT() external view returns (address);

  function getContractZombieNFT() external view returns (address);

  function getContractZombieNFTHelper() external view returns (address);

  function getContractMonsterNFT() external view returns (address);

  function getContractMonsterNFTHelper() external view returns (address);

  function getContractTokenFT() external view returns (address);

  function getContractCollection() external view returns (address);

  function getContractMarket() external view returns (address);
}

interface ICollection {
  function getAllCollectionsCount() external view returns (uint);

  function getCollectionAndZombie(uint8) external view returns (uint, string memory);

  function getCollectionImage(uint) external returns (string memory);
}

interface INFT {
  function buyToken(uint, uint, address) external returns (address);

  function setMarketSalePrice(uint, uint, address) external;
}

interface ILandNFT is IERC721Upgradeable, INFT {
  function landInfo(uint) external view returns (address, string memory, uint);

  function landInfoType(uint) external view returns (string memory);

  function getLandMintZombiesCount(uint) external view returns (uint8);

  function landSetMintTimestamp(uint) external;
}

interface IZombieNFT is IERC721Upgradeable, INFT {
  function checkAndBurnZombies(address, uint[] calldata, uint) external returns (uint, uint, uint, uint, uint);

  function getRandomRarityByZombies(uint[] calldata) external returns (string memory);

  function getRarityCollection(uint) external view returns (string memory, uint);

  function tokenOfOwnerByIndex(address, uint) external view returns (uint);

  function getUserZombieCollection(address, uint) external view returns (uint[] memory);

  function getUserZombieRarity(address, string memory) external view returns (uint[] memory);
}

interface IZombieNFTHelper is IERC721Upgradeable {
  function getRarityTokenPrice(string memory) external pure returns (uint);

  function generateMetadata(uint8) external returns (string memory, uint8, uint8, uint8, uint8, uint, uint, string memory);

  function getPageIdList(uint, uint, uint, string memory, address) external view returns (uint[] memory, uint, uint);

  function getStartEndIndex(uint, uint, uint) external pure returns (uint, uint);
}

interface IMonsterNFT is IERC721Upgradeable, INFT {
  function safeMint(uint, uint[] memory, address) external returns (uint);

  function getRarityCollection(uint) external view returns (string memory, uint);

  function getUserMonsterRarity(address, string memory) external view returns (uint[] memory);

  function tokenOfOwnerByIndex(address, uint) external view returns (uint);
}

interface IMonsterNFTHelper is IERC721Upgradeable {
  function getPageIdList(uint, uint, string memory, address) external view returns (uint[] memory, uint, uint);
}

interface ITokenFT is IERC20Upgradeable {
  function transferOnKill(address, uint) external;
}

interface IMarket {
  function removeFromMarketExternal(uint, string memory) external;

  function getLandsFromMarket(uint, uint8, string memory) external view returns (uint, uint[] memory);

  function getZombiesMonstersFromMarket(uint, uint8, string memory, string memory, string memory) external view returns (uint, uint[] memory);
}
