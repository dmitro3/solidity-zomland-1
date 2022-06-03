// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/interface.sol";

contract CollectionContract is Ownable {
  address internal mainContract;
  string public collectionIpfsHash;
  mapping(uint => Collection) public collections;
  uint public collectionCount;

  struct Collection {
    string title;
    string image;
  }

  constructor(address _mainContract) {
    mainContract = _mainContract;
    collectionIpfsHash = "bafybeigm2p2cm3pqrlel326s6kjfh4x22ne5sfrlvpgouq7tltatulbqru";
  }

  function addCollection(string memory _title, string memory _image) public onlyOwner {
    collections[collectionCount] = Collection(_title, _image);
    collectionCount += 1;
  }

  function randomNumber(uint _max, uint _shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(_shift, block.difficulty, block.timestamp, uint(1)))) % _max;
  }

  function getCollectionAndZombie(uint8 _shift) external view returns (uint, string memory){
    uint _collectionIndex = randomNumber(collectionCount, _shift);

    Collection storage _collection = collections[_collectionIndex];
    uint _index = randomNumber(1000, _shift + 10);
    string memory _image = string.concat(_collection.image, "/", Strings.toString(_index), ".png");
    return (_collectionIndex, _image);
  }

  function getAllCollections() external view returns (string memory, Collection[] memory) {
    Collection[] memory _resultCollections = new Collection[](collectionCount);
    for (uint _i = 0; _i < collectionCount; ++_i) {
      _resultCollections[_i] = collections[_i];
    }
    return (collectionIpfsHash, _resultCollections);
  }

  function getAllCollectionsCount() external view returns (uint){
    return collectionCount;
  }

  function getCollectionImage(uint collectionId) external view returns (string memory){
    return string.concat(collectionIpfsHash, "/", collections[collectionId].title, "-1.png");
  }

}
