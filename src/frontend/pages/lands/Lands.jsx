import React, {useEffect, useState} from "react";
import {
  convertFromYocto,
  convertToTera,
  rmFromMarket,
} from "../../near/utils";
import {LandContent} from "../../near/content";
import {
  Container,
  InnerPageWrapper,
  Wrapper,
} from "../../assets/styles/common.style";
import {List} from "../../assets/styles/common.style";
import {ListWrapper} from "../../assets/styles/common.style";
import {Header} from "../../components/Header";
import {Button} from "../../components/basic/Button";
import {Footer} from "../../components/Footer";
import {InnerPageHead} from "../../components/InnerPageHead";
import {Loader} from "../../components/basic/Loader";
import {Popup} from "../../components/Popup";
import {MintLandSection} from "./MintLandSection";
import {Card} from "../../components/card/Card";

export const Lands = ({currentUser, contract, landContract, sellList, setSellList}) => {
  const [allLands, setAllLands] = useState({});
  const [userLands, setUserLands] = useState([]);
  const [mintPopupVisible, setMintPopupVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const userLandsPromise = new Promise(async (resolve, reject) => {
      // const userLands = await contract
      //   .user_lands({
      //     account_id: currentUser.accountId,
      //   })
      //   .catch((err) => reject(err));
      // resolve(userLands);
      const userTotalCount = await landContract.balanceOf(currentUser.accountId);
      console.log(parseInt(userTotalCount));
    });

    const allLandsPromise = new Promise(async (resolve, reject) => {
      // const allLands = await contract
      //   .total_lands_count()
      //   .catch((err) => reject(err));
      // resolve(allLands);
    });

    Promise.all([userLandsPromise, allLandsPromise]).then((result) => {
      // const lands = result[0].map((ln) => {
      //   if (ln.sale_price) {
      //     ln.sale_price = convertFromYocto(ln.sale_price);
      //   }
      //   return ln;
      // });
      // setUserLands(lands);
      // setAllLands(result[1]);
      // setIsReady(true);
    });
  }, []);

  const handleTransfer = async (land, transferAddress) => {
    // let gas = convertToTera("60");
    // await contract.transfer_land(
    //   {
    //     token_id: land.token_id,
    //     recipient_id: transferAddress,
    //   },
    //   gas,
    //   1
    // );
  };

  const appendToSellList = (land) => {
    if (
        !sellList["lands"].filter((exist) => exist.token_id === land.token_id)
            .length
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
        <Header currentUser={currentUser}/>

        <Wrapper>
          <Container className="text-white text-center mt-6">
            <InnerPageHead
                title={LandContent.title}
                description={LandContent.description}
            />

            {!userLands.length || (
                <Button
                    title="Buy More Lands"
                    size="lg"
                    animated
                    noIcon
                    onClick={showMintPopup}
                />
            )}

            <ListWrapper>
              {isReady ? (
                  <List>
                    {userLands.length ? (
                        userLands.map((land, index) => (
                            <Card
                                nft={land}
                                key={index}
                                contract={contract}
                                currentUser={currentUser}
                                sellItems={sellList["lands"]}
                                setSellItems={() => appendToSellList(land)}
                                rmFromMarket={async () => {
                                  setIsReady(false);
                                  await rmFromMarket(contract, land);
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
                              currentUser={currentUser}
                              contract={contract}
                              allLands={allLands}
                              userLands={userLands}
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
                  currentUser={currentUser}
                  contract={contract}
                  allLands={allLands}
                  userLands={userLands}
              />
            </div>
          </Popup>
        </Wrapper>
        <Footer/>
      </InnerPageWrapper>
  );
};
