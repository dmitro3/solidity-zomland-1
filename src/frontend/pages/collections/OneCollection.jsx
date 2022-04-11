import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  convertToTera,
  convertToYocto,
  getMedia,
  transformZombie,
} from "../../web3/utils";
import { MonsterTopParams } from "../../assets/styles/collection";
import { Card } from "../../components/card/Card";
import { Pagination } from "../../components/Pagination";

const MonsterParam = ({ title, pct }) => (
  <div className="whitespace-nowrap text-center">
    <span className={`inline-block w-[100px] text-left`}>{title}:</span>
    <span className="inline-block font-semibold w-[60px] text-sky-200">
      {pct}%
    </span>
  </div>
);

const POPUP_PAGE_LIMIT = 40;
const COLLECTION_ZOMBIES_COUNT = 10;

export const OneCollection = ({ currentUser, contract, zombieContract }) => {
  const { collection_id } = useParams();
  const [isReady, setIsReady] = React.useState(false);
  const [collection, setCollection] = React.useState({});
  const [selectedPosition, setSelectedPosition] = React.useState();
  const [userCollectionZombies, setUserCollectionZombies] = React.useState([]);
  const [zombieCards, setZombieCards] = React.useState([]);
  const [zombiesPopupVisible, setZombiesPopupVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const loadCollection = async () => {
    const result = await contract.get_one_collection({
      collection_id: Number(collection_id),
    });
    setCollection(result);
  };

  const loadZombies = async (page) => {
    const zombiesObj = await zombieContract.userZombies(
      page,
      POPUP_PAGE_LIMIT.toString()
    );
    let result = zombiesObj
      .filter((zombie) => zombie.nftType)
      .map((zombie) => transformZombie(zombie));
    setUserCollectionZombies(result);
  };

  useEffect(() => {
    let zombieCardsList = [];
    for (let i = 0; i < COLLECTION_ZOMBIES_COUNT; i++) {
      zombieCardsList.push(null);
    }
    setZombieCards(zombieCardsList);
  }, []);

  useEffect(() => {
    loadZombies(currentPage);
    loadCollection();
    setIsReady(true);
  }, []);

  const showSelectZombiesPopup = (position) => {
    setSelectedPosition(position);
    setZombiesPopupVisible(true);
  };

  const selectZombie = (zombie) => {
    setZombiesPopupVisible(false);
    zombieCards[selectedPosition] = zombie;
    setZombieCards(zombieCards);
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

  // const mintMonster = async () => {
  //   if (countZombieSelected() === COLLECTION_ZOMBIES_COUNT) {
  //     const zombie_list = zombieCards
  //       .filter((zombie) => zombie)
  //       .map((zombie) => zombie.tokenId);
  //     const GAS = convertToTera("200");
  //     const DEPOSIT = convertToYocto("0.01");
  //     await contract.mint_collection(
  //       {
  //         collection_id: Number(collection_id),
  //         zombie_list: zombie_list,
  //       },
  //       GAS,
  //       DEPOSIT
  //     );
  //   } else {
  //     alert(
  //       `You need to add ${COLLECTION_ZOMBIES_COUNT} zombies to mint the Monster`
  //     );
  //   }
  // };

  return (
    <>
      <InnerPageWrapper>
        <Header currentUser={currentUser} />

        <Wrapper>
          <Container className="text-white text-center mt-6">
            <InnerPageHead
              title={CollectionContent.title}
              description={CollectionContent.description}
            />

            {isReady ? (
              <>
                {searchParams.get("transactionHashes") && (
                  <Link to="/monsters">
                    <div className="block font-semibold mt-10 w-1/2 mx-auto py-5 rounded-xl mint-success transition cursor-pointer">
                      <p className="mb-1">You monster successfully minted!</p>
                      <span className="text-orange-500">
                        Check it on Monsters Page
                      </span>
                    </div>
                  </Link>
                )}

                <div className="sm:flex flex-row text-left bg-[#140E38]/95 shadow-md sm:p-12 p-6 rounded-2xl mt-10 mb-12">
                  <div className="xl:basis-3/4 md:basis-9/12 2xl:ml-10">
                    <h2 className="text-2xl font-semibold">
                      Mint Collection: {collection.title}
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
                    <p className="mt-10 text-sm text-cyan-200">
                      NOTE: Your zombies will be killed to combine them into
                      Monster.
                    </p>
                    <p className="text-sm text-cyan-200">
                      When you start selecting zombies, you will see Monster
                      Card rarity chances based on selected zombies.
                    </p>
                  </div>

                  <div className="md:basis-3/12 2xl:basis-1/4 sm:ml-10 lg:ml-8 xl:ml-10 2xl:ml-34 2xl:mr-10">
                    <p className="text-center mb-6 mt-9 font-semibold leading-5">
                      {collection.title} Monster
                    </p>
                    <div className="relative sm:w-full w-3/4 mx-auto">
                      {collection.image && (
                        <img
                          src={getMedia(collection.image)}
                          alt="monster"
                          className="bg-slate-800 w-54 rounded-xl mx-auto border-4 rounded-xl border-gray-500"
                        />
                      )}

                      {countZombieSelected() ? (
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
                        </>
                      ) : (
                        ""
                      )}

                      <div className="text-center mt-4">
                        <Button
                          size="lg"
                          noIcon
                          title="Mint Monster"
                          disabled
                          // onClick={mintMonster}
                        />
                      </div>

                      {countZombieSelected() ? (
                        <div className="mt-5">
                          {/*<p className="font-semibold text-center mb-1">Rarity Chance:</p>*/}
                          <MonsterParam
                            title="Common"
                            pct={monsterCardRarity("Common")}
                          />
                          <MonsterParam
                            title="UnCommon"
                            pct={monsterCardRarity("Uncommon")}
                          />
                          <MonsterParam
                            title="Rare"
                            pct={monsterCardRarity("Rare")}
                          />
                          <MonsterParam
                            title="Epic"
                            pct={monsterCardRarity("Epic")}
                          />
                        </div>
                      ) : (
                        ""
                      )}
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
              {userCollectionZombies[0] > 0 ? (
                <div className="flex flex-row gap-4 flex-wrap">
                  {userCollectionZombies[1]
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

              {userCollectionZombies[0] > 1 && (
                <div className="text-center">
                  <Pagination
                    total={parseInt(userCollectionZombies[0])}
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
