import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionContent } from "../../web3/content";
import {
  Container,
  InnerPageWrapper,
  Link,
  Wrapper,
} from "../../assets/styles/common.style";
import { Header } from "../../components/Header";
import { InnerPageHead } from "../../components/InnerPageHead";
import { Loader } from "../../components/basic/Loader";
import { Footer } from "../../components/Footer";
import { Popup } from "../../components/Popup";
import { Button } from "../../components/basic/Button";
import { PlusIcon } from "@heroicons/react/solid";
import {
  addPendingTransaction, addTransactionError, convertFromYocto, convertToYocto,
  getMedia,
  transformCollections,
  transformZombie,
} from "../../web3/utils";
import { MonsterBottomParams, MonsterTopParams } from "../../assets/styles/collection";
import { Card } from "../../components/card/Card";
import { Pagination } from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import infoIcon from "../../assets/images/info.png";

const MonsterParam = ({ title, pct, width }) => (
  <div className="whitespace-nowrap text-center">
    <span className={`inline-block ${width ? width : "w-[80px]"} text-left`}>
      {title}:
    </span>
    <span className="inline-block font-semibold w-[50px] text-sky-200">
      {pct}%
    </span>
  </div>
);

const POPUP_PAGE_LIMIT = 20;
const COLLECTION_ZOMBIES_COUNT = 10;

