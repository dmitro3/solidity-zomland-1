// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./MainLand.sol";

//interface INftLand is IERC721 {
//    function safeMint(address to, string memory uri) external returns (uint);
//}

contract Main is ReentrancyGuard, MainLand, Ownable {
    address public contractFt;
    address public contractNftZombie;
    address public contractNftLand;
//    mapping(uint => Land) public lands;

    //    function updateAddresses(address _contractFt, address _contractNftZombie, address _contractNftLand) public onlyOwner {
    //        contractFt = _contractFt;
    //        contractNftZombie = _contractNftZombie;
    //        contractNftLand = _contractNftLand;
    //    }

    function setContractAddresses(address _contractNftLand) public onlyOwner {
        contractNftLand = _contractNftLand;
    }

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