import { createSlice } from "@reduxjs/toolkit";

const contractSlice = createSlice({
  name: "contracts",
  initialState: {
    contracts: {
      ftContract: null,
      landContract: null,
      zombieContract: null,
      monsterContract: null,
      collectionContract: null,
    }
  },
  reducers: {
    updateContract(state, action) {
      state.contracts[action.payload.name] = action.payload.contract;
    },
  }
});

export const { updateContract } = contractSlice.actions;
export default contractSlice.reducer;