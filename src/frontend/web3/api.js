import { ethers } from "ethers";
import LandNFTAddress from "../contractsData/LandNFT-address.json";
import LandNFTAbi from "../contractsData/LandNFT.json";
import ZombieNFTAddress from "../contractsData/ZombieNFT-address.json";
import ZombieNFTAbi from "../contractsData/ZombieNFT.json";

export const web3Handler = () => {
  return new Promise(async (resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const landContract = new ethers.Contract(
          LandNFTAddress.address,
          LandNFTAbi.abi,
          signer
        );
        const zombieContract = new ethers.Contract(
          ZombieNFTAddress.address,
          ZombieNFTAbi.abi,
          signer
        );

        resolve({ account: accounts[0], signer, landContract, zombieContract });
      } catch (err) {
        reject("Metamask connection error");
      }
    } else {
      reject("Metamask not installed");
    }
  });
};
