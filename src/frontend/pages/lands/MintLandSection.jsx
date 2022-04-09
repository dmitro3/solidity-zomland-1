import React from "react";
import {convertFromYocto, convertToYocto, defaultGas} from "../../near/utils";
import {Row} from "../../assets/styles/common.style";
import {Button} from "../../components/basic/Button";
import {Card} from "../../components/card/Card";

export const MintLandSection = ({
  currentUser,
  landContract,
  userLands,
  allLands,
}) => {
  const MintCard = ({type, handleMint}) => (
      <div className="sm:flex sm:flex-col">
        <Card noFlip nft={allLands[type]}/>
        <div className="mt-4">
          <Button title={`Mint ${type} Land`} onClick={handleMint}/>
          <div className="mt-3 font-semibold">
            {convertFromYocto(allLands[type].price, 0)}{" "}
            NEAR
          </div>
        </div>
      </div>
  );

  const isSmallLand = () => {
    let result = false;
    userLands.map((land) => {
      if (land.land_type === "Small") {
        result = true;
      }
    });
    return result;
  };

  const handleMint = async (depositAmount) => {
    console.log(landContract);
    // const deposit = convertToYocto(depositAmount);
    // await contract.mint_land_nft(
    //   {
    //     account_id: currentUser.accountId,
    //   },
    //   defaultGas,
    //   deposit
    // );
  };

  return (
      <Row className="justify-center gap-8 flex-wrap">
        {allLands && (
            <>
              {!isSmallLand() && (
                  <MintCard type="Small" handleMint={() => handleMint(0)}/>
              )}
              <MintCard type="Medium" handleMint={() => handleMint(5)}/>
              <MintCard type="Large" handleMint={() => handleMint(9)}/>
            </>
        )}
      </Row>
  );
};
