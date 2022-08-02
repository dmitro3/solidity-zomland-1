// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "../abstract/modifiers.sol";

contract MainContract is Initializable, OwnableUpgradeable, UUPSUpgradeable, Modifiers {
  address internal contractLandNFT;
  address internal contractLandNFTHelper;
  address internal contractZombieNFT;
  address internal contractZombieNFTHelper;
  address internal contractMonsterNFT;
  address internal contractMonsterNFTHelper;
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
    address _landNFTHelper,
    address _zombieNFT,
    address _zombieNFTHelper,
    address _monsterNFT,
    address _monsterNFTHelper,
    address _tokenFT,
    address _collection,
    address _market
  ) public onlyOwner {
    contractLandNFT = _landNFT;
    contractLandNFTHelper = _landNFTHelper;
    contractZombieNFT = _zombieNFT;
    contractZombieNFTHelper = _zombieNFTHelper;
    contractMonsterNFT = _monsterNFT;
    contractMonsterNFTHelper = _monsterNFTHelper;
    contractTokenFT = _tokenFT;
    contractCollection = _collection;
    contractMarket = _market;
  }

  function getContractLandNFT() external view returns (address) {
    return contractLandNFT;
  }

  function getContractLandNFTHelper() external view returns (address) {
    return contractLandNFTHelper;
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

  function getContractMonsterNFTHelper() external view returns (address) {
    return contractMonsterNFTHelper;
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

  // ---------------- External Limited methods ---------------

  function transferOnKill(address _account, uint _amount) external onlyZombieMonsterContract {
    IERC20Upgradeable(address(contractTokenFT)).transfer(_account, _amount);
  }
}
