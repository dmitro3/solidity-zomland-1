// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

abstract contract Utils {
  address public constant NULL_ADDRESS = 0x0000000000000000000000000000000000000000;

  enum CardRarity {
    Common,
    Uncommon,
    Rare,
    Epic
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

  function indexOf(uint[] memory self, uint value) public pure returns (uint, bool) {
    uint length = self.length;
    for (uint i = 0; i < length; i++) if (self[i] == value) return (i, true);
    return (0, false);
  }

}