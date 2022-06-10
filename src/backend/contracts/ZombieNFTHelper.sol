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
      return 50 * 1e18;
    } else if (string_equal(_rarityStr, "Uncommon")) {
      return 100 * 1e18;
    } else if (string_equal(_rarityStr, "Rare")) {
      return 200 * 1e18;
    }
    return 400 * 1e18;
  }

  function zombieKillTokens(CardRarity _rarity, uint8 _health, uint8 _attack, uint8 _brain, uint8 _speed) internal pure returns (uint) {
    uint _multiplier = 1;
    if (_rarity == CardRarity.Epic) {
      _multiplier = 21;
    } else if (_rarity == CardRarity.Rare) {
      _multiplier = 9;
    } else if (_rarity == CardRarity.Uncommon) {
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
      return CardRarity.Uncommon;
    }
    return CardRarity.Common;
  }

  function randomNumberByRarity(uint _max, uint8 _shift, CardRarity _rarity) internal view returns (uint8) {
    uint _from = 0;
    uint _to = _max;

    if (_rarity == CardRarity.Common) {
      _to = _max / 4;
    } else if (_rarity == CardRarity.Uncommon) {
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

}
