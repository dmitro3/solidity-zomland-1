import React, { useRef, useState } from "react";
import { addPendingTransaction, addTransactionError, convertFromYocto, convertToYocto, transformMonster } from "../web3/utils";
import { TokenContent } from "../web3/content";
import {
  Container,
  InnerPageWrapper,
  List,
  Wrapper,
} from "../assets/styles/common.style";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InnerPageHead } from "../components/InnerPageHead";
import { Button } from "../components/basic/Button";
import { Popup } from "../components/Popup";
import { Card } from "../components/card/Card";
import { BigNumber } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserBalance } from '../web3/api';
import { Loader } from '../components/basic/Loader';

export const Token = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);

  const [isReady, setIsReady] = React.useState(false);
  const [depositInput, setDepositInput] = React.useState();
  const [userMonsters, setUserMonsters] = useState([0, []]);
  const [depositedBalance, setDepositedBalance] = React.useState(0);
  const [rewardBalance, setRewardBalance] = React.useState(0);
  const [aprPct, setAprPct] = React.useState();
  const [withdrawInput, setWithdrawInput] = React.useState();
  const [totalStake, setTotalStake] = React.useState();
  const [stakeMonster, setStakeMonster] = React.useState();
  const [stakeMonsterPct, setStakeMonsterPct] = React.useState(0);
  const [monsterPopupVisible, setMonsterPopupVisible] = useState(false);
  const funRef = useRef(null);

  React.useEffect(() => {
    updateEarnedRewards();
    updateDepositedAmount();
    updateTotalDeposit();
    updateAPR();
    getStakedMonster();

    // update reward earned
    funRef.current = setInterval(() => {
      updateEarnedRewards();
      updateAPR();
    }, 30000);
    return () => {
      clearInterval(funRef.current);
    };
  }, []);

  const updateEarnedRewards = async () => {
    let earned = await window.contracts.token.earned(currentUser.accountId);
    setRewardBalance(parseInt(earned));

    setTimeout(() => {
      setIsReady(true);
    }, 300);
  };

  const updateAPR = async () => {
    let apr = await window.contracts.token.getAPR();
    setAprPct(parseInt(apr));
  };

  const getStakedMonster = async () => {
    let stakeMonster = await window.contracts.monster.isStakeMonster(currentUser.accountId);
    if (stakeMonster[2]) {
      setStakeMonster(transformMonster(stakeMonster[0]));
      setStakeMonsterPct(parseInt(stakeMonster[1]));
    } else {
      setStakeMonster(null);
      setStakeMonsterPct(0);
    }
  };

  const openMonsterPopup = async () => {
    const PAGE_LIMIT = 40;
    const monstersObj = await window.contracts.monster.userMonsters(1, PAGE_LIMIT, "");
    const monsters = monstersObj[1].filter(monster => monster.nftType).map(monster => transformMonster(monster)).reverse();
    setUserMonsters(monsters);
    setMonsterPopupVisible(true);
  };

  const selectMonster = async (monster) => {
    try {
      setTimeout(() => {
        setMonsterPopupVisible(false);
      }, 300);

      await window.contracts.monster.transferFrom(
        currentUser.accountId,
        window.contracts.token.address,
        monster.tokenId
      ).then(transaction => {
        addPendingTransaction(dispatch, transaction, `Transfer Monster for Staking`);
        transaction.wait().then(receipt => {
          if (receipt.status === 1) {
            getStakedMonster();
          }
        });
      });
    } catch (e) {
      addTransactionError(dispatch, e.message);
    }
  };

  const handleUnstakeMonster = async () => {
    await window.contracts.monster.unStakeMonster().then(transaction => {
      addPendingTransaction(dispatch, transaction, "Withdraw Monster from staking");

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          console.log('+')
          getStakedMonster();
        }
      });
    }).catch(err => {
      addTransactionError(dispatch, err.message)
    });
  };

  const updateTotalDeposit = async () => {
    let totalStake = await window.contracts.token.stakingTotalSupply();
    setTotalStake(parseInt(totalStake));
  };

  const updateDepositedAmount = async () => {
    let deposited = await window.contracts.token.myBalance();
    setDepositedBalance(deposited);
  };

  const handleDepositApprove = async () => {
    let depositAmount = convertToYocto(depositInput.toString());
    if (BigNumber.from(currentUser.tokenBalance.toString()).lt(BigNumber.from(depositAmount))) {
      depositAmount = currentUser.tokenBalance;
    }
    if (depositAmount <= 1) {
      alert("Please provide correct Deposit amount");
      return false;
    }

    handleDeposit(depositAmount);
  };

  const handleDeposit = async (depositAmount) => {
    await window.contracts.token.stake(depositAmount).then(transaction => {
      addPendingTransaction(dispatch, transaction, "Deposit ZML to staking");

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          updateDepositedAmount();
          updateTotalDeposit();
          updateUserBalance(dispatch, currentUser.accountId);
          setDepositInput(0);
        }
      });
    }).catch(err => {
      addTransactionError(dispatch, err.message)
    });
  };

  const handleWithdraw = async () => {
    let withdrawAmount = convertToYocto(withdrawInput.toString());
    console.log(withdrawAmount);
    await window.contracts.token.withdraw(withdrawAmount).then(transaction => {
      addPendingTransaction(dispatch, transaction, "Withdraw ZML tokens");

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          updateDepositedAmount();
          updateTotalDeposit();
          updateUserBalance(dispatch, currentUser.accountId);
          setWithdrawInput(0);
        }
      });
    }).catch(err => {
      addTransactionError(dispatch, err.message);
    });
  };

  const handleWithdrawRewards = async () => {
    await window.contracts.token.getReward().then(transaction => {
      addPendingTransaction(dispatch, transaction, "Claim ZML Rewards");

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          updateEarnedRewards();
          updateUserBalance(dispatch, currentUser.accountId);
        }
      });
    }).catch(err => {
      addTransactionError(dispatch, err.message);
    });
  };

  return (
    <>
      <InnerPageWrapper>
        <Header />

        <Wrapper>
          <Container className="text-white text-center mt-6">
            <InnerPageHead
              title={TokenContent.title}
              description={TokenContent.description}
            />

            {isReady ? (
              <div className="2xl:w-3/4 w-full mx-auto bg-main p-10 rounded-2xl shadow-lg">
                <div className="sm:flex flex-row text-left">

                  <div className="text-lg sm:w-8/12 lg:flex lg:gap-14">
                    <div className="lg:w-1/2">
                      <p className="mb-2 lg:mt-12 mt-6">
                        <span className="w-24 inline-block">Balance:</span>
                        <span className="font-semibold">
                      {convertFromYocto(currentUser.tokenBalance, 2)} ZML
                    </span>
                      </p>
                      <p className="mb-2">
                        <span className="w-24 inline-block">Staked:</span>
                        <span className="font-semibold">
                      {convertFromYocto(depositedBalance, 2)} ZML
                    </span>
                      </p>

                      <p className="whitespace-nowrap">
                        <span className="w-24 inline-block">Rewards:</span>
                        <span className="font-semibold">
                      {convertFromYocto(rewardBalance, 6)} ZML
                    </span>
                        {rewardBalance > 0 && (
                          <span
                            className="ml-3 border-dashed border-b cursor-pointer text-sky-200"
                            onClick={() => handleWithdrawRewards()}
                          >
                        claim
                      </span>
                        )}
                      </p>
                    </div>

                    <div className="lg:w-1/2">
                      <div className="mb-2 lg:mt-12 mt-6 lg:ml-4">
                        {aprPct > 0 && (
                          <p className="mb-2 whitespace-nowrap">
                            <span className="w-32 inline-block">APR:</span>
                            <span className="font-semibold">
                            {aprPct}% {stakeMonster && <span> +{stakeMonsterPct}%</span>}
                            </span>
                          </p>
                        )}

                        {totalStake > 0 && (
                          <p className="mb-2 whitespace-nowrap">
                            <span className="w-32 inline-block">Total Staked:</span>
                            <span className="font-semibold">
                            {convertFromYocto(totalStake, 2)} ZML
                          </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-4/12 mt-10 sm:mt-0 sm:flex sm:justify-end">
                    {stakeMonster ? (
                      <div className="text-center">
                        <div className="mb-2 font-semibold">Staked Monster</div>
                        <div className="mb-1 w-36 mx-auto">
                          <Card noMenu nft={stakeMonster} size="sm" />
                        </div>
                        <small
                          onClick={() => handleUnstakeMonster()}
                          className="border-dashed border-b cursor-pointer hover:text-sky-200"
                        >
                          unstake
                        </small>
                      </div>
                    ) : (
                      <div
                        className="lg:px-7 px-5 lg:py-10 py-4 text-left w-56 border-2 border-orange-500 hover:bg-black/30
                      transition cursor-pointer rounded-lg lg:text-base text-sm"
                        onClick={() => openMonsterPopup()}
                      >
                        <div className="text-center font-semibold">
                          Select Monster to get additional reward:
                        </div>
                        <ul className="mt-4 ml-3">
                          <li>Common: +2%</li>
                          <li>UnCommon: +5%</li>
                          <li>Rare: +12%</li>
                          <li>Epic: +27%</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-gray-800 my-6" />

                <div className="sm:flex lg:text-left text-center flex-row">
                  <div className="sm:w-1/2">
                    <h3 className="text-lg font-semibold uppercase">Deposit</h3>
                    <div className="mt-2">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={depositInput}
                        onChange={(e) => {
                          setDepositInput(e.target.value);
                        }}
                        className="px-3 w-52 py-2.5 rounded-md mr-2 bg-transparent border-indigo-500 text-indigo-100 border-2 mb-2 lg:mb-0"
                        placeholder="Token Amount"
                      />
                      <Button
                        secondary
                        title="Deposit"
                        onClick={() => handleDepositApprove()}
                      />
                    </div>

                    <div className="mt-2 text-sm opacity-40">
                      Balance:{" "}
                      <span
                        className="font-semibold border-dashed border-b cursor-pointer"
                        onClick={() => {
                          setDepositInput(
                            convertFromYocto(currentUser.tokenBalance, 2)
                          );
                        }}
                      >
                      {convertFromYocto(currentUser.tokenBalance, 2)} ZML
                    </span>
                    </div>
                  </div>

                  <div className="sm:w-1/2 sm:pl-10 mt-8 sm:mt-0">
                    <h3 className="text-lg font-semibold uppercase">Withdraw Staked</h3>
                    <div className="mt-2">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={withdrawInput}
                        onChange={(e) => {
                          setWithdrawInput(e.target.value);
                        }}
                        className="px-3 w-52 py-2.5 rounded-md mr-2 bg-transparent border-indigo-500 text-indigo-100 border-2 mb-2 lg:mb-0"
                        placeholder="Token Amount"
                      />

                      <Button
                        secondary
                        title="Withdraw"
                        onClick={() => handleWithdraw()}
                      />
                    </div>

                    <div className="mt-2 text-sm opacity-40">
                      Staked:{" "}
                      <span
                        className="font-semibold border-dashed border-b cursor-pointer"
                        onClick={() => {
                          setWithdrawInput(convertFromYocto(depositedBalance, 2));
                        }}
                      >
                      {convertFromYocto(depositedBalance, 2)} ZML
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Loader />
            )}

            <Popup
              title="Select Monster"
              width="sm:w-[816px]"
              popupVisible={monsterPopupVisible}
              setPopupVisible={setMonsterPopupVisible}
            >
              <div>
                {userMonsters.length > 0 ? (
                  <List>
                    {userMonsters.map((monster, index) => (
                      <div
                        className="cursor-pointer"
                        key={index}
                        onClick={() => selectMonster(monster)}
                      >
                        <Card nft={monster} size="sm" noMenu />
                      </div>
                    ))}
                  </List>
                ) : (
                  <div>You don't have Monsters.</div>
                )}
              </div>
            </Popup>

          </Container>
        </Wrapper>

        <Footer />
      </InnerPageWrapper>
    </>
  );
};
