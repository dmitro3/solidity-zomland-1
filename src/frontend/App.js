import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  //     Collections,
  //     ContactUs,
  //     Market,
  //     Monsters,
  //     OneCollection,
  Faq,
  Landing,
  Lands,
  Zombies,
  Terms,
  Privacy,
  //     Token,
} from "./pages";
import { Sidebar } from "./components/sidebar/Sidebar";
import { web3Handler, appendTransactionList, appendTransactionError, hideTransaction } from "./web3/api";
import { TransactionList } from "./components/TransactionList";

export default function App() {
  const [currentUser, setCurrentUser] = React.useState({});
  const [contract, setContract] = React.useState(false);
  const [ftContract, setFtContract] = React.useState(false);
  const [landContract, setLandContract] = React.useState(false);
  const [zombieContract, setZombieContract] = React.useState(false);
  const [tokenContract, setTokenContract] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [transactionList, setTransactionList] = React.useState([]);
  const [sellList, setSellList] = React.useState({
    lands: [],
    zombies: [],
    monsters: [],
  });
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  window.web3Login = () => {
    web3Handler()
      .then(async ({ account, signer, landContract, zombieContract, tokenContract }) => {
        const balance = await tokenContract.balanceOf(account);

        setCurrentUser({
          accountId: account,
          tokenBalance: balance,
        });
        setLandContract(landContract);
        setZombieContract(zombieContract);
        setTokenContract(tokenContract);

        window.ethereum.on("chainChanged", (chainId) => {
          console.log("chainChanged", chainId);
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", async function (accounts) {
          console.log("accountsChanged", accounts);
          const balance = await tokenContract.balanceOf(account);
          setCurrentUser({
            accountId: accounts[0],
            tokenBalance: balance,
          });
        });

        setIsReady(true);
      })
      .catch((err) => {
        console.log("ERR web3Handler", err);

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
      {isReady && (
        <>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Landing currentUser={currentUser} contract={contract}/>
              }
            />
            <Route
              exact
              path="/lands"
              element={
                <Lands
                  currentUser={currentUser}
                  contract={contract}
                  landContract={landContract}
                  sellList={sellList}
                  setSellList={setSellList}
                  appendTransactionList={(tx) => appendTransactionList(transactionList, setTransactionList, tx)}
                  appendTransactionError={(tx) => appendTransactionError(transactionList, setTransactionList, tx)}
                />
              }
            />
            <Route
              exact
              path="/zombies"
              element={
                <Zombies
                  currentUser={currentUser}
                  contract={contract}
                  zombieContract={zombieContract}
                  sellList={sellList}
                  setSellList={setSellList}
                />
              }
            />
            {/*  <Route*/}
            {/*    exact*/}
            {/*    path="/collections"*/}
            {/*    element={*/}
            {/*      <Collections currentUser={currentUser} contract={contract} />*/}
            {/*    }*/}
            {/*  />*/}
            {/*  <Route*/}
            {/*    exact*/}
            {/*    path="/collections/:collection_id"*/}
            {/*    element={*/}
            {/*      <OneCollection currentUser={currentUser} contract={contract} />*/}
            {/*    }*/}
            {/*  />*/}
            {/*  <Route*/}
            {/*    exact*/}
            {/*    path="/monsters"*/}
            {/*    element={*/}
            {/*      <Monsters*/}
            {/*        currentUser={currentUser}*/}
            {/*        contract={contract}*/}
            {/*        sellList={sellList}*/}
            {/*        setSellList={setSellList}*/}
            {/*      />*/}
            {/*    }*/}
            {/*  />*/}
            {/*  <Route*/}
            {/*    exact*/}
            {/*    path="/market"*/}
            {/*    element={<Market currentUser={currentUser} contract={contract} />}*/}
            {/*  />*/}
            {/*  <Route*/}
            {/*    exact*/}
            {/*    path="/token"*/}
            {/*    element={*/}
            {/*      <Token*/}
            {/*        currentUser={currentUser}*/}
            {/*        contract={contract}*/}
            {/*        ftContract={ftContract}*/}
            {/*      />*/}
            {/*    }*/}
            {/*  />*/}
            {/*  <Route*/}
            {/*    exact*/}
            {/*    path="/contact-us"*/}
            {/*    element={<ContactUs currentUser={currentUser} />}*/}
            {/*  />*/}
            <Route
              exact
              path="/faq"
              element={<Faq currentUser={currentUser} contract={contract}/>}
            />
            <Route
              exact
              path="/terms-conditions"
              element={<Terms currentUser={currentUser}/>}
            />
            <Route
              exact
              path="/privacy-policy"
              element={<Privacy currentUser={currentUser}/>}
            />
          </Routes>

          <Sidebar
            currentUser={currentUser}
            contract={contract}
            sellList={sellList}
            setSellList={setSellList}
            isOpen={sidebarIsOpen}
            setIsOpen={setSidebarIsOpen}
          />
          <TransactionList
            txList={transactionList}
            hideTransaction={(index) => hideTransaction(transactionList, setTransactionList, index)}/>
        </>
      )}
    </BrowserRouter>
  );
}
