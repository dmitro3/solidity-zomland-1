// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

abstract contract Utils {
  address public constant NULL_ADDRESS = 0x0000000000000000000000000000000000000000;

  enum CardRarity {
    Common,
    Uncommon,
    Rare,
    Epic
  }

  enum ModifierItems {
    WeaponV1,
    WeaponV2,
    ArmorV1,
    ArmorV2
  }

  struct MonsterResultMetadata {
    uint health;
    uint attack;
    uint brain;
    uint killTokens;
    uint collectionId;
  }

  function rarityToString(CardRarity _rarity) internal pure returns (string memory) {
    if (_rarity == CardRarity.Common) {
      return "Common";
    } else if (_rarity == CardRarity.Uncommon) {
      return "Uncommon";
    } else if (_rarity == CardRarity.Rare) {
      return "Rare";
    }
    return "Epic";
  }

  function rarityFromString(string memory _rarity) internal pure returns (CardRarity) {
    bytes32 _rarityHash = keccak256(abi.encodePacked(_rarity));
    if (_rarityHash == keccak256(abi.encodePacked("Common"))) {
      return CardRarity.Common;
    } else if (_rarityHash == keccak256(abi.encodePacked("Uncommon"))) {
      return CardRarity.Uncommon;
    } else if (_rarityHash == keccak256(abi.encodePacked("Rare"))) {
      return CardRarity.Rare;
    } else {
      return CardRarity.Epic;
    }
  }

  function randomNumber(uint _max, uint8 _shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(_shift, msg.sender, block.difficulty, block.timestamp, uint(1)))) % _max;
  }

  function has(uint[] memory self, uint value) public pure returns (bool) {
    uint length = self.length;
    for (uint i = 0; i < length; ++i) if (self[i] == value) return true;
    return false;
  }

  function indexOf(uint[] memory self, uint value) public pure returns (uint, bool) {
    uint length = self.length;
    for (uint i = 0; i < length; ++i) if (self[i] == value) return (i, true);
    return (0, false);
  }

  function string_compare(string memory _a, string memory _b) internal pure returns (int) {
    bytes memory a = bytes(_a);
    bytes memory b = bytes(_b);
    uint minLength = a.length;
    if (b.length < minLength) minLength = b.length;
    for (uint i = 0; i < minLength; ++i)
      if (a[i] < b[i])
        return - 1;
      else if (a[i] > b[i])
        return 1;
    if (a.length < b.length)
      return - 1;
    else if (a.length > b.length)
      return 1;
    else
      return 0;
  }

  function string_equal(string memory _a, string memory _b) internal pure returns (bool) {
    return string_compare(_a, _b) == 0;
  }


}
