import React from "react";
import {
  FlipCard,
  CardInner,
  Rarity,
  InfoSmallWrapper,
  CardFront,
  InfoBaseWrapper,
} from "../../assets/styles/card";
import { CardLandDropdown } from "./CardLandDropdown";
import { Price } from "../Price";
import { formatLandId, getMedia } from '../../web3/utils';
import { Counter } from '../Counter';
import { Button } from '../basic/Button';
import { Col, Row } from '../../assets/styles/common.style';

export const CardLand = ({
  nft,
  noMenu,
  size,
  setTransferPopupVisible,
  rmFromMarket,
  setSellItems,
  handleBuy,
}) => {
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

                {nft.landType === "Micro" && nft.tokenId && (
                  <Counter from={nft.countMintedZombies || 0} to={30} />
                )}

                {nft.salePrice && size !== "sm" && (
                  <Price title={nft.salePrice} handleBuy={handleBuy} />
                )}

                {nft.tokenId && !noMenu && !nft.salePrice && (
                  <CardLandDropdown
                    setTransferPopupVisible={setTransferPopupVisible}
                    setSellItems={setSellItems}
                  />
                )}
              </div>
            </div>

            {nft.tokenId ? (
              <>
                <InfoSmallWrapper withBtn={handleBuy || nft.salePrice}>
                  <Row className="items-center font-semibold">
                    <Col>
                      <div className="pb-1">
                        {formatLandId(nft.landType, nft.tokenId, size)}
                      </div>
                      <Row>
                        {handleBuy ? (
                          <Button
                            title={
                              <>
                                <span className="mr-1">Buy for</span>
                                {nft.salePrice} {process.env.TOKEN_SYMBOL}
                              </>
                            }
                            className="mt-2"
                            size="xs"
                            noIcon
                            onClick={handleBuy}
                          />
                        ) : (
                          nft.salePrice && size !== "sm" && (
                            <Button
                              title="Remove from Market"
                              size="xs"
                              className="mt-2"
                              noIcon
                              secondary
                              onClick={rmFromMarket}
                            />
                          )
                        )}
                      </Row>
                    </Col>
                  </Row>
                </InfoSmallWrapper>
              </>
            ) : (
              <InfoBaseWrapper>
                <div>
                  {nft.zombiePerDay} zombie
                  {nft.zombiePerDay > 1 ? "s" : ""} / day
                </div>
              </InfoBaseWrapper>
            )}
          </CardFront>
        </CardInner>
      </FlipCard>
    </>
  );
};
