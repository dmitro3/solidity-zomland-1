// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

contract LandNFTHelperContract is Initializable, OwnableUpgradeable, UUPSUpgradeable, Utils, Modifiers {

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContract) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();

    mainContract = _mainContract;
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

}
