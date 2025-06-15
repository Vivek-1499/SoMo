import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    suggestedUsers: [],
    userProfile: null  // renamed from profilePicture
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {  // renamed from setProfilePicture
      state.userProfile = action.payload;
    }
  }
});

export const { setAuthUser, setSuggestedUsers, setUserProfile } = authSlice.actions;
export default authSlice.reducer;
