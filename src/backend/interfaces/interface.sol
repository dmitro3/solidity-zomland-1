// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

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

interface INFT {
  function buyToken(uint, uint, address) external returns (address);

  function setMarketSalePrice(uint, uint, address) external;
}

interface ILandNFT is IERC721, INFT {
  function landInfo(uint) external view returns (address, string memory, uint);

  function landInfoType(uint) external view returns (string memory);

  function getLandMintZombiesCount(uint) external view returns (uint8);

  function landSetMintTimestamp(uint) external;
}

interface IZombieNFT is IERC721, INFT {
  function checkAndBurnZombies(address, uint[] calldata, uint) external returns (uint, uint, uint, uint, uint);

  function getRandomRarityByZombies(uint[] calldata) external returns (string memory);

  function getRarityCollection(uint) external view returns (string memory, uint);

}

interface IMonsterNFT is IERC721, INFT {
  function safeMint(uint, uint[] memory, address) external returns (uint);

  function getRarityCollection(uint) external view returns (string memory, uint);

}


interface ITokenFT is IERC20 {
  function transferOnKill(address, uint) external;
}

interface IMarket {
  function removeFromMarketExternal(uint, string memory) external;

  function getLandsFromMarket(uint, uint8, string memory) external view returns (uint, uint[] memory);

  function getZombiesMonstersFromMarket(uint, uint8, string memory, string memory, string memory) external view returns (uint, uint[] memory);
}
