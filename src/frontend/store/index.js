import { configureStore } from "@reduxjs/toolkit";
import transactionSlice from "./transactionSlice";
import userSlice from './userSlice';
import marketSlice from './marketSlice';

export default configureStore({
  reducer: {
    transactions: transactionSlice,
    user: userSlice,
    market: marketSlice,
  }
});