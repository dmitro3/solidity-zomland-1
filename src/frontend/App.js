import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Market,
  Monsters,
  Faq,
  Landing,
  Lands,
  Zombies,
  Terms,
  Privacy,
  Token,
  Collections,
  OneCollection,
} from "./pages";
import {
  web3Handler,
  isMetamaskInstalled,
  updateUserAccount,
  checkNetwork,
} from "./web3/api";
import { Sidebar } from "./components/sidebar/Sidebar";
import { TransactionList } from "./components/TransactionList";
import { useDispatch, useSelector } from "react-redux";
import { addTransactionError } from './web3/utils';
import { setIsChainError } from './store/chainSlice';

export default function App() {
  const dispatch = useDispatch();
  const sellList = useSelector(state => state.market.sale);

  const [isReady, setIsReady] = React.useState(false);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  window.web3Login = () => {

    // Check network
    if (isMetamaskInstalled()) {
      checkNetwork().then(isCorrect => {
        dispatch(setIsChainError({ isError: !isCorrect }));
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    web3Handler()
      .then(
        async ({ account }) => {
          await updateUserAccount(dispatch, account);

          window.ethereum.on("accountsChanged", (accounts) => {
            console.log("accountsChanged", accounts);
            updateUserAccount(dispatch, accounts[0]);
          });

          setIsReady(true);
        }
      )
      .catch(() => {
        if (!isMetamaskInstalled()) {
          addTransactionError(dispatch, "Please install Metamask.")
        }

        let allowPathList = [
          "/",
          "/terms-conditions",
          "/privacy-policy",
          "/faq",
        ];
        if (allowPathList.indexOf(window.location.pathname) === -1) {
          window.location.href = "/";
        } else {
          setIsReady(true);
        }
      });
  };

  React.useEffect(() => {
    window.web3Login();
  }, []);

  React.useEffect(() => {
    setSidebarIsOpen(true);
  }, [sellList]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Landing />
          }
        />
        {isReady && (
          <>
            <Route
              exact
              path="/lands"
              element={
                <Lands />
              }
            />
            <Route
              exact
              path="/zombies"
              element={
                <Zombies />
              }
            />
            <Route
              exact
              path="/collections"
              element={
                <Collections />
              }
            />
            <Route
              exact
              path="/collections/:collection_id"
              element={
                <OneCollection />
              }
            />
            <Route
              exact
              path="/monsters"
              element={
                <Monsters />
              }
            />
            <Route
              exact
              path="/market"
              element={<Market />}
            />
            <Route
              exact
              path="/market/:section"
              element={<Market />}
            />
            <Route
              exact
              path="/token"
              element={
                <Token />
              }
            />
          </>
        )}

        <Route
          exact
          path="/faq"
          element={<Faq />}
        />
        <Route
          exact
          path="/terms-conditions"
          element={<Terms />}
        />
        <Route
          exact
          path="/privacy-policy"
          element={<Privacy />}
        />
      </Routes>

      <Sidebar
        isOpen={sidebarIsOpen}
        setIsOpen={setSidebarIsOpen}
      />
      <TransactionList />
    </BrowserRouter>
  );
}
