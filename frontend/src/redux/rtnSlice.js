import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    notifications: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type !== 'like') return;
      const notification = {
        ...action.payload,
        type: "like",
        seen: false,
      };
      state.notifications.unshift(notification);
    },
    setCommentNotification: (state, action) => {
      const notification = {
        ...action.payload,
        type: "comment",
        seen: false,
      };
      state.notifications.unshift(notification);
    },
    markNotificationsAsSeen: (state) => {
      if (!Array.isArray(state.notifications)) {
        state.notifications = [];
        return;
      }

      state.notifications = state.notifications.map((notif) => ({
        ...notif,
        seen: true,
      }));
    },
  },
});
export const {
  setLikeNotification,
  setCommentNotification,
  markNotificationsAsSeen,
} = rtnSlice.actions;
export default rtnSlice.reducer;
