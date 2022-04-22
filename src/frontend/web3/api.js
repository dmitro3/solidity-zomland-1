import { ethers } from "ethers";
import LandNFTAddress from "../contractsData/LandNFTContract-address.json";
import LandNFTAbi from "../contractsData/LandNFTContract.json";
import ZombieNFTAddress from "../contractsData/ZombieNFTContract-address.json";
import ZombieNFTAbi from "../contractsData/ZombieNFTContract.json";
import MonsterNFTAddress from "../contractsData/MonsterNFTContract-address.json";
import MonsterNFTAbi from "../contractsData/MonsterNFTContract.json";
import TokenFTAddress from "../contractsData/TokenFTContract-address.json";
import TokenFTAbi from "../contractsData/TokenFTContract.json";
import CollectionAddress from "../contractsData/CollectionContract-address.json";
import CollectionAbi from "../contractsData/CollectionContract.json";
import { setUserAccountId, setUserBalance } from '../store/userSlice';

export const web3Handler = () => {
  return new Promise(async (resolve, reject) => {
    if (isMetamaskInstalled()) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        window.contracts = {};
        window.contracts['land'] = new ethers.Contract(
          LandNFTAddress.address,
          LandNFTAbi.abi,
          signer
        );
        window.contracts['zombie'] = new ethers.Contract(
          ZombieNFTAddress.address,
          ZombieNFTAbi.abi,
          signer
        );
        window.contracts['monster'] = new ethers.Contract(
          MonsterNFTAddress.address,
          MonsterNFTAbi.abi,
          signer
        );
        window.contracts['token'] = new ethers.Contract(
          TokenFTAddress.address,
          TokenFTAbi.abi,
          signer
        );
        window.contracts['collection'] = new ethers.Contract(
          CollectionAddress.address,
          CollectionAbi.abi,
          signer
        );

        resolve({
          account: accounts[0]
        });
      } catch (err) {
        reject("Metamask connection error");
      }
    } else {
      reject("Metamask not installed");
    }
  });
};

export const isMetamaskInstalled = () => {
  return typeof window.ethereum !== "undefined";
};

// export const appendTransactionList = (transactionList, setTransactionList, tx) => {
//   transactionList.push({
//     hash: tx.hash,
//     message: tx.message || null,
//     status: "pending"
//   });
//   setTransactionList([...transactionList]);
//
//   tx.wait().then(receipt => {
//     const index = transactionList.findIndex(oneTx => oneTx.hash === tx.hash);
//     if (index !== -1) {
//       transactionList[index].status = (receipt.status === 1) ? "success" : "error";
//       setTransactionList([...transactionList]);
//
//       setTimeout(() => {
//         const index = transactionList.findIndex(oneTx => oneTx.hash === tx.hash);
//         if (index !== -1) {
//           transactionList.splice(index, 1);
//           setTransactionList([...transactionList]);
//         }
//       }, 2000);
//     }
//   })
// }

// export const appendTransactionError = (transactionList, setTransactionList, message) => {
//   transactionList.push({
//     message,
//     status: "error"
//   });
//   setTransactionList([...transactionList]);
//
//   setTimeout(() => {
//     const index = transactionList.findIndex(oneTx => oneTx.message === message);
//     if (index !== -1) {
//       transactionList.splice(index, 1);
//       setTransactionList([...transactionList]);
//     }
//   }, 5000);
// };

// export const hideTransaction = (transactionList, setTransactionList, index) => {
// transactionList.splice(index, 1);
// setTransactionList([...transactionList]);
// }

export const updateUserBalance = async (accountId) => {
  const balance = await window.contracts['token'].balanceOf(accountId);
  setUserBalance({
    balance: parseInt(balance)
  });
}

export const updateUserAccount = (dispatch, account) => {
  dispatch(setUserAccountId({ account }));
  updateUserBalance(account);
}

