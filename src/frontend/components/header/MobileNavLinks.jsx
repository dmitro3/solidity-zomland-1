import React, { useEffect, useRef } from "react";
import { Link } from "../../assets/styles/common.style";
import {
  animateScroll,
  Link as ScrollLink
} from "react-scroll";

export const MobileNavLinks = ({ currentUser, setIsMobileOpened, onClickOutside, login }) => {
  const ref = useRef(null);

  const toggleHome = () => {
    animateScroll.scrollToTop();
  };

  const scrollProps = {
    activeClass: "text-sky-600",
    smooth: true,
    duration: 500,
    spy: true,
    exact: "true",
    offset: -100,
  };

  const menuItem = "cursor-pointer border-b font-semibold border-gray-300 border-dashed last:border-transparent my-2 pb-1";
  const menuLink = "block hover:text-sky-600";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <>
      {currentUser ? (
        <ul ref={ref}>
          <li className={menuItem}>
            <Link className={menuLink} to="/lands"
                  onClick={() => setIsMobileOpened(false)}>Lands</Link>
          </li>
          <li className={menuItem}>
            <Link className={menuLink} to="/zombies"
                  onClick={() => setIsMobileOpened(false)}>Zombies</Link>
          </li>
          <li className={menuItem}>
            <Link className={menuLink} to="/collections"
                  onClick={() => setIsMobileOpened(false)}>Collections</Link>
          </li>
          <li className={menuItem}>
            <Link className={menuLink} to="/monsters"
                  onClick={() => setIsMobileOpened(false)}>Monsters</Link>
          </li>
          <li className={menuItem}>
            <Link className={menuLink} to="/market"
                  onClick={() => setIsMobileOpened(false)}>Market</Link>
          </li>
          <li className={menuItem}>
            <Link className={menuLink} to="/token"
                  onClick={() => setIsMobileOpened(false)}>Staking</Link>
          </li>
          <li className={menuItem}>
            <Link className={menuLink} to="/faq"
                  onClick={() => setIsMobileOpened(false)}>FAQ</Link>
          </li>
        </ul>
      ) : (
        <ul ref={ref}>
          <li className={menuItem}>
            <div className={menuLink} onClick={login}>Login</div>
          </li>
          <li className={menuItem}>
            <ScrollLink className={menuLink}
                        to="/"
                        onClick={() => {
                          setIsMobileOpened(false);
                          toggleHome();
                        }}>Home</ScrollLink>
          </li>
          <li className={menuItem}>
            <ScrollLink className={menuLink}
                        to="how_to_play"
                        {...scrollProps}
                        onClick={() => setIsMobileOpened(false)}
            >How to Play</ScrollLink></li>
          <li className={menuItem}>
            <ScrollLink className={menuLink}
                        to="tokenomic"
                        {...scrollProps}
                        onClick={() => setIsMobileOpened(false)}
            >Tokenomic</ScrollLink>
          </li>
          <li className={menuItem}>
            <ScrollLink className={menuLink}
                        to="roadmap"
                        {...scrollProps}
                        onClick={() => setIsMobileOpened(false)}
            >Roadmap</ScrollLink>
          </li>
          <li className={menuItem}>
            <ScrollLink className={menuLink}
                        to="contact_us"
                        {...scrollProps}
                        onClick={() => setIsMobileOpened(false)}
            >Contact Us</ScrollLink>
          </li>
        </ul>
      )}
    </>
  );
};
