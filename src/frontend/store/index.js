import { configureStore } from "@reduxjs/toolkit";
import transactionSlice from "./transactionSlice";
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    transactions: transactionSlice,
    user: userSlice,
  }
});