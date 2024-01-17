import { createSlice } from "@reduxjs/toolkit";

type AddScoreState = {
  score: number;
};

const initialState: AddScoreState = {
  score: 0,
};

export const addscore = createSlice({
  name: "addscore",
  initialState,
  reducers: {
    addScore: (state, action) => {
      state.score = state.score + action.payload;
    },
  },
});

export const { addScore } = addscore.actions;
export default addscore.reducer;