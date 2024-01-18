import { createSlice } from "@reduxjs/toolkit";
import { access } from "fs";

type AddScoreState = {
  score: number;
  highscore: number;
};

const initialState: AddScoreState = {
  score: 0,
  highscore: 0
};

export const addscore = createSlice({
  name: "addscore",
  initialState,
  reducers: {
    addScore: (state, action) => {
      state.score = state.score + action.payload;
      state.highscore = Math.max(state.highscore, state.score)
    },
    setScore: (state, action) => {
      state.score = action.payload
    },
  },
});

export const { addScore, setScore } = addscore.actions;
export default addscore.reducer;