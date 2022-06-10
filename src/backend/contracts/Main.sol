// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MainContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
  address internal contractLandNFT;
  address internal contractZombieNFT;
  address internal contractZombieNFTHelper;
  address internal contractMonsterNFT;
  address internal contractTokenFT;
  address internal contractCollection;
  address internal contractMarket;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize() public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

  function updateContractAddress(
    address _landNFT,
    address _zombieNFT,
    address _zombieNFTHelper,
    address _monsterNFT,
    address _tokenFT,
    address _collection,
    address _market
  ) public onlyOwner {
    contractLandNFT = _landNFT;
    contractZombieNFT = _zombieNFT;
    contractZombieNFTHelper = _zombieNFTHelper;
    contractMonsterNFT = _monsterNFT;
    contractTokenFT = _tokenFT;
    contractCollection = _collection;
    contractMarket = _market;
  }

  function getContractLandNFT() external view returns (address) {
    return contractLandNFT;
  }

  function getContractZombieNFT() external view returns (address) {
    return contractZombieNFT;
  }

  function getContractZombieNFTHelper() external view returns (address) {
    return contractZombieNFTHelper;
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

  function getContractMarket() external view returns (address) {
    return contractMarket;
  }
}
