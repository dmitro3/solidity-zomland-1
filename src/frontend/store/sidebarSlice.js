import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    kill: {
      zombies: [],
      monsters: [],
    }
  },
  reducers: {
    addForKill(state, action) {
      state.kill[action.payload.type].push(action.payload.item);
    },

    cleanupKillList(state, action) {
      state.kill[action.payload.type] = [];
    },

    removeFromKill(state, action) {
      state.kill[action.payload.type] = state.kill[action.payload.type].filter(item => item.tokenId !== action.payload.tokenId)
    }
  }
});

export const { addForKill, removeFromKill, cleanupKillList } = sidebarSlice.actions;
export default sidebarSlice.reducer;