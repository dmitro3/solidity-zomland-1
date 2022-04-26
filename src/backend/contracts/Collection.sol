// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/interface.sol";

contract CollectionContract is Ownable {
  address internal mainContract;
  mapping(uint => Collection) public collections;
  uint public collectionCount;

  struct Collection {
    string title;
    string image;
    string[] zombieImages;
  }

  constructor(address _mainContract) {
    mainContract = _mainContract;
  }

  function addCollection(string memory _title, string memory _image, string[] memory _zombieImages) public onlyOwner {
    collections[collectionCount] = Collection(_title, _image, _zombieImages);
    collectionCount += 1;
  }

  function randomNumber(uint _max, uint _shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(_shift, block.difficulty, block.timestamp, uint(1)))) % _max;
  }

  function getCollectionAndZombie(uint8 _shift) external view returns (uint, string memory){
    uint _collectionIndex = randomNumber(collectionCount, _shift);

    Collection storage _collection = collections[_collectionIndex];
    uint _index = randomNumber(_collection.zombieImages.length, _shift + 10);
    return (_collectionIndex, _collection.zombieImages[_index]);
  }

  function getAllCollections() external view returns (Collection[] memory) {
    Collection[] memory _resultCollections = new Collection[](collectionCount);
    for (uint _i = 0; _i < collectionCount; ++_i) {
      _resultCollections[_i] = collections[_i];
    }
    return _resultCollections;
  }

  function getAllCollectionsCount() external view returns (uint){
    return collectionCount;
  }

  function getCollectionImage(uint collectionId) external view returns (string memory){
    return collections[collectionId].image;
  }

}