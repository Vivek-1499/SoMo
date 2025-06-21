import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: 'chat',
  initialState:{
    onlineUsers:[],
    messages:[]
  },
  reducers:{
    setOnlineUsers:(state, action)=>{
      state.onlineUsers = action.payload
    },
    setMessages:(state, action)=>{
      state.messages = action.payload
    },
    clearMessages: (state) => {
    state.messages = [];
  }
  }
})

export const {setOnlineUsers, setMessages, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;