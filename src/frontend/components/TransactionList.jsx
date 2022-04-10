import React from "react";
import loading from "../assets/images/loading.png";
import success from "../assets/images/success.png";
import error from "../assets/images/error.png";

export const TransactionList = ({
  txList
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
      <div className={`top-0 right-0 fixed w-[380px] p-2 z-50 translate-x-0`}>

        {txList.map((tx) => (
            <div className={`${statusColorMap[tx.status]} px-4 py-3 rounded-md mb-4 text-sm w-full flex flex-row`} key={tx.hash}>
              <div className="w-16">
                <img src={statusImageMap[tx.status]} alt="status" className={`w-8 h-8 ${tx.status === "pending" ? "rotate-image" : ""}`}/>
              </div>
              <div className="w-full">
                {tx.hash && (
                    <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">
                      {tx.hash.slice(0, 7) + '...' + tx.hash.slice(34, 42)}
                    </a>
                )}

                {tx.text && (
                    <div>
                      {tx.text}
                    </div>
                )}
              </div>
            </div>
        ))}

      </div>
  );
};
