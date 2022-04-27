import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addPendingTransaction, addTransactionError,
  convertFromYocto,
  formatId,
  rmFromMarket, transformCollections, transformLand, transformZombie,
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
import { Popup } from "../../components/Popup";
import { useDispatch, useSelector } from "react-redux";
import { updateUserBalance } from '../../web3/api';

const PAGE_LIMIT = "20";

export const Zombies = ({
  sellList,
  setSellList,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);

  const [isReady, setIsReady] = useState(false);
  const [userZombies, setUserZombies] = useState([]);
  const [userZombiesCount, setUserZombiesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [userLands, setUserLands] = useState([]);
  const [userClaimCount, setUserClaimCount] = useState(0);
  const [killTokens, setKillTokens] = useState(0);
  const [mintPopupVisible, setMintPopupVisible] = useState(false);
  const [killPopupVisible, setKillPopupVisible] = useState(false);
  const [killItem, setKillItem] = useState(null);
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
    const collections = collectionsObj.map((collection, index) => transformCollections(collection, index));
    setAllCollections(collections);
  }

  const appendToSellList = (zombie) => {
    if (
      !sellList["zombies"].filter((exist) => exist.token_id === zombie.token_id).length
    ) {
      sellList["zombies"].push(zombie);
      sellList["lands"] = sellList["monsters"] = [];
      setSellList({ ...sellList });
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

  const rarityOptions = () => {
    const result = [];
    const options = ["All Rarities", "Common", "Uncommon", "Rare", "Epic"];

    options.map(option => {
      result.push({
        title: option,
        onClick: () => {
          const optionValue = option === "All Rarities" ? "" : option;
          setFilterRarity(optionValue);
          handleRarityChange(optionValue);
        },
      })
    });

    return result;
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

  const showKillPopup = async (item) => {
    setKillItem(item);
    setKillTokens(item.killTokens);
    setKillPopupVisible(true);
  };

  const handleKill = async () => {
    if (killItem) {
      await window.contracts.zombie.killZombie(killItem.tokenId).then(transaction => {
        addPendingTransaction(dispatch, transaction, "Kill Zombie to get ZML tokens");

        transaction.wait().then(async receipt => {
          if (receipt.status === 1) {
            fetchUserZombies(currentPage, filterCollection, filterRarity);
            setKillPopupVisible(false);

            // Update user balance
            await updateUserBalance(dispatch, currentUser.accountId);
          } else {
            alert('Minting error');
          }
        });
      }).catch(err => {
        addTransactionError(dispatch, err.message);
      });
    }
  };

  const hasLands = userLands.length > 0;
  const hasZombies = userZombiesCount > 0;

  return (
    <InnerPageWrapper>
      <Header/>

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={ZombieContent.title}
            description={hasLands ? ZombieContent.description : ""}
          />

          {isReady ? (
            <>
              {hasLands ? (
                <div className="sm:flex justify-between mt-8">
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
                        options={rarityOptions()}
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
                  <b className="text-xl text-orange-500">{LandContent.no_lands}.</b> <br/>
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
                          await rmFromMarket(contract, zombie);
                          setIsReady(true);
                        }}
                        handleTransfer={(transferAddress) =>
                          handleTransfer(zombie, transferAddress)
                        }
                        setKillItem={() => showKillPopup(zombie)}
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
            <Loader/>
          )}
        </Container>

        <MintZombiePopup
          mintPopupVisible={mintPopupVisible}
          setMintPopupVisible={setMintPopupVisible}
          userLands={userLands}
          handleMint={handleMint}
          mintInProgressList={mintInProgressList}
        />

        <Popup
          title="Kill Zombie"
          popupVisible={killPopupVisible}
          setPopupVisible={setKillPopupVisible}
        >
          {killItem && (
            <div className="mt-2">
              <p className="mb-6">
                Zombie{" "}
                <span className="text-xl font-semibold">
                  {formatId(killItem)}
                </span>{" "}
                will be killed and you will receive{" "}
                {killTokens && (
                  <span className="text-xl font-semibold">
                    {convertFromYocto(killTokens, 2)} ZML
                  </span>
                )}{" "}
                tokens.
              </p>

              <div className="mr-3 inline-block">
                <Button
                  title="Cancel"
                  secondary
                  noIcon
                  onClick={() => setKillPopupVisible(false)}
                />
              </div>
              <div className="inline-block">
                <Button title="Kill Zombie" onClick={handleKill}/>
              </div>
            </div>
          )}
        </Popup>
      </Wrapper>

      <Footer/>
    </InnerPageWrapper>
  );
};
