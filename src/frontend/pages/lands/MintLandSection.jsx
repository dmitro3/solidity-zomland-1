import React from "react";
import { addTransactionError } from "../../web3/utils";
import { Row } from "../../assets/styles/common.style";
import { Button } from "../../components/basic/Button";
import { ethers } from 'ethers';
import { useDispatch } from "react-redux";
import { CardLand } from '../../components/card-land/CardLand';

export const MintLandSection = ({
  allLands,
  watchMintTransaction,
  isMicroLand
}) => {
  const dispatch = useDispatch();

  const MintCard = ({ type, handleMint }) => (
    <div className="sm:flex sm:flex-col">
      <CardLand noFlip nft={allLands[type]} />
      <div className="mt-4">
        <Button title={`Mint ${type} Land`} onClick={handleMint} />
        <div className="mt-3 font-semibold">
          {allLands[type].price}{" "}
          {process.env.TOKEN_SYMBOL}
        </div>
      </div>
    </div>
  );

  const handleMint = async (depositAmount) => {
    window.contracts.land.safeMint({
      value: ethers.utils.parseEther(depositAmount)
    }).then(transaction => {
      transaction.message = "Minting Land NFT";
      watchMintTransaction(transaction);
    }).catch(err => {
      addTransactionError(dispatch, err.message);
    });
  };

  return (
    <Row className="justify-center gap-8 flex-wrap">
      {
        Object.keys(allLands).map(landType => {
          if (landType !== 'Micro' || !isMicroLand()) {
            return (
              <MintCard key={landType}
                        type={landType}
                        handleMint={() => handleMint(allLands[landType].price)}
              />
            )
          }
        })
      }
    </Row>
  );
};
