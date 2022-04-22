import React, { useRef, useState } from "react";
import { convertFromYocto, convertToYocto } from "../web3/utils";
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
import { addTransaction, addTransactionError } from '../store/transactionSlice';
import { updateUserBalance } from '../web3/api';

export const Token = ({ contract, ftContract }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.user);

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
    // getStakedMonster();
    // updateStakeMonsterPct();

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
    let earned = await ftContract.earned(currentUser.accountId);
    setRewardBalance(parseInt(earned));
  };

  const updateAPR = async () => {
    let apr = await ftContract.getAPR();
    setAprPct(parseInt(apr));
  };

  // const updateStakeMonsterPct = async () => {
  //   let pct = await ftContract.getStakeMonsterPct(currentUser.accountId);
  //   setStakeMonsterPct(pct);
  // };

  // const getStakedMonster = async () => {
  //   let stakeMonster = await ftContract.isStakeMonster(currentUser.accountId);
  //   setStakeMonster(stakeMonster);
  // };

  const openMonsterPopup = async () => {
    // let requestParams = {
    //   account_id: currentUser.accountId,
    //   page_num: "1",
    //   page_limit: "50",
    // };
    // let monsters = await contract.user_monsters(requestParams);
    // setUserMonsters(monsters);
    // setMonsterPopupVisible(true);
  };

  const selectMonster = async (monster) => {
    // let gas = convertToTera("100");
    // await contract.stake_monster();
  };

  const updateTotalDeposit = async () => {
    let totalStake = await ftContract.stakingTotalSupply();
    setTotalStake(parseInt(totalStake));
  };

  const updateDepositedAmount = async () => {
    let deposited = await ftContract.myBalance();
    setDepositedBalance(deposited);
  };

  const handleDepositApprove = async () => {
    let depositAmount = convertToYocto(depositInput.toString());
    if (
      BigNumber.from(currentUser.tokenBalance) <
      BigNumber.from(depositAmount)
    ) {
      depositAmount = currentUser.tokenBalance;
    }
    if (depositAmount <= 1) {
      alert("Please provide correct Deposit amount");
      return false;
    }

    handleDeposit(depositAmount);
    // let allowedAmount = await ftContract.allowance(ftContract.address, currentUser.accountId);
    // if (parseInt(allowedAmount) < depositAmount) {
    //   await ftContract.approve(currentUser.accountId, depositAmount).then(transaction => {
    //     transaction.message = "Approve ZML for staking";
    //     appendTransactionList(transaction);
    //     transaction.wait().then(async receipt => {
    //       if (receipt.status === 1) {
    //         console.log('Approved');
    //         handleDeposit(depositAmount);
    //       } else {
    //         appendTransactionError("Approve transaction Failed");
    //       }
    //     });
    //   }).catch(err => {
    //     appendTransactionError(err.message);
    //   });
    // } else {
    //   handleDeposit(depositAmount);
    // }
  };

  const handleDeposit = async (depositAmount) => {
    await ftContract.stake(depositAmount).then(transaction => {
      dispatch(addTransaction({
        id: new Date().toISOString(),
        hash: transaction.hash,
        message: "Deposit ZML to staking",
      }));

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          dispatch(updateTransaction({
            hash: transaction.hash,
            status: "success"
          }))
          updateDepositedAmount();
          updateTotalDeposit();
          updateUserBalance(ftContract, currentUser.accountId);
          setDepositInput(0);
        }
      });
    }).catch(err => {
      dispatch(addTransactionError({
        id: new Date().toISOString(),
        message: err.message
      }));
    });
  };

  const handleUnstakeMonster = async () => {
    // let gas = convertToTera("100");
    // await contract.unstake_monster({}, gas, 1);
  };

  const handleWithdraw = async () => {
    let withdrawAmount = convertToYocto(withdrawInput.toString());
    console.log(withdrawAmount);
    await ftContract.withdraw(withdrawAmount).then(transaction => {
      dispatch(addTransaction({
        id: new Date().toISOString(),
        hash: transaction.hash,
        message: "Withdraw ZML tokens",
      }));

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          updateDepositedAmount();
          updateTotalDeposit();
          updateUserBalance(ftContract, currentUser.accountId);
          setWithdrawInput(0);
        }
      });
    }).catch(err => {
      dispatch(addTransactionError({
        id: new Date().toISOString(),
        message: err.message
      }));
    });
  };

  const handleWithdrawRewards = async () => {
    await ftContract.getReward().then(transaction => {
      dispatch(addTransaction({
        id: new Date().toISOString(),
        hash: transaction.hash,
        message: "Claim ZML Rewards",
      }));

      transaction.wait().then(receipt => {
        if (receipt.status === 1) {
          updateEarnedRewards();
          updateUserBalance(ftContract, currentUser.accountId);
        }
      });
    }).catch(err => {
      dispatch(addTransactionError({
        id: new Date().toISOString(),
        message: err.message
      }));
    });
  };

  // const checkApprovedAmount = async (amount) => {
  //   let allowed = await ftContract.allowance(ftContract.address, currentUser.accountId);
  //   setIsDepositApproved(parseInt(allowed) >= parseInt(convertToYocto(amount)));
  // };

  const setMaxTokens = () => {
    setTransferAmount(convertFromYocto(currentUser.tokenBalance, 2));
  };

  return (
    <>
      <InnerPageWrapper>
        <Header currentUser={currentUser}/>

        <Wrapper>
          <Container className="text-white text-center mt-6">
            <InnerPageHead
              title={TokenContent.title}
              description={TokenContent.description}
            />

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
                        {aprPct}%{" "}
                            {stakeMonster && <span> +{stakeMonsterPct}%</span>}
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
                        <Card noMenu nft={stakeMonster} size="sm"/>
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

              <hr className="border-gray-800 my-6"/>

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

            <Popup
              title="Select Monster"
              width="sm:w-[816px]"
              popupVisible={monsterPopupVisible}
              setPopupVisible={setMonsterPopupVisible}
            >
              <div>
                {userMonsters[0] > 0 ? (
                  <List>
                    {userMonsters[1]?.map((monster, index) => (
                      <div
                        className="cursor-pointer"
                        key={monster.tokenId}
                        onClick={() => selectMonster(monster)}
                      >
                        <Card nft={monster} key={index} size="sm" noMenu/>
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

        <Footer/>
      </InnerPageWrapper>
    </>
  );
};
