// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Main.sol";

contract CollectionContract is MainContract {
  mapping(uint => Collection) public collections;
  uint public collectionCount;

  struct Collection {
    string title;
    string image;
    string[] zombieImages;
  }

  function addCollection(string memory title, string memory image, string[] memory zombieImages) public onlyOwner {
    collections[collectionCount] = Collection(title, image, zombieImages);
    collectionCount += 1;
  }

  function randomNumber(uint max, uint shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(shift, block.difficulty, block.timestamp, uint(1)))) % max;
  }

  function getCollectionAndZombie() external view returns (uint, string memory){
    uint _collectionIndex = randomNumber(collectionCount, 0);

    Collection storage _collection = collections[_collectionIndex];
    uint _index = randomNumber(_collection.zombieImages.length, 1);
    return (_collectionIndex, _collection.zombieImages[_index]);
  }

  function getAllCollections() public view returns (Collection[] memory) {
    Collection[] memory _resultCollections = new Collection[](collectionCount);
    for (uint _i = 0; _i < collectionCount; ++_i) {
      _resultCollections[_i] = collections[_i];
    }
    return _resultCollections;
  }

}