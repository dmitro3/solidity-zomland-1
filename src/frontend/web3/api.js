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
import MarketAddress from "../contractsData/MarketContract-address.json";
import MarketAbi from "../contractsData/MarketContract.json";
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

        window.contracts = {
          land: new ethers.Contract(
            LandNFTAddress.address,
            LandNFTAbi.abi,
            signer
          ),
          zombie: new ethers.Contract(
            ZombieNFTAddress.address,
            ZombieNFTAbi.abi,
            signer
          ),
          monster: new ethers.Contract(
            MonsterNFTAddress.address,
            MonsterNFTAbi.abi,
            signer
          ),
          token: new ethers.Contract(
            TokenFTAddress.address,
            TokenFTAbi.abi,
            signer
          ),
          collection: new ethers.Contract(
            CollectionAddress.address,
            CollectionAbi.abi,
            signer
          ),
          market: new ethers.Contract(
            MarketAddress.address,
            MarketAbi.abi,
            signer
          )
        };

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

// export const FIREBASE_CONFIG = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID
// };


export const isMetamaskInstalled = () => {
  return typeof window.ethereum !== "undefined";
};

export const updateUserBalance = async (dispatch, accountId) => {
  const balance = await window.contracts.token.balanceOf(accountId);
  dispatch(setUserBalance({
    balance: parseInt(balance)
  }));
}

export const updateUserAccount = async (dispatch, account) => {
  dispatch(setUserAccountId({ account }));
  await updateUserBalance(dispatch, account);
}

