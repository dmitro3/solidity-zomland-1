// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

  error MarketError(string message);

contract MarketContract is Utils, Modifiers {
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

  function getLandsFromMarket(uint _startIndex, uint8 _count, string memory filterLandType) external view returns (uint, uint[] memory){
    uint[] memory source = new uint[](lands.length);
    uint[] memory _innerList = new uint[](_count);

    uint _innerListLength;
    if (bytes(filterLandType).length == 0) {
      source = lands;
      _innerListLength = lands.length;
    } else {
      address _landContract = IMain(mainContract).getContractLandNFT();
      uint landsCount = lands.length;

      uint _index = 0;
      for (uint _i = 0; _i < landsCount; ++_i) {
        string memory landType = ILandNFT(_landContract).landInfoType(lands[_i]);
        if (string_equal(landType, filterLandType)) {
          source[_index] = lands[_i];
          _index += 1;
        }
      }
      _innerListLength = _index;
    }

    uint _index = 0;
    uint _endIndex = _startIndex + _count;
    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_index] = source[_i];
        _index += 1;
      }
    }

    return (_innerListLength, _innerList);
  }

  function filterZombieMonster(uint[] storage source, string memory nftType, string memory _filterRarity, uint _filterCollection) internal view returns (uint, uint[] memory) {
    uint _index = 0;
    uint _itemsCount = source.length;
    uint[] memory _itemsSource = new uint[](_itemsCount);
    address _sourceContract = string_equal(nftType, "zombies") ? IMain(mainContract).getContractZombieNFT() : IMain(mainContract).getContractMonsterNFT();

    for (uint _i = 0; _i < _itemsCount; ++_i) {
      bool canAdd = false;
      (string memory rarity, uint collection) = string_equal(nftType, "zombies") ? IZombieNFT(_sourceContract).getRarityCollection(source[_i]) : IMonsterNFT(_sourceContract).getRarityCollection(source[_i]);
      if (bytes(_filterRarity).length != 0 && _filterCollection != 0) {
        if (string_equal(rarity, _filterRarity) && collection == _filterCollection) {
          canAdd = true;
        }
      } else if (bytes(_filterRarity).length != 0) {
        if (string_equal(rarity, _filterRarity)) {
          canAdd = true;
        }
      } else if (_filterCollection != 0) {
        if (collection == _filterCollection) {
          canAdd = true;
        }
      }

      if (canAdd) {
        _itemsSource[_index] = source[_i];
        _index += 1;
      }
    }

    return (_index, _itemsSource);
  }

  function getZombiesMonstersFromMarket(uint _startIndex, uint8 _count, string memory nftType, string memory _filterRarity, uint _filterCollection) external view returns (uint, uint[] memory){
    uint[] storage source = string_equal(nftType, "zombies") ? zombies : monsters;
    uint[] memory _innerList = new uint[](_count);

    uint _innerListLength;
    uint[] memory _itemsSource = new uint[](source.length);
    if (bytes(_filterRarity).length != 0 || _filterCollection != 0) {
      (_innerListLength, _itemsSource) = filterZombieMonster(source, nftType, _filterRarity, _filterCollection);
    } else {
      _itemsSource = source;
      _innerListLength = source.length;
    }

    uint _index = 0;
    uint _endIndex = _startIndex + _count;
    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
      if (_innerListLength > _i) {
        _innerList[_index] = _itemsSource[_i];
        _index += 1;
      }
    }

    return (_innerListLength, _innerList);
  }


  //  function getFromMarket(
  //    uint _startIndex, uint8 _count, string memory typeNFT, string memory rarity, string memory collection
  //  ) external view returns (uint, uint[] memory) {
  //    //    uint _innerListLength;
  //    //    if (string_equal(typeNFT, "land")) {
  //    //      _innerListLength = lands.length;
  //    //    } else if (string_equal(typeNFT, "zombie")) {
  //    //      _innerListLength = zombies.length;
  //    //    } else if (string_equal(typeNFT, "monster")) {
  //    //      _innerListLength = monsters.length;
  //    //    } else {
  //    //      revert MarketError({message : "Wrong typeNFT param"});
  //    //    }
  //
  //    uint _innerIndex = 0;
  //    uint[] memory _innerList = new uint[](_count);
  //    uint _endIndex = _startIndex + _count;
  //
  //    for (uint _i = _startIndex; _i < _endIndex; ++_i) {
  //      if (_innerListLength > _i) {
  //        if (string_equal(typeNFT, "land")) {
  //          _innerList[_innerIndex] = lands[_i];
  //        } else if (string_equal(typeNFT, "zombie")) {
  //          _innerList[_innerIndex] = zombies[_i];
  //        } else if (string_equal(typeNFT, "monster")) {
  //          _innerList[_innerIndex] = monsters[_i];
  //        }
  //        _innerIndex += 1;
  //      }
  //    }
  //
  //    return (_innerListLength, _innerList);
  //  }

  function buyNFT(uint tokenId, string memory typeNFT) public {

  }

}
