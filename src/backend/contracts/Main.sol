// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//interface INftLand is IERC721 {
//    function safeMint(address to, string memory uri) external returns (uint);
//}

contract Main is ReentrancyGuard, Ownable {
  address public contractLandNFT;
  address public contractZombieNFT;
  address public contractTokenFT;

  function updateContractAddress(address _landNFT, address _zombieNFT, address _tokenFT) public onlyOwner {
    contractLandNFT = _landNFT;
    contractZombieNFT = _zombieNFT;
    contractTokenFT = _tokenFT;
  }

  //  function setContractAddresses(address _contractNftLand) public onlyOwner {
  //    contractNftLand = _contractNftLand;
  //  }

  // Mint new Land
  //    function mintLandNft() public returns (uint) {
  //        INftLand nftLand = INftLand(contractNftLand);
  //
  //        return nftLand.safeMint(msg.sender, "test URI");
  //    }

  //    function getLandsById(uint[] memory id_list) internal view returns (Land[] memory) {
  //        Land[] memory result;
  //        for (uint i = 0; i < id_list.length; i++) {
  //            result[i] = lands[id_list[i]];
  //        }
  //        return result;
  //    }

}