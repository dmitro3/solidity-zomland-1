import React, { useState } from "react";
import { FlipCard, CardInner, Rarity, InfoWrapper, CardFront } from "../../assets/styles/card";
import { Button } from "../basic/Button";
import { formatId, getMedia } from '../../web3/utils';
import { Price } from '../Price';
import { CardDropdown } from './CardDropdown';
import { Col, Row } from '../../assets/styles/common.style';
import attack_icon from '../../assets/images/attack_icon.png';
import health_icon from '../../assets/images/health_icon.png';
import intelect_icon from '../../assets/images/intelect_icon.png';
import speed_icon from '../../assets/images/speed_icon.png';

export const Card = ({
  nft,
  noMenu,
  size,
  setSellItems,
  setTransferPopupVisible,
  setKillItem,
  rmFromMarket,
  handleBuy,
}) => {
  const CharacteristicRow = ({ icon, title, value }) => (
    <Row className="justify-center">
      <div
        className={`${size === "sm" ? "h-7 w-7 " : "h-9 w-9 "} flex p-1.5 border-violet-500 rounded-full border-2 text-center justify-center bg-main`}>
        <img alt="icon" className="h-full" src={icon} />
      </div>
      <div className={`${size === "sm" ? "mx-2" : "mx-3"} w-1 h-7 bg-violet-800/80`} />
      <Col className="text-left text-xl w-10">
        <div className="text-violet-500 text-xs uppercase">{title}</div>
        <div className="leading-5">{value}</div>
      </Col>
    </Row>
  );

  const classMapping = {
    xsm: "x-small",
    sm: "small",
    md: "",
  };

  return (
    <>
      <FlipCard className={`${classMapping[size || "md"]}`}>
        {nft && (
          <CardInner>
            <CardFront type={nft.cardRarity}>
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
                    type={nft.cardRarity}
                    className={`${size !== "sm" ? "text-sm pl-2" : "text-xs pl-1"}`}
                  >
                    {nft.cardRarity}
                  </Rarity>

                  {nft.salePrice && size !== "sm" && (
                    <Price title={nft.salePrice} handleBuy={handleBuy} />
                  )}

                  {nft.tokenId && !noMenu && !nft.salePrice && (
                    <CardDropdown
                      setTransferPopupVisible={setTransferPopupVisible}
                      setKillItem={setKillItem}
                      setSellItems={setSellItems}
                      rmFromMarket={rmFromMarket}
                    />
                  )}
                </div>
              </div>

              {nft.tokenId && (
                <InfoWrapper withBtn={size !== "sm" && (handleBuy || nft.salePrice)}>
                  <Row className="items-center">
                    <Col className="gap-1">
                      <div className={`mb-2 ${size === "sm" ? "text-sm" : ""}`}>{formatId(nft)}</div>
                      <CharacteristicRow
                        icon={attack_icon}
                        title="Attack"
                        value={nft.attack}
                      />
                      <CharacteristicRow
                        icon={health_icon}
                        title="Health"
                        value={nft.health}
                      />
                      <CharacteristicRow
                        icon={intelect_icon}
                        title="Brain"
                        value={nft.brain}
                      />
                      <CharacteristicRow
                        icon={speed_icon}
                        title="Speed"
                        value={nft.speed || 1}
                        // Monster speed is always = 1
                      />

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
                </InfoWrapper>
              )}
            </CardFront>
          </CardInner>
        )}
      </FlipCard>
    </>
  );
};
