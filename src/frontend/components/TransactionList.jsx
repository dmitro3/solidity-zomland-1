import React from "react";

export const TransactionList = ({
  txList
}) => {

  return (
      <div className={`top-0 right-0 fixed w-[360px] p-2 z-50 translate-x-0`}>

        {txList.map((tx) => (
            <div className="bg-gray-800 px-4 py-3 rounded-md mb-4 text-sm w-full" key={tx.hash}>
              {tx.hash} | {tx.status}
            </div>
        ))}

      </div>
  );
};
