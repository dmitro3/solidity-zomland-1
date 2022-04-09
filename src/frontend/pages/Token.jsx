import React, { useRef, useState } from "react";
import { convertFromYocto, convertToTera, convertToYocto } from "../near/utils";
import { TokenContent } from "../near/content";
import Big from "big.js";
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
import { FlipCard } from "../assets/styles/card";
import { FrontCard } from "../components/card/FrontCard";

export const Token = ({ currentUser, contract, ftContract }) => {
  const [depositInput, setDepositInput] = React.useState();
  const [userMonsters, setUserMonsters] = useState([0, []]);
  const [depositedBalance, setDepositedBalance] = React.useState(0);
  const [rewardBalance, setRewardBalance] = React.useState(0);
  const [aprPct, setAprPct] = React.useState();
  const [withdrawInput, setWithdrawInput] = React.useState();
  const [stakeMonster, setStakeMonster] = React.useState();
  const [totalStake, setTotalStake] = React.useState();
  const [stakeMonsterPct, setStakeMonsterPct] = React.useState(0);
  const [monsterPopupVisible, setMonsterPopupVisible] = useState(false);
  const [transferPopupVisible, setTransferPopupVisible] = useState(false);
  const [transferAddress, setTransferAddress] = useState();
  const [transferAmount, setTransferAmount] = useState();
  const [canTransfer, setCanTransfer] = useState(false);
  const funRef = useRef(null);

  React.useEffect(() => {
    getStakedMonster();
    updateEarnedRewards();
    updateDepositedAmount();
    updateTotalDeposit();
    updateStakeMonsterPct();
    updateAPR();

    if (localStorage.getItem("open_transfer_popup")) {
      localStorage.removeItem("open_transfer_popup");
      setTransferAddress(localStorage.getItem("transfer_address"));
      setCanTransfer(true);
      setTransferPopupVisible(true);
    }

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
    let earned = await ftContract.get_user_earned({
      account_id: currentUser.accountId,
    });
    setRewardBalance(earned);
  };

  const updateAPR = async () => {
    let apr = await ftContract.get_apr({
      account_id: currentUser.accountId,
    });
    setAprPct(apr);
  };

  const updateStakeMonsterPct = async () => {
    let pct = await ftContract.get_stake_monster_pct({
      account_id: currentUser.accountId,
    });
    setStakeMonsterPct(pct);
  };

  const getStakedMonster = async () => {
    let stakeMonster = await contract.is_stake_monster({
      user_id: currentUser.accountId,
    });
    setStakeMonster(stakeMonster);
  };

  const updateTotalDeposit = async () => {
    let totalStake = await ftContract.get_total_supply();
    setTotalStake(totalStake);
  };

  const openMonsterPopup = async () => {
    let requestParams = {
      account_id: currentUser.accountId,
      page_num: "1",
      page_limit: "50",
    };
    let monsters = await contract.user_monsters(requestParams);
    setUserMonsters(monsters);
    setMonsterPopupVisible(true);
  };

  const updateDepositedAmount = async () => {
    let deposited = await ftContract.get_user_stake({
      account_id: currentUser.accountId,
    });
    setDepositedBalance(deposited);
  };

  const selectMonster = async (monster) => {
    let gas = convertToTera("100");
    await contract.stake_monster(
      {
        monster_id: monster.token_id,
      },
      gas,
      1
    );
  };

  const handleDeposit = () => {
    let depositAmount = convertToYocto(depositInput.toString());
    if (
      parseInt(Big(currentUser.tokenBalance).toFixed()) <
      parseInt(Big(depositAmount).toFixed())
    ) {
      depositAmount = currentUser.tokenBalance;
    }
    if (depositInput < 1) {
      alert("Please set deposit amount");
      return false;
    }

    let gas = convertToTera("50");
    ftContract.ft_transfer_call(
      {
        receiver_id: ftContract.contractId,
        amount: depositAmount,
        msg: "ft_staking",
      },
      gas,
      1
    );
  };

  const handleUnstakeMonster = async () => {
    let gas = convertToTera("100");
    await contract.unstake_monster({}, gas, 1);
  };

  const handleWithdraw = () => {
    let withdrawAmount = convertToYocto(withdrawInput.toString());
    let gas = convertToTera("30");
    ftContract.withdraw_stake(
      {
        amount: withdrawAmount,
      },
      gas,
      1
    );
  };

  const handleWithdrawRewards = () => {
    ftContract.withdraw_reward();
  };

  const showTransferPopup = () => {
    setTransferPopupVisible(true);
  };

  const handleTransferToken = async () => {
    if (!transferAddress || transferAddress.length < 5) {
      alert("Please provide correct NEAR Address");
      return false;
    }
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      alert("Please provide correct ZML Amount");
      return false;
    }
    if (transferAddress === currentUser.accountId) {
      alert("Sender and receiver should be different");
      return false;
    }

    let withdraw = convertToYocto(transferAmount);
    if (withdraw > currentUser.tokenBalance) {
      withdraw = currentUser.tokenBalance;
    }

    let gas = convertToTera("20");
    await ftContract.ft_transfer(
      {
        receiver_id: transferAddress,
        amount: withdraw,
      },
      gas,
      1
    );
  };

  const handleApproveToken = async () => {
    if (transferAddress && transferAddress.length > 4) {
      let deposit = convertToYocto("0.01");
      let gas = convertToTera("20");

      let isStakeBalance = await ftContract.storage_balance_of({
        account_id: transferAddress
      });
      if (isStakeBalance && isStakeBalance.total > 0) {
        setCanTransfer(true);
      } else {
        localStorage.setItem("open_transfer_popup", "true");
        localStorage.setItem("transfer_address", transferAddress);
        await ftContract.ft_mint(
          {
            receiver_id: transferAddress,
            amount: "0",
          },
          gas,
          deposit
        );
      }
    } else {
      alert("Please, provide correct NEAR Address")
    }
  };

  const setMaxTokens = () => {
    setTransferAmount(convertFromYocto(currentUser.tokenBalance, 2));
  };

  return (
    <>
      <InnerPageWrapper>
        <Header currentUser={currentUser} />

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
                      {currentUser.tokenBalance > 0 && (
                        <span
                          className="ml-3 border-dashed border-b cursor-pointer text-sky-200"
                          onClick={() => showTransferPopup()}
                        >
                        transfer
                      </span>
                      )}
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
                      {aprPct && (
                        <p className="mb-2 whitespace-nowrap">
                          <span className="w-32 inline-block">APR:</span>
                          <span className="font-semibold">
                        {aprPct}%{" "}
                            {stakeMonster && <span> +{stakeMonsterPct}%</span>}
                      </span>
                        </p>
                      )}

                      {totalStake && (
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
                      onClick={() => handleDeposit()}
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
                        key={monster.token_id}
                        onClick={() => selectMonster(monster)}
                      >
                        <Card nft={monster} key={index} size="sm" noMenu />
                      </div>
                    ))}
                  </List>
                ) : (
                  <div>You don't have Monsters.</div>
                )}
              </div>
            </Popup>

            <Popup
              title="Transfer ZML Token"
              width="sm:w-[700px]"
              popupVisible={transferPopupVisible}
              setPopupVisible={setTransferPopupVisible}
            >
              <div className="mt-2 px-6 flex flex-row">
                <div className="text-center mx-auto mb-4">
                  <p className="mb-6 mt-2">
                    You can transfer this NFT to any NEAR account.
                  </p>
                  <p className="mb-3">
                    <input
                      type="text"
                      className="px-4 py-2 w-full rounded-md bg-transparent border-indigo-500 text-indigo-100 border-2"
                      placeholder="NEAR Address"
                      value={transferAddress}
                      onChange={(e) => {
                        setTransferAddress(e.target.value);
                        setCanTransfer(false);
                      }}
                    />
                  </p>

                  {canTransfer && (
                    <p className="mb-5 relative">
                      <input
                        type="number"
                        className="px-4 py-2 w-full rounded-md bg-transparent border-indigo-500 text-indigo-100 border-2"
                        placeholder="ZML Amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                      <span
                        className="absolute right-[-55px] top-0.5 p-2 cursor-pointer"
                        onClick={() => setMaxTokens()}
                      >
                      MAX
                    </span>
                    </p>
                  )}

                  <div className="flex flex-row justify-between">
                    <span>
                      {!canTransfer && (<Button
                        title="Approve"
                        noIcon
                        secondary
                        onClick={() => handleApproveToken()}
                      />)}
                    </span>

                    <Button
                      title="Transfer"
                      disabled={!canTransfer}
                      onClick={() => handleTransferToken(transferAddress)}
                    />
                  </div>
                </div>
              </div>
            </Popup>
          </Container>
        </Wrapper>

        <Footer />
      </InnerPageWrapper>
    </>
  );
};
