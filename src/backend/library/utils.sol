// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

abstract contract Utils {
  function indexOf(uint[] memory self, uint value) public pure returns (uint, bool) {
    uint length = self.length;
    for (uint i = 0; i < length; i++) if (self[i] == value) return (i, true);
    return (0, false);
  }
}