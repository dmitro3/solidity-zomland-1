import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addNewTransaction,
  convertFromYocto,
  formatId,
  rmFromMarket, transformLand, transformZombie,
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
import { addTransaction, addTransactionError, updateTransaction } from '../../store/transactionSlice';
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
  const [filterRarity, setFilterRarity] = useState(null);
  const [filterCollection, setFilterCollection] = useState(null);
  const [allCollections, setAllCollections] = useState([]);
  const [mintInProgressList, setMintInProgressList] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();


  async function fetchUserZombies(currentPage) {
    // if (filterCollection) {
    //   requestParams["filter_collection"] = Number(filterCollection);
    // }
    // if (filterRarity) {
    //   requestParams["filter_rarity"] = filterRarity;
    // }
    const startIndex = (currentPage - 1) * PAGE_LIMIT;
    let zombiesObj = await window.contracts['zombie'].userZombies(startIndex, PAGE_LIMIT);
    let zombies = zombiesObj.filter(zombie => zombie.nftType).map(zombie => transformZombie(zombie));
    setUserZombies(zombies);
    setIsReady(true);
  }

  const fetchCollections = async () => {
    // setAllCollections(await contract.get_collections());
  }
  const fetchCountUserZombies = async () => {
    const userTotalCount = await window.contracts['zombie'].balanceOf(currentUser.accountId);
    setUserZombiesCount(parseInt(userTotalCount));
  }

  const appendToSellList = (zombie) => {
    if (
      !sellList["zombies"].filter((exist) => exist.token_id === zombie.token_id)
        .length
    ) {
      sellList["zombies"].push(zombie);
      sellList["lands"] = sellList["monsters"] = [];
      setSellList({ ...sellList });
    }
  };

  const buildUrl = () => {
    let url = `/zombies?page=${ currentPage }`;
    // if (filterRarity) url = `${url}&rarity=${filterRarity}`;
    // if (filterCollection) url = `${url}&collection=${filterCollection}`;

    return url;
  };

  async function fetchUserLands() {
    let timeNow = parseInt(new Date().getTime() / 1000);
    let oneDay = 24 * 60 * 60;
    let totalZombiesToMint = 0;

    let userLandsObj = await window.contracts['land'].userLands();
    let userLands = userLandsObj.map(land => {
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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = JSON.parse(searchParams.has("page"))
      ? searchParams.get("page")
      : currentPage;
    // const rarity = JSON.parse(searchParams.has("rarity"))
    //   ? searchParams.get("rarity")
    //   : filterRarity;
    // const collection = JSON.parse(searchParams.has("collection"))
    //   ? searchParams.get("collection")
    //   : filterCollection;

    setCurrentPage(page);
    // setFilterRarity(rarity);
    // setFilterCollection(collection);

    fetchUserLands();
    fetchCollections();
    fetchUserZombies(page);
    fetchCountUserZombies();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchCollections();
    fetchUserZombies(1);
    navigate(buildUrl());
  }, [filterRarity, filterCollection]);

  useEffect(() => navigate(buildUrl()), [currentPage]);

  const handleMint = async (landId) => {
    mintInProgressList.push(landId);
    setMintInProgressList([...mintInProgressList]);

    const gas = await window.contracts['zombie'].estimateGas.safeMint(landId);
    await window.contracts['zombie'].safeMint(landId, {
      gasLimit: gas * 2
    }).then(transaction => {
      addNewTransaction(dispatch, transaction, "Minting Zombies");

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          fetchUserLands();
          fetchCountUserZombies();
          setCurrentPage(1);
          fetchUserZombies(1);
        } else {
          alert('Minting error');
        }

        setTimeout(() => {
          removeMintInProgressList(landId);
        }, 2000);
      });
    }).catch(err => {
      dispatch(addTransactionError({
        id: new Date().toISOString(),
        message: err.message
      }))
      removeMintInProgressList(landId);
    });
  };

  const removeMintInProgressList = (landId) => {
    let index = mintInProgressList.indexOf(landId);
    if (index !== -1) {
      mintInProgressList.splice(index, 1);
      setMintInProgressList([...mintInProgressList]);
    }
  }

  const showMintZombiesBlock = () => {
    setMintPopupVisible(true);
  };

  const handleTransfer = async (zombie, transferAddress) => {
    // let gas = convertToTera("60");
    // await contract.transfer_zombie(
    //   {
    //     token_id: zombie.token_id,
    //     recipient_id: transferAddress,
    //   },
    //   gas,
    //   1
    // );
  };

  const rarityOptions = () => {
    return [
      {
        title: "All",
        onClick: () => setFilterRarity(null),
      },
      {
        title: "Common",
        onClick: () => setFilterRarity("Common"),
      },
      {
        title: "Uncommon",
        onClick: () => setFilterRarity("Uncommon"),
      },
      {
        title: "Rare",
        onClick: () => setFilterRarity("Rare"),
      },
      {
        title: "Epic",
        onClick: () => setFilterRarity("Epic"),
      },
    ];
  };

  const collectionOptions = () => {
    const collections = Object.keys(allCollections).map((key) => {
      return {
        title: allCollections[key].title,
        onClick: () => setFilterCollection(key),
      };
    });
    return [
      {
        title: "All",
        onClick: () => setFilterCollection(null),
      },
      ...collections,
    ];
  };

  const onPageChanged = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setCurrentPage(page);
    fetchUserZombies(page);
  };

  const showKillPopup = async (item) => {
    setKillItem(item);
    setKillTokens(item.killTokens);
    setKillPopupVisible(true);
  };

  const handleKill = async () => {
    if (killItem) {
      await window.contracts['zombie'].killZombie(killItem.tokenId).then(transaction => {
        addNewTransaction(dispatch, transaction, "Kill Zombie to get ZML tokens");

        transaction.wait().then(async receipt => {
          if (receipt.status === 1) {
            fetchUserZombies(currentPage);
            setKillPopupVisible(false);

            // Update user balance
            await updateUserBalance(currentUser.accountId);
          } else {
            alert('Minting error');
          }
        });
      }).catch(err => {
        dispatch(addTransactionError({
          id: new Date().toISOString(),
          message: err.message
        }))
      });
    }
    // let gas = convertToTera("90");
    // await contract.kill_zombie(
    //   {
    //     zombie_id: killItem.token_id,
    //   },
    //   gas,
    //   1
    // );
  };

  const hasLands = userLands.length > 0;
  const hasZombies = userZombiesCount > 0;

  return (
    <InnerPageWrapper>
      <Header/>

      <Wrapper>
        <Container className="text-white text-center mt-6">
          <InnerPageHead
            title={ ZombieContent.title }
            description={ hasLands ? ZombieContent.description : "" }
          />

          { isReady ? (
            <>
              { hasLands ? (
                <div className="sm:flex justify-between mt-8">
                  <div className="lg:basis-4/12 lg:flex hidden text-lg text-left pt-4 pl-1">
                    Available:
                    <span className="ml-2 font-semibold text-orange-500">
                      { userZombiesCount } NFTs
                    </span>
                  </div>

                  <Button
                    title={ `Mint ${
                      userClaimCount > 0 ? userClaimCount : ""
                    } Zombie${ userClaimCount !== 1 ? "s" : "" }` }
                    size="lg"
                    noIcon
                    readonly={ userClaimCount === 0 }
                    onClick={ showMintZombiesBlock }
                  />

                  <div className="lg:basis-4/12 basis-full z-10 sm:text-right ml-2 mt-3 sm:mt-0">
                    <div className="inline-block mr-3">
                      <Dropdown
                        title="Rarity"
                        selected={ filterRarity }
                        options={ rarityOptions() }
                      />
                    </div>
                    <div className="inline-block">
                      <Dropdown
                        title="Collection"
                        selected={
                          filterCollection
                            ? allCollections[filterCollection]?.title
                            : null
                        }
                        options={ collectionOptions() }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-7 mt-10 leading-10">
                  <b className="text-xl text-orange-500">{ LandContent.no_lands }.</b> <br/>
                  <p className="text-cyan-200 sm:w-1/2 w-3/4 sm:px-16 mx-auto leading-6">
                    { ZombieContent.no_lands_details }
                  </p>
                </div>
              ) }

              <ListWrapper>
                { hasZombies ? (
                  <List>
                    { userZombies?.map((zombie, index) => (
                      <Card
                        nft={ zombie }
                        key={ index }
                        sellItems={ sellList["zombies"] }
                        setSellItems={ () => appendToSellList(zombie) }
                        rmFromMarket={ async () => {
                          setIsReady(false);
                          await rmFromMarket(contract, zombie);
                          setIsReady(true);
                        } }
                        handleTransfer={ (transferAddress) =>
                          handleTransfer(zombie, transferAddress)
                        }
                        setKillItem={ () => showKillPopup(zombie) }
                      />
                    )) }
                  </List>
                ) : (
                  <div>
                    You don't have <span>{ filterRarity }</span>{ " " }
                    { filterCollection
                      ? allCollections[filterCollection].title
                      : "" }{ " " }
                    Zombies.
                  </div>
                ) }
              </ListWrapper>

              <div className="mb-8">
                <Pagination
                  total={ userZombiesCount }
                  limit={ parseInt(PAGE_LIMIT) }
                  selectedPage={ currentPage }
                  onPageChanged={ onPageChanged }
                />
              </div>
            </>
          ) : (
            <Loader/>
          ) }
        </Container>

        <MintZombiePopup
          mintPopupVisible={ mintPopupVisible }
          setMintPopupVisible={ setMintPopupVisible }
          userLands={ userLands }
          handleMint={ handleMint }
          mintInProgressList={ mintInProgressList }
        />

        <Popup
          title="Kill Zombie"
          popupVisible={ killPopupVisible }
          setPopupVisible={ setKillPopupVisible }
        >
          { killItem && (
            <div className="mt-2">
              <p className="mb-6">
                Zombie{ " " }
                <span className="text-xl font-semibold">
                  #{ formatId(killItem.tokenId) }
                </span>{ " " }
                will be killed and you will receive{ " " }
                { killTokens && (
                  <span className="text-xl font-semibold">
                    { convertFromYocto(killTokens, 2) } ZML
                  </span>
                ) }{ " " }
                tokens.
              </p>

              <div className="mr-3 inline-block">
                <Button
                  title="Cancel"
                  secondary
                  noIcon
                  onClick={ () => setKillPopupVisible(false) }
                />
              </div>
              <div className="inline-block">
                <Button title="Kill Zombie" onClick={ handleKill }/>
              </div>
            </div>
          ) }
        </Popup>
      </Wrapper>

      <Footer/>
    </InnerPageWrapper>
  );
};
