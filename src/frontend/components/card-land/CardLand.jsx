import React from "react";
import {
  FlipCard,
  CardInner,
  Rarity,
  InfoSmallWrapper,
  CardFront,
} from "../../assets/styles/card";
import { CardLandDropdown } from "./CardLandDropdown";
import { Price } from "../Price";
import { formatLandId, getMedia } from '../../web3/utils';
import { Counter } from '../Counter';

export const CardLand = ({
  nft,
  noMenu,
  size,
  setSellPopupVisible,
  setTransferPopupVisible,
  rmFromMarket,
  handleBuy,
}) => {
  const showDropdown = nft.landType !== "Micro" && !noMenu && nft.tokenId;

  const classMapping = {
    xsm: "x-small",
    sm: "small",
    md: "",
  };

  return (
    <>
      <FlipCard className={`${classMapping[size || "md"]}`}>
        <CardInner>
          <CardFront type={nft.landType}>
            <img
              className={`absolute max-w-full ${
                size !== "sm" ? "h-80" : "h-[11.9rem] rounded-lg"
              }`}
              src={getMedia(nft.media)}
              alt={nft.tokenId ? nft.tokenId : ""}
            />

            <div className="absolute flex w-full">
              <div className="flex w-full p-2 items-center justify-between">
                <Rarity
                  type={nft.landType}
                  className={`${
                    size !== "sm" ? "text-sm pl-2" : "text-xs pl-1"
                  }`}
                >
                  {nft.landType}
                </Rarity>

                {/*{nft.salePrice && size !== "sm" && !handleBuy && (*/}
                {/*  <Price title={nft.salePrice} />*/}
                {/*)}*/}

                {nft.landType === "Micro" && nft.tokenId && (
                  <Counter from={nft.countMintedZombies} to={30} />
                )}

                {nft.salePrice && size !== "sm" && (
                  <Price title={nft.salePrice} handleBuy={handleBuy} />
                )}

                {showDropdown && (
                  <>
                    {nft.salePrice ? (
                      <CardLandDropdown
                        setTransferPopupVisible={setTransferPopupVisible}
                        rmFromMarket={rmFromMarket}
                      />
                    ) : (
                      <CardLandDropdown
                        setTransferPopupVisible={setTransferPopupVisible}
                        setSellItems={setSellPopupVisible}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {nft.tokenId ? (
              <>
                <InfoSmallWrapper>
                  <div className="font-semibold">
                    {formatLandId(nft.landType, nft.tokenId, size)}
                  </div>
                </InfoSmallWrapper>
              </>
            ) : (
              <InfoSmallWrapper>
                <div>
                  {nft.zombiePerDay} zombie
                  {nft.zombiePerDay > 1 ? "s" : ""} / day
                </div>
              </InfoSmallWrapper>
            )}
          </CardFront>
        </CardInner>
      </FlipCard>
    </>
  );
};
