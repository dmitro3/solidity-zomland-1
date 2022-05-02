// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";

  error MarketError(string message);

contract MarketContract is Utils {
  address internal mainContract;
  mapping(uint => uint) lands; // id => price
  mapping(uint => uint) zombies; // id => price
  mapping(uint => uint) market; // id => price

  constructor(address _mainContract) {
    mainContract = _mainContract;
  }

  function publishOnMarket(uint[] calldata idList, uint[] calldata priceList, string calldata typeNFT) public {
    for (uint i = 0; i < idList.length; i++) {
      if (typeNFT == "land") {
        lands[idList[i]] = priceList[i];
      } else if (typeNFT == "zombie") {
        zombies[idList[i]] = priceList[i];
      } else if (typeNFT == "monster") {
        market[idList[i]] = priceList[i];
      } else {
        revert MarketError({message : "Wrong typeNFT param"});
      }
    }
  }

  function removeFromMarket(uint[] calldata idList, uint[] calldata priceList, string calldata typeNFT) public {

  }

  function getFromMarket(uint _startIndex, uint8 _count, string calldata typeNFT) public {

  }

  function byeNFT(uint tokenId, string calldata typeNFT) public {

  }

}