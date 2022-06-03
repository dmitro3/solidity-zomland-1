import { configureStore } from "@reduxjs/toolkit";
import transactionSlice from "./transactionSlice";
import userSlice from './userSlice';
import marketSlice from './marketSlice';
import sidebarSlice from './sidebarSlice';

export default configureStore({
  reducer: {
    transactions: transactionSlice,
    user: userSlice,
    market: marketSlice,
    sidebar: sidebarSlice,
  }
});