import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { Container, Link, Row } from "../assets/styles/common.style";
import { convertFromYocto } from "../web3/utils";
import { Button } from "./basic/Button";
import { SocialLinks } from "./SocialLinks";
import { NavLinks } from "./header/NavLinks";
import { MobileNavLinks } from "./header/MobileNavLinks";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import leaderboard_icon from "../assets/images/leaderboard.png";

export const Header = () => {
  const currentUser = useSelector(state => state.user.user);
  const chainStatus = useSelector(state => state.chain.network);

  const [scroll, setScroll] = useState(false);
  const [isMobileOpened, setIsMobileOpened] = useState(false);

  const mobileMenuButton = (
    <>
      <button
        className="navbar-burger flex items-center text-sky-100 p-2"
        onClick={() => setIsMobileOpened(!isMobileOpened)}
      >
        {isMobileOpened ? (
          <XIcon className="w-7 h-7" />
        ) : (
          <MenuIcon className="w-7 h-7" />
        )}
      </button>
      <div
        className={`absolute right-0 top-12 bg-sky-100/95 text-gray-800 px-6 py-2 w-56 rounded-lg ${
          isMobileOpened ? "" : "hidden"
        }`}
        id="mobile-menu"
      >
        <MobileNavLinks
          setIsMobileOpened={setIsMobileOpened}
          onClickOutside={() => setIsMobileOpened(false)}
        />
      </div>
    </>
  );

  useEffect(() => {
    // Change header bg on scroll
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 60);
    });
  }, []);

  const switchNetworkToCorrect = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: process.env.CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: process.env.CHAIN_ID,
              chainName: process.env.CHAIN_NAME,
              rpcUrls: process.env.CHAIN_RPC_URL,
              blockExplorerUrls: [process.env.EXPLORER_URL],
              nativeCurrency: {
                symbol: process.env.TOKEN_SYMBOL,
                decimals: process.env.TOKEN_DECIMALS
              }
            }]
        });
      }
    }
  }

  return (
    <div
      className={`sticky top-0 z-40 py-5 transition ease-in-out duration-300 ${
        scroll ? "bg-main/95" : ""
      }`}
    >

      {chainStatus.isError && (
        <div className="py-2 bg-red-800 text-center fixed top-0 left-0 right-0 text-sm">
          {chainStatus.isError} <b>Game Network</b> doesn't match to network selected in wallet.
          Learn how to <a className="underline" target="_blank" href="https://dappradar.com/blog/guide-on-how-to-switch-network-in-metamask">change network in wallet</a>{" "}
          or click <Button title="Change Network" size="xxs" noIcon className="ml-1" onClick={() => switchNetworkToCorrect()} />
        </div>
      )}

      <Container className={`${chainStatus.isError ? "pt-8" : ""}`}>
        <Row className="justify-between">
          <Link to="/" className="flex flex-row hover:text-indigo-50">
            <img
              src={logo}
              alt="logo"
              width="40"
              className="basis-1/4 sm:max-w-[40px] max-w-[30px]"
            />
            <span
              className="zombie-font ml-4 sm:text-4xl text-2xl flex items-center font-normal hover:text-indigo-50 lg:hidden xl:flex">
              <span>ZOM</span>
              <span className="text-orange-500">LAND</span>
            </span>
          </Link>

          <div className="uppercase lg:ml-8 ml-4 hidden lg:block">
            <NavLinks currentUser={currentUser} />
          </div>

          {currentUser.accountId ? (
            <>
              <Link to="/leaderboard">
                <img src={leaderboard_icon} alt="leaderboard" className="h-7 mb-1" />
              </Link>

              <div className="flex flex-row">
                <div className="text-right">
                  <div className="w-40 xl:w-48 hover:text-indigo-200">
                    <Link to="/token">
                      <p className="truncate font-semibold">
                        {currentUser.accountId.slice(0, 5) + '...' + currentUser.accountId.slice(38, 42)}
                      </p>
                      {currentUser.tokenBalance !== null && (
                        <span className="font-bold text-orange-500 text-xl">
                                {convertFromYocto(currentUser.tokenBalance || 0, 2)} ZML
                              </span>
                      )}
                    </Link>
                  </div>
                </div>

                <div className="w-12 mt-1 sm:ml-4 lg:hidden relative">
                  {mobileMenuButton}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-row gap-4">
              <div className="mt-2 mr-2">
                <SocialLinks />
              </div>

              {process.env.IS_PROD === "true" ? (
                <div className="hidden sm:inline-flex">
                  <Button secondary noIcon title="Coming soon ..." />
                </div>
              ) : (
                <div className="hidden sm:inline-flex">
                  <Button secondary title="Log In" onClick={() => window.web3Login()} />
                </div>
              )}

              <div className="w-12 lg:hidden relative">{mobileMenuButton}</div>
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
};
