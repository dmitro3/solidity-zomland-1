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
        status: action.payload.status || "pending"
      })
    },

    updateTransaction(state, action) {
      const transaction = state.list.find(tx => tx.id === action.payload.id);
      if (transaction) {
        transaction.status = action.payload.status;
      }
    },

    removeTransaction(state, action) {
      console.log('removeTransaction', action.payload);
      state.list = state.list.filter(tx => tx.id !== action.payload.id)
    },
  }
});

export const { addTransaction, updateTransaction, removeTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;