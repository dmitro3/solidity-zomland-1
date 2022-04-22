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
import { Sidebar } from "./components/sidebar/Sidebar";
import {
  web3Handler,
  isMetamaskInstalled, updateUserBalance,
} from "./web3/api";
import { TransactionList } from "./components/TransactionList";
import { useDispatch, useSelector } from "react-redux";
import { addTransactionError } from './store/transactionSlice';
import { setUserAccountId } from './store/userSlice';
import { updateContract } from './store/contractSlice';

export default function App() {
  const dispatch = useDispatch();
  const contracts = useSelector(state => state.contracts.contracts);

  const [isReady, setIsReady] = React.useState(false);
  const [sellList, setSellList] = React.useState({
    lands: [],
    zombies: [],
    monsters: [],
  });

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  window.web3Login = () => {
    web3Handler()
      .then(
        ({
          account,
          landContract,
          zombieContract,
          monsterContract,
          tokenContract,
          collectionContract
        }) => {

          updateContract({
            name: "landContract",
            contract: landContract
          });
          updateContract({
            name: "zombieContract",
            contract: zombieContract
          });
          updateContract({
            name: "monsterContract",
            contract: monsterContract
          });
          updateContract({
            name: "tokenContract",
            contract: tokenContract
          });
          updateContract({
            name: "collectionContract",
            contract: collectionContract
          });


          console.log('contracts.tokenContract', contracts.tokenContract);
          dispatch(setUserAccountId({ account }));
          updateUserBalance(contracts.tokenContract, account);

          window.ethereum.on("chainChanged", (chainId) => {
            console.log("chainChanged", chainId);
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", (accounts) => { // async?
            console.log("accountsChanged", accounts);
            const account = accounts[0];
            dispatch(setUserAccountId({ account }));
            updateUserBalance(contracts.tokenContract, account);
          });

          setIsReady(true);
        }
      )
      .catch(() => {
        if (!isMetamaskInstalled()) {
          dispatch(addTransactionError({
            id: new Date().toISOString(),
            message: "Please install Metamask."
          }))
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
            <Landing/>
          }
        />

        {isReady && (
          <>
            <Route
              exact
              path="/lands"
              element={
                <Lands
                  sellList={sellList}
                  setSellList={setSellList}
                />
              }
            />
            <Route
              exact
              path="/zombies"
              element={
                <Zombies
                  sellList={sellList}
                  setSellList={setSellList}
                />
              }
            />
            <Route
              exact
              path="/collections"
              element={
                <Collections/>
              }
            />
            <Route
              exact
              path="/collections/:collection_id"
              element={
                <OneCollection/>
              }
            />
            <Route
              exact
              path="/monsters"
              element={
                <Monsters
                  sellList={sellList}
                  setSellList={setSellList}
                />
              }
            />
            <Route
              exact
              path="/market"
              element={<Market/>}
            />
            <Route
              exact
              path="/token"
              element={
                <Token/>
              }
            />
          </>
        )}

        <Route
          exact
          path="/faq"
          element={<Faq/>}
        />
        <Route
          exact
          path="/terms-conditions"
          element={<Terms/>}
        />
        <Route
          exact
          path="/privacy-policy"
          element={<Privacy/>}
        />
      </Routes>

      <Sidebar
        sellList={sellList}
        setSellList={setSellList}
        isOpen={sidebarIsOpen}
        setIsOpen={setSidebarIsOpen}
      />
      <TransactionList/>
    </BrowserRouter>
  );
}
