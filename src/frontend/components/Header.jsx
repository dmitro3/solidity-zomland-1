import React, {useEffect, useState} from "react";
import logo from "../assets/images/logo.png";
import {Container, Link, Row} from "../assets/styles/common.style";
import {convertFromYocto} from "../near/utils";
import {login, logout} from "../web3/api";
import {Button} from "./basic/Button";
import {SocialLinks} from "./SocialLinks";
import {NavLinks} from "./header/NavLinks";
import {MobileNavLinks} from "./header/MobileNavLinks";
import {MenuIcon, XIcon} from "@heroicons/react/outline";

export const Header = ({currentUser}) => {
  const [scroll, setScroll] = useState(false);
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [isMobileOpened, setIsMobileOpened] = useState(false);

  const mobileMenuButton = (
      <>
        <button
            className="navbar-burger flex items-center text-sky-100 p-2"
            onClick={() => setIsMobileOpened(!isMobileOpened)}
        >
          {isMobileOpened ? (
              <XIcon className="w-7 h-7"/>
          ) : (
              <MenuIcon className="w-7 h-7"/>
          )}
        </button>
        <div
            className={`absolute right-0 top-12 bg-sky-100/95 text-gray-800 px-6 py-2 w-56 rounded-lg ${
                isMobileOpened ? "" : "hidden"
            }`}
            id="mobile-menu"
        >
          <MobileNavLinks
              currentUser={currentUser}
              setIsMobileOpened={setIsMobileOpened}
              onClickOutside={() => setIsMobileOpened(false)}
              login={login}
              logout={logout}
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

  useEffect(() => {
    setUserTokenBalance(currentUser.tokenBalance || 0);
  }, [currentUser]);

  return (
      <div
          className={`sticky top-0 z-30 py-5 transition ease-in-out duration-300 ${
              scroll ? "bg-main/95" : ""
          }`}
      >
        <Container>
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
              <NavLinks currentUser={currentUser}/>
            </div>

            {currentUser.accountId ? (
                <>
                  <div className="flex flex-row">
                    <div className="text-right">
                      <div className="mr-6 xl:mr-10 w-36 xl:w-40 hover:text-indigo-200">
                        <Link to="/token">
                          <p className="truncate text-sm font-semibold">
                            {currentUser.accountId.slice(0, 5) + '...' + currentUser.accountId.slice(38, 42)}
                          </p>
                          {userTokenBalance != null && (
                              <span className="font-bold text-orange-500 text-xl">
                                                  {convertFromYocto(userTokenBalance, 2)} ZML
                                                </span>
                          )}
                        </Link>
                      </div>
                    </div>

                    <div className="pt-1 hidden sm:inline-flex">
                      <Button secondary title="Log Out" onClick={logout}/>
                    </div>

                    <div className="w-12 mt-1 sm:ml-4 lg:hidden relative">
                      {mobileMenuButton}
                    </div>
                  </div>
                </>
            ) : (
                <div className="flex flex-row gap-4">
                  <div className="mt-2 mr-2">
                    <SocialLinks/>
                  </div>

                  {process.env.IS_PROD === "true" ? (
                      <div className="hidden sm:inline-flex">
                        <Button secondary noIcon title="Coming soon ..."/>
                      </div>
                  ) : (
                      <div className="hidden sm:inline-flex">
                        <Button secondary title="Log In" onClick={login}/>
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
