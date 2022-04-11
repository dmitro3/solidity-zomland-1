import React from "react";
import loading from "../assets/images/loading.png";
import success from "../assets/images/success.png";
import error from "../assets/images/error.png";
import {XIcon} from '@heroicons/react/outline';

export const TransactionList = ({
  txList,
  hideTransaction
}) => {

  const statusColorMap = {
    pending: "bg-gray-800",
    success: "bg-green-800",
    error: "bg-red-800",
  }
  const statusImageMap = {
    pending: loading,
    success: success,
    error: error,
  }

  return (
      <div className={`top-0 right-0 fixed w-[380px] px-3 py-2 z-50 translate-x-0`}>

        {txList.map((tx, txIndex) => (
            <div className={`${statusColorMap[tx.status]} px-4 py-3 rounded-md mb-4 text-sm w-full flex flex-row`} key={tx.hash}>
              <div className="w-14">
                <img src={statusImageMap[tx.status]} alt="status"
                     className={`mt-1 w-8 h-8 ${tx.status === "pending" ? "rotate-image" : ""}`}/>
              </div>

              <div className="w-full relative">
                <div className="absolute top-0 right-0" onClick={() => hideTransaction(txIndex)}>
                  <XIcon className="h-4 w-4 fill-red-500 hover:fill-red-700 cursor-pointer transition duration-200"/>
                </div>

                {tx.hash && (
                    <a href={`${process.env.EXPLORER_URL}/tx/${tx.hash}`} target="_blank">
                      Transaction: {tx.hash.slice(0, 7) + '...' + tx.hash.slice(32, 42)}
                    </a>
                )}

                {tx.message && (
                    <div className="font-semibold">
                      {tx.message}
                    </div>
                )}
              </div>
            </div>
        ))}

      </div>
  );
};
