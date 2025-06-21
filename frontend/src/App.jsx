import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Auth from "./components/Auth";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import {io} from 'socket.io-client'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path:'login',
        element: <Auth/>
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);
function App() {
  const {user} = useSelector(store => store.auth)
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio)
  useEffect(() => {
  if (user) {
    const socketio = io('http://localhost:8000', {
      query: {
        userId: user._id,
      },
      transports: ['websocket'],
    });

    dispatch(setSocket(socketio));

    socketio.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socketio.on('notification', (notification)=>{
      dispatch(setLikeNotification(notification))
    });

    return () => {
      socketio.disconnect();
      dispatch(setSocket(null));
    };
  } else if (socket) {
    socket.disconnect();
    dispatch(setSocket(null));
  }
}, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
