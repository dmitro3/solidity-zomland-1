// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../interfaces/interface.sol";
import "../abstract/utils.sol";
import "../abstract/modifiers.sol";

contract CollectionContract is Initializable, OwnableUpgradeable, UUPSUpgradeable, Modifiers {
  string private collectionIpfsHash;
  uint public collectionCount;
  mapping(uint => Collection) public collections;

  struct Collection {
    string title;
    string image;
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContract, string memory _collectionHash) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();

    mainContract = _mainContract;
    collectionIpfsHash = _collectionHash;
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

  // ---------------- Internal & Private methods ---------------

  function randomNumber(uint _max, uint _shift) internal view returns (uint) {
    return uint(keccak256(abi.encodePacked(_shift, block.difficulty, block.timestamp, uint(1)))) % _max;
  }

  // ---------------- External Limited methods ---------------

  function addCollection(string memory _title, string memory _image) public onlyOwner {
    collections[collectionCount] = Collection(_title, _image);
    collectionCount += 1;
  }

  // ---------------- Public & External methods ---------------

  function getCollectionAndZombie(uint8 _shift) external view returns (uint, string memory){
    uint _collectionIndex = randomNumber(collectionCount, _shift);

    Collection storage _collection = collections[_collectionIndex];
    uint _num = randomNumber(999, _shift + 10) + 1;
    string memory _image = string.concat(_collection.image, "/", StringsUpgradeable.toString(_num), ".png");
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
