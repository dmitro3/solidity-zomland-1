import React from "react";
import loading from "../assets/images/loading.png";
import success from "../assets/images/success.png";
import error from "../assets/images/error.png";
import { XIcon } from '@heroicons/react/outline';
import { useSelector, useDispatch } from 'react-redux';
import { removeTransaction } from '../store/transactionSlice';

export const TransactionList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transactions.list);

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

  const hideTransaction = (id) => {
    dispatch(removeTransaction({ id }));
  }

  return (
    <div className={`top-0 right-0 fixed w-[400px] mx-3 my-4 z-50 translate-x-0`}>

      {transactions.map(tx => (
        <div className={`${statusColorMap[tx.status]} px-4 py-3 rounded-md mb-4 text-sm w-full flex flex-row shadow-lg`} key={tx.id}>
          <div className="w-14">
            <img src={statusImageMap[tx.status]} alt="status"
                 className={`w-8 h-8 ${tx.status === "pending" ? "rotate-image" : ""}`}/>
          </div>

          <div className="w-full relative">
            <div className="absolute top-0 right-0" onClick={() => hideTransaction(tx.id)}>
              <XIcon className="h-4 w-4 fill-red-500 hover:fill-red-700 cursor-pointer transition duration-200"/>
            </div>

            {tx.hash && (
              <a href={`${process.env.EXPLORER_URL}/tx/${tx.hash}`} target="_blank">
                Transaction: {tx.hash.slice(0, 7) + '...' + tx.hash.slice(32, 42)}
              </a>
            )}

            {tx.message && (
              <div className={`font-semibold ${tx.hash ? "" : "mt-1"}`}>
                {tx.message}
              </div>
            )}
          </div>
        </div>
      ))}

    </div>
  );
};
