import React, { useEffect, useState } from "react";
import { addPendingTransaction, landTypeMap, rmFromMarket, transformLand, } from "../../web3/utils";
import { LandContent } from "../../web3/content";
import { Container, InnerPageWrapper, Wrapper, } from "../../assets/styles/common.style";
import { List } from "../../assets/styles/common.style";
import { ListWrapper } from "../../assets/styles/common.style";
import { Header } from "../../components/Header";
import { Button } from "../../components/basic/Button";
import { Footer } from "../../components/Footer";
import { InnerPageHead } from "../../components/InnerPageHead";
import { Loader } from "../../components/basic/Loader";
import { Popup } from "../../components/Popup";
import { MintLandSection } from "./MintLandSection";
import { Card } from "../../components/card/Card";
import { useDispatch, useSelector } from "react-redux";

export const Lands = ({sellList, setSellList}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);

  const [allLands, setAllLands] = useState({});
  const [userLands, setUserLands] = useState([]);
  const [mintPopupVisible, setMintPopupVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadAllLands();
    loadUserLands();
  }, [currentUser]);

  const loadAllLands = async () => {
    const allLands = {};
    const allLandsObj = await window.contracts.land.getAllLands();

    allLandsObj.map((land, index) => {
      allLands[landTypeMap[index]] = {
        landType: landTypeMap[index],
        totalCount: parseInt(land.limitCount),
        price: parseInt(land.price),
        zombiePerDay: parseInt(land.zombiesPerDay),
        media: land.media,
      };
    });

    setAllLands(allLands);
  }

  const loadUserLands = async () => {
    const landsObj = await window.contracts.land.userLands();
    const lands = landsObj.map(land => transformLand(land));
    setUserLands(lands || []);
    setIsReady(true);
  }

  const handleTransfer = async (land, transferAddress) => {
    await window.contracts.land.transferFrom(
      currentUser.accountId,
      transferAddress,
      land.tokenId
    ).then(transaction => {
      addPendingTransaction(dispatch, transaction, "Transfer Land NFT");
      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          setIsReady(false);
          loadUserLands();
        }
      });
    });
  };

  const watchMintTransaction = (tx) => {
    addPendingTransaction(dispatch, tx, tx.message);

    tx.wait().then(receipt => {
      if (receipt.status === 1) {
        loadUserLands();
      }
    });
  }

  const appendToSellList = (land) => {
    if (
      !sellList["lands"].filter((exist) => exist.tokenId === land.tokenId).length
    ) {
      sellList["lands"].push(land);
      sellList["zombies"] = sellList["monsters"] = [];
      setSellList({...sellList});
    }
  };

  const showMintPopup = async () => {
    setMintPopupVisible(true);
  };

  return (
    <InnerPageWrapper>
      <Header/>

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={LandContent.title}
            description={LandContent.description}
          />

          {isReady && (
            <>
              {!userLands.length || (
                <Button
                  title="Buy More Lands"
                  size="lg"
                  animated
                  noIcon
                  onClick={showMintPopup}
                />
              )}
            </>
          )}

          <ListWrapper>
            {isReady ? (
              <List>
                {userLands.length ? (
                  userLands.map((land, index) => (
                    <Card
                      nft={land}
                      key={index}
                      sellItems={sellList["lands"]}
                      setSellItems={() => appendToSellList(land)}
                      rmFromMarket={async () => {
                        setIsReady(false);
                        await rmFromMarket(window.contracts['land'], land);
                        setIsReady(true);
                      }}
                      handleTransfer={(transferAddress) =>
                        handleTransfer(land, transferAddress)
                      }
                    />
                  ))
                ) : (
                  <div>
                    <div className="mb-7 leading-10">
                      <b className="text-xl">{LandContent.no_lands}.</b> <br/>
                      <p className="text-cyan-200 leading-6 px-4">
                        {LandContent.no_lands_details}:
                      </p>
                    </div>
                    <MintLandSection
                      allLands={allLands}
                      userLands={userLands}
                      watchMintTransaction={(tx) => watchMintTransaction(tx)}
                    />
                  </div>
                )}
              </List>
            ) : (
              <Loader/>
            )}
          </ListWrapper>
        </Container>

        <Popup
          title="Buy More Lands"
          width="sm:w-[816px]"
          popupVisible={mintPopupVisible}
          setPopupVisible={setMintPopupVisible}
        >
          <div className="mt-2">
            <MintLandSection
              allLands={allLands}
              userLands={userLands}
              watchMintTransaction={(tx) => {
                watchMintTransaction(tx);
                setMintPopupVisible(false);
              }}
            />
          </div>
        </Popup>
      </Wrapper>
      <Footer/>
    </InnerPageWrapper>
  );
};
