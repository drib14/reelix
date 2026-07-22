import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: JSON.parse(localStorage.getItem("watchlist")) || [],
};

const watchlistSlice = createSlice({
  name: "watchlist",

  initialState,

  reducers: {
    addToWatchlist: (state, action) => {
      const exists = state.movies.find(
        (movie) => movie._id === action.payload._id
      );

      if (!exists) {
        state.movies.push(action.payload);

        localStorage.setItem(
          "watchlist",
          JSON.stringify(state.movies)
        );
      }
    },

    removeFromWatchlist: (state, action) => {
      state.movies = state.movies.filter(
        (movie) => movie._id !== action.payload
      );

      localStorage.setItem(
        "watchlist",
        JSON.stringify(state.movies)
      );
    },
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;