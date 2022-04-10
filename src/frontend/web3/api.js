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

export const appendTransactionList = (transactionList, setTransactionList, tx) => {
  transactionList.push({
    hash: tx.hash,
    message: tx.message || null,
    status: "pending"
  });
  setTransactionList([...transactionList]);

  tx.wait().then(receipt => {
    const index = transactionList.findIndex(oneTx => oneTx.hash === tx.hash);
    if (index !== -1) {
      transactionList[index].status = (receipt.status === 1) ? "success" : "error";
      setTransactionList([...transactionList]);

      setTimeout(() => {
        transactionList.splice(index, 1);
        setTransactionList([...transactionList]);
      }, 5000);
    }
  })
}

export const appendTransactionError = (transactionList, setTransactionList, message) => {
  transactionList.push({
    message,
    status: "error"
  });
  setTransactionList([...transactionList]);
};

export const hideTransaction = (transactionList, setTransactionList, index) => {
  transactionList.splice(index, 1);
  setTransactionList([...transactionList]);
}