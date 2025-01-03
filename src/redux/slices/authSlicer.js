import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../actions/authActions";
import { AUTH } from "../types";

const initialState = {
  loading: false,
  user: {},
  error: {},
};

const authSlice = createSlice({
  name: AUTH,
  initialState,
  reducers: {
    saveUserInfo: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state, action) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { saveUserInfo, logoutUser } = authSlice.actions;

export default authSlice.reducer;
