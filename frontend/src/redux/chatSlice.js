import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
    chatPreviews: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setChatPreviews: (state, action) => {
      state.chatPreviews = action.payload;
    },
  },
});

export const { setOnlineUsers, setMessages, clearMessages, setChatPreviews } = chatSlice.actions;
export default chatSlice.reducer;
