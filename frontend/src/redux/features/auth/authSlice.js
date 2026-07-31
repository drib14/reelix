import { createSlice } from "@reduxjs/toolkit";

const getStoredUserInfo = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  if (expirationTime && new Date().getTime() > Number(expirationTime)) {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expirationTime");
    return null;
  }

  const stored = localStorage.getItem("userInfo");
  return stored ? JSON.parse(stored) : null;
};

const initialState = {
  userInfo: getStoredUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", expirationTime);
    },

    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
