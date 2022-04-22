import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    list: []
  },
  reducers: {
    addTransaction(state, action) {
      state.list.push({
        id: action.payload.id,
        hash: action.payload.hash,
        message: action.payload.message || "",
        status: "pending"
      })
    },

    addTransactionError(state, action) {
      state.list.push({
        id: action.payload.id,
        hash: null,
        message: action.payload.message || "",
        status: "error"
      });

      // setTimeout(() => {
      //   transactionSlice.caseReducers.removeTransaction(state, action);
      // }, 3000);
    },

    updateTransaction(state, action) {
      const transaction = state.list.find(tx => tx.hash === action.payload.hash);
      transaction.status = action.payload.status;

      // setTimeout(() => {
      //   transactionSlice.caseReducers.removeTransaction(state, action);
      // }, 3000);
    },

    removeTransaction(state, action) {
      console.log('removeTransaction', action.payload);
      state.list = state.list.filter(tx => tx.id !== action.payload.id)
    },
  }
});

export const { addTransaction, addTransactionError, updateTransaction, removeTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;