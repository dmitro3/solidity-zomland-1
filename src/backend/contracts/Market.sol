// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

  error MarketError(string message);

contract MarketContract is Utils {
  address internal mainContract;
  uint[] lands;
  uint[] zombies;
  uint[] monsters;

  constructor(address _mainContract) {
    mainContract = _mainContract;
  }

  // ---------------- Public & External methods ---------------

  function publishOnMarket(uint[] calldata idList, uint[] calldata priceList, string memory typeNFT) public {
    if (string_equal(typeNFT, "land")) {
      address _landContract = IMain(mainContract).getContractLandNFT();
      for (uint _i = 0; _i < idList.length; _i++) {
        (uint _index, bool _exist) = Utils.indexOf(lands, idList[_i]);
        if (!_exist) {
          ILandNFT(_landContract).setMarketSalePrice(idList[_i], priceList[_i], msg.sender);
          lands.push(idList[_i]);
        }
      }
    } else if (string_equal(typeNFT, "zombie")) {
      address _zombieContract = IMain(mainContract).getContractZombieNFT();
      for (uint _i = 0; _i < idList.length; _i++) {
        IZombieNFT(_zombieContract).setMarketSalePrice(idList[_i], priceList[_i], msg.sender);
        zombies.push(idList[_i]);
      }
    } else if (string_equal(typeNFT, "monster")) {
      address _monsterContract = IMain(mainContract).getContractMonsterNFT();
      for (uint _i = 0; _i < idList.length; _i++) {
        IMonsterNFT(_monsterContract).setMarketSalePrice(idList[_i], priceList[_i], msg.sender);
        monsters.push(idList[_i]);
      }
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

  }

  function removeFromMarket(uint tokenId, string memory typeNFT) public {
    if (string_equal(typeNFT, "land")) {
      (uint _index, bool _exist) = Utils.indexOf(lands, tokenId);
      if (_exist) {
        address _landContract = IMain(mainContract).getContractLandNFT();
        ILandNFT(_landContract).setMarketSalePrice(tokenId, 0, msg.sender);
        lands[_index] = lands[lands.length - 1];
        lands.pop();
      }
    } else if (string_equal(typeNFT, "zombie")) {
      (uint _index, bool _exist) = Utils.indexOf(zombies, tokenId);
      if (_exist) {
        address _zombieContract = IMain(mainContract).getContractZombieNFT();
        IZombieNFT(_zombieContract).setMarketSalePrice(tokenId, 0, msg.sender);
        zombies[_index] = zombies[zombies.length - 1];
        zombies.pop();
      }
    } else if (string_equal(typeNFT, "monster")) {
      (uint _index, bool _exist) = Utils.indexOf(monsters, tokenId);
      if (_exist) {
        address _monsterContract = IMain(mainContract).getContractMonsterNFT();
        IMonsterNFT(_monsterContract).setMarketSalePrice(tokenId, 0, msg.sender);
        monsters[_index] = monsters[monsters.length - 1];
        monsters.pop();
      }
    }
  }

  function getFromMarket(uint _startIndex, uint8 _count, string memory typeNFT) external view returns (uint, uint[] memory) {
    uint _innerListLength;
    bool isLand = string_equal(typeNFT, "land");
    bool isZombie = string_equal(typeNFT, "zombie");
    bool isMonster = string_equal(typeNFT, "monster");

    if (isLand) {
      _innerListLength = lands.length;
    } else if (isZombie) {
      _innerListLength = zombies.length;
    } else if (isMonster) {
      _innerListLength = monsters.length;
    } else {
      revert MarketError({message : "Wrong typeNFT param"});
    }

    uint _innerIndex = 0;
    uint[] memory _innerList = new uint[](_count);
    uint _endIndex = _startIndex + _count;

    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
      if (_innerListLength > _i) {
        if (isLand) {
          _innerList[_innerIndex] = lands[_i];
        } else if (isZombie) {
          _innerList[_innerIndex] = zombies[_i];
        } else if (isMonster) {
          _innerList[_innerIndex] = monsters[_i];
        }
        _innerIndex += 1;
      }
    }

    return (_innerListLength, _innerList);
  }

  function buyNFT(uint tokenId, string memory typeNFT) public {

  }

}
