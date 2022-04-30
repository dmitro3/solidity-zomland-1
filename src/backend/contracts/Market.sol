// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";

contract MarketContract is Utils {
  address internal mainContract;
  mapping(uint => uint) lands; // id => price
  mapping(uint => uint) zombies; // id => price
  mapping(uint => uint) market; // id => price

  constructor(address _mainContract) {
    mainContract = _mainContract;
  }

  function publishOnMarket(uint[] calldata idList, uint[] calldata priceList, string calldata typeNFT) public {

  }

  function removeFromMarket(uint[] calldata idList, uint[] calldata priceList, string calldata typeNFT) public {

  }

  function getFromMarket(uint _startIndex, uint8 _count, string calldata typeNFT) public {

  }

  function byeNFT(uint tokenId, string calldata typeNFT) public {

  }

}