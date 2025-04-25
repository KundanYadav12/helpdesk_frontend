import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  otpVerified: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.otpVerified = false;
    },
  },
});

export const { setUser, setOtpVerified, logout } = userSlice.actions;
export default userSlice.reducer;
