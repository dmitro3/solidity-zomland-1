import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addPendingTransaction,
  addTransactionError, rarityOptions,
  transformCollections,
  transformLand,
  transformZombie,
} from "../../web3/utils";
import {
  Container,
  InnerPageWrapper,
  Wrapper,
} from "../../assets/styles/common.style";
import { List } from "../../assets/styles/common.style";
import { ListWrapper } from "../../assets/styles/common.style";
import { LandContent, ZombieContent } from "../../web3/content";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { InnerPageHead } from "../../components/InnerPageHead";
import { Button } from "../../components/basic/Button";
import MintZombiePopup from "./MintZombiePopup";
import { Card } from "../../components/card/Card";
import { Loader } from "../../components/basic/Loader";
import Dropdown from "../../components/basic/Dropdown";
import { Pagination } from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { addForSale, cleanupSaleList } from '../../store/marketSlice';
import { addForKill, cleanupKillList } from '../../store/sidebarSlice';

const PAGE_LIMIT = "20";

export const Zombies = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);
  const sellList = useSelector(state => state.market.sale);
  const killList = useSelector(state => state.sidebar.kill);

  const [isReady, setIsReady] = useState(false);
  const [userZombies, setUserZombies] = useState([]);
  const [userZombiesCount, setUserZombiesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [userLands, setUserLands] = useState([]);
  const [userClaimCount, setUserClaimCount] = useState(0);
  const [mintPopupVisible, setMintPopupVisible] = useState(false);
  const [filterRarity, setFilterRarity] = useState("");
  const [filterCollection, setFilterCollection] = useState("");
  const [allCollections, setAllCollections] = useState([]);
  const [mintInProgressList, setMintInProgressList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = JSON.parse(searchParams.has("page"))
      ? searchParams.get("page")
      : currentPage;
    const collection = JSON.parse(searchParams.has("collection"))
      ? searchParams.get("collection")
      : filterCollection;
    const rarity = JSON.parse(searchParams.has("rarity"))
      ? searchParams.get("rarity")
      : filterRarity;

    setCurrentPage(parseInt(page));
    setFilterRarity(rarity);
    setFilterCollection(collection);

    fetchCollections().then(() => {
      fetchUserLands();
      fetchUserZombies(page, collection, rarity);
    });
  }, [currentUser]);

  async function fetchUserZombies(currentPage, collection, rarity) {
    const startIndex = (currentPage - 1) * PAGE_LIMIT;
    const collectionFilter = collection !== "" ? parseInt(collection) + 1 : 0;
    const zombiesObj = await window.contracts.zombie.userZombies(startIndex, PAGE_LIMIT, collectionFilter, rarity);
    const zombies = zombiesObj[1].filter(zombie => zombie.nftType).map(zombie => transformZombie(zombie));
    setUserZombiesCount(parseInt(zombiesObj[0]));

    setUserZombies(zombies);
    setIsReady(true);
  }

  const fetchCollections = async () => {
    const collectionsObj = await window.contracts.collection.getAllCollections();
    const collections = collectionsObj[1].map((collection, index) => transformCollections(collection, index));
    setAllCollections(collections);
  }

  const appendToSellList = (zombie) => {
    if (
      !sellList["zombies"].filter((exist) => exist.tokenId === zombie.tokenId).length
    ) {
      dispatch(addForSale({
        type: "zombies",
        item: zombie
      }));
      dispatch(cleanupSaleList({ type: "lands" }));
      dispatch(cleanupSaleList({ type: "monsters" }));
    }
  };

  const appendToKillList = async (zombie) => {
    if (
      !killList["zombies"].filter((exist) => exist.tokenId === zombie.tokenId).length
    ) {
      dispatch(addForKill({
        type: "zombies",
        item: zombie
      }));
      dispatch(cleanupKillList({ type: "monsters" }));
    }
  };

  const buildUrl = (filterCollection, filterRarity) => {
    let url = `/zombies?page=${currentPage}`;
    if (filterRarity) url = `${url}&rarity=${filterRarity}`;
    if (filterCollection) url = `${url}&collection=${filterCollection}`;
    return url;
  };

  async function fetchUserLands() {
    const timeNow = parseInt(new Date().getTime() / 1000);
    const oneDay = 24 * 60 * 60;
    let totalZombiesToMint = 0;

    const userLandsObj = await window.contracts.land.userLands();
    const userLands = userLandsObj.map(land => {
      const lastClaimTimestamp = parseInt(land.lastZombieClaim);
      if (!lastClaimTimestamp || timeNow - lastClaimTimestamp > oneDay) {
        if (land.landType === 0) {
          totalZombiesToMint += 1;
        } else if (land.landType === 1) {
          totalZombiesToMint += 4;
        } else {
          totalZombiesToMint += 8;
        }
      }
      return transformLand(land);
    });

    setUserClaimCount(totalZombiesToMint);
    setUserLands(userLands);
  }

  useEffect(() => navigate(buildUrl(filterCollection, filterRarity)), [currentPage]);

  const handleCollectionChange = (filterCollection) => {
    setCurrentPage(1);
    setFilterRarity("");
    fetchUserZombies(1, filterCollection, "");
    navigate(buildUrl(filterCollection, ""));
  }

  const handleRarityChange = (filterRarity) => {
    setCurrentPage(1);
    setFilterCollection("");
    fetchUserZombies(1, "", filterRarity);
    navigate(buildUrl("", filterRarity));
  }

  const handleMint = async (landId) => {
    mintInProgressList.push(landId);
    setMintInProgressList([...mintInProgressList]);

    const gas = await window.contracts.zombie.estimateGas.safeMint(landId);
    await window.contracts.zombie.safeMint(landId, {
      gasLimit: parseInt(gas * 1.5)
    }).then(transaction => {
      addPendingTransaction(dispatch, transaction, "Minting Zombies");

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          fetchUserLands();
          setCurrentPage(1);
          fetchUserZombies(1, filterCollection, filterRarity);
        } else {
          alert('Minting error');
        }

        setTimeout(() => {
          removeMintInProgressList(landId);
        }, 2000);
      });
    }).catch(err => {
      addTransactionError(dispatch, err.message);
      removeMintInProgressList(landId);
    });
  };

  const removeMintInProgressList = (landId) => {
    const index = mintInProgressList.indexOf(landId);
    if (index !== -1) {
      mintInProgressList.splice(index, 1);
      setMintInProgressList([...mintInProgressList]);
    }
  }

  const showMintZombiesBlock = () => {
    setMintPopupVisible(true);
  };

  const handleTransfer = async (zombie, transferAddress) => {
    await window.contracts.zombie.transferFrom(
      currentUser.accountId,
      transferAddress,
      zombie.tokenId
    ).then(transaction => {
      addPendingTransaction(dispatch, transaction, "Transfer Zombie NFT");
      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          setIsReady(false);
          fetchUserZombies(currentPage, filterCollection, filterRarity);
        }
      });
    });
  };

  const collectionOptions = () => {
    const collections = Object.keys(allCollections).map((key) => {
      return {
        title: allCollections[key].title,
        onClick: () => {
          const selectedCollection = allCollections[key].id;
          setFilterCollection(selectedCollection);
          handleCollectionChange(selectedCollection);
        },
      };
    });

    return [
      {
        title: "All Collections",
        onClick: () => {
          setFilterCollection("");
          handleCollectionChange("");
        },
      },
      ...collections,
    ];
  };

  const onPageChanged = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setCurrentPage(page);
    fetchUserZombies(page, filterCollection, filterRarity);
  };

  const hasLands = userLands.length > 0;
  const hasZombies = userZombiesCount > 0;

  return (
    <InnerPageWrapper>
      <Header />

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={ZombieContent.title}
            description={hasLands ? ZombieContent.description : ""}
          />

          {isReady ? (
            <>
              {hasLands ? (
                <div className="sm:flex justify-between mt-8 relative z-30">
                  <div className="lg:basis-4/12 lg:flex hidden text-lg text-left pt-4 pl-1">
                    Available:
                    <span className="ml-2 font-semibold text-orange-500">
                      {userZombiesCount} NFTs
                    </span>
                  </div>

                  <Button
                    title={`Mint ${
                      userClaimCount > 0 ? userClaimCount : ""
                    } Zombie${userClaimCount !== 1 ? "s" : ""}`}
                    size="lg"
                    noIcon
                    readonly={userClaimCount === 0}
                    onClick={showMintZombiesBlock}
                  />

                  <div className="lg:basis-4/12 basis-full z-10 sm:text-right ml-2 mt-3 sm:mt-0">
                    <div className="inline-block mr-3">
                      <Dropdown
                        title="All Rarities"
                        selected={filterRarity}
                        options={rarityOptions(setFilterRarity)}
                      />
                    </div>
                    <div className="inline-block">
                      <Dropdown
                        title="All Collections"
                        selected={
                          filterCollection
                            ? allCollections[filterCollection]?.title
                            : null
                        }
                        options={collectionOptions()}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-7 mt-10 leading-10">
                  <b className="text-xl text-orange-500">{LandContent.no_lands}.</b> <br />
                  <p className="text-cyan-200 sm:w-1/2 w-3/4 sm:px-16 mx-auto leading-6">
                    {ZombieContent.no_lands_details}
                  </p>
                </div>
              )}

              <ListWrapper>
                {hasZombies ? (
                  <List>
                    {userZombies?.map((zombie, index) => (
                      <Card
                        nft={zombie}
                        key={index}
                        sellItems={sellList["zombies"]}
                        setSellItems={() => appendToSellList(zombie)}
                        rmFromMarket={async () => {
                          setIsReady(false);
                          // await rmFromMarket(contract, zombie);
                          setIsReady(true);
                        }}
                        handleTransfer={(transferAddress) =>
                          handleTransfer(zombie, transferAddress)
                        }
                        setKillItem={() => appendToKillList(zombie)}
                      />
                    ))}
                  </List>
                ) : (
                  <div>
                    You don't have <span>{filterRarity}</span>{" "}
                    {filterCollection
                      ? allCollections[filterCollection].title
                      : ""}{" "}
                    Zombies.
                  </div>
                )}
              </ListWrapper>

              <div className="mb-8">
                <Pagination
                  total={userZombiesCount}
                  limit={parseInt(PAGE_LIMIT)}
                  selectedPage={currentPage}
                  onPageChanged={onPageChanged}
                />
              </div>
            </>
          ) : (
            <Loader />
          )}
        </Container>

        <MintZombiePopup
          mintPopupVisible={mintPopupVisible}
          setMintPopupVisible={setMintPopupVisible}
          userLands={userLands}
          handleMint={handleMint}
          mintInProgressList={mintInProgressList}
        />

      </Wrapper>

      <Footer />
    </InnerPageWrapper>
  );
};
