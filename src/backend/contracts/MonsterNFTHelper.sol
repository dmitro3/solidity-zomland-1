// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";


contract MonsterNFTHelperContract is Initializable, OwnableUpgradeable, UUPSUpgradeable, Utils, Modifiers {

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

  // ---------------- Internal & Private methods ---------------

  // ---------------- Public & External methods ---------------

  function getPageIdList(uint _page, uint _count, string memory _rarityFilter, address _owner) external view returns (uint[] memory, uint, uint) {
    address _monsterContract = IMain(mainContract).getContractMonsterNFT();
    address _zombieHelper = IMain(mainContract).getContractZombieNFTHelper();
    uint[] memory _innerList = new uint[](_count);
    uint _innerIndex;
    uint _totalListLength;

    if (bytes(_rarityFilter).length != 0) {
      uint[] memory _rarityList = IMonsterNFT(_monsterContract).getUserMonsterRarity(_owner, _rarityFilter);
      (_innerList, _innerIndex, _totalListLength) = mapByList(_rarityList, _rarityList.length, _page, _count);
    } else {
      _totalListLength = IMonsterNFT(_monsterContract).balanceOf(_owner);
      (uint _startItem, uint _endItem) = IZombieNFTHelper(_zombieHelper).getStartEndIndex(_page, _count, _totalListLength);

      for (uint _i = _endItem; _i <= _startItem; ++_i) {
        if (_totalListLength > _i) {
          _innerList[_innerIndex] = IMonsterNFT(_monsterContract).tokenOfOwnerByIndex(_owner, _i);
          _innerIndex += 1;
        }
      }
    }

    return (_innerList, _innerIndex, _totalListLength);
  }

  // Map user zombies for collection or rarity list
  function mapByList(uint[] memory _source, uint _innerListLength, uint _page, uint _count) private view returns (uint[] memory, uint, uint){
    uint _innerIndex;
    uint[] memory _innerList = new uint[](_count);
    address _zombieHelper = IMain(mainContract).getContractZombieNFTHelper();

    (uint _startItem, uint _endItem) = IZombieNFTHelper(_zombieHelper).getStartEndIndex(_page, _count, _innerListLength);
    for (uint _i = _endItem; _i <= _startItem; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_innerIndex] = _source[_i];
        _innerIndex += 1;
      }
    }

    return (_innerList, _innerIndex, _innerListLength);
  }

}