export const OneCollection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.user.user);

  const { collection_id } = useParams();
  const [isReady, setIsReady] = React.useState(false);
  const [collection, setCollection] = React.useState({});
  const [selectedPosition, setSelectedPosition] = React.useState();
  const [userCollectionZombies, setUserCollectionZombies] = React.useState([]);
  const [zombieCards, setZombieCards] = React.useState([]);
  const [zombiesPopupVisible, setZombiesPopupVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMintLoader, setIsMintLoader] = useState(false);
  const [priceInfoTooltip, setPriceInfoTooltip] = useState(false);
  const [collectionImage, setCollectionImage] = useState("");

  const loadCollection = async () => {
    const collectionsObj = await window.contracts.collection.collections(collection_id);
    const collection = transformCollections(collectionsObj, collection_id);
    setCollection(collection);
  };

  const loadCollectionImage = async () => {
    const image = await window.contracts.collection.getCollectionImage(collection_id);
    setCollectionImage(image);
  };

  const loadZombies = async (page) => {
    const zombiesObj = await window.contracts.zombie.userZombies(
      page,
      POPUP_PAGE_LIMIT.toString(),
      parseInt(collection_id) + 1,
      ""
    );
    const result = zombiesObj[1].filter((zombie) => zombie.nftType).map((zombie) => transformZombie(zombie));
    setUserCollectionZombies(result);
  };

  useEffect(() => {
    const zombieCardsList = [];
    for (let i = 0; i < COLLECTION_ZOMBIES_COUNT; i++) {
      zombieCardsList.push(null);
    }
    setZombieCards(zombieCardsList);
  }, []);

  useEffect(() => {
    loadZombies(currentPage);
    loadCollection();
    loadCollectionImage();
    setIsReady(true);
  }, []);

  const showSelectZombiesPopup = (position) => {
    setSelectedPosition(position);
    setZombiesPopupVisible(true);
  };

  const selectZombie = (zombie) => {
    zombieCards[selectedPosition] = zombie;
    setSelectedPosition(selectedPosition < 9 ? selectedPosition + 1 : 0);
    setZombieCards(zombieCards);
    if (zombieCards.filter(zm => zm).length === 10) {
      setZombiesPopupVisible(false);
    }
  };

  const countZombieSelected = () => {
    return zombieCards.filter((zombie) => zombie).length;
  };

  const onPageChanged = async (page) => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    loadZombies(page);
  };

  const monsterParams = (param) => {
    let total = 0;
    zombieCards
      .filter((zombie) => zombie)
      .map((zombie) => {
        total += zombie[param];
      });
    return total;
  };

  const monsterCardRarity = (card_type) => {
    const totalZombies = countZombieSelected();
    const oneZombiePct = 100 / totalZombies;
    const countZombieType = zombieCards.filter(
      (zombie) => zombie && zombie.cardRarity === card_type
    ).length;
    return (countZombieType * oneZombiePct).toFixed(1);
  };

  const mintMonster = async () => {
    if (countZombieSelected() === COLLECTION_ZOMBIES_COUNT) {
      setIsMintLoader(true);

      const zombieList = zombieCards.filter((zombie) => zombie).map(
        (zombie) => parseInt(zombie.tokenId)
      );
      const gas = await window.contracts.monster.estimateGas.safeMint(zombieList);


      // await window.contracts.token.stake(depositAmount).then(transaction => {
      //   addPendingTransaction(dispatch, transaction, "Deposit ZML to staking");
      //
      //   transaction.wait().then(receipt => {
      //     if (receipt.status === 1) {
      //       updateDepositedAmount();
      //       updateTotalDeposit();
      //       updateUserBalance(dispatch, currentUser.accountId);
      //       setDepositInput(0);
      //     }
      //   });
      // }).catch(err => {
      //   addTransactionError(dispatch, err.message)
      // });

      const depositAmount = convertToYocto(getMintDeposit());
      await window.contracts.token.mintMonsterPay(depositAmount, zombieList).then(transaction => {
        addPendingTransaction(dispatch, transaction, "Minting Monster");

        transaction.wait().then(receipt => {
          if (receipt.status === 1) {
            setIsMintLoader(false);
            navigate("/monsters");
          } else {
            alert('Minting error');
          }
        });
      }).catch(err => {
        addTransactionError(dispatch, err.message);
        setIsMintLoader(false);
      });

      // await window.contracts.monster.safeMint(zombieList, {
      //   gasLimit: parseInt(gas * 1.5)
      // }).then(transaction => {
      //   addPendingTransaction(dispatch, transaction, "Minting Monster");
      //
      //   transaction.wait().then(receipt => {
      //     if (receipt.status === 1) {
      //       setIsMintLoader(false);
      //       navigate("/monsters");
      //     } else {
      //       alert('Minting error');
      //     }
      //   });
      // }).catch(err => {
      //   addTransactionError(dispatch, err.message);
      //   setIsMintLoader(false);
      // });
    } else {
      alert(`You need to add ${COLLECTION_ZOMBIES_COUNT} zombies to mint the Monster`);
      setIsMintLoader(false);
    }
  };

  const isEnoughBalance = () => {
    return convertFromYocto(currentUser.tokenBalance) >= getMintDeposit();
  };

  const getMintDeposit = () => {
    let requiredDeposit = 0;
    zombieCards.filter((zombie) => zombie).map(item => {
      if (item.cardRarity === 'Common') {
        requiredDeposit += 5;
      } else if (item.cardRarity === 'Uncommon') {
        requiredDeposit += 10;
      } else if (item.cardRarity === 'Rare') {
        requiredDeposit += 20;
      } else {
        requiredDeposit += 40;
      }
    });

    return requiredDeposit;
  };

  return (
    <>
      <InnerPageWrapper>
        <Header />

        <Wrapper>
          <Container className="text-white text-center mt-6">
            <InnerPageHead
              title={CollectionContent.title}
              description={CollectionContent.description}
            />

            {isReady ? (
              <>
                <div
                  className="sm:flex flex-row text-left bg-[#140E38]/95 shadow-md sm:p-12 p-6 rounded-2xl mt-10 mb-12">
                  <div className="xl:basis-3/4 md:basis-9/12 2xl:ml-10">
                    <h2 className="text-2xl font-semibold">
                      <Link to="/collections">
                        <span className="text-2xl font-semibold text-sky-200">Collections</span>
                      </Link> &raquo;
                      Mint {collection.title}
                    </h2>
                    <p className="mt-1 mb-6 text-sm">
                      Select zombies for mint the {collection.title} Monster:
                    </p>
                    <div className="gap-3 flex flex-row flex-wrap max-w-[800px]">
                      {zombieCards.map((zombie, index) => (
                        <div
                          className="w-[140px] h-[198px] rounded-lg bg-slate-800 transition duration-200 hover:bg-slate-700 cursor-pointer"
                          key={index}
                          onClick={() => showSelectZombiesPopup(index)}
                        >
                          {zombie ? (
                            <Card noMenu nft={zombie} size="sm" />
                          ) : (
                            <div>
                              <PlusIcon className="w-8 h-8 mx-auto mt-20" />
                              <div className="text-center text-sm mt-12">
                                Select Zombie
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-10 text-sm text-cyan-200 font-semibold">
                      NOTE: Your zombies will be killed to get Monster.{" "}
                      <a
                        href="https://dandelion-dash-25e.notion.site/Collections-7ef9dd8d414847a288d992e7f3ca4714"
                        target="_blank"
                        className="link"
                        rel="noreferrer"
                      >
                        Read details
                      </a>
                      .
                    </p>
                    <p className="text-sm text-cyan-200">
                      Monster characteristic is sum of zombie characteristic
                      multiply by modifier that depends on final rarity.
                    </p>
                    <p className="text-sm text-cyan-200">
                      Chance for monster card rarity based on selected zombies
                      rarity is shown under monster card image.
                    </p>
                  </div>

                  <div className="md:basis-3/12 2xl:basis-1/4 sm:ml-10 lg:ml-8 xl:ml-10 2xl:ml-34 2xl:mr-10">
                    <p className="text-center mb-6 mt-10 sm:mt-4 lg:mt-9 font-semibold text-2xl leading-5">
                      {collection.title} Monster
                    </p>
                    <div className="relative sm:w-full w-3/4 mx-auto">
                      {collectionImage && (
                        <img
                          src={getMedia(collectionImage)}
                          alt="monster"
                          className="bg-slate-800 w-54 rounded-xl mx-auto border-4 rounded-xl border-gray-500"
                        />
                      )}

                      {countZombieSelected() > 0 && (
                        <>
                          <MonsterTopParams>
                            <div className="inline-block whitespace-nowrap">
                              Health:{" "}
                              <span className="lg:mr-3 mr-2 text-sky-200 font-semibold">
                                {monsterParams("health")}
                              </span>
                            </div>

                            <div className="inline-block whitespace-nowrap">
                              Attack:{" "}
                              <span className="lg:mr-3 mr-2 text-sky-200 font-semibold">
                                {monsterParams("attack")}
                              </span>
                            </div>

                            <div className="inline-block whitespace-nowrap">
                              Intellect:{" "}
                              <span className="text-sky-200 font-semibold">
                                {monsterParams("brain")}
                              </span>
                            </div>
                          </MonsterTopParams>

                          <MonsterBottomParams>
                            <div className="xl:flex xl:flex-row">
                              <div className="2xl:ml-6 ml-2">
                                <MonsterParam
                                  title="Common"
                                  pct={monsterCardRarity("Common")}
                                />
                                <MonsterParam
                                  title="UnCommon"
                                  pct={monsterCardRarity("Uncommon")}
                                />
                              </div>
                              <div className="2xl:ml-6 ml-2">
                                <MonsterParam
                                  width="w-[50px]"
                                  title="Rare"
                                  pct={monsterCardRarity("Rare")}
                                />
                                <MonsterParam
                                  title="Epic"
                                  width="w-[50px]"
                                  pct={monsterCardRarity("Epic")}
                                />
                              </div>
                            </div>
                          </MonsterBottomParams>
                        </>
                      )}

                      <div className="mt-4 text-center">
                        Mint Price:{" "}
                        <b
                          className={`text-lg ${
                            isEnoughBalance() ? "" : "text-red-500"
                          }`}
                        >
                          {getMintDeposit()} ZML
                        </b>
                        <div className="relative w-6 inline-block ml-2 align-text-bottom">
                          <img src={infoIcon} alt="info" className="w-6"
                               onMouseEnter={() => setPriceInfoTooltip(true)}
                               onClick={() => setPriceInfoTooltip(!priceInfoTooltip)}
                               onMouseLeave={() => setPriceInfoTooltip(false)}
                          />

                          {
                            priceInfoTooltip && (
                              <div
                                className="absolute left-[-84px] bottom-8 text-black bg-white p-4 w-52 rounded-md text-left text-sm shadow-lg">
                                <b className="block text-center">Price change by selected zombies rarity:</b>
                                <ul className="mt-2 ml-3">
                                  <li>Common: +50 ZML</li>
                                  <li>UnCommon: +100 ZML</li>
                                  <li>Rare: +200 ZML</li>
                                  <li>Epic: +400 ZML</li>
                                </ul>
                              </div>
                            )
                          }
                        </div>

                        {!isMintLoader ? (
                          <div className="text-center mt-2">
                            <Button
                              size="lg"
                              noIcon
                              title="Mint Monster"
                              disabled={countZombieSelected() < 10}
                              onClick={mintMonster}
                            />
                          </div>
                        ) : (
                          <div className="mt-4">
                            <Loader />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Loader />
            )}
          </Container>

          <Popup
            title="Select Zombies for Collection"
            popupVisible={zombiesPopupVisible}
            width="sm:w-[900px]"
            setPopupVisible={setZombiesPopupVisible}
          >
            <div className="sm:mt-2 sm:px-6">
              {userCollectionZombies.length > 0 ? (
                <div className="flex flex-row gap-4 flex-wrap">
                  {userCollectionZombies
                    .filter((zombie) => {
                      let exists = false;
                      zombieCards.map((innerZombie) => {
                        if (
                          innerZombie &&
                          innerZombie.tokenId === zombie.tokenId
                        ) {
                          exists = true;
                        }
                      });
                      return !exists;
                    })
                    .map((zombie) => (
                      <div
                        className="w-34 mb-1 cursor-pointer"
                        key={zombie.tokenId}
                        onClick={() => selectZombie(zombie)}
                      >
                        <Card nft={zombie} size="sm" noMenu />
                      </div>
                    ))}
                </div>
              ) : (
                <p>You don't have zombies from this Collection</p>
              )}

              {userCollectionZombies.length > 1 && (
                <div className="text-center">
                  <Pagination
                    total={parseInt(userCollectionZombies.length)}
                    limit={parseInt(POPUP_PAGE_LIMIT)}
                    selectedPage={currentPage}
                    onPageChanged={onPageChanged}
                  />
                </div>
              )}
            </div>
          </Popup>
        </Wrapper>

        <Footer />
      </InnerPageWrapper>
    </>
  );
};
