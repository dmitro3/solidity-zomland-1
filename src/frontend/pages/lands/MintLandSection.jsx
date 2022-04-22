import React from "react";
import { convertFromYocto, convertToYocto } from "../../web3/utils";
import { Row } from "../../assets/styles/common.style";
import { Button } from "../../components/basic/Button";
import { Card } from "../../components/card/Card";
import { ethers } from 'ethers';
import { useDispatch, useSelector } from "react-redux";
import { addTransactionError } from '../../store/transactionSlice';

export const MintLandSection = ({
  userLands,
  allLands,
  watchMintTransaction,
}) => {
  const dispatch = useDispatch();
  const contracts = useSelector(state => state.contracts.contracts);

  const MintCard = ({ type, handleMint }) => (
    <div className="sm:flex sm:flex-col">
      <Card noFlip nft={allLands[type]}/>
      <div className="mt-4">
        <Button title={`Mint ${type} Land`} onClick={handleMint}/>
        <div className="mt-3 font-semibold">
          {convertFromYocto(allLands[type].price, 0)}{" "}
          {process.env.TOKEN_SYMBOL}
        </div>
      </div>
    </div>
  );

  const isSmallLand = () => {
    let result = false;
    userLands.map((land) => {
      if (land.landType === "Small") {
        result = true;
      }
    });
    return result;
  };

  const handleMint = async (depositAmount) => {
    contracts.landContract.safeMint({
      value: ethers.utils.parseEther(depositAmount)
    }).then(transaction => {
      transaction.message = "Minting Land NFT";
      watchMintTransaction(transaction);
    }).catch(err => {
      dispatch(addTransactionError({
        id: new Date().toISOString(),
        message: err.message
      }))
      console.log(`ERR:`, err.message);
    });
  };

  return (
    <Row className="justify-center gap-8 flex-wrap">
      {allLands && (
        <>
          {!isSmallLand() && (
            <MintCard type="Small" handleMint={() => handleMint("0")}/>
          )}
          <MintCard type="Medium" handleMint={() => handleMint("5")}/>
          <MintCard type="Large" handleMint={() => handleMint("9")}/>
        </>
      )}
    </Row>
  );
};
