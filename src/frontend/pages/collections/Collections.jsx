import React, { useEffect, useState } from "react";
import { CollectionContent } from "../../web3/content";
import { getMedia, transformCollections } from "../../web3/utils";
import {
  Col,
  Container,
  InnerPageWrapper,
  Link,
  Wrapper,
} from "../../assets/styles/common.style";
import { InnerPageHead } from "../../components/InnerPageHead";
import { Header } from "../../components/Header";
import { Loader } from "../../components/basic/Loader";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/basic/Button";

export const Collections = ({ currentUser, contract, zombieContract }) => {
  const [allCollections, setAllCollections] = useState([]);
  // const [userCollectionCount, setUserCollectionCount] = useState({});
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    async function fetchCollections() {
      let collectionsObj1 = await zombieContract.collections(0);
      let collectionsObj2 = await zombieContract.collections(1);
      let collection1 = transformCollections(collectionsObj1, 0);
      let collection2 = transformCollections(collectionsObj2, 1);
      setAllCollections([collection1, collection2]);
      setIsReady(true);
    }

    fetchCollections();
  }, []);

  return (
    <>
      <InnerPageWrapper>
        <Header currentUser={currentUser}/>

        <Wrapper>
          <Container className="text-white text-center mt-6">
            <InnerPageHead
              title={CollectionContent.title}
              description={CollectionContent.description}
            />

            {isReady ? (
              <div className="flex flex-row flex-wrap text-left">
                {allCollections.map((collection) => (
                  <div
                    className="lg:basis-1/2 lg:my-6 my-5 flex sm:gap-8 gap-5"
                    key={collection.id}
                  >
                    <Link
                      to={`/collections/${collection.id}`}
                      className="w-1/3 bg-[#0e0737]"
                    >
                      <img
                        src={getMedia(collection.image)}
                        alt={`collection #${collection.id}`}
                        className="bg-cover max-h-full max-w-full border-4 rounded-xl border-gray-500"
                      />
                    </Link>
                    <div className="w-2/3">
                      <p className="text-2xl sm:mb-4 mb-1 sm:mt-4 font-semibold">
                        {collection.title}
                      </p>
                      {/* <div className="font-semibold">
                        Your zombies: {userCollectionCount[collection.id] ?? 0}
                      </div> */}
                      <div className="sm:pr-16 pr-8 mb-5 mt-1 text-sm font-normal">
                        To get this Monster you need 10 unique zombies from this
                        collection.{" "}
                        <span className="lg:hidden inline">
                          Result monster will have characteristics based on
                          monsters that you select for minting.
                        </span>
                      </div>
                      <Link to={`/collections/${collection.id}`}>
                        <Button title="Open Collection" size="sm"/>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Loader/>
            )}
          </Container>
        </Wrapper>

        <Footer/>
      </InnerPageWrapper>
    </>
  );
};
