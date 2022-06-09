import { createSlice } from "@reduxjs/toolkit";

const chainSlice = createSlice({
  name: "chain",
  initialState: {
    network: {
      isError: false,
    }
  },
  reducers: {
    setIsChainError(state, action) {
      state.network.isError = action.payload.isError;
    },
  }
});

export const { setIsChainError } = chainSlice.actions;
export default chainSlice.reducer;
