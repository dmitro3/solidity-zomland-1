// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

contract ZombieNFTHelperContract is Initializable, OwnableUpgradeable, UUPSUpgradeable, Utils, Modifiers {

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

  function getRarityTokenPrice(string memory _rarityStr) external pure returns (uint){
    if (string_equal(_rarityStr, "Common")) {
      return 5 * 1e18;
    } else if (string_equal(_rarityStr, "UnCommon")) {
      return 10 * 1e18;
    } else if (string_equal(_rarityStr, "Rare")) {
      return 20 * 1e18;
    }
    return 40 * 1e18;
  }

  function zombieKillTokens(CardRarity _rarity, uint8 _health, uint8 _attack, uint8 _brain, uint8 _speed) internal pure returns (uint) {
    uint _multiplier = 1;
    if (_rarity == CardRarity.Epic) {
      _multiplier = 21;
    } else if (_rarity == CardRarity.Rare) {
      _multiplier = 9;
    } else if (_rarity == CardRarity.UnCommon) {
      _multiplier = 3;
    }
    return _multiplier * (uint((_health + _attack + _brain + _speed * 10)) / 7) * 1e18;
  }

  function generateMetadata(uint8 _index) external view returns (string memory, uint8, uint8, uint8, uint8, uint, uint, string memory){
    ZombieResultMetadata memory _metadata = ZombieResultMetadata("", 0, 0, 0, 0, 0, 0, "");

    CardRarity _rarity = randomRarity(_index);
    _metadata.health = randomNumberByRarity(49, _index + 15, _rarity);
    _metadata.attack = randomNumberByRarity(24, _index + 20, _rarity);
    _metadata.brain = randomNumberByRarity(24, _index + 25, _rarity);
    _metadata.speed = randomNumberByRarity(1, _index + 30, _rarity);
    _metadata.killTokens = zombieKillTokens(_rarity, _metadata.health, _metadata.attack, _metadata.brain, _metadata.speed);

    address _collectionContract = IMain(mainContract).getContractCollection();
    (_metadata.collectionId, _metadata.uri) = ICollection(_collectionContract).getCollectionAndZombie(_index + 8);

    return (rarityToString(_rarity), _metadata.health, _metadata.attack, _metadata.brain, _metadata.speed, _metadata.killTokens, _metadata.collectionId, _metadata.uri);
  }

  function randomRarity(uint8 _num) internal view returns (CardRarity) {
    uint _index = randomNumber(1000, _num);
    if (_index <= 10) {
      return CardRarity.Epic;
    } else if (_index <= 60) {
      return CardRarity.Rare;
    } else if (_index <= 300) {
      return CardRarity.UnCommon;
    }
    return CardRarity.Common;
  }

  function randomNumberByRarity(uint _max, uint8 _shift, CardRarity _rarity) internal view returns (uint8) {
    uint _from = 0;
    uint _to = _max;

    if (_rarity == CardRarity.Common) {
      _to = _max / 4;
    } else if (_rarity == CardRarity.UnCommon) {
      _from = _max / 5;
      _to = _max / 2;
    } else if (_rarity == CardRarity.Rare) {
      _from = _max * 2 / 5;
      _to = _max * 3 / 4;
    } else {
      _from = _max * 13 / 20;
    }

    uint _rand_range = _to - _from;
    if (_rand_range > 0) {
      uint _rand_divider = 1000 / (_rand_range + 1);
      uint _result = randomNumber(1000, _shift) / _rand_divider;
      return uint8(_from + _result + 1);
    }
    return uint8(1);
  }

  // Get user zombies (pagination + filters)
  function getPageIdList(uint _page, uint _count, uint _collectionFilter, string memory _rarityFilter, address _owner) external view returns (uint[] memory, uint, uint) {
    address _zombieContract = IMain(mainContract).getContractZombieNFT();
    uint[] memory _innerList = new uint[](_count);
    uint _innerIndex;
    uint _totalListLength;

    if (_collectionFilter != 0 && bytes(_rarityFilter).length != 0) {
      (_innerList, _innerIndex, _totalListLength) = filterCollectionRarity(_collectionFilter, _rarityFilter, _page, _count, _owner);
    } else if (_collectionFilter != 0) {
      uint[] memory _collectionList = IZombieNFT(_zombieContract).getUserZombieCollection(_owner, _collectionFilter);
      (_innerList, _innerIndex, _totalListLength) = mapByList(_collectionList, _collectionList.length, _page, _count);
    } else if (bytes(_rarityFilter).length != 0) {
      uint[] memory _rarityList = IZombieNFT(_zombieContract).getUserZombieRarity(_owner, _rarityFilter);
      (_innerList, _innerIndex, _totalListLength) = mapByList(_rarityList, _rarityList.length, _page, _count);
    } else {
      _totalListLength = IZombieNFT(_zombieContract).balanceOf(_owner);
      (uint _startItem, uint _endItem) = getStartEndIndex(_page, _count, _totalListLength);
      for (uint _i = _endItem; _i <= _startItem; ++_i) {
        if (_totalListLength > _i) {
          _innerList[_innerIndex] = IZombieNFT(_zombieContract).tokenOfOwnerByIndex(_owner, _i);
          _innerIndex += 1;
        }
      }
    }

    return (_innerList, _innerIndex, _totalListLength);
  }

  // Reverse pages indexes
  function getStartEndIndex(uint _page, uint _count, uint _totalListLength) public pure returns (uint, uint){
    uint _startItem;
    uint _endItem;
    uint _lastIndex = (_page - 1) * _count;
    if (_totalListLength > 0) {
      _startItem = (_totalListLength - 1) - _lastIndex;
      if (_startItem >= _count) {
        _endItem = _startItem - _count + 1;
      }
    }
    return (_startItem, _endItem);
  }

  // Map user zombies for collection or rarity list
  function mapByList(uint[] memory _source, uint _innerListLength, uint _page, uint _count) private pure returns (uint[] memory, uint, uint){
    uint _innerIndex;
    uint[] memory _innerList = new uint[](_count);

    (uint _startItem, uint _endItem) = getStartEndIndex(_page, _count, _innerListLength);
    for (uint _i = _endItem; _i <= _startItem; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_innerIndex] = _source[_i];
        _innerIndex += 1;
      }
    }

    return (_innerList, _innerIndex, _innerListLength);
  }

  // Filter user zombies by collection and rarity
  function filterCollectionRarity(uint _collectionFilter, string memory _rarityFilter, uint _page, uint _count, address _owner) private view returns (uint[] memory, uint, uint){
    address _zombieContract = IMain(mainContract).getContractZombieNFT();
    uint[] memory collectionList = IZombieNFT(_zombieContract).getUserZombieCollection(_owner, _collectionFilter);
    uint[] memory rarityList = IZombieNFT(_zombieContract).getUserZombieRarity(_owner, _rarityFilter);

    uint _innerIndex = 0;
    uint _collectionLength = collectionList.length;
    uint[] memory _collectionRarityList = new uint[](_collectionLength);
    for (uint _i = 0; _i < _collectionLength; ++_i) {
      if (Utils.has(rarityList, collectionList[_i])) {
        _collectionRarityList[_innerIndex] = collectionList[_i];
        _innerIndex += 1;
      }
    }

    return mapByList(_collectionRarityList, _innerIndex, _page, _count);
  }

}
