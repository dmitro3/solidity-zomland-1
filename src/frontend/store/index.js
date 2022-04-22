import { configureStore } from "@reduxjs/toolkit";
import transactionSlice from "./transactionSlice";
import userSlice from './userSlice';
import contractSlice from './contractSlice';

export default configureStore({
  reducer: {
    transactions: transactionSlice,
    user: userSlice,
    contracts: contractSlice,
  }
});