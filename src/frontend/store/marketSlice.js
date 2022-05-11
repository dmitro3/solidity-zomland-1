import { createSlice } from "@reduxjs/toolkit";

const marketSlice = createSlice({
  name: "market",
  initialState: {
    sale: {
      zombies: [],
      lands: [],
      monsters: [],
    }
  },
  reducers: {
    addForSale(state, action) {
      state.sale[action.payload.type].push(action.payload.item);
    },

    changePrice(state, action) {
      state.sale[action.payload.type] = state.sale[action.payload.type].map(item => {
        if (item.tokenId === action.payload.tokenId) {
          item.salePrice = action.payload.price;
        }
        return item;
      })
    },

    cleanupSaleList(state, action) {
      state.sale[action.payload.type] = [];
    },

    removeFromSale(state, action) {
      state.sale[action.payload.type] = state.sale[action.payload.type].filter(item => item.tokenId !== action.payload.tokenId)
    }
  }
});

export const { addForSale, removeFromSale, changePrice, cleanupSaleList } = marketSlice.actions;
export default marketSlice.reducer;