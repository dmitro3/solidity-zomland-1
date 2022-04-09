import {ethers} from "ethers"
import LandNFTAddress from '../contractsData/LandNFT-address.json';
import LandNFTAbi from '../contractsData/LandNFT.json';

export const web3Handler = () => {
  return new Promise(async (resolve, reject) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const landContract = new ethers.Contract(LandNFTAddress.address, LandNFTAbi.abi, signer);
        resolve({account: accounts[0], signer, landContract});
      } catch (err) {
        reject("Metamask connection error");
      }
    } else {
      reject("Metamask not installed");
    }
  });
}

export const login = () => {
  console.log('Call web3Handler');
}

export const logout = () => {
  console.log('Remove logout button');
}

export const loadContracts = async () => {
  let landNFT = new ethers.Contract(LandNFTAddress.address, LandNFTAbi.abi, signer);

  // setNFT(nft)
  const totalCount = await landNFT.totalSupply();
  console.log('totalCount', parseInt(totalCount));

  const userTotalCount = await landNFT.balanceOf(signer.getAddress());
  console.log('userTotalCount', parseInt(userTotalCount));

  const allLandMedia = await landNFT.getAllLandsMedia();
  console.log('allLandMedia', allLandMedia);

  const pageNFT = await landNFT.userLands(0, 12);
  console.log('pageNFT', pageNFT);

  // const firstNFT = await landNFT.userLandByIndex(0);
  // console.log('firstNFT', firstNFT);

  // setLoading(false)
}